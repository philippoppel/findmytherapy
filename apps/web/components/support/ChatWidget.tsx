'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, AlertTriangle, Phone, Info, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  createInitialState,
  processUserMessage,
  type ChatMessage,
  type ConversationState,
} from '@/lib/chatbot/engine';

type PersistedMessage = Omit<ChatMessage, 'timestamp'> & { timestamp: string };
type PersistedState = Omit<ConversationState, 'messages'> & {
  messages: PersistedMessage[];
};

const STORAGE_KEY = 'findmytherapy-chat-state';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [state, setState] = useState<ConversationState | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Initialisiere State aus localStorage oder erstelle neuen
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const persisted = JSON.parse(stored) as PersistedState;
        const messages: ChatMessage[] = persisted.messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));

        const migrated: ConversationState = {
          ...persisted,
          messages,
          usedResponses: persisted.usedResponses || [],
          userMessageCount:
            typeof persisted.userMessageCount === 'number'
              ? persisted.userMessageCount
              : messages.filter((m) => m.role === 'user').length,
          assessmentOfferCount: persisted.assessmentOfferCount ?? 0,
          // NEU: Context-Tracking (Migration für bestehende Chats)
          recentTopics: persisted.recentTopics || [],
          lastUserSentiment: persisted.lastUserSentiment,
          concernIntensity: persisted.concernIntensity,
        };

        setState(migrated);
      } catch {
        setState(createInitialState());
      }
    } else {
      setState(createInitialState());
    }
  }, []);

  // Speichere State in localStorage
  useEffect(() => {
    if (state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  // Auto-scroll zu neuen Nachrichten
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !state) return;

    const userInput = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    try {
      // Generiere Response zuerst (ohne State-Update)
      const newState = processUserMessage(userInput, state);
      const lastMessage = newState.messages[newState.messages.length - 1];
      const responseLength = lastMessage?.content?.length || 0;

      // Realistischere Typing-Verzögerung basierend auf Response-Länge
      // Basis: 800ms + 20ms pro Zeichen (simuliert ca. 50 WPM Typing-Speed)
      // Max: 3 Sekunden für sehr lange Responses
      const typingDelay = Math.min(800 + responseLength * 20, 3000);

      await new Promise((resolve) => setTimeout(resolve, typingDelay));

      setState(newState);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: ChatMessage['metadata']['suggestedAction']) => {
    if (action === 'take_assessment') {
      router.push('/triage');
    } else if (action === 'crisis_resources') {
      // Scroll to crisis resources or show modal
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'contact_support') {
      router.push('/contact');
    }
  };

  const resetChat = () => {
    const confirmed = confirm(
      'Möchtest du das Gespräch wirklich zurücksetzen? Die bisherige Konversation geht verloren.',
    );
    if (confirmed) {
      localStorage.removeItem(STORAGE_KEY);
      setState(createInitialState());
    }
  };

  if (!state) return null;

  const hasUnreadMessages = state.messages.length > 1 && !isOpen;
  const latestMessage = state.messages[state.messages.length - 1];
  const isCrisis = latestMessage?.metadata?.sentiment === 'crisis';

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div
          id="findmytherapy-chat-widget"
          className="w-[calc(100vw-2rem)] md:w-96 max-h-[80vh] md:max-h-[600px] rounded-3xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-900/10 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <header className="relative flex items-center justify-between p-4 md:p-5 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-divider">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-success/30 animate-ping"></div>
                </div>
                <div>
                  <p className="text-base font-semibold text-default">Vertraulicher Chat</p>
                  <p className="text-xs text-muted">Immer für dich da · Vollständig vertraulich</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowInfoPanel(!showInfoPanel)}
                className={`rounded-xl p-2 text-muted transition-all hover:text-info hover:bg-info/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${showInfoPanel ? 'bg-info/10 text-info' : ''}`}
                aria-label="Info anzeigen"
                title="Datenschutz & Funktionsweise"
              >
                <Info className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={resetChat}
                className="rounded-xl p-2 text-muted transition-all hover:text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label="Chat zurücksetzen"
                title="Chat zurücksetzen"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                className="rounded-xl p-2 text-muted transition-all hover:text-danger hover:bg-danger/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label="Chat schließen"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 text-sm min-h-[300px] max-h-[50vh] md:max-h-[400px] bg-gradient-to-b from-surface-1 to-white">
            {state.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-primary-600 text-primary-foreground'
                      : message.metadata?.sentiment === 'crisis'
                        ? 'bg-gradient-to-br from-danger-50 to-danger-100 text-danger-900 border-2 border-danger-300 shadow-danger-200'
                        : 'bg-white border border-neutral-200 text-default'
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
                    <div className="mt-3 pt-3 border-t border-neutral-200">
                      {message.metadata.suggestedAction === 'take_assessment' && (
                        <button
                          onClick={() => handleActionClick('take_assessment')}
                          className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-600 px-5 py-3.5 text-sm font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          ✓ Ersteinschätzung starten (2 Min.)
                        </button>
                      )}
                      {message.metadata.suggestedAction === 'crisis_resources' && (
                        <div className="space-y-2.5">
                          <a
                            href="tel:142"
                            className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-danger to-danger-700 px-5 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-danger/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <Phone className="h-4 w-4" />
                            Telefonseelsorge: 142
                          </a>
                          <a
                            href="tel:144"
                            className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-danger to-danger-700 px-5 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-danger/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <Phone className="h-4 w-4" />
                            Notruf: 144
                          </a>
                        </div>
                      )}
                      {message.metadata.suggestedAction === 'contact_support' && (
                        <button
                          onClick={() => handleActionClick('contact_support')}
                          className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-600 px-5 py-3 text-sm font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Kontakt aufnehmen
                        </button>
                      )}
                    </div>
                  )}

                  {message.metadata?.references && message.metadata.references.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-neutral-200 space-y-2">
                      <p className="text-xs font-semibold text-muted tracking-wide uppercase">
                        Weiterlesen:
                      </p>
                      {message.metadata.references.map((reference) => (
                        <a
                          key={`${message.id}-${reference.url}`}
                          href={reference.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between rounded-xl bg-primary/5 border border-primary/20 px-4 py-2.5 text-xs font-medium text-primary transition-all hover:bg-primary/10 hover:border-primary/30 hover:shadow-sm"
                        >
                          <span>{reference.title}</span>
                          <span className="text-muted">
                            {reference.url.startsWith('http')
                              ? reference.url
                              : reference.url.replace(/^\//, '/')}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary/70 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Info Panel */}
          {showInfoPanel && (
            <div className="border-t border-divider bg-gradient-to-br from-info-50 to-primary-50 p-4 md:p-5">
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-default mb-1">100% Datenschutz garantiert</h3>
                    <p className="text-muted leading-relaxed">
                      Alle deine Nachrichten werden <strong>ausschließlich lokal</strong> in deinem
                      Browser gespeichert. Es werden <strong>keine personenbezogenen Daten</strong>{' '}
                      an Server übertragen oder in einer Datenbank gespeichert. Wenn du den Chat
                      zurücksetzt oder deinen Browser-Cache löschst, sind alle Daten unwiderruflich
                      gelöscht.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-info mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-default mb-1">
                      Wie funktioniert dieser Chat?
                    </h3>
                    <p className="text-muted leading-relaxed">
                      Dies ist ein <strong>regelbasiertes Support-Tool</strong> (keine künstliche
                      Intelligenz). Ich erkenne Schlüsselwörter in deinen Nachrichten und antworte
                      nach vordefinierten Mustern. Deshalb können meine Antworten manchmal unpassend
                      oder generisch wirken – das ist völlig normal für diese Technologie.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-default mb-1">Was ist der Zweck?</h3>
                    <p className="text-muted leading-relaxed">
                      Mein Ziel ist es, dir <strong>erste Orientierung</strong> zu geben und dich an
                      die richtigen Ressourcen weiterzuleiten:
                    </p>
                    <ul className="mt-2 space-y-1 text-muted">
                      <li>• Ersteinschätzung deiner Situation</li>
                      <li>• Empfehlung von passenden Therapeuten</li>
                      <li>• Krisenintervention bei akuten Notfällen</li>
                      <li>• Verlinkung zu hilfreichen Ressourcen</li>
                    </ul>
                    <p className="text-muted leading-relaxed mt-2">
                      Bei wichtigen Anliegen empfehle ich dir, die{' '}
                      <strong>Ersteinschätzung zu machen</strong> oder unser{' '}
                      <strong>Care-Team zu kontaktieren</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Input Form */}
          <form
            className="p-4 md:p-5 border-t border-divider bg-gradient-to-r from-surface-1/50 to-transparent flex items-center gap-3"
            onSubmit={handleSubmit}
          >
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm text-default placeholder:text-muted shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50"
              placeholder="Schreibe eine Nachricht..."
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="rounded-2xl bg-gradient-to-br from-primary to-primary-600 p-3 text-primary-foreground shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Nachricht senden"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((state) => !state)}
        className={`group relative flex items-center gap-2.5 rounded-full px-5 md:px-6 py-3 md:py-3.5 text-sm font-semibold shadow-xl transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          isCrisis && !isOpen
            ? 'bg-gradient-to-br from-danger to-danger-700 text-white shadow-danger/50 hover:shadow-danger/60 animate-pulse'
            : 'bg-gradient-to-br from-primary to-primary-600 text-primary-foreground shadow-primary/40 hover:shadow-primary/50'
        }`}
        aria-expanded={isOpen}
        aria-controls="findmytherapy-chat-widget"
      >
        <MessageCircle className="h-5 w-5 md:h-5 md:w-5 transition-transform group-hover:rotate-12" />
        <span className="hidden sm:inline">{isOpen ? 'Schließen' : "Wie geht's dir?"}</span>
        <span className="sm:hidden">{isOpen ? '✕' : 'Chat'}</span>

        {/* Unread Badge */}
        {hasUnreadMessages && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-xs font-bold text-white shadow-lg animate-bounce">
            !
          </span>
        )}
      </button>
    </div>
  );
}
