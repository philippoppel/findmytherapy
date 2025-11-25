/**
 * Unit tests for adaptive questionnaire logic
 */

import { describe, it, expect } from '@jest/globals';
import {
  shouldExpandPHQ9,
  shouldExpandGAD7,
  getAdaptiveQuestions,
  phq2Questions,
  gad2Questions,
  phq9RemainingQuestions,
  gad7RemainingQuestions,
} from '../../lib/triage/adaptive-questionnaires';

describe('Adaptive Questionnaire Logic', () => {
  describe('PHQ-2 Screening', () => {
    it('should have exactly 2 questions', () => {
      expect(phq2Questions).toHaveLength(2);
    });

    it('should not expand when PHQ-2 score < 3', () => {
      expect(shouldExpandPHQ9(0)).toBe(false);
      expect(shouldExpandPHQ9(1)).toBe(false);
      expect(shouldExpandPHQ9(2)).toBe(false);
    });

    it('should expand when PHQ-2 score >= 3', () => {
      expect(shouldExpandPHQ9(3)).toBe(true);
      expect(shouldExpandPHQ9(4)).toBe(true);
      expect(shouldExpandPHQ9(5)).toBe(true);
      expect(shouldExpandPHQ9(6)).toBe(true);
    });
  });

  describe('GAD-2 Screening', () => {
    it('should have exactly 2 questions', () => {
      expect(gad2Questions).toHaveLength(2);
    });

    it('should not expand when GAD-2 score < 3', () => {
      expect(shouldExpandGAD7(0)).toBe(false);
      expect(shouldExpandGAD7(1)).toBe(false);
      expect(shouldExpandGAD7(2)).toBe(false);
    });

    it('should expand when GAD-2 score >= 3', () => {
      expect(shouldExpandGAD7(3)).toBe(true);
      expect(shouldExpandGAD7(4)).toBe(true);
      expect(shouldExpandGAD7(5)).toBe(true);
      expect(shouldExpandGAD7(6)).toBe(true);
    });
  });

  describe('PHQ-9 Remaining Questions', () => {
    it('should have exactly 7 remaining questions (3-9)', () => {
      expect(phq9RemainingQuestions).toHaveLength(7);
    });
  });

  describe('GAD-7 Remaining Questions', () => {
    it('should have exactly 5 remaining questions (3-7)', () => {
      expect(gad7RemainingQuestions).toHaveLength(5);
    });
  });

  describe('getAdaptiveQuestions', () => {
    it('should correctly determine no expansion needed for low scores', () => {
      const result = getAdaptiveQuestions([0, 1], [1, 1]);
      expect(result.phq2Score).toBe(1);
      expect(result.gad2Score).toBe(2);
      expect(result.needsFullPHQ9).toBe(false);
      expect(result.needsFullGAD7).toBe(false);
    });

    it('should correctly determine PHQ-9 expansion needed', () => {
      const result = getAdaptiveQuestions([2, 2], [0, 0]);
      expect(result.phq2Score).toBe(4);
      expect(result.gad2Score).toBe(0);
      expect(result.needsFullPHQ9).toBe(true);
      expect(result.needsFullGAD7).toBe(false);
    });

    it('should correctly determine GAD-7 expansion needed', () => {
      const result = getAdaptiveQuestions([0, 0], [2, 2]);
      expect(result.phq2Score).toBe(0);
      expect(result.gad2Score).toBe(4);
      expect(result.needsFullPHQ9).toBe(false);
      expect(result.needsFullGAD7).toBe(true);
    });

    it('should correctly determine both expansions needed', () => {
      const result = getAdaptiveQuestions([2, 2], [2, 2]);
      expect(result.phq2Score).toBe(4);
      expect(result.gad2Score).toBe(4);
      expect(result.needsFullPHQ9).toBe(true);
      expect(result.needsFullGAD7).toBe(true);
    });

    it('should handle maximum scores', () => {
      const result = getAdaptiveQuestions([3, 3], [3, 3]);
      expect(result.phq2Score).toBe(6);
      expect(result.gad2Score).toBe(6);
      expect(result.needsFullPHQ9).toBe(true);
      expect(result.needsFullGAD7).toBe(true);
    });

    it('should handle boundary case (score = 3)', () => {
      const result = getAdaptiveQuestions([1, 2], [1, 2]);
      expect(result.phq2Score).toBe(3);
      expect(result.gad2Score).toBe(3);
      expect(result.needsFullPHQ9).toBe(true);
      expect(result.needsFullGAD7).toBe(true);
    });
  });
});
