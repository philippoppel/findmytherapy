'use client'

import { fireEvent, render, screen } from '@testing-library/react'

import { RegistrationForm } from './RegistrationForm'

jest.mock('../../lib/analytics', () => ({
  track: jest.fn(),
}))

describe('RegistrationForm', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    ;(globalThis as typeof globalThis & { fetch?: typeof fetch }).fetch = fetchMock as unknown as typeof fetch
  })

  afterAll(() => {
    // @ts-expect-error cleanup test override
    delete globalThis.fetch
  })

  const mockFetchResponse = (payload: unknown, status = 200) =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: async () => payload,
    } as unknown as Response)

  it('registers a therapist and shows review confirmation', async () => {
    fetchMock.mockResolvedValueOnce(mockFetchResponse({ success: true }, 201))

    render(<RegistrationForm />)

    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Lena' } })
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'Huber' } })
    fireEvent.change(screen.getByLabelText(/^E-Mail$/i), { target: { value: 'lena@example.com' } })
    fireEvent.change(screen.getByLabelText(/Passwort$/i), { target: { value: 'Therapie123!' } })
    fireEvent.change(screen.getByLabelText(/Passwort bestätigen/i), { target: { value: 'Therapie123!' } })
    fireEvent.change(screen.getByLabelText(/Praxisstandort/i), { target: { value: 'Wien' } })

    fireEvent.click(screen.getByRole('button', { name: /Depression & Burnout/i }))
    fireEvent.click(screen.getByRole('button', { name: /Online/i }))
    fireEvent.click(screen.getByRole('button', { name: /Registrierung abschließen/i }))

    expect(await screen.findByText(/Danke für deine Registrierung/i)).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/register',
      expect.objectContaining({
        method: 'POST',
      })
    )

    const [, init] = fetchMock.mock.calls[0]
    const body = JSON.parse((init as RequestInit).body as string)
    expect(body.specialties).toEqual(['Depression & Burnout'])
    expect(body.modalities).toEqual(['ONLINE'])
    expect(screen.getByLabelText(/Vorname/i)).toHaveValue('')
  })

  it('submits organisation demo request', async () => {
    fetchMock.mockResolvedValueOnce(mockFetchResponse({ success: true }, 201))

    render(<RegistrationForm />)

    fireEvent.change(screen.getByLabelText(/Ich interessiere mich als/i), { target: { value: 'ORGANISATION' } })
    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Alex' } })
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'Muster' } })
    fireEvent.change(screen.getByLabelText(/^E-Mail$/i), { target: { value: 'alex@example.com' } })
    fireEvent.change(screen.getByLabelText(/Unternehmen \/ Organisation/i), {
      target: { value: 'FindMyTherapy Health GmbH' },
    })
    fireEvent.change(screen.getByLabelText(/Worauf sollen wir uns vorbereiten/i), {
      target: { value: 'Bitte Fokus auf BGM.' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Zugang anfragen/i }))

    expect(
      await screen.findByText(/Vielen Dank! Deine Anfrage ist bei uns angekommen./i)
    ).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/access-request',
      expect.objectContaining({
        method: 'POST',
      })
    )
  })
})
