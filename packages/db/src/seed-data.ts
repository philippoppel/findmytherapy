import type { CourseStatus, ListingPlan, ListingStatus, TherapistStatus } from '@prisma/client'

export type SeedAccount = {
  email: string
  password: string
  role: 'ADMIN' | 'CLIENT'
  locale: string
  firstName?: string
  lastName?: string
}

export const seedAccounts: Record<'admin' | 'client', SeedAccount> = {
  admin: {
    email: 'admin@mental-health-platform.com',
    password: 'Admin123!',
    role: 'ADMIN',
    locale: 'de-AT',
    firstName: 'Alex',
    lastName: 'Admin',
  },
  client: {
    email: 'demo.client@example.com',
    password: 'Client123!',
    role: 'CLIENT',
    locale: 'de-AT',
    firstName: 'Nora',
    lastName: 'Beispiel',
  },
}

export type SeedTherapist = {
  email: string
  password: string
  firstName: string
  lastName: string
  displayName: string
  title: string
  headline: string
  focus: string[]
  approach: string
  location: string
  availability: string
  languages: string[]
  rating: number
  reviews: number
  experience: string
  yearsExperience: number
  services: string[]
  responseTime: string
  videoUrl?: string | null
  acceptingClients: boolean
  image: string
  profile: {
    status: TherapistStatus
    licenseAuthority: string
    licenseId: string
    modalities: string[]
    specialties: string[]
    priceMin: number
    priceMax: number
    languages: string[]
    online: boolean
    city: string
    country: string
    about: string
    availabilityNote: string
    pricingNote: string
    isPublic: boolean
  }
  listing?: {
    plan: ListingPlan
    status: ListingStatus
  }
}

