export interface WizardFormData {
  // Schritt 1: Problemfelder
  problemAreas: string[];

  // Schritt 2: Standort & Format
  format: 'ONLINE' | 'IN_PERSON' | 'BOTH';
  postalCode: string;
  city: string;
  latitude?: number;
  longitude?: number;
  maxDistanceKm: number;

  // Schritt 3: Präferenzen
  languages: string[];
  insuranceType: 'PUBLIC' | 'PRIVATE' | 'SELF_PAY' | 'ANY';
  maxWaitWeeks?: number;

  // Schritt 4: Optionale Details
  preferredMethods: string[];
  therapistGender: 'male' | 'female' | 'any';
  priceMax?: number; // in Euro (wird zu Cent konvertiert)
  communicationStyle: 'DIRECT' | 'GENTLE' | 'ANY';
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
};

// Problemfelder für die Auswahl
export const PROBLEM_AREAS = [
  { id: 'angst', label: 'Angst & Panik', image: '/images/topics/angst.jpg' },
  { id: 'depression', label: 'Niedergeschlagenheit', image: '/images/topics/depression.jpg' },
  { id: 'stress', label: 'Stress & Burnout', image: '/images/topics/stress.jpg' },
  { id: 'trauma', label: 'Trauma & PTBS', image: '/images/topics/trauma.jpg' },
  { id: 'beziehung', label: 'Beziehungen', image: '/images/topics/beziehung.jpg' },
  { id: 'selbstwert', label: 'Selbstwert', image: '/images/topics/selbstwert.jpg' },
  { id: 'trauer', label: 'Trauer & Verlust', image: '/images/topics/trauer.jpg' },
  { id: 'sucht', label: 'Sucht', image: '/images/topics/sucht.jpg' },
  { id: 'essstoerung', label: 'Essstörungen', image: '/images/topics/essstoerung.jpg' },
  { id: 'schlaf', label: 'Schlafprobleme', image: '/images/topics/schlaf.jpg' },
  { id: 'zwang', label: 'Zwänge', image: '/images/topics/zwang.jpg' },
  { id: 'adhs', label: 'ADHS', image: '/images/topics/adhs.jpg' },
  { id: 'arbeit', label: 'Arbeit & Karriere', image: '/images/topics/arbeit.jpg' },
];

// Format-Optionen mit Bildern
export const FORMAT_OPTIONS = [
  { id: 'ONLINE', label: 'Online', desc: 'Von überall aus', image: '/images/topics/online.jpg' },
  { id: 'IN_PERSON', label: 'Vor Ort', desc: 'Persönlich treffen', image: '/images/topics/praxis.jpg' },
  { id: 'BOTH', label: 'Flexibel', desc: 'Beides möglich', image: '/images/topics/flexibel.jpg' },
];

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
];

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
];

// Wartezeit-Optionen
export const WAIT_TIME_OPTIONS = [
  { value: undefined, label: 'Egal' },
  { value: 1, label: 'Innerhalb 1 Woche' },
  { value: 2, label: 'Innerhalb 2 Wochen' },
  { value: 4, label: 'Innerhalb 1 Monat' },
  { value: 8, label: 'Innerhalb 2 Monaten' },
];
