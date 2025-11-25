/**
 * Chatbot Types
 * Regelbasierter Chatbot für empathische Erstgespräche
 * 🇦🇹 Deutscher Chatbot für die österreichische Mental Health Platform
 */

export type MessageRole = 'user' | 'assistant';

export interface KnowledgeReference {
  title: string;
  url: string;
  score?: number;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  metadata?: {
    suggestedAction?: 'take_assessment' | 'contact_support' | 'crisis_resources';
    detectedTopics?: string[];
    sentiment?: 'positive' | 'neutral' | 'concerning' | 'crisis';
    requiresKnowledgeBase?: boolean;
    references?: KnowledgeReference[];
  };
}

export interface ConversationState {
  messages: ChatMessage[];
  currentTopic?: string;
  hasOfferedAssessment: boolean;
  assessmentOfferCount: number; // Wie oft Assessment angeboten wurde (kann mehrmals sein)
  conversationStage: 'greeting' | 'listening' | 'assessment_offer' | 'closing';
  detectedConcerns: string[];
  usedResponses: string[]; // Verhindert Wiederholungen
  userMessageCount: number; // Zählt User-Messages für besseren Flow
  // NEU: Context-Tracking für bessere Follow-Ups
  recentTopics: string[]; // Letzte 5 erkannte Topics für Kontext
  lastUserSentiment?: 'positive' | 'neutral' | 'concerning' | 'crisis'; // Sentiment der letzten User-Nachricht
  concernIntensity?: 'mild' | 'moderate' | 'severe'; // Intensität der Sorgen
}

export interface KeywordPattern {
  keywords: string[];
  category: string;
  priority: number;
  requiresAllKeywords?: boolean;
}

export interface ResponseTemplate {
  category: string;
  responses: string[];
  followUp?: string;
  suggestedAction?: ChatMessage['metadata']['suggestedAction'];
}
