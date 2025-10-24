'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Button, FormField, Input, Textarea } from '@mental-health/ui'
import { Loader2 } from 'lucide-react'
import { setcardPayloadSchema, splitToList, parseCurrencyInput, formatCurrencyInput } from '../../../lib/therapist/setcard'
import type { SetcardPayload } from '../../../lib/therapist/setcard'

type SetcardFormValues = {
  displayName: string
  title: string
  headline: string
  profileImageUrl: string
  videoUrl: string
  acceptingClients: boolean
  online: boolean
  services: string
  specialties: string
  modalities: string
  languages: string
  approachSummary: string
  experienceSummary: string
  responseTime: string
  availabilityNote: string
  pricingNote: string
  about: string
  city: string
  country: string
  priceMin: string
  priceMax: string
  yearsExperience: string
}

type SetcardEditorProps = {
  initialValues: SetcardFormValues
  onSuccessfulUpdate?: (payload: SetcardPayload) => void
}

const toPayload = (values: SetcardFormValues): SetcardPayload => {
  const services = splitToList(values.services)
  const specialties = splitToList(values.specialties)
  const modalities = splitToList(values.modalities)
  const languages = splitToList(values.languages)
  const parsedYears = values.yearsExperience ? Number.parseInt(values.yearsExperience, 10) : NaN

  return {
    displayName: values.displayName.trim(),
    title: values.title.trim(),
    headline: values.headline.trim(),
    approachSummary: values.approachSummary.trim(),
    experienceSummary: values.experienceSummary.trim(),
    services,
    profileImageUrl: values.profileImageUrl ? values.profileImageUrl.trim() : null,
    videoUrl: values.videoUrl ? values.videoUrl.trim() : null,
    acceptingClients: values.acceptingClients,
    yearsExperience: Number.isNaN(parsedYears) ? null : parsedYears,
    responseTime: values.responseTime ? values.responseTime.trim() : null,
    modalities,
    specialties,
    languages,
    priceMin: parseCurrencyInput(values.priceMin),
    priceMax: parseCurrencyInput(values.priceMax),
    availabilityNote: values.availabilityNote ? values.availabilityNote.trim() : null,
    pricingNote: values.pricingNote ? values.pricingNote.trim() : null,
    about: values.about ? values.about.trim() : null,
    city: values.city ? values.city.trim() : null,
    country: values.country ? values.country.trim().toUpperCase() : null,
    online: values.online,
  }
}

const mapPayloadToFormValues = (payload: SetcardPayload): SetcardFormValues => ({
  displayName: payload.displayName,
  title: payload.title,
  headline: payload.headline,
  profileImageUrl: payload.profileImageUrl ?? '',
  videoUrl: payload.videoUrl ?? '',
  acceptingClients: payload.acceptingClients,
  online: payload.online,
  services: payload.services.join('\n'),
  specialties: payload.specialties.join('\n'),
  modalities: payload.modalities.join('\n'),
  languages: payload.languages.join('\n'),
  approachSummary: payload.approachSummary,
  experienceSummary: payload.experienceSummary,
  responseTime: payload.responseTime ?? '',
  availabilityNote: payload.availabilityNote ?? '',
  pricingNote: payload.pricingNote ?? '',
  about: payload.about ?? '',
  city: payload.city ?? '',
  country: payload.country ?? '',
  priceMin: formatCurrencyInput(payload.priceMin),
  priceMax: formatCurrencyInput(payload.priceMax),
  yearsExperience: typeof payload.yearsExperience === 'number' ? String(payload.yearsExperience) : '',
})

