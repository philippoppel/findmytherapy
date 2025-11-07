export const marketingNavigation = [
  { label: 'Warum', href: '#why' },
  { label: 'Ersteinschätzung', href: '/triage' },
  { label: 'Therapeut:innen', href: '#therapists' },
  { label: 'Angebote', href: '#features' },
  { label: 'PHQ & GAD', href: '#phq-info' },
  { label: 'Early Access', href: '#early-access' },
  { label: 'Team', href: '#team' },
  { label: 'FAQ', href: '#faq' },
] as const

export const heroContent = {
  eyebrow: 'Mentale Gesundheit mit klarer Orientierung',
  title: 'FindMyTherapy – Klarheit ab dem ersten Klick.',
  highlight: 'Digitale Ersteinschätzung, persönliches Matching und begleitende Programme auf einer Plattform.',
  description:
    'Unsere Ampel-Triage führt dich in wenigen Minuten durch eine evidenzbasierte Ersteinschätzung. Je nach Ergebnis begleiten wir dich mit Kursen, sofort verfügbaren Therapeut:innen oder Krisenkontakten – transparent und DSGVO-konform.',
  primaryCta: {
    label: 'Kostenlose Ersteinschätzung starten',
    href: '/triage',
  },
  secondaryCta: {
    label: 'Mehr erfahren',
    href: '#why',
  },
  tertiaryCta: {
    label: 'Angebote ansehen',
    href: '#features',
  },
  metrics: [
    { value: 'PHQ-9 & GAD-7', label: 'Validierte Tests' },
    { value: '< 5 Min.', label: 'bis zu deinem persönlichen Ergebnis' },
    { value: 'Ampel-Logik', label: 'Grün • Gelb • Rot' },
  ],
}

export const impactStats = [
  {
    value: 'PHQ-9 & GAD-7',
    emphasis: 'Validierte Fragebögen',
    description: 'International anerkannte Screening-Tools, die von Therapeut:innen weltweit eingesetzt werden.',
  },
  {
    value: 'DSGVO-konform',
    emphasis: '& verschlüsselt',
    description: 'Deine Daten bleiben sicher in der EU. Volle Kontrolle über deine persönlichen Informationen.',
  },
  {
    value: '< 5 Minuten',
    emphasis: 'zu Klarheit',
    description: 'Von Unsicherheit zu konkreten nächsten Schritten. Evidenzbasiert und wissenschaftlich fundiert.',
  },
] as const

export const whyContent = {
  id: 'why',
  title: 'Warum Orientierung zählt, bevor der erste Termin stattfindet.',
  description:
    'Viele Menschen wissen nicht, ob sie einen Termin brauchen, welche Therapieform passt oder wo sie sofort Hilfe bekommen. FindMyTherapy verbindet Screening, Matching und Begleitung – damit Betroffene und Therapeut:innen mit einem gemeinsamen Bild starten.',
  bullets: [
    'Ampel-Triage mit validierten Fragebögen und Sofort-Empfehlungen für Österreich.',
    'Kombination aus Kursen, Videos und Psychoedukation – individuell freigeschaltet nach Bedarf.',
    'Direkter Draht zu verifizierten Therapeut:innen inklusive Themen-, Standort- und Verfügbarkeitsfilter.',
  ],
  cta: {
    label: 'Kostenlose Triage testen',
    href: '/triage',
  },
  image: {
    src: '/images/therapists/therapy-1.jpg',
    alt: 'Digitale Ersteinschätzung auf dem Tablet',
  },
}

type FeaturePoint = {
  title: string
  description: string
}

export type FeatureIconKey = 'mic' | 'users' | 'video' | 'fileText' | 'sparkles' | 'chart'

export type FeatureTab = {
  value: string
  label: string
  heading: string
  description: string
  icon: FeatureIconKey
  points: FeaturePoint[]
  highlights: {
    title: string
    items: string[]
  }
}

