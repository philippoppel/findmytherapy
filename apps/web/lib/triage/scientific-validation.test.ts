/**
 * Scientific Validation Tests
 *
 * These tests verify that our implementation matches published scientific literature
 * for PHQ-9, GAD-7, PHQ-2, and GAD-2 screening instruments.
 */

import { describe, it, expect } from '@jest/globals'
import {
  calculatePHQ9Severity,
  calculateGAD7Severity,
  assessRiskLevel,
} from './questionnaires'
import {
  shouldExpandPHQ9,
  shouldExpandGAD7,
  getAdaptiveQuestions,
} from './adaptive-questionnaires'

describe('Scientific Validation: PHQ-9', () => {
  describe('PHQ-9 Severity Classification (Kroenke et al., 2001)', () => {
    it('should classify 0-4 as minimal', () => {
      expect(calculatePHQ9Severity(0)).toBe('minimal')
      expect(calculatePHQ9Severity(2)).toBe('minimal')
      expect(calculatePHQ9Severity(4)).toBe('minimal')
    })

    it('should classify 5-9 as mild', () => {
      expect(calculatePHQ9Severity(5)).toBe('mild')
      expect(calculatePHQ9Severity(7)).toBe('mild')
      expect(calculatePHQ9Severity(9)).toBe('mild')
    })

    it('should classify 10-14 as moderate', () => {
      expect(calculatePHQ9Severity(10)).toBe('moderate')
      expect(calculatePHQ9Severity(12)).toBe('moderate')
      expect(calculatePHQ9Severity(14)).toBe('moderate')
    })

    it('should classify 15-19 as moderately_severe', () => {
      expect(calculatePHQ9Severity(15)).toBe('moderately_severe')
      expect(calculatePHQ9Severity(17)).toBe('moderately_severe')
      expect(calculatePHQ9Severity(19)).toBe('moderately_severe')
    })

    it('should classify 20-27 as severe', () => {
      expect(calculatePHQ9Severity(20)).toBe('severe')
      expect(calculatePHQ9Severity(24)).toBe('severe')
      expect(calculatePHQ9Severity(27)).toBe('severe')
    })

    it('should handle boundary values correctly', () => {
      expect(calculatePHQ9Severity(4)).toBe('minimal')
      expect(calculatePHQ9Severity(5)).toBe('mild')

      expect(calculatePHQ9Severity(9)).toBe('mild')
      expect(calculatePHQ9Severity(10)).toBe('moderate')

      expect(calculatePHQ9Severity(14)).toBe('moderate')
      expect(calculatePHQ9Severity(15)).toBe('moderately_severe')

      expect(calculatePHQ9Severity(19)).toBe('moderately_severe')
      expect(calculatePHQ9Severity(20)).toBe('severe')
    })
  })
})

describe('Scientific Validation: GAD-7', () => {
  describe('GAD-7 Severity Classification (Spitzer et al., 2006)', () => {
    it('should classify 0-4 as minimal', () => {
      expect(calculateGAD7Severity(0)).toBe('minimal')
      expect(calculateGAD7Severity(2)).toBe('minimal')
      expect(calculateGAD7Severity(4)).toBe('minimal')
    })

    it('should classify 5-9 as mild', () => {
      expect(calculateGAD7Severity(5)).toBe('mild')
      expect(calculateGAD7Severity(7)).toBe('mild')
      expect(calculateGAD7Severity(9)).toBe('mild')
    })

    it('should classify 10-14 as moderate', () => {
      expect(calculateGAD7Severity(10)).toBe('moderate')
      expect(calculateGAD7Severity(12)).toBe('moderate')
      expect(calculateGAD7Severity(14)).toBe('moderate')
    })

    it('should classify 15-21 as severe', () => {
      expect(calculateGAD7Severity(15)).toBe('severe')
      expect(calculateGAD7Severity(18)).toBe('severe')
      expect(calculateGAD7Severity(21)).toBe('severe')
    })

    it('should handle boundary values correctly', () => {
      expect(calculateGAD7Severity(4)).toBe('minimal')
      expect(calculateGAD7Severity(5)).toBe('mild')

      expect(calculateGAD7Severity(9)).toBe('mild')
      expect(calculateGAD7Severity(10)).toBe('moderate')

      expect(calculateGAD7Severity(14)).toBe('moderate')
      expect(calculateGAD7Severity(15)).toBe('severe')
    })
  })
})

