/**
 * Chatbot Engine
 * Regelbasierte Konversationslogik mit empathischen Antworten
 */

import type { ChatMessage, ConversationState } from './types'
import { KEYWORD_PATTERNS, RESPONSE_TEMPLATES, GENERAL_RESPONSES } from './responses'

/**
 * Generiert eine zufällige ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Wählt zufällig ein Element aus einem Array
 */
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Normalisiert Text für Keyword-Matching
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Entfernt Diakritika
    .trim()
}

/**
 * Erkennt Keywords im User-Input
 */
export function detectKeywords(userInput: string): string[] {
  const normalized = normalizeText(userInput)
  const detected: { category: string; priority: number }[] = []

  for (const pattern of KEYWORD_PATTERNS) {
    const matches = pattern.keywords.filter((keyword) => normalized.includes(normalizeText(keyword)))

    if (pattern.requiresAllKeywords) {
      // Alle Keywords müssen vorkommen
      if (matches.length === pattern.keywords.length) {
        detected.push({ category: pattern.category, priority: pattern.priority })
      }
    } else {
      // Mindestens ein Keyword muss vorkommen
      if (matches.length > 0) {
        detected.push({ category: pattern.category, priority: pattern.priority })
      }
    }
  }

  // Sortiere nach Priorität und gib Kategorien zurück
  return detected.sort((a, b) => b.priority - a.priority).map((d) => d.category)
}

/**
 * Bestimmt die Sentiment-Analyse basierend auf erkannten Keywords
 */
function analyzeSentiment(categories: string[]): ChatMessage['metadata']['sentiment'] {
  if (categories.includes('crisis') || categories.includes('self_harm')) {
    return 'crisis'
  }
  if (
    categories.some((c) =>
      ['depression', 'anxiety', 'burnout', 'self_worth', 'loneliness'].includes(c)
    )
  ) {
    return 'concerning'
  }
  if (categories.some((c) => ['help_seeking', 'therapy_inquiry'].includes(c))) {
    return 'positive'
  }
  return 'neutral'
}

/**
 * Generiert eine Response basierend auf erkannten Keywords
 */
export function generateResponse(
  userInput: string,
  state: ConversationState
): { response: string; metadata: ChatMessage['metadata'] } {
  const detectedCategories = detectKeywords(userInput)
  const sentiment = analyzeSentiment(detectedCategories)

  // Krisenfall - höchste Priorität
  if (sentiment === 'crisis') {
    const template = RESPONSE_TEMPLATES.find((t) =>
      ['crisis', 'self_harm'].includes(t.category)
    )
    if (template) {
      const response = randomChoice(template.responses)
      const fullResponse = template.followUp
        ? `${response}\n\n${template.followUp}`
        : response

      return {
        response: fullResponse,
        metadata: {
          suggestedAction: template.suggestedAction,
          detectedTopics: detectedCategories,
          sentiment,
        },
      }
    }
  }

  // Wenn bereits mehrere Concerns erkannt wurden und noch kein Assessment angeboten
  if (state.detectedConcerns.length >= 2 && !state.hasOfferedAssessment) {
    const mainCategory = detectedCategories[0]
    const template = RESPONSE_TEMPLATES.find((t) => t.category === mainCategory)

    if (template) {
      const response = randomChoice(template.responses)
      const assessmentIntro = randomChoice(GENERAL_RESPONSES.assessment_intro)
      const fullResponse = template.followUp
        ? `${response}\n\n${template.followUp}\n\n${assessmentIntro}`
        : `${response}\n\n${assessmentIntro}`

      return {
        response: fullResponse,
        metadata: {
          suggestedAction: 'take_assessment',
          detectedTopics: detectedCategories,
          sentiment,
        },
      }
    }
  }

  // Normale Response basierend auf erkannten Keywords
  if (detectedCategories.length > 0) {
    const mainCategory = detectedCategories[0]
    const template = RESPONSE_TEMPLATES.find((t) => t.category === mainCategory)

    if (template) {
      const response = randomChoice(template.responses)
      let fullResponse = response

      // Nach 2-3 Nachrichten: Follow-up mit Test-Angebot hinzufügen
      if (state.messages.filter((m) => m.role === 'user').length >= 2 && template.followUp) {
        fullResponse = `${response}\n\n${template.followUp}`
      }

      return {
        response: fullResponse,
        metadata: {
          suggestedAction: template.suggestedAction,
          detectedTopics: detectedCategories,
          sentiment,
        },
      }
    }
  }

  // Keine spezifischen Keywords erkannt - allgemeine empathische Response
  const acknowledgment = randomChoice(GENERAL_RESPONSES.acknowledgment)
  const followUp = randomChoice(GENERAL_RESPONSES.unclear)

  return {
    response: `${acknowledgment} ${followUp}`,
    metadata: {
      detectedTopics: [],
      sentiment: 'neutral',
    },
  }
}

/**
 * Erstellt eine neue Chatbot-Message
 */
export function createMessage(
  role: MessageRole,
  content: string,
  metadata?: ChatMessage['metadata']
): ChatMessage {
  return {
    id: generateId(),
    role,
    content,
    timestamp: new Date(),
    metadata,
  }
}

/**
 * Initialer Conversation State
 */
export function createInitialState(): ConversationState {
  const greeting = randomChoice(GENERAL_RESPONSES.greeting)

  return {
    messages: [
      createMessage('assistant', greeting, {
        detectedTopics: [],
        sentiment: 'neutral',
      }),
    ],
    conversationStage: 'greeting',
    hasOfferedAssessment: false,
    detectedConcerns: [],
  }
}

/**
 * Verarbeitet User-Input und updated den Conversation State
 */
export function processUserMessage(
  userInput: string,
  currentState: ConversationState
): ConversationState {
  // User-Message hinzufügen
  const userMessage = createMessage('user', userInput)

  // Response generieren
  const { response, metadata } = generateResponse(userInput, currentState)
  const assistantMessage = createMessage('assistant', response, metadata)

  // State updaten
  const newDetectedConcerns = [
    ...new Set([...currentState.detectedConcerns, ...(metadata?.detectedTopics || [])]),
  ]

  const newStage: ConversationState['conversationStage'] =
    metadata?.suggestedAction === 'take_assessment'
      ? 'assessment_offer'
      : currentState.conversationStage === 'greeting'
        ? 'listening'
        : currentState.conversationStage

  const hasOfferedAssessment =
    currentState.hasOfferedAssessment || metadata?.suggestedAction === 'take_assessment'

  return {
    messages: [...currentState.messages, userMessage, assistantMessage],
    currentTopic: metadata?.detectedTopics?.[0],
    conversationStage: newStage,
    hasOfferedAssessment,
    detectedConcerns: newDetectedConcerns,
  }
}

/**
 * Exportiere Types für externe Verwendung
 */
export type { ChatMessage, ConversationState } from './types'
