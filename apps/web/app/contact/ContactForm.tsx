'use client'

import { useState } from 'react'
import { CalendarPlus, CheckCircle2, Loader2, PhoneCall } from 'lucide-react'
import { Button, Input, Textarea } from '@mental-health/ui'

type Topic = 'orientation' | 'matching' | 'corporate' | 'support'

type FormState = {
  name: string
  email: string
  phone: string
  topic: Topic
  message: string
  preferredSlot: string
}

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  topic: 'orientation',
  message: '',
  preferredSlot: 'morning',
}

export function ContactForm() {
  const [form, setForm] = useState(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const handleSelectChange = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Ein Fehler ist aufgetreten')
      }

      setStatus('success')
      setForm(initialState)
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-3xl border border-divider bg-white/90 p-8 shadow-lg shadow-primary/10 backdrop-blur">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          <PhoneCall className="h-4 w-4" aria-hidden />
          Kontakt aufnehmen
        </div>
        <h2 className="text-2xl font-semibold text-default">Nachricht an das Care-Team</h2>
        <p className="text-sm text-muted">
          Sende uns dein Anliegen – wir melden uns werktags innerhalb von 45 Minuten mit einer persönlichen Antwort oder einem Terminvorschlag.
        </p>
      </header>

      {status === 'success' && (
        <div
          role="status"
          className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" aria-hidden />
          <div>
            <p className="font-semibold">Vielen Dank! Deine Nachricht ist eingegangen.</p>
            <p>Das Care-Team meldet sich telefonisch oder per E-Mail, je nachdem, welche Kontaktmöglichkeit du angegeben hast.</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <div className="mt-0.5 h-5 w-5 flex-none rounded-full border-2 border-red-600 flex items-center justify-center text-red-600 font-bold" aria-hidden>!</div>
          <div>
            <p className="font-semibold">Fehler beim Senden</p>
            <p>{errorMessage || 'Bitte versuche es später erneut oder kontaktiere uns direkt.'}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm text-neutral-700" htmlFor="name">
            <span className="font-medium text-default">Name</span>
            <Input
              id="name"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="Alex Beispiel"
              required
            />
          </label>
          <label className="space-y-1 text-sm text-neutral-700" htmlFor="email">
            <span className="font-medium text-default">E-Mail</span>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="kontakt@beispiel.at"
              required
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_0.65fr]">
          <label className="space-y-1 text-sm text-neutral-700" htmlFor="phone">
            <span className="font-medium text-default">Telefon (optional)</span>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="+43 660 0000000"
            />
          </label>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-default">Wann passt es dir für einen Rückruf?</legend>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { value: 'morning', label: 'Vormittag' },
                { value: 'afternoon', label: 'Nachmittag' },
                { value: 'evening', label: 'Abends' },
                { value: 'flexible', label: 'Flexibel' },
              ].map((slot) => {
                const isActive = form.preferredSlot === slot.value
                return (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => handleSelectChange('preferredSlot')(slot.value)}
                    className={`rounded-full border px-3 py-2 font-semibold transition ${
                      isActive
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-divider text-muted hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    {slot.label}
                  </button>
                )
              })}
            </div>
          </fieldset>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-default">Anliegen</legend>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              { value: 'orientation', label: 'Ersteinschätzung & Einstieg' },
              { value: 'matching', label: 'Therapeut:innen-Matching' },
              { value: 'corporate', label: 'Unternehmen & Teams' },
              { value: 'support', label: 'Technische Unterstützung' },
            ].map((topic) => {
              const isActive = form.topic === topic.value
              return (
                <button
                  key={topic.value}
                  type="button"
                  onClick={() => handleSelectChange('topic')(topic.value)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    isActive
                      ? 'border-primary bg-primary/10 text-primary shadow-sm shadow-primary/10'
                      : 'border-divider text-muted hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {topic.label}
                </button>
              )
            })}
          </div>
        </fieldset>

        <label className="space-y-1 text-sm text-neutral-700" htmlFor="message">
          <span className="font-medium text-default">Nachricht oder Fragen</span>
          <Textarea
            id="message"
            value={form.message}
            onChange={handleChange('message')}
            rows={5}
            placeholder="Erzähl uns kurz, worum es geht oder welche Schwerpunkte wir vorbereiten sollen."
            required
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button type="submit" className="inline-flex items-center gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Wird gesendet …
              </>
            ) : (
              <>
                Abschicken
                <CalendarPlus className="h-4 w-4" aria-hidden />
              </>
            )}
          </Button>
          <p className="text-xs text-subtle">
            Deine Anfrage bleibt vertraulich. Im Livebetrieb erfolgt die Antwort innerhalb von 45 Minuten.
          </p>
        </div>
      </form>
    </div>
  )
}