describe('Scientific Validation: PHQ-2 Screening (Kroenke et al., 2003)', () => {
  describe('PHQ-2 Cutoff: ≥3 (Sensitivity: 83%, Specificity: 92%)', () => {
    it('should NOT expand when score <3', () => {
      expect(shouldExpandPHQ9(0)).toBe(false)
      expect(shouldExpandPHQ9(1)).toBe(false)
      expect(shouldExpandPHQ9(2)).toBe(false)
    })

    it('should expand when score ≥3', () => {
      expect(shouldExpandPHQ9(3)).toBe(true)
      expect(shouldExpandPHQ9(4)).toBe(true)
      expect(shouldExpandPHQ9(5)).toBe(true)
      expect(shouldExpandPHQ9(6)).toBe(true)
    })

    it('should handle boundary value correctly', () => {
      expect(shouldExpandPHQ9(2)).toBe(false) // Negative screening
      expect(shouldExpandPHQ9(3)).toBe(true) // Positive screening
    })
  })
})

describe('Scientific Validation: GAD-2 Screening (Kroenke et al., 2007)', () => {
  describe('GAD-2 Cutoff: ≥3 (Sensitivity: 86%, Specificity: 83%)', () => {
    it('should NOT expand when score <3', () => {
      expect(shouldExpandGAD7(0)).toBe(false)
      expect(shouldExpandGAD7(1)).toBe(false)
      expect(shouldExpandGAD7(2)).toBe(false)
    })

    it('should expand when score ≥3', () => {
      expect(shouldExpandGAD7(3)).toBe(true)
      expect(shouldExpandGAD7(4)).toBe(true)
      expect(shouldExpandGAD7(5)).toBe(true)
      expect(shouldExpandGAD7(6)).toBe(true)
    })

    it('should handle boundary value correctly', () => {
      expect(shouldExpandGAD7(2)).toBe(false) // Negative screening
      expect(shouldExpandGAD7(3)).toBe(true) // Positive screening
    })
  })
})

describe('Scientific Validation: Adaptive Screening Logic', () => {
  it('should calculate PHQ-2 and GAD-2 scores correctly', () => {
    const result1 = getAdaptiveQuestions([1, 1], [0, 1])
    expect(result1.phq2Score).toBe(2)
    expect(result1.gad2Score).toBe(1)

    const result2 = getAdaptiveQuestions([2, 2], [3, 3])
    expect(result2.phq2Score).toBe(4)
    expect(result2.gad2Score).toBe(6)
  })

  it('should determine expansion correctly based on cutoffs', () => {
    // Both negative
    const result1 = getAdaptiveQuestions([1, 1], [0, 1])
    expect(result1.needsFullPHQ9).toBe(false)
    expect(result1.needsFullGAD7).toBe(false)

    // PHQ-2 positive, GAD-2 negative
    const result2 = getAdaptiveQuestions([2, 2], [0, 1])
    expect(result2.needsFullPHQ9).toBe(true)
    expect(result2.needsFullGAD7).toBe(false)

    // PHQ-2 negative, GAD-2 positive
    const result3 = getAdaptiveQuestions([1, 1], [2, 2])
    expect(result3.needsFullPHQ9).toBe(false)
    expect(result3.needsFullGAD7).toBe(true)

    // Both positive
    const result4 = getAdaptiveQuestions([2, 2], [2, 2])
    expect(result4.needsFullPHQ9).toBe(true)
    expect(result4.needsFullGAD7).toBe(true)
  })

  it('should handle edge case: exactly at cutoff', () => {
    // PHQ-2 = 3, GAD-2 = 3 (both at cutoff)
    const result = getAdaptiveQuestions([1, 2], [1, 2])
    expect(result.phq2Score).toBe(3)
    expect(result.gad2Score).toBe(3)
    expect(result.needsFullPHQ9).toBe(true)
    expect(result.needsFullGAD7).toBe(true)
  })
})

