'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Star, User, MapPin, Clock, Globe, Calendar, CheckCircle } from 'lucide-react'
import { Button } from '@mental-health/ui'

type TherapistRecommendation = {
  id: string
  name: string
  title: string
  headline?: string
  focus: string[]
  availability: string
  location: string
  rating: number
  reviews: number
  status: string
  formatTags: Array<'online' | 'praesenz' | 'hybrid'>
  highlights: string[]
  acceptingClients?: boolean
  services?: string[]
  responseTime?: string
  yearsExperience?: number
  languages?: string[]
  image?: string | null
}

type TherapistCardProps = {
  therapist: TherapistRecommendation
  index: number
  embedded?: boolean
  isSelected?: boolean
  onSelect?: (id: string) => void
}

export function TherapistCard({ therapist, index, embedded = false, isSelected = false, onSelect }: TherapistCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const renderFormatTag = (tag: 'online' | 'praesenz' | 'hybrid') => {
    if (tag === 'online') return 'Online'
    if (tag === 'praesenz') return 'Vor Ort'
    return 'Hybrid'
  }

  return (
    <article
      className={`group grid gap-6 rounded-3xl border bg-white/95 p-6 shadow-lg shadow-primary/10 transition hover:-translate-y-1 hover:shadow-xl md:grid-cols-[auto,1fr] ${
        index === 0 ? 'border-primary/30 ring-2 ring-primary/15' : 'border-divider'
      } ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
    >
      <div className="flex flex-col items-center gap-3 md:items-start">
        <div className="relative h-36 w-36 overflow-hidden rounded-3xl border border-primary/20 bg-surface-1 shadow-inner md:h-40 md:w-40">
          {therapist.image ? (
            <Image
              src={therapist.image}
              alt={therapist.name}
              width={240}
              height={240}
              className="h-full w-full object-cover object-center"
              sizes="(max-width: 768px) 160px, 200px"
              quality={95}
              priority={index === 0}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <User className="h-14 w-14 text-primary/60" />
            </div>
          )}
          {index === 0 && (
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground shadow-md">
              Top-Empfehlung
            </span>
          )}
        </div>
        {onSelect && (
          <button
            type="button"
            onClick={() => onSelect(therapist.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
              isSelected
                ? 'border-blue-500 bg-blue-500 text-white shadow-sm'
                : 'border-divider bg-white text-muted hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {isSelected ? <CheckCircle className="h-4 w-4" /> : null}
            {isSelected ? 'Zum Vergleich hinzugefügt' : 'Zur Gegenüberstellung'}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <h3 className="text-xl font-semibold text-default">{therapist.name}</h3>
              {therapist.acceptingClients ? (
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                  Nimmt Klient:innen auf
                </span>
              ) : (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                  Warteliste
                </span>
              )}
            </div>
            <p className="text-sm text-muted">{therapist.title}</p>
            {therapist.headline ? <p className="text-sm text-default">{therapist.headline}</p> : null}
          </div>

          {therapist.rating > 0 && (
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
              {therapist.rating.toFixed(1)}
              {therapist.reviews > 0 ? <span className="text-amber-500">({therapist.reviews})</span> : null}
            </div>
          )}
        </header>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="inline-flex items-center gap-1 text-default">
            <MapPin className="h-4 w-4 text-primary" aria-hidden />
            {therapist.location}
          </span>
          <span aria-hidden>•</span>
          <span>{therapist.focus.slice(0, 3).join(' • ')}</span>
          {therapist.languages && therapist.languages.length > 0 ? (
            <>
              <span aria-hidden>•</span>
              <span>{therapist.languages.slice(0, 2).join(', ')}</span>
            </>
          ) : null}
        </div>

        {therapist.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {therapist.highlights.map((highlight, idx) => (
              <span
                key={idx}
                className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        <div className="rounded-2xl border border-divider bg-surface-1/70 p-4">
          <div className="flex flex-col gap-3 text-sm text-muted md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-default">
              <Clock className="h-4 w-4 text-primary" aria-hidden />
              <span className="font-semibold text-primary">{therapist.availability}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              {therapist.responseTime ? <span>{therapist.responseTime}</span> : null}
              {therapist.responseTime && therapist.rating > 0 ? <span aria-hidden>•</span> : null}
              {therapist.rating > 0 ? <span>{therapist.rating.toFixed(1)} / 5</span> : null}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted">
              {therapist.formatTags.map((tag) => (
                <span key={tag} className="rounded-full bg-surface-2 px-3 py-1 font-medium">
                  {renderFormatTag(tag)}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {therapist.services && therapist.services.length > 0 ? (
            <div className="flex flex-wrap gap-2 text-xs text-muted">
              {therapist.services.slice(0, 3).map((service) => (
                <span key={service} className="rounded-full border border-divider px-3 py-1">
                  {service}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted">Leistungen auf Anfrage</span>
          )}

          {!embedded && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/therapists/${therapist.id}?from=triage`} prefetch={false}>
                  Profil ansehen
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex w-full items-center justify-between rounded-lg border border-divider bg-surface-1 px-4 py-2 text-sm font-medium text-default transition hover:bg-surface-2"
          >
            <span>{showDetails ? 'Weniger anzeigen' : 'Alle Details anzeigen'}</span>
            {showDetails ? (
              <ChevronUp className="h-4 w-4 text-muted" aria-hidden />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted" aria-hidden />
            )}
          </button>

          {showDetails && (
            <div className="mt-4 space-y-4 rounded-xl border border-divider bg-surface-1/50 p-4">
              <div>
                <h5 className="flex items-center gap-2 text-sm font-semibold text-default">
                  <Globe className="h-4 w-4 text-primary" aria-hidden />
                  Alle Schwerpunkte
                </h5>
                <div className="mt-2 flex flex-wrap gap-2">
                  {therapist.focus.map((item) => (
                    <span key={item} className="rounded-full border border-divider bg-white px-3 py-1 text-xs text-default">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {therapist.languages && therapist.languages.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-default">Sprachen</h5>
                  <p className="mt-1 text-xs text-muted">{therapist.languages.join(', ')}</p>
                </div>
              )}

              {therapist.yearsExperience && (
                <div>
                  <h5 className="text-sm font-semibold text-default">Berufserfahrung</h5>
                  <p className="mt-1 text-xs text-muted">{therapist.yearsExperience} Jahre praktische Erfahrung</p>
                </div>
              )}

              {therapist.services && therapist.services.length > 2 && (
                <div>
                  <h5 className="flex items-center gap-2 text-sm font-semibold text-default">
                    <Calendar className="h-4 w-4 text-primary" aria-hidden />
                    Angebotene Leistungen
                  </h5>
                  <ul className="mt-2 space-y-1">
                    {therapist.services.map((service) => (
                      <li key={service} className="flex items-start gap-2 text-xs text-muted">
                        <span className="text-primary">•</span>
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h5 className="flex items-center gap-2 text-sm font-semibold text-default">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden />
                  Standort & Format
                </h5>
                <div className="mt-2 flex flex-wrap gap-2">
                  {therapist.formatTags.map((tag) => (
                    <span key={tag} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      {renderFormatTag(tag)}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted">{therapist.location}</p>
              </div>

              <div>
                <h5 className="flex items-center gap-2 text-sm font-semibold text-default">
                  <Clock className="h-4 w-4 text-primary" aria-hidden />
                  Verfügbarkeit
                </h5>
                <p className="mt-1 text-xs text-muted">{therapist.availability}</p>
                {therapist.responseTime && (
                  <p className="mt-1 text-xs text-muted">Antwortzeit: {therapist.responseTime}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
