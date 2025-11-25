export const marketingNavigation = [
  { label: 'Ratgeber', href: '/blog' },
  { label: 'Ersteinschätzung', href: '/triage' },
  { label: 'Vorteile', href: '#benefits' },
  { label: 'Therapeut:innen', href: '#therapist-directory' },
  { label: 'Über uns', href: '/about' },
  { label: 'FAQ', href: '#faq' },
] as const;

export const heroContent = {
  eyebrow: 'Expert:innen-Wissen & SEO-optimierte Therapeuten-Profile',
  title: 'Zwei Wege zu mentaler Gesundheit.',
  highlight: 'Sofortige Hilfe durch Wissen. Professionelle Begleitung durch Expert:innen.',
  description:
    'Entdecke gratis Ratgeber von anerkannten Psychotherapeut:innen für sofortige Hilfe. Oder finde verifizierte Therapeut:innen mit professionellen, SEO-optimierten Microsites. Therapeut:innen erhalten individuelle Microsites und maximale Online-Sichtbarkeit durch unsere SEO-Expert:innen. Transparent und DSGVO-konform (EU-Datenschutz).',
  primaryCta: {
    label: 'Matching starten',
    href: '#matching-wizard',
  },
  secondaryCta: {
    label: 'Alle durchsuchen',
    href: '#therapist-directory',
  },
  tertiaryCta: {
    label: 'Für Therapeut:innen',
    href: '/for-therapists',
  },
  emergencyCta: {
    label: 'Sofort-Hilfe bei Panikattacken',
    href: '/blog/akuthilfe-panikattacken',
  },
  metrics: [
    { value: 'Gratis', label: 'Expert:innen-Wissen' },
    { value: 'SEO-optimiert', label: 'Therapeuten-Profile' },
    { value: '100% DSGVO', label: 'EU-Datenschutz' },
  ],
  image: {
    src: '/images/therapists/therapy-1.jpg',
    alt: 'Professionelle Therapiesitzung – FindMyTherapy verbindet Wissen und Therapeut:innen',
  },
};

export const impactStats = [
  {
    value: 'PHQ-9 & GAD-7',
    emphasis: 'Validierte Fragebögen',
    description:
      'International anerkannte Test-Instrumente, die von Therapeut:innen weltweit eingesetzt werden.',
  },
  {
    value: 'DSGVO-konform',
    emphasis: '(EU-Datenschutz)',
    description:
      'Deine Daten bleiben sicher in der EU. Volle Kontrolle über deine persönlichen Informationen.',
  },
  {
    value: '< 5 Minuten',
    emphasis: 'zu Klarheit',
    description:
      'Von Unsicherheit zu konkreten nächsten Schritten. Evidenzbasiert und wissenschaftlich fundiert.',
  },
] as const;

export const whyContent = {
  id: 'why',
  title: 'Warum Orientierung zählt, bevor der erste Termin stattfindet.',
  description:
    'Viele Menschen wissen nicht, ob sie einen Termin brauchen, welche Therapieform passt oder wo sie sofort Hilfe bekommen. FindMyTherapy verbindet Ersteinschätzung, Vermittlung und Begleitung – damit Betroffene und Therapeut:innen mit einem gemeinsamen Bild starten.',
  bullets: [
    'Ampel-Ersteinschätzung mit validierten Fragebögen und Sofort-Empfehlungen für Österreich.',
    'Kombination aus Kursen, Videos und Aufklärung über mentale Gesundheit – individuell freigeschaltet nach Bedarf.',
    'Direkter Draht zu verifizierten Therapeut:innen inklusive Themen-, Standort- und Verfügbarkeitsfilter.',
  ],
  cta: {
    label: 'Kostenlose Ersteinschätzung testen',
    href: '/triage',
  },
  image: {
    src: '/images/therapists/therapy-1.jpg',
    alt: 'Digitale Ersteinschätzung auf dem Tablet',
  },
};

type FeaturePoint = {
  title: string;
  description: string;
};

export type FeatureIconKey =
  | 'mic'
  | 'users'
  | 'video'
  | 'fileText'
  | 'sparkles'
  | 'chart'
  | 'briefcase'
  | 'globe'
  | 'clipboardCheck'
  | 'trendingUp'
  | 'dollarSign';

