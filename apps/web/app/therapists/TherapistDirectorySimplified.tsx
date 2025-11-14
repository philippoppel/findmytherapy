'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, Sparkles, MapPin, LocateFixed } from 'lucide-react'
import type { TherapistCard } from './types'
import { UnifiedTherapistSearch } from '../components/therapist-search/UnifiedTherapistSearch'

// Utility function to merge classNames
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

const INITIAL_VISIBLE_COUNT = 12
const LOAD_MORE_COUNT = 12

const statusLabel: Record<TherapistCard['status'], string> = {
  VERIFIED: 'Verifiziert',
  PENDING: 'In Prüfung',
  DRAFT: 'Entwurf',
}

const gradients = [
  'from-blue-600 to-cyan-600',
  'from-purple-600 to-pink-600',
  'from-green-600 to-teal-600',
  'from-orange-600 to-amber-600',
  'from-red-600 to-rose-600',
  'from-indigo-600 to-purple-600',
]

function getGradientClass(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return gradients[Math.abs(hash) % gradients.length]
}

export type TherapistDirectoryProps = {
  therapists: TherapistCard[]
}

export function TherapistDirectory({ therapists }: TherapistDirectoryProps) {
  const [filteredTherapists, setFilteredTherapists] = useState<TherapistCard[]>(therapists)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

  // Reset visible count when filtered results change
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }, [filteredTherapists.length])

  const visibleTherapists = filteredTherapists.slice(0, visibleCount)
  const hasMore = visibleCount < filteredTherapists.length

  return (
    <div className="w-full">
      {/* Unified Search & Filters */}
      <UnifiedTherapistSearch
        therapists={therapists}
        onFilteredResults={setFilteredTherapists}
        className="mb-8"
      />

      {/* Results */}
      {filteredTherapists.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
          <p className="text-sm text-white/70">
            Keine Profile gefunden. Passe die Filter an oder kontaktiere das Care-Team für eine individuelle Empfehlung.
          </p>
        </div>
      ) : (
        <>
          {/* Therapist Grid */}
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
            {visibleTherapists.map((therapist) => (
              <DirectoryCard key={therapist.id} therapist={therapist} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
                className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/15 active:scale-98"
              >
                Mehr laden ({filteredTherapists.length - visibleCount} weitere)
              </button>
            </div>
          )}
        </>
      )}
    </div>
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
          </div>

          {/* Focus Areas */}
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Schwerpunkte
            </p>
            <div className="flex flex-wrap gap-1.5">
              {primaryFocus.map((focus, index) => (
                <span
                  key={index}
                  className="inline-block rounded-lg border border-primary-400/30 bg-primary-500/10 px-2.5 py-1 text-xs font-medium text-primary-200"
                >
                  {focus}
                </span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="mt-auto border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Verfügbarkeit</span>
              <span
                className={cn(
                  'font-semibold',
                  therapist.availabilityRank <= 2
                    ? 'text-emerald-400'
                    : therapist.availabilityRank <= 4
                    ? 'text-amber-400'
                    : 'text-red-400',
                )}
              >
                {therapist.availability}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