export const seedTherapists: SeedTherapist[] = [
  {
    email: 'dr.mueller@example.com',
    password: 'Therapist123!',
    firstName: 'Lena',
    lastName: 'Huber',
    displayName: 'Dr.in Lena Huber',
    title: 'Klinische Psychologin & Gesundheitspsychologin',
    headline: 'Ressourcen aktivieren und neue Stabilität finden',
    focus: ['Depression', 'Burnout-Prävention', 'Achtsamkeit'],
    approach: 'Integrative Verhaltenstherapie mit Fokus auf Ressourcenarbeit',
    location: 'Wien - Präsenz & Online',
    availability: 'Freie Slots ab 12. Mai',
    languages: ['Deutsch', 'Englisch'],
    rating: 4.9,
    reviews: 54,
    experience: '8 Jahre Praxis',
    yearsExperience: 8,
    services: ['Einzeltherapie (50 Min)', 'Online-Session', 'Begleitendes Kurscoaching'],
    responseTime: 'Antwort innerhalb von 24 Stunden',
    videoUrl: null,
    acceptingClients: true,
    image: '/images/therapists/therapy-1.jpg',
    profile: {
      status: 'VERIFIED',
      licenseAuthority: 'Österreichischer Bundesverband für Psychotherapie',
      licenseId: 'PSY-AT-2023-001',
      modalities: ['Integrative Verhaltenstherapie', 'Achtsamkeit', 'Systemische Ansätze'],
      specialties: ['Depression', 'Burnout', 'Stressregulation'],
      priceMin: 8000,
      priceMax: 12000,
      languages: ['de-AT', 'en'],
      online: true,
      city: 'Wien',
      country: 'AT',
      about:
        'Fokussiert auf ressourcenorientierte Verhaltenstherapie mit Achtsamkeitsintegration. Langjährige Erfahrung mit Führungskräften und Personen in beruflichen Belastungssituationen.',
      availabilityNote:
        'Erstgespräche Montag & Mittwoch Nachmittag; bei Akutfällen Slots innerhalb von 5 Werktagen möglich.',
      pricingNote:
        'Honorar €80–120 je 50 Minuten; Sozialtarife für Studierende auf Anfrage.',
      isPublic: true,
    },
    listing: {
      plan: 'PRO',
      status: 'ACTIVE',
    },
  },
  {
    email: 'mag.wagner@example.com',
    password: 'Therapist123!',
    firstName: 'Tobias',
    lastName: 'Leitner',
    displayName: 'Mag. Tobias Leitner',
    title: 'Psychotherapeut (Verhaltenstherapie)',
    headline: 'Angst & ADHS strukturiert angehen – hybrid & flexibel',
    focus: ['Angst & Panik', 'Chronischer Stress', 'ADHS bei Erwachsenen'],
    approach: 'Strukturierte Verhaltenstherapie kombiniert mit biofeedbackgestützter Regulation',
    location: 'Graz - Präsenz & Hybrid',
    availability: 'Abendtermine in 1 Woche',
    languages: ['Deutsch'],
    rating: 4.8,
    reviews: 41,
    experience: '6 Jahre Praxis',
    yearsExperience: 6,
    services: ['Einzeltherapie Präsenz', 'Hybrid-Termine', 'Biofeedback-Training'],
    responseTime: 'Antwort innerhalb von 36 Stunden',
    videoUrl: null,
    acceptingClients: true,
    image: '/images/therapists/therapy-2.jpg',
    profile: {
      status: 'VERIFIED',
      licenseAuthority: 'Österreichischer Bundesverband für Psychotherapie',
      licenseId: 'PSY-AT-2023-002',
      modalities: ['Verhaltenstherapie', 'Biofeedback', 'Emotionsfokussierte Techniken'],
      specialties: ['Angststörungen', 'ADHS', 'Stress'],
      priceMin: 9000,
      priceMax: 15000,
      languages: ['de-AT'],
      online: true,
      city: 'Graz',
      country: 'AT',
      about:
        'Begleitet Klient:innen mit Angst- und Aufmerksamkeitsstörungen. Kombiniert strukturierte Verhaltenstherapie mit neuropsychologischen Methoden und Biofeedback.',
      availabilityNote:
        'Abendtermine Dienstag–Donnerstag, einzelne Hybrid-Slots vor Ort in Graz ab nächster Woche.',
      pricingNote:
        '€90–150 je Einheit, Firmenabrechnung via FindMyTherapy möglich. Paketpreise für ADHS-Coaching.',
      isPublic: true,
    },
    listing: {
      plan: 'PRO_PLUS',
      status: 'ACTIVE',
    },
  },
  {
    email: 'dr.schneider@example.com',
    password: 'Therapist123!',
    firstName: 'Sara',
    lastName: 'Eder',
    displayName: 'Dr.in Sara Eder',
    title: 'Kinder- & Jugendpsychiaterin',
    headline: 'Familiensysteme begleiten – sicher durch herausfordernde Phasen',
    focus: ['Jugendliche 12–18', 'Essstörungen', 'Familienbegleitung'],
    approach: 'Systemische Therapie mit Elternarbeit und digitalen Lerntracks',
    location: 'Linz - Präsenz',
    availability: 'Neue Erstgespräche ab 20. Mai',
    languages: ['Deutsch', 'Türkisch'],
    rating: 4.95,
    reviews: 37,
    experience: '11 Jahre Praxis',
    yearsExperience: 11,
    services: ['Einzeltherapie Jugendliche', 'Elternberatung', 'Familien-Workshops'],
    responseTime: 'Antwort innerhalb von 48 Stunden',
    videoUrl: null,
    acceptingClients: false,
    image: '/images/therapists/therapy-3.jpg',
    profile: {
      status: 'PENDING',
      licenseAuthority: 'Österreichische Ärztekammer',
      licenseId: 'PSY-AT-2023-003',
      modalities: ['Systemische Therapie', 'Familienarbeit', 'Traumasensibles Arbeiten'],
      specialties: ['Essstörungen', 'Jugendpsychiatrie', 'Familiendynamiken'],
      priceMin: 10000,
      priceMax: 16000,
      languages: ['de-AT', 'tr'],
      online: false,
      city: 'Linz',
      country: 'AT',
      about:
        'Verbindet kinder- und jugendpsychiatrische Expertise mit systemischer Elternarbeit. Entwickelt digitale Lerntracks zur Familienintegration.',
      availabilityNote:
        'Erstgespräche für Jugendliche ab 20. Mai, Elterntermine Freitag Vormittag.',
      pricingNote:
        '€100–160 je Einheit; Kassenrückerstattung bei Diagnose nach Antrag möglich.',
      isPublic: false,
    },
  },
  {
    email: 'sofia.kraus@example.com',
    password: 'Therapist123!',
    firstName: 'Sofia',
    lastName: 'Kraus',
    displayName: 'Mag.a Sofia Kraus',
    title: 'Psychotherapeutin (Systemische Familientherapie)',
    headline: 'Systemische Impulse für Beziehungen & Identität',
    focus: ['Beziehungsdynamiken', 'LGBTQIA+', 'Lebensübergänge'],
    approach: 'Systemische Kurzzeittherapie mit Fokus auf klare Handlungsimpulse',
    location: 'Online',
    availability: 'Kurzfristige Onlinetermine verfügbar',
    languages: ['Deutsch', 'Spanisch'],
    rating: 4.7,
    reviews: 29,
    experience: '5 Jahre Praxis',
    yearsExperience: 5,
    services: ['Online-Einzeltherapie', 'Paar- & Beziehungssessions', 'Kurzzeitberatung'],
    responseTime: 'Antwort am selben Werktag',
    videoUrl: null,
    acceptingClients: true,
    image: '/images/therapists/therapy-4.jpg',
    profile: {
      status: 'VERIFIED',
      licenseAuthority: 'Österreichischer Bundesverband für Psychotherapie',
      licenseId: 'PSY-AT-2023-004',
      modalities: ['Systemische Therapie', 'Solution Focused', 'Online-Coaching'],
      specialties: ['Beziehungsberatung', 'Identität', 'Lebensübergänge'],
      priceMin: 7500,
      priceMax: 11000,
      languages: ['de-AT', 'es'],
      online: true,
      city: 'Online',
      country: 'AT',
      about:
        'Arbeitet mit systemischen Kurzzeitinterventionen und fokussiert auf Beziehungen sowie LGBTQIA+-affirmative Begleitung.',
      availabilityNote:
        'Kurzfristige Online-Slots täglich 08:00–10:00 sowie 18:00–21:00 Uhr; Wochenendtermine jeden ersten Samstag.',
      pricingNote:
        '€75–110 je Einheit, Paarsettings €140. Reduzierte Kontingente für Community-Projekte.',
      isPublic: true,
    },
    listing: {
      plan: 'FREE',
      status: 'ACTIVE',
    },
  },
]

