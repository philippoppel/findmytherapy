'use client'

import { useCallback, useMemo, useState, type MouseEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Clock, LocateFixed, MapPin, ShieldCheck, Sparkles } from 'lucide-react'

import type { TherapistStatus } from '@/lib/prisma'
import { Button, cn } from '@mental-health/ui'
import { FEATURES } from '@/lib/features'
import {
  type Coordinates,
  normalizeLocationValue,
  resolveCoordinatesFromSearch,
} from './location-data'

const formatOptions = [
  { id: 'online', label: 'Online' },
  { id: 'praesenz', label: 'Vor Ort' },
  { id: 'hybrid', label: 'Hybrid' },
] as const

const DEFAULT_NEARBY_RADIUS = 50
const RADIUS_OPTIONS = [25, 50, 75, 120] as const
const EARTH_RADIUS_KM = 6371

const gradientPalette = [
  'from-rose-500 via-fuchsia-500 to-indigo-500',
  'from-sky-500 via-cyan-500 to-emerald-500',
  'from-amber-500 via-orange-500 to-rose-500',
  'from-indigo-500 via-purple-500 to-pink-500',
  'from-emerald-500 via-teal-500 to-sky-500',
  'from-blue-500 via-slate-500 to-slate-800',
] as const

const statusLabel: Record<TherapistStatus, string> = {
  VERIFIED: 'Pilot (verifiziert)',
  PENDING: 'Pilot (in Prüfung)',
  REJECTED: 'Nicht gelistet',
}

// Removed unused variable statusTone
// const statusTone: Record<TherapistStatus, string> = {
//   VERIFIED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
//   PENDING: 'bg-amber-100 text-amber-900 border-amber-200',
//   REJECTED: 'bg-red-100 text-red-800 border-red-200',
// }

export type TherapistCard = {
  id: string
  name: string
  title: string
  focus: string[]
  approach: string
  location: string
  city: string | null
  coordinates: Coordinates | null
  availability: string
  availabilityRank: number
  languages: string[]
  rating: number
  reviews: number
  experience: string
  image: string | null
  initials: string
  status: TherapistStatus
  formatTags: Array<'online' | 'praesenz' | 'hybrid'>
  distanceInKm?: number
  locationTokens: string[]
}

type Props = {
  therapists: TherapistCard[]
}

