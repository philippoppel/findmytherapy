/**
 * TherapistCard Tests
 * Tests expandable therapist details and selection functionality
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { TherapistCard } from './TherapistCard'

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

const mockTherapist = {
  id: 'therapist-1',
  name: 'Dr. Sarah Müller',
  title: 'Psychologische Psychotherapeutin',
  headline: 'Spezialisiert auf Angststörungen und Depression',
  focus: ['Angststörungen', 'Depression', 'Trauma', 'Burnout'],
  availability: 'Termine in 2 Wochen',
  location: 'Wien',
  rating: 4.8,
  reviews: 24,
  status: 'VERIFIED',
  formatTags: ['online', 'hybrid'] as Array<'online' | 'praesenz' | 'hybrid'>,
  highlights: ['Online verfügbar', 'Hybrid angeboten', 'Erfahrung mit erhöhtem Unterstützungsbedarf'],
  acceptingClients: true,
  services: ['Einzeltherapie', 'Gruppentherapie', 'EMDR'],
  responseTime: 'Antwort innerhalb 24h',
  yearsExperience: 12,
  languages: ['Deutsch', 'Englisch', 'Französisch'],
  image: '/images/therapist-1.jpg',
}

describe('TherapistCard', () => {
  it('should render therapist basic information', () => {
    render(<TherapistCard therapist={mockTherapist} index={0} />)

    expect(screen.getByText('Dr. Sarah Müller')).toBeInTheDocument()
    expect(screen.getByText('Psychologische Psychotherapeutin')).toBeInTheDocument()
    expect(screen.getByText(/spezialisiert auf angststörungen/i)).toBeInTheDocument()
  })

  it('should display rating with stars', () => {
    render(<TherapistCard therapist={mockTherapist} index={0} />)

    expect(screen.getByText('4.8')).toBeInTheDocument()
    expect(screen.getByText('(24)')).toBeInTheDocument()
  })

  it('should show top recommendation badge for index 0', () => {
    render(<TherapistCard therapist={mockTherapist} index={0} />)

    expect(screen.getByText(/top-empfehlung/i)).toBeInTheDocument()
  })

  it('should NOT show top recommendation badge for index > 0', () => {
    render(<TherapistCard therapist={mockTherapist} index={1} />)

    expect(screen.queryByText(/top-empfehlung/i)).not.toBeInTheDocument()
  })

  it('should display first 3 focus areas', () => {
    render(<TherapistCard therapist={mockTherapist} index={0} />)

    expect(screen.getByText(/angststörungen • depression • trauma/i)).toBeInTheDocument()
  })

  it('should display location', () => {
    render(<TherapistCard therapist={mockTherapist} index={0} />)

    expect(screen.getByText(/wien/i)).toBeInTheDocument()
  })

  it('should show first 2 services', () => {
    render(<TherapistCard therapist={mockTherapist} index={0} />)

    expect(screen.getByText('Einzeltherapie')).toBeInTheDocument()
    expect(screen.getByText('Gruppentherapie')).toBeInTheDocument()
    expect(screen.queryByText('EMDR')).not.toBeInTheDocument() // Only first 2
  })

  it('should display availability and response time', () => {
    render(<TherapistCard therapist={mockTherapist} index={0} />)

    expect(screen.getByText(/termine in 2 wochen/i)).toBeInTheDocument()
    expect(screen.getByText(/antwort innerhalb 24h/i)).toBeInTheDocument()
  })

  describe('Expandable Details', () => {
    it('should show "Alle Details anzeigen" button', () => {
      render(<TherapistCard therapist={mockTherapist} index={0} />)

      expect(screen.getByRole('button', { name: /alle details anzeigen/i })).toBeInTheDocument()
    })

    it('should expand details when button is clicked', () => {
      render(<TherapistCard therapist={mockTherapist} index={0} />)

      const expandButton = screen.getByRole('button', { name: /alle details anzeigen/i })
      fireEvent.click(expandButton)

      expect(screen.getByText(/alle schwerpunkte/i)).toBeInTheDocument()
      expect(screen.getByText(/sprachen/i)).toBeInTheDocument()
      expect(screen.getByText(/berufserfahrung/i)).toBeInTheDocument()
    })

    it('should show all focus areas when expanded', () => {
      render(<TherapistCard therapist={mockTherapist} index={0} />)

      const expandButton = screen.getByRole('button', { name: /alle details anzeigen/i })
      fireEvent.click(expandButton)

      expect(screen.getByText('Angststörungen')).toBeInTheDocument()
      expect(screen.getByText('Depression')).toBeInTheDocument()
      expect(screen.getByText('Trauma')).toBeInTheDocument()
      expect(screen.getByText('Burnout')).toBeInTheDocument()
    })

    it('should show languages when expanded', () => {
      render(<TherapistCard therapist={mockTherapist} index={0} />)

      const expandButton = screen.getByRole('button', { name: /alle details anzeigen/i })
      fireEvent.click(expandButton)

      expect(screen.getByText(/deutsch, englisch, französisch/i)).toBeInTheDocument()
    })

    it('should show years of experience when expanded', () => {
      render(<TherapistCard therapist={mockTherapist} index={0} />)

      const expandButton = screen.getByRole('button', { name: /alle details anzeigen/i })
      fireEvent.click(expandButton)

      expect(screen.getByText(/12 jahre praktische erfahrung/i)).toBeInTheDocument()
    })

    it('should show all services when expanded', () => {
      render(<TherapistCard therapist={mockTherapist} index={0} />)

      const expandButton = screen.getByRole('button', { name: /alle details anzeigen/i })
      fireEvent.click(expandButton)

      expect(screen.getByText('EMDR')).toBeInTheDocument() // Now visible
    })

    it('should show format tags when expanded', () => {
      render(<TherapistCard therapist={mockTherapist} index={0} />)

      const expandButton = screen.getByRole('button', { name: /alle details anzeigen/i })
      fireEvent.click(expandButton)

      expect(screen.getByText('Online')).toBeInTheDocument()
      expect(screen.getByText('Hybrid')).toBeInTheDocument()
    })

    it('should show accepting clients status when expanded', () => {
      render(<TherapistCard therapist={mockTherapist} index={0} />)

      const expandButton = screen.getByRole('button', { name: /alle details anzeigen/i })
      fireEvent.click(expandButton)

      expect(screen.getByText(/nimmt derzeit neue klient:innen an/i)).toBeInTheDocument()
    })

    it('should collapse details when button is clicked again', () => {
      render(<TherapistCard therapist={mockTherapist} index={0} />)

      const expandButton = screen.getByRole('button', { name: /alle details anzeigen/i })
      fireEvent.click(expandButton)

      expect(screen.getByText(/alle schwerpunkte/i)).toBeInTheDocument()

      const collapseButton = screen.getByRole('button', { name: /weniger anzeigen/i })
      fireEvent.click(collapseButton)

      expect(screen.queryByText(/alle schwerpunkte/i)).not.toBeInTheDocument()
    })
  })

  describe('Selection Functionality', () => {
    it('should render selection checkbox when onSelect is provided', () => {
      const onSelect = jest.fn()
      render(<TherapistCard therapist={mockTherapist} index={0} onSelect={onSelect} />)

      const checkbox = screen.getByRole('button', { name: '' }) // Checkbox button
      expect(checkbox).toBeInTheDocument()
    })

    it('should call onSelect when checkbox is clicked', () => {
      const onSelect = jest.fn()
      render(<TherapistCard therapist={mockTherapist} index={0} onSelect={onSelect} />)

      const checkboxes = screen.getAllByRole('button')
      const selectionCheckbox = checkboxes.find(btn => btn.classList.contains('h-6'))

      fireEvent.click(selectionCheckbox!)

      expect(onSelect).toHaveBeenCalledWith('therapist-1')
    })

    it('should show selected state when isSelected is true', () => {
      const onSelect = jest.fn()
      const { container } = render(
        <TherapistCard therapist={mockTherapist} index={0} isSelected={true} onSelect={onSelect} />
      )

      expect(container.querySelector('.ring-blue-500')).toBeInTheDocument()
    })

    it('should NOT render selection checkbox when onSelect is not provided', () => {
      render(<TherapistCard therapist={mockTherapist} index={0} />)

      const checkboxes = screen.queryAllByRole('button').filter(btn => btn.classList.contains('h-6'))
      expect(checkboxes).toHaveLength(0)
    })
  })

  describe('Profile Link', () => {
    it('should show "Profil ansehen" link when not embedded', () => {
      render(<TherapistCard therapist={mockTherapist} index={0} embedded={false} />)

      const profileLink = screen.getByRole('link', { name: /profil ansehen/i })
      expect(profileLink).toHaveAttribute('href', '/therapists/therapist-1')
    })

    it('should NOT show profile link when embedded', () => {
      render(<TherapistCard therapist={mockTherapist} index={0} embedded={true} />)

      expect(screen.queryByRole('link', { name: /profil ansehen/i })).not.toBeInTheDocument()
    })
  })

  describe('Image Handling', () => {
    it('should render therapist image when provided', () => {
      render(<TherapistCard therapist={mockTherapist} index={0} />)

      const image = screen.getByAltText('Dr. Sarah Müller')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/images/therapist-1.jpg')
    })

    it('should render fallback icon when no image', () => {
      const therapistWithoutImage = { ...mockTherapist, image: null }
      const { container } = render(<TherapistCard therapist={therapistWithoutImage} index={0} />)

      expect(container.querySelector('.bg-gradient-to-br')).toBeInTheDocument()
    })
  })
})
