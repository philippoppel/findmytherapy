/**
 * Chatbot Module
 * Regelbasierter, empathischer Chatbot für Mental Health Support
 *
 * Features:
 * - 100% client-side (datenschutzkonform)
 * - Keyword-basierte Themenerkennung
 * - Empathische, validierte Responses
 * - Krisenintervention
 * - Integration mit Triage-Test
 */

export {
  createInitialState,
  processUserMessage,
  generateResponse,
  detectKeywords,
  createMessage,
  type ChatMessage,
  type ConversationState,
} from './engine'

export { KEYWORD_PATTERNS, RESPONSE_TEMPLATES, GENERAL_RESPONSES } from './responses'

export type { KeywordPattern, ResponseTemplate, MessageRole, KnowledgeReference } from './types'
