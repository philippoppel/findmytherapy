import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type {
  MatchingPreferencesInput,
  MatchingWeights,
  MatchResult,
  MatchingResponse,
  TherapistForMatching,
  FilterReason,
  FilteredTherapist,
} from './types'
import { DEFAULT_WEIGHTS, AVAILABILITY_STATUS_WEEKS, PROBLEM_AREA_MAPPING } from './types'
import { calculateMatchScore, calculateDistanceKm } from './score-calculator'
import { generateMatchExplanation } from './explanation-generator'
import { getAvailabilityMeta } from '@/app/therapists/availability'

// Felder die wir vom Therapeuten brauchen
const THERAPIST_SELECT = {
  id: true,
  displayName: true,
  title: true,
  specialties: true,
  modalities: true,
  languages: true,
  online: true,
  city: true,
  latitude: true,
  longitude: true,
  // availabilityStatus, estimatedWaitWeeks, nextAvailableDate werden aus availabilityNote extrahiert
  availabilityNote: true,
  acceptingClients: true,
  priceMin: true,
  priceMax: true,
  acceptedInsurance: true,
  privatePractice: true,
  rating: true,
  reviewCount: true,
  yearsExperience: true,
  profileImageUrl: true,
  headline: true,
} satisfies Prisma.TherapistProfileSelect

interface MatchingOptions {
  weights?: MatchingWeights
  limit?: number
  includeFiltered?: boolean // Für Debugging
}

interface MatchingResult {
  matches: MatchResult[]
  total: number
  filtered?: FilteredTherapist[]
}

// Haupt-Matching-Funktion
export async function findMatches(
  preferences: MatchingPreferencesInput,
  options: MatchingOptions = {}
): Promise<MatchingResult> {
  const {
    weights = DEFAULT_WEIGHTS,
    limit = 10,
    includeFiltered = false,
  } = options

  // 1. Alle öffentlichen, verifizierten Therapeuten laden
  const rawTherapists = await prisma.therapistProfile.findMany({
    where: {
      isPublic: true,
      status: 'VERIFIED',
      deletedAt: null,
    },
    select: THERAPIST_SELECT,
  })

  // Availability-Felder aus availabilityNote berechnen
  const therapists: TherapistForMatching[] = rawTherapists.map(t => {
    const availMeta = getAvailabilityMeta(t.availabilityNote, t.acceptingClients)
    return {
      ...t,
      availabilityStatus: availMeta.rank === 0 ? 'AVAILABLE' :
                         availMeta.rank === 1 ? 'AVAILABLE' :
                         availMeta.rank === 2 ? 'LIMITED' :
                         availMeta.rank === 3 ? 'WAITLIST' :
                         'UNAVAILABLE',
      estimatedWaitWeeks: availMeta.rank === 0 ? 0 :
                         availMeta.rank === 1 ? 1 :
                         availMeta.rank === 2 ? 3 :
                         availMeta.rank === 3 ? 6 :
                         12,
      nextAvailableDate: availMeta.nextAvailableDate,
    }
  })

  // 2. Harte Filter anwenden
  const { passed, filtered } = applyHardFilters(therapists, preferences)

  // 3. Scores berechnen und sortieren
  const matchResults: MatchResult[] = []

  for (const therapist of passed) {
    const scoreBreakdown = calculateMatchScore(preferences, therapist, weights)
    const explanation = generateMatchExplanation(therapist, preferences, scoreBreakdown)

    // Distanz hinzufügen falls verfügbar
    let distanceKm: number | undefined
    if (preferences.latitude && preferences.longitude && therapist.latitude && therapist.longitude) {
      distanceKm = calculateDistanceKm(
        { lat: preferences.latitude, lng: preferences.longitude },
        { lat: therapist.latitude, lng: therapist.longitude }
      )
    }

    matchResults.push({
      therapist,
      score: scoreBreakdown.total,
      scoreBreakdown,
      explanation,
      distanceKm,
    })
  }

  // Nach Score sortieren (absteigend)
  matchResults.sort((a, b) => b.score - a.score)

  // Auf Limit beschränken
  const topMatches = matchResults.slice(0, limit)

  return {
    matches: topMatches,
    total: passed.length,
    filtered: includeFiltered ? filtered : undefined,
  }
}

