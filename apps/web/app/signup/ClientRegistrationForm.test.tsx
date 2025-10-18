'use client'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { ClientRegistrationForm } from './ClientRegistrationForm'

const pushMock = jest.fn()
const refreshMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}))

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}))

jest.mock('../../lib/analytics', () => ({
  track: jest.fn(),
}))

describe('ClientRegistrationForm', () => {
  const signInMock = require('next-auth/react').signIn as jest.Mock
  const originalFetch = global.fetch

  beforeEach(() => {
    pushMock.mockReset()
    refreshMock.mockReset()
    signInMock.mockReset()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  const mockFetchResponse = (payload: unknown, status = 200) =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: async () => payload,
    } as Response)

  it('registers a client and signs them in', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockFetchResponse({ success: true }, 201))
    signInMock.mockResolvedValueOnce({ ok: true })

    render(<ClientRegistrationForm />)

    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Nora' } })
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'Beispiel' } })
    fireEvent.change(screen.getByLabelText(/^E-Mail-Adresse$/i), {
      target: { value: 'nora@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Passwort$/i), {
      target: { value: 'Client123!' },
    })
    fireEvent.change(screen.getByLabelText(/Passwort bestätigen/i), {
      target: { value: 'Client123!' },
    })
    fireEvent.click(screen.getByLabelText(/Ich stimme den/i))

    fireEvent.click(screen.getByRole('button', { name: /Account erstellen/i }))

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'nora@example.com',
        password: 'Client123!',
      })
    })

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/clients/register',
      expect.objectContaining({
        method: 'POST',
      })
    )

    expect(await screen.findByText(/Registrierung erfolgreich/i)).toBeInTheDocument()
  })

  it('surfaces validation errors from the API', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce(
      mockFetchResponse(
        {
          success: false,
          message: 'Validierungsfehler',
          errors: [
            { path: ['email'], message: 'E-Mail bereits vergeben' },
            { path: ['acceptTerms'], message: 'Bitte bestätige die Nutzungsbedingungen' },
          ],
        },
        400
      )
    )

    render(<ClientRegistrationForm />)

    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Nora' } })
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'Beispiel' } })
    fireEvent.change(screen.getByLabelText(/^E-Mail-Adresse$/i), {
      target: { value: 'nora@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Passwort$/i), {
      target: { value: 'Client123!' },
    })
    fireEvent.change(screen.getByLabelText(/Passwort bestätigen/i), {
      target: { value: 'Client123!' },
    })
    fireEvent.click(screen.getByLabelText(/Ich stimme den/i))

    fireEvent.click(screen.getByRole('button', { name: /Account erstellen/i }))

    expect(
      await screen.findByText(/E-Mail bereits vergeben/i)
    ).toBeInTheDocument()
  })
})