describe('Scientific Validation: Risk Assessment', () => {
  describe('Emergency Criteria (Suicidal Ideation)', () => {
    it('should flag as HIGH risk with requiresEmergency when item 9 ≥1', () => {
      const risk = assessRiskLevel(8, 7, { phq9Item9Score: 1 })
      expect(risk.level).toBe('HIGH')
      expect(risk.requiresEmergency).toBe(true)
      expect(risk.hasSuicidalIdeation).toBe(true)
      expect(risk.ampelColor).toBe('red')
    })

    it('should flag as HIGH risk with requiresEmergency when PHQ-9 ≥20', () => {
      const risk = assessRiskLevel(20, 5, { phq9Item9Score: 0 })
      expect(risk.level).toBe('HIGH')
      expect(risk.requiresEmergency).toBe(true)
      expect(risk.ampelColor).toBe('red')
    })

    it('should prioritize suicidal ideation even with lower scores', () => {
      const risk = assessRiskLevel(6, 4, { phq9Item9Score: 2 })
      expect(risk.level).toBe('HIGH')
      expect(risk.requiresEmergency).toBe(true)
      expect(risk.hasSuicidalIdeation).toBe(true)
    })
  })

  describe('HIGH Risk (without emergency)', () => {
    it('should classify moderately_severe depression as HIGH', () => {
      const risk = assessRiskLevel(15, 5, { phq9Item9Score: 0 })
      expect(risk.level).toBe('HIGH')
      expect(risk.requiresEmergency).toBe(false)
      expect(risk.ampelColor).toBe('red')
    })

    it('should classify severe anxiety as HIGH', () => {
      const risk = assessRiskLevel(5, 15, { phq9Item9Score: 0 })
      expect(risk.level).toBe('HIGH')
      expect(risk.requiresEmergency).toBe(false)
      expect(risk.ampelColor).toBe('red')
    })

    it('should classify both moderate as HIGH', () => {
      const risk = assessRiskLevel(10, 10, { phq9Item9Score: 0 })
      expect(risk.level).toBe('HIGH')
      expect(risk.requiresEmergency).toBe(false)
      expect(risk.ampelColor).toBe('red')
    })
  })

  describe('MEDIUM Risk', () => {
    it('should classify moderate depression with minimal anxiety as MEDIUM', () => {
      const risk = assessRiskLevel(10, 2, { phq9Item9Score: 0 })
      expect(risk.level).toBe('MEDIUM')
      expect(risk.ampelColor).toBe('yellow')
    })

    it('should classify moderate anxiety with minimal depression as MEDIUM', () => {
      const risk = assessRiskLevel(2, 10, { phq9Item9Score: 0 })
      expect(risk.level).toBe('MEDIUM')
      expect(risk.ampelColor).toBe('yellow')
    })

    it('should classify both mild as MEDIUM', () => {
      const risk = assessRiskLevel(5, 5, { phq9Item9Score: 0 })
      expect(risk.level).toBe('MEDIUM')
      expect(risk.ampelColor).toBe('yellow')
    })
  })

  describe('LOW Risk', () => {
    it('should classify minimal on both as LOW', () => {
      const risk = assessRiskLevel(2, 2, { phq9Item9Score: 0 })
      expect(risk.level).toBe('LOW')
      expect(risk.ampelColor).toBe('green')
    })

    it('should classify one minimal and one mild as LOW', () => {
      const risk1 = assessRiskLevel(2, 5, { phq9Item9Score: 0 })
      expect(risk1.level).toBe('LOW')

      const risk2 = assessRiskLevel(5, 2, { phq9Item9Score: 0 })
      expect(risk2.level).toBe('LOW')
    })
  })
})