export function SetcardEditor({ initialValues, onSuccessfulUpdate }: SetcardEditorProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
    setError,
    clearErrors,
  } = useForm<SetcardFormValues>({
    defaultValues: initialValues,
  })

  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleFormSubmit = async (values: SetcardFormValues) => {
    clearErrors()
    setErrorMessage(null)

    const payload = toPayload(values)
    const validation = setcardPayloadSchema.safeParse(payload)

    if (!validation.success) {
      setStatus('error')
      const firstIssue = validation.error.issues[0]
      if (firstIssue?.path?.length) {
        const field = firstIssue.path[0]
        if (typeof field === 'string') {
          setError(field as keyof SetcardFormValues, {
            type: 'manual',
            message: firstIssue.message,
          })
        }
      }
      setErrorMessage('Bitte überprüfe deine Eingaben und versuche es erneut.')
      return
    }

    try {
      setStatus('saving')
      const response = await fetch('/api/therapist/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validation.data),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setStatus('error')
        setErrorMessage(result.message ?? 'Die Setcard konnte nicht gespeichert werden.')
        return
      }

      const updatedFormValues = mapPayloadToFormValues(validation.data)
      reset(updatedFormValues)
      setStatus('success')

      if (onSuccessfulUpdate) {
        onSuccessfulUpdate(validation.data)
      }
    } catch (error) {
      console.error('Failed to update setcard', error)
      setStatus('error')
      setErrorMessage('Beim Speichern ist ein Fehler aufgetreten.')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-neutral-950">Setcard bearbeiten</h2>
        <p className="text-sm text-muted">
          Aktualisiere, was Klient:innen auf deiner Profilseite sehen. Speichere Änderungen, sobald du zufrieden bist.
        </p>
        {status === 'success' ? (
          <Alert variant="success" title="Änderungen gespeichert" description="Deine Setcard wurde aktualisiert." />
        ) : null}
        {status === 'error' && errorMessage ? (
          <Alert variant="danger" title="Speichern fehlgeschlagen" description={errorMessage} />
        ) : null}
      </div>

      <section className="rounded-xl border border-divider bg-white p-6 space-y-4">
        <h3 className="text-base font-semibold text-neutral-900">Öffentliche Darstellung</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField id="displayName" label="Angezeigter Name" required>
            <Input {...register('displayName')} placeholder="z. B. Dr.in Lena Huber" />
          </FormField>
          <FormField id="title" label="Titel" required>
            <Input {...register('title')} placeholder="z. B. Klinische Psychologin & Gesundheitspsychologin" />
          </FormField>
          <FormField id="headline" label="Headline" required helperText="Kurzer Satz, der deinen Schwerpunkt zusammenfasst.">
            <Input {...register('headline')} placeholder="z. B. Ressourcen aktivieren und neue Stabilität finden" />
          </FormField>
          <FormField
            id="profileImageUrl"
            label="Profilbild URL"
            helperText="Erlaubt sind volle URLs oder relative Pfade."
          >
            <Input {...register('profileImageUrl')} placeholder="/images/therapeut:innen/mein-bild.jpg" />
          </FormField>
          <FormField id="videoUrl" label="Vorstellungsvideo (optional)" helperText="YouTube- oder Vimeo-Link.">
            <Input {...register('videoUrl')} placeholder="https://www.youtube.com/watch?v=..." />
          </FormField>
          <FormField id="responseTime" label="Antwortzeit" helperText="z. B. Antwort innerhalb von 24 Stunden.">
            <Input {...register('responseTime')} placeholder="Antwort innerhalb von 24 Stunden" />
          </FormField>
        </div>
      </section>

      <section className="rounded-xl border border-divider bg-white p-6 space-y-4">
        <h3 className="text-base font-semibold text-neutral-900">Beschreibung</h3>
        <FormField
          id="approachSummary"
          label="Therapeutischer Ansatz"
          required
          helperText="Was erwartet Klient:innen in der Zusammenarbeit?"
        >
          <Textarea rows={4} {...register('approachSummary')} />
        </FormField>
        <FormField
          id="experienceSummary"
          label="Erfahrung & Zielgruppen"
          required
          helperText="Fasse relevante Erfahrungen und Zielgruppen zusammen."
        >
          <Textarea rows={3} {...register('experienceSummary')} />
        </FormField>
        <FormField id="about" label="Über mich (optional)">
          <Textarea rows={5} {...register('about')} />
        </FormField>
      </section>

      <section className="rounded-xl border border-divider bg-white p-6 space-y-4">
        <h3 className="text-base font-semibold text-neutral-900">Angebot & Formate</h3>
        <FormField
          id="services"
          label="Leistungen"
          required
          helperText="Eine Leistung pro Zeile, z. B. Einzeltherapie, Online-Sitzung."
        >
          <Textarea rows={3} {...register('services')} />
        </FormField>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField id="specialties" label="Schwerpunkte" required helperText="Eine Spezialisierung pro Zeile.">
            <Textarea rows={3} {...register('specialties')} />
          </FormField>
          <FormField id="modalities" label="Modalitäten" required helperText="z. B. Verhaltenstherapie, Achtsamkeit.">
            <Textarea rows={3} {...register('modalities')} />
          </FormField>
        </div>
        <FormField id="languages" label="Sprachen" required helperText="Eine Sprache pro Zeile.">
          <Textarea rows={2} {...register('languages')} />
        </FormField>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField id="availabilityNote" label="Verfügbarkeit">
            <Textarea rows={2} {...register('availabilityNote')} />
          </FormField>
          <FormField id="pricingNote" label="Hinweis zu Preisen/Konditionen">
            <Textarea rows={2} {...register('pricingNote')} />
          </FormField>
        </div>
      </section>

      <section className="rounded-xl border border-divider bg-white p-6 space-y-4">
        <h3 className="text-base font-semibold text-neutral-900">Rahmendaten</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField id="city" label="Praxisort">
            <Input {...register('city')} placeholder="z. B. Wien" />
          </FormField>
          <FormField id="country" label="Land" helperText="Zweibuchstabiger Code, z. B. AT.">
            <Input {...register('country')} placeholder="AT" />
          </FormField>
          <FormField id="priceMin" label="Preis Minimum (€)">
            <Input type="number" step="1" min="0" {...register('priceMin')} placeholder="80" />
          </FormField>
          <FormField id="priceMax" label="Preis Maximum (€)">
            <Input type="number" step="1" min="0" {...register('priceMax')} placeholder="120" />
          </FormField>
          <FormField id="yearsExperience" label="Jahre Erfahrung">
            <Input type="number" min="0" max="60" {...register('yearsExperience')} placeholder="8" />
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-lg border border-divider bg-surface-1 px-4 py-3 text-sm font-medium text-default">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-divider text-primary focus:ring-primary"
              {...register('acceptingClients')}
            />
            Nimmt neue Klient:innen an
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-divider bg-surface-1 px-4 py-3 text-sm font-medium text-default">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-divider text-primary focus:ring-primary"
              {...register('online')}
            />
            Bietet Online-Termine an
          </label>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={status === 'saving' || !isDirty}>
          {status === 'saving' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              Speichern...
            </>
          ) : (
            'Änderungen speichern'
          )}
        </Button>
      </div>
    </form>
  )
}

export type { SetcardFormValues }