// Harte Filter anwenden
function applyHardFilters(
  therapists: TherapistForMatching[],
  preferences: MatchingPreferencesInput
): { passed: TherapistForMatching[]; filtered: FilteredTherapist[] } {
  const passed: TherapistForMatching[] = []
  const filtered: FilteredTherapist[] = []

  for (const therapist of therapists) {
    const filterReason = checkHardFilters(therapist, preferences)

    if (filterReason) {
      filtered.push({ therapistId: therapist.id, reason: filterReason })
    } else {
      passed.push(therapist)
    }
  }

  return { passed, filtered }
}

// Einzelnen Therapeuten gegen harte Kriterien prüfen
function checkHardFilters(
  therapist: TherapistForMatching,
  preferences: MatchingPreferencesInput
): FilterReason | null {
  // 1. Spezialisierung muss Problemfeld abdecken
  if (preferences.problemAreas.length > 0) {
    const hasSpecialtyMatch = checkSpecialtyMatch(therapist, preferences)
    if (!hasSpecialtyMatch) {
      return 'no_specialty_match'
    }
  }

  // 2. Sprache muss passen
  if (preferences.languages.length > 0) {
    const therapistLangs = (therapist.languages || []).map(l => l.toLowerCase())
    const hasLanguageMatch = preferences.languages.some(lang =>
      therapistLangs.includes(lang.toLowerCase())
    )
    if (!hasLanguageMatch) {
      return 'language_mismatch'
    }
  }

  // 3. Versicherung/Kosten muss passen (wenn gefordert)
  if (preferences.insuranceType !== 'ANY') {
    const hasInsuranceMatch = checkInsuranceMatch(therapist, preferences)
    if (!hasInsuranceMatch) {
      return 'insurance_mismatch'
    }
  }

  // 4. Online/Präsenz muss kompatibel sein
  if (preferences.format === 'ONLINE' && !therapist.online) {
    return 'format_mismatch'
  }
  if (preferences.format === 'IN_PERSON') {
    // Therapeut muss Präsenz anbieten (nicht nur online)
    if (!therapist.city && !therapist.latitude) {
      // Kein Standort = vermutlich nur online
      if (therapist.online) {
        return 'format_mismatch'
      }
    }
  }

  // 5. Entfernung prüfen (wenn Präsenz gewünscht)
  if (preferences.format !== 'ONLINE' && preferences.maxDistanceKm) {
    if (preferences.latitude && preferences.longitude) {
      if (therapist.latitude && therapist.longitude) {
        const distance = calculateDistanceKm(
          { lat: preferences.latitude, lng: preferences.longitude },
          { lat: therapist.latitude, lng: therapist.longitude }
        )
        if (distance > preferences.maxDistanceKm) {
          return 'distance_exceeded'
        }
      }
      // Wenn Therapeut keine Koordinaten hat aber Online anbietet, akzeptieren
      else if (!therapist.online) {
        return 'distance_exceeded'
      }
    }
  }

  // 6. Verfügbarkeit prüfen (wenn Toleranz angegeben)
  if (preferences.maxWaitWeeks !== undefined && preferences.maxWaitWeeks !== null) {
    let waitWeeks = therapist.estimatedWaitWeeks
    if (waitWeeks === null || waitWeeks === undefined) {
      const status = therapist.availabilityStatus || 'LIMITED'
      waitWeeks = AVAILABILITY_STATUS_WEEKS[status] ?? 4
    }

    // Toleranz mit 50% Puffer
    if (waitWeeks > preferences.maxWaitWeeks * 1.5) {
      return 'availability_exceeded'
    }
  }

  return null // Alle Filter bestanden
}

