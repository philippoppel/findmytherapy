/**
 * Chatbot Engine
 * Regelbasierte Konversationslogik mit empathischen Antworten
 * 🇦🇹 DEUTSCHER CHATBOT FÜR ÖSTERREICH
 *
 * OPTIMIERT:
 * - Nur Deutsch (keine Spracherkennung mehr)
 * - Verbesserte Krisenerkennung mit Negations-, Idiom- und Dritte-Person-Checks
 * - Frühe Assessment-Empfehlung (2-3 Nachrichten)
 * - Wiederholbares Assessment-Angebot
 * - Mehr Response-Varianten gegen Wiederholungen
 */

import type { ChatMessage, ConversationState, KnowledgeReference } from './types'
import {
  KEYWORD_PATTERNS,
  RESPONSE_TEMPLATES,
  GENERAL_RESPONSES,
  NEGATION_WORDS,
  THIRD_PERSON_INDICATORS,
  IDIOMS_AND_PHRASES,
} from './responses'
import { searchKnowledgeBase } from './rag'

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
    .replace(/[.,!?;:]/g, '') // Entfernt Satzzeichen
    .trim()
}

/**
 * Prüft ob der Text eine Redewendung/Idiom enthält
 * Redewendungen sollen NICHT als Krise erkannt werden
 */
function containsIdiom(text: string): boolean {
  const normalized = normalizeText(text)
  return IDIOMS_AND_PHRASES.some((idiom) => normalized.includes(normalizeText(idiom)))
}

/**
 * Prüft ob der Text Negationswörter enthält, die Krisenkeywords aufheben
 * z.B. "Ich will NICHT sterben" sollte keine Krise sein
 */
function hasNegationBeforeKeyword(text: string, keyword: string): boolean {
  const normalized = normalizeText(text)
  const keywordIndex = normalized.indexOf(normalizeText(keyword))

  if (keywordIndex === -1) {
    return false
  }

  // Prüfe die 20 Zeichen vor dem Keyword auf Negationswörter
  const before = normalized.substring(Math.max(0, keywordIndex - 20), keywordIndex)

  return NEGATION_WORDS.some((negation) => before.includes(negation))
}

/**
 * Prüft ob der Text über eine dritte Person spricht (nicht über den User selbst)
 * z.B. "Mein Freund hat Suizidgedanken" sollte anders behandelt werden
 */
function isThirdPerson(text: string): boolean {
  const normalized = normalizeText(text)
  return THIRD_PERSON_INDICATORS.some((indicator) =>
    normalized.includes(normalizeText(indicator))
  )
}

/**
 * Berechnet Levenshtein-Distanz für Fuzzy Matching
 * Verwendet für Tippfehler-Toleranz
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

/**
 * Prüft ob ein Keyword mit Fuzzy Matching im Text vorkommt
 */
function fuzzyMatch(text: string, keyword: string): boolean {
  const normalizedText = normalizeText(text)
  const normalizedKeyword = normalizeText(keyword)

  // Exaktes Match
  if (normalizedText.includes(normalizedKeyword)) {
    return true
  }

  // Fuzzy Match für längere Keywords (>4 Zeichen)
  if (normalizedKeyword.length > 4) {
    const words = normalizedText.split(/\s+/)
    for (const word of words) {
      const distance = levenshteinDistance(word, normalizedKeyword)
      const threshold = Math.floor(normalizedKeyword.length * 0.3) // 30% Tippfehler-Toleranz

      if (distance <= threshold) {
        return true
      }
    }
  }

  return false
}

/**
 * Prüft ob der Text sehr kurz ist (nur Füllwörter wie "ja", "okay", "hmm")
 */
function isVeryShortResponse(text: string): boolean {
  const normalized = normalizeText(text)
  const shortResponses = ['ja', 'nein', 'ok', 'okay', 'hmm', 'mhm', 'aha', 'hm', 'joa', 'naja']

  // Wenn Text nur aus einem dieser Wörter besteht
  return shortResponses.includes(normalized) || normalized.length <= 3
}

/**
 * Erkennung, ob die Eingabe nach konkreten Infos/How-Tos klingt
 */
