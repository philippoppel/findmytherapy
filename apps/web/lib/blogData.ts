export type BlogPostSection = {
  heading: string
  paragraphs: string[]
  list?: string[]
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readingTime: string
  author: string
  keywords: string[]
  sections: BlogPostSection[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'digitale-ersteinschaetzung-mental-health',
    title: 'Digitale Ersteinschätzung: Wie Klarthera Orientierung schafft',
    excerpt:
      'Vom ersten Fragebogen bis zur Empfehlung: So unterstützt Klarthera Menschen, die einen schnellen Überblick über passende Hilfsangebote suchen.',
    category: 'Produkt',
    publishedAt: '2025-04-10',
    readingTime: '6 Min.',
    author: 'Team Klarthera',
    keywords: [
      'digitale Ersteinschätzung',
      'mentale Gesundheit',
      'Therapie finden',
      'Produkt-Demo',
    ],
    sections: [
      {
        heading: 'Warum eine strukturierte Ersteinschätzung wichtig ist',
        paragraphs: [
          'Wer Unterstützung für mentale Gesundheit sucht, steht häufig vor einem Berg an Fragen. Welche Therapieform passt? Reicht ein Kurs? Kann ich mit jemandem sprechen, bevor ich mich entscheide?',
          'Klarthera setzt genau hier an: Ein validierter Fragebogen, der in wenigen Minuten ausgefüllt ist, liefert eine erste Orientierung und verschafft einen Überblick über geeignete Formate.',
        ],
      },
      {
        heading: 'Was die Demo aktuell zeigt',
        paragraphs: [
          'In der Demo führen wir durch alle Schritte – von der Profilerstellung über das Screening bis zu Empfehlungen. Auch wenn unser Therapeut:innen-Netzwerk noch im Aufbau ist, zeigt die Demo alle vorgesehenen Schnittstellen und wie Empfehlungen priorisiert werden.',
        ],
        list: [
          'Kontextfragen zu Anliegen, Tempo und Präferenzen',
          'Screenings mit sofortiger Rückmeldung (z. B. PHQ-9)',
          'Empfehlungen für Formate, digitale Ressourcen und nächste Schritte',
        ],
      },
      {
        heading: 'Nächste Schritte für Stakeholder',
        paragraphs: [
          'Wir sind in Gesprächen mit zertifizierten Therapeut:innen und Organisationen, um unsere Warteliste zu erweitern. Parallel entwickeln wir Onboarding-Prozesse für Unternehmen, die Klarthera als Benefit einsetzen möchten.',
        ],
      },
    ],
  },
  {
    slug: 'therapeuten-netzwerk-aufbau-transparenz',
    title: 'Therapeut:innen-Netzwerk im Aufbau: Transparenz von Anfang an',
    excerpt:
      'Klarthera legt offen, wie wir Expert:innen auswählen, welche Qualitätskriterien gelten und wie Zusammenarbeit in der Beta-Phase funktioniert.',
    category: 'Netzwerk',
    publishedAt: '2025-03-28',
    readingTime: '5 Min.',
    author: 'Team Klarthera',
    keywords: [
      'Therapeut:innen Netzwerk',
      'Qualitätskriterien',
      'mentale Gesundheit Österreich',
      'Beta-Plattform',
    ],
    sections: [
      {
        heading: 'Qualitätskriterien vor der Aufnahme',
        paragraphs: [
          'Wir verifizieren Qualifikationen, Fortbildungen und Spezialisierungen aller Therapeut:innen. Erst nach einer persönlichen Kennenlern-Session und Dokumentenprüfung wird ein Profil freigeschaltet.',
        ],
        list: [
          'Nachweis legislativer Zulassungen (Österreich, EU)',
          'Fortbildungen in evidenzbasierten Methoden',
          'Verbindliche Antwortzeiten und Kapazitätsangaben',
          'Transparente Honorar- und Abrechnungsmodelle',
        ],
      },
      {
        heading: 'Warum wir mit einer Warteliste starten',
        paragraphs: [
          'Damit wir Empfehlungen geben können, bevor alle Profile live sind, visualisiert die Demo realistische Matches mit anonymisierten Beispielprofilen. Sobald Profile live gehen, ersetzen wir diese Placeholder durch echte Therapeut:innen.',
        ],
      },
      {
        heading: 'Wie Organisationen profitieren',
        paragraphs: [
          'Unternehmen oder Institutionen können sich heute bereits für Pilotprogramme eintragen. Sie sehen im Dashboard, welche Formate nachgefragt werden, ohne sensible Daten ihrer Mitarbeitenden einzusehen.',
        ],
      },
    ],
  },
  {
    slug: 'mental-health-benefits-fuer-teams',
    title: 'Mental Health Benefits für Teams: Klarthera als Baustein',
    excerpt:
      'Warum digitale Ersteinschätzung, On-Demand-Ressourcen und persönliche Betreuung zusammengehören, wenn Unternehmen ihre Teams unterstützen möchten.',
    category: 'Arbeitswelt',
    publishedAt: '2025-03-12',
    readingTime: '7 Min.',
    author: 'Team Klarthera',
    keywords: [
      'Mental Health Benefits',
      'Arbeitswelt',
      'Employee Assistance Program',
      'Ressourcen für Teams',
    ],
    sections: [
      {
        heading: 'Herausforderungen in Unternehmen',
        paragraphs: [
          'Mentale Gesundheit wird zur Chefsache. Führungskräfte suchen Programme, die schnellen Zugang bieten und gleichzeitig datenschutzkonform bleiben. Klarthera deckt beide Anforderungen ab.',
        ],
      },
      {
        heading: 'Warum Klarthera gut in bestehende Benefits passt',
        paragraphs: [
          'Die digitale Ersteinschätzung ist der Anfangspunkt. Mitarbeitende erhalten Empfehlungen, die an bestehende Angebote andocken oder neue Impulse setzen. Das entlastet HR-Teams und schafft Klarheit für alle Beteiligten.',
        ],
        list: [
          'Self-Service-Dashboard für Mitarbeitende',
          'Kurze Micro-Learnings zwischen Terminen',
          'Anonyme Aggregationen für Entscheider:innen',
        ],
      },
      {
        heading: 'Pilotprogramm: Was wir anbieten',
        paragraphs: [
          'Interessierte Unternehmen können sich für unser Pilotprogramm anmelden. Wir unterstützen beim Onboarding, liefern Materialien für interne Kommunikation und evaluieren gemeinsam den Impact.',
        ],
      },
    ],
  },
]

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}
