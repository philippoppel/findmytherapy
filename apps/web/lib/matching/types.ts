import type {
  InsuranceType,
  TherapyFormat,
  CommunicationStyle,
  TherapistProfile,
} from '@prisma/client'

// Input für das Matching-System
export interface MatchingPreferencesInput {
  // Harte Kriterien
  problemAreas: string[]
  languages: string[]
  insuranceType: InsuranceType
  format: TherapyFormat
  maxDistanceKm?: number
  latitude?: number
  longitude?: number
  postalCode?: string
  city?: string
  maxWaitWeeks?: number

  // Weiche Kriterien
  preferredMethods?: string[]
  therapistGender?: 'male' | 'female' | 'any'
  therapistAgeRange?: 'young' | 'middle' | 'senior' | 'any'
  communicationStyle?: CommunicationStyle
  priceMax?: number // in Cent
}

// Koordinaten-Typ
export interface Coordinates {
  lat: number
  lng: number
}

// Score-Gewichtungen (konfigurierbar)
export interface MatchingWeights {
  specialty: number      // 0.30 - Fachliche Übereinstimmung
  distance: number       // 0.15 - Entfernung
  availability: number   // 0.15 - Verfügbarkeit
  methods: number        // 0.10 - Therapiemethoden
  language: number       // 0.10 - Sprache
  gender: number         // 0.05 - Geschlecht
  rating: number         // 0.10 - Bewertungen
  style: number          // 0.05 - Kommunikationsstil
}

// Standard-Gewichtungen aus dem Pflichtenheft
export const DEFAULT_WEIGHTS: MatchingWeights = {
  specialty: 0.30,
  distance: 0.15,
  availability: 0.15,
  methods: 0.10,
  language: 0.10,
  gender: 0.05,
  rating: 0.10,
  style: 0.05,
}

// Detaillierte Score-Aufschlüsselung
export interface ScoreBreakdown {
  total: number
  components: {
    specialty: { score: number; weight: number; contribution: number }
    distance: { score: number; weight: number; contribution: number; distanceKm?: number }
    availability: { score: number; weight: number; contribution: number; waitWeeks?: number }
    methods: { score: number; weight: number; contribution: number; matchedMethods?: string[] }
    language: { score: number; weight: number; contribution: number }
    gender: { score: number; weight: number; contribution: number }
    rating: { score: number; weight: number; contribution: number }
    style: { score: number; weight: number; contribution: number }
  }
}

// Match-Erklärung
export interface MatchExplanation {
  primary: string[]      // Hauptgründe (max 3)
  secondary: string[]    // Zusätzliche Gründe
  warnings?: string[]    // Mögliche Einschränkungen
}

// Therapeutenprofil für Matching (vereinfacht)
export type TherapistForMatching = Pick<
  TherapistProfile,
  | 'id'
  | 'displayName'
  | 'title'
  | 'specialties'
  | 'modalities'
  | 'languages'
  | 'online'
  | 'city'
  | 'latitude'
  | 'longitude'
  | 'availabilityStatus'
  | 'estimatedWaitWeeks'
  | 'nextAvailableDate'
  | 'priceMin'
  | 'priceMax'
  | 'acceptedInsurance'
  | 'privatePractice'
  | 'rating'
  | 'reviewCount'
  | 'yearsExperience'
  | 'profileImageUrl'
  | 'headline'
>

// Einzelnes Match-Ergebnis
export interface MatchResult {
  therapist: TherapistForMatching
  score: number
  scoreBreakdown: ScoreBreakdown
  explanation: MatchExplanation
  distanceKm?: number
}

// API-Response für /api/match
export interface MatchingResponse {
  matches: MatchResult[]
  total: number
  preferences: {
    id: string
    sessionId: string
  }
}

// Filter-Grund für ausgeschlossene Therapeuten
export type FilterReason =
  | 'no_specialty_match'
  | 'language_mismatch'
  | 'insurance_mismatch'
  | 'format_mismatch'
  | 'distance_exceeded'
  | 'availability_exceeded'

// Ausgeschlossener Therapeut (für Debugging/Logs)
export interface FilteredTherapist {
  therapistId: string
  reason: FilterReason
}

// Problemfelder-Mapping zu Spezialisierungen
export const PROBLEM_AREA_MAPPING: Record<string, string[]> = {
  // Hauptproblembereiche
  'angst': ['Angststörungen', 'Panikattacken', 'Phobien', 'Soziale Angst', 'Generalisierte Angst'],
  'depression': ['Depression', 'Burnout', 'Erschöpfung', 'Stimmungsstörungen'],
  'trauma': ['Trauma', 'PTBS', 'Traumatherapie', 'Krisenintervention'],
  'beziehung': ['Beziehungsprobleme', 'Paartherapie', 'Familientherapie', 'Trennung'],
  'stress': ['Stressbewältigung', 'Burnout', 'Work-Life-Balance', 'Erschöpfung'],
  'selbstwert': ['Selbstwert', 'Selbstbewusstsein', 'Identität', 'Persönlichkeitsentwicklung'],
  'sucht': ['Sucht', 'Abhängigkeit', 'Alkohol', 'Drogen', 'Spielsucht'],
  'essstoerung': ['Essstörungen', 'Anorexie', 'Bulimie', 'Binge Eating'],
  'schlaf': ['Schlafstörungen', 'Insomnie', 'Schlafhygiene'],
  'trauer': ['Trauer', 'Verlust', 'Trauerbegleitung'],
  'zwang': ['Zwangsstörungen', 'OCD', 'Zwangsgedanken'],
  'adhs': ['ADHS', 'ADS', 'Aufmerksamkeit', 'Konzentration'],
  'arbeit': ['Berufliche Probleme', 'Karriere', 'Mobbing', 'Burnout'],
}

// Verfügbarkeits-Ranking zu Wartezeit-Mapping
export const AVAILABILITY_STATUS_WEEKS: Record<string, number> = {
  'AVAILABLE': 0,
  'LIMITED': 2,
  'WAITLIST': 6,
  'UNAVAILABLE': 12,
}
