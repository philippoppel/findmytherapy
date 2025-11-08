/**
 * WHO-5 Well-Being Index
 *
 * Der WHO-5 ist ein kurzer Fragebogen zur Bewertung des subjektiven Wohlbefindens.
 * Er besteht aus 5 positiv formulierten Aussagen über die letzten zwei Wochen.
 *
 * Quelle: WHO (2024) - The World Health Organization-Five Well-Being Index
 * Referenz: https://www.who.int/publications/m/item/WHO-UCN-MSD-MHE-2024.01
 *
 * Deutsche Validierung: Psychiatric Centre North Zealand
 */

export type WHO5Question = {
  id: number
  text: string
  helpText?: string
  scientificContext?: string
}

export type WHO5ResponseOption = {
  value: number
  label: string
  description: string
}

/**
 * WHO-5 verwendet eine 6-Punkte-Skala (0-5)
 * 0 = zu keinem Zeitpunkt
 * 5 = die ganze Zeit
 */
export const who5ResponseOptions: WHO5ResponseOption[] = [
  {
    value: 0,
    label: 'Zu keinem Zeitpunkt',
    description: 'In den letzten zwei Wochen überhaupt nicht',
  },
  {
    value: 1,
    label: 'Selten',
    description: 'Ab und zu, aber sehr selten',
  },
  {
    value: 2,
    label: 'Manchmal',
    description: 'Weniger als die Hälfte der Zeit',
  },
  {
    value: 3,
    label: 'Etwas mehr als die Hälfte der Zeit',
    description: 'Öfter als nicht',
  },
  {
    value: 4,
    label: 'Meistens',
    description: 'Die meiste Zeit',
  },
  {
    value: 5,
    label: 'Die ganze Zeit',
    description: 'Durchgehend, ständig',
  },
]

/**
 * Die 5 Fragen des WHO-5 Well-Being Index
 *
 * Positiv formuliert, fokussiert auf Wohlbefinden statt Symptome
 */
export const who5Questions: WHO5Question[] = [
  {
    id: 1,
    text: 'Ich war froh und guter Laune',
    helpText: 'Haben Sie sich fröhlich, glücklich und optimistisch gefühlt?',
    scientificContext: 'Positive Stimmung ist ein Kernindikator für psychisches Wohlbefinden.',
  },
  {
    id: 2,
    text: 'Ich habe mich ruhig und entspannt gefühlt',
    helpText: 'Konnten Sie sich entspannen und waren Sie frei von Anspannung?',
    scientificContext: 'Fehlen von Anspannung und Ruhe sind zentrale Aspekte emotionalen Wohlbefindens.',
  },
  {
    id: 3,
    text: 'Ich habe genug Energie für den Alltag gehabt',
    helpText: 'Fühlten Sie sich aktiv und energiegeladen?',
    scientificContext: 'Energielevel und Vitalität sind wichtige Indikatoren für psychische Gesundheit.',
  },
  {
    id: 4,
    text: 'Ich habe ein gutes Selbstwertgefühl gehabt',
    helpText: 'Sind Sie mit sich selbst zufrieden und fühlen Sie sich wertvoll?',
    scientificContext: 'Selbstwertgefühl ist eng mit psychischem Wohlbefinden verbunden.',
  },
  {
    id: 5,
    text: 'Mein Alltag war voller Dinge, die mich interessieren',
    helpText: 'Hatten Sie Interesse an Aktivitäten und fühlten Sie sich engagiert?',
    scientificContext: 'Interesse und Engagement im Alltag sind Zeichen positiver mentaler Gesundheit.',
  },
]

/**
 * WHO-5 Severity Levels
 * Basierend auf dem transformierten Score (0-100)
 */
export type WHO5Severity = 'GOOD' | 'MODERATE' | 'POOR' | 'VERY_POOR'

export const who5SeverityThresholds = {
  DEPRESSION_SCREENING: 50, // Score ≤50 suggests further screening
  DEPRESSION_LIKELY: 28,    // Score ≤28 indicates likely depression
}

/**
 * Berechnet den WHO-5 Raw Score (0-25)
 */
export function calculateWHO5RawScore(answers: number[]): number {
  if (answers.length !== 5) {
    throw new Error('WHO-5 requires exactly 5 answers')
  }
  return answers.reduce((sum, value) => sum + value, 0)
}