export type FeatureTab = {
  value: string;
  label: string;
  heading: string;
  description: string;
  icon: FeatureIconKey;
  points: FeaturePoint[];
  highlights: {
    title: string;
    items: string[];
  };
};

export const featureTabs: FeatureTab[] = [
  {
    value: 'triage',
    label: 'Digitale Ersteinschätzung',
    heading: 'In fünf Minuten von Unsicherheit zu Klarheit.',
    description:
      'Unsere validierten Fragen ermitteln Belastung, Ressourcen und Handlungsbedarf. Du erhältst sofort dein Ampel-Ergebnis mit konkreten Empfehlungen.',
    icon: 'sparkles',
    points: [
      {
        title: 'Validierte Fragebögen',
        description: 'PHQ-9, GAD-7 und themenspezifische Test-Bereiche.',
      },
      {
        title: 'Ampel-System',
        description: 'Grün: Selbsthilfe • Gelb: Terminempfehlung • Rot: Soforthilfe.',
      },
      {
        title: 'Exportierbare Ergebnisse',
        description: 'Teile deine Ergebnisse mit Therapeut:innen oder vertrauten Personen.',
      },
    ],
    highlights: {
      title: 'Wissenschaftliche Grundlage',
      items: [
        'PHQ-9 und GAD-7 sind international validierte und wissenschaftlich fundierte Test-Instrumente.',
        'Alle Daten werden DSGVO-konform verschlüsselt und auf Servern in der EU gespeichert.',
        'Du behältst die volle Kontrolle und entscheidest, mit wem du deine Ergebnisse teilst.',
      ],
    },
  },
  {
    value: 'matching',
    label: 'Vermittlung & Termine',
    heading: 'Die richtige Therapeut:in – online oder vor Ort.',
    description:
      'Wir filtern nach Schwerpunkten, Kapazitäten, Angebots-Form (Einzel/Gruppe) und Versicherungsstatus. Du buchst direkt über die Plattform oder kontaktierst Therapeut:innen per Anfrage-Formular.',
    icon: 'users',
    points: [
      {
        title: 'Feinsortierte Profile',
        description: 'Therapieansatz, Zielgruppen, Sprachen, Barrierefreiheit.',
      },
      {
        title: 'Direkte Kontaktaufnahme',
        description: 'Anfrage-Formulare und Kontaktmöglichkeiten für schnelle Terminvereinbarung.',
      },
      {
        title: 'Support-Team hilft',
        description: 'Unser Team hilft dir bei Fragen zur Plattform weiter.',
      },
    ],
    highlights: {
      title: 'Qualitätsversprechen',
      items: [
        'Alle Therapeut:innen werden verifiziert und erfüllen die gesetzlichen Anforderungen in Österreich.',
        'Du siehst nur Profile, die aktuell Kapazitäten haben oder auf der Warteliste Plätze anbieten.',
        'Unser Support-Team hilft dir bei Fragen zur Plattform und bei der Suche.',
      ],
    },
  },
  {
    value: 'courses',
    label: 'Kursbibliothek',
    heading: 'Hochwertige Kurse von Expert:innen – für deine mentale Gesundheit.',
    description:
      'Von Aufklärung über mentale Gesundheit bis zu therapeutisch konzipierten Übungen: Zugang zu professionellen Kursen und Mini-Programmen, die von echten Therapeut:innen erstellt wurden. Unterstütze dich selbst zwischen Terminen oder starte direkt mit Selbsthilfe.',
    icon: 'video',
    points: [
      {
        title: 'Von echten Therapeut:innen',
        description:
          'Kurse werden von verifizierten Psychotherapeut:innen erstellt und sind therapeutisch fundiert.',
      },
      {
        title: 'Kostenlose & kostenpflichtige Inhalte',
        description:
          'Kostenlose Schnuppermodule oder kostenpflichtige Vollprogramme – passend zu deinem Bedarf und Budget.',
      },
      {
        title: 'Flexibel & selbstbestimmt',
        description:
          'Lerne in deinem Tempo, pausiere jederzeit und behalte die volle Kontrolle über deinen Fortschritt.',
      },
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
    label: 'Erstgespräch-Vorbericht',
    heading: 'Bereite dich vor dem ersten Termin optimal vor – mit validierten Daten.',
    description:
      'Erhalte VOR dem ersten Termin einen strukturierten Vorbericht mit PHQ-9/GAD-7 Werten, Risikoindikatoren und Themenschwerpunkten. So startest du informiert und sparst wertvolle Zeit.',
    icon: 'clipboardCheck',
    points: [
      {
        title: 'Validierte Test-Daten',
        description:
          'PHQ-9 und GAD-7 Werte bereits vor dem ersten Termin – keine Zeit mit Grundlagen verschwenden.',
      },
      {
        title: 'Risikoindikatoren & Warnsignale',
        description:
          'Sofort erkennbar: Suizidalität, Selbstverletzung oder akute Krisensituationen.',
      },
      {
        title: 'Themenprioritäten & Präferenzen',
        description:
          'Übersicht der Belastungsbereiche plus Wunschthemen, Format-Präferenzen und organisatorische Details.',
      },
    ],
    highlights: {
      title: 'Einzigartiger Datenvorteil – Nur bei uns',
      items: [
        'Bessere Passung: Wir kombinieren hochwertige Klient:innen-Vorabdaten mit verifizierten Therapeut:innen-Profilen.',
        'Höhere Passgenauigkeit = weniger Therapieabbrüche und bessere Ergebnisse von Anfang an.',
        'Erste Termine innerhalb von 5 Tagen – von der Ersteinschätzung bis zum ersten Gespräch.',
      ],
    },
  },
  {
    value: 'microsite',
    label: 'Deine automatische Praxis-Webseite',
    heading: 'Professionelle Online-Präsenz ohne eigene Website – automatisch erstellt.',
    description:
      'Jeder verifizierte Therapeut erhält eine professionelle Webseite (findmytherapy.com/t/[dein-name]) – ohne Kosten, ohne Wartung, mit Vertrauens-Siegel und Kontaktformular.',
    icon: 'globe',
    points: [
      {
        title: 'Automatisch generiert',
        description:
          'Dein Profil aus dem Dashboard wird zur für Suchmaschinen optimierten Webseite – mit Titelbild, Biografie, Spezialisierungen und Verfügbarkeiten.',
      },
      {
        title: 'Vertrauenswürdig & rechtssicher',
        description:
          'Verifikations-Siegel, DSGVO-Nachweis-PDF zum Download und Erstgespräch-Button automatisch eingebunden.',
      },
      {
        title: 'Kontaktformular & Statistiken',
        description:
          'Anfrage-Formular mit direkter Dashboard-Anbindung plus Statistiken zu Seitenaufrufen, Klicks und Anfragen.',
      },
    ],
    highlights: {
      title: 'Spar dir Zeit & Geld',
      items: [
        'Keine eigene Website nötig: Spare 500-2.000€ für Entwicklung und laufende Hosting-Kosten.',
        'Automatisch in Google gefunden: Deine Seite wird optimal für Suchmaschinen aufbereitet – ohne technisches Know-how.',
        'Immer aktuell: Änderungen im Dashboard werden automatisch synchronisiert – keine doppelte Pflege.',
      ],
    },
  },
  {
    value: 'portal',
    label: 'Praxisverwaltung',
    heading: 'Klient:innen, Termine und Kurse – zentral verwalten.',
    description:
      'Behalte den Überblick über Termine, Klient:innen und freigegebene Kurse. Steuere Zugriffe und verwalte deine Angebote – DSGVO-konform (EU-Datenschutz).',
    icon: 'fileText',
    points: [
      {
        title: 'Klient:innen-Übersicht',
        description: 'Verwalte deine Termine und Anfragen an einem zentralen Ort.',
      },
      {
        title: 'Kurs-Freigaben',
        description: 'Teile Kurse und Materialien gezielt mit deinen Klient:innen.',
      },
      {
        title: 'Terminverwaltung',
        description:
          'Überblick über anstehende Termine und Verfügbarkeiten – strukturiert und übersichtlich.',
      },
    ],
    highlights: {
      title: 'Sicher & praktisch',
      items: [
        'Datenschutz nach EU-Standard (DSGVO) für alle Daten und Anfragen.',
        'Zentrale Verwaltung aller Termine und Anfragen in einem Dashboard.',
        'Automatische Synchronisation mit deiner öffentlichen Praxis-Webseite.',
      ],
    },
  },
  {
    value: 'insights',
    label: 'Praxis-Statistiken',
    heading: 'Verstehe deine Praxis besser – mit Daten und Statistiken.',
    description:
      'Seitenaufrufe, Anfragen und Terminübersicht helfen dir, deine Praxis besser zu verstehen – natürlich DSGVO-konform (EU-Datenschutz) und anonymisiert.',
    icon: 'chart',
    points: [
      {
        title: 'Webseiten-Statistiken',
        description:
          'Seitenaufrufe und Klicks auf deiner Praxis-Webseite – verständlich aufbereitet.',
      },
      {
        title: 'Anfragen-Übersicht',
        description: 'Anzahl der Anfragen und Interesse an deinen Angeboten – für bessere Planung.',
      },
      {
        title: 'Termin-Dashboard',
        description:
          'Überblick über anstehende und vergangene Termine – strukturiert und übersichtlich.',
      },
    ],
    highlights: {
      title: 'Datenschutz zuerst',
      items: [
        'Alle Statistiken sind anonymisiert – keine persönlichen Daten werden angezeigt.',
        'Nur aggregierte Zahlen wie Seitenaufrufe und Anfragen-Anzahl.',
        'Volle DSGVO-Konformität (EU-Datenschutz) mit Server-Standort in der EU.',
      ],
    },
  },
];

export const earlyAccessContent = {
  eyebrow: 'Early Access',
  title: 'Werde Teil der ersten Nutzer:innen',
  description:
    'FindMyTherapy befindet sich in der Beta-Phase und wird gemeinsam mit Psychotherapeut:innen aufgebaut. Dein Feedback fließt direkt in die Entwicklung ein.',
  features: [
    {
      title: 'Kostenloser Zugang zur Beta',
      description:
        'Nutze alle Features kostenlos während der Aufbauphase und hilf uns, die Plattform zu verbessern.',
    },
    {
      title: 'Therapeut:innen-Netzwerk in Aufbau',
      description:
        'Wir arbeiten mit etablierten Praxen und Kliniken zusammen, um ein verifiziertes Netzwerk aufzubauen.',
    },
    {
      title: 'Dein Feedback zählt',
      description:
        'Als Early-Access-Nutzer:in gestaltest du aktiv mit, wie die Versorgung in Österreich verbessert wird.',
    },
    {
      title: 'Transparenz vor Marketing',
      description:
        'Wir kommunizieren ehrlich, wo wir stehen und was noch kommt. Keine falschen Versprechungen.',
    },
  ],
  mission: {
    title: 'Warum wir FindMyTherapy bauen',
    description:
      'In Österreich warten Menschen durchschnittlich 6+ Monate auf einen Therapieplatz. Viele wissen nicht, ob sie überhaupt professionelle Hilfe benötigen. Mit FindMyTherapy schaffen wir Orientierung und helfen, die Versorgungslücke zu schließen – evidenzbasiert, transparent und gemeinsam mit Expert:innen.',
  },
} as const;

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
    },
    {
      name: 'Thomas Kaufmann, BA pth.',
      role: 'Psychotherapeut i.A.u.S • Verhaltenstherapie • Founder',
      focus: 'Sigmund Freud Universität Wien • Notfallsanitäter-Hintergrund (Krisenkompetenz)',
      image: '/images/team/thomaskaufmann.jpeg',
    },
    {
      name: 'Dipl. Ing. Philipp Oppel',
      role: 'Full Stack Developer',
      focus: 'Technische Leitung & Plattformentwicklung',
      image: '/images/team/philippoppel.jpeg',
    },
    {
      name: 'Hannes Freudenthaler',
      role: 'Unternehmer & Marketing-Spezialist',
      focus: 'Skaliert Marken & Webpräsenzen – Growth, Content & Sichtbarkeit',
      image: '/images/team/hannesfreudenthaler.jpeg',
    },
  ],
  ctas: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/findmytherapy' },
    { label: 'Instagram', href: 'https://www.instagram.com/findmytherapy' },
  ],
};

