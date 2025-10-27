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
      {/* Sticky Header mit Speichern-Button */}
      <div className="sticky top-0 z-10 -mx-6 -mt-6 mb-6 border-b border-neutral-200 bg-white/95 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-neutral-900">Profil bearbeiten</h2>
            <p className="text-sm text-neutral-600 mt-1">
              Aktualisiere deine öffentliche Setcard für Klient:innen
            </p>
          </div>
          <Button type="submit" disabled={status === 'saving' || !isDirty} className="shrink-0">
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

        {/* Status Messages */}
        {status === 'success' && (
          <div className="mt-3">
            <Alert variant="success" title="Erfolgreich gespeichert" description="Deine Änderungen wurden gespeichert." />
          </div>
        )}
        {status === 'error' && errorMessage && (
          <div className="mt-3">
            <Alert variant="danger" title="Fehler beim Speichern" description={errorMessage} />
          </div>
        )}
      </div>

      {/* Öffentliche Darstellung */}
      <section className="rounded-xl border border-neutral-200 bg-white shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center">
            <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Öffentliche Darstellung</h3>
            <p className="text-sm text-neutral-600">Wie du auf deinem Profil erscheinst</p>
          </div>
        </div>
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

      {/* Beschreibung */}
      <section className="rounded-xl border border-neutral-200 bg-white shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Beschreibung & Über mich</h3>
            <p className="text-sm text-neutral-600">Deine Arbeitsweise und Erfahrung</p>
          </div>
        </div>
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

      {/* Angebot & Formate */}
      <section className="rounded-xl border border-neutral-200 bg-white shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Angebot & Spezialisierungen</h3>
            <p className="text-sm text-neutral-600">Deine Leistungen und Schwerpunkte</p>
          </div>
        </div>
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

      {/* Rahmendaten */}
      <section className="rounded-xl border border-neutral-200 bg-white shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
          <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Rahmendaten & Preise</h3>
            <p className="text-sm text-neutral-600">Standort, Preise und Erfahrung</p>
          </div>
        </div>
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

      {/* Zusätzlicher Speichern-Button am Ende (optional für lange Formulare) */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
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
