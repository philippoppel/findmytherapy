import type {
  MatchingPreferencesInput,
  MatchingWeights,
  ScoreBreakdown,
  TherapistForMatching,
  Coordinates,
} from './types'
import {
  DEFAULT_WEIGHTS,
  PROBLEM_AREA_MAPPING,
  AVAILABILITY_STATUS_WEEKS,
} from './types'

// Haversine-Formel für Distanzberechnung
const EARTH_RADIUS_KM = 6371

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function calculateDistanceKm(a: Coordinates, b: Coordinates): number {
  const latDistance = degreesToRadians(b.lat - a.lat)
  const lngDistance = degreesToRadians(b.lng - a.lng)
  const normalizedLatA = degreesToRadians(a.lat)
  const normalizedLatB = degreesToRadians(b.lat)

  const sinLat = Math.sin(latDistance / 2)
  const sinLng = Math.sin(lngDistance / 2)

  const haversine =
    sinLat * sinLat + sinLng * sinLng * Math.cos(normalizedLatA) * Math.cos(normalizedLatB)
  const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  const distance = EARTH_RADIUS_KM * c
  return Math.round(distance * 10) / 10
}

// Spezialisierungs-Score berechnen
function calculateSpecialtyScore(
  preferences: MatchingPreferencesInput,
  therapist: TherapistForMatching
): number {
  if (preferences.problemAreas.length === 0) return 0.5 // Neutral wenn keine Angabe

  const therapistSpecialties = (therapist.specialties || []).map(s => s.toLowerCase())
  if (therapistSpecialties.length === 0) return 0.3 // Keine Spezialisierungen = niedrigerer Score

  let totalMatches = 0
  let totalPossible = 0

  for (const problemArea of preferences.problemAreas) {
    const normalizedArea = problemArea.toLowerCase()
    const relatedSpecialties = PROBLEM_AREA_MAPPING[normalizedArea] || [normalizedArea]

    totalPossible += relatedSpecialties.length

    for (const specialty of relatedSpecialties) {
      const normalizedSpecialty = specialty.toLowerCase()
      if (therapistSpecialties.some(ts =>
        ts.includes(normalizedSpecialty) || normalizedSpecialty.includes(ts)
      )) {
        totalMatches++
      }
    }
  }

  if (totalPossible === 0) return 0.5

  // Bonus für exakte Matches
  const matchRatio = totalMatches / totalPossible
  return Math.min(1, matchRatio * 1.2) // Bis zu 20% Bonus für viele Matches
}

// Distanz-Score berechnen (exponentieller Abfall)
function calculateDistanceScore(
  preferences: MatchingPreferencesInput,
  therapist: TherapistForMatching
): { score: number; distanceKm?: number } {
  // Online-Therapie hat immer maximalen Distanz-Score
  if (preferences.format === 'ONLINE' && therapist.online) {
    return { score: 1.0 }
  }

  // Keine Koordinaten = neutraler Score
  if (!preferences.latitude || !preferences.longitude) {
    return { score: 0.5 }
  }

  if (!therapist.latitude || !therapist.longitude) {
    // Therapeut ohne Koordinaten, aber Online verfügbar
    if (therapist.online && (preferences.format === 'BOTH' || preferences.format === 'ONLINE')) {
      return { score: 0.8 }
    }
    return { score: 0.3 }
  }

  const distanceKm = calculateDistanceKm(
    { lat: preferences.latitude, lng: preferences.longitude },
    { lat: therapist.latitude, lng: therapist.longitude }
  )

  // Exponentieller Abfall: score = exp(-0.1 * km)
  // Bei 10km: 0.37, bei 20km: 0.14, bei 30km: 0.05
  const alpha = 0.05 // Angepasst für größere Radien
  const score = Math.exp(-alpha * distanceKm)

  return { score, distanceKm }
}

// Verfügbarkeits-Score berechnen
function calculateAvailabilityScore(
  preferences: MatchingPreferencesInput,
  therapist: TherapistForMatching
): { score: number; waitWeeks?: number } {
  // Geschätzte Wartezeit des Therapeuten
  let waitWeeks = therapist.estimatedWaitWeeks

  // Fallback auf Status-basierte Schätzung
  if (waitWeeks === null || waitWeeks === undefined) {
    const status = therapist.availabilityStatus || 'LIMITED'
    waitWeeks = AVAILABILITY_STATUS_WEEKS[status] ?? 4
  }

  // Wenn keine Präferenz angegeben, neutraler Score
  if (!preferences.maxWaitWeeks) {
    // Generell bevorzugen wir kürzere Wartezeiten
    const score = Math.max(0, 1 - (waitWeeks / 12))
    return { score, waitWeeks }
  }

  // Linear normalisiert: je näher an 0, desto besser
  const maxWait = preferences.maxWaitWeeks
  if (waitWeeks <= maxWait) {
    const score = 1 - (waitWeeks / maxWait) * 0.5 // Max 50% Abzug bei genau maxWait
    return { score, waitWeeks }
  }

  // Über der Toleranz, aber nicht ausgeschlossen (sonst wäre es ein harter Filter)
  const overRatio = (waitWeeks - maxWait) / maxWait
  const score = Math.max(0, 0.5 - overRatio * 0.5)
  return { score, waitWeeks }
}

