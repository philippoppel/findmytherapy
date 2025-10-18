'use client'

import { act, fireEvent, render, screen } from '@testing-library/react'

import { ContactForm } from './ContactForm'

describe('ContactForm', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'ok' }),
    }) as unknown as typeof fetch
  })

  afterEach(() => {
    jest.resetAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).fetch
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('submits the form and shows a confirmation message', async () => {
    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Alex Muster' } })
    fireEvent.change(screen.getByLabelText(/E-Mail/i), { target: { value: 'alex@example.com' } })
    fireEvent.change(screen.getByLabelText(/Telefon/i), { target: { value: '+43 660 1234567' } })
    fireEvent.click(screen.getByRole('button', { name: /Abends/i }))
    fireEvent.click(screen.getByRole('button', { name: /Therapeut:innen-Matching/i }))
    fireEvent.change(screen.getByLabelText(/Nachricht oder Fragen/i), {
      target: { value: 'Bitte Termin für eine Live-Session vereinbaren.' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Abschicken/i }))

    await act(async () => {
      jest.runAllTimers()
    })

    expect(
      await screen.findByText(/Vielen Dank! Deine Nachricht ist eingegangen./i),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/Name/i)).toHaveValue('')
    expect(screen.getByLabelText(/E-Mail/i)).toHaveValue('')
    expect(screen.getByLabelText(/Telefon/i)).toHaveValue('')
  })
})