/**
 * Transformiert den Raw Score in einen 0-100 Score
 * Formula: (Raw Score / 25) * 100
 */
export function calculateWHO5Score(answers: number[]): number {
  const rawScore = calculateWHO5RawScore(answers)
  return Math.round((rawScore / 25) * 100)
}

/**
 * Bestimmt das Wohlbefindens-Level basierend auf dem Score
 */
export function calculateWHO5Severity(score: number): WHO5Severity {
  if (score <= who5SeverityThresholds.DEPRESSION_LIKELY) {
    return 'VERY_POOR'
  }
  if (score <= who5SeverityThresholds.DEPRESSION_SCREENING) {
    return 'POOR'
  }
  if (score <= 75) {
    return 'MODERATE'
  }
  return 'GOOD'
}

/**
 * Severity Labels (auf Deutsch)
 */
export const who5SeverityLabels: Record<WHO5Severity, string> = {
  GOOD: 'Gutes Wohlbefinden',
  MODERATE: 'Moderates Wohlbefinden',
  POOR: 'Eingeschränktes Wohlbefinden',
  VERY_POOR: 'Stark eingeschränktes Wohlbefinden',
}

/**
 * Severity Descriptions (auf Deutsch)
 */
export const who5SeverityDescriptions: Record<WHO5Severity, string> = {
  GOOD: 'Dein Wohlbefinden ist gut. Du scheinst dich meistens positiv und energiegeladen zu fühlen.',
  MODERATE: 'Dein Wohlbefinden ist im moderaten Bereich. Es gibt Raum für Verbesserung in einigen Bereichen deines Lebens.',
  POOR: 'Dein Wohlbefinden ist eingeschränkt. Wir empfehlen eine detailliertere Einschätzung mittels PHQ-9/GAD-7.',
  VERY_POOR: 'Dein Wohlbefinden ist stark eingeschränkt. Wir empfehlen dringend, professionelle Unterstützung zu suchen.',
}

/**
 * Empfohlene nächste Schritte basierend auf dem Severity Level
 */
export function getWHO5Recommendations(severity: WHO5Severity): {
  shouldDoFullScreening: boolean
  shouldSeekHelp: boolean
  message: string
} {
  switch (severity) {
    case 'VERY_POOR':
      return {
        shouldDoFullScreening: true,
        shouldSeekHelp: true,
        message: 'Wir empfehlen dringend eine detaillierte Einschätzung und ein Gespräch mit einem/einer Therapeut:in.',
      }
    case 'POOR':
      return {
        shouldDoFullScreening: true,
        shouldSeekHelp: false,
        message: 'Um besser zu verstehen, was dein Wohlbefinden beeinträchtigt, empfehlen wir unsere vollständige Ersteinschätzung.',
      }
    case 'MODERATE':
      return {
        shouldDoFullScreening: false,
        shouldSeekHelp: false,
        message: 'Dein Wohlbefinden ist im mittleren Bereich. Selbsthilfe-Programme oder digitale Kurse können hilfreich sein.',
      }
    case 'GOOD':
      return {
        shouldDoFullScreening: false,
        shouldSeekHelp: false,
        message: 'Dein Wohlbefinden ist gut! Regelmäßige Selbstfürsorge kann helfen, dies aufrechtzuerhalten.',
      }
  }
}

/**
 * Wissenschaftliche Informationen zum WHO-5
 */
export const who5ScientificInfo = {
  title: 'WHO-5 Well-Being Index',
  description: 'Ein kurzer, international validierter Fragebogen zur Messung des subjektiven Wohlbefindens.',
  citation: 'WHO (2024). The World Health Organization-Five Well-Being Index (WHO-5).',
  validation: {
    sensitivity: 0.86,
    specificity: 0.81,
    purpose: 'Screening-Tool für Depression und Outcome-Messung in klinischen Studien',
  },
  advantages: [
    'Kurz und nicht-invasiv (nur 5 Fragen)',
    'Positiv formuliert, weniger belastend als symptom-fokussierte Fragebögen',
    'Kulturübergreifend validiert',
    'Gut geeignet für niedrigschwellige Selbsteinschätzung',
  ],
  limitations: [
    'Weniger spezifisch als PHQ-9 oder GAD-7',
    'Kann keine Diagnose stellen',
    'Bei niedrigen Scores wird weitere Abklärung empfohlen',
  ],
}
