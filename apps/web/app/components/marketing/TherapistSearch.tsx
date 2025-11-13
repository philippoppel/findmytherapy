import { ArrowRight, MapPin, Star, Calendar, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { prisma } from '@/lib/prisma'

import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

type FeaturedTherapistCard = {
  id: string
  href: string
  name: string
  image: string
  specialty: string
  approach: string
  location: string
  rating: number
  reviewCount: number
  availability: string
  acceptingClients: boolean
}

const searchFeatures = [
  {
    icon: MapPin,
    title: 'Standort & Online',
    description: 'Filter nach Bezirk, Stadt oder remote Therapie',
  },
  {
    icon: Heart,
    title: 'Schwerpunkte',
    description: 'Finde Expert:innen für dein spezifisches Thema',
  },
  {
    icon: Calendar,
    title: 'Verfügbarkeit',
    description: 'Sieh direkt freie Termine und Wartelisten',
  },
  {
    icon: Star,
    title: 'Verifiziert',
    description: 'Alle Profile sind von uns geprüft',
  },
] as const

const fallbackTherapists: FeaturedTherapistCard[] = [
  {
    id: 'fallback-1',
    href: '/therapists',
    name: 'Dr. Sarah Müller',
    image: '/images/therapists/therapy-1.jpg',
    specialty: 'Angststörungen & Depression',
    approach: 'Verhaltenstherapie',
    location: 'Wien, 1010',
    rating: 4.9,
    reviewCount: 128,
    availability: 'Verfügbar ab nächster Woche',
    acceptingClients: true,
  },
  {
    id: 'fallback-2',
    href: '/therapists',
    name: 'Mag. Thomas Berger',
    image: '/images/therapists/therapy-2.jpg',
    specialty: 'Traumatherapie & PTSD',
    approach: 'EMDR & Integrative Therapie',
    location: 'Wien, 1070',
    rating: 5.0,
    reviewCount: 92,
    availability: 'Warteliste verfügbar',
    acceptingClients: false,
  },
  {
    id: 'fallback-3',
    href: '/therapists',
    name: 'Mag. Lisa Wagner',
    image: '/images/therapists/therapy-3.jpg',
    specialty: 'Burnout & Stressmanagement',
    approach: 'Systemische Therapie',
    location: 'Online & Wien',
    rating: 4.8,
    reviewCount: 76,
    availability: 'Sofort verfügbar',
    acceptingClients: true,
  },
]

const fallbackImages = [
  '/images/therapists/therapy-1.jpg',
  '/images/therapists/therapy-2.jpg',
  '/images/therapists/therapy-3.jpg',
  '/images/therapists/therapy-4.jpg',
]

function formatLocation(city?: string | null, country?: string | null, online?: boolean) {
  const parts: string[] = []

  if (city) {
    parts.push(city)
  }

  if (online) {
    parts.push('Online')
  }

  if (parts.length === 0) {
    if (country) {
      return country === 'AT' ? 'Österreichweit' : country
    }

    return 'Standort auf Anfrage'
  }

  return parts.join(' · ')
}

function pickFallbackImage(index: number) {
  return fallbackImages[index % fallbackImages.length]
}

export async function TherapistSearch() {
  let therapists: Array<{
    id: string
    displayName: string | null
    profileImageUrl: string | null
    specialties: string[]
    approachSummary: string | null
    city: string | null
    country: string | null
    online: boolean
    availabilityNote: string | null
    acceptingClients: boolean
  }> = []

  try {
    therapists = await prisma.therapistProfile.findMany({
      where: {
        isPublic: true,
        status: 'VERIFIED',
      },
      select: {
        id: true,
        displayName: true,
        profileImageUrl: true,
        specialties: true,
        approachSummary: true,
        city: true,
        country: true,
        online: true,
        availabilityNote: true,
        acceptingClients: true,
      },
      orderBy: [
        { updatedAt: 'desc' },
      ],
      take: 3,
    })
  } catch (error) {
    console.error('[TherapistSearch] Failed to fetch therapists:', error)
    // Return empty array on DB error - component will show fallback state
    therapists = []
  }

  const featuredTherapists =
    therapists.length > 0
      ? therapists.map((therapist, index): FeaturedTherapistCard => {
          return {
            id: therapist.id,
            href: `/therapists/${therapist.id}`,
            name: therapist.displayName ?? 'Therapeut:in',
            image: therapist.profileImageUrl ?? pickFallbackImage(index),
            specialty: therapist.specialties?.[0] ?? 'Psychotherapie',
            approach: therapist.approachSummary ?? 'Individuelle Begleitung',
            location: formatLocation(therapist.city, therapist.country, therapist.online),
            rating: 4.8,
            reviewCount: 0,
            availability: therapist.availabilityNote ?? 'Termine auf Anfrage',
            acceptingClients: Boolean(therapist.acceptingClients),
          }
        })
      : fallbackTherapists

  return (
    <section id="therapists" className="bg-gradient-to-b from-white to-surface-1 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Therapeut:innen finden"
            title="Finde die passende Unterstützung"
            description="Verifizierte Therapeut:innen mit transparenten Profilen, Verfügbarkeiten und Schwerpunkten. Filter nach deinen Bedürfnissen."
            align="center"
            className="mb-12"
          />
        </Reveal>

        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {searchFeatures.map((feature, index) => (
            <Reveal key={feature.title} delay={100 + index * 50}>
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-divider bg-white p-6 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" aria-hidden />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-default">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted">{feature.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredTherapists.map((therapist, index) => (
            <Reveal key={therapist.id} delay={200 + index * 100} variant="scale">
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-divider bg-white shadow-lg transition-all hover:shadow-xl">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={therapist.image}
                    alt={`${therapist.name} - ${therapist.specialty}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-default shadow-sm backdrop-blur">
                    <Star className="h-4 w-4 text-yellow-500" aria-hidden />
                    {therapist.rating.toFixed(1)}
                    {therapist.reviewCount > 0 ? (
                      <span className="text-xs text-muted">({therapist.reviewCount})</span>
                    ) : null}
                  </div>
                  {therapist.acceptingClients ? (
                    <div className="absolute left-3 top-3 rounded-full bg-emerald-500/95 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur">
                      Freie Kapazitäten
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div>
                    <h3 className="text-xl font-semibold text-default">{therapist.name}</h3>
                    <p className="mt-1 text-sm font-medium text-primary">{therapist.specialty}</p>
                  </div>
                  <div className="space-y-2 text-sm text-muted">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 flex-shrink-0" aria-hidden />
                      <span>{therapist.approach}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden />
                      <span>{therapist.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 flex-shrink-0" aria-hidden />
                      <span>{therapist.availability}</span>
                    </div>
                  </div>
                  {therapist.acceptingClients ? (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                      Nimmt neue Klient:innen an
                    </div>
                  ) : (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                      Warteliste auf Anfrage
                    </div>
                  )}
                  <Link
                    href={therapist.href}
                    className="mt-auto flex w-full items-center justify-center gap-2 rounded-full border border-primary/30 bg-transparent px-5 py-3 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    Profil ansehen
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={500}>
          <div className="text-center">
            <Link
              href="/therapists"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary-900/20 transition hover:-translate-y-0.5 hover:from-primary-500 hover:to-primary-600"
            >
              Alle Therapeut:innen durchsuchen
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <p className="mt-4 text-sm text-muted">Über 150 verifizierte Therapeut:innen in ganz Österreich</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
