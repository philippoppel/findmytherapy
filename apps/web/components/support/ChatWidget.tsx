'use client'

import { useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'

const supportMessages = [
  {
    from: 'findmytherapy',
    text: 'Hallo! Ich bin Klaris, deine erste Ansprechperson. Wobei dürfen wir dich heute unterstützen?',
  },
  {
    from: 'user',
    text: 'Ich bin mir unsicher, ob ich eine Therapie beginnen soll.',
  },
  {
    from: 'findmytherapy',
    text: 'Das geht vielen so. Wir können mit einer Ersteinschätzung starten und dir verlässliche Optionen zeigen – unverbindlich.',
  },
]

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div
          id="findmytherapy-chat-widget"
          className="w-80 rounded-2xl border border-divider bg-white/95 p-4 shadow-2xl shadow-primary/20 backdrop-blur"
        >
          <header className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-default">FindMyTherapy Care-Team</p>
              <p className="text-xs text-muted">Care-Chat · Reaktionszeit unter 5 Minuten</p>
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
            {supportMessages.map((message, index) => (
              <div
                key={`${message.from}-${index}`}
                className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <span
                  className={`max-w-[85%] rounded-2xl px-3 py-2 leading-relaxed ${
                    message.from === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-surface-1 text-default'
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
            <div className="rounded-xl bg-primary/10 px-3 py-2 text-xs text-primary">
              Diese Vorschau zeigt, wie unser Care-Team via Chat Rückfragen beantwortet. In der echten Anwendung siehst du
              außerdem die bisherigen Schritte der Ersteinschätzung.
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
              className="flex-1 bg-transparent text-sm text-default placeholder:text-muted focus:outline-none"
              placeholder="Schreibe eine Nachricht"
            />
            <button
              type="submit"
              className="rounded-full bg-primary p-2 text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              aria-label="Nachricht senden"
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
        aria-controls="findmytherapy-chat-widget"
      >
        <MessageCircle className="h-4 w-4" />
        {isOpen ? 'Chat schließen' : 'Care-Chat'}
      </button>
    </div>
  )
}
