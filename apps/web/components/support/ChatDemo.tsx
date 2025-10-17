'use client'

import { useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'

const demoMessages = [
  {
    from: 'klarthera',
    text: 'Hallo! Ich bin Klaris, deine erste Ansprechperson. Wobei dürfen wir dich heute unterstützen?',
  },
  {
    from: 'user',
    text: 'Ich bin mir unsicher, ob ich eine Therapie beginnen soll.',
  },
  {
    from: 'klarthera',
    text: 'Das geht vielen so. Wir können mit einer Ersteinschätzung starten und dir verlässliche Optionen zeigen – unverbindlich.',
  },
]

export function ChatDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div
          id="klarthera-chat-demo"
          className="w-80 rounded-2xl border border-divider bg-white/95 p-4 shadow-2xl shadow-primary/20 backdrop-blur"
        >
          <header className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-neutral-900">Klarthera Care-Team</p>
              <p className="text-xs text-muted">Demo-Chat · Reaktionszeit unter 5 Minuten</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-muted transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label="Chat schließen"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="mt-4 space-y-3 text-sm">
            {demoMessages.map((message, index) => (
              <div
                key={`${message.from}-${index}`}
                className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <span
                  className={`max-w-[85%] rounded-2xl px-3 py-2 leading-relaxed ${
                    message.from === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-surface-1 text-neutral-900'
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
            <div className="rounded-xl bg-primary/10 px-3 py-2 text-xs text-primary">
              Dieses Demo zeigt, wie unser Care-Team via Chat Rückfragen beantwortet. In der echten Anwendung sieht man hier
              auch die bisherigen Schritte der Ersteinschätzung.
            </div>
          </div>

          <form
            className="mt-4 flex items-center gap-2 rounded-full border border-divider bg-surface-1 px-3 py-2"
            onSubmit={(event) => {
              event.preventDefault()
              setInputValue('')
            }}
          >
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-muted focus:outline-none"
              placeholder="Schreibe eine Nachricht (Demo)"
            />
            <button
              type="submit"
              className="rounded-full bg-primary p-2 text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              aria-label="Nachricht senden (Demo)"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((state) => !state)}
        className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/35 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        aria-expanded={isOpen}
        aria-controls="klarthera-chat-demo"
      >
        <MessageCircle className="h-4 w-4" />
        {isOpen ? 'Chat schließen' : 'Care-Chat (Demo)'}
      </button>
    </div>
  )
}