export const featureTabs: FeatureTab[] = [
  {
    value: 'triage',
    label: 'Digitale Ersteinschätzung',
    heading: 'In fünf Minuten von Unsicherheit zu Klarheit.',
    description:
      'Unsere validierten Fragen ermitteln Belastung, Ressourcen und Handlungsbedarf. Du erhältst sofort dein Ampel-Ergebnis mit konkreten Empfehlungen.',
    icon: 'sparkles',
    points: [
      { title: 'Validierte Fragebögen', description: 'PHQ-9, GAD-7 und themenspezifische Screening-Module.' },
      { title: 'Ampellogik', description: 'Grün: Selbsthilfe • Gelb: Terminempfehlung • Rot: Soforthilfe.' },
      { title: 'Exportierbare Insights', description: 'Teile Ergebnisse mit Therapeut:innen oder vertrauten Personen.' },
    ],
    highlights: {
      title: 'Wissenschaftliche Grundlage',
      items: [
        'PHQ-9 und GAD-7 sind international validierte und wissenschaftlich fundierte Screening-Tools.',
        'Alle Daten werden DSGVO-konform verschlüsselt und auf Servern in der EU gespeichert.',
        'Du behältst die volle Kontrolle und entscheidest, mit wem du deine Ergebnisse teilst.',
      ],
    },
  },
  {
    value: 'matching',
    label: 'Matching & Termine',
    heading: 'Die richtige Therapeut:in – online oder vor Ort.',
    description:
      'Wir filtern nach Schwerpunkten, Kapazitäten, Settings und Versicherungsstatus. Du buchst direkt über die Plattform oder lässt dich vom Care-Team begleiten.',
    icon: 'users',
    points: [
      { title: 'Feinsortierte Profile', description: 'Therapieansatz, Zielgruppen, Sprachen, Barrierefreiheit.' },
      { title: 'Sofort buchbare Slots', description: 'Online-Kalender und Wartelistenmanagement in Echtzeit.' },
      { title: 'Care-Team Support', description: 'Menschen helfen dir, wenn du weitere Fragen hast.' },
    ],
    highlights: {
      title: 'Qualitätsversprechen',
      items: [
        'Alle Therapeut:innen werden verifiziert und erfüllen die gesetzlichen Anforderungen in Österreich.',
        'Du siehst nur Profile, die aktuell Kapazitäten haben oder auf der Warteliste Plätze anbieten.',
        'Unser Care-Team unterstützt dich persönlich bei der Suche und bei allen Fragen.',
      ],
    },
  },
  {
    value: 'courses',
    label: 'Kursbibliothek',
    heading: 'Selbsthilfe, die begleitet – nicht ersetzt.',
    description:
      'Von Psychoedukation bis zu therapeutisch konzipierten Übungen: Kurse und Mini-Programme unterstützen zwischen Terminen oder bei grüner Ampel.',
    icon: 'video',
    points: [
      { title: 'Teaser & Vollversionen', description: 'Kostenlose Schnuppermodule, freischaltbare Vollprogramme.' },
      { title: 'Therapiekompatibel', description: 'Inhalte abgestimmt mit Therapeut:innen zur Nachbereitung.' },
      { title: 'Fortschritt sichtbar', description: 'Trackbare Kapitel mit Erinnerungen und Erfolgs-Highlights.' },
    ],
    highlights: {
      title: 'Therapeutisch fundiert',
      items: [
        'Alle Kurse werden in Zusammenarbeit mit Psychotherapeut:innen entwickelt und geprüft.',
        'Inhalte ergänzen Therapie, ersetzen sie aber nicht – bei Bedarf empfehlen wir professionelle Hilfe.',
        'Du kannst Kurse jederzeit pausieren und deinen Fortschritt bleibt gespeichert.',
      ],
    },
  },
  {
    value: 'portal',
    label: 'Therapeut:innen-Portal',
    heading: 'Praxisverwaltung ohne Medienbruch.',
    description:
      'Therapeut:innen behalten ihre Einheiten, Klient:innen und freigegebenen Kurse im Blick – inklusive sicherer Kommunikation.',
    icon: 'fileText',
    points: [
      { title: 'Klient:innen-Übersicht', description: 'Dokumentation von Sitzungen, Aufgaben und Check-ins.' },
      { title: 'Freigaben steuern', description: 'Kurse, Materialien und Übungen direkt teilen.' },
      { title: 'Abrechnung & Belege', description: 'Exportfunktionen für Honorarnoten und Versicherungen.' },
    ],
    highlights: {
      title: 'Sicher & praktisch',
      items: [
        'End-zu-End-Verschlüsselung für alle Nachrichten und Dokumente zwischen dir und deinen Klient:innen.',
        'Rollenbasierte Zugriffsrechte für Praxisgemeinschaften und Team-Settings.',
        'Automatische Backups und Versionierung aller Dokumentationen.',
      ],
    },
  },
  {
    value: 'insights',
    label: 'Praxis-Insights',
    heading: 'Was wirkt? Daten für Supervision & Wachstum.',
    description:
      'Analysen zeigen Verlauf, Kursteilnahmen und Auslastung – natürlich nur mit Zustimmung der Klient:innen und DSGVO-konform.',
    icon: 'chart',
    points: [
      { title: 'Verlaufsdiagramme', description: 'Symptomentwicklung, Zielerreichung und Feedbackfragen.' },
      { title: 'Auslastung im Blick', description: 'Freie Slots, Warteliste und Nachfrage nach Themen.' },
      { title: 'Exportierbar', description: 'Reports für Supervision, Qualitätszirkel und Förderprogramme.' },
    ],
    highlights: {
      title: 'Datenschutz first',
      items: [
        'Alle Analysen sind anonymisiert und aggregiert – keine individuellen Klient:innen-Daten werden offengelegt.',
        'Klient:innen müssen explizit zustimmen, bevor ihre Daten für Insights verwendet werden.',
        'Volle DSGVO-Compliance mit Server-Standort in Österreich.',
      ],
    },
  },
]

