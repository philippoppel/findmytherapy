import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { TriageFlow } from './TriageFlow'

jest.mock('../../lib/analytics', () => ({
  track: jest.fn(),
}))

describe('TriageFlow', () => {
  const fetchMock = jest.fn()
  const mockRecommendations = {
    therapists: [
      {
        id: 'dr.mueller@example.com',
        name: 'Dr.in Lena Huber',
        title: 'Klinische Psychologin',
        focus: ['Depression', 'Burnout'],
        availability: 'Freie Slots ab 12. Mai',
        location: 'Wien - Präsenz & Online',
        rating: 4.9,
        reviews: 54,
        status: 'VERIFIED',
        formatTags: ['online', 'praesenz'],
        highlights: ['Online verfügbar', 'Empfohlen für 1:1 Begleitung'],
      },
    ],
    courses: [
      {
        slug: 'stabil-durch-den-alltag',
        title: 'Stabil durch den Alltag',
        shortDescription: '4 Wochen Struktur & Atemübungen',
        focus: 'Stress & Dysregulation',
        duration: '4 Wochen · 3 Module · 20 Min/Tag',
        format: 'On-Demand Videos, Audioübungen, Check-ins',
        outcomes: ['Geführte Atemübungen', 'Micro-Interventionen'],
        highlights: ['Selbstlern-Inhalte zur Begleitung'],
      },
    ],
  }

  const mockFetchResponse = (payload: unknown, status = 201) =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: async () => payload,
    } as unknown as Response)

  beforeEach(() => {
    fetchMock.mockReset()
    ;(globalThis as typeof globalThis & { fetch?: typeof fetch }).fetch = fetchMock as unknown as typeof fetch
    fetchMock.mockResolvedValue(mockFetchResponse({ success: true, recommendations: mockRecommendations }))
  })

  afterAll(() => {
    // @ts-expect-error cleanup test override
    delete globalThis.fetch
  })

  it('guides through the flow and shows a recommendation summary', async () => {
    render(<TriageFlow />)

    // Should show disclaimer first
    expect(screen.getByText(/Wichtiger Hinweis/i)).toBeInTheDocument()

    // First PHQ-9 question
    expect(screen.getByText(/Wenig Interesse oder Freude/i)).toBeInTheDocument()

    // Answer all 9 PHQ-9 questions with low scores (0 = Überhaupt nicht)
    for (let i = 0; i < 9; i++) {
      const button = screen.getByRole('button', { name: /Überhaupt nicht/i })
      fireEvent.click(button)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Should now be at GAD-7 section
    await waitFor(() => {
      expect(screen.getByText(/Nervosität, Ängstlichkeit oder Anspannung/i)).toBeInTheDocument()
    }, { timeout: 5000 })

    // Answer all 7 GAD-7 questions with low scores
    for (let i = 0; i < 7; i++) {
      const button = screen.getByRole('button', { name: /Überhaupt nicht/i })
      fireEvent.click(button)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Wait for transition to support preferences
    await new Promise(resolve => setTimeout(resolve, 2500))

    // Should now be at support preferences - check for the buttons
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /1:1 Psychotherapie/i })).toBeInTheDocument()
    }, { timeout: 5000 })

    fireEvent.click(screen.getByRole('button', { name: /1:1 Psychotherapie/i }))
    fireEvent.click(screen.getByRole('button', { name: /Digitale Programme & Kurse/i }))
    fireEvent.click(screen.getByRole('button', { name: /^Weiter$/i }))

    // Wait for transition to availability section
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Should now be at availability preferences - check for availability button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Online & Abends/i })).toBeInTheDocument()
    }, { timeout: 5000 })

    fireEvent.click(screen.getByRole('button', { name: /Online & Abends/i }))
    fireEvent.click(screen.getByRole('button', { name: /Hybrid/i }))
    fireEvent.click(screen.getByRole('button', { name: /^Weiter$/i }))

    // Should show results
    await waitFor(() => {
      expect(screen.getByText(/Deine Ersteinschätzung/i)).toBeInTheDocument()
    }, { timeout: 5000 })

    // Wait for recommendations to load
    await waitFor(() => {
      expect(screen.getByText(/Dr\.in Lena Huber/i)).toBeInTheDocument()
    }, { timeout: 5000 })

    expect(screen.getByText(/Stabil durch den Alltag/i)).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/triage',
      expect.objectContaining({
        method: 'POST',
      })
    )
  }, 30000)
})
