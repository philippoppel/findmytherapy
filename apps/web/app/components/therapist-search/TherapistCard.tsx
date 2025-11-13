'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Calendar, Heart, CheckCircle2 } from 'lucide-react'
import type { TherapistWithListing } from './types'

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
  const initials = getInitials(name)
  const specialty = therapist.specialties[0] || 'Psychotherapie'
  const approach = therapist.approachSummary || therapist.modalities[0] || 'Individuelle Begleitung'
  const location = formatLocation(therapist.city, therapist.online)
  const rating = therapist.rating || 0
  const reviewCount = therapist.reviewCount || 0
  const priceRange = formatPrice(therapist.priceMin, therapist.priceMax)

  return (
    <Link href={`/therapists/${therapist.id}`}>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
        {/* Image Section */}
        <div className="relative h-48 w-full overflow-hidden">
          {therapist.profileImageUrl ? (
            <Image
              src={therapist.profileImageUrl}
              alt={`${name} - ${specialty}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-4xl font-semibold uppercase text-white">
              <span>{initials}</span>
            </div>
          )}

          {/* Rating Badge */}
          {rating > 0 && (
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 text-sm font-semibold text-neutral-900 shadow-md backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
              {rating.toFixed(1)}
              {reviewCount > 0 && (
                <span className="text-xs text-neutral-600">({reviewCount})</span>
              )}
            </div>
          )}

          {/* Availability Badge */}
          {therapist.acceptingClients && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-emerald-500/95 px-2.5 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-sm">
              <CheckCircle2 className="h-3 w-3" aria-hidden />
              Verfügbar
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          {/* Name and Specialty */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1">
              {therapist.title} {name}
            </h3>
            <p className="mt-0.5 text-sm font-medium text-primary-600 line-clamp-1">
              {specialty}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm text-neutral-600">
            <div className="flex items-start gap-2">
              <Heart className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400" aria-hidden />
              <span className="line-clamp-1">{approach}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0 text-neutral-400" aria-hidden />
              <span className="line-clamp-1">{location}</span>
            </div>
            {therapist.yearsExperience && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 flex-shrink-0 text-neutral-400" aria-hidden />
                <span>{therapist.yearsExperience} Jahre Erfahrung</span>
              </div>
            )}
          </div>

          {/* Price and Languages */}
          <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-600">
            <span className="font-medium">{priceRange}</span>
            {therapist.languages.length > 0 && (
              <span className="line-clamp-1">{therapist.languages.slice(0, 2).join(', ')}</span>
            )}
          </div>

          {/* CTA */}
          <div className="mt-1 flex items-center justify-center rounded-lg border border-primary-200 bg-primary-50 py-2.5 text-sm font-medium text-primary-700 transition-colors group-hover:border-primary-300 group-hover:bg-primary-100">
            Profil ansehen
          </div>
        </div>
      </article>
    </Link>
  )
}

function getInitials(name: string) {
  if (!name) return '??'
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  const initials = `${first}${last}`.toUpperCase()
  return initials || '??'
}
