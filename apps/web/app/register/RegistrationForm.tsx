'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button, Input, Textarea } from '@mental-health/ui'

type DemoRole = 'THERAPIST' | 'ORGANISATION' | 'PRIVATE'

type FormState = {
  firstName: string
  lastName: string
  email: string
  role: DemoRole
  company: string
  notes: string
}

const initialState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'THERAPIST',
  company: '',
  notes: '',
}

const roleLabels: Record<DemoRole, string> = {
  THERAPIST: 'Therapeut:in / Praxis',
  ORGANISATION: 'Unternehmen / HR / BGM',
  PRIVATE: 'Privatperson / Angehörige:r',
}

export function RegistrationForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [errorMessage, setErrorMessage] = useState<string>('')

  const demoSummary = useMemo(() => {
    const roleText =
      form.role === 'THERAPIST'
        ? 'Wir schicken dir Zugangsdaten für das Therapeuten-Dashboard inklusive Kursstudio.'
        : form.role === 'ORGANISATION'
        ? 'Du erhältst eine Demo mit Fokus auf Team-Zugänge, Reporting und Employer Branding.'
        : 'Wir zeigen dir die Ersteinschätzung inklusive Empfehlungen und Kursübersicht.'

    return roleText
  }, [form.role])

  const handleChange =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {}

    if (!form.firstName.trim()) {
      nextErrors.firstName = 'Pflichtfeld'
    }
    if (!form.lastName.trim()) {
      nextErrors.lastName = 'Pflichtfeld'
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Bitte eine gültige E-Mail-Adresse angeben'
    }
    if (form.role !== 'THERAPIST' && form.role !== 'ORGANISATION' && form.role !== 'PRIVATE') {
      nextErrors.role = 'Bitte Rolle auswählen'
    }
    if (form.role === 'ORGANISATION' && !form.company.trim()) {
      nextErrors.company = 'Bitte Unternehmensname ergänzen'
    }

    return nextErrors
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('idle')
    setErrorMessage('')

    const validation = validate()
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/demo-request', {
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
      setErrors({})
    } catch (error) {
      console.error('Error submitting demo request:', error)
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <aside className="rounded-3xl border border-divider bg-white/90 p-6 shadow-lg shadow-primary/10 backdrop-blur">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-neutral-900">In drei Schritten zur Demo</h2>
        <p className="text-sm leading-relaxed text-muted">
          Fülle das Formular aus – wir bestätigen den Eingang sofort und melden uns mit den nächsten Schritten.
        </p>
      </header>

      {status === 'success' && (
        <div
          role="status"
          className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" aria-hidden />
          <div>
            <p className="font-semibold">Vielen Dank! Deine Anfrage ist bei uns angekommen.</p>
            <p>
              Wir melden uns werktags innerhalb von 24 Stunden mit Demo-Zugang und abgestimmtem Ablauf. Schau gerne gleich
              in dein Postfach.
            </p>
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
          <label className="space-y-1 text-sm text-neutral-700" htmlFor="firstName">
            <span className="font-medium text-neutral-900">Vorname</span>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={handleChange('firstName')}
              placeholder="Alex"
              hasError={Boolean(errors.firstName)}
              required
            />
            {errors.firstName && <span className="text-xs text-red-600">{errors.firstName}</span>}
          </label>
          <label className="space-y-1 text-sm text-neutral-700" htmlFor="lastName">
            <span className="font-medium text-neutral-900">Nachname</span>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={handleChange('lastName')}
              placeholder="Muster"
              hasError={Boolean(errors.lastName)}
              required
            />
            {errors.lastName && <span className="text-xs text-red-600">{errors.lastName}</span>}
          </label>
        </div>

        <label className="space-y-1 text-sm text-neutral-700" htmlFor="email">
          <span className="font-medium text-neutral-900">E-Mail</span>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="demo@klarthera.at"
            hasError={Boolean(errors.email)}
            required
          />
          {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
        </label>

        <label className="space-y-1 text-sm text-neutral-700" htmlFor="role">
          <span className="font-medium text-neutral-900">Ich interessiere mich als</span>
          <select
            id="role"
            value={form.role}
            onChange={handleChange('role')}
            className="input"
            aria-invalid={Boolean(errors.role) || undefined}
          >
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.role && <span className="text-xs text-red-600">{errors.role}</span>}
        </label>

        {form.role === 'ORGANISATION' && (
          <label className="space-y-1 text-sm text-neutral-700" htmlFor="company">
            <span className="font-medium text-neutral-900">Unternehmen / Organisation</span>
            <Input
              id="company"
              value={form.company}
              onChange={handleChange('company')}
              placeholder="Klarthera GmbH"
              hasError={Boolean(errors.company)}
              required
            />
            {errors.company && <span className="text-xs text-red-600">{errors.company}</span>}
          </label>
        )}

        <label className="space-y-1 text-sm text-neutral-700" htmlFor="notes">
          <div className="flex items-center justify-between">
            <span className="font-medium text-neutral-900">Worauf sollen wir uns vorbereiten?</span>
            <span className="text-xs text-subtle">Optional</span>
          </div>
          <Textarea
            id="notes"
            value={form.notes}
            onChange={handleChange('notes')}
            placeholder="Z. B. Fokus auf Kursinhalte, Employer Branding, Abrechnung …"
            rows={4}
          />
        </label>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary-900">
          {demoSummary}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Wird gesendet …
            </span>
          ) : (
            'Demo anfragen'
          )}
        </Button>

        <p className="text-center text-xs text-subtle">
          Mit dem Absenden bestätigst du, dass wir dich per E-Mail oder Telefon kontaktieren dürfen. Keine Werbung, keine
          Weitergabe deiner Daten.
        </p>
      </form>
    </aside>
  )
}