// Spezialisierungs-Match prüfen
function checkSpecialtyMatch(
  therapist: TherapistForMatching,
  preferences: MatchingPreferencesInput
): boolean {
  const therapistSpecs = (therapist.specialties || []).map(s => s.toLowerCase())
  if (therapistSpecs.length === 0) return false

  for (const problemArea of preferences.problemAreas) {
    const normalizedArea = problemArea.toLowerCase()

    // Direkte Übereinstimmung
    if (therapistSpecs.some(ts => ts.includes(normalizedArea) || normalizedArea.includes(ts))) {
      return true
    }

    // Mapping-basierte Übereinstimmung
    const relatedSpecs = PROBLEM_AREA_MAPPING[normalizedArea] || []
    for (const related of relatedSpecs) {
      const relatedLower = related.toLowerCase()
      if (therapistSpecs.some(ts => ts.includes(relatedLower) || relatedLower.includes(ts))) {
        return true
      }
    }
  }

  return false
}

// Versicherungs-Match prüfen
function checkInsuranceMatch(
  therapist: TherapistForMatching,
  preferences: MatchingPreferencesInput
): boolean {
  if (preferences.insuranceType === 'ANY') return true

  // Selbstzahler
  if (preferences.insuranceType === 'SELF_PAY') {
    return therapist.privatePractice === true
  }

  if (!therapist.acceptedInsurance || therapist.acceptedInsurance.length === 0) {
    return false
  }

  const insuranceKeywords: Record<string, string[]> = {
    'PUBLIC': ['gesetzlich', 'öffentlich', 'krankenkasse', 'gkk', 'ögk', 'bva', 'svs', 'oegk'],
    'PRIVATE': ['privat', 'private', 'zusatz'],
  }

  const keywords = insuranceKeywords[preferences.insuranceType] || []
  const therapistInsLower = therapist.acceptedInsurance.map(i => i.toLowerCase())

  return keywords.some(kw =>
    therapistInsLower.some(ins => ins.includes(kw))
  )
}

// Matching-Präferenzen speichern
export async function saveMatchingPreferences(
  preferences: MatchingPreferencesInput,
  userId?: string
): Promise<{ id: string; sessionId: string }> {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 Tage

  const saved = await prisma.matchingPreferences.create({
    data: {
      sessionId,
      userId,
      problemAreas: preferences.problemAreas,
      languages: preferences.languages,
      insuranceType: preferences.insuranceType,
      format: preferences.format,
      maxDistanceKm: preferences.maxDistanceKm,
      latitude: preferences.latitude,
      longitude: preferences.longitude,
      postalCode: preferences.postalCode,
      city: preferences.city,
      maxWaitWeeks: preferences.maxWaitWeeks,
      preferredMethods: preferences.preferredMethods || [],
      therapistGender: preferences.therapistGender,
      therapistAgeRange: preferences.therapistAgeRange,
      communicationStyle: preferences.communicationStyle || 'ANY',
      priceMax: preferences.priceMax,
      expiresAt,
    },
    select: {
      id: true,
      sessionId: true,
    },
  })

  return saved
}

// Vollständige Matching-Response erstellen
export async function createMatchingResponse(
  preferences: MatchingPreferencesInput,
  options: MatchingOptions = {},
  userId?: string
): Promise<MatchingResponse> {
  // Matches finden
  const result = await findMatches(preferences, options)

  // Präferenzen speichern
  const saved = await saveMatchingPreferences(preferences, userId)

  return {
    matches: result.matches,
    total: result.total,
    preferences: saved,
  }
}

// Abgelaufene Präferenzen löschen (für Cron-Job)
export async function cleanupExpiredPreferences(): Promise<number> {
  const result = await prisma.matchingPreferences.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })

  return result.count
}