export function TherapistDirectory({ therapists }: Props) {
  const [focusFilter, setFocusFilter] = useState<string | null>(null)
  const [formatFilter, setFormatFilter] = useState<(typeof formatOptions)[number]['id'] | null>(null)
  const [locationFilter, setLocationFilter] = useState('')
  const [nearbyOnly, setNearbyOnly] = useState(false)
  const [maxDistance, setMaxDistance] = useState<number>(DEFAULT_NEARBY_RADIUS)
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null)
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [geoError, setGeoError] = useState<string | null>(null)

  const focusOptions = useMemo(() => {
    const values = new Set<string>()
    therapists.forEach((therapist) => therapist.focus.forEach((item) => values.add(item)))
    return Array.from(values).sort((a, b) => a.localeCompare(b, 'de-AT'))
  }, [therapists])

  const cityOptions = useMemo(() => {
    const values = new Set<string>()
    therapists.forEach((therapist) => {
      if (therapist.city) {
        values.add(therapist.city)
      }
    })
    return Array.from(values).sort((a, b) => a.localeCompare(b, 'de-AT'))
  }, [therapists])

  const normalizedLocationFilter = normalizeLocationValue(locationFilter)
  const manualLocationCoordinates = useMemo(() => {
    if (!normalizedLocationFilter) {
      return null
    }
    return resolveCoordinatesFromSearch(normalizedLocationFilter)
  }, [normalizedLocationFilter])
  const proximityOrigin = userLocation ?? manualLocationCoordinates

  const therapistsWithDistances = useMemo(() => {
    if (!proximityOrigin) {
      return therapists
    }
    return therapists.map((therapist) => {
      if (!therapist.coordinates) {
        return { ...therapist, distanceInKm: undefined }
      }
      return {
        ...therapist,
        distanceInKm: calculateDistanceKm(proximityOrigin, therapist.coordinates),
      }
    })
  }, [proximityOrigin, therapists])

  const filteredTherapists = useMemo(() => {
    return therapistsWithDistances.filter((therapist) => {
      const matchesFocus = focusFilter ? therapist.focus.includes(focusFilter) : true
      const matchesFormat = formatFilter ? therapist.formatTags.includes(formatFilter) : true
      const matchesLocation = normalizedLocationFilter
        ? therapist.locationTokens.some((token) => token.includes(normalizedLocationFilter))
        : true
      const matchesNearby =
        !nearbyOnly || !proximityOrigin
          ? true
          : typeof therapist.distanceInKm === 'number' && therapist.distanceInKm <= maxDistance
      return matchesFocus && matchesFormat && matchesLocation && matchesNearby
    })
  }, [
    focusFilter,
    formatFilter,
    maxDistance,
    nearbyOnly,
    normalizedLocationFilter,
    proximityOrigin,
    therapistsWithDistances,
  ])

  const sortedTherapists = useMemo(() => {
    const next = [...filteredTherapists]
    next.sort((a, b) => compareTherapists(a, b))
    return next
  }, [filteredTherapists])

  const activeFilterLabels: string[] = []
  if (focusFilter) activeFilterLabels.push(`Fokus „${focusFilter}“`)
  if (formatFilter) {
    const formatLabel = formatOptions.find((option) => option.id === formatFilter)?.label ?? formatFilter
    activeFilterLabels.push(`Format „${formatLabel}“`)
  }
  if (locationFilter.trim()) {
    activeFilterLabels.push(`Ort „${locationFilter.trim()}“`)
  }
  if (nearbyOnly) {
    activeFilterLabels.push(`Umkreis ${maxDistance} km`)
  }

  const hasFilters = activeFilterLabels.length > 0

  const handleResetFilters = useCallback(() => {
    setFocusFilter(null)
    setFormatFilter(null)
    setLocationFilter('')
    setNearbyOnly(false)
    setMaxDistance(DEFAULT_NEARBY_RADIUS)
  }, [])

  const handleUseLocation = useCallback(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setGeoStatus('error')
      setGeoError('Standortfreigabe wird von diesem Browser nicht unterstützt.')
      return
    }

    setGeoStatus('loading')
    setGeoError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setGeoStatus('idle')
        setNearbyOnly(true)
      },
      (error) => {
        setGeoStatus('error')
        setGeoError(error.message || 'Standort konnte nicht ermittelt werden.')
      },
      {
        maximumAge: 1000 * 60 * 5,
        timeout: 1000 * 15,
        enableHighAccuracy: false,
      },
    )
  }, [])

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-400">Fokus</p>
              <p className="text-sm text-white/70">
                Wähle Schwerpunkte, um passende Therapeut:innen angezeigt zu bekommen.
              </p>
            </div>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-white hover:bg-white/10">
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
                      ? 'border-primary-700 bg-primary-700 text-white shadow-sm'
                      : 'border-white/30 text-white/70 hover:border-primary-400/40 hover:text-white hover:bg-white/10',
                  )}
                >
                  {option}
                </button>
              )
            })}
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-400">Format</p>
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
                        ? 'border-primary-700 bg-primary-700 text-white shadow-sm'
                        : 'border-white/30 text-white/70 hover:border-primary-400/40 hover:text-white hover:bg-white/10',
                    )}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-400">Standort</p>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex-1">
                <label htmlFor="therapist-location-filter" className="sr-only">
                  Ort eingeben
                </label>
                <input
                  id="therapist-location-filter"
                  list="therapist-city-options"
                  value={locationFilter}
                  onChange={(event) => setLocationFilter(event.target.value)}
                  placeholder="z. B. Wien oder 1100"
                  className="w-full rounded-2xl border border-white/20 bg-black/20 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
                <datalist id="therapist-city-options">
                  {cityOptions.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>
              <Button
                type="button"
                onClick={handleUseLocation}
                disabled={geoStatus === 'loading'}
                className="w-full rounded-2xl border border-white/20 bg-white/10 text-sm font-semibold text-white hover:bg-white/20 md:w-auto"
              >
                {geoStatus === 'loading' ? 'Standort wird ermittelt...' : 'Standort verwenden'}
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
              <button
                type="button"
                onClick={() => {
                  if (!nearbyOnly && !proximityOrigin) {
                    handleUseLocation()
                  }
                  setNearbyOnly((prev) => !prev)
                }}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-semibold transition',
                  nearbyOnly
                    ? 'border-primary-500 bg-primary-500/20 text-primary-200'
                    : 'border-white/30 text-white/70 hover:border-primary-400/40 hover:text-white',
                )}
              >
                <LocateFixed className="h-3.5 w-3.5" aria-hidden />
                Nur in meiner Nähe
              </button>
              {nearbyOnly && (
                <select
                  value={maxDistance}
                  onChange={(event) => setMaxDistance(Number(event.target.value))}
                  disabled={!proximityOrigin}
                  className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-white focus:border-primary-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {RADIUS_OPTIONS.map((radius) => (
                    <option key={radius} value={radius}>
                      {radius} km
                    </option>
                  ))}
                </select>
              )}
              {proximityOrigin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-white/70">
                  <MapPin className="h-3.5 w-3.5 text-primary-400" aria-hidden />
                  Standort aktiv
                </span>
              )}
            </div>
            {geoStatus === 'error' && geoError && <p className="text-xs text-rose-200">{geoError}</p>}
            {nearbyOnly && !proximityOrigin && (
              <p className="text-xs text-amber-200">
                Um den Umkreisfilter zu nutzen, gib einen Ort ein oder erlaube die Standortabfrage.
              </p>
            )}
          </div>

          {hasFilters && (
            <p className="mt-4 text-xs text-white/60">
              Aktive Filter: {activeFilterLabels.join(' · ')}
            </p>
          )}
        </div>
      </div>

      {sortedTherapists.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-white/70 backdrop-blur">
          <p>
            Keine Profile gefunden. Passe die Filter an oder kontaktiere das Care-Team für eine individuelle Empfehlung.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {sortedTherapists.map((therapist) => (
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
    typeof therapist.distanceInKm === 'number' ? `~${Math.max(1, Math.round(therapist.distanceInKm))} km entfernt` : null,
  ].filter(Boolean) as string[]
  const gradientClass = getGradientClass(therapist.id)

  return (
    <Link href={`/therapists/${therapist.id}`} prefetch={false}>
      <article className="group flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl sm:p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-inner sm:h-28 sm:w-28 md:h-32 md:w-32">
            {therapist.image ? (
              <Image
                src={therapist.image}
                alt={`Portrait von ${therapist.name}`}
                width={320}
                height={320}
                className="h-full w-full object-cover object-center brightness-[0.95] contrast-[1.05]"
                sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                quality={90}
              />
            ) : (
              <div
                className={cn(
                  'relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl text-3xl font-semibold uppercase text-white sm:text-4xl',
                  gradientClass,
                  'bg-gradient-to-br',
                )}
              >
                <div className="absolute inset-0 opacity-50" aria-hidden>
                  <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-white/20 blur-3xl" />
                  <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
                </div>
                <span className="relative">{therapist.initials}</span>
              </div>
            )}
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

          <div className="flex-1 space-y-3 text-center sm:text-left">
            <header className="space-y-1">
              <h3 className="text-lg font-semibold text-white sm:text-xl">{therapist.name}</h3>
              <p className="text-sm text-white/70">{therapist.title}</p>
            </header>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/70 sm:justify-start">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1 text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-primary-400" aria-hidden />
              {therapist.experience}
            </span>
          </div>

          <div className="flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <span className="inline-flex items-center justify-center gap-2 text-white sm:justify-start">
              <MapPin className="h-4 w-4 flex-shrink-0 text-primary-400" aria-hidden />
              <span className="truncate">{therapist.location}</span>
            </span>
            <span className="hidden sm:inline text-white/40" aria-hidden>•</span>
            <span className="inline-flex items-center justify-center gap-2 sm:justify-start">
              <Clock className="h-4 w-4 flex-shrink-0 text-primary-400" aria-hidden />
              <span className="truncate">{therapist.availability}</span>
            </span>
            {typeof therapist.distanceInKm === 'number' && (
              <>
                <span className="hidden sm:inline text-white/40" aria-hidden>•</span>
                <span className="inline-flex items-center justify-center gap-2 sm:justify-start">
                  <LocateFixed className="h-4 w-4 flex-shrink-0 text-primary-400" aria-hidden />
                  <span className="truncate">
                    ~{Math.max(1, Math.round(therapist.distanceInKm))} km entfernt
                  </span>
                </span>
              </>
            )}
          </div>

          {highlightChips.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
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

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/70 sm:p-4">
            <p className="font-medium text-white">Therapieansatz</p>
            <p className="mt-1 leading-relaxed">{therapist.approach}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 pt-4 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {therapist.formatTags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary-400/20 px-3 py-1 text-xs font-semibold text-primary-300">
              <CheckCircle className="h-3 w-3" aria-hidden />
              {formatOptions.find((option) => option.id === tag)?.label ?? tag}
            </span>
          ))}
        </div>
        <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {FEATURES.ASSESSMENT && (
            <Button asChild size="sm" variant="outline" onClick={(e: MouseEvent) => e.stopPropagation()} className="w-full border-white/40 text-white hover:bg-white/10 sm:w-auto">
              <Link href="/triage" prefetch={false}>
                Passende Empfehlung
              </Link>
            </Button>
          )}
          <Button asChild size="sm" variant="ghost" onClick={(e: MouseEvent) => e.stopPropagation()} className="w-full text-white hover:bg-white/10 sm:w-auto">
            <Link href="/contact" prefetch={false}>
              Kontakt
            </Link>
          </Button>
        </div>
      </div>
    </article>
    </Link>
  )
}

function getGradientClass(id: string) {
  const index = Math.abs(hashString(id)) % gradientPalette.length
  return gradientPalette[index]
}

function hashString(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return hash
}

function calculateDistanceKm(a: Coordinates, b: Coordinates) {
  const latDistance = degreesToRadians(b.lat - a.lat)
  const lngDistance = degreesToRadians(b.lng - a.lng)
  const normalizedLatA = degreesToRadians(a.lat)
  const normalizedLatB = degreesToRadians(b.lat)

  const sinLat = Math.sin(latDistance / 2)
  const sinLng = Math.sin(lngDistance / 2)

  const haversine =
    sinLat * sinLat + sinLng * sinLng * Math.cos(normalizedLatA) * Math.cos(normalizedLatB)
  const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  const distance = EARTH_RADIUS_KM * c
  return Math.round(distance * 10) / 10
}

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

const STATUS_PRIORITY: Record<TherapistStatus, number> = {
  VERIFIED: 0,
  PENDING: 1,
  REJECTED: 2,
}

function compareTherapists(a: TherapistCard, b: TherapistCard) {
  const distanceA = typeof a.distanceInKm === 'number' ? a.distanceInKm : null
  const distanceB = typeof b.distanceInKm === 'number' ? b.distanceInKm : null

  if (distanceA !== null || distanceB !== null) {
    if (distanceA === null) return 1
    if (distanceB === null) return -1
    if (distanceA !== distanceB) {
      return distanceA - distanceB
    }
  }

  if (a.availabilityRank !== b.availabilityRank) {
    return a.availabilityRank - b.availabilityRank
  }

  const statusDiff = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]
  if (statusDiff !== 0) {
    return statusDiff
  }

  return a.name.localeCompare(b.name, 'de-AT')
}
