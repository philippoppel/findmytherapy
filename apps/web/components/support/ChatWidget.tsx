'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, X, AlertTriangle, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  createInitialState,
  processUserMessage,
  type ChatMessage,
  type ConversationState,
} from '@/lib/chatbot/engine'

const STORAGE_KEY = 'findmytherapy-chat-state'

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [state, setState] = useState<ConversationState | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Initialisiere State aus localStorage oder erstelle neuen
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Konvertiere Timestamps zurück zu Date-Objekten
        parsed.messages = parsed.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setState(parsed)
      } catch {
        setState(createInitialState())
      }
    } else {
      setState(createInitialState())
    }
  }, [])

  // Speichere State in localStorage
  useEffect(() => {
    if (state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state])

  // Auto-scroll zu neuen Nachrichten
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state?.messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || !state) return

    const userInput = inputValue.trim()
    setInputValue('')
    setIsTyping(true)

    // Kleine Verzögerung für natürlichere Konversation
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500))

    const newState = processUserMessage(userInput, state)
    setState(newState)
    setIsTyping(false)
  }

  const handleActionClick = (action: ChatMessage['metadata']['suggestedAction']) => {
    if (action === 'take_assessment') {
      router.push('/triage')
    } else if (action === 'crisis_resources') {
      // Scroll to crisis resources or show modal
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (action === 'contact_support') {
      router.push('/contact')
    }
  }

  const resetChat = () => {
    const confirmed = confirm(
      'Möchtest du das Gespräch wirklich zurücksetzen? Die bisherige Konversation geht verloren.'
    )
    if (confirmed) {
      localStorage.removeItem(STORAGE_KEY)
      setState(createInitialState())
    }
  }

  if (!state) return null

  const hasUnreadMessages = state.messages.length > 1 && !isOpen
  const latestMessage = state.messages[state.messages.length - 1]
  const isCrisis = latestMessage?.metadata?.sentiment === 'crisis'

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div
          id="findmytherapy-chat-widget"
          className="w-96 max-h-[600px] rounded-2xl border border-divider bg-white/95 shadow-2xl shadow-primary/20 backdrop-blur flex flex-col"
        >
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-divider">
            <div>
              <p className="text-sm font-semibold text-default">FindMyTherapy Support</p>
              <p className="text-xs text-muted">Empathisches Erstgespräch · 100% Datenschutz</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                className="rounded-full p-1 text-muted transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Chat zurücksetzen"
                title="Chat zurücksetzen"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-muted transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Chat schließen"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm min-h-[300px] max-h-[400px]">
            {state.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.metadata?.sentiment === 'crisis'
                        ? 'bg-red-50 text-red-900 border-2 border-red-300'
                        : 'bg-surface-1 text-default'
                  }`}
                >
                  {/* Crisis Icon */}
                  {message.metadata?.sentiment === 'crisis' && message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 text-red-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-xs font-semibold">WICHTIG - Sofortige Hilfe</span>
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="whitespace-pre-line">{message.content}</div>

                  {/* Action Buttons */}
                  {message.metadata?.suggestedAction && message.role === 'assistant' && (
                    <div className="mt-3 pt-3 border-t border-divider/30">
                      {message.metadata.suggestedAction === 'take_assessment' && (
                        <button
                          onClick={() => handleActionClick('take_assessment')}
                          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition"
                        >
                          Zum Test (2-3 Minuten)
                        </button>
                      )}
                      {message.metadata.suggestedAction === 'crisis_resources' && (
                        <div className="space-y-2">
                          <a
                            href="tel:142"
                            className="flex items-center justify-center gap-2 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
                          >
                            <Phone className="h-4 w-4" />
                            Telefonseelsorge: 142
                          </a>
                          <a
                            href="tel:144"
                            className="flex items-center justify-center gap-2 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
                          >
                            <Phone className="h-4 w-4" />
                            Notruf: 144
                          </a>
                        </div>
                      )}
                      {message.metadata.suggestedAction === 'contact_support' && (
                        <button
                          onClick={() => handleActionClick('contact_support')}
                          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition"
                        >
                          Kontakt aufnehmen
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-surface-1 rounded-2xl px-4 py-3 text-default">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Info Banner */}
          <div className="px-4 pb-2">
            <div className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">
              <strong>100% Datenschutz:</strong> Alle Daten bleiben auf deinem Gerät. Keine
              externen Server.
            </div>
          </div>

          {/* Input Form */}
          <form
            className="p-4 border-t border-divider flex items-center gap-2"
            onSubmit={handleSubmit}
          >
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 rounded-full border border-divider bg-surface-1 px-4 py-2 text-sm text-default placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Schreibe eine Nachricht..."
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="rounded-full bg-primary p-2 text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Nachricht senden"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((state) => !state)}
        className={`relative flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          isCrisis && !isOpen
            ? 'bg-red-600 text-white shadow-red-500/50 hover:bg-red-700 animate-pulse'
            : 'bg-primary text-primary-foreground shadow-primary/35 hover:bg-primary-hover'
        }`}
        aria-expanded={isOpen}
        aria-controls="findmytherapy-chat-widget"
      >
        <MessageCircle className="h-4 w-4" />
        {isOpen ? 'Chat schließen' : 'Support-Chat'}

        {/* Unread Badge */}
        {hasUnreadMessages && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            !
          </span>
        )}
      </button>
    </div>
  )
}
