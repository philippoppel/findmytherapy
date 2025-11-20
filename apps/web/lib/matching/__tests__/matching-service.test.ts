import type {
  MatchingPreferencesInput,
  TherapistForMatching,
} from '../types'

// Mock Prisma
const mockFindMany = jest.fn()
jest.mock('@/lib/prisma', () => ({
  prisma: {
    therapistProfile: {
      findMany: () => mockFindMany(),
    },
  },
}))

// Import after mocking
import { findMatches } from '../matching-service'

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
  availabilityNote: 'Aktuell verfügbar',
  acceptingClients: true,
  priceMin: 8000,
  priceMax: 12000,
  acceptedInsurance: ['ÖGK', 'Privat'],
  privatePractice: true,
  rating: 4.5,
  reviewCount: 15,
  yearsExperience: 10,
  profileImageUrl: null,
  headline: 'Spezialisiert auf Angst und Stress',
  availabilityStatus: 'AVAILABLE',
  estimatedWaitWeeks: 2,
  nextAvailableDate: null,
  ...overrides,
})

const createMockPreferences = (overrides: Partial<MatchingPreferencesInput> = {}): MatchingPreferencesInput => ({
  problemAreas: ['Angst'],
  languages: ['Deutsch'],
  insuranceType: 'ANY',
  format: 'BOTH',
  ...overrides,
})

describe('Matching Service - Harte Filter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Sprach-Filter (IMMER hart)', () => {
    it('sollte NUR Therapeuten mit passender Sprache zurückgeben', async () => {
      const therapists = [
        createMockTherapist({ id: '1', languages: ['Deutsch'] }),
        createMockTherapist({ id: '2', languages: ['Englisch'] }),
        createMockTherapist({ id: '3', languages: ['Türkisch'] }),
      ]
      mockFindMany.mockResolvedValue(therapists)

      const preferences = createMockPreferences({
        languages: ['Türkisch'],
      })

      const result = await findMatches(preferences)

      expect(result.matches).toHaveLength(1)
      expect(result.matches[0].therapist.id).toBe('3')
      expect(result.matches[0].therapist.languages).toContain('Türkisch')
    })

    it('sollte 0 Ergebnisse zurückgeben wenn Sprache nicht verfügbar', async () => {
      const therapists = [
        createMockTherapist({ id: '1', languages: ['Deutsch'] }),
        createMockTherapist({ id: '2', languages: ['Englisch'] }),
      ]
      mockFindMany.mockResolvedValue(therapists)

      const preferences = createMockPreferences({
        languages: ['Arabisch'],
      })

      const result = await findMatches(preferences)

      expect(result.matches).toHaveLength(0)
      expect(result.total).toBe(0)
    })

    it('sollte auch bei Fallback KEINE falschen Sprachen empfehlen', async () => {
      const therapists = [
        createMockTherapist({
          id: '1',
          languages: ['Deutsch'],
          specialties: ['Angst'],
        }),
      ]
      mockFindMany.mockResolvedValue(therapists)

      const preferences = createMockPreferences({
        languages: ['Französisch'],
        problemAreas: ['Angst'],
      })

      const result = await findMatches(preferences)

      expect(result.matches).toHaveLength(0)
    })
  })

  describe('Format-Filter (IMMER hart)', () => {
    it('sollte bei ONLINE nur Online-Therapeuten zurückgeben', async () => {
      const therapists = [
        createMockTherapist({ id: '1', online: true, city: 'Wien' }),
        createMockTherapist({ id: '2', online: false, city: 'Graz' }),
        createMockTherapist({ id: '3', online: true, city: 'Salzburg' }),
      ]
      mockFindMany.mockResolvedValue(therapists)

      const preferences = createMockPreferences({
        format: 'ONLINE',
      })

      const result = await findMatches(preferences)

      expect(result.matches).toHaveLength(2)
      expect(result.matches.every(m => m.therapist.online)).toBe(true)
    })

    it('sollte bei IN_PERSON nur Therapeuten mit Standort zurückgeben', async () => {
      const therapists = [
        createMockTherapist({
          id: '1',
          online: false,
          city: 'Wien',
          latitude: 48.2082,
          longitude: 16.3738,
        }),
        createMockTherapist({
          id: '2',
          online: true,
          city: null,
          latitude: null,
          longitude: null,
        }),
      ]
      mockFindMany.mockResolvedValue(therapists)

      const preferences = createMockPreferences({
        format: 'IN_PERSON',
        latitude: 48.2082,
        longitude: 16.3738,
      })

      const result = await findMatches(preferences)

      expect(result.matches).toHaveLength(1)
      expect(result.matches[0].therapist.id).toBe('1')
      expect(result.matches[0].therapist.city).toBe('Wien')
    })

    it('sollte bei ONLINE auch bei Fallback KEINE Präsenz-only Therapeuten empfehlen', async () => {
      const therapists = [
        createMockTherapist({
          id: '1',
          online: false,
          city: 'Wien',
          specialties: ['Angst'],
        }),
      ]
      mockFindMany.mockResolvedValue(therapists)

      const preferences = createMockPreferences({
        format: 'ONLINE',
        problemAreas: ['Angst'],
      })

      const result = await findMatches(preferences)

      expect(result.matches).toHaveLength(0)
    })
  })

  describe('Versicherungs-Filter (IMMER hart)', () => {
    it('sollte bei PUBLIC nur Therapeuten mit Kassenzulassung zurückgeben', async () => {
      const therapists = [
        createMockTherapist({
          id: '1',
          acceptedInsurance: ['ÖGK', 'Gesetzliche'],
          privatePractice: false,
        }),
        createMockTherapist({
          id: '2',
          acceptedInsurance: ['Privat'],
          privatePractice: true,
        }),
      ]
      mockFindMany.mockResolvedValue(therapists)

      const preferences = createMockPreferences({
        insuranceType: 'PUBLIC',
      })

      const result = await findMatches(preferences)

      expect(result.matches).toHaveLength(1)
      expect(result.matches[0].therapist.id).toBe('1')
    })

    it('sollte bei SELF_PAY nur Privatpraxis zurückgeben', async () => {
      const therapists = [
        createMockTherapist({
          id: '1',
          privatePractice: true,
        }),
        createMockTherapist({
          id: '2',
          privatePractice: false,
        }),
      ]
      mockFindMany.mockResolvedValue(therapists)

      const preferences = createMockPreferences({
        insuranceType: 'SELF_PAY',
      })

      const result = await findMatches(preferences)

      expect(result.matches).toHaveLength(1)
      expect(result.matches[0].therapist.id).toBe('1')
    })
  })
})