export const partnerLogos = [
  { name: 'Austrian Startups', initials: 'AS' },
  { name: 'SFU Wien', initials: 'SFU' },
  { name: 'World Council for Psychotherapy', initials: 'WCP' },
  { name: '104 – Krisenhilfe Wien', initials: '104' },
] as const;

export const faqItems = [
  {
    question: 'Kostet die Nutzung von FindMyTherapy für Patient:innen etwas?',
    answer:
      'Nein, die Nutzung von FindMyTherapy ist für Patient:innen komplett kostenlos. Du zahlst nichts für die Suche, das Matching, die Ersteinschätzung oder den Zugang zu unseren Ratgebern. Kosten entstehen nur direkt bei der Therapeut:in für die Therapiesitzungen selbst – diese Honorare werden transparent im Profil angezeigt und direkt mit der Therapeut:in abgerechnet. Unser Ziel ist es, dir zu helfen, die richtige Therapie zu finden, nicht dich zur Kasse zu bitten.',
  },
  {
    question: 'Wie funktioniert das Therapeut:innen-Matching bei FindMyTherapy?',
    answer:
      'Unser Matching basiert auf einem intelligenten Scoring-System, nicht auf einfachen Filtern. Du gibst deine Präferenzen an – von Muss-Kriterien (z.B. Fachrichtung, online oder vor Ort) bis zu Kann-Kriterien mit individueller Gewichtung (z.B. Sprache, Geschlecht, Spezialisierung, Erfahrung). Unser System berechnet dann für jede Therapeut:in einen Match-Score (z.B. "passt zu 87%") und sortiert die Ergebnisse nach Relevanz. So findest du nicht irgendeine Therapeut:in, sondern die passende für deine individuellen Bedürfnisse.',
  },
  {
    question: 'Was unterscheidet FindMyTherapy von anderen Therapeuten-Verzeichnissen?',
    answer:
      'Der entscheidende Unterschied: Wir finden nicht irgendeine Therapie – wir finden die passende. Während traditionelle Verzeichnisse nur einfache Listen bieten, nutzen wir intelligentes Matching mit Scoring-System, zeigen nur verifizierte Therapeut:innen mit echten Kapazitäten, bieten eine moderne, benutzerfreundliche Suche, und stellen validierte Ersteinschätzungen (PHQ-9/GAD-7) bereit. Außerdem erhältst du vor dem ersten Termin bereits strukturierte Informationen über deine Situation, die du mit deiner Therapeut:in teilen kannst – für einen besseren Start in die Therapie.',
  },
  {
    question: 'Warum ist die richtige Therapie wichtiger als irgendeine Therapeut:in?',
    answer:
      'Die Passung zwischen Patient:in und Therapeut:in ist einer der wichtigsten Faktoren für den Therapieerfolg. Eine Therapeut:in, die fachlich exzellent ist, aber nicht zu deinen Bedürfnissen, Werten oder deiner Lebenssituation passt, wird dir weniger helfen können. Unser Matching-System berücksichtigt daher nicht nur fachliche Qualifikationen, sondern auch persönliche Präferenzen, Spezialisierungen und Erfahrungen. So erhöhen wir die Wahrscheinlichkeit, dass du nicht nach wenigen Sitzungen abbrichst, sondern eine Therapeut:in findest, mit der du langfristig arbeiten kannst.',
  },
  {
    question: 'Was kostet FindMyTherapy?',
    answer:
      'Die Ersteinschätzung, unser Blog und Kurs-Schnuppermodule sind kostenlos. Kosten entstehen nur, wenn du eine Therapie buchst oder einen Kurs kaufst – die Honorare werden transparent pro Therapeut:in bzw. Kurs angezeigt und direkt mit ihnen abgerechnet. Therapeut:innen sprechen ihr Abo nach der Verifizierung mit uns ab und zahlen erst, wenn ihre Microsite live ist.',
  },
  {
    question: 'Wie läuft die Ersteinschätzung ab und was bekomme ich danach?',
    answer:
      'Du beantwortest validierte PHQ-9/GAD-7-Fragen plus kurze Kontextabfragen. Daraus ergibt sich dein Ampel-Ergebnis: Grün (Selbsthilfe-Tipps & Kurse), Gelb (Therapieempfehlung) oder Rot (Krisenhinweis mit Soforthilfe). Du erhältst sofort konkrete Handlungsempfehlungen und kannst dein Ergebnis als PDF speichern oder mit einer Therapeut:in teilen.',
  },
  {
    question: 'Wie schnell komme ich zu einer passenden Therapeut:in?',
    answer:
      'Unsere Profile zeigen nur verifizierte Therapeut:innen mit echten Kapazitäten. Du filterst nach Thema, Standort, Versicherungsstatus, Format (online/vor Ort) und buchst direkt oder sendest eine Anfrage. Viele Termine sind innerhalb weniger Tage verfügbar – unser Support hilft dir bei Fragen zur Suche.',
  },
  {
    question: 'Sind meine Angaben sicher und wer sieht sie?',
    answer:
      'Ja. Alle Daten werden verschlüsselt und DSGVO-konform auf Servern in der EU gespeichert. Du entscheidest, ob und mit wem du deine Ergebnisse teilst. Therapeut:innen sehen deine Ersteinschätzung nur, wenn du sie freigibst; ansonsten bleibt alles privat.',
  },
  {
    question: 'Ich brauche sofort Hilfe – kann FindMyTherapy unterstützen?',
    answer:
      'Bei akuter Krise ersetze dich FindMyTherapy nicht den Notruf. In der Rot-Stufe der Ersteinschätzung zeigen wir dir sofort österreichische Krisen-Hotlines und medizinische Sofortkontakte. Parallel kannst du passende Therapeut:innen oder Online-Kurse auswählen, sobald es dir möglich ist.',
  },
  {
    question: 'Welche Vorteile habe ich als Therapeut:in?',
    answer:
      'Du startest mit validierten Vorberichten (PHQ-9/GAD-7) ins Erstgespräch, bekommst eine SEO-optimierte Microsite unter findmytherapy.com/t/[dein-name], verwaltest Leads im Dashboard und kannst eigene Kurse erstellen und monetarisieren. Nach Verifizierung steuerst du Verfügbarkeiten, Honorare und Kursangebote selbstständig.',
  },
] as const;

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
        'Unsere validierte Ampel-Triage (PHQ-9, GAD-7, WHO-5) zeigt dir sofort, wo du stehst und welche nächsten Schritte passen – ohne Wartezeit, ohne Kosten, DSGVO-konform (EU-Datenschutz).',
      highlights: [
        'Wissenschaftlich validierte Tests (PHQ-9, GAD-7)',
        'Sofort-Ergebnis mit konkreten Empfehlungen',
        'Ampel-System: Grün • Gelb • Rot',
        'Ergebnisse für deine Therapeut:in exportierbar',
      ],
    },
    {
      icon: 'users' as const,
      title: 'Passende Therapeut:innen finden',
      subtitle: 'Passung nach deinen Bedürfnissen – nicht Zufall',
      description:
        'Finde Therapeut:innen, die wirklich zu dir passen: nach Themen, Verfügbarkeit, Standort, Kassenstatus und Angebots-Form. Mit verifizierten Profilen und echten Kapazitäten.',
      highlights: [
        'Alle Therapeut:innen sind verifiziert',
        'Filter nach Themen, Ort, Budget & Verfügbarkeit',
        'Nur Profile mit echten freien Kapazitäten',
        'Support-Team hilft bei Fragen',
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
      href: '/therapists',
    },
  },
} as const;

