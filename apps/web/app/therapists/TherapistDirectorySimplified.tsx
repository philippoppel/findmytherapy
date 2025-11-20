'use client'

import React, { useState, useEffect } from 'react'
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
          <div className="mx-auto max-w-md space-y-4">
            <p className="text-base text-white/90 font-medium">
              Keine passenden Profile gefunden
            </p>
            <p className="text-sm text-white/70">
              Passe die Filter an oder probiere unseren intelligenten Matching-Wizard aus, um personalisierte Empfehlungen zu erhalten.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/match"
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl"
              >
                <Sparkles className="h-4 w-4" />
                Matching-Wizard starten
              </Link>
              <button
                onClick={() => setFilteredTherapists(therapists)}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/15"
              >
                Filter zurücksetzen
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Therapist Grid */}
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
            {visibleTherapists.map((therapist, index) => {
              const showBanner = index === 5 && visibleTherapists.length > 6

              return (
                <React.Fragment key={therapist.id}>
                  <DirectoryCard therapist={therapist} />

                  {/* Contextual CTA Banner after 6 therapists */}
                  {showBanner && (
                    <div className="col-span-full my-4">
                      <div className="relative overflow-hidden rounded-2xl border border-primary-400/30 bg-gradient-to-br from-primary-500/10 via-primary-600/5 to-secondary-500/10 p-6 backdrop-blur sm:p-8">
                        {/* Background decoration */}
                        <div className="pointer-events-none absolute inset-0 opacity-30">
                          <div className="absolute -right-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-primary-400/40 blur-3xl" />
                          <div className="absolute -left-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-secondary-400/40 blur-3xl" />
                        </div>

                        <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                          {/* Icon */}
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                            <Sparkles className="h-7 w-7 text-white" />
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <h3 className="mb-2 text-lg font-bold text-white sm:text-xl">
                              Zu viele Optionen? Lass uns helfen!
                            </h3>
                            <p className="text-sm text-white/80 sm:text-base">
                              Beantworte ein paar Fragen und erhalte personalisierte Therapeut:innen-Empfehlungen mit Passungs-Scores – passend zu deinen Bedürfnissen.
                            </p>
                          </div>

                          {/* CTA */}
                          <Link
                            href="/match"
                            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
                          >
                            <Sparkles className="h-4 w-4" />
                            Matching starten
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              )
            })}
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
      <article className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1 sm:min-h-[450px] sm:rounded-3xl">
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
          <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-lg backdrop-blur-sm sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs',
                therapist.status === 'VERIFIED'
                  ? 'border-emerald-400/60 bg-emerald-500/30 text-emerald-100'
                  : therapist.status === 'PENDING'
                  ? 'border-amber-400/60 bg-amber-500/30 text-amber-100'
                  : 'border-red-400/60 bg-red-500/30 text-red-100',
              )}
            >
              <ShieldCheck className="h-3 w-3 flex-shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
              <span className="hidden sm:inline">{statusLabel[therapist.status]}</span>
            </span>
          </div>

          {/* Distance Badge - Top Right */}
          {distance && (
            <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
              <span className="inline-flex items-center gap-1 rounded-lg border border-primary-400/60 bg-primary-500/30 px-2 py-1 text-[10px] font-semibold text-primary-100 shadow-lg backdrop-blur-sm sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs">
                <LocateFixed className="h-3 w-3 flex-shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
                <span className="whitespace-nowrap">{distance}</span>
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-5 lg:p-6">
          {/* Header */}
          <div className="space-y-1.5">
            <h3 className="line-clamp-2 text-base font-bold leading-tight text-white sm:text-lg lg:text-xl">
              {therapist.name}
            </h3>
            <p className="line-clamp-2 text-xs text-white/70 sm:text-sm">
              {therapist.title}
            </p>
          </div>

          {/* Experience Badge */}
          <div className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/90 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-primary-400 sm:h-4 sm:w-4" aria-hidden />
            <span className="line-clamp-1">{therapist.experience}</span>
          </div>

          {/* Quick Info */}
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary-400 sm:h-4 sm:w-4" aria-hidden />
            <span className="line-clamp-2 text-xs text-white/80 sm:text-sm">{therapist.location}</span>
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
                  className="inline-block max-w-full truncate rounded-lg border border-primary-400/30 bg-primary-500/10 px-2 py-1 text-xs font-medium leading-tight text-primary-200"
                  title={focus}
                >
                  {focus}
                </span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="mt-auto border-t border-white/10 pt-3">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-white/60">Verfügbarkeit</span>
              <span
                className={cn(
                  'truncate text-right font-semibold',
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
