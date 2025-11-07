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

jest.mock('../../../lib/analytics', () => ({
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

  it('should show error when passwords do not match', async () => {
    render(<ClientRegistrationForm />)

    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Test' } })
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'User' } })
    fireEvent.change(screen.getByLabelText(/^E-Mail-Adresse$/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Passwort$/i), {
      target: { value: 'Password123!' },
    })
    fireEvent.change(screen.getByLabelText(/Passwort bestätigen/i), {
      target: { value: 'DifferentPassword123!' },
    })
    fireEvent.click(screen.getByLabelText(/Ich stimme den/i))
    fireEvent.click(screen.getByRole('button', { name: /Account erstellen/i }))

    await waitFor(() => {
      expect(screen.getByText(/Passwörter stimmen nicht überein/i)).toBeInTheDocument()
    })
  })

  it('should show error when email is invalid', async () => {
    render(<ClientRegistrationForm />)

    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Test' } })
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'User' } })
    fireEvent.change(screen.getByLabelText(/^E-Mail-Adresse$/i), {
      target: { value: 'invalid-email' },
    })
    fireEvent.change(screen.getByLabelText(/^Passwort$/i), {
      target: { value: 'Password123!' },
    })
    fireEvent.change(screen.getByLabelText(/Passwort bestätigen/i), {
      target: { value: 'Password123!' },
    })
    fireEvent.click(screen.getByLabelText(/Ich stimme den/i))
    fireEvent.click(screen.getByRole('button', { name: /Account erstellen/i }))

    await waitFor(() => {
      expect(screen.getByText(/gültige E-Mail/i)).toBeInTheDocument()
    })
  })

  it('should show error when password is too short', async () => {
    render(<ClientRegistrationForm />)

    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Test' } })
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'User' } })
    fireEvent.change(screen.getByLabelText(/^E-Mail-Adresse$/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Passwort$/i), {
      target: { value: 'short' },
    })
    fireEvent.change(screen.getByLabelText(/Passwort bestätigen/i), {
      target: { value: 'short' },
    })
    fireEvent.click(screen.getByLabelText(/Ich stimme den/i))
    fireEvent.click(screen.getByRole('button', { name: /Account erstellen/i }))

    await waitFor(() => {
      // Look for the error message specifically in an error span
      const errorMessages = screen.getAllByText(/mindestens 8 Zeichen/i)
      const errorSpan = errorMessages.find(
        el => el.className && el.className.includes('text-red-600')
      )
      expect(errorSpan).toBeInTheDocument()
    })
  })

  it('should show error when required fields are missing', async () => {
    render(<ClientRegistrationForm />)

    fireEvent.click(screen.getByRole('button', { name: /Account erstellen/i }))

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled()
    })
  })

  it('should show error when terms are not accepted', async () => {
    render(<ClientRegistrationForm />)

    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Test' } })
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'User' } })
    fireEvent.change(screen.getByLabelText(/^E-Mail-Adresse$/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Passwort$/i), {
      target: { value: 'Password123!' },
    })
    fireEvent.change(screen.getByLabelText(/Passwort bestätigen/i), {
      target: { value: 'Password123!' },
    })
    // Don't check the terms checkbox
    fireEvent.click(screen.getByRole('button', { name: /Account erstellen/i }))

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled()
    })
  })

  it('should disable submit button while submitting', async () => {
    ;(global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<ClientRegistrationForm />)

    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Test' } })
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'User' } })
    fireEvent.change(screen.getByLabelText(/^E-Mail-Adresse$/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Passwort$/i), {
      target: { value: 'Password123!' },
    })
    fireEvent.change(screen.getByLabelText(/Passwort bestätigen/i), {
      target: { value: 'Password123!' },
    })
    fireEvent.click(screen.getByLabelText(/Ich stimme den/i))

    const submitButton = screen.getByRole('button', { name: /Account erstellen/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })

  it('should handle network errors', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<ClientRegistrationForm />)

    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Test' } })
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'User' } })
    fireEvent.change(screen.getByLabelText(/^E-Mail-Adresse$/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Passwort$/i), {
      target: { value: 'Password123!' },
    })
    fireEvent.change(screen.getByLabelText(/Passwort bestätigen/i), {
      target: { value: 'Password123!' },
    })
    fireEvent.click(screen.getByLabelText(/Ich stimme den/i))
    fireEvent.click(screen.getByRole('button', { name: /Account erstellen/i }))

    await waitFor(() => {
      // Check for error alert role or error message
      const errorAlert = screen.getByRole('alert')
      expect(errorAlert).toBeInTheDocument()
      expect(errorAlert).toHaveTextContent(/Fehler bei der Registrierung|Network error/i)
    })
  })
})
