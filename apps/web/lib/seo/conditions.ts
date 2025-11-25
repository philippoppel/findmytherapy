// Mental health conditions for SEO landing pages
export interface Condition {
  slug: string
  name: string
  shortName: string
  description: string
  metaDescription: string
  keywords: string[]
  symptoms: string[]
  treatments: string[]
  relatedConditions: string[]
}

export const mentalHealthConditions: Condition[] = [
  {
    slug: 'depression',
    name: 'Depression',
    shortName: 'Depression',
    description:
      'Depression ist eine der häufigsten psychischen Erkrankungen. Sie zeigt sich durch anhaltende Traurigkeit, Antriebslosigkeit und den Verlust von Interesse an Aktivitäten, die früher Freude bereitet haben. Mit professioneller Hilfe ist Depression gut behandelbar.',
    metaDescription:
      'Hilfe bei Depression finden. Erfahre mehr über Symptome, Behandlung und finde spezialisierte Psychotherapeut:innen in Österreich. Jetzt Erstgespräch vereinbaren.',
    keywords: [
      'Depression Therapie',
      'Depression Behandlung',
      'Depression Hilfe',
      'Depression Symptome',
      'Depression Psychotherapie',
      'Depressionen Österreich',
      'Therapeut Depression',
    ],
    symptoms: [
      'Anhaltende Traurigkeit oder Leere',
      'Verlust von Interesse und Freude',
      'Schlafstörungen',
      'Appetitveränderungen',
      'Konzentrationsschwierigkeiten',
      'Energielosigkeit und Müdigkeit',
      'Gefühle von Wertlosigkeit',
      'Gedanken an Tod oder Suizid',
    ],
    treatments: [
      'Kognitive Verhaltenstherapie',
      'Tiefenpsychologisch fundierte Therapie',
      'Interpersonelle Therapie',
      'Medikamentöse Behandlung',
      'Achtsamkeitsbasierte Therapie',
    ],
    relatedConditions: ['angststoerung', 'burnout', 'trauma'],
  },
  {
    slug: 'angststoerung',
    name: 'Angststörungen',
    shortName: 'Angst',
    description:
      'Angststörungen gehören zu den häufigsten psychischen Erkrankungen. Sie können sich als generalisierte Angst, Panikattacken, soziale Angst oder spezifische Phobien zeigen. Moderne Therapiemethoden bieten effektive Hilfe.',
    metaDescription:
      'Angststörung behandeln: Panikattacken, soziale Angst & Phobien. Finde spezialisierte Therapeut:innen in Österreich. Bewährte Therapiemethoden. Jetzt Hilfe finden.',
    keywords: [
      'Angststörung Therapie',
      'Panikattacken Behandlung',
      'Angst Hilfe',
      'soziale Angst',
      'Phobien Therapie',
      'Angststörung Psychotherapie',
      'Therapeut Angst',
    ],
    symptoms: [
      'Intensive Angst oder Panik',
      'Herzrasen und Schwitzen',
      'Atemnot und Engegefühl',
      'Vermeidungsverhalten',
      'Ständige Sorgen',
      'Schlafprobleme',
      'Konzentrationsschwierigkeiten',
      'Körperliche Anspannung',
    ],
    treatments: [
      'Kognitive Verhaltenstherapie',
      'Expositionstherapie',
      'EMDR',
      'Entspannungsverfahren',
      'Achtsamkeitsbasierte Therapie',
    ],
    relatedConditions: ['depression', 'trauma', 'burnout'],
  },
  {
    slug: 'burnout',
    name: 'Burnout',
    shortName: 'Burnout',
    description:
      'Burnout ist ein Zustand emotionaler, körperlicher und geistiger Erschöpfung durch chronischen Stress. Er zeigt sich durch Müdigkeit, Zynismus und reduzierte Leistungsfähigkeit. Frühzeitige Intervention ist wichtig.',
    metaDescription:
      'Burnout erkennen und behandeln. Symptome, Ursachen und Therapiemöglichkeiten. Finde spezialisierte Therapeut:innen in Österreich. Jetzt Unterstützung finden.',
    keywords: [
      'Burnout Therapie',
      'Burnout Behandlung',
      'Burnout Hilfe',
      'Burnout Symptome',
      'Erschöpfung Therapie',
      'Burnout Prävention',
      'Therapeut Burnout',
    ],
    symptoms: [
      'Chronische Erschöpfung',
      'Emotionale Distanzierung',
      'Reduzierte Leistungsfähigkeit',
      'Zynismus und Negativität',
      'Körperliche Beschwerden',
      'Schlafstörungen',
      'Konzentrationsprobleme',
      'Sozialer Rückzug',
    ],
    treatments: [
      'Kognitive Verhaltenstherapie',
      'Stressmanagement',
      'Achtsamkeitstraining',
      'Work-Life-Balance Coaching',
      'Entspannungsverfahren',
    ],
    relatedConditions: ['depression', 'angststoerung'],
  },
  {
    slug: 'trauma',
    name: 'Trauma & PTBS',
    shortName: 'Trauma',
    description:
      'Traumatische Erlebnisse können tiefgreifende psychische Folgen haben. Die Posttraumatische Belastungsstörung (PTBS) ist eine häufige Reaktion auf schwere Belastungen. Spezialisierte Traumatherapie bietet effektive Hilfe.',
    metaDescription:
      'Traumatherapie & PTBS Behandlung. Spezialisierte Therapeut:innen für Traumafolgestörungen in Österreich. EMDR, Traumafokussierte Therapie. Jetzt Hilfe finden.',
    keywords: [
      'Trauma Therapie',
      'PTBS Behandlung',
      'Traumatherapie',
      'EMDR Therapie',
      'Trauma Hilfe',
      'Posttraumatische Belastungsstörung',
      'Therapeut Trauma',
    ],
    symptoms: [
      'Wiederkehrende belastende Erinnerungen',
      'Flashbacks und Albträume',
      'Vermeidung von Auslösern',
      'Emotionale Taubheit',
      'Übererregung und Schreckhaftigkeit',
      'Schlafstörungen',
      'Konzentrationsprobleme',
      'Reizbarkeit',
    ],
    treatments: [
      'EMDR',
      'Traumafokussierte kognitive Verhaltenstherapie',
      'Somatic Experiencing',
      'Narrative Expositionstherapie',
      'Stabilisierungstechniken',
    ],
    relatedConditions: ['depression', 'angststoerung'],
  },
  {
    slug: 'essstoerung',
    name: 'Essstörungen',
    shortName: 'Essstörung',
    description:
      'Essstörungen wie Anorexie, Bulimie oder Binge-Eating sind ernsthafte psychische Erkrankungen. Sie betreffen das Essverhalten und das Körperbild. Frühzeitige Behandlung verbessert die Heilungschancen erheblich.',
    metaDescription:
      'Essstörungen behandeln: Anorexie, Bulimie, Binge-Eating. Spezialisierte Therapeut:innen in Österreich. Professionelle Hilfe für gesundes Essverhalten finden.',
    keywords: [
      'Essstörung Therapie',
      'Anorexie Behandlung',
      'Bulimie Hilfe',
      'Binge Eating Therapie',
      'Essstörung Psychotherapie',
      'Magersucht Therapie',
      'Therapeut Essstörung',
    ],
    symptoms: [
      'Gestörtes Essverhalten',
      'Übermäßige Beschäftigung mit Gewicht',
      'Verzerrtes Körperbild',
      'Heimliches Essen',
      'Kompensatorisches Verhalten',
      'Sozialer Rückzug',
      'Körperliche Komplikationen',
      'Stimmungsschwankungen',
    ],
    treatments: [
      'Kognitive Verhaltenstherapie',
      'Familienbasierte Therapie',
      'Interpersonelle Therapie',
      'Ernährungsberatung',
      'Körpertherapie',
    ],
    relatedConditions: ['depression', 'angststoerung', 'trauma'],
  },
  {
    slug: 'beziehungsprobleme',
    name: 'Beziehungsprobleme',
    shortName: 'Beziehung',
    description:
      'Beziehungsprobleme können vielfältige Ursachen haben: Kommunikationsschwierigkeiten, Konflikte, Vertrauensprobleme oder unterschiedliche Lebensziele. Paar- und Einzeltherapie können helfen, Beziehungen zu verbessern.',
    metaDescription:
      'Hilfe bei Beziehungsproblemen. Paartherapie & Einzeltherapie für bessere Beziehungen. Spezialisierte Therapeut:innen in Österreich. Jetzt Unterstützung finden.',
    keywords: [
      'Paartherapie',
      'Beziehungsprobleme Hilfe',
      'Eheberatung',
      'Paarberatung',
      'Beziehungstherapie',
      'Kommunikationsprobleme',
      'Therapeut Beziehung',
    ],
    symptoms: [
      'Häufige Konflikte',
      'Kommunikationsprobleme',
      'Emotionale Distanz',
      'Vertrauensprobleme',
      'Unterschiedliche Erwartungen',
      'Intimität-Schwierigkeiten',
      'Eifersucht',
      'Fehlende Wertschätzung',
    ],
    treatments: [
      'Paartherapie',
      'Emotionsfokussierte Therapie',
      'Systemische Therapie',
      'Kommunikationstraining',
      'Einzeltherapie',
    ],
    relatedConditions: ['depression', 'angststoerung'],
  },
  {
    slug: 'adhs',
    name: 'ADHS bei Erwachsenen',
    shortName: 'ADHS',
    description:
      'ADHS (Aufmerksamkeitsdefizit-Hyperaktivitätsstörung) betrifft nicht nur Kinder. Viele Erwachsene leben mit undiagnostiziertem ADHS. Die Symptome können Alltag und Beruf erheblich beeinträchtigen, sind aber gut behandelbar.',
    metaDescription:
      'ADHS bei Erwachsenen: Diagnose & Behandlung. Spezialisierte Therapeut:innen für ADHS in Österreich. Strategien für bessere Konzentration. Jetzt Hilfe finden.',
    keywords: [
      'ADHS Erwachsene',
      'ADHS Therapie',
      'ADHS Diagnose',
      'ADHS Behandlung',
      'Aufmerksamkeitsstörung',
      'Konzentrationsprobleme',
      'Therapeut ADHS',
    ],
    symptoms: [
      'Konzentrationsschwierigkeiten',
      'Impulsivität',
      'Innere Unruhe',
      'Organisationsprobleme',
      'Vergesslichkeit',
      'Prokrastination',
      'Emotionale Dysregulation',
      'Schwierigkeiten mit Routinen',
    ],
    treatments: [
      'Verhaltenstherapie',
      'ADHS-Coaching',
      'Medikamentöse Behandlung',
      'Achtsamkeitstraining',
      'Organisationsstrategien',
    ],
    relatedConditions: ['depression', 'angststoerung'],
  },
]

export function getConditionBySlug(slug: string): Condition | undefined {
  return mentalHealthConditions.find((condition) => condition.slug === slug)
}

export function getAllConditionSlugs(): string[] {
  return mentalHealthConditions.map((condition) => condition.slug)
}