describe('Matching Service - Fallback-Strategie', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Spezialisierungs-Fallback', () => {
    it('sollte mit strikter Spezialisierung starten', async () => {
      const therapists = [
        createMockTherapist({
          id: '1',
          specialties: ['Berufliche Probleme', 'Burnout'],
        }),
        createMockTherapist({
          id: '2',
          specialties: ['Depression'],
        }),
      ]
      mockFindMany.mockResolvedValue(therapists)

      const preferences = createMockPreferences({
        problemAreas: ['Probleme im Beruf'],
      })

      const result = await findMatches(preferences)

      // Sollte mindestens Therapeut 1 mit passender Spezialisierung finden
      expect(result.matches.length).toBeGreaterThan(0)
      expect(result.matches[0].therapist.id).toBe('1')
    })

    it('sollte Spezialisierung lockern wenn < 3 Ergebnisse', async () => {
      const therapists = [
        createMockTherapist({
          id: '1',
          specialties: ['Depression', 'Angst'],
        }),
        createMockTherapist({
          id: '2',
          specialties: ['Trauma'],
        }),
        createMockTherapist({
          id: '3',
          specialties: ['Sucht'],
        }),
        createMockTherapist({
          id: '4',
          specialties: ['Essstörungen'],
        }),
      ]
      mockFindMany.mockResolvedValue(therapists)

      const preferences = createMockPreferences({
        problemAreas: ['Sehr Spezifisches Problem'],
      })

      const result = await findMatches(preferences)

      // Fallback sollte mehr Ergebnisse liefern
      expect(result.matches.length).toBeGreaterThanOrEqual(3)
    })

    it('sollte bei genug Ergebnissen NICHT lockern', async () => {
      const therapists = [
        createMockTherapist({
          id: '1',
          specialties: ['Angst', 'Panikattacken'],
        }),
        createMockTherapist({
          id: '2',
          specialties: ['Angststörungen'],
        }),
        createMockTherapist({
          id: '3',
          specialties: ['Soziale Angst'],
        }),
        createMockTherapist({
          id: '4',
          specialties: ['Generalisierte Angst'],
        }),
        createMockTherapist({
          id: '5',
          specialties: ['Depression'], // Passt nicht
        }),
      ]
      mockFindMany.mockResolvedValue(therapists)

      const preferences = createMockPreferences({
        problemAreas: ['Angst'],
      })

      const result = await findMatches(preferences, { limit: 10 })

      // Sollte nur die 4 mit passender Spezialisierung zurückgeben
      expect(result.total).toBe(4)
      expect(result.matches.every(m =>
        m.therapist.specialties?.some(s =>
          s.toLowerCase().includes('angst')
        )
      )).toBe(true)
    })
  })
})

