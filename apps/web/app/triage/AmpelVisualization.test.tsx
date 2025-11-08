/**
 * Ampel Visualization & Scoring Tests
 * Tests interactive ampel details, scoring transparency, and scientific benchmarks
 */

import { render, screen, fireEvent, within } from '@testing-library/react'
import { AmpelVisualization } from './AmpelVisualization'

describe('AmpelVisualization', () => {
  const defaultProps = {
    color: 'green' as const,
    phq9Score: 3,
    gad7Score: 2,
    phq9Severity: 'minimal' as const,
    gad7Severity: 'minimal' as const,
  }

  it('should render ampel with correct color', () => {
    render(<AmpelVisualization {...defaultProps} />)

    expect(screen.getByText(/grün – geringe belastung/i)).toBeInTheDocument()
  })

  it('should display PHQ-9 and GAD-7 scores', () => {
    render(<AmpelVisualization {...defaultProps} />)

    expect(screen.getByText('3')).toBeInTheDocument() // PHQ-9 score
    expect(screen.getByText('2')).toBeInTheDocument() // GAD-7 score
    expect(screen.getAllByText(/von 27/i).length).toBeGreaterThan(0) // PHQ-9 max
    expect(screen.getAllByText(/von 21/i).length).toBeGreaterThan(0) // GAD-7 max
  })

  describe('Interactive Ampel Details', () => {
    it('should show details button', () => {
      render(<AmpelVisualization {...defaultProps} />)

      const detailsButton = screen.getByRole('button', { name: /was bedeutet das für mich\?/i })
      expect(detailsButton).toBeInTheDocument()
    })

    it('should expand details when button is clicked', () => {
      render(<AmpelVisualization {...defaultProps} />)

      const detailsButton = screen.getByRole('button', { name: /was bedeutet das für mich\?/i })
      fireEvent.click(detailsButton)

      expect(screen.getByText(/was bedeutet diese einschätzung\?/i)).toBeInTheDocument()
      expect(screen.getByText(/empfohlene nächste schritte/i)).toBeInTheDocument()
      expect(screen.getByText(/verfügbare unterstützung/i)).toBeInTheDocument()
    })

    it('should show correct details for green ampel', () => {
      render(<AmpelVisualization {...defaultProps} color="green" />)

      const detailsButton = screen.getByRole('button', { name: /was bedeutet das für mich\?/i })
      fireEvent.click(detailsButton)

      expect(screen.getByText(/minimale bis keine symptome/i)).toBeInTheDocument()
      expect(screen.getAllByText(/präventive maßnahmen/i).length).toBeGreaterThan(0)
    })

    it('should show correct details for yellow ampel', () => {
      render(
        <AmpelVisualization
          {...defaultProps}
          color="yellow"
          phq9Score={12}
          gad7Score={10}
          phq9Severity="moderate"
          gad7Severity="moderate"
        />
      )

      const detailsButton = screen.getByRole('button', { name: /was bedeutet das für mich\?/i })
      fireEvent.click(detailsButton)

      expect(screen.getAllByText(/mittelschwere symptome/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/therapeutische unterstützung/i).length).toBeGreaterThan(0)
    })

    it('should show correct details for red ampel with urgent steps', () => {
      render(
        <AmpelVisualization
          {...defaultProps}
          color="red"
          phq9Score={22}
          gad7Score={18}
          phq9Severity="severe"
          gad7Severity="severe"
        />
      )

      const detailsButton = screen.getByRole('button', { name: /was bedeutet das für mich\?/i })
      fireEvent.click(detailsButton)

      expect(screen.getAllByText(/schwere symptome/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/sofort/i).length).toBeGreaterThan(0)
      expect(screen.getByText(/notruf 144/i)).toBeInTheDocument()
    })

    it('should collapse details when button is clicked again', () => {
      render(<AmpelVisualization {...defaultProps} />)

      const detailsButton = screen.getByRole('button', { name: /was bedeutet das für mich\?/i })

      // Expand
      fireEvent.click(detailsButton)
      expect(screen.getByText(/was bedeutet diese einschätzung\?/i)).toBeInTheDocument()

      // Collapse
      const hideButton = screen.getByRole('button', { name: /details ausblenden/i })
      fireEvent.click(hideButton)

      expect(screen.queryByText(/was bedeutet diese einschätzung\?/i)).not.toBeInTheDocument()
    })
  })

  describe('Scientific Benchmarks Comparison', () => {
    it('should show comparison with average values', () => {
      render(<AmpelVisualization {...defaultProps} />)

      expect(screen.getByText(/vergleich mit durchschnittswerten/i)).toBeInTheDocument()
      expect(screen.getAllByText(/allgemeinbevölkerung/i).length).toBeGreaterThan(0)
    })

    it('should display benchmark markers', () => {
      render(<AmpelVisualization {...defaultProps} phq9Score={8} gad7Score={6} />)

      // Check for average symbol ⌀
      const avgSymbols = screen.getAllByText(/⌀/i)
      expect(avgSymbols.length).toBeGreaterThan(0)
    })

    it('should show progress bars for PHQ-9 and GAD-7', () => {
      render(<AmpelVisualization {...defaultProps} />)

      expect(screen.getByText(/phq-9 depression/i)).toBeInTheDocument()
      expect(screen.getByText(/gad-7 angst/i)).toBeInTheDocument()
    })
  })

  describe('Scoring Explainer', () => {
    it('should render scoring explainer component', () => {
      render(<AmpelVisualization {...defaultProps} />)

      expect(screen.getByText(/wissenschaftliche grundlagen/i)).toBeInTheDocument()
    })

    it('should expand scoring explainer when clicked', () => {
      render(<AmpelVisualization {...defaultProps} />)

      const explainerButton = screen.getByRole('button', { name: /wissenschaftliche grundlagen/i })
      fireEvent.click(explainerButton)

      expect(screen.getByText(/depressions-screening \(phq-9\)/i)).toBeInTheDocument()
      expect(screen.getByText(/angst-screening \(gad-7\)/i)).toBeInTheDocument()
    })
  })

  describe('Ampel Colors', () => {
    it('should apply correct styling for green ampel', () => {
      const { container } = render(<AmpelVisualization {...defaultProps} color="green" />)

      expect(screen.getByText(/grün – geringe belastung/i)).toBeInTheDocument()
      expect(container.querySelector('.border-emerald-300')).toBeInTheDocument()
    })

    it('should apply correct styling for yellow ampel', () => {
      const { container } = render(
        <AmpelVisualization {...defaultProps} color="yellow" phq9Score={12} gad7Score={10} />
      )

      expect(screen.getByText(/gelb – mittlere belastung/i)).toBeInTheDocument()
      expect(container.querySelector('.border-amber-300')).toBeInTheDocument()
    })

    it('should apply correct styling for red ampel', () => {
      const { container } = render(
        <AmpelVisualization {...defaultProps} color="red" phq9Score={22} gad7Score={18} />
      )

      expect(screen.getByText(/rot – hohe belastung/i)).toBeInTheDocument()
      expect(container.querySelector('.border-red-300')).toBeInTheDocument()
    })
  })

  describe('Severity Labels', () => {
    it('should display severity levels', () => {
      render(<AmpelVisualization {...defaultProps} />)

      expect(screen.getAllByText(/minimal/i).length).toBeGreaterThan(0)
    })

    it('should show different severities for PHQ-9 and GAD-7', () => {
      render(
        <AmpelVisualization
          {...defaultProps}
          phq9Severity="moderate"
          gad7Severity="mild"
        />
      )

      expect(screen.getByText(/moderate/i)).toBeInTheDocument()
      expect(screen.getByText(/mild/i)).toBeInTheDocument()
    })
  })
})
