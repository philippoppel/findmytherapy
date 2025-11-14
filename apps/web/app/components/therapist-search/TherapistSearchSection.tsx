import { prisma } from '@/lib/prisma'
import { TherapistGrid } from './TherapistGrid'
import { Reveal } from '../marketing/Reveal'
import { SectionHeading } from '../marketing/SectionHeading'
import { TherapistAmbientGlow } from './TherapistAmbientGlow'
import type { TherapistWithListing } from './types'

async function getTherapistsWithListings(): Promise<TherapistWithListing[]> {
  try {
    const therapists = await prisma.therapistProfile.findMany({
      where: {
        isPublic: true,
        status: 'VERIFIED',
        deletedAt: null,
      },
      select: {
        id: true,
        displayName: true,
        title: true,
        profileImageUrl: true,
        specialties: true,
        modalities: true,
        approachSummary: true,
        city: true,
        country: true,
        online: true,
        priceMin: true,
        priceMax: true,
        languages: true,
        yearsExperience: true,
        acceptingClients: true,
        availabilityNote: true,
        acceptedInsurance: true,
        ageGroups: true,
        rating: true,
        reviewCount: true,
        listings: {
          where: {
            status: 'ACTIVE',
            deletedAt: null,
          },
          select: {
            id: true,
            plan: true,
            status: true,
          },
          orderBy: {
            currentPeriodEnd: 'desc',
          },
        },
      },
      orderBy: [
        { updatedAt: 'desc' },
      ],
    })

    return therapists as TherapistWithListing[]
  } catch (error) {
    console.error('[TherapistSearchSection] Failed to fetch therapists:', error)
    return []
  }
}

export async function TherapistSearchSection() {
  const therapists = await getTherapistsWithListings()
  const cities = new Set<string>()
  const languages = new Set<string>()
  const specialties = new Set<string>()

  therapists.forEach((therapist) => {
    if (therapist.city) cities.add(therapist.city)
    therapist.languages.forEach((lang) => languages.add(lang))
    therapist.specialties.forEach((spec) => specialties.add(spec))
  })

  const stats = [
    { label: 'Verifizierte Profile', value: therapists.length.toString() },
    { label: 'Städte & online', value: `${cities.size} Regionen` },
    { label: 'Sprachen & Schwerpunkte', value: `${languages.size} Sprachen · ${specialties.size} Themen` },
  ]

  return (
    <section
      id="therapists"
      className="relative overflow-hidden bg-gradient-to-b from-white via-surface to-surface-1 py-16 sm:py-20 lg:py-24"
    >
      <TherapistAmbientGlow />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Therapeut:innen finden"
            title="Finde die passende Unterstützung"
            description="Verifizierte Therapeut:innen mit transparenten Profilen, Verfügbarkeiten und Schwerpunkten. Filter nach deinen Bedürfnissen."
            align="center"
            className="mb-12"
          />
        </Reveal>

        <Reveal className="mb-10 grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/30 bg-white/80 p-5 text-center shadow-sm backdrop-blur"
            >
              <p className="text-2xl font-semibold text-teal-700">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-neutral-600">{stat.label}</p>
            </div>
          ))}
        </Reveal>

        {therapists.length > 0 ? (
          <TherapistGrid therapists={therapists} />
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-8 py-16 text-center">
            <p className="text-lg font-semibold text-neutral-900">
              Keine Therapeut:innen verfügbar
            </p>
            <p className="mt-2 text-neutral-600">
              Bitte versuche es später erneut
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
