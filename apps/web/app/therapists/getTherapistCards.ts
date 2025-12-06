import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import { getAvailabilityMeta } from './availability';
import {
  buildLocationTokens,
  getCityCoordinates,
  PLACEHOLDER_IMAGE_KEYWORDS,
  type Coordinates,
} from './location-data';
import type { TherapistCard } from './types';

type TherapistProfileWithUser = Awaited<
  ReturnType<typeof prisma.therapistProfile.findMany>
>[number];

export type GetTherapistCardsOptions = {
  limit?: number;
  offset?: number;
};

export type GetTherapistCardsResult = {
  therapists: TherapistCard[];
  total: number;
};

// Cached version of the database query - revalidates every 60 seconds
const getCachedTherapists = unstable_cache(
  async (limit?: number, offset?: number) => {
    const where = {
      isPublic: true,
      status: {
        in: ['VERIFIED', 'PENDING'],
      },
    } as const;

    const orderBy = [{ status: 'asc' }, { updatedAt: 'desc' }] as const;

    const select = {
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
      availabilityStatus: true,
      estimatedWaitWeeks: true,
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
      gender: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    } as const;

    const [total, profiles] = await Promise.all([
      prisma.therapistProfile.count({ where }),
      prisma.therapistProfile.findMany({
        where,
        orderBy,
        select,
        ...(limit !== undefined && { take: limit }),
        ...(offset !== undefined && { skip: offset }),
      }),
    ]);

    return { total, profiles };
  },
  ['therapist-cards'],
  { revalidate: 300, tags: ['therapists'] } // Cache for 5 minutes
);

export async function getTherapistCards(
  options?: GetTherapistCardsOptions,
): Promise<GetTherapistCardsResult> {
  const { limit, offset } = options || {};

  try {
    const { total, profiles } = await getCachedTherapists(limit, offset);

    return {
      therapists: profiles.map(transformProfileToCard),
      total,
    };
  } catch (error) {
    console.error('Failed to load therapists from database, using fallback cards.', error);
    const fallback = getFallbackTherapists();
    return {
      therapists: fallback,
      total: fallback.length,
    };
  }
}

function transformProfileToCard(profile: TherapistProfileWithUser): TherapistCard {
  const displayName =
    profile.displayName ?? `${profile.user.firstName ?? ''} ${profile.user.lastName ?? ''}`.trim();
  const city = profile.city?.trim() || null;
  const locationLabel = buildLocationLabel(city, profile.online);
  const coordinates: Coordinates | null =
    profile.latitude != null && profile.longitude != null
      ? { lat: profile.latitude, lng: profile.longitude }
      : getCityCoordinates(city);

  const availabilityMeta = getAvailabilityMeta(profile.availabilityNote, profile.acceptingClients);

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
    availabilityStatus: profile.availabilityStatus,
    estimatedWaitWeeks: profile.estimatedWaitWeeks,
    languages: profile.languages ?? [],
    rating: profile.rating ?? 0,
    reviews: profile.reviewCount ?? 0,
    experience: profile.yearsExperience
      ? `${profile.yearsExperience} Jahre Praxis`
      : 'Praxiserfahrung',
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
    gender: normalizeGender(profile.gender),
  };
}

function deriveFormatTags(location: string, online: boolean): TherapistCard['formatTags'] {
  const tags = new Set<TherapistCard['formatTags'][number]>();

  // Check if therapist has a physical location (not just "Online")
  const hasPhysicalLocation = location && location.toLowerCase() !== 'online';

  // Add format tags based on service offering
  if (hasPhysicalLocation) {
    tags.add('praesenz');
  }

  if (online) {
    tags.add('online');
  }

  // If both online and physical location, also add hybrid
  if (hasPhysicalLocation && online) {
    tags.add('hybrid');
  }

  return Array.from(tags);
}

function getProfileImage(profile: { profileImageUrl?: string | null }) {
  const candidate = profile.profileImageUrl?.trim();
  if (!candidate || candidate.endsWith('default.jpg')) {
    return null;
  }

  if (PLACEHOLDER_IMAGE_KEYWORDS.some((placeholder) => candidate.includes(placeholder))) {
    return null;
  }

  return candidate;
}

function getInitials(name: string) {
  if (!name) {
    return '??';
  }
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  const initials = `${first}${last}`.toUpperCase();
  return initials || '??';
}

function buildLocationLabel(city: string | null, online: boolean) {
  if (!city && online) {
    return 'Online';
  }
  if (!city) {
    return 'Vor Ort';
  }
  if (online) {
    return `${city} · Online`;
  }
  return city;
}

