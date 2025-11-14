'use client'

import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Clock, LocateFixed, MapPin, ShieldCheck, Sparkles, SlidersHorizontal, X } from 'lucide-react'

import { Button, cn } from '@mental-health/ui'
import { FEATURES } from '@/lib/features'
import {
  normalizeLocationValue,
  resolveCoordinatesFromSearch,
} from './location-data'
import type { TherapistCard } from './types'

const formatOptions = [
  { id: 'online', label: 'Online' },
  { id: 'praesenz', label: 'Vor Ort' },
  { id: 'hybrid', label: 'Hybrid' },
] as const

const DEFAULT_NEARBY_RADIUS = 50
const RADIUS_OPTIONS = [25, 50, 75, 120] as const
const EARTH_RADIUS_KM = 6371
const INITIAL_VISIBLE_COUNT = 24
const LOAD_MORE_INCREMENT = 24

const gradientPalette = [
  'from-rose-500 via-fuchsia-500 to-indigo-500',
  'from-sky-500 via-cyan-500 to-emerald-500',
  'from-amber-500 via-orange-500 to-rose-500',
  'from-indigo-500 via-purple-500 to-pink-500',
  'from-emerald-500 via-teal-500 to-sky-500',
  'from-blue-500 via-slate-500 to-slate-800',
] as const

const statusLabel = {
  VERIFIED: 'Pilot (verifiziert)',
  PENDING: 'Pilot (in Prüfung)',
  REJECTED: 'Nicht gelistet',
} as const

