export interface WizardFormData {
  // Schritt 1: Problemfelder
  problemAreas: string[]

  // Schritt 2: Standort & Format
  format: 'ONLINE' | 'IN_PERSON' | 'BOTH'
  postalCode: string
  city: string
  latitude?: number
  longitude?: number
  maxDistanceKm: number

  // Schritt 3: Präferenzen
  languages: string[]
  insuranceType: 'PUBLIC' | 'PRIVATE' | 'SELF_PAY' | 'ANY'
  maxWaitWeeks?: number

  // Schritt 4: Optionale Details
  preferredMethods: string[]
  therapistGender: 'male' | 'female' | 'any'
  priceMax?: number // in Euro (wird zu Cent konvertiert)
  communicationStyle: 'DIRECT' | 'GENTLE' | 'ANY'
}

export const defaultFormData: WizardFormData = {
  problemAreas: [],
  format: 'BOTH',
  postalCode: '',
  city: '',
  maxDistanceKm: 25,
  languages: ['Deutsch'],
  insuranceType: 'ANY',
  preferredMethods: [],
  therapistGender: 'any',
  communicationStyle: 'ANY',
}

// Problemfelder für die Auswahl
export const PROBLEM_AREAS = [
  { id: 'angst', label: 'Angst & Panik' },
  { id: 'depression', label: 'Depression & Niedergeschlagenheit' },
  { id: 'stress', label: 'Stress & Burnout' },
  { id: 'trauma', label: 'Trauma & PTBS' },
  { id: 'beziehung', label: 'Beziehungsprobleme' },
  { id: 'selbstwert', label: 'Selbstwert & Identität' },
  { id: 'trauer', label: 'Trauer & Verlust' },
  { id: 'sucht', label: 'Sucht & Abhängigkeit' },
  { id: 'essstoerung', label: 'Essstörungen' },
  { id: 'schlaf', label: 'Schlafstörungen' },
  { id: 'zwang', label: 'Zwangsstörungen' },
  { id: 'adhs', label: 'ADHS & Konzentration' },
  { id: 'arbeit', label: 'Berufliche Probleme' },
]

// Therapiemethoden
export const THERAPY_METHODS = [
  { id: 'verhaltenstherapie', label: 'Verhaltenstherapie' },
  { id: 'tiefenpsychologie', label: 'Tiefenpsychologie' },
  { id: 'psychoanalyse', label: 'Psychoanalyse' },
  { id: 'systemisch', label: 'Systemische Therapie' },
  { id: 'emdr', label: 'EMDR' },
  { id: 'achtsamkeit', label: 'Achtsamkeitsbasierte Therapie' },
  { id: 'koerper', label: 'Körpertherapie' },
  { id: 'gestalt', label: 'Gestalttherapie' },
]

// Sprachen
export const LANGUAGES = [
  { id: 'Deutsch', label: 'Deutsch' },
  { id: 'Englisch', label: 'Englisch' },
  { id: 'Türkisch', label: 'Türkisch' },
  { id: 'Serbisch', label: 'Serbisch' },
  { id: 'Kroatisch', label: 'Kroatisch' },
  { id: 'Polnisch', label: 'Polnisch' },
  { id: 'Arabisch', label: 'Arabisch' },
  { id: 'Französisch', label: 'Französisch' },
  { id: 'Spanisch', label: 'Spanisch' },
]

// Wartezeit-Optionen
export const WAIT_TIME_OPTIONS = [
  { value: undefined, label: 'Egal' },
  { value: 1, label: 'Innerhalb 1 Woche' },
  { value: 2, label: 'Innerhalb 2 Wochen' },
  { value: 4, label: 'Innerhalb 1 Monat' },
  { value: 8, label: 'Innerhalb 2 Monaten' },
]
