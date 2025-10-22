import { fireEvent, render, screen } from '@testing-library/react'

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

    expect(screen.getByText(/Stimmung & Antrieb/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Mehr als die Hälfte der Tage/i }))
    expect(await screen.findByText(/Energie & Fokus/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^Stark/i }))
    expect(await screen.findByText(/Innere Anspannung/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^Häufig/i }))
    expect(await screen.findByText(/Was hilft dir gerade am meisten/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /1:1 Therapie oder Beratung/i }))
    fireEvent.click(screen.getByRole('button', { name: /Digitale Programme & Übungen/i }))
    fireEvent.click(screen.getByRole('button', { name: /^Weiter$/i }))

    expect(await screen.findByText(/Wie flexibel bist du terminlich/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Online & Abends/i }))
    fireEvent.click(screen.getByRole('button', { name: /Hybrid/i }))
    fireEvent.click(screen.getByRole('button', { name: /^Weiter$/i }))

    expect(await screen.findByText(/Deine FindMyTherapy Empfehlung/i)).toBeInTheDocument()
    expect(screen.getByText(/Score/i)).toBeInTheDocument()
    expect(await screen.findByText(/Empfohlene Pilot-Therapeut:innen/i)).toBeInTheDocument()
    expect(screen.getByText(/Dr\.in Lena Huber/i)).toBeInTheDocument()
    expect(screen.getByText(/Stabil durch den Alltag/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Therapeut:innen ansehen/i })).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/triage',
      expect.objectContaining({
        method: 'POST',
      })
    )
  })
})
