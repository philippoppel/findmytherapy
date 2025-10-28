/**
 * Comprehensive Tests for AdaptiveTriageFlow
 *
 * CRITICAL: This is the core assessment flow - must be 100% reliable
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdaptiveTriageFlow } from './AdaptiveTriageFlow'

// Mock analytics
jest.mock('../../lib/analytics', () => ({
  track: jest.fn(),
}))

// Mock fetch
global.fetch = jest.fn() as jest.Mock

describe('AdaptiveTriageFlow - Comprehensive Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        recommendations: {
          therapists: [],
          courses: [],
        },
      }),
    })
  })

  describe('✅ Screening-Only Path (PHQ-2 <3, GAD-2 <3)', () => {
    it('should complete screening-only flow when all scores <3', async () => {
      const user = userEvent.setup()
      render(<AdaptiveTriageFlow />)

      // PHQ-2 Question 1: Select "Überhaupt nicht" (0)
      await waitFor(() => expect(screen.getByText(/Wenig Interesse oder Freude/i)).toBeInTheDocument())
      const option0_q1 = screen.getByRole('button', { name: /Überhaupt nicht/i })
      await user.click(option0_q1)

      // PHQ-2 Question 2: Select "An einzelnen Tagen" (1)
      await waitFor(() => expect(screen.getByText(/Niedergeschlagenheit/i)).toBeInTheDocument())
      const option1_q2 = screen.getByRole('button', { name: /An einzelnen Tagen/i })
      await user.click(option1_q2)

      // GAD-2 Question 1: Select "Überhaupt nicht" (0)
      await waitFor(() => expect(screen.getByText(/Nervosität, Ängstlichkeit/i)).toBeInTheDocument())
      const option0_gad1 = screen.getByRole('button', { name: /Überhaupt nicht/i })
      await user.click(option0_gad1)

      // GAD-2 Question 2: Select "An einzelnen Tagen" (1)
      await waitFor(() => expect(screen.getByText(/Nicht in der Lage sein, Sorgen zu stoppen/i)).toBeInTheDocument())
      const option1_gad2 = screen.getByRole('button', { name: /An einzelnen Tagen/i })
      await user.click(option1_gad2)

      // Should now show preferences screen (not expanded questions!)
      await waitFor(() => {
        expect(screen.getByText(/Fast geschafft!/i)).toBeInTheDocument()
      })

      // Complete preferences
      const therapistOption = screen.getByRole('button', { name: /1:1 Psychotherapie/i })
      await user.click(therapistOption)

      const onlineOption = screen.getByRole('button', { name: /Online & Abends/i })
      await user.click(onlineOption)

      // Submit
      const submitButton = screen.getByRole('button', { name: /Ergebnis anzeigen/i })
      await user.click(submitButton)

      // Verify API call was made with screening-only data
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/triage',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('"assessmentType":"screening"'),
          })
        )
      })

      // Verify screening result is shown
      await waitFor(() => {
        expect(screen.getByText(/Screening unauffällig/i)).toBeInTheDocument()
        expect(screen.getByText(/PHQ-2 Score/i)).toBeInTheDocument()
        expect(screen.getByText(/GAD-2 Score/i)).toBeInTheDocument()
      })
    })

    it('should NOT show full PHQ-9/GAD-7 scores in screening-only result', async () => {
      const user = userEvent.setup()
      render(<AdaptiveTriageFlow />)

      // Complete screening with low scores
      await completeScreeningLowScores(user)

      // Submit
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /Ergebnis anzeigen/i })
        submitButton.click()
      })

      // Wait for results
      await waitFor(() => {
        expect(screen.getByText(/Screening unauffällig/i)).toBeInTheDocument()
      })

      // Should NOT show "PHQ-9: X/27" or "GAD-7: X/21"
      expect(screen.queryByText(/\/27/)).not.toBeInTheDocument()
      expect(screen.queryByText(/\/21/)).not.toBeInTheDocument()

      // Should show PHQ-2 and GAD-2 scores
      expect(screen.getByText(/PHQ-2 Score/i)).toBeInTheDocument()
      expect(screen.getByText(/GAD-2 Score/i)).toBeInTheDocument()
    })

    it('should offer option to do full assessment from screening result', async () => {
      const user = userEvent.setup()
      render(<AdaptiveTriageFlow />)

      await completeScreeningLowScores(user)

      // Submit and wait for result
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /Ergebnis anzeigen/i })
        submitButton.click()
      })

      await waitFor(() => {
        expect(screen.getByText(/Screening unauffällig/i)).toBeInTheDocument()
      })

      // Should show option to do full assessment
      const fullAssessmentButton = screen.getByRole('button', {
        name: /Vollständiges Assessment durchführen/i,
      })
      expect(fullAssessmentButton).toBeInTheDocument()
    })
  })

  describe('✅ Full Assessment Path (PHQ-2 ≥3 OR GAD-2 ≥3)', () => {
    it('should expand to full PHQ-9 when PHQ-2 ≥3', async () => {
      const user = userEvent.setup()
      render(<AdaptiveTriageFlow />)

      // PHQ-2 Question 1: Select "An mehr als der Hälfte der Tage" (2)
      await waitFor(() => expect(screen.getByText(/Wenig Interesse oder Freude/i)).toBeInTheDocument())
      const option2_q1 = screen.getByRole('button', { name: /An mehr als der Hälfte der Tage/i })
      await user.click(option2_q1)

      // PHQ-2 Question 2: Select "An mehr als der Hälfte der Tage" (2)
      // Total PHQ-2 = 4 (≥3, should trigger expansion)
      await waitFor(() => expect(screen.getByText(/Niedergeschlagenheit/i)).toBeInTheDocument())
      const option2_q2 = screen.getByRole('button', { name: /An mehr als der Hälfte der Tage/i })
      await user.click(option2_q2)

      // GAD-2 Question 1: Low score
      await waitFor(() => expect(screen.getByText(/Nervosität, Ängstlichkeit/i)).toBeInTheDocument())
      const option0_gad1 = screen.getByRole('button', { name: /Überhaupt nicht/i })
      await user.click(option0_gad1)

      // GAD-2 Question 2: Low score
      await waitFor(() => expect(screen.getByText(/Nicht in der Lage sein, Sorgen zu stoppen/i)).toBeInTheDocument())
      const option0_gad2 = screen.getByRole('button', { name: /Überhaupt nicht/i })
      await user.click(option0_gad2)

      // Should now show PHQ-9 question 3 (expansion!)
      await waitFor(() => {
        expect(screen.getByText(/Detaillierte Einschätzung/i)).toBeInTheDocument()
        expect(screen.getByText(/Schwierigkeiten ein- oder durchzuschlafen/i)).toBeInTheDocument()
      })
    })

    it('should expand to full GAD-7 when GAD-2 ≥3', async () => {
      const user = userEvent.setup()
      render(<AdaptiveTriageFlow />)

      // PHQ-2: Low scores
      await answerPHQ2Low(user)

      // GAD-2 Question 1: High score (2)
      await waitFor(() => expect(screen.getByText(/Nervosität, Ängstlichkeit/i)).toBeInTheDocument())
      const option2_gad1 = screen.getByRole('button', { name: /An mehr als der Hälfte der Tage/i })
      await user.click(option2_gad1)

      // GAD-2 Question 2: High score (2)
      // Total GAD-2 = 4 (≥3, should trigger expansion)
      await waitFor(() => expect(screen.getByText(/Nicht in der Lage sein, Sorgen zu stoppen/i)).toBeInTheDocument())
      const option2_gad2 = screen.getByRole('button', { name: /An mehr als der Hälfte der Tage/i })
      await user.click(option2_gad2)

      // Should now show GAD-7 question 3 (expansion!)
      await waitFor(() => {
        expect(screen.getByText(/Detaillierte Einschätzung/i)).toBeInTheDocument()
        expect(screen.getByText(/Übermäßige Sorgen/i)).toBeInTheDocument()
      })
    })

    it('should expand both PHQ-9 and GAD-7 when both ≥3', async () => {
      const user = userEvent.setup()
      render(<AdaptiveTriageFlow />)

      // PHQ-2: High scores
      await answerPHQ2High(user)

      // GAD-2: High scores
      await answerGAD2High(user)

      // Should expand PHQ-9 first
      await waitFor(() => {
        expect(screen.getByText(/Schwierigkeiten ein- oder durchzuschlafen/i)).toBeInTheDocument()
      })

      // Complete all PHQ-9 questions
      await completeRemainingPHQ9(user)

      // Then should expand GAD-7
      await waitFor(() => {
        expect(screen.getByText(/Übermäßige Sorgen/i)).toBeInTheDocument()
      })
    })

    it('should calculate correct full scores and show in results', async () => {
      const user = userEvent.setup()
      render(<AdaptiveTriageFlow />)

      // Complete full assessment
      await completeFullAssessmentMildScores(user)

      // Submit
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /Ergebnis anzeigen/i })
        submitButton.click()
      })

      // Verify API call with full data
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/triage',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('"assessmentType":"full"'),
          })
        )
      })

      // Should show full scores in result
      await waitFor(() => {
        expect(screen.getByText(/PHQ-9:/i)).toBeInTheDocument()
        expect(screen.getByText(/GAD-7:/i)).toBeInTheDocument()
        expect(screen.getByText(/Ampel/i)).toBeInTheDocument()
      })
    })
  })

  describe('⚠️ Partial Expansion Path (one ≥3, one <3)', () => {
    it('should handle partial expansion: PHQ-9 expanded, GAD-7 not expanded', async () => {
      const user = userEvent.setup()
      render(<AdaptiveTriageFlow />)

      // PHQ-2: High (≥3)
      await answerPHQ2High(user)

      // GAD-2: Low (<3)
      await answerGAD2Low(user)

      // Should expand only PHQ-9
      await waitFor(() => {
        expect(screen.getByText(/Schwierigkeiten ein- oder durchzuschlafen/i)).toBeInTheDocument()
      })

      // Complete PHQ-9
      await completeRemainingPHQ9(user)

      // Should go directly to preferences (not GAD-7 expansion)
      await waitFor(() => {
        expect(screen.getByText(/Fast geschafft!/i)).toBeInTheDocument()
      })

      // Complete and submit
      await completePreferences(user)

      const submitButton = screen.getByRole('button', { name: /Ergebnis anzeigen/i })
      await user.click(submitButton)

      // Verify API call includes padded GAD-7
      await waitFor(() => {
        const calls = (global.fetch as jest.Mock).mock.calls
        const body = JSON.parse(calls[0][1].body)
        expect(body.assessmentType).toBe('full')
        expect(body.phq9Answers).toHaveLength(9)
        expect(body.gad7Answers).toHaveLength(7)
        // GAD-7 should be padded: [low, low, 0, 0, 0, 0, 0]
        expect(body.gad7Answers.slice(2)).toEqual([0, 0, 0, 0, 0])
      })
    })
  })

  describe('🔴 Critical: Suicidal Ideation Detection', () => {
    it('should show crisis banner immediately when PHQ-9 item 9 ≥1', async () => {
      const user = userEvent.setup()
      render(<AdaptiveTriageFlow />)

      // Complete screening to trigger PHQ-9 expansion
      await answerPHQ2High(user)
      await answerGAD2Low(user)

      // Complete PHQ-9 questions 3-8
      await completeRemainingPHQ9Except9(user)

      // PHQ-9 item 9 (suicidal thoughts): Select "An einzelnen Tagen" (1)
      await waitFor(() => expect(screen.getByText(/Gedanken, dass Sie lieber tot wären/i)).toBeInTheDocument())
      const suicidalOption = screen.getByRole('button', { name: /An einzelnen Tagen/i })
      await user.click(suicidalOption)

      // IMMEDIATELY should show crisis banner
      await waitFor(() => {
        expect(screen.getByText(/Wichtig: Sofortige Unterstützung verfügbar/i)).toBeInTheDocument()
        expect(screen.getByText(/Telefonseelsorge 142/i)).toBeInTheDocument()
      })
    })

    it('should include crisis resources in final result when suicidal ideation present', async () => {
      const user = userEvent.setup()
      render(<AdaptiveTriageFlow />)

      await completeFullAssessmentWithSuicidalIdeation(user)

      // Submit
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /Ergebnis anzeigen/i })
        submitButton.click()
      })

      // Should show crisis resources
      await waitFor(() => {
        expect(screen.getByText(/Sofortige Hilfe/i)).toBeInTheDocument()
        expect(screen.getByText(/requiresEmergency|HIGH/i)).toBeInTheDocument()
      })
    })
  })

  describe('🧪 Scientific Correctness', () => {
    it('should NOT calculate full PHQ-9/GAD-7 scores for screening-only', async () => {
      const user = userEvent.setup()
      render(<AdaptiveTriageFlow />)

      await completeScreeningLowScores(user)

      const submitButton = screen.getByRole('button', { name: /Ergebnis anzeigen/i })
      await user.click(submitButton)

      await waitFor(() => {
        const calls = (global.fetch as jest.Mock).mock.calls
        const body = JSON.parse(calls[0][1].body)

        // Should be screening-only
        expect(body.assessmentType).toBe('screening')
        expect(body.phq2Score).toBeLessThan(3)
        expect(body.gad2Score).toBeLessThan(3)

        // Should NOT have full scores
        expect(body.phq9Score).toBeUndefined()
        expect(body.gad7Score).toBeUndefined()
      })
    })

    it('should correctly pad non-expanded side with zeros in partial expansion', async () => {
      const user = userEvent.setup()
      render(<AdaptiveTriageFlow />)

      // PHQ-2 high, GAD-2 low
      await answerPHQ2High(user) // 2+2 = 4
      await answerGAD2Low(user) // 0+1 = 1

      // Complete PHQ-9
      await completeRemainingPHQ9(user)

      // Complete preferences and submit
      await completePreferences(user)
      const submitButton = screen.getByRole('button', { name: /Ergebnis anzeigen/i })
      await user.click(submitButton)

      await waitFor(() => {
        const calls = (global.fetch as jest.Mock).mock.calls
        const body = JSON.parse(calls[0][1].body)

        // GAD-7 should be: [0, 1, 0, 0, 0, 0, 0]
        // Score = 1 (minimal)
        expect(body.gad7Answers).toEqual([0, 1, 0, 0, 0, 0, 0])
        expect(body.gad7Score).toBe(1)
        expect(body.gad7Severity).toBe('minimal')
      })
    })
  })
})

// Helper functions
async function completeScreeningLowScores(user: ReturnType<typeof userEvent.setup>) {
  // PHQ-2: 0 + 1 = 1
  await waitFor(() => screen.getByText(/Wenig Interesse oder Freude/i))
  await user.click(screen.getByRole('button', { name: /Überhaupt nicht/i }))

  await waitFor(() => screen.getByText(/Niedergeschlagenheit/i))
  await user.click(screen.getByRole('button', { name: /An einzelnen Tagen/i }))

  // GAD-2: 0 + 1 = 1
  await waitFor(() => screen.getByText(/Nervosität, Ängstlichkeit/i))
  await user.click(screen.getByRole('button', { name: /Überhaupt nicht/i }))

  await waitFor(() => screen.getByText(/Nicht in der Lage sein, Sorgen zu stoppen/i))
  await user.click(screen.getByRole('button', { name: /An einzelnen Tagen/i }))

  await completePreferences(user)
}

async function answerPHQ2High(user: ReturnType<typeof userEvent.setup>) {
  await waitFor(() => screen.getByText(/Wenig Interesse oder Freude/i))
  await user.click(screen.getByRole('button', { name: /An mehr als der Hälfte der Tage/i }))

  await waitFor(() => screen.getByText(/Niedergeschlagenheit/i))
  await user.click(screen.getByRole('button', { name: /An mehr als der Hälfte der Tage/i }))
}

async function answerPHQ2Low(user: ReturnType<typeof userEvent.setup>) {
  await waitFor(() => screen.getByText(/Wenig Interesse oder Freude/i))
  await user.click(screen.getByRole('button', { name: /Überhaupt nicht/i }))

  await waitFor(() => screen.getByText(/Niedergeschlagenheit/i))
  await user.click(screen.getByRole('button', { name: /Überhaupt nicht/i }))
}

async function answerGAD2High(user: ReturnType<typeof userEvent.setup>) {
  await waitFor(() => screen.getByText(/Nervosität, Ängstlichkeit/i))
  await user.click(screen.getByRole('button', { name: /An mehr als der Hälfte der Tage/i }))

  await waitFor(() => screen.getByText(/Nicht in der Lage sein, Sorgen zu stoppen/i))
  await user.click(screen.getByRole('button', { name: /An mehr als der Hälfte der Tage/i }))
}

async function answerGAD2Low(user: ReturnType<typeof userEvent.setup>) {
  await waitFor(() => screen.getByText(/Nervosität, Ängstlichkeit/i))
  await user.click(screen.getByRole('button', { name: /Überhaupt nicht/i }))

  await waitFor(() => screen.getByText(/Nicht in der Lage sein, Sorgen zu stoppen/i))
  await user.click(screen.getByRole('button', { name: /An einzelnen Tagen/i }))
}

async function completeRemainingPHQ9(user: ReturnType<typeof userEvent.setup>) {
  // Questions 3-9 (7 questions)
  for (let i = 0; i < 7; i++) {
    await waitFor(() => screen.getByRole('button', { name: /An einzelnen Tagen/i }))
    await user.click(screen.getByRole('button', { name: /An einzelnen Tagen/i }))
  }
}

async function completeRemainingPHQ9Except9(user: ReturnType<typeof userEvent.setup>) {
  // Questions 3-8 (6 questions)
  for (let i = 0; i < 6; i++) {
    await waitFor(() => screen.getByRole('button', { name: /An einzelnen Tagen/i }))
    await user.click(screen.getByRole('button', { name: /An einzelnen Tagen/i }))
  }
}

async function completeFullAssessmentMildScores(user: ReturnType<typeof userEvent.setup>) {
  await answerPHQ2High(user)
  await answerGAD2High(user)
  await completeRemainingPHQ9(user)

  // Complete GAD-7 (questions 3-7)
  for (let i = 0; i < 5; i++) {
    await waitFor(() => screen.getByRole('button', { name: /An einzelnen Tagen/i }))
    await user.click(screen.getByRole('button', { name: /An einzelnen Tagen/i }))
  }

  await completePreferences(user)
}

async function completeFullAssessmentWithSuicidalIdeation(user: ReturnType<typeof userEvent.setup>) {
  await answerPHQ2High(user)
  await answerGAD2Low(user)
  await completeRemainingPHQ9Except9(user)

  // PHQ-9 item 9: Suicidal ideation
  await waitFor(() => screen.getByText(/Gedanken, dass Sie lieber tot wären/i))
  await user.click(screen.getByRole('button', { name: /Beinahe jeden Tag/i }))

  await completePreferences(user)
}

async function completePreferences(user: ReturnType<typeof userEvent.setup>) {
  await waitFor(() => screen.getByText(/Fast geschafft!/i))

  // Select therapist
  const therapistBtn = screen.getByRole('button', { name: /1:1 Psychotherapie/i })
  await user.click(therapistBtn)

  // Select online
  const onlineBtn = screen.getByRole('button', { name: /Online & Abends/i })
  await user.click(onlineBtn)
}