export const earlyAccessContent = {
  eyebrow: 'Early Access',
  title: 'Werde Teil der ersten Nutzer:innen',
  description:
    'FindMyTherapy befindet sich in der Beta-Phase und wird gemeinsam mit Psychotherapeut:innen aufgebaut. Dein Feedback fließt direkt in die Entwicklung ein.',
  features: [
    {
      title: 'Kostenloser Zugang zur Beta',
      description: 'Nutze alle Features kostenlos während der Aufbauphase und hilf uns, die Plattform zu verbessern.',
    },
    {
      title: 'Therapeut:innen-Netzwerk in Aufbau',
      description: 'Wir arbeiten mit etablierten Praxen und Kliniken zusammen, um ein verifiziertes Netzwerk aufzubauen.',
    },
    {
      title: 'Dein Feedback zählt',
      description: 'Als Early-Access-Nutzer:in gestaltest du aktiv mit, wie die Versorgung in Österreich verbessert wird.',
    },
    {
      title: 'Transparenz vor Marketing',
      description: 'Wir kommunizieren ehrlich, wo wir stehen und was noch kommt. Keine falschen Versprechungen.',
    },
  ],
  mission: {
    title: 'Warum wir FindMyTherapy bauen',
    description:
      'In Österreich warten Menschen durchschnittlich 6+ Monate auf einen Therapieplatz. Viele wissen nicht, ob sie überhaupt professionelle Hilfe benötigen. Mit FindMyTherapy schaffen wir Orientierung und helfen, die Versorgungslücke zu schließen – evidenzbasiert, transparent und gemeinsam mit Expert:innen.',
  },
} as const