// Methoden-Score berechnen
function calculateMethodsScore(
  preferences: MatchingPreferencesInput,
  therapist: TherapistForMatching
): { score: number; matchedMethods?: string[] } {
  if (!preferences.preferredMethods || preferences.preferredMethods.length === 0) {
    return { score: 0.5 } // Neutral wenn keine Präferenz
  }

  const therapistMethods = (therapist.modalities || []).map(m => m.toLowerCase())
  if (therapistMethods.length === 0) {
    return { score: 0.3 }
  }

  const matchedMethods: string[] = []

  for (const method of preferences.preferredMethods) {
    const normalizedMethod = method.toLowerCase()
    if (therapistMethods.some(tm =>
      tm.includes(normalizedMethod) || normalizedMethod.includes(tm)
    )) {
      matchedMethods.push(method)
    }
  }

  const matchRatio = matchedMethods.length / preferences.preferredMethods.length
  return { score: matchRatio, matchedMethods }
}

// Sprach-Score berechnen
function calculateLanguageScore(
  preferences: MatchingPreferencesInput,
  therapist: TherapistForMatching
): number {
  if (preferences.languages.length === 0) return 1.0 // Keine Präferenz = OK

  const therapistLanguages = (therapist.languages || []).map(l => l.toLowerCase())
  if (therapistLanguages.length === 0) return 0.5 // Keine Angabe = neutral

  // Mindestens eine Sprache muss passen
  const hasMatch = preferences.languages.some(lang =>
    therapistLanguages.includes(lang.toLowerCase())
  )

  if (!hasMatch) return 0.0 // Keine passende Sprache

  // Bonus für mehrere passende Sprachen
  const matchCount = preferences.languages.filter(lang =>
    therapistLanguages.includes(lang.toLowerCase())
  ).length

  return Math.min(1, 0.8 + (matchCount / preferences.languages.length) * 0.2)
}

// Geschlechts-Score berechnen
function calculateGenderScore(
  preferences: MatchingPreferencesInput,
  _therapist: TherapistForMatching
): number {
  // TODO: Geschlecht ist aktuell nicht im TherapistProfile
  // Für MVP geben wir einen neutralen Score zurück
  if (!preferences.therapistGender || preferences.therapistGender === 'any') {
    return 1.0
  }

  // Wenn implementiert, würde hier das Geschlecht verglichen
  return 0.5 // Neutral, da keine Daten verfügbar
}

// Bewertungs-Score berechnen
function calculateRatingScore(therapist: TherapistForMatching): number {
  if (!therapist.rating || therapist.rating === 0) {
    // Keine Bewertungen = leicht unter Durchschnitt
    return 0.6
  }

  // Normalisiert auf 5-Sterne-Skala
  const score = therapist.rating / 5

  // Bonus für viele Reviews (mehr Vertrauen)
  const reviewBonus = Math.min(0.1, (therapist.reviewCount || 0) / 100 * 0.1)

  return Math.min(1, score + reviewBonus)
}

// Stil-Score berechnen
function calculateStyleScore(
  preferences: MatchingPreferencesInput,
  _therapist: TherapistForMatching
): number {
  // TODO: Kommunikationsstil ist aktuell nicht im TherapistProfile
  // Für MVP geben wir einen neutralen Score zurück
  if (!preferences.communicationStyle || preferences.communicationStyle === 'ANY') {
    return 1.0
  }

  // Wenn implementiert, würde hier der Stil verglichen
  return 0.5 // Neutral, da keine Daten verfügbar
}

// Haupt-Scoring-Funktion
export function calculateMatchScore(
  preferences: MatchingPreferencesInput,
  therapist: TherapistForMatching,
  weights: MatchingWeights = DEFAULT_WEIGHTS
): ScoreBreakdown {
  // Einzelne Scores berechnen
  const specialtyScore = calculateSpecialtyScore(preferences, therapist)
  const { score: distanceScore, distanceKm } = calculateDistanceScore(preferences, therapist)
  const { score: availabilityScore, waitWeeks } = calculateAvailabilityScore(preferences, therapist)
  const { score: methodsScore, matchedMethods } = calculateMethodsScore(preferences, therapist)
  const languageScore = calculateLanguageScore(preferences, therapist)
  const genderScore = calculateGenderScore(preferences, therapist)
  const ratingScore = calculateRatingScore(therapist)
  const styleScore = calculateStyleScore(preferences, therapist)

  // Gewichtete Beiträge berechnen
  const components = {
    specialty: {
      score: specialtyScore,
      weight: weights.specialty,
      contribution: specialtyScore * weights.specialty,
    },
    distance: {
      score: distanceScore,
      weight: weights.distance,
      contribution: distanceScore * weights.distance,
      distanceKm,
    },
    availability: {
      score: availabilityScore,
      weight: weights.availability,
      contribution: availabilityScore * weights.availability,
      waitWeeks,
    },
    methods: {
      score: methodsScore,
      weight: weights.methods,
      contribution: methodsScore * weights.methods,
      matchedMethods,
    },
    language: {
      score: languageScore,
      weight: weights.language,
      contribution: languageScore * weights.language,
    },
    gender: {
      score: genderScore,
      weight: weights.gender,
      contribution: genderScore * weights.gender,
    },
    rating: {
      score: ratingScore,
      weight: weights.rating,
      contribution: ratingScore * weights.rating,
    },
    style: {
      score: styleScore,
      weight: weights.style,
      contribution: styleScore * weights.style,
    },
  }

  // Gesamtscore berechnen
  const total = Object.values(components).reduce((sum, c) => sum + c.contribution, 0)

  return {
    total: Math.round(total * 100) / 100, // Auf 2 Dezimalstellen runden
    components,
  }
}
