import type { Metadata } from 'next'
import Link from 'next/link'
import { Compass, Sparkles } from 'lucide-react'

import { prisma } from '@/lib/prisma'
import { TherapistDirectory, type TherapistCard } from './TherapistDirectory'

// Force dynamic rendering to prevent database access during build
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Therapeut:innen entdecken – FindMyTherapy',
  description:
    'Finde zertifizierte Therapeut:innen mit klarer Spezialisierung, verfügbaren Terminen und transparenten Therapieschwerpunkten.',
}

export default async function TherapistsPage() {
  const profiles = await prisma.therapistProfile.findMany({
    where: { isPublic: true },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  })

  const therapists: TherapistCard[] = profiles.map((profile) => ({
    id: profile.id,
    name: profile.displayName ?? `${profile.user.firstName ?? ''} ${profile.user.lastName ?? ''}`.trim(),
    title: profile.title ?? 'Psychotherapie',
    focus: profile.specialties.slice(0, 3),
    approach: profile.approachSummary ?? 'Integrative Psychotherapie',
    location: profile.online ? `${profile.city ?? 'Online'} · Online` : profile.city ?? 'Vor Ort',
    availability: profile.availabilityNote ?? 'Auf Anfrage',
    languages: profile.languages,
    rating: profile.rating ?? 0,
    reviews: profile.reviewCount ?? 0,
    experience: profile.yearsExperience ? `${profile.yearsExperience} Jahre Praxis` : 'Praxiserfahrung',
    image: profile.profileImageUrl ?? '/images/therapists/default.jpg',
    status: profile.status,
    formatTags: deriveFormatTags(profile.city ?? '', profile.online),
  }))

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-950 via-neutral-900 to-primary-950 py-12">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -bottom-32 right-4 h-80 w-80 rounded-full bg-primary-1000/25 blur-3xl" />
      </div>
      <section className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-end">
          <Link href="/" className="text-sm font-medium text-white/70 transition hover:text-white">
            Zur Startseite
          </Link>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur">
          <div className="relative space-y-8 text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
              <Sparkles className="h-4 w-4" />
              Kuratiertes Pilotnetzwerk
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Finde die Therapeut:in, die zu deinem Bedarf passt
              </h1>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/85 md:mx-0">
                Unser Care-Team validiert Qualifikationen, Schwerpunkte und Kapazitäten. Starte mit einer Ersteinschätzung und erhalte Empfehlungen, die zu deinen Antworten passen.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-start">
              <Link
                href="/triage"
                prefetch={false}
                className="inline-flex items-center rounded-full bg-primary-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                <Compass className="mr-2 h-4 w-4" /> Ersteinschätzung starten
              </Link>
              <Link
                href="/contact"
                prefetch={false}
                className="text-sm font-semibold text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                Persönliche Beratung anfordern
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold text-white">Ausgewählte Pilot-Therapeut:innen</h2>
                <p className="mt-2 text-base text-white/70">
                  Transparente Profile mit Fokus, Verfügbarkeit und Praxisdetails – abgestimmt auf unsere Ersteinschätzung.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70">
                <Sparkles className="h-4 w-4 text-primary-400" />
                Kuratiertes Netzwerk
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