export const teamContent = {
  heading: 'Menschen, die Versorgungslücken schließen wollen.',
  description:
    'Wir kombinieren psychotherapeutische Expertise, digitale Produktentwicklung und Forschung. Mit Partnerpraxen, Kliniken und Selbsthilfegruppen entwickeln wir FindMyTherapy kontinuierlich weiter.',
  members: [
    {
      name: 'MMag. Dr. Gregor Studlar BA',
      role: 'Psychotherapeut – Verhaltenstherapie',
      focus: 'Klinische Erfahrung Neuromed Campus • Schwerpunkt: Angst, Depression, Burnout',
    },
    {
      name: 'BA.pth. Thomas Kaufmann',
      role: 'Psychotherapeut',
      focus: 'Sigmund Freud Universität Wien • Notfallsanitäter-Hintergrund (Krisenkompetenz)',
    },
    {
      name: 'Dipl. Ing. Philipp Oppel',
      role: 'Full Stack Developer',
      focus: 'Technische Leitung & Plattformentwicklung',
    },
  ],
  ctas: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/findmytherapy' },
    { label: 'Instagram', href: 'https://www.instagram.com/findmytherapy' },
  ],
}

export const partnerLogos = [
  { name: 'Austrian Startups', initials: 'AS' },
  { name: 'SFU Wien', initials: 'SFU' },
  { name: 'World Council for Psychotherapy', initials: 'WCP' },
  { name: '104 – Krisenhilfe Wien', initials: '104' },
] as const

export const faqItems = [
  {
    question: 'Wie funktioniert die Ampel-Triage?',
    answer:
      'Wir kombinieren validierte Fragebögen mit weiteren Kontextfragen. Aus den Antworten ergibt sich eine Ampel-Einschätzung: Grün (Selbsthilfe & Kurse), Gelb (Therapieempfehlung) oder Rot (Krisenhinweise). Jede Stufe enthält konkrete nächste Schritte.',
  },
  {
    question: 'Sind meine Angaben sicher?',
    answer:
      'Ja. Alle Daten werden verschlüsselt auf Servern in der EU gespeichert. Therapeut:innen sehen deine Triage-Ergebnisse nur, wenn du sie aktiv freigibst. Für Notfälle gilt: Wir zeigen dir Nummern und Ressourcen, ohne Daten weiterzuleiten.',
  },
  {
    question: 'Wie werde ich als Therapeut:in gelistet?',
    answer:
      'Bewirb dich über unsere Plattform, lade Qualifikationen hoch und definiere deine Schwerpunkte. Nach erfolgreicher Verifizierung legen wir dein Profil frei. Du verwaltest Verfügbarkeit, Angebote und Kurse selbstständig im Portal.',
  },
  {
    question: 'Kann ich FindMyTherapy auch im Team nutzen?',
    answer:
      'Ja. Praxisgemeinschaften, Lehrpraxen und Organisationen erhalten gemeinsame Dashboards, Rollenrechte und Exportoptionen. Unser Care-Team unterstützt beim Onboarding und bei der Integration bestehender Prozesse.',
  },
] as const

export const contactCta = {
  heading: 'Versorgung neu gedacht – mit dir.',
  subheading: 'Vernetze dein Team, teile Kurse und entlaste dein Frontdesk. Wir zeigen dir, wie FindMyTherapy in deiner Praxis funktioniert.',
  primaryCta: {
    label: 'Demo für Therapeut:innen buchen',
    href: '/contact?type=therapists',
  },
  secondaryCta: {
    label: 'Infopaket herunterladen',
    href: '/docs?category=findmytherapy',
  },
}

export const testimonialList = [
  {
    id: '1',
    quote: 'Die Ersteinschätzung hat mir geholfen, meine Situation besser zu verstehen. Die Empfehlungen waren präzise und hilfreich.',
    author: 'Sarah M.',
    role: 'Klientin',
    rating: 5,
  },
  {
    id: '2',
    quote: 'Als Therapeutin schätze ich die wissenschaftliche Fundierung der Triage. PHQ-9 und GAD-7 sind Gold-Standard.',
    author: 'Dr. Anna Leitner',
    role: 'Psychotherapeutin',
    rating: 5,
  },
  {
    id: '3',
    quote: 'Endlich eine Plattform, die Transparenz und Datenschutz ernst nimmt. Die Ampel-Logik ist sofort verständlich.',
    author: 'Michael K.',
    role: 'Klient',
    rating: 5,
  },
] as const