describe('Matching Service - Sortierung', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sollte Ergebnisse nach Score sortieren', async () => {
    const therapists = [
      createMockTherapist({
        id: '1',
        specialties: ['Depression'],
        rating: 3.0,
      }),
      createMockTherapist({
        id: '2',
        specialties: ['Angst', 'Panikattacken'],
        rating: 5.0,
      }),
      createMockTherapist({
        id: '3',
        specialties: ['Angst'],
        rating: 4.0,
      }),
    ]
    mockFindMany.mockResolvedValue(therapists)

    const preferences = createMockPreferences({
      problemAreas: ['Angst'],
    })

    const result = await findMatches(preferences)

    // Therapeut 2 sollte am besten matchen (Spezialisierung + hohe Bewertung)
    expect(result.matches[0].therapist.id).toBe('2')

    // Scores sollten absteigend sortiert sein
    for (let i = 0; i < result.matches.length - 1; i++) {
      expect(result.matches[i].score).toBeGreaterThanOrEqual(result.matches[i + 1].score)
    }
  })

  it('sollte Limit respektieren', async () => {
    const therapists = Array.from({ length: 20 }, (_, i) =>
      createMockTherapist({ id: `therapist-${i}` })
    )
    mockFindMany.mockResolvedValue(therapists)

    const preferences = createMockPreferences()

    const result = await findMatches(preferences, { limit: 5 })

    expect(result.matches).toHaveLength(5)
    expect(result.total).toBe(20)
  })
})

