import { fireEvent, render, screen } from '@testing-library/react'

import { TriageDemo } from './TriageDemo'

describe('TriageDemo', () => {
  it('guides through the flow and shows a recommendation summary', async () => {
    render(<TriageDemo />)

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

    expect(await screen.findByText(/Deine Klarthera Empfehlung/i)).toBeInTheDocument()
    expect(screen.getByText(/Score/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Therapeut:innen ansehen/i })).toBeInTheDocument()
  })
})
