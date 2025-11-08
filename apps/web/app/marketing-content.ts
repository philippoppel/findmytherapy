export const marketingNavigation = [
  { label: 'Warum', href: '#why' },
  { label: 'Ersteinschätzung', href: '/triage' },
  { label: 'Vorteile', href: '#benefits' },
  { label: 'Therapeut:innen', href: '#therapists' },
  { label: 'Team', href: '#team' },
  { label: 'PHQ & GAD', href: '#phq-info' },
  { label: 'Early Access', href: '#early-access' },
  { label: 'FAQ', href: '#faq' },
] as const

export const heroContent = {
  eyebrow: 'Evidenzbasierte Ersteinschätzung & Matching',
  title: 'Mentale Gesundheit mit klarer Orientierung.',
  highlight: 'Für Klient:innen, die Hilfe suchen. Für Therapeut:innen, die wirken wollen.',
  description:
    'Validierte Ampel-Triage (PHQ-9, GAD-7, WHO-5) in unter 5 Minuten – mit Kursen, Therapeut:innen-Matching oder Krisenhilfe. Therapeut:innen erhalten Session-Zero-Dossiers, kostenlose Microsite und professionelle Praxis-Tools. Transparent und DSGVO-konform.',
  primaryCta: {
    label: 'Kostenlose Ersteinschätzung starten',
    href: '/triage',
  },
  secondaryCta: {
    label: 'Für Therapeut:innen',
    href: '#therapists',
  },
  tertiaryCta: {
    label: 'Angebote ansehen',
    href: '#features',
  },
  metrics: [
    { value: 'PHQ-9 & GAD-7', label: 'Validierte Tests' },
    { value: '< 5 Min.', label: 'Bis zum Ergebnis' },
    { value: 'DSGVO-konform', label: 'Daten sicher in der EU' },
  ],
  image: {
    src: '/images/therapists/therapy-1.jpg',
    alt: 'Professionelle Therapiesitzung – FindMyTherapy verbindet Klient:innen und Therapeut:innen',
  },
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

export type FeatureIconKey = 'mic' | 'users' | 'video' | 'fileText' | 'sparkles' | 'chart' | 'briefcase' | 'globe' | 'clipboardCheck' | 'trendingUp' | 'dollarSign'

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
    heading: 'Hochwertige Kurse von Expert:innen – für deine mentale Gesundheit.',
    description:
      'Von Psychoedukation bis zu therapeutisch konzipierten Übungen: Zugang zu professionellen Kursen und Mini-Programmen, die von echten Therapeut:innen erstellt wurden. Unterstütze dich selbst zwischen Terminen oder starte direkt mit Selbsthilfe.',
    icon: 'video',
    points: [
      { title: 'Von echten Therapeut:innen', description: 'Kurse werden von verifizierten Psychotherapeut:innen erstellt und sind therapeutisch fundiert.' },
      { title: 'Kostenlose & Premium-Inhalte', description: 'Kostenlose Schnuppermodule oder Vollprogramme – passend zu deinem Bedarf und Budget.' },
      { title: 'Flexibel & selbstbestimmt', description: 'Lerne in deinem Tempo, pausiere jederzeit und behalte die volle Kontrolle über deinen Fortschritt.' },
    ],
    highlights: {
      title: 'Professionell & zugänglich',
      items: [
        'Alle Kurse werden in Zusammenarbeit mit Psychotherapeut:innen entwickelt und geprüft.',
        'Günstiger als klassische Therapie – ideal als Ergänzung oder Einstieg in die Selbsthilfe.',
        'Inhalte ergänzen Therapie, ersetzen sie aber nicht – bei Bedarf empfehlen wir professionelle Hilfe.',
      ],
    },
  },
  {
    value: 'session-zero',
    label: 'Session-Zero-Dossier',
    heading: 'Bereite dich vor dem Erstgespräch optimal vor – mit validierten Daten.',
    description:
      'Erhalte VOR dem ersten Termin ein strukturiertes Dossier mit PHQ-9/GAD-7 Scores, Risikoindikatoren und Themenprioritäten. So startest du informiert und sparst wertvolle Zeit.',
    icon: 'clipboardCheck',
    points: [
      { title: 'Validierte Screening-Daten', description: 'PHQ-9 und GAD-7 Scores bereits vor Session 1 – keine Zeit mit Grundlagen verschwenden.' },
      { title: 'Risikoindikatoren & Red Flags', description: 'Sofort erkennbar: Suizidalität, Selbstverletzung oder akute Krisensituationen.' },
      { title: 'Themenprioritäten & Präferenzen', description: 'Heatmap der Belastungsbereiche plus Wunschthemen, Format-Präferenzen und organisatorische Details.' },
    ],
    highlights: {
      title: 'Double-Sided Data Moat – Nur bei uns',
      items: [
        'Einzigartiger Datenvorteil: Wir kombinieren hochwertige Klient:innen-Intake-Daten mit verifizierten Therapeut:innen-Profilen.',
        'Höhere Match-Qualität = weniger Therapieabbrüche und bessere Outcomes von Anfang an.',
        'Time-to-first-session unter 5 Tagen – von Ersteinschätzung bis zum ersten Termin.',
      ],
    },
  },
  {
    value: 'microsite',
    label: 'Deine eigene Microsite',
    heading: 'LinkedIn++ meets persönliche Website – automatisch & SEO-optimiert.',
    description:
      'Jeder verifizierte Therapeut erhält eine professionelle Microsite (findmytherapy.com/t/[dein-name]) – ohne Kosten, ohne Wartung, mit Trust-Badges und Lead-Capture.',
    icon: 'globe',
    points: [
      { title: 'Automatisch generiert', description: 'Dein Profil aus dem Dashboard wird zur SEO-optimierten Webseite – inklusive Hero, Bio, Spezialisierungen und Verfügbarkeiten.' },
      { title: 'Trust & Compliance prominent', description: 'Verified Badge, Compliance-PDF-Download und Session-Zero-CTA automatisch eingebunden.' },
      { title: 'Lead-Capture & Analytics', description: 'Kontaktformular mit direkter CRM-Integration plus Dashboard mit Pageviews, CTA-Klicks und Lead-Conversion.' },
    ],
    highlights: {
      title: 'Spar dir Zeit & Geld',
      items: [
        'Keine eigene Website nötig: Spare 500-2.000€ für Entwicklung und laufende Hosting-Kosten.',
        'SEO inklusive: Profitiere von der Domain Authority von FindMyTherapy und strukturierten Daten (Schema.org).',
        'Immer aktuell: Änderungen im Dashboard werden automatisch synchronisiert – keine doppelte Pflege.',
      ],
    },
  },
  {
    value: 'portal',
    label: 'Praxisverwaltung',
    heading: 'Klient:innen, Termine und Dokumentation – alles an einem Ort.',
    description:
      'Behalte den Überblick über Einheiten, Klient:innen und freigegebene Kurse. Dokumentiere Sitzungen, steuere Freigaben und exportiere Honorarnoten – DSGVO-konform.',
    icon: 'fileText',
    points: [
      { title: 'Klient:innen-Übersicht', description: 'Dokumentation von Sitzungen, Aufgaben und Check-ins an einem zentralen Ort.' },
      { title: 'Freigaben steuern', description: 'Teile Kurse, Materialien und Übungen direkt mit deinen Klient:innen.' },
      { title: 'Abrechnung & Belege', description: 'Exportfunktionen für Honorarnoten und Versicherungsbelege – einfach und übersichtlich.' },
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
    label: 'Praxis-Analytics',
    heading: 'Datenbasiert arbeiten – für Supervision, Qualität und Wachstum.',
    description:
      'Verlaufsdiagramme, Auslastungs-Tracking und exportierbare Reports helfen dir, deine Praxis zu optimieren – natürlich DSGVO-konform und nur mit Zustimmung der Klient:innen.',
    icon: 'chart',
    points: [
      { title: 'Verlaufsdiagramme', description: 'Symptomentwicklung, Zielerreichung und Feedbackfragen visuell aufbereitet.' },
      { title: 'Auslastung im Blick', description: 'Freie Slots, Warteliste und Nachfrage nach Themen – für bessere Kapazitätsplanung.' },
      { title: 'Exportierbar', description: 'Reports für Supervision, Qualitätszirkel und Förderprogramme im CSV- oder PDF-Format.' },
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
      role: 'Psychotherapeut – Verhaltenstherapie • Founder',
      focus: 'Klinische Erfahrung Neuromed Campus • Schwerpunkt: Angst, Depression, Burnout',
      image: '/images/team/gregorstudlar.jpg',
      imagePosition: 'center top',
      imageScale: 1,
    },
    {
      name: 'Thomas Kaufmann, BA pth.',
      role: 'Psychotherapeut i.A.u.S • Verhaltenstherapie • Founder',
      focus: 'Sigmund Freud Universität Wien • Notfallsanitäter-Hintergrund (Krisenkompetenz)',
      image: '/images/team/thomaskaufmann.jpeg',
      imagePosition: 'center 80%',
      imageScale: 1,
    },
    {
      name: 'Dipl. Ing. Philipp Oppel',
      role: 'Full Stack Developer',
      focus: 'Technische Leitung & Plattformentwicklung',
      image: '/images/team/philippoppel.jpeg',
      imagePosition: 'center 20%',
      imageScale: 1,
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
    question: 'Warum sollte ich mich als Therapeut:in auf FindMyTherapy registrieren?',
    answer:
      'Du erhältst vier einzigartige Vorteile: (1) Session-Zero-Dossiers mit validierten PHQ-9/GAD-7 Daten VOR dem Erstgespräch – für bessere Vorbereitung und höhere Match-Qualität. (2) Eine automatische, SEO-optimierte Microsite (findmytherapy.com/t/[dein-name]) als deine persönliche Website – ohne Kosten und Wartungsaufwand. (3) Praxisverwaltung, Analytics und Lead-Capture in einem zentralen Dashboard. (4) Kurse erstellen & monetarisieren – baue passives Einkommen mit therapeutisch fundierten Online-Programmen auf. Nach Verifizierung verwaltest du Verfügbarkeit, Angebote und Kurse selbstständig.',
  },
  {
    question: 'Kann ich FindMyTherapy auch im Team nutzen?',
    answer:
      'Ja. Praxisgemeinschaften, Lehrpraxen und Organisationen erhalten gemeinsame Dashboards, Rollenrechte und Exportoptionen. Unser Care-Team unterstützt beim Onboarding und bei der Integration bestehender Prozesse.',
  },
  {
    question: 'Können Therapeut:innen eigene Kurse anbieten und damit Geld verdienen?',
    answer:
      'Ja! Therapeut:innen können therapeutisch fundierte Online-Kurse und Programme erstellen, die entweder ihren eigenen Klient:innen oder der gesamten Community zur Verfügung stehen. Die Plattform übernimmt automatisches Billing, Umsatztracking und Qualitätssicherung. So kannst du passives Einkommen aufbauen und dein Expertenwissen skalieren.',
  },
  {
    question: 'Welche Kurse stehen für Klient:innen zur Verfügung?',
    answer:
      'Alle Kurse werden von verifizierten Psychotherapeut:innen erstellt und sind therapeutisch fundiert. Es gibt kostenlose Schnuppermodule und Premium-Programme zu verschiedenen Themen (z.B. Angst, Depression, Stress). Die Kurse sind günstiger als klassische Therapie und ideal als Ergänzung oder Einstieg in die Selbsthilfe. Du lernst in deinem eigenen Tempo und kannst jederzeit pausieren.',
  },
] as const

export const clientBenefits = {
  id: 'benefits',
  eyebrow: 'Für Klient:innen',
  title: 'Klarheit finden. Hilfe bekommen. Selbstbestimmt wachsen.',
  description:
    'FindMyTherapy begleitet dich von der ersten Unsicherheit bis zur passenden Unterstützung – transparent, wissenschaftlich fundiert und immer an deiner Seite.',
  benefits: [
    {
      icon: 'sparkles' as const,
      title: 'Kostenlose Ersteinschätzung',
      subtitle: 'In weniger als 5 Minuten von Unsicherheit zu Klarheit',
      description:
        'Unsere validierte Ampel-Triage (PHQ-9, GAD-7, WHO-5) zeigt dir sofort, wo du stehst und welche nächsten Schritte passen – ohne Wartezeit, ohne Kosten.',
      highlights: [
        'Wissenschaftlich validierte Fragebögen (PHQ-9, GAD-7)',
        'Sofort-Ergebnis mit konkreten Empfehlungen',
        'Ampel-Logik: Grün • Gelb • Rot',
        'Exportierbar für deine Therapeut:in',
      ],
    },
    {
      icon: 'users' as const,
      title: 'Passende Therapeut:innen finden',
      subtitle: 'Matching nach deinen Bedürfnissen – nicht Zufall',
      description:
        'Finde Therapeut:innen, die wirklich zu dir passen: nach Themen, Verfügbarkeit, Standort, Kassenstatus und Settings. Mit verifizierten Profilen und echten Kapazitäten.',
      highlights: [
        'Alle Therapeut:innen sind verifiziert',
        'Filter nach Themen, Ort, Budget & Verfügbarkeit',
        'Nur Profile mit echten freien Kapazitäten',
        'Care-Team unterstützt dich persönlich',
      ],
    },
    {
      icon: 'video' as const,
      title: 'Hochwertige Kurse & Selbsthilfe',
      subtitle: 'Von echten Therapeut:innen – für dich',
      description:
        'Zugang zu professionellen Kursen und Mini-Programmen, die von verifizierten Psychotherapeut:innen erstellt wurden. Günstiger als Therapie, flexibel in deinem Tempo.',
      highlights: [
        'Kurse von verifizierten Therapeut:innen',
        'Kostenlose Schnuppermodule verfügbar',
        'Günstiger als klassische Therapie',
        'Flexibel lernen – pausieren jederzeit möglich',
      ],
    },
  ],
  cta: {
    primary: {
      label: 'Kostenlose Ersteinschätzung starten',
      href: '/triage',
    },
    secondary: {
      label: 'Therapeut:innen durchsuchen',
      href: '#therapists',
    },
  },
} as const

export const therapistBenefits = {
  id: 'therapists',
  eyebrow: 'Für Therapeut:innen',
  title: 'Starte informierter. Wachse sichtbarer. Arbeite effizienter.',
  description:
    'FindMyTherapy ist mehr als eine Vermittlungsplattform. Du erhältst Tools, die deine Praxis transformieren – von der Vorbereitung bis zur Sichtbarkeit.',
  benefits: [
    {
      icon: 'clipboardCheck' as const,
      title: 'Session-Zero-Dossier',
      subtitle: 'Starte mit validierten Daten ins Erstgespräch',
      description:
        'Erhalte VOR dem ersten Termin ein strukturiertes Dossier mit PHQ-9/GAD-7 Scores, Risikoindikatoren und Themenprioritäten. Spare Zeit und starte informiert.',
      highlights: [
        'Validierte PHQ-9 & GAD-7 Scores vor Session 1',
        'Red Flags & Risikoindikatoren sofort erkennbar',
        'Themenprioritäten & Präferenzen als Heatmap',
        'Time-to-first-session unter 5 Tagen',
      ],
    },
    {
      icon: 'globe' as const,
      title: 'Deine eigene Microsite',
      subtitle: 'LinkedIn++ meets persönliche Website – kostenlos',
      description:
        'Jeder verifizierte Therapeut erhält automatisch eine SEO-optimierte Microsite (findmytherapy.com/t/[dein-name]) – ohne Kosten, ohne Wartung, mit Trust-Badges und Lead-Capture.',
      highlights: [
        'Spare 500-2.000€ für Website-Entwicklung',
        'SEO-optimiert mit Domain Authority',
        'Lead-Capture & Analytics inklusive',
        'Automatische Synchronisation mit deinem Dashboard',
      ],
    },
    {
      icon: 'briefcase' as const,
      title: 'All-in-One Praxis-Management',
      subtitle: 'Verwaltung, Analytics und Abrechnung in einem',
      description:
        'Klient:innen-Verwaltung, Dokumentation, Verlaufsdiagramme und Abrechnungs-Exports in einem zentralen Dashboard. DSGVO-konform und mit End-zu-End-Verschlüsselung.',
      highlights: [
        'Klient:innen-Übersicht & Dokumentation',
        'Verlaufsdiagramme & Auslastungs-Tracking',
        'Abrechnungs-Exports für Honorarnoten',
        'End-zu-End-Verschlüsselung & EU-Server',
      ],
    },
    {
      icon: 'trendingUp' as const,
      title: 'Kurse erstellen & monetarisieren',
      subtitle: 'Baue passives Einkommen mit deinem Expertenwissen auf',
      description:
        'Erstelle therapeutisch fundierte Online-Kurse und Programme, teile sie mit deinen Klient:innen oder der gesamten Community – und verdiene damit. Automatisches Billing, Tracking und Qualitätssicherung inklusive.',
      highlights: [
        'Passive Income durch Online-Kurse & Programme',
        'Automatisches Billing & Umsatztracking',
        'Reichweite über die Plattform-Community',
        'Therapeutisch geprüft & qualitätsgesichert',
      ],
    },
  ],
  cta: {
    primary: {
      label: 'Demo für Therapeut:innen buchen',
      href: 'mailto:hello@findmytherapy.net?subject=Demo-Anfrage%20%E2%80%93%20FindMyTherapy%20f%C3%BCr%20Therapeut%3Ainnen&body=Sehr%20geehrtes%20FindMyTherapy-Team%2C%0A%0Aich%20interessiere%20mich%20f%C3%BCr%20eine%20Demo%20der%20Plattform%20f%C3%BCr%20Therapeut%3Ainnen.%20Ich%20m%C3%B6chte%20mehr%20%C3%BCber%20die%20Session-Zero-Dossiers%2C%20die%20Microsite%20und%20die%20Praxis-Management-Tools%20erfahren.%0A%0AMeine%20Daten%3A%0AName%3A%20%5BIhr%20Name%5D%0APraxis%2FKlinik%3A%20%5BIhre%20Praxis%5D%0ATelefon%3A%20%5BIhre%20Telefonnummer%5D%0AE-Mail%3A%20%5BIhre%20E-Mail-Adresse%5D%0A%0AIch%20freue%20mich%20auf%20Ihre%20R%C3%BCckmeldung.%0A%0AMit%20freundlichen%20Gr%C3%BC%C3%9Fen',
    },
    secondary: {
      label: 'Mehr über unsere Features erfahren',
      href: '#why',
    },
  },
} as const

export const contactCta = {
  heading: 'Starte informierter. Wachse sichtbarer. Arbeite effizienter.',
  subheading: 'Erhalte Session-Zero-Dossiers vor jedem Erstgespräch, eine kostenlose Microsite und Praxisverwaltung in einem. Wir zeigen dir, wie FindMyTherapy deine Praxis transformiert.',
  primaryCta: {
    label: 'Demo für Therapeut:innen buchen',
    href: 'mailto:hello@findmytherapy.net?subject=Demo-Anfrage%20%E2%80%93%20FindMyTherapy%20f%C3%BCr%20Therapeut%3Ainnen&body=Sehr%20geehrtes%20FindMyTherapy-Team%2C%0A%0Aich%20interessiere%20mich%20f%C3%BCr%20eine%20Demo%20der%20Plattform%20f%C3%BCr%20Therapeut%3Ainnen.%20Ich%20m%C3%B6chte%20mehr%20%C3%BCber%20die%20Session-Zero-Dossiers%2C%20die%20Microsite%20und%20die%20Praxis-Management-Tools%20erfahren.%0A%0AMeine%20Daten%3A%0AName%3A%20%5BIhr%20Name%5D%0APraxis%2FKlinik%3A%20%5BIhre%20Praxis%5D%0ATelefon%3A%20%5BIhre%20Telefonnummer%5D%0AE-Mail%3A%20%5BIhre%20E-Mail-Adresse%5D%0A%0AIch%20freue%20mich%20auf%20Ihre%20R%C3%BCckmeldung.%0A%0AMit%20freundlichen%20Gr%C3%BC%C3%9Fen',
  },
  secondaryCta: {
    label: 'Infopaket herunterladen',
    href: '/downloads/findmytherapy-infopaket.pdf',
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
