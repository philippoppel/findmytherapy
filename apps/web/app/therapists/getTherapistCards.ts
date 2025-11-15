import { prisma } from '@/lib/prisma'
import { getAvailabilityMeta } from './availability'
import {
  buildLocationTokens,
  getCityCoordinates,
  PLACEHOLDER_IMAGE_KEYWORDS,
  type Coordinates,
} from './location-data'
import type { TherapistCard } from './types'

type TherapistProfileWithUser = Awaited<
  ReturnType<typeof prisma.therapistProfile.findMany>
>[number]

export async function getTherapistCards(): Promise<TherapistCard[]> {
  const profiles = await prisma.therapistProfile.findMany({
    where: {
      isPublic: true,
      status: {
        in: ['VERIFIED', 'PENDING'],
      },
    },
    orderBy: [
      { status: 'asc' },
      { updatedAt: 'desc' },
    ],
    select: {
      id: true,
      displayName: true,
      title: true,
      specialties: true,
      approachSummary: true,
      city: true,
      online: true,
      latitude: true,
      longitude: true,
      availabilityNote: true,
      acceptingClients: true,
      languages: true,
      rating: true,
      reviewCount: true,
      yearsExperience: true,
      profileImageUrl: true,
      status: true,
      priceMin: true,
      priceMax: true,
      acceptedInsurance: true,
      ageGroups: true,
      modalities: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  })

  return profiles.map(transformProfileToCard)
}

function transformProfileToCard(profile: TherapistProfileWithUser): TherapistCard {
  const displayName =
    profile.displayName ?? `${profile.user.firstName ?? ''} ${profile.user.lastName ?? ''}`.trim()
  const city = profile.city?.trim() || null
  const locationLabel = buildLocationLabel(city, profile.online)
  const coordinates: Coordinates | null =
    profile.latitude != null && profile.longitude != null
      ? { lat: profile.latitude, lng: profile.longitude }
      : getCityCoordinates(city)

  const availabilityMeta = getAvailabilityMeta(profile.availabilityNote, profile.acceptingClients)

  return {
    id: profile.id,
    name: displayName,
    title: profile.title ?? 'Psychotherapie',
    focus: (profile.specialties ?? []).slice(0, 3),
    approach: profile.approachSummary ?? 'Integrative Psychotherapie',
    location: locationLabel,
    city,
    coordinates,
    availability: availabilityMeta.label,
    availabilityRank: availabilityMeta.rank,
    languages: profile.languages ?? [],
    rating: profile.rating ?? 0,
    reviews: profile.reviewCount ?? 0,
    experience: profile.yearsExperience ? `${profile.yearsExperience} Jahre Praxis` : 'Praxiserfahrung',
    image: getProfileImage(profile),
    initials: getInitials(displayName),
    status: profile.status,
    formatTags: deriveFormatTags(profile.city ?? '', profile.online),
    locationTokens: buildLocationTokens(city, locationLabel),
    priceMin: profile.priceMin ?? undefined,
    priceMax: profile.priceMax ?? undefined,
    acceptedInsurance: profile.acceptedInsurance ?? [],
    ageGroups: profile.ageGroups ?? [],
    modalities: profile.modalities ?? [],
  }
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

function getProfileImage(profile: { profileImageUrl?: string | null }) {
  const candidate = profile.profileImageUrl?.trim()
  if (!candidate || candidate.endsWith('default.jpg')) {
    return null
  }

  if (PLACEHOLDER_IMAGE_KEYWORDS.some((placeholder) => candidate.includes(placeholder))) {
    return null
  }

  return candidate
}

function getInitials(name: string) {
  if (!name) {
    return '??'
  }
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  const initials = `${first}${last}`.toUpperCase()
  return initials || '??'
}

function buildLocationLabel(city: string | null, online: boolean) {
  if (!city && online) {
    return 'Online'
  }
  if (!city) {
    return 'Vor Ort'
  }
  if (online) {
    return `${city} · Online`
  }
  return city
}
