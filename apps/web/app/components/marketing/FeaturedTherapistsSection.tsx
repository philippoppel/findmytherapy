import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FeaturedTherapistsClient } from './FeaturedTherapistsClient'
import type { TherapistWithListing } from '../therapist-search/types'

async function getFeaturedTherapists(): Promise<TherapistWithListing[]> {
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
      orderBy: [{ updatedAt: 'desc' }],
      take: 6, // Only show 6 featured therapists
    })

    return therapists as TherapistWithListing[]
  } catch (error) {
    console.error('[FeaturedTherapistsSection] Failed to fetch therapists:', error)
    return []
  }
}

export async function FeaturedTherapistsSection() {
  const therapists = await getFeaturedTherapists()

  if (therapists.length === 0) {
    return null
  }

  const stats = {
    total: therapists.length,
    accepting: therapists.filter((t) => t.acceptingClients).length,
    online: therapists.filter((t) => t.online).length,
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface via-white to-surface py-20 sm:py-24 lg:py-32">
      <FeaturedTherapistsClient therapists={therapists} stats={stats} />
    </section>
  )
}
