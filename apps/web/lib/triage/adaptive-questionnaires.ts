/**
 * Adaptive Triage with PHQ-2/GAD-2 Screening
 *
 * Start with short screenings, expand to full questionnaires only when needed
 */

import type { QuestionnaireQuestion } from './questionnaires'
import { phq9Questions, gad7Questions } from './questionnaires'

/**
 * PHQ-2: First 2 questions of PHQ-9 - validated short screening
 * Sensitivity: 83%, Specificity: 92% for major depression
 */
export const phq2Questions: QuestionnaireQuestion[] = phq9Questions.slice(0, 2)

/**
 * GAD-2: First 2 questions of GAD-7 - validated short screening
 * Sensitivity: 86%, Specificity: 83% for anxiety disorders
 */
export const gad2Questions: QuestionnaireQuestion[] = gad7Questions.slice(0, 2)

/**
 * PHQ-2 cutoff: Score ≥ 3 suggests further evaluation needed
 */
export function shouldExpandPHQ9(phq2Score: number): boolean {
  return phq2Score >= 3
}

/**
 * GAD-2 cutoff: Score ≥ 3 suggests further evaluation needed
 */
export function shouldExpandGAD7(gad2Score: number): boolean {
  return gad2Score >= 3
}

/**
 * Determine which questions to ask based on screening results
 */
export function getAdaptiveQuestions(
  phq2Answers: number[],
  gad2Answers: number[]
): {
  needsFullPHQ9: boolean
  needsFullGAD7: boolean
  phq2Score: number
  gad2Score: number
} {
  const phq2Score = phq2Answers.reduce((sum, val) => sum + (val || 0), 0)
  const gad2Score = gad2Answers.reduce((sum, val) => sum + (val || 0), 0)

  return {
    needsFullPHQ9: shouldExpandPHQ9(phq2Score),
    needsFullGAD7: shouldExpandGAD7(gad2Score),
    phq2Score,
    gad2Score,
  }
}

/**
 * Get remaining PHQ-9 questions (questions 3-9)
 */
export const phq9RemainingQuestions: QuestionnaireQuestion[] = phq9Questions.slice(2)

/**
 * Get remaining GAD-7 questions (questions 3-7)
 */
export const gad7RemainingQuestions: QuestionnaireQuestion[] = gad7Questions.slice(2)

/**
 * Explanatory text for adaptive screening
 */
export const adaptiveScreeningInfo = {
  initial: {
    title: 'Kurzes Screening',
    description: 'Wir starten mit 4 kurzen Fragen (PHQ-2 & GAD-2). Bei Bedarf folgen detailliertere Fragen.',
  },
  expanding: {
    title: 'Detaillierte Einschätzung',
    description: 'Basierend auf deinen bisherigen Antworten stellen wir jetzt weitere Fragen für eine präzisere Einschätzung.',
  },
  minimal: {
    title: 'Geringe Belastung erkannt',
    description: 'Deine Antworten deuten auf minimale Symptome hin. Weitere Fragen sind nicht notwendig.',
  },
}