export const therapistBenefits = {
  id: 'therapists',
  eyebrow: 'Für Therapeut:innen',
  title: 'Starte informierter. Wachse sichtbarer. Arbeite effizienter.',
  description:
    'FindMyTherapy ist mehr als eine Vermittlungsplattform. Du erhältst Werkzeuge, die deine Praxis transformieren – von der Vorbereitung bis zur Sichtbarkeit.',
  benefits: [
    {
      icon: 'clipboardCheck' as const,
      title: 'Erstgespräch-Vorbericht',
      subtitle: 'Starte mit validierten Daten ins erste Gespräch',
      description:
        'Erhalte VOR dem ersten Termin einen strukturierten Vorbericht mit PHQ-9/GAD-7 Werten, Warnsignalen und Themenschwerpunkten. Spare Zeit und starte informiert.',
      highlights: [
        'Validierte PHQ-9 & GAD-7 Werte vor dem ersten Termin',
        'Warnsignale & Risikofaktoren sofort erkennbar',
        'Themenschwerpunkte & Präferenzen übersichtlich',
        'Erste Termine innerhalb von 5 Tagen möglich',
      ],
    },
    {
      icon: 'globe' as const,
      title: 'Deine automatische Praxis-Webseite',
      subtitle: 'Professionelle Website – kostenlos und automatisch erstellt',
      description:
        'Jeder verifizierte Therapeut erhält automatisch eine für Suchmaschinen optimierte Webseite (findmytherapy.com/t/[dein-name]) – ohne Kosten, ohne Wartung, mit Vertrauens-Siegel und Kontaktformular.',
      highlights: [
        'Spare 500-2.000€ für Website-Entwicklung',
        'Automatisch in Google gefunden werden',
        'Kontaktformular & Statistiken inklusive',
        'Automatische Aktualisierung aus deinem Dashboard',
      ],
    },
    {
      icon: 'briefcase' as const,
      title: 'Digitale Praxis-Tools',
      subtitle: 'Verwaltung, Statistiken und Übersicht in einem Dashboard',
      description:
        'Anfragen-Verwaltung, Termin-Übersicht und Webseiten-Statistiken in einem zentralen Dashboard. DSGVO-konform (EU-Datenschutz) und sicher.',
      highlights: [
        'Anfragen & Termine zentral verwalten',
        'Webseiten-Statistiken & Anfragen-Übersicht',
        'Kurse erstellen und verwalten',
        'Datenschutz nach EU-Standard & sichere Server',
      ],
    },
    {
      icon: 'trendingUp' as const,
      title: 'Kurse erstellen & monetarisieren',
      subtitle: 'Baue passives Einkommen mit deinem Expertenwissen auf',
      description:
        'Erstelle therapeutisch fundierte Online-Kurse und Programme, teile sie mit deinen Klient:innen oder allen Nutzer:innen auf der Plattform. Baue passives Einkommen auf und skaliere dein Expertenwissen.',
      highlights: [
        'Zusatzeinkommen durch Online-Kurse & Programme',
        'Kursverwaltung & Fortschritts-Übersicht im Dashboard',
        'Reichweite über alle Plattform-Nutzer:innen',
        'Therapeutisch geprüft & qualitätsgesichert',
      ],
    },
  ],
  cta: {
    primary: {
      label: 'Demo für Therapeut:innen buchen',
      href: 'mailto:hello@findmytherapy.net?subject=Demo-Anfrage%20%E2%80%93%20FindMyTherapy%20f%C3%BCr%20Therapeut%3Ainnen&body=Sehr%20geehrtes%20FindMyTherapy-Team%2C%0A%0Aich%20interessiere%20mich%20f%C3%BCr%20eine%20Demo%20der%20Plattform%20f%C3%BCr%20Therapeut%3Ainnen.%20Ich%20m%C3%B6chte%20mehr%20%C3%BCber%20die%20Erstgespr%C3%A4ch-Vorberichte%2C%20die%20automatische%20Praxis-Webseite%20und%20die%20digitalen%20Praxis-Tools%20erfahren.%0A%0AMeine%20Daten%3A%0AName%3A%20%5BIhr%20Name%5D%0APraxis%2FKlinik%3A%20%5BIhre%20Praxis%5D%0ATelefon%3A%20%5BIhre%20Telefonnummer%5D%0AE-Mail%3A%20%5BIhre%20E-Mail-Adresse%5D%0A%0AIch%20freue%20mich%20auf%20Ihre%20R%C3%BCckmeldung.%0A%0AMit%20freundlichen%20Gr%C3%BC%C3%9Fen',
    },
    secondary: {
      label: 'Mehr über unsere Features erfahren',
      href: '#why',
    },
  },
} as const;

