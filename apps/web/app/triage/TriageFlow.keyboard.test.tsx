/**
 * Keyboard Navigation Tests for TriageFlow
 * Tests accessibility features and keyboard shortcuts
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TriageFlow } from './TriageFlow'

// Mock analytics
jest.mock('../../lib/analytics', () => ({
  track: jest.fn(),
}))

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('TriageFlow - Keyboard Navigation', () => {
  const fetchMock = jest.fn()
  const mockRecommendations = {
    therapists: [
      {
        id: 'test-therapist',
        name: 'Test Therapist',
        title: 'Psychologe',
        focus: ['Test'],
        availability: 'Verfügbar',
        location: 'Wien',
        rating: 4.5,
        reviews: 10,
        status: 'VERIFIED',
        formatTags: ['online'],
        highlights: ['Test'],
      },
    ],
    courses: [],
  }

  const mockFetchResponse = (payload: unknown, status = 201) =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: async () => payload,
    } as unknown as Response)

  beforeEach(() => {
    jest.clearAllMocks()
    fetchMock.mockReset()
    ;(globalThis as typeof globalThis & { fetch?: typeof fetch }).fetch = fetchMock as unknown as typeof fetch
    fetchMock.mockResolvedValue(mockFetchResponse({ success: true, recommendations: mockRecommendations }))
  })

  afterAll(() => {
    // @ts-expect-error cleanup test override
    delete globalThis.fetch
  })

  describe('Number Key Navigation (0-3)', () => {
    it('should answer question with number key 0', async () => {
      render(<TriageFlow />)

      // Press 0 key
      fireEvent.keyDown(window, { key: '0' })

      // Should auto-advance after answering
      await waitFor(() => {}, { timeout: 500 })

      // Should be on next question (progress should increase)
      expect(screen.queryByText(/fortschritt: 0%/i)).not.toBeInTheDocument()
    })

    it('should answer question with number key 1', async () => {
      render(<TriageFlow />)

      fireEvent.keyDown(window, { key: '1' })

      await waitFor(() => {}, { timeout: 500 })

      expect(screen.queryByText(/fortschritt: 0%/i)).not.toBeInTheDocument()
    })

    it('should answer question with number key 2', async () => {
      render(<TriageFlow />)

      fireEvent.keyDown(window, { key: '2' })

      await waitFor(() => {}, { timeout: 500 })

      expect(screen.queryByText(/fortschritt: 0%/i)).not.toBeInTheDocument()
    })

    it('should answer question with number key 3', async () => {
      render(<TriageFlow />)

      fireEvent.keyDown(window, { key: '3' })

      await waitFor(() => {}, { timeout: 500 })

      expect(screen.queryByText(/fortschritt: 0%/i)).not.toBeInTheDocument()
    })

    it('should NOT respond to other number keys', async () => {
      render(<TriageFlow />)

      const initialProgress = screen.getByText(/fortschritt: 0%/i)

      fireEvent.keyDown(window, { key: '4' })
      fireEvent.keyDown(window, { key: '5' })
      fireEvent.keyDown(window, { key: '9' })

      await waitFor(() => {}, { timeout: 200 })

      // Should still be on first question
      expect(initialProgress).toBeInTheDocument()
    })
  })

  describe('Arrow Key Navigation', () => {
    it('should navigate to previous question with ArrowLeft', async () => {
      render(<TriageFlow />)

      // Answer first question
      fireEvent.keyDown(window, { key: '0' })

      // Wait for auto-advance to complete
      await waitFor(() => {
        expect(screen.queryByText(/wenig interesse oder freude/i)).not.toBeInTheDocument()
      }, { timeout: 1000 })

      // Press ArrowLeft to go back
      fireEvent.keyDown(window, { key: 'ArrowLeft' })

      // Should be back on first question
      await waitFor(() => {
        expect(screen.getByText(/wenig interesse oder freude/i)).toBeInTheDocument()
      }, { timeout: 1000 })
    })

    it('should navigate to next question with ArrowRight when answered', async () => {
      render(<TriageFlow />)

      // Answer first question
      const button = screen.getByRole('button', { name: /überhaupt nicht/i })
      fireEvent.click(button)

      await waitFor(() => {}, { timeout: 500 })

      // Press ArrowRight to advance
      fireEvent.keyDown(window, { key: 'ArrowRight' })

      // Should advance to next question
      await waitFor(() => {}, { timeout: 200 })
    })

    it('should NOT navigate forward with ArrowRight if question not answered', () => {
      render(<TriageFlow />)

      const firstQuestion = screen.getByText(/wenig interesse oder freude/i)

      // Try to advance without answering
      fireEvent.keyDown(window, { key: 'ArrowRight' })

      // Should still be on first question
      expect(firstQuestion).toBeInTheDocument()
    })
  })

  describe('Enter Key Navigation', () => {
    it('should advance to next question with Enter when answered', async () => {
      render(<TriageFlow />)

      // Answer first question
      fireEvent.keyDown(window, { key: '0' })
      await waitFor(() => {}, { timeout: 500 })

      // Answer second question
      const button = screen.getByRole('button', { name: /überhaupt nicht/i })
      fireEvent.click(button)

      await waitFor(() => {}, { timeout: 200 })

      // Press Enter to advance
      fireEvent.keyDown(window, { key: 'Enter' })

      // Should advance to next question
      await waitFor(() => {}, { timeout: 200 })
    })

    it('should NOT advance with Enter if question not answered', () => {
      render(<TriageFlow />)

      const firstQuestion = screen.getByText(/wenig interesse oder freude/i)

      // Try Enter without answering
      fireEvent.keyDown(window, { key: 'Enter' })

      // Should still be on first question
      expect(firstQuestion).toBeInTheDocument()
    })
  })

  describe('Keyboard Hints', () => {
    it('should display keyboard navigation hint', () => {
      render(<TriageFlow />)

      expect(screen.getByText(/tipp: tastatur 0-3, ← →, enter/i)).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation on Summary Page', () => {
    it('should disable keyboard navigation on results page', async () => {
      render(<TriageFlow />)

      // Complete quiz quickly
      for (let i = 0; i < 9; i++) {
        fireEvent.keyDown(window, { key: '0' })
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      for (let i = 0; i < 7; i++) {
        fireEvent.keyDown(window, { key: '0' })
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Wait for transition
      await new Promise(resolve => setTimeout(resolve, 2500))

      // Wait for support preferences
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /1:1 psychotherapie/i })).toBeInTheDocument()
      }, { timeout: 5000 })

      // Select option and click weiter
      const therapyOption = screen.getByRole('button', { name: /1:1 psychotherapie/i })
      fireEvent.click(therapyOption)

      fireEvent.click(screen.getByRole('button', { name: /^weiter$/i }))

      // Wait for transition to availability section
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Wait for availability - check for availability button
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /online & abends/i })).toBeInTheDocument()
      }, { timeout: 5000 })

      // Select option and click weiter
      const onlineOption = screen.getByRole('button', { name: /online & abends/i })
      fireEvent.click(onlineOption)

      fireEvent.click(screen.getByRole('button', { name: /^weiter$/i }))

      // Wait for results
      await waitFor(() => {
        expect(screen.getByText(/deine ersteinschätzung/i)).toBeInTheDocument()
      }, { timeout: 10000 })

      // Try keyboard navigation - should not do anything
      fireEvent.keyDown(window, { key: '0' })
      fireEvent.keyDown(window, { key: 'ArrowLeft' })

      // Should still show results
      expect(screen.getByText(/deine ersteinschätzung/i)).toBeInTheDocument()
    }, 40000)
  })

  describe('Keyboard Navigation for Multiple Choice', () => {
    it('should NOT use number keys for support preferences section', async () => {
      render(<TriageFlow />)

      // Complete PHQ-9 and GAD-7
      for (let i = 0; i < 16; i++) {
        fireEvent.keyDown(window, { key: '0' })
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Wait for transition
      await new Promise(resolve => setTimeout(resolve, 2500))

      // Should be at support preferences now (multiple choice)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /1:1 psychotherapie/i })).toBeInTheDocument()
      }, { timeout: 5000 })

      // Number keys should NOT work for multiple choice
      fireEvent.keyDown(window, { key: '1' })

      // Should still be on support preferences
      expect(screen.getByRole('button', { name: /1:1 psychotherapie/i })).toBeInTheDocument()
    }, 40000)

    it('should use arrow keys for navigation even on multiple choice', async () => {
      render(<TriageFlow />)

      // Navigate to support section
      for (let i = 0; i < 16; i++) {
        fireEvent.keyDown(window, { key: '0' })
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Wait for transition
      await new Promise(resolve => setTimeout(resolve, 2500))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /1:1 psychotherapie/i })).toBeInTheDocument()
      }, { timeout: 5000 })

      // ArrowLeft should still work
      fireEvent.keyDown(window, { key: 'ArrowLeft' })

      // Should go back to previous section
      await waitFor(() => {
        expect(screen.queryByText(/gewünschte unterstützung/i)).not.toBeInTheDocument()
      }, { timeout: 3000 })
    }, 40000)
  })
})
