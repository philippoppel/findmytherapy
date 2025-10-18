import type { Metadata } from 'next'
import Link from 'next/link'
import { Compass, Sparkles } from 'lucide-react'

import { seedTherapists } from '@mental-health/db'
import { TherapistDirectory, type TherapistCard } from './TherapistDirectory'

export const metadata: Metadata = {
  title: 'Therapeut:innen entdecken – Klarthera',
  description:
    'Finde zertifizierte Therapeut:innen mit klarer Spezialisierung, verfügbaren Terminen und transparenten Therapieschwerpunkten.',
}

export default function TherapistsPage() {
  const therapists: TherapistCard[] = seedTherapists
    .filter((therapist) => therapist.profile.isPublic)
    .map((therapist) => ({
      name: therapist.displayName,
      title: therapist.title,
      focus: therapist.focus,
    approach: therapist.approach,
    location: therapist.location,
    availability: therapist.availability,
    languages: therapist.languages,
    rating: therapist.rating,
    reviews: therapist.reviews,
    experience: therapist.experience,
    image: therapist.image,
    status: therapist.profile.status,
      formatTags: deriveFormatTags(therapist.location, therapist.profile.online),
    }))

  return (
    <div className="bg-surface">
      <section className="relative overflow-hidden bg-white py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 right-[-4rem] h-80 w-80 rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-[-2rem] h-72 w-72 rounded-full bg-blue-50/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-center">
            <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1 text-sm font-semibold text-primary shadow-sm">
              Verlässliche Therapeut:innen - Klarthera Netzwerk
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-default md:text-5xl">
              Finde die richtige Therapeut:in für deine Situation
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
              Klarthera kuratiert Expert:innen mit überprüften Qualifikationen, Spezialisierungen und freien Kapazitäten.
              Starte mit einer Ersteinschätzung und erhalte maßgeschneiderte Empfehlungen.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/triage"
                className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <Compass className="mr-2 h-4 w-4" /> Ersteinschätzung starten
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Persönliche Beratung anfordern
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 rounded-3xl border border-divider bg-white/80 p-8 shadow-md shadow-primary/10 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-left text-3xl font-semibold text-default">
                  Ausgewählte Klarthera-Therapeut:innen
                </h2>
                <p className="mt-2 text-base text-muted">
                  Detaillierte Profile, transparente Spezialisierungen und aktuelle Verfügbarkeiten – alles an einem Ort.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-full border border-divider bg-surface-1 px-4 py-2 text-sm text-muted">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Kuratiertes Beispiel. Austausch jederzeit möglich.</span>
              </div>
            </div>
            <TherapistDirectory therapists={therapists} />
          </div>
        </div>
      </section>
    </div>
  )
}

function deriveFormatTags(location: string, online: boolean): TherapistCard['formatTags'] {
  const tags = new Set<TherapistCard['formatTags'][number]>()

  if (online) {
    tags.add('online')
  }

  const lowerLocation = location.toLowerCase()
  if (lowerLocation.includes('präsenz') || lowerLocation.includes('praesenz')) {
    tags.add('praesenz')
  }
  if (lowerLocation.includes('hybrid')) {
    tags.add('hybrid')
  }
  if (lowerLocation.includes('online')) {
    tags.add('online')
  }

  return Array.from(tags)
}