export const contactCta = {
  heading: 'Starte informierter. Wachse sichtbarer. Arbeite effizienter.',
  subheading:
    'Erhalte Erstgespräch-Vorberichte vor jedem ersten Termin, eine kostenlose Praxis-Webseite und digitale Praxis-Tools in einem Dashboard. Wir zeigen dir, wie FindMyTherapy deine Praxis transformiert.',
  primaryCta: {
    label: 'Demo für Therapeut:innen buchen',
    href: 'mailto:hello@findmytherapy.net?subject=Demo-Anfrage%20%E2%80%93%20FindMyTherapy%20f%C3%BCr%20Therapeut%3Ainnen&body=Sehr%20geehrtes%20FindMyTherapy-Team%2C%0A%0Aich%20interessiere%20mich%20f%C3%BCr%20eine%20Demo%20der%20Plattform%20f%C3%BCr%20Therapeut%3Ainnen.%20Ich%20m%C3%B6chte%20mehr%20%C3%BCber%20die%20Erstgespr%C3%A4ch-Vorberichte%2C%20die%20automatische%20Praxis-Webseite%20und%20die%20digitalen%20Praxis-Tools%20erfahren.%0A%0AMeine%20Daten%3A%0AName%3A%20%5BIhr%20Name%5D%0APraxis%2FKlinik%3A%20%5BIhre%20Praxis%5D%0ATelefon%3A%20%5BIhre%20Telefonnummer%5D%0AE-Mail%3A%20%5BIhre%20E-Mail-Adresse%5D%0A%0AIch%20freue%20mich%20auf%20Ihre%20R%C3%BCckmeldung.%0A%0AMit%20freundlichen%20Gr%C3%BC%C3%9Fen',
  },
  secondaryCta: {
    label: 'Infopaket herunterladen',
    href: '/downloads/findmytherapy-infopaket.pdf',
  },
};

