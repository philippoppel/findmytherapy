/**
 * Wissenschaftliche Referenzwerte für PHQ-9 und GAD-7
 *
 * Diese Werte stammen aus veröffentlichten Studien und dienen als Vergleichswerte
 * für die Nutzer-Einschätzung.
 */

export type Benchmark = {
  label: string
  phq9Score: number
  gad7Score: number
  description: string
  source?: string
}

/**
 * Durchschnittswerte aus der Allgemeinbevölkerung
 *
 * Quellen:
 * - PHQ-9: Kocalevent et al. (2013) - Deutsche Normierungsstudie
 * - GAD-7: Löwe et al. (2008) - Deutsche Validierungsstudie
 */
export const populationBenchmarks: Benchmark[] = [
  {
    label: 'Allgemeinbevölkerung (Durchschnitt)',
    phq9Score: 5.0,
    gad7Score: 3.5,
    description: 'Durchschnittswerte in der deutschen Allgemeinbevölkerung ohne klinische Diagnose',
    source: 'Kocalevent et al. (2013), Löwe et al. (2008)',
  },
  {
    label: 'Klinische Stichprobe (leichte Symptome)',
    phq9Score: 10.0,
    gad7Score: 8.0,
    description: 'Durchschnittliche Werte bei Personen mit leichten depressiven/Angstsymptomen',
    source: 'Kroenke et al. (2001), Spitzer et al. (2006)',
  },
  {
    label: 'Klinische Stichprobe (mittelschwere Symptome)',
    phq9Score: 15.0,
    gad7Score: 13.0,
    description: 'Durchschnittliche Werte bei Personen mit mittelschweren Symptomen',
    source: 'Kroenke et al. (2001), Spitzer et al. (2006)',
  },
]

/**
 * Schwellenwerte für PHQ-9
 */
export const phq9Thresholds = {
  minimal: { min: 0, max: 4, label: 'Minimale Symptome', color: 'emerald' },
  mild: { min: 5, max: 9, label: 'Leichte Symptome', color: 'yellow' },
  moderate: { min: 10, max: 14, label: 'Mittelschwere Symptome', color: 'orange' },
  moderately_severe: { min: 15, max: 19, label: 'Mittelschwer bis schwere Symptome', color: 'red' },
  severe: { min: 20, max: 27, label: 'Schwere Symptome', color: 'red' },
} as const

/**
 * Schwellenwerte für GAD-7
 */
export const gad7Thresholds = {
  minimal: { min: 0, max: 4, label: 'Minimale Symptome', color: 'emerald' },
  mild: { min: 5, max: 9, label: 'Leichte Symptome', color: 'yellow' },
  moderate: { min: 10, max: 14, label: 'Mittelschwere Symptome', color: 'orange' },
  severe: { min: 15, max: 21, label: 'Schwere Symptome', color: 'red' },
} as const

/**
 * Hilfsfunktion: Findet den passenden Benchmark für einen Score
 */
export function findClosestBenchmark(phq9Score: number, gad7Score: number): Benchmark {
  const scores = populationBenchmarks.map(b => ({
    benchmark: b,
    distance: Math.sqrt(
      Math.pow(b.phq9Score - phq9Score, 2) +
      Math.pow(b.gad7Score - gad7Score, 2)
    ),
  }))

  scores.sort((a, b) => a.distance - b.distance)
  return scores[0].benchmark
}

/**
 * Wissenschaftliche Quellen
 */
export const scientificSources = [
  {
    name: 'PHQ-9 Original-Validierung',
    citation: 'Kroenke, K., Spitzer, R. L., & Williams, J. B. (2001). The PHQ-9: validity of a brief depression severity measure. Journal of general internal medicine, 16(9), 606-613.',
    url: 'https://doi.org/10.1046/j.1525-1497.2001.016009606.x',
  },
  {
    name: 'GAD-7 Original-Validierung',
    citation: 'Spitzer, R. L., Kroenke, K., Williams, J. B., & Löwe, B. (2006). A brief measure for assessing generalized anxiety disorder: the GAD-7. Archives of internal medicine, 166(10), 1092-1097.',
    url: 'https://doi.org/10.1001/archinte.166.10.1092',
  },
  {
    name: 'PHQ-9 Deutsche Normierung',
    citation: 'Kocalevent, R. D., Hinz, A., & Brähler, E. (2013). Standardization of the depression screener patient health questionnaire (PHQ-9) in the general population. General hospital psychiatry, 35(5), 551-555.',
    url: 'https://doi.org/10.1016/j.genhosppsych.2013.04.006',
  },
  {
    name: 'GAD-7 Deutsche Validierung',
    citation: 'Löwe, B., Decker, O., Müller, S., et al. (2008). Validation and standardization of the Generalized Anxiety Disorder Screener (GAD-7) in the general population. Medical care, 46(3), 266-274.',
    url: 'https://doi.org/10.1097/MLR.0b013e318160d093',
  },
]
