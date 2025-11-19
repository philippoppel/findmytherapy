import {
  calculateMatchScore,
  calculateDistanceKm,
} from '../score-calculator'
import type {
  MatchingPreferencesInput,
  TherapistForMatching,
} from '../types'

// Test-Fixtures
const createMockTherapist = (overrides: Partial<TherapistForMatching> = {}): TherapistForMatching => ({
  id: 'test-therapist-1',
  displayName: 'Dr. Test Therapeut',
  title: 'Klinische Psychologin',
  specialties: ['Angststörungen', 'Depression', 'Burnout'],
  modalities: ['Verhaltenstherapie', 'EMDR'],
  languages: ['Deutsch', 'Englisch'],
  online: true,
  city: 'Wien',
  latitude: 48.2082,
  longitude: 16.3738,
  availabilityStatus: 'AVAILABLE',
  estimatedWaitWeeks: 2,
  nextAvailableDate: null,
  priceMin: 8000, // 80€
  priceMax: 12000, // 120€
  acceptedInsurance: ['ÖGK', 'Privat'],
  privatePractice: true,
  rating: 4.5,
  reviewCount: 15,
  yearsExperience: 10,
  profileImageUrl: null,
  headline: 'Spezialisiert auf Angst und Stress',
  ...overrides,
})

const createMockPreferences = (overrides: Partial<MatchingPreferencesInput> = {}): MatchingPreferencesInput => ({
  problemAreas: ['angst'],
  languages: ['Deutsch'],
  insuranceType: 'ANY',
  format: 'BOTH',
  maxDistanceKm: 25,
  latitude: 48.2082,
  longitude: 16.3738,
  ...overrides,
})

describe('calculateDistanceKm', () => {
  it('should return 0 for same location', () => {
    const result = calculateDistanceKm(
      { lat: 48.2082, lng: 16.3738 },
      { lat: 48.2082, lng: 16.3738 }
    )
    expect(result).toBe(0)
  })

  it('should calculate distance between Wien and Graz correctly', () => {
    // Wien: 48.2082, 16.3738
    // Graz: 47.0707, 15.4395
    const result = calculateDistanceKm(
      { lat: 48.2082, lng: 16.3738 },
      { lat: 47.0707, lng: 15.4395 }
    )
    // Approximately 145 km
    expect(result).toBeGreaterThan(140)
    expect(result).toBeLessThan(150)
  })

  it('should calculate distance between Wien and Salzburg correctly', () => {
    // Wien: 48.2082, 16.3738
    // Salzburg: 47.8095, 13.055
    const result = calculateDistanceKm(
      { lat: 48.2082, lng: 16.3738 },
      { lat: 47.8095, lng: 13.055 }
    )
    // Approximately 250 km
    expect(result).toBeGreaterThan(245)
    expect(result).toBeLessThan(255)
  })
})