export const testimonialList = [
  {
    id: '1',
    quote:
      'Die Ersteinschätzung hat mir geholfen, meine Situation besser zu verstehen. Die Empfehlungen waren präzise und hilfreich.',
    author: 'Sarah M.',
    role: 'Klientin',
    rating: 5,
  },
  {
    id: '2',
    quote:
      'Als Therapeutin schätze ich die wissenschaftliche Fundierung der Triage. PHQ-9 und GAD-7 sind Gold-Standard.',
    author: 'Dr. Anna Leitner',
    role: 'Psychotherapeutin',
    rating: 5,
  },
  {
    id: '3',
    quote:
      'Endlich eine Plattform, die Transparenz und Datenschutz ernst nimmt. Die Ampel-Logik ist sofort verständlich.',
    author: 'Michael K.',
    role: 'Klient',
    rating: 5,
  },
] as const;

/**
 * Feature-aware exports
 * These functions return filtered content based on enabled features
 */
import {
  filterNavigationItems,
  filterFeatureTabs,
  filterFAQItems,
  getFilteredHeroContent,
  getFilteredWhyContent,
  getFilteredClientBenefits,
  getFilteredTherapistBenefits,
  getFilteredContactCta,
} from '@/lib/content-filters';

/**
 * Get navigation items with disabled features removed
 */
export function getMarketingNavigation() {
  return filterNavigationItems(marketingNavigation);
}

/**
 * Get hero content with feature-aware adjustments
 */
export function getHeroContent() {
  return getFilteredHeroContent(heroContent);
}

/**
 * Get why content with feature-aware adjustments
 */
export function getWhyContent() {
  return getFilteredWhyContent(whyContent);
}

/**
 * Get feature tabs with disabled features removed
 */
export function getFeatureTabs() {
  return filterFeatureTabs(featureTabs);
}

/**
 * Get client benefits with disabled features removed
 */
export function getClientBenefits() {
  return getFilteredClientBenefits(clientBenefits);
}

/**
 * Get therapist benefits with disabled features removed
 */
export function getTherapistBenefits() {
  return getFilteredTherapistBenefits(therapistBenefits);
}

/**
 * Get FAQ items with disabled feature questions removed
 */
export function getFAQItems() {
  return filterFAQItems(faqItems);
}

/**
 * Get contact CTA with feature-aware adjustments
 */
export function getContactCta() {
  return getFilteredContactCta(contactCta);
}
