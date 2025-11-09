/**
 * Chatbot Types
 * Regelbasierter Chatbot für empathische Erstgespräche
 */

export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  metadata?: {
    suggestedAction?: 'take_assessment' | 'contact_support' | 'crisis_resources'
    detectedTopics?: string[]
    sentiment?: 'positive' | 'neutral' | 'concerning' | 'crisis'
  }
}

export interface ConversationState {
  messages: ChatMessage[]
  currentTopic?: string
  hasOfferedAssessment: boolean
  conversationStage: 'greeting' | 'listening' | 'assessment_offer' | 'closing'
  detectedConcerns: string[]
}

export interface KeywordPattern {
  keywords: string[]
  category: string
  priority: number
  requiresAllKeywords?: boolean
}

export interface ResponseTemplate {
  category: string
  responses: string[]
  followUp?: string
  suggestedAction?: ChatMessage['metadata']['suggestedAction']
}
