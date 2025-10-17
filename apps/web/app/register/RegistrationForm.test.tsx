'use client'

import { act, fireEvent, render, screen } from '@testing-library/react'

import { RegistrationForm } from './RegistrationForm'

describe('RegistrationForm', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('submits demo request and shows confirmation', async () => {
    render(<RegistrationForm />)

    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Alex' } })
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'Muster' } })
    fireEvent.change(screen.getByLabelText(/^E-Mail$/i), { target: { value: 'alex@example.com' } })
    fireEvent.change(screen.getByLabelText(/Ich interessiere mich als/i), { target: { value: 'ORGANISATION' } })
    fireEvent.change(screen.getByLabelText(/Unternehmen \/ Organisation/i), { target: { value: 'Klarthera Demo GmbH' } })
    fireEvent.change(screen.getByLabelText(/Worauf sollen wir uns vorbereiten/i), {
      target: { value: 'Bitte Schwerpunkt auf BGM und Reporting legen.' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Demo anfragen/i }))

    await act(async () => {
      jest.runAllTimers()
    })

    expect(
      await screen.findByText(/Vielen Dank! Deine Anfrage ist bei uns angekommen./i),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/Vorname/i)).toHaveValue('')
  })
})