describe('Matching Service - Reale Szenarien', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Szenario: "Probleme im Beruf + Online + Deutsch"', async () => {
    const therapists = [
      createMockTherapist({
        id: '1',
        specialties: ['Burnout', 'Arbeitsbezogene Probleme'],
        languages: ['Deutsch'],
        online: true,
      }),
      createMockTherapist({
        id: '2',
        specialties: ['Beziehungsprobleme'],
        languages: ['Deutsch'],
        online: true,
      }),
      createMockTherapist({
        id: '3',
        specialties: ['Burnout'],
        languages: ['Englisch'],
        online: true,
      }),
    ]
    mockFindMany.mockResolvedValue(therapists)

    const preferences = createMockPreferences({
      problemAreas: ['Probleme im Beruf'],
      languages: ['Deutsch'],
      format: 'ONLINE',
    })

    const result = await findMatches(preferences)

    // Sollte Ergebnisse finden
    expect(result.matches.length).toBeGreaterThan(0)

    // ALLE müssen Deutsch sprechen UND Online anbieten
    expect(result.matches.every(m =>
      m.therapist.languages?.includes('Deutsch') &&
      m.therapist.online === true
    )).toBe(true)

    // Bester Match sollte auch Spezialisierung haben
    expect(result.matches[0].therapist.id).toBe('1')
  })

  it('Szenario: "Trauma + EMDR + Graz Nähe + Privat"', async () => {
    const therapists = [
      createMockTherapist({
        id: '1',
        specialties: ['Trauma', 'PTBS'],
        modalities: ['EMDR'],
        city: 'Graz',
        latitude: 47.0707,
        longitude: 15.4395,
        acceptedInsurance: ['Privat'],
        languages: ['Deutsch'],
      }),
      createMockTherapist({
        id: '2',
        specialties: ['Trauma'],
        modalities: ['Verhaltenstherapie'],
        city: 'Wien',
        latitude: 48.2082,
        longitude: 16.3738,
        acceptedInsurance: ['Privat'],
        languages: ['Deutsch'],
      }),
    ]
    mockFindMany.mockResolvedValue(therapists)

    const preferences = createMockPreferences({
      problemAreas: ['Trauma'],
      preferredMethods: ['EMDR'],
      insuranceType: 'PRIVATE',
      format: 'IN_PERSON',
      latitude: 47.0707,
      longitude: 15.4395,
      maxDistanceKm: 50,
    })

    const result = await findMatches(preferences)

    expect(result.matches.length).toBeGreaterThan(0)

    // Therapeut 1 in Graz mit EMDR sollte besser scoren als Therapeut 2 in Wien
    expect(result.matches[0].therapist.id).toBe('1')
  })

  it('Szenario: "Türkisch + Online" mit 0 Ergebnissen', async () => {
    const therapists = [
      createMockTherapist({
        id: '1',
        languages: ['Deutsch'],
        online: true,
      }),
      createMockTherapist({
        id: '2',
        languages: ['Englisch'],
        online: true,
      }),
    ]
    mockFindMany.mockResolvedValue(therapists)

    const preferences = createMockPreferences({
      languages: ['Türkisch'],
      format: 'ONLINE',
    })

    const result = await findMatches(preferences)

    // Sollte ehrlich 0 Ergebnisse zurückgeben
    expect(result.matches).toHaveLength(0)
    expect(result.total).toBe(0)
  })

  it('Szenario: Mehrere passende Kriterien - Richtige Priorisierung', async () => {
    const therapists = [
      createMockTherapist({
        id: '1',
        specialties: ['Angst', 'Depression'],
        languages: ['Deutsch'],
        rating: 5.0,
        reviewCount: 100,
        estimatedWaitWeeks: 0,
      }),
      createMockTherapist({
        id: '2',
        specialties: ['Angst'],
        languages: ['Deutsch', 'Englisch'],
        rating: 4.0,
        reviewCount: 20,
        estimatedWaitWeeks: 4,
      }),
      createMockTherapist({
        id: '3',
        specialties: ['Depression'],
        languages: ['Deutsch'],
        rating: 3.5,
        reviewCount: 5,
        estimatedWaitWeeks: 8,
      }),
    ]
    mockFindMany.mockResolvedValue(therapists)

    const preferences = createMockPreferences({
      problemAreas: ['Angst'],
      maxWaitWeeks: 2,
    })

    const result = await findMatches(preferences)

    // Therapeut 1 sollte am besten scoren:
    // - Hat Spezialisierung
    // - Beste Bewertung
    // - Sofort verfügbar
    expect(result.matches[0].therapist.id).toBe('1')
    expect(result.matches[0].score).toBeGreaterThan(result.matches[1].score)
  })
})

describe('Matching Service - Distanz-Filter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sollte Therapeuten außerhalb maxDistanceKm herausfiltern', async () => {
    const therapists = [
      createMockTherapist({
        id: '1',
        city: 'Wien',
        latitude: 48.2082,
        longitude: 16.3738,
      }),
      createMockTherapist({
        id: '2',
        city: 'Graz',
        latitude: 47.0707,
        longitude: 15.4395,
      }),
    ]
    mockFindMany.mockResolvedValue(therapists)

    const preferences = createMockPreferences({
      format: 'IN_PERSON',
      latitude: 48.2082,
      longitude: 16.3738,
      maxDistanceKm: 30,
    })

    const result = await findMatches(preferences)

    // Nur Wien sollte zurückkommen (Graz ist ~145km entfernt)
    expect(result.matches).toHaveLength(1)
    expect(result.matches[0].therapist.city).toBe('Wien')
  })

  it('sollte bei ONLINE Distanz ignorieren', async () => {
    const therapists = [
      createMockTherapist({
        id: '1',
        city: 'Graz',
        latitude: 47.0707,
        longitude: 15.4395,
        online: true,
      }),
    ]
    mockFindMany.mockResolvedValue(therapists)

    const preferences = createMockPreferences({
      format: 'ONLINE',
      latitude: 48.2082,
      longitude: 16.3738,
      maxDistanceKm: 30,
    })

    const result = await findMatches(preferences)

    // Bei ONLINE sollte auch weit entfernter Therapeut gefunden werden
    expect(result.matches).toHaveLength(1)
  })
})