function normalizeGender(
  value: string | null | undefined,
): TherapistCard['gender'] {
  if (!value) return null;
  const lower = value.toLowerCase();
  if (lower === 'male' || lower === 'männlich') return 'male';
  if (lower === 'female' || lower === 'weiblich') return 'female';
  if (lower === 'diverse' || lower === 'divers') return 'diverse';
  return null;
}

function getFallbackTherapists(): TherapistCard[] {
  const cards = [
    {
      id: 'fallback-1',
      name: 'MMag. Dr. Gregor Studlar BA',
      title: 'Psychotherapeut (VT)',
      focus: ['Angststörungen', 'Depression', 'Burnout'],
      approach: 'Verhaltenstherapie mit Fokus auf Evidenz und Alltagstauglichkeit',
      city: 'Linz',
      online: true,
      availability: 'Sofort verfügbar',
      availabilityRank: 1,
      availabilityStatus: 'AVAILABLE' as const,
      estimatedWaitWeeks: 0,
      languages: ['Deutsch', 'Englisch'],
      rating: 4.9,
      reviews: 42,
      experience: '10+ Jahre Praxis',
      image: '/images/team/gregorstudlar.jpg',
      priceMin: 11000,
      priceMax: 14000,
      acceptedInsurance: ['Selbstzahler', 'Private'],
      ageGroups: ['Erwachsene'],
      modalities: ['CBT', 'Traumatherapie'],
      formatTags: ['hybrid'] as TherapistCard['formatTags'],
      gender: 'male' as const,
    },
    {
      id: 'fallback-2',
      name: 'Thomas Kaufmann, BA pth.',
      title: 'Psychotherapeut i.A.u.S (VT)',
      focus: ['Krisen', 'Panik', 'Stress'],
      approach: 'Strukturierte Begleitung mit Schwerpunkt Akutintervention',
      city: 'Wien',
      online: true,
      availability: 'Warteliste (kurzfristig)',
      availabilityRank: 2,
      availabilityStatus: 'LIMITED' as const,
      estimatedWaitWeeks: 2,
      languages: ['Deutsch', 'Englisch'],
      rating: 4.8,
      reviews: 31,
      experience: 'Paramedic background, SFU Wien',
      image: '/images/team/thomaskaufmann.jpeg',
      priceMin: 9000,
      priceMax: 12000,
      acceptedInsurance: ['Selbstzahler'],
      ageGroups: ['Erwachsene', 'Studierende'],
      modalities: ['CBT'],
      formatTags: ['hybrid'] as TherapistCard['formatTags'],
      gender: 'male' as const,
    },
    {
      id: 'fallback-3',
      name: 'Dipl. Ing. Philipp Oppel',
      title: 'Coach & Technologe',
      focus: ['ADHS & Struktur', 'Performance', 'Digitale Balance'],
      approach: 'Coaching mit klaren, umsetzbaren Strategien für den Alltag',
      city: 'Graz',
      online: true,
      availability: 'Freie Kapazitäten',
      availabilityRank: 1,
      availabilityStatus: 'AVAILABLE' as const,
      estimatedWaitWeeks: 0,
      languages: ['Deutsch', 'Englisch'],
      rating: 4.7,
      reviews: 19,
      experience: 'Product & Engineering Lead',
      image: '/images/team/philippoppel.jpeg',
      priceMin: 8000,
      priceMax: 10000,
      acceptedInsurance: ['Selbstzahler'],
      ageGroups: ['Erwachsene'],
      modalities: ['Coaching'],
      formatTags: ['online'] as TherapistCard['formatTags'],
      gender: 'male' as const,
    },
  ];

  return cards.map((card) => {
    const location = buildLocationLabel(card.city, card.online);
    return {
      id: card.id,
      name: card.name,
      title: card.title,
      focus: card.focus,
      approach: card.approach,
      location,
      city: card.city,
      coordinates: getCityCoordinates(card.city),
      availability: card.availability,
      availabilityRank: card.availabilityRank,
      availabilityStatus: card.availabilityStatus,
      estimatedWaitWeeks: card.estimatedWaitWeeks,
      languages: card.languages,
      rating: card.rating,
      reviews: card.reviews,
      experience: card.experience,
      image: card.image,
      initials: getInitials(card.name),
      status: 'VERIFIED',
      formatTags: card.formatTags,
      locationTokens: buildLocationTokens(card.city, location),
      priceMin: card.priceMin,
      priceMax: card.priceMax,
      acceptedInsurance: card.acceptedInsurance,
      ageGroups: card.ageGroups,
      modalities: card.modalities,
      gender: card.gender,
    };
  });
}