// Removed unused variable statusTone
// const statusTone: Record<TherapistStatus, string> = {
//   VERIFIED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
//   PENDING: 'bg-amber-100 text-amber-900 border-amber-200',
//   REJECTED: 'bg-red-100 text-red-800 border-red-200',
// }

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
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFilterModalOpen) {
        setIsFilterModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isFilterModalOpen])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isFilterModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFilterModalOpen])

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

  const totalResults = sortedTherapists.length
  const visibleTherapists = useMemo(
    () => sortedTherapists.slice(0, Math.min(visibleCount, totalResults)),
    [sortedTherapists, totalResults, visibleCount],
  )
  const canLoadMore = visibleCount < totalResults

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }, [
    focusFilter,
    formatFilter,
    normalizedLocationFilter,
    nearbyOnly,
    maxDistance,
    proximityOrigin,
    therapists,
  ])

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

  // Filter content component that can be used in both modal and inline
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Focus Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-primary-300">Spezialisierung</p>
            <p className="text-xs text-white/60">Wähle relevante Schwerpunkte</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {focusOptions.map((option) => {
            const isActive = focusFilter === option
            return (
              <button
                key={option}
                type="button"
                onClick={() => setFocusFilter(isActive ? null : option)}
                className={cn(
                  'min-h-[44px] rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                  isActive
                    ? 'border-primary-500 bg-primary-600 text-white shadow-md shadow-primary-900/50 scale-105'
                    : 'border-white/25 text-white/80 hover:border-primary-400/50 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95',
                )}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>

      {/* Format Filter */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-primary-300">Format</p>
        <div className="grid grid-cols-3 gap-3">
          {formatOptions.map((option) => {
            const isActive = formatFilter === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFormatFilter(isActive ? null : option.id)}
                className={cn(
                  'min-h-[44px] rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                  isActive
                    ? 'border-primary-500 bg-primary-600 text-white shadow-md shadow-primary-900/50 scale-105'
                    : 'border-white/25 text-white/80 hover:border-primary-400/50 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95',
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Location Filter */}
      <div className="space-y-3 rounded-2xl border border-primary-500/20 bg-primary-500/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary-400" />
            <p className="text-sm font-semibold text-primary-300">Standort</p>
          </div>
          {proximityOrigin && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-500/30 border border-primary-400/40 px-2.5 py-1 text-xs font-semibold text-primary-200">
              <LocateFixed className="h-3 w-3" aria-hidden />
              Aktiv
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <div className="flex-1">
              <label htmlFor="therapist-location-filter" className="sr-only">
                Ort oder PLZ eingeben
              </label>
              <input
                id="therapist-location-filter"
                list="therapist-city-options"
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
                placeholder="Wien, 1010, ..."
                className="w-full min-h-[44px] rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 backdrop-blur transition-colors"
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
              className="min-h-[44px] rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-500 disabled:opacity-50 shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <LocateFixed className="mr-2 h-4 w-4" />
              {geoStatus === 'loading' ? 'Lädt...' : 'Mein Standort'}
            </Button>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                if (!nearbyOnly && !proximityOrigin) {
                  handleUseLocation()
                }
                setNearbyOnly((prev) => !prev)
              }}
              className={cn(
                'w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200',
                nearbyOnly
                  ? 'border-primary-400 bg-primary-500/30 text-white shadow-md scale-105'
                  : 'border-white/25 bg-white/5 text-white/80 hover:border-primary-400/50 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95',
              )}
            >
              <LocateFixed className="h-4 w-4" aria-hidden />
              Nur in meiner Nähe
            </button>

            {nearbyOnly && (
              <div className="space-y-2">
                <p className="text-xs text-white/70">Umkreis auswählen:</p>
                <div className="grid grid-cols-4 gap-2">
                  {RADIUS_OPTIONS.map((radius) => (
                    <button
                      key={radius}
                      type="button"
                      onClick={() => setMaxDistance(radius)}
                      disabled={!proximityOrigin}
                      className={cn(
                        'min-h-[44px] rounded-lg border px-3 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40',
                        maxDistance === radius
                          ? 'border-primary-400 bg-primary-500/30 text-white shadow-md scale-105'
                          : 'border-white/25 text-white/80 hover:border-primary-400/50 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95',
                      )}
                    >
                      {radius}km
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {geoStatus === 'error' && geoError && (
            <div className="flex items-start gap-2 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3">
              <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400" />
              <p className="text-xs text-rose-200">{geoError}</p>
            </div>
          )}
          {nearbyOnly && !proximityOrigin && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 p-3">
              <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-amber-400" />
              <p className="text-xs text-amber-200">
                Gib einen Ort ein oder aktiviere deinen Standort.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Active Filters & Filter Button (Mobile) */}
      <div className="space-y-4">
        {/* Active Filter Chips */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-white/60">Aktiv:</span>
            {focusFilter && (
              <button
                onClick={() => setFocusFilter(null)}
                className="group inline-flex min-h-[36px] items-center gap-2 rounded-full border border-primary-500/40 bg-primary-600/30 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-primary-600/50 hover:scale-105 active:scale-95"
              >
                {focusFilter}
                <X className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              </button>
            )}
            {formatFilter && (
              <button
                onClick={() => setFormatFilter(null)}
                className="group inline-flex min-h-[36px] items-center gap-2 rounded-full border border-primary-500/40 bg-primary-600/30 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-primary-600/50 hover:scale-105 active:scale-95"
              >
                {formatOptions.find((o) => o.id === formatFilter)?.label}
                <X className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              </button>
            )}
            {locationFilter.trim() && (
              <button
                onClick={() => setLocationFilter('')}
                className="group inline-flex min-h-[36px] items-center gap-2 rounded-full border border-primary-500/40 bg-primary-600/30 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-primary-600/50 hover:scale-105 active:scale-95"
              >
                {locationFilter.trim()}
                <X className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              </button>
            )}
            {nearbyOnly && (
              <button
                onClick={() => setNearbyOnly(false)}
                className="group inline-flex min-h-[36px] items-center gap-2 rounded-full border border-primary-500/40 bg-primary-600/30 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-primary-600/50 hover:scale-105 active:scale-95"
              >
                {maxDistance}km Umkreis
                <X className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              </button>
            )}
            <button
              onClick={handleResetFilters}
              className="min-h-[36px] text-xs font-medium text-white/60 hover:text-white underline underline-offset-2 transition-colors"
            >
              Alle zurücksetzen
            </button>
          </div>
        )}

        {/* Filter Section - Mobile: Button + Modal, Desktop: Inline */}
        {/* Mobile Filter Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur transition-all hover:bg-white/15 hover:scale-105 active:scale-95"
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filter anpassen
            {hasFilters && (
              <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs font-bold">
                {activeFilterLabels.length}
              </span>
            )}
          </button>
        </div>

        {/* Desktop Inline Filters */}
        <div className="hidden lg:block rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default"
            onClick={() => setIsFilterModalOpen(false)}
            aria-label="Schließen"
            tabIndex={-1}
          />

          {/* Bottom Sheet (Mobile) / Side Panel (Tablet) */}
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] w-full rounded-t-3xl bg-gradient-to-b from-primary-950 via-neutral-950 to-black shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-full md:max-w-md md:rounded-none">
            <div className="flex h-full flex-col">
              {/* Drag Handle (Mobile only) */}
              <div className="flex justify-center pt-3 pb-2 md:hidden">
                <div className="h-1.5 w-12 rounded-full bg-white/30" />
              </div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-4 md:pt-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-primary-400" />
                  <h2 className="text-lg font-semibold text-white">Filter</h2>
                </div>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all hover:bg-white/10 hover:text-white hover:scale-110 active:scale-95"
                  aria-label="Schließen"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4">
                <FilterContent />
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 p-4">
                <div className="flex gap-3">
                  <Button
                    onClick={handleResetFilters}
                    variant="outline"
                    className="flex-1 min-h-[48px] rounded-xl border-white/30 text-white hover:bg-white/10"
                  >
                    Zurücksetzen
                  </Button>
                  <Button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="flex-1 min-h-[48px] rounded-xl bg-primary-600 text-white hover:bg-primary-500"
                  >
                    Anzeigen ({totalResults})
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mt-8">
        {totalResults === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
            <p className="text-sm text-white/70">
              Keine Profile gefunden. Passe die Filter an oder kontaktiere das Care-Team für eine individuelle Empfehlung.
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-white/70">
                <span className="font-semibold text-white">{totalResults}</span> {totalResults === 1 ? 'Profil gefunden' : 'Profile gefunden'}
              </p>
            </div>

            {/* Therapist Grid */}
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
              {visibleTherapists.map((therapist) => (
                <DirectoryCard key={therapist.id} therapist={therapist} />
              ))}
            </div>

            {/* Load More */}
            {canLoadMore && (
              <div className="mt-8 flex justify-center">
                <Button
                  type="button"
                  onClick={() =>
                    setVisibleCount((current) => Math.min(current + LOAD_MORE_INCREMENT, totalResults))
                  }
                  className="min-h-[48px] rounded-2xl border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur transition-all hover:bg-white/15 hover:scale-105 active:scale-95"
                >
                  Mehr laden
                  <span className="ml-2 text-white/60">
                    ({totalResults - visibleCount} weitere)
                  </span>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

function DirectoryCard({ therapist }: { therapist: TherapistCard }) {
  const gradientClass = getGradientClass(therapist.id)
  const primaryFocus = therapist.focus.slice(0, 3)
  const distance = typeof therapist.distanceInKm === 'number'
    ? `${Math.max(1, Math.round(therapist.distanceInKm))} km`
    : null

  return (
    <Link href={`/therapists/${therapist.id}`} prefetch={false} className="group">
      <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1 sm:rounded-3xl">
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-neutral-900 to-black">
          {therapist.image ? (
            <Image
              src={therapist.image}
              alt={`Profilbild von ${therapist.name}${therapist.focus[0] ? `, spezialisiert auf ${therapist.focus[0]}` : ''}`}
              fill
              className="object-cover object-center brightness-[0.95] contrast-[1.05] transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
              quality={75}
            />
          ) : (
            <div
              className={cn(
                'relative flex h-full w-full items-center justify-center',
                gradientClass,
                'bg-gradient-to-br',
              )}
            >
              {/* Decorative background */}
              <div className="absolute inset-0 opacity-20" aria-hidden>
                <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white blur-3xl" />
                <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-white/50 blur-2xl" />
              </div>
              {/* Initials */}
              <div className="relative flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-white sm:text-6xl md:text-7xl">
                  {therapist.initials}
                </span>
                <span className="mt-1 text-xs font-medium uppercase tracking-wider text-white/70 sm:text-sm">
                  Therapeut:in
                </span>
              </div>
            </div>
          )}

          {/* Status Badge - Top Left */}
          <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide shadow-lg backdrop-blur-sm sm:px-3 sm:py-2',
                therapist.status === 'VERIFIED'
                  ? 'border-emerald-400/60 bg-emerald-500/30 text-emerald-100'
                  : therapist.status === 'PENDING'
                  ? 'border-amber-400/60 bg-amber-500/30 text-amber-100'
                  : 'border-red-400/60 bg-red-500/30 text-red-100',
              )}
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">{statusLabel[therapist.status]}</span>
            </span>
          </div>

          {/* Distance Badge - Top Right */}
          {distance && (
            <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary-400/60 bg-primary-500/30 px-2.5 py-1.5 text-xs font-semibold text-primary-100 shadow-lg backdrop-blur-sm sm:px-3 sm:py-2">
                <LocateFixed className="h-3.5 w-3.5" aria-hidden />
                {distance}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col gap-4 p-4 sm:gap-5 sm:p-5 lg:p-6">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="line-clamp-2 text-lg font-bold text-white sm:text-xl lg:text-2xl">
              {therapist.name}
            </h3>
            <p className="line-clamp-1 text-sm text-white/70 sm:text-base">
              {therapist.title}
            </p>
          </div>

          {/* Experience Badge */}
          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-white/90">
            <Sparkles className="h-4 w-4 text-primary-400" aria-hidden />
            {therapist.experience}
          </div>

          {/* Quick Info */}
          <div className="flex flex-col gap-2.5 text-sm">
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-400" aria-hidden />
              <span className="line-clamp-2 text-white/80">{therapist.location}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-400" aria-hidden />
              <span className="line-clamp-1 text-white/80">{therapist.availability}</span>
            </div>
          </div>

          {/* Focus Areas */}
          {primaryFocus.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-300">
                Schwerpunkte
              </p>
              <div className="flex flex-wrap gap-2">
                {primaryFocus.map((focus) => (
                  <span
                    key={focus}
                    className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Approach */}
          <div className="flex-1 space-y-2 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-300">
              Therapieansatz
            </p>
            <p className="line-clamp-3 text-sm leading-relaxed text-white/80">
              {therapist.approach}
            </p>
          </div>

          {/* Format Tags */}
          <div className="flex flex-wrap gap-2">
            {therapist.formatTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500/20 px-3 py-1.5 text-xs font-semibold text-primary-300"
              >
                <CheckCircle className="h-3.5 w-3.5" aria-hidden />
                {formatOptions.find((option) => option.id === tag)?.label ?? tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 border-t border-white/10 pt-4 sm:flex-row sm:pt-5">
            {FEATURES.ASSESSMENT && (
              <Button
                asChild
                onClick={(e: MouseEvent) => e.stopPropagation()}
                className="flex-1 min-h-[44px] rounded-xl border border-white/30 bg-white/10 text-sm font-semibold text-white transition-all hover:bg-white/15 hover:scale-105 active:scale-95"
              >
                <Link href="/triage" prefetch={false}>
                  Empfehlung
                </Link>
              </Button>
            )}
            <Button
              asChild
              onClick={(e: MouseEvent) => e.stopPropagation()}
              className="flex-1 min-h-[44px] rounded-xl bg-primary-600 text-sm font-semibold text-white transition-all hover:bg-primary-500 hover:scale-105 active:scale-95"
            >
              <Link href="/contact" prefetch={false}>
                Kontaktieren
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
