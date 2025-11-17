'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Calendar, Heart, CheckCircle2 } from 'lucide-react'
import { InteractiveCard } from '../InteractiveCard'
import type { TherapistWithListing } from './types'
import { PlaceholderImage } from './PlaceholderImage'

interface TherapistCardProps {
  therapist: TherapistWithListing
}

function formatLocation(city?: string | null, online?: boolean) {
  const parts: string[] = []
  if (city) parts.push(city)
  if (online) parts.push('Online')
  if (parts.length === 0) return 'Standort auf Anfrage'
  return parts.join(' & ')
}

function formatPrice(min?: number | null, max?: number | null) {
  if (!min && !max) return 'Preis auf Anfrage'
  if (min && max && min === max) return `€${(min / 100).toFixed(0)}`
  if (min && max) return `€${(min / 100).toFixed(0)} - €${(max / 100).toFixed(0)}`
  if (min) return `Ab €${(min / 100).toFixed(0)}`
  if (max) return `Bis €${(max / 100).toFixed(0)}`
  return 'Preis auf Anfrage'
}

export function TherapistCard({ therapist }: TherapistCardProps) {
  const name = therapist.displayName || 'Therapeut:in'
  const specialty = therapist.specialties[0] || 'Psychotherapie'
  const approach = therapist.approachSummary || therapist.modalities[0] || 'Individuelle Begleitung'
  const location = formatLocation(therapist.city, therapist.online)
  const rating = therapist.rating || 0
  const reviewCount = therapist.reviewCount || 0
  const priceRange = formatPrice(therapist.priceMin, therapist.priceMax)

  return (
    <InteractiveCard className="h-full border border-neutral-200/60 bg-white/95" glowColor="rgba(13, 148, 136, 0.25)">
      <Link
        href={`/therapists/${therapist.id}`}
        className="block h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200/70"
      >
        <article className="flex h-full flex-col overflow-hidden rounded-[26px]">
          {/* Image Section */}
          <div className="relative h-48 w-full overflow-hidden bg-neutral-50">
            {therapist.profileImageUrl ? (
              <Image
                src={therapist.profileImageUrl}
                alt={`${name} - ${specialty}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
              />
            ) : (
              <PlaceholderImage therapistId={therapist.id} displayName={therapist.displayName} />
            )}

            {/* Rating Badge */}
            {rating > 0 && (
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 text-sm font-medium text-neutral-900 shadow-sm backdrop-blur-sm">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
                <span className="font-semibold">{rating.toFixed(1)}</span>
                {reviewCount > 0 && (
                  <span className="text-xs text-neutral-500">({reviewCount})</span>
                )}
              </div>
            )}

            {/* Availability Badge */}
            {therapist.acceptingClients && (
              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-teal-500/95 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
                <CheckCircle2 className="h-3 w-3" aria-hidden />
                Verfügbar
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex flex-1 flex-col gap-4 p-6">
            {/* Name and Specialty */}
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 line-clamp-1 tracking-tight">
                {therapist.title} {name}
              </h3>
              <p className="mt-1.5 text-sm font-medium text-teal-600 line-clamp-1">
                {specialty}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-2.5 text-sm text-muted">
              <div className="flex items-start gap-2.5">
                <Heart className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-500" aria-hidden />
                <span className="line-clamp-2 leading-relaxed">{approach}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 flex-shrink-0 text-teal-500" aria-hidden />
                <span className="line-clamp-1">{location}</span>
              </div>
              {therapist.yearsExperience && (
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 flex-shrink-0 text-teal-500" aria-hidden />
                  <span>{therapist.yearsExperience} Jahre Erfahrung</span>
                </div>
              )}
            </div>

            {/* Price and Languages */}
            <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-4 text-sm">
              <span className="font-semibold text-neutral-900">{priceRange}</span>
              {therapist.languages.length > 0 && (
                <span className="text-xs text-neutral-500 line-clamp-1">
                  {therapist.languages.slice(0, 2).join(', ')}
                </span>
              )}
            </div>

            {/* CTA */}
            <span className="mt-2 flex items-center justify-center rounded-xl border-2 border-teal-100 bg-teal-50 py-3 text-sm font-semibold text-teal-700 transition-all duration-200 group-hover:border-teal-200 group-hover:bg-teal-100 group-hover:text-teal-800">
              Profil ansehen
            </span>
          </div>
        </article>
      </Link>
    </InteractiveCard>
  )
}
