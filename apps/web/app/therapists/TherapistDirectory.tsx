'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Clock, MapPin, ShieldCheck, Sparkles, Star } from 'lucide-react'

import type { TherapistStatus } from '@/lib/prisma'
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
  id: string
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
  const [mounted, setMounted] = useState(false)

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

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-400">Fokus</p>
              <p className="text-sm text-white/70">
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
                className="text-white hover:bg-white/10"
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
                    'rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2',
                    isActive
                      ? 'border-teal-400 bg-teal-400 text-white shadow-sm'
                      : 'border-white/30 text-white/70 hover:border-teal-400/40 hover:text-white hover:bg-white/10',
                  )}
                >
                  {option}
                </button>
              )
            })}
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-400">Format</p>
            <div className="flex flex-wrap gap-2">
              {formatOptions.map((option) => {
                const isActive = formatFilter === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFormatFilter(isActive ? null : option.id)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2',
                      isActive
                        ? 'border-teal-400 bg-teal-400 text-white shadow-sm'
                        : 'border-white/30 text-white/70 hover:border-teal-400/40 hover:text-white hover:bg-white/10',
                    )}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {hasFilters && (
            <p className="mt-4 text-xs text-white/60">
              Aktive Filter: {focusFilter ? `Fokus „${focusFilter}"` : 'kein Fokus'}
              {' · '}
              {formatFilter
                ? `Format „${formatOptions.find((option) => option.id === formatFilter)?.label ?? formatFilter}"`
                : 'alle Formate'}
            </p>
          )}
        </div>
      </div>

      {filteredTherapists.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-white/70 backdrop-blur">
          <p>
            Keine Profile gefunden. Passe die Filter an oder kontaktiere das Care-Team für eine individuelle Empfehlung.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredTherapists.map((therapist) => (
            <DirectoryCard key={therapist.id} therapist={therapist} />
          ))}
        </div>
      )}
    </>
  )
}

function DirectoryCard({ therapist }: { therapist: TherapistCard }) {
  const highlightChips = [
    therapist.focus[0],
    therapist.focus[1],
    therapist.availability,
    therapist.languages.slice(0, 2).join(', '),
  ].filter(Boolean) as string[]

  return (
    <Link href={`/therapists/${therapist.id}`} prefetch={false}>
      <article className="group grid gap-5 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
          <div className="relative h-32 w-32 overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-inner md:h-36 md:w-36">
            <Image
              src={therapist.image}
              alt={`Portrait von ${therapist.name}`}
              width={240}
              height={240}
              className="h-full w-full object-cover object-center"
              sizes="(max-width: 768px) 160px, 192px"
              quality={95}
            />
            <span
              className={cn(
                'absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide',
                therapist.status === 'VERIFIED' ? 'border-emerald-400/50 bg-emerald-400/20 text-emerald-200' :
                therapist.status === 'PENDING' ? 'border-amber-400/50 bg-amber-400/20 text-amber-200' :
                'border-red-400/50 bg-red-400/20 text-red-200',
              )}
            >
              <ShieldCheck className="h-3 w-3" aria-hidden />
              {statusLabel[therapist.status]}
            </span>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <header className="space-y-1">
              <h3 className="text-xl font-semibold text-white">{therapist.name}</h3>
              <p className="text-sm text-white/70">{therapist.title}</p>
            </header>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/70 md:justify-start">
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-400/20 px-3 py-1 font-semibold text-teal-300">
              <Star className="h-3.5 w-3.5" aria-hidden />
              {therapist.rating.toFixed(1)}
              <span className="text-teal-400/60">({therapist.reviews})</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1 text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-teal-400" aria-hidden />
              {therapist.experience}
            </span>
          </div>

          <div className="flex flex-col gap-2 text-sm text-white/70 md:flex-row md:flex-wrap md:items-center md:gap-4">
            <span className="inline-flex items-center gap-2 text-white">
              <MapPin className="h-4 w-4 text-teal-400" aria-hidden />
              {therapist.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-teal-400" aria-hidden />
              {therapist.availability}
            </span>
          </div>

          {highlightChips.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {highlightChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/70"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 md:text-left">
            <p className="font-medium text-white">Therapieansatz</p>
            <p className="mt-1 leading-relaxed">{therapist.approach}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 pt-4 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {therapist.formatTags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-teal-400/20 px-3 py-1 text-xs font-semibold text-teal-300">
              <CheckCircle className="h-3 w-3" aria-hidden />
              {formatOptions.find((option) => option.id === tag)?.label ?? tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline" onClick={(e: React.MouseEvent) => e.stopPropagation()} className="border-white/40 text-white hover:bg-white/10">
            <Link href="/triage" prefetch={false}>
              Passende Empfehlung erhalten
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost" onClick={(e: React.MouseEvent) => e.stopPropagation()} className="text-white hover:bg-white/10">
            <Link href="/contact" prefetch={false}>
              Kontakt anfragen
            </Link>
          </Button>
        </div>
      </div>
    </article>
    </Link>
  )
}
