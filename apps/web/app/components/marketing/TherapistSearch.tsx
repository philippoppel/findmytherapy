'use client'

import { ArrowRight, MapPin, Star, Calendar, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'

const featuredTherapists = [
  {
    id: 1,
    name: 'Dr. Sarah Müller',
    image: '/images/therapists/therapy-1.jpg',
    specialty: 'Angststörungen & Depression',
    approach: 'Verhaltenstherapie',
    location: 'Wien, 1010',
    rating: 4.9,
    availability: 'Verfügbar ab nächster Woche',
    acceptsInsurance: true,
  },
  {
    id: 2,
    name: 'Mag. Thomas Berger',
    image: '/images/therapists/therapy-2.jpg',
    specialty: 'Traumatherapie & PTSD',
    approach: 'EMDR & Integrative Therapie',
    location: 'Wien, 1070',
    rating: 5.0,
    availability: 'Warteliste verfügbar',
    acceptsInsurance: true,
  },
  {
    id: 3,
    name: 'Mag. Lisa Wagner',
    image: '/images/therapists/therapy-3.jpg',
    specialty: 'Burnout & Stressmanagement',
    approach: 'Systemische Therapie',
    location: 'Online & Wien',
    rating: 4.8,
    availability: 'Sofort verfügbar',
    acceptsInsurance: true,
  },
]

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
]

export function TherapistSearch() {
  return (
    <section id="therapists" className="py-24 bg-gradient-to-b from-white to-surface-1">
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

        <div className="mb-10 grid gap-6 lg:grid-cols-3">
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
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-default backdrop-blur">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden />
                    {therapist.rating}
                  </div>
                  {therapist.availability === 'Sofort verfügbar' && (
                    <div className="absolute left-3 top-3 rounded-full bg-green-500/95 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                      Sofort verfügbar
                    </div>
                  )}
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
                  {therapist.acceptsInsurance && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-800">
                      Nimmt Kassenplätze an
                    </div>
                  )}
                  <Link
                    href={`/therapists/${therapist.id}`}
                    className="mt-auto flex w-full items-center justify-center gap-2 rounded-full border border-primary/30 bg-transparent px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary/5"
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
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:-translate-y-0.5 hover:from-teal-500 hover:to-cyan-500"
            >
              Alle Therapeut:innen durchsuchen
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <p className="mt-4 text-sm text-muted">
              Über 150 verifizierte Therapeut:innen in ganz Österreich
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