describe('calculateMatchScore', () => {
  describe('overall score calculation', () => {
    it('should return a score between 0 and 1', () => {
      const therapist = createMockTherapist()
      const preferences = createMockPreferences()

      const result = calculateMatchScore(preferences, therapist)

      expect(result.total).toBeGreaterThanOrEqual(0)
      expect(result.total).toBeLessThanOrEqual(1)
    })

    it('should return higher score for better matches', () => {
      const therapist = createMockTherapist()
      const goodMatch = createMockPreferences({
        problemAreas: ['angst'],
        languages: ['Deutsch'],
      })
      const poorMatch = createMockPreferences({
        problemAreas: ['sucht'], // Nicht in Spezialisierungen
        languages: ['Arabisch'], // Nicht verfügbar
      })

      const goodScore = calculateMatchScore(goodMatch, therapist)
      const poorScore = calculateMatchScore(poorMatch, therapist)

      expect(goodScore.total).toBeGreaterThan(poorScore.total)
    })
  })

  describe('specialty score', () => {
    it('should give positive score for matching specialties', () => {
      const therapist = createMockTherapist({
        specialties: ['Angststörungen', 'Depression'],
      })
      const preferences = createMockPreferences({
        problemAreas: ['angst'],
      })

      const result = calculateMatchScore(preferences, therapist)

      // Score depends on the problem area mapping
      expect(result.components.specialty.score).toBeGreaterThan(0)
    })

    it('should give low score for non-matching specialties', () => {
      const therapist = createMockTherapist({
        specialties: ['Sucht'],
      })
      const preferences = createMockPreferences({
        problemAreas: ['trauma'],
      })

      const result = calculateMatchScore(preferences, therapist)

      expect(result.components.specialty.score).toBeLessThan(0.5)
    })

    it('should give neutral score when no problem areas specified', () => {
      const therapist = createMockTherapist()
      const preferences = createMockPreferences({
        problemAreas: [],
      })

      const result = calculateMatchScore(preferences, therapist)

      expect(result.components.specialty.score).toBe(0.5)
    })
  })

  describe('distance score', () => {
    it('should give high score for nearby therapists', () => {
      const therapist = createMockTherapist({
        latitude: 48.2082,
        longitude: 16.3738,
      })
      const preferences = createMockPreferences({
        latitude: 48.2082,
        longitude: 16.3738,
      })

      const result = calculateMatchScore(preferences, therapist)

      expect(result.components.distance.score).toBeGreaterThan(0.9)
    })

    it('should give lower score for distant therapists', () => {
      const therapist = createMockTherapist({
        latitude: 47.0707, // Graz
        longitude: 15.4395,
      })
      const preferences = createMockPreferences({
        latitude: 48.2082, // Wien
        longitude: 16.3738,
      })

      const result = calculateMatchScore(preferences, therapist)

      // ~145km entfernt
      expect(result.components.distance.score).toBeLessThan(0.5)
      expect(result.components.distance.distanceKm).toBeGreaterThan(140)
    })

    it('should give max score for online-only format', () => {
      const therapist = createMockTherapist({ online: true })
      const preferences = createMockPreferences({
        format: 'ONLINE',
      })

      const result = calculateMatchScore(preferences, therapist)

      expect(result.components.distance.score).toBe(1.0)
    })

    it('should give neutral score when no coordinates provided', () => {
      const therapist = createMockTherapist()
      const preferences = createMockPreferences({
        latitude: undefined,
        longitude: undefined,
      })

      const result = calculateMatchScore(preferences, therapist)

      expect(result.components.distance.score).toBe(0.5)
    })
  })

  describe('availability score', () => {
    it('should give high score for immediately available therapists', () => {
      const therapist = createMockTherapist({
        estimatedWaitWeeks: 0,
        availabilityStatus: 'AVAILABLE',
      })
      const preferences = createMockPreferences()

      const result = calculateMatchScore(preferences, therapist)

      expect(result.components.availability.score).toBeGreaterThan(0.8)
    })

    it('should give lower score for long waiting times', () => {
      const therapist = createMockTherapist({
        estimatedWaitWeeks: 8,
        availabilityStatus: 'WAITLIST',
      })
      const preferences = createMockPreferences({
        maxWaitWeeks: 2,
      })

      const result = calculateMatchScore(preferences, therapist)

      expect(result.components.availability.score).toBeLessThan(0.5)
    })
  })

  describe('language score', () => {
    it('should give full score for matching languages', () => {
      const therapist = createMockTherapist({
        languages: ['Deutsch', 'Englisch'],
      })
      const preferences = createMockPreferences({
        languages: ['Deutsch'],
      })

      const result = calculateMatchScore(preferences, therapist)

      expect(result.components.language.score).toBeGreaterThan(0.8)
    })

    it('should give zero score for non-matching languages', () => {
      const therapist = createMockTherapist({
        languages: ['Englisch'],
      })
      const preferences = createMockPreferences({
        languages: ['Türkisch'],
      })

      const result = calculateMatchScore(preferences, therapist)

      expect(result.components.language.score).toBe(0)
    })

    it('should give full score when no language preference', () => {
      const therapist = createMockTherapist()
      const preferences = createMockPreferences({
        languages: [],
      })

      const result = calculateMatchScore(preferences, therapist)

      expect(result.components.language.score).toBe(1.0)
    })
  })

  describe('methods score', () => {
    it('should give high score for matching methods', () => {
      const therapist = createMockTherapist({
        modalities: ['Verhaltenstherapie', 'EMDR'],
      })
      const preferences = createMockPreferences({
        preferredMethods: ['verhaltenstherapie'],
      })

      const result = calculateMatchScore(preferences, therapist)

      expect(result.components.methods.score).toBeGreaterThan(0.8)
      expect(result.components.methods.matchedMethods).toContain('verhaltenstherapie')
    })

    it('should give neutral score when no methods preference', () => {
      const therapist = createMockTherapist()
      const preferences = createMockPreferences({
        preferredMethods: undefined,
      })

      const result = calculateMatchScore(preferences, therapist)

      expect(result.components.methods.score).toBe(0.5)
    })
  })

  describe('rating score', () => {
    it('should give high score for well-rated therapists', () => {
      const therapist = createMockTherapist({
        rating: 5.0,
        reviewCount: 50,
      })
      const preferences = createMockPreferences()

      const result = calculateMatchScore(preferences, therapist)

      expect(result.components.rating.score).toBeGreaterThan(0.9)
    })

    it('should give lower score for poorly-rated therapists', () => {
      const therapist = createMockTherapist({
        rating: 2.0,
        reviewCount: 5,
      })
      const preferences = createMockPreferences()

      const result = calculateMatchScore(preferences, therapist)

      expect(result.components.rating.score).toBeLessThan(0.5)
    })

    it('should give medium score when no rating', () => {
      const therapist = createMockTherapist({
        rating: null,
        reviewCount: 0,
      })
      const preferences = createMockPreferences()

      const result = calculateMatchScore(preferences, therapist)

      expect(result.components.rating.score).toBe(0.6)
    })
  })

  describe('score breakdown', () => {
    it('should have all components', () => {
      const therapist = createMockTherapist()
      const preferences = createMockPreferences()

      const result = calculateMatchScore(preferences, therapist)

      expect(result.components).toHaveProperty('specialty')
      expect(result.components).toHaveProperty('distance')
      expect(result.components).toHaveProperty('availability')
      expect(result.components).toHaveProperty('methods')
      expect(result.components).toHaveProperty('language')
      expect(result.components).toHaveProperty('gender')
      expect(result.components).toHaveProperty('rating')
      expect(result.components).toHaveProperty('style')
    })

    it('should have correct weights summing to 1', () => {
      const therapist = createMockTherapist()
      const preferences = createMockPreferences()

      const result = calculateMatchScore(preferences, therapist)

      const totalWeight = Object.values(result.components).reduce(
        (sum, c) => sum + c.weight,
        0
      )

      expect(totalWeight).toBeCloseTo(1, 2)
    })

    it('should calculate contribution correctly', () => {
      const therapist = createMockTherapist()
      const preferences = createMockPreferences()

      const result = calculateMatchScore(preferences, therapist)

      for (const component of Object.values(result.components)) {
        expect(component.contribution).toBeCloseTo(
          component.score * component.weight,
          4
        )
      }
    })
  })
})
