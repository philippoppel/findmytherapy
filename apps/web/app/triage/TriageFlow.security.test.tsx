/**
 * Security & Crisis Detection Tests for TriageFlow
 * Tests critical safety features like PHQ-9 Item 9 detection
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TriageFlow } from './TriageFlow'

// Mock analytics
jest.mock('../../lib/analytics', () => ({
  track: jest.fn(),
}))

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null, // Anonymous user by default
    status: 'unauthenticated',
  })),
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
  })),
}))

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('TriageFlow - Security & Crisis Features', () => {
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

  describe('PHQ-9 Item 9 - Suizid-Detektion', () => {
    it('should show crisis banner when PHQ-9 Item 9 is answered with ≥1', async () => {
      render(<TriageFlow />)

      // Navigate through first 8 PHQ-9 questions
      for (let i = 0; i < 8; i++) {
        const button = screen.getByRole('button', { name: /überhaupt nicht/i })
        fireEvent.click(button)
        // Wait for auto-advance (300ms) + animation buffer
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Wait for question 9 to appear
      await waitFor(() => {
        expect(screen.getByText(/gedanken, dass sie lieber tot wären/i)).toBeInTheDocument()
      }, { timeout: 3000 })

      // Answer Question 9 (Suizid) with 1 = "An einzelnen Tagen"
      const question9Answer = screen.getByRole('button', { name: /an einzelnen tagen/i })
      fireEvent.click(question9Answer)

      // Crisis banner should appear
      await waitFor(() => {
        expect(screen.getByText(/wichtig: sofortige unterstützung verfügbar/i)).toBeInTheDocument()
      }, { timeout: 3000 })

      // Check crisis hotline numbers are visible
      expect(screen.getByText(/telefonseelsorge 142/i)).toBeInTheDocument()
      expect(screen.getByText(/notruf 144/i)).toBeInTheDocument()
    }, 30000)

    it('should NOT show crisis banner when PHQ-9 Item 9 is answered with 0', async () => {
      render(<TriageFlow />)

      // Navigate through all 9 PHQ-9 questions with 0
      for (let i = 0; i < 9; i++) {
        const button = screen.getByRole('button', { name: /überhaupt nicht/i })
        fireEvent.click(button)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Wait to ensure we've progressed past PHQ-9
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Crisis banner should NOT appear
      expect(screen.queryByText(/wichtig: sofortige unterstützung verfügbar/i)).not.toBeInTheDocument()
    }, 30000)

    it('should keep crisis banner visible throughout the flow', async () => {
      render(<TriageFlow />)

      // Navigate to question 9 and trigger crisis
      for (let i = 0; i < 8; i++) {
        const button = screen.getByRole('button', { name: /überhaupt nicht/i })
        fireEvent.click(button)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Wait for question 9 to appear
      await waitFor(() => {
        expect(screen.getByText(/gedanken, dass sie lieber tot wären/i)).toBeInTheDocument()
      }, { timeout: 3000 })

      const question9Answer = screen.getByRole('button', { name: /an einzelnen tagen/i })
      fireEvent.click(question9Answer)

      // Wait for banner to appear
      await waitFor(() => {
        expect(screen.getByText(/wichtig: sofortige unterstützung verfügbar/i)).toBeInTheDocument()
      }, { timeout: 3000 })

      // Continue to GAD-7 section - wait for auto-advance
      await new Promise(resolve => setTimeout(resolve, 2500))

      // Crisis banner should persist
      expect(screen.getByText(/wichtig: sofortige unterstützung verfügbar/i)).toBeInTheDocument()
    }, 30000)

    it('should have clickable crisis hotline links', async () => {
      render(<TriageFlow />)

      // Trigger crisis
      for (let i = 0; i < 8; i++) {
        const button = screen.getByRole('button', { name: /überhaupt nicht/i })
        fireEvent.click(button)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Wait for question 9
      await waitFor(() => {
        expect(screen.getByText(/gedanken, dass sie lieber tot wären/i)).toBeInTheDocument()
      }, { timeout: 3000 })

      const question9Answer = screen.getByRole('button', { name: /beinahe jeden tag/i })
      fireEvent.click(question9Answer)

      // Wait for banner with links to appear
      await waitFor(() => {
        const telefonseelsorgeLink = screen.getByRole('link', { name: /telefonseelsorge 142/i })
        expect(telefonseelsorgeLink).toHaveAttribute('href', 'tel:142')

        const notrufLink = screen.getByRole('link', { name: /notruf 144/i })
        expect(notrufLink).toHaveAttribute('href', 'tel:144')
      }, { timeout: 3000 })
    }, 30000)
  })

  describe('Disclaimer-System', () => {
    it('should show disclaimer at the start of the quiz', () => {
      render(<TriageFlow />)

      // Disclaimer should be visible on first question
      expect(screen.getByText(/wichtiger hinweis/i)).toBeInTheDocument()
      expect(screen.getByText(/keine medizinische diagnose/i)).toBeInTheDocument()
    })

    it('should hide disclaimer after first question', async () => {
      render(<TriageFlow />)

      // Answer first question
      const button = screen.getByRole('button', { name: /überhaupt nicht/i })
      fireEvent.click(button)

      await waitFor(() => {
        // Disclaimer should no longer be visible
        expect(screen.queryByText(/wichtiger hinweis/i)).not.toBeInTheDocument()
      })
    })

    it('should show disclaimer on results page', async () => {
      render(<TriageFlow />)

      // Answer all PHQ-9 questions (9 questions)
      for (let i = 0; i < 9; i++) {
        const button = screen.getByRole('button', { name: /überhaupt nicht/i })
        fireEvent.click(button)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Answer all GAD-7 questions (7 questions)
      for (let i = 0; i < 7; i++) {
        const button = screen.getByRole('button', { name: /überhaupt nicht/i })
        fireEvent.click(button)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Wait for transition
      await new Promise(resolve => setTimeout(resolve, 2500))

      // Answer support preferences - select at least one option
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /1:1 psychotherapie/i })).toBeInTheDocument()
      }, { timeout: 5000 })

      // Select a support option
      const therapyOption = screen.getByRole('button', { name: /1:1 psychotherapie/i })
      fireEvent.click(therapyOption)

      // Click weiter
      const supportButton = screen.getByRole('button', { name: /^weiter$/i })
      fireEvent.click(supportButton)

      // Wait for transition to availability section
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Wait for availability section - check for availability button
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /online & abends/i })).toBeInTheDocument()
      }, { timeout: 5000 })

      // Select an availability option
      const onlineOption = screen.getByRole('button', { name: /online & abends/i })
      fireEvent.click(onlineOption)

      // Click weiter
      const availButton = screen.getByRole('button', { name: /^weiter$/i })
      fireEvent.click(availButton)

      // Should show results with disclaimer
      await waitFor(() => {
        expect(screen.getByText(/diese ersteinschätzung ist keine medizinische diagnose/i)).toBeInTheDocument()
      }, { timeout: 10000 })
    }, 50000)
  })

  describe('Progress Tracking', () => {
    it('should show progress percentage', () => {
      render(<TriageFlow />)

      // Initial progress should be 0%
      expect(screen.getByText(/fortschritt: 0%/i)).toBeInTheDocument()
    })

    it('should update progress after answering questions', async () => {
      render(<TriageFlow />)

      // Answer first question
      const button = screen.getByRole('button', { name: /überhaupt nicht/i })
      fireEvent.click(button)

      await waitFor(() => {
        // Progress should increase
        expect(screen.queryByText(/fortschritt: 0%/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Navigation', () => {
    it('should allow going back to previous question', async () => {
      render(<TriageFlow />)

      // Answer first question
      const firstAnswer = screen.getByRole('button', { name: /überhaupt nicht/i })
      fireEvent.click(firstAnswer)

      await waitFor(() => {}, { timeout: 500 })

      // Go back
      const backButton = screen.getByRole('button', { name: /zurück/i })
      fireEvent.click(backButton)

      // Should be back at first question
      await waitFor(() => {
        expect(screen.getByText(/wenig interesse oder freude an ihren tätigkeiten/i)).toBeInTheDocument()
      })
    })

    it('should disable back button on first question', () => {
      render(<TriageFlow />)

      const backButton = screen.getByRole('button', { name: /zurück/i })
      expect(backButton).toBeDisabled()
    })
  })
})