function looksLikeInformationRequest(text: string): boolean {
  const normalized = normalizeText(text)
  const questionWords = [
    'wie',
    'wo',
    'wann',
    'wer',
    'welche',
    'welcher',
    'welches',
    'wieso',
    'warum',
    'was',
    'ist',
    'kann',
  ]
  const infoPatterns = [
    'kann ich',
    'wie mache',
    'wie geht',
    'wo finde',
    'erklär',
    'erklaer',
    'erkläre',
    'erklaere',
    'erzähl',
    'erzaehl',
    'erzähle',
    'erzahle',
    'mehr ueber',
    'mehr über',
    'details zu',
    'wissenschaftlich',
    'validiert',
  ]

  if (text.trim().endsWith('?')) {
    return true
  }

  if (questionWords.some((word) => normalized.startsWith(word))) {
    return true
  }

  if (infoPatterns.some((pattern) => normalized.includes(pattern))) {
    return true
  }

  return false
}

function buildKnowledgeResponse(
  userInput: string
): { text: string; references: KnowledgeReference[] } | null {
  const hits = searchKnowledgeBase(userInput, 3)
  if (!hits.length) {
    return null
  }

  const references: KnowledgeReference[] = hits.map(({ entry, score }) => ({
    title: entry.title,
    url: entry.url,
    score,
  }))

  const top = hits[0].entry
  const url = top.url.startsWith('http') ? top.url : `${top.url}`
  const sections = [
    `${top.title}: ${top.summary}`,
    top.content,
    `Mehr Infos: ${url}`,
  ]

  return {
    text: sections.filter(Boolean).join('\n\n'),
    references,
  }
}

/**
 * Erkennt Keywords im User-Input mit Fuzzy Matching
 * VERBESSERT: Negations-, Idiom- und Dritte-Person-Checks für Krisenkeywords
 */
export function detectKeywords(userInput: string): string[] {
  const detected: { category: string; priority: number; matches: number }[] = []

  // WICHTIG: Erst Idiom-Check - wenn Redewendung, Krisen-Keywords ignorieren
  const isIdiomText = containsIdiom(userInput)

  // Dritte-Person-Check
  const isAboutOthers = isThirdPerson(userInput)

  for (const pattern of KEYWORD_PATTERNS) {
    const isCrisisCategory = ['crisis', 'self_harm', 'violence_others', 'eating_disorder', 'substance_abuse'].includes(pattern.category)

    const matches = pattern.keywords.filter((keyword) => {
      const hasMatch = fuzzyMatch(userInput, keyword)

      if (!hasMatch) {
        return false
      }

      // Für Krisen-Keywords: Zusätzliche Sicherheitschecks
      if (isCrisisCategory) {
        // Skip wenn es eine Redewendung ist
        if (isIdiomText) {
          return false
        }

        // Skip wenn Negation vor Keyword steht
        if (hasNegationBeforeKeyword(userInput, keyword)) {
          return false
        }

        // Wenn über dritte Person gesprochen wird, nicht als Krise werten
        // ABER: Trotzdem matchen für spätere "Hilfe für Angehörige" Response
        if (isAboutOthers) {
          return false
        }
      }

      return true
    })

    if (pattern.requiresAllKeywords) {
      // Alle Keywords müssen vorkommen
      if (matches.length === pattern.keywords.length) {
        detected.push({
          category: pattern.category,
          priority: pattern.priority,
          matches: matches.length,
        })
      }
    } else {
      // Mindestens ein Keyword muss vorkommen
      if (matches.length > 0) {
        detected.push({
          category: pattern.category,
          priority: pattern.priority,
          matches: matches.length,
        })
      }
    }
  }

  // Sortiere nach Priorität und Anzahl Matches
  return detected
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority
      return b.matches - a.matches
    })
    .map((d) => d.category)
}

/**
 * Bestimmt die Sentiment-Analyse basierend auf erkannten Keywords
 */
