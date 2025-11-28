/**
 * Therapist Profile Test Fixtures
 *
 * Factory functions for creating test therapist profiles
 */

import { TherapistProfile, TherapistStatus } from '@prisma/client';

type CreateTherapistProfileInput = {
  userId: string;
  status?: TherapistStatus;
  displayName?: string;
  title?: string;
  headline?: string;
  city?: string;
  country?: string;
  online?: boolean;
  acceptingClients?: boolean;
  yearsExperience?: number;
  priceMin?: number;
  priceMax?: number;
  specialties?: string[];
  modalities?: string[];
  languages?: string[];
  isPublic?: boolean;
  // New filter fields
  gender?: 'male' | 'female' | 'diverse' | null;
  acceptedInsurance?: string[];
  ageGroups?: string[];
  availabilityStatus?: 'AVAILABLE' | 'LIMITED' | 'WAITLIST' | 'UNAVAILABLE';
  estimatedWaitWeeks?: number | null;
};

let profileCounter = 0;

/**
 * Create a test therapist profile
 */
export function createTestTherapistProfile(
  input: CreateTherapistProfileInput,
): Omit<TherapistProfile, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  profileCounter++;

  return {
    userId: input.userId,
    status: input.status || 'VERIFIED',
    adminNotes: null,
    licenseAuthority: 'Österreichische Psychotherapeutenkammer',
    licenseId: `LIC-${profileCounter.toString().padStart(6, '0')}`,
    displayName: input.displayName || `Dr. Therapeut ${profileCounter}`,
    title: input.title || 'Dr.',
    headline: input.headline || 'Erfahrene Psychotherapeutin mit Schwerpunkt Verhaltenstherapie',
    profileImageUrl: null,
    approachSummary: 'Verhaltenstherapie mit systemischen Elementen',
    experienceSummary: `Über ${input.yearsExperience || 10} Jahre Erfahrung in der klinischen Praxis`,
    services: ['Einzeltherapie', 'Paartherapie', 'Online-Beratung'],
    videoUrl: null,
    acceptingClients: input.acceptingClients ?? true,
    yearsExperience: input.yearsExperience || 10,
    rating: 4.8,
    reviewCount: 42,
    responseTime: '24h',
    modalities: input.modalities || ['Verhaltenstherapie', 'Systemische Therapie'],
    specialties: input.specialties || ['Angststörungen', 'Depression', 'Burnout'],
    priceMin: input.priceMin || 8000, // 80.00 EUR
    priceMax: input.priceMax || 12000, // 120.00 EUR
    languages: input.languages || ['Deutsch', 'Englisch'],
    online: input.online ?? true,
    city: input.city || 'Wien',
    country: input.country || 'AT',
    about:
      'Ich bin eine erfahrene Psychotherapeutin mit Schwerpunkt auf Verhaltenstherapie und systemischen Ansätzen.',
    availabilityNote: 'Termine von Mo-Fr 9:00-18:00 Uhr verfügbar',
    pricingNote: 'Kassenplätze nach Verfügbarkeit',
    isPublic: input.isPublic ?? true,
    // New filter fields
    gender: input.gender ?? (profileCounter % 3 === 0 ? 'male' : 'female'),
    acceptedInsurance: input.acceptedInsurance ?? ['ÖGK', 'SVS'],
    ageGroups: input.ageGroups ?? ['Erwachsene'],
    availabilityStatus: input.availabilityStatus ?? 'AVAILABLE',
    estimatedWaitWeeks: input.estimatedWaitWeeks ?? 1,
    latitude: 48.2082,
    longitude: 16.3738,
  };
}

/**
 * Create a pending (unverified) therapist profile
 */
export function createPendingTherapistProfile(userId: string) {
  return createTestTherapistProfile({
    userId,
    status: 'PENDING',
    isPublic: false,
    acceptingClients: false,
  });
}

/**
 * Create a verified therapist profile with specific specialties
 */
export function createSpecializedTherapistProfile(userId: string, specialties: string[]) {
  return createTestTherapistProfile({
    userId,
    specialties,
    status: 'VERIFIED',
    isPublic: true,
  });
}

/**
 * Reset the profile counter (useful for test isolation)
 */
export function resetProfileCounter() {
  profileCounter = 0;
}
