'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Award, Briefcase, Clock, MapPin, ShieldCheck, Star } from 'lucide-react'

import type { TherapistStatus } from '@mental-health/db'
import { Button, cn } from '@mental-health/ui'

const formatOptions = [
  { id: 'online', label: 'Online' },
  { id: 'praesenz', label: 'Vor Ort' },
  { id: 'hybrid', label: 'Hybrid' },
] as const

const statusLabel: Record<TherapistStatus, string> = {
  VERIFIED: 'Pilot (verifiziert)',
  PENDING: 'Pilot (in Prüfung)',
  REJECTED: 'Nicht gelistet',
}

const statusTone: Record<TherapistStatus, string> = {
  VERIFIED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  PENDING: 'bg-amber-100 text-amber-900 border-amber-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
}

export type TherapistCard = {
  name: string
  title: string
  focus: string[]
  approach: string
  location: string
  availability: string
  languages: string[]
  rating: number
  reviews: number
  experience: string
  image: string
  status: TherapistStatus
  formatTags: Array<'online' | 'praesenz' | 'hybrid'>
}

type Props = {
  therapists: TherapistCard[]
}

export function TherapistDirectory({ therapists }: Props) {
  const [focusFilter, setFocusFilter] = useState<string | null>(null)
  const [formatFilter, setFormatFilter] = useState<(typeof formatOptions)[number]['id'] | null>(null)

  const focusOptions = useMemo(() => {
    const values = new Set<string>()
    therapists.forEach((therapist) => therapist.focus.forEach((item) => values.add(item)))
    return Array.from(values).sort((a, b) => a.localeCompare(b, 'de-AT'))
  }, [therapists])

  const filteredTherapists = useMemo(() => {
    return therapists.filter((therapist) => {
      const matchesFocus = focusFilter ? therapist.focus.includes(focusFilter) : true
      const matchesFormat = formatFilter ? therapist.formatTags.includes(formatFilter) : true
      return matchesFocus && matchesFormat
    })
  }, [therapists, focusFilter, formatFilter])

  const hasFilters = Boolean(focusFilter || formatFilter)

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-2xl border border-divider bg-surface-1/95 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Fokus</p>
              <p className="text-sm text-muted">
                Wähle Schwerpunkte, um passende Therapeut:innen angezeigt zu bekommen.
              </p>
            </div>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFocusFilter(null)
                  setFormatFilter(null)
                }}
              >
                Filter zurücksetzen
              </Button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {focusOptions.map((option) => {
              const isActive = focusFilter === option
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFocusFilter(isActive ? null : option)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                      : 'border-divider text-muted hover:border-primary/40 hover:text-primary',
                  )}
                >
                  {option}
                </button>
              )
            })}
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Format</p>
            <div className="flex flex-wrap gap-2">
              {formatOptions.map((option) => {
                const isActive = formatFilter === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFormatFilter(isActive ? null : option.id)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                      isActive
                        ? 'border-secondary-500 bg-secondary-500 text-white shadow-sm shadow-secondary/20'
                        : 'border-divider text-muted hover:border-secondary-400 hover:text-secondary-600',
                    )}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {hasFilters && (
            <p className="mt-4 text-xs text-subtle">
              Aktive Filter: {focusFilter ? `Fokus „${focusFilter}“` : 'kein Fokus'}
              {' · '}
              {formatFilter
                ? `Format „${formatOptions.find((option) => option.id === formatFilter)?.label ?? formatFilter}“`
                : 'alle Formate'}
            </p>
          )}
        </div>
      </div>

      {filteredTherapists.length === 0 ? (
        <div className="rounded-2xl border border-divider bg-surface-1/90 p-10 text-center text-sm text-muted">
          <p>
            Keine Profile gefunden. Passe die Filter an oder kontaktiere das Care-Team für eine individuelle Empfehlung.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredTherapists.map((therapist) => (
            <article
              key={therapist.name}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-divider bg-surface-1/95 shadow-sm shadow-primary/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/15"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-surface-2">
                <Image
                  src={therapist.image}
                  alt={`Portrait von ${therapist.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <span
                  className={cn(
                    'absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold',
                    statusTone[therapist.status],
                  )}
                >
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                  {statusLabel[therapist.status]}
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2">
                      <span className="text-lg font-semibold text-default">{therapist.name}</span>
                      <Award className="h-4 w-4 text-primary" aria-hidden />
                    </div>
                    <p className="text-sm text-muted">{therapist.title}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                      <Star className="h-4 w-4 text-primary" aria-hidden />
                      <span className="font-semibold">{therapist.rating.toFixed(1)}</span>
                      <span className="text-xs text-primary/70">({therapist.reviews} Bewertungen)</span>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full border border-divider px-2.5 py-1 text-xs font-medium text-muted">
                      <Briefcase className="h-3.5 w-3.5 text-primary" aria-hidden />
                      {therapist.experience}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-muted">
                      <MapPin className="mt-0.5 h-4 w-4 flex-none text-primary" />
                      <span>{therapist.location}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted">
                      <Clock className="mt-0.5 h-4 w-4 flex-none text-primary" />
                      <span>{therapist.availability}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Schwerpunkte</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {therapist.focus.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-divider bg-white/60 p-4 text-sm text-muted">
                      <p className="font-medium text-default">Therapieansatz</p>
                      <p className="mt-1 leading-relaxed">{therapist.approach}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-divider pt-4 text-xs text-muted">
                  <span>Sprachen: {therapist.languages.join(', ')}</span>
                  <Button asChild size="sm" variant="link">
                    <Link href="/contact">Profil anfragen</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