describe('Scientific Validation: Boundary Testing', () => {
  it('should handle minimum possible scores (all 0s)', () => {
    const phq9 = calculatePHQ9Severity(0)
    const gad7 = calculateGAD7Severity(0)
    const risk = assessRiskLevel(0, 0, { phq9Item9Score: 0 })

    expect(phq9).toBe('minimal')
    expect(gad7).toBe('minimal')
    expect(risk.level).toBe('LOW')
  })

  it('should handle maximum possible scores (all 3s)', () => {
    const phq9 = calculatePHQ9Severity(27) // 9 * 3
    const gad7 = calculateGAD7Severity(21) // 7 * 3
    const risk = assessRiskLevel(27, 21, { phq9Item9Score: 3 })

    expect(phq9).toBe('severe')
    expect(gad7).toBe('severe')
    expect(risk.level).toBe('HIGH')
    expect(risk.requiresEmergency).toBe(true)
  })

  it('should handle all cutoff boundaries systematically', () => {
    const phq9Boundaries = [
      { score: 4, expected: 'minimal' },
      { score: 5, expected: 'mild' },
      { score: 9, expected: 'mild' },
      { score: 10, expected: 'moderate' },
      { score: 14, expected: 'moderate' },
      { score: 15, expected: 'moderately_severe' },
      { score: 19, expected: 'moderately_severe' },
      { score: 20, expected: 'severe' },
    ]

    phq9Boundaries.forEach(({ score, expected }) => {
      expect(calculatePHQ9Severity(score)).toBe(expected)
    })

    const gad7Boundaries = [
      { score: 4, expected: 'minimal' },
      { score: 5, expected: 'mild' },
      { score: 9, expected: 'mild' },
      { score: 10, expected: 'moderate' },
      { score: 14, expected: 'moderate' },
      { score: 15, expected: 'severe' },
    ]

    gad7Boundaries.forEach(({ score, expected }) => {
      expect(calculateGAD7Severity(score)).toBe(expected)
    })
  })
})

describe('Scientific Validation: Real-World Scenarios', () => {
  it('Scenario: Patient with mild depression, no anxiety', () => {
    // PHQ-9 answers: [1,1,1,1,1,1,1,0,0] = 7 (mild)
    // GAD-7 answers: [0,0,0,0,0,0,0] = 0 (minimal)
    const risk = assessRiskLevel(7, 0, { phq9Item9Score: 0 })

    expect(calculatePHQ9Severity(7)).toBe('mild')
    expect(calculateGAD7Severity(0)).toBe('minimal')
    expect(risk.level).toBe('LOW') // Only one mild
    expect(risk.ampelColor).toBe('green')
  })

  it('Scenario: Patient with moderate depression and anxiety', () => {
    // PHQ-9: 12 (moderate), GAD-7: 11 (moderate)
    const risk = assessRiskLevel(12, 11, { phq9Item9Score: 0 })

    expect(calculatePHQ9Severity(12)).toBe('moderate')
    expect(calculateGAD7Severity(11)).toBe('moderate')
    expect(risk.level).toBe('HIGH') // Both moderate
    expect(risk.ampelColor).toBe('red')
  })

  it('Scenario: Patient with severe depression, suicidal ideation', () => {
    // PHQ-9: 22 (severe), Item 9: 3
    const risk = assessRiskLevel(22, 8, { phq9Item9Score: 3 })

    expect(calculatePHQ9Severity(22)).toBe('severe')
    expect(risk.level).toBe('HIGH')
    expect(risk.requiresEmergency).toBe(true)
    expect(risk.hasSuicidalIdeation).toBe(true)
    expect(risk.ampelColor).toBe('red')
  })

  it('Scenario: Screening-only negative (should NOT expand)', () => {
    // PHQ-2: [0,1] = 1, GAD-2: [1,0] = 1
    const adaptive = getAdaptiveQuestions([0, 1], [1, 0])

    expect(adaptive.phq2Score).toBe(1)
    expect(adaptive.gad2Score).toBe(1)
    expect(adaptive.needsFullPHQ9).toBe(false)
    expect(adaptive.needsFullGAD7).toBe(false)
  })

  it('Scenario: Screening-only positive for depression (should expand PHQ-9 only)', () => {
    // PHQ-2: [2,2] = 4, GAD-2: [0,1] = 1
    const adaptive = getAdaptiveQuestions([2, 2], [0, 1])

    expect(adaptive.phq2Score).toBe(4)
    expect(adaptive.gad2Score).toBe(1)
    expect(adaptive.needsFullPHQ9).toBe(true)
    expect(adaptive.needsFullGAD7).toBe(false)
  })
})
