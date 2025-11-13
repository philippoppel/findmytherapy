'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Calendar, Heart, CheckCircle2, Award, Sparkles } from 'lucide-react'
import type { TherapistWithListing } from './types'

interface TherapistCardPremiumProps {
  therapist: TherapistWithListing
}

const fallbackImages = [
  '/images/therapists/therapy-1.jpg',
  '/images/therapists/therapy-2.jpg',
  '/images/therapists/therapy-3.jpg',
  '/images/therapists/therapy-4.jpg',
]

function pickFallbackImage(id: string) {
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return fallbackImages[index % fallbackImages.length]
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

export function TherapistCardPremium({ therapist }: TherapistCardPremiumProps) {
  const imageUrl = therapist.profileImageUrl || pickFallbackImage(therapist.id)
  const name = therapist.displayName || 'Therapeut:in'
  const specialty = therapist.specialties[0] || 'Psychotherapie'
  const approach = therapist.approachSummary || therapist.modalities[0] || 'Individuelle Begleitung'
  const location = formatLocation(therapist.city, therapist.online)
  const rating = therapist.rating || 0
  const reviewCount = therapist.reviewCount || 0
  const priceRange = formatPrice(therapist.priceMin, therapist.priceMax)

  return (
    <Link href={`/therapists/${therapist.id}`}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl">
        {/* Premium Gold Gradient Border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[2px]">
          <div className="h-full w-full rounded-3xl bg-white" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex h-full flex-col">
          {/* Premium Badge - Top Center */}
          <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 translate-y-3">
            <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              PREMIUM PARTNER
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
            </div>
          </div>

          {/* Image Section - Larger than standard */}
          <div className="relative h-56 w-full overflow-hidden rounded-t-3xl">
            <Image
              src={imageUrl}
              alt={`${name} - ${specialty}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority
            />

            {/* Gold Glow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent" />

            {/* Rating Badge */}
            {rating > 0 && (
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-2 text-sm font-bold text-neutral-900 shadow-lg backdrop-blur-sm">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                {rating.toFixed(1)}
                {reviewCount > 0 && (
                  <span className="text-xs font-semibold text-neutral-600">({reviewCount})</span>
                )}
              </div>
            )}

            {/* Availability Badge */}
            {therapist.acceptingClients && (
              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-emerald-500/95 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                Sofort verfügbar
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex flex-1 flex-col gap-4 p-6">
            {/* Name and Specialty */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-neutral-900 line-clamp-1">
                  {therapist.title} {name}
                </h3>
                <Award className="h-5 w-5 flex-shrink-0 text-amber-500" aria-hidden />
              </div>
              <p className="mt-1 text-base font-semibold text-amber-600 line-clamp-1">
                {specialty}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-2.5 text-sm text-neutral-700">
              <div className="flex items-start gap-2.5">
                <Heart className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" aria-hidden />
                <span className="font-medium line-clamp-2">{approach}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 flex-shrink-0 text-amber-500" aria-hidden />
                <span className="font-medium line-clamp-1">{location}</span>
              </div>
              {therapist.yearsExperience && (
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 flex-shrink-0 text-amber-500" aria-hidden />
                  <span className="font-medium">{therapist.yearsExperience} Jahre Erfahrung</span>
                </div>
              )}
            </div>

            {/* Specialties Pills */}
            {therapist.specialties.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {therapist.specialties.slice(0, 3).map((specialty) => (
                  <span
                    key={specialty}
                    className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-200"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            )}

            {/* Price and Languages */}
            <div className="flex items-center justify-between border-t border-amber-100 pt-3 text-sm font-semibold text-neutral-700">
              <span>{priceRange}</span>
              {therapist.languages.length > 0 && (
                <span className="text-xs text-neutral-600 line-clamp-1">
                  {therapist.languages.slice(0, 2).join(', ')}
                </span>
              )}
            </div>

            {/* Premium CTA */}
            <div className="mt-2 flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 py-3.5 text-sm font-bold text-white shadow-lg transition-all group-hover:from-amber-600 group-hover:via-amber-700 group-hover:to-amber-800 group-hover:shadow-xl">
              Profil ansehen
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