export type SeedCourse = {
  slug: string
  title: string
  shortDescription: string
  description: string
  focus: string
  duration: string
  intensity: string
  format: string
  outcomes: string[]
  price: number
  currency: string
  status: CourseStatus
  therapistEmail: string
  mediaManifest: {
    totalDuration: number
    format: string
    chapters: number
  }
  lessons: Array<{
    title: string
    durationSec: number
  }>
}

export const seedCourses: SeedCourse[] = [
  {
    slug: 'stabil-durch-den-alltag',
    title: 'Stabil durch den Alltag',
    shortDescription: '4-wöchiger Selbstlern-Track für Stressreduktion und klare Routinen.',
    description:
      'Ein strukturierter Vier-Wochen-Track mit geführten Übungen, Atemtechniken und täglichen Klarheitsfragen. Ideal, um Stressoren zu identifizieren und nachhaltige Routinen aufzubauen.',
    focus: 'Stress & Dysregulation',
    duration: '4 Wochen · 3 Module · 20 Min/Tag',
    intensity: 'Begleitend zur Therapie',
    format: 'On-Demand Videos, Audioübungen, Check-ins',
    outcomes: [
      'Geführte Atem- und Körperübungen',
      'Tägliche Klarheitsfragen per App',
      'Impulse für Micro-Pausen im Arbeitsalltag',
    ],
    price: 4900,
    currency: 'EUR',
    status: 'PUBLISHED',
    therapistEmail: 'dr.mueller@example.com',
    mediaManifest: {
      totalDuration: 3600,
      format: 'video/mp4',
      chapters: 8,
    },
    lessons: [
      { title: 'Einführung: Was ist Stress?', durationSec: 420 },
      { title: 'Atemtechniken zur Regulation', durationSec: 380 },
      { title: 'Routinen planen & halten', durationSec: 450 },
      { title: 'Micro-Interventionen im Alltag', durationSec: 520 },
      { title: 'Reflexion & Transfer', durationSec: 420 },
    ],
  },
  {
    slug: 'mentale-klarheit-nach-krisen',
    title: 'Mentale Klarheit nach Krisen',
    shortDescription: 'Hybridprogramm mit Live-Sessions, psychischer Erste Hilfe und Community.',
    description:
      'Ein sechswöchiges Hybridprogramm mit Live-Gruppen, 1:1 Check-ins und Ressourcen für den Umgang mit postakuter Belastung.',
    focus: 'Postakute Belastung',
    duration: '6 Wochen · Hybrid · 1 Live-Session/Woche',
    intensity: 'Strukturiertes Hybridprogramm',
    format: 'Live-Gruppen, 1:1 Check-ins, digitale Bibliothek',
    outcomes: [
      'Stabilisierende Coping-Strategien',
      'Selbstfürsorgepläne mit Therapeut:innenfeedback',
      'Optionales Familienbriefing',
    ],
    price: 8900,
    currency: 'EUR',
    status: 'PUBLISHED',
    therapistEmail: 'mag.wagner@example.com',
    mediaManifest: {
      totalDuration: 5400,
      format: 'video/mp4',
      chapters: 10,
    },
    lessons: [
      { title: 'Stabilisierungsphase', durationSec: 480 },
      { title: 'Psychoedukation & Ressourcen', durationSec: 540 },
      { title: 'Live-Session Vorbereitung', durationSec: 360 },
      { title: 'Nachsorge & Transfer', durationSec: 420 },
    ],
  },
  {
    slug: 'adhs-klartext',
    title: 'ADHS Klartext',
    shortDescription: 'Alltagsstrategien, Executive Skills und emotionale Regulation für Erwachsene.',
    description:
      'Ein praxisnahes Programm mit Live-Workshops, Habit-Tracking und Materialien zur Emotionsregulation für Erwachsene mit ADHS.',
    focus: 'ADHS im Erwachsenenalter',
    duration: '5 Wochen · Live & On-Demand',
    intensity: 'Coaching-Fokus, optional 1:1',
    format: 'Live-Workshops, Habit-Tracker, Mikro-Lectures',
    outcomes: [
      'Wochenstruktur planen & halten',
      'Impulsmanagement mit praktischen Tools',
      'Community-Support in moderierten Foren',
    ],
    price: 6900,
    currency: 'EUR',
    status: 'PUBLISHED',
    therapistEmail: 'sofia.kraus@example.com',
    mediaManifest: {
      totalDuration: 4200,
      format: 'video/mp4',
      chapters: 9,
    },
    lessons: [
      { title: 'ADHS verstehen', durationSec: 400 },
      { title: 'Executive Skills trainieren', durationSec: 520 },
      { title: 'Impulsmanagement', durationSec: 460 },
      { title: 'Live-Workshop Vorbereitung', durationSec: 380 },
    ],
  },
]
