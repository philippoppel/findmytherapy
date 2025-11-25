/**
 * Triage Session Test Fixtures
 *
 * Factory functions for creating test triage data
 */

import { TriageSession, RiskLevel, NextStep } from '@prisma/client';

type CreateTriageSessionInput = {
  clientId: string;
  phq9Score?: number;
  gad7Score?: number;
  riskLevel?: RiskLevel;
  requiresEmergency?: boolean;
};

/**
 * Create PHQ-9 answers that result in a specific score
 * PHQ-9: 9 questions, each scored 0-3 (total 0-27)
 */
export function createPhq9Answers(targetScore: number): number[] {
  if (targetScore < 0 || targetScore > 27) {
    throw new Error('PHQ-9 score must be between 0 and 27');
  }

  // Distribute score across 9 answers
  const answers: number[] = Array(9).fill(0);
  let remaining = targetScore;

  for (let i = 0; i < 9 && remaining > 0; i++) {
    const value = Math.min(3, remaining);
    answers[i] = value;
    remaining -= value;
  }

  return answers;
}

/**
 * Create GAD-7 answers that result in a specific score
 * GAD-7: 7 questions, each scored 0-3 (total 0-21)
 */
export function createGad7Answers(targetScore: number): number[] {
  if (targetScore < 0 || targetScore > 21) {
    throw new Error('GAD-7 score must be between 0 and 21');
  }

  // Distribute score across 7 answers
  const answers: number[] = Array(7).fill(0);
  let remaining = targetScore;

  for (let i = 0; i < 7 && remaining > 0; i++) {
    const value = Math.min(3, remaining);
    answers[i] = value;
    remaining -= value;
  }

  return answers;
}

/**
 * Get PHQ-9 severity label from score
 */
export function getPhq9Severity(score: number): string {
  if (score >= 20) return 'severe';
  if (score >= 15) return 'moderately_severe';
  if (score >= 10) return 'moderate';
  if (score >= 5) return 'mild';
  return 'minimal';
}

/**
 * Get GAD-7 severity label from score
 */
export function getGad7Severity(score: number): string {
  if (score >= 15) return 'severe';
  if (score >= 10) return 'moderate';
  if (score >= 5) return 'mild';
  return 'minimal';
}

/**
 * Determine risk level from scores
 */
export function calculateRiskLevel(phq9Score: number, gad7Score: number): RiskLevel {
  if (phq9Score >= 20 || gad7Score >= 15) return 'HIGH';
  if (phq9Score >= 10 || gad7Score >= 10) return 'MEDIUM';
  return 'LOW';
}

/**
 * Determine recommended next step
 */
export function calculateNextStep(riskLevel: RiskLevel): NextStep {
  if (riskLevel === 'HIGH') return 'THERAPIST';
  if (riskLevel === 'MEDIUM') return 'COURSE';
  return 'INFO';
}

/**
 * Create a test triage session
 */
export function createTestTriageSession(
  input: CreateTriageSessionInput,
): Omit<TriageSession, 'id' | 'createdAt'> {
  const phq9Score = input.phq9Score ?? 10;
  const gad7Score = input.gad7Score ?? 8;

  const phq9Answers = createPhq9Answers(phq9Score);
  const gad7Answers = createGad7Answers(gad7Score);

  const riskLevel = input.riskLevel ?? calculateRiskLevel(phq9Score, gad7Score);
  const requiresEmergency = input.requiresEmergency ?? (riskLevel === 'HIGH' && phq9Score >= 20);

  return {
    clientId: input.clientId,
    phq9Answers,
    phq9Score,
    phq9Severity: getPhq9Severity(phq9Score),
    gad7Answers,
    gad7Score,
    gad7Severity: getGad7Severity(gad7Score),
    supportPreferences: ['therapist', 'online'],
    availability: ['online', 'mornings'],
    riskLevel,
    recommendedNextStep: calculateNextStep(riskLevel),
    requiresEmergency,
    emergencyTriggered: false,
    meta: null,
  };
}

/**
 * Create a low-risk triage session (minimal symptoms)
 */
export function createLowRiskTriageSession(clientId: string) {
  return createTestTriageSession({
    clientId,
    phq9Score: 3,
    gad7Score: 2,
    riskLevel: 'LOW',
  });
}

/**
 * Create a medium-risk triage session (moderate symptoms)
 */
export function createMediumRiskTriageSession(clientId: string) {
  return createTestTriageSession({
    clientId,
    phq9Score: 12,
    gad7Score: 11,
    riskLevel: 'MEDIUM',
  });
}

/**
 * Create a high-risk triage session (severe symptoms)
 */
export function createHighRiskTriageSession(clientId: string) {
  return createTestTriageSession({
    clientId,
    phq9Score: 22,
    gad7Score: 18,
    riskLevel: 'HIGH',
    requiresEmergency: true,
  });
}

/**
 * Create an emergency triage session (critical risk)
 */
export function createEmergencyTriageSession(clientId: string) {
  return createTestTriageSession({
    clientId,
    phq9Score: 27,
    gad7Score: 21,
    riskLevel: 'HIGH',
    requiresEmergency: true,
  });
}