function analyzeSentiment(categories: string[]): ChatMessage['metadata']['sentiment'] {
  if (categories.some(c => ['crisis', 'self_harm', 'violence_others', 'eating_disorder', 'substance_abuse'].includes(c))) {
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
 * Wählt eine noch nicht verwendete Response aus
 */
function chooseUnusedResponse(responses: string[], usedResponses: string[]): string {
  const unused = responses.filter((r) => !usedResponses.includes(r))

  // Wenn alle verwendet, zurücksetzen
  if (unused.length === 0) {
    return randomChoice(responses)
  }

  return randomChoice(unused)
}

/**
 * Generiert eine Response basierend auf erkannten Keywords
 * OPTIMIERT: Deutsch-Only, frühe Assessment-Empfehlung, Angehörigen-Hilfe
 */
export function generateResponse(
  userInput: string,
  state: ConversationState
): { response: string; metadata: ChatMessage['metadata']; usedResponse?: string } {
  const detectedCategories = detectKeywords(userInput)
  const sentiment = analyzeSentiment(detectedCategories)
  const userMsgCount = state.userMessageCount

  // Check: Sehr kurze Antwort? (ja, okay, hmm)
  const isShortResponse = isVeryShortResponse(userInput)

  // Check: Dritte Person? (Angehörige suchen Hilfe)
  const isAboutOthers = isThirdPerson(userInput)

  // SPEZIALFALL: Über dritte Person wird gesprochen (Angehörige)
  if (isAboutOthers && detectedCategories.some(c => ['crisis', 'self_harm', 'violence_others', 'eating_disorder', 'substance_abuse', 'depression', 'anxiety'].includes(c))) {
    const response = chooseUnusedResponse(
      GENERAL_RESPONSES.help_for_others,
      state.usedResponses
    )

    return {
      response,
      metadata: {
        suggestedAction: 'contact_support',
        detectedTopics: detectedCategories,
        sentiment: 'concerning',
      },
      usedResponse: response,
    }
  }

  // KRISENFALL - HÖCHSTE PRIORITÄT (SOFORT)
  if (sentiment === 'crisis') {
    // Find template for the specific detected category (prioritize more specific ones)
    const template = RESPONSE_TEMPLATES.find((t) =>
      ['violence_others', 'eating_disorder', 'substance_abuse', 'self_harm', 'crisis'].some(
        cat => detectedCategories.includes(cat) && t.category === cat
      )
    )
    if (template) {
      const response = randomChoice(template.responses)
      const followUp = template.followUp || ''
      const fullResponse = followUp ? `${response}\n\n${followUp}` : response

      return {
        response: fullResponse,
        metadata: {
          suggestedAction: template.suggestedAction,
          detectedTopics: detectedCategories,
          sentiment,
        },
        usedResponse: response,
      }
    }
  }

  // SPEZIALFALL: Sehr kurze Antwort (ja, okay, hmm)
  if (isShortResponse && userMsgCount > 1) {
    const response = chooseUnusedResponse(
      GENERAL_RESPONSES.acknowledgment_short,
      state.usedResponses
    )

    return {
      response,
      metadata: {
        detectedTopics: [],
        sentiment: 'neutral',
      },
      usedResponse: response,
    }
  }

  // INFO-FRAGEN -> Knowledge Base priorisieren
  const infoFriendlyCategories = [
    'assessment_inquiry',
    'therapy_inquiry',
    'help_seeking',
    'help_for_others',
    'work',
    'stress',
    'privacy',
  ]
  const shouldTriggerKnowledgeBase =
    looksLikeInformationRequest(userInput) && !isShortResponse && userInput.length > 6
  const canPrioritizeKnowledge =
    detectedCategories.length === 0 ||
    detectedCategories.every((cat) => infoFriendlyCategories.includes(cat))

  if (shouldTriggerKnowledgeBase && canPrioritizeKnowledge) {
    const knowledge = buildKnowledgeResponse(userInput)

    if (knowledge) {
      return {
        response: knowledge.text,
        metadata: {
          detectedTopics: detectedCategories,
          sentiment: 'neutral',
          references: knowledge.references,
        },
      }
    }
  }

  // KATEGORIEN MIT HOHER PRIORITÄT für Assessment-Empfehlung
  const highPriorityConcerns = ['depression', 'anxiety', 'burnout', 'self_worth', 'loneliness']
  const hasHighPriorityConcern = detectedCategories.some((cat) =>
    highPriorityConcerns.includes(cat)
  )

  // NORMALE RESPONSE basierend auf erkannten Keywords
  if (detectedCategories.length > 0) {
    const mainCategory = detectedCategories[0]
    const template = RESPONSE_TEMPLATES.find((t) => t.category === mainCategory)

    if (template && template.responses && template.responses.length > 0) {
      // Wähle unbenutzte Response
      const response = chooseUnusedResponse(template.responses, state.usedResponses)
      const followUp = template.followUp
      let fullResponse = response
      let suggestedAction = template.suggestedAction

      // Message 1: Nur empathische Response (kein Test-Angebot)
      if (userMsgCount === 1) {
        fullResponse = response
        suggestedAction = undefined
      }
      // Message 2-3: Test anbieten bei HIGH PRIORITY concerns ODER mehreren concerns
      // WICHTIG: Kann mehrmals angeboten werden (nicht nur einmal)
      else if (
        userMsgCount >= 2 &&
        userMsgCount <= 5 &&
        state.assessmentOfferCount < 2 && // Maximal 2x anbieten
        (hasHighPriorityConcern || state.detectedConcerns.length >= 2 || sentiment === 'concerning')
      ) {
        fullResponse = followUp ? `${response}\n\n${followUp}` : response
        suggestedAction = 'take_assessment'
      }
      // Message 6+: Nochmal anbieten wenn immer noch nicht gemacht und Concern besteht
      else if (
        userMsgCount >= 6 &&
        state.assessmentOfferCount < 3 &&
        hasHighPriorityConcern
      ) {
        fullResponse = followUp ? `${response}\n\n${followUp}` : response
        suggestedAction = 'take_assessment'
      }
      // Sonst: Nur Response
      else {
        fullResponse = response
        suggestedAction = undefined
      }

      // Krisenprävention bei concerning Sentiment (sanfter Footer)
      if (sentiment === 'concerning' && !fullResponse.includes('Telefonseelsorge')) {
        const crisisFooter = '\n\n💙 Falls es akut schlimmer wird: Telefonseelsorge 142 (24/7, anonym)'
        fullResponse = fullResponse + crisisFooter
      }

      return {
        response: fullResponse,
        metadata: {
          suggestedAction,
          detectedTopics: detectedCategories,
          sentiment,
        },
        usedResponse: response,
      }
    }
  }

  // KEINE SPEZIFISCHEN KEYWORDS ERKANNT - allgemeine empathische Response
  if (userMsgCount === 1) {
    // Erste Message: Acknowledgment
    const response = chooseUnusedResponse(
      GENERAL_RESPONSES.acknowledgment,
      state.usedResponses
    )

    return {
      response,
      metadata: {
        detectedTopics: [],
        sentiment: 'neutral',
      },
      usedResponse: response,
    }
  } else {
    // Weitere Messages: Nachfragen
    const response = chooseUnusedResponse(
      GENERAL_RESPONSES.unclear,
      state.usedResponses
    )

    return {
      response,
      metadata: {
        detectedTopics: [],
        sentiment: 'neutral',
      },
      usedResponse: response,
    }
  }
}

/**
 * Erstellt eine neue Chatbot-Message
 */
export function createMessage(
  role: 'user' | 'assistant',
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
 * Initialer Conversation State (Deutsch-Only)
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
    assessmentOfferCount: 0,
    detectedConcerns: [],
    usedResponses: [greeting],
    userMessageCount: 0,
  }
}

/**
 * Verarbeitet User-Input und updated den Conversation State
 * OPTIMIERT: Deutsch-Only, verbesserte Krisenerkennung, wiederholbare Assessment-Empfehlung
 */
export function processUserMessage(
  userInput: string,
  currentState: ConversationState
): ConversationState {
  // User-Message Count erhöhen
  const newUserMessageCount = currentState.userMessageCount + 1

  // User-Message hinzufügen
  const userMessage = createMessage('user', userInput)

  // Response generieren (mit neuem Count)
  const updatedState = {
    ...currentState,
    userMessageCount: newUserMessageCount,
  }

  const { response, metadata, usedResponse } = generateResponse(userInput, updatedState)
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

  // Assessment Offer Count erhöhen wenn angeboten
  const assessmentOfferCount =
    metadata?.suggestedAction === 'take_assessment'
      ? currentState.assessmentOfferCount + 1
      : currentState.assessmentOfferCount

  // Response-Memory updaten
  const newUsedResponses = usedResponse
    ? [...currentState.usedResponses, usedResponse]
    : currentState.usedResponses

  return {
    messages: [...currentState.messages, userMessage, assistantMessage],
    currentTopic: metadata?.detectedTopics?.[0],
    conversationStage: newStage,
    hasOfferedAssessment,
    assessmentOfferCount,
    detectedConcerns: newDetectedConcerns,
    usedResponses: newUsedResponses,
    userMessageCount: newUserMessageCount,
  }
}

/**
 * Exportiere Types für externe Verwendung
 */
export type { ChatMessage, ConversationState } from './types'
