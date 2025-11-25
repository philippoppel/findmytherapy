/**
 * TherapistComparison Tests
 * Tests side-by-side therapist comparison modal
 */

import { render, screen, fireEvent, within } from '@testing-library/react';
import { TherapistComparison } from './TherapistComparison';

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const mockTherapists = [
  {
    id: 'therapist-1',
    name: 'Dr. Sarah Müller',
    title: 'Psychologische Psychotherapeutin',
    headline: 'Spezialisiert auf Angststörungen',
    focus: ['Angststörungen', 'Depression', 'Trauma'],
    availability: 'Termine in 2 Wochen',
    location: 'Wien',
    rating: 4.8,
    reviews: 24,
    formatTags: ['online', 'hybrid'] as Array<'online' | 'praesenz' | 'hybrid'>,
    services: ['Einzeltherapie', 'Gruppentherapie', 'EMDR'],
    responseTime: 'Antwort innerhalb 24h',
    yearsExperience: 12,
    languages: ['Deutsch', 'Englisch'],
    image: '/images/therapist-1.jpg',
  },
  {
    id: 'therapist-2',
    name: 'Mag. Thomas Weber',
    title: 'Klinischer Psychologe',
    headline: 'Experte für Burnout und Stress',
    focus: ['Burnout', 'Stress', 'Arbeitsprobleme'],
    availability: 'Termine in 1 Woche',
    location: 'Graz · Online',
    rating: 4.9,
    reviews: 18,
    formatTags: ['online', 'praesenz'] as Array<'online' | 'praesenz' | 'hybrid'>,
    services: ['Einzeltherapie', 'Coaching'],
    responseTime: 'Antwort innerhalb 12h',
    yearsExperience: 8,
    languages: ['Deutsch'],
    image: null,
  },
];

describe('TherapistComparison', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render comparison modal', () => {
    render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

    expect(screen.getByText(/therapeuten-vergleich/i)).toBeInTheDocument();
  });

  it('should show number of therapists being compared', () => {
    render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

    expect(screen.getByText(/2 therapeut:innen im vergleich/i)).toBeInTheDocument();
  });

  it('should display close button', () => {
    render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: '' }); // X button
    expect(closeButton).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons[0]; // X button is first

    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  describe('Therapist Information', () => {
    it('should display all therapist names', () => {
      render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

      expect(screen.getByText('Dr. Sarah Müller')).toBeInTheDocument();
      expect(screen.getByText('Mag. Thomas Weber')).toBeInTheDocument();
    });

    it('should display therapist titles', () => {
      render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

      expect(screen.getByText('Psychologische Psychotherapeutin')).toBeInTheDocument();
      expect(screen.getByText('Klinischer Psychologe')).toBeInTheDocument();
    });

    it('should display therapist images', () => {
      render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

      const image1 = screen.getByAltText('Dr. Sarah Müller');
      expect(image1).toHaveAttribute('src', '/images/therapist-1.jpg');
    });
  });

  describe('Comparison Table', () => {
    it('should show rating comparison row', () => {
      render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

      expect(screen.getByText('Bewertung')).toBeInTheDocument();
      expect(screen.getByText('4.8')).toBeInTheDocument();
      expect(screen.getByText('4.9')).toBeInTheDocument();
    });

    it('should show experience comparison row', () => {
      render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

      expect(screen.getByText('Berufserfahrung')).toBeInTheDocument();
      expect(screen.getByText(/12 jahre/i)).toBeInTheDocument();
      expect(screen.getByText(/8 jahre/i)).toBeInTheDocument();
    });

    it('should show focus areas comparison', () => {
      render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

      expect(screen.getByText('Schwerpunkte')).toBeInTheDocument();
      expect(screen.getByText('Angststörungen')).toBeInTheDocument();
      expect(screen.getByText('Burnout')).toBeInTheDocument();
    });

    it('should show format comparison', () => {
      render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

      expect(screen.getByText('Format')).toBeInTheDocument();
      expect(screen.getAllByText('Online')).toHaveLength(2); // Both have online
    });

    it('should show location comparison', () => {
      render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

      expect(screen.getByText('Standort')).toBeInTheDocument();
      expect(screen.getByText('Wien')).toBeInTheDocument();
      expect(screen.getByText('Graz · Online')).toBeInTheDocument();
    });

    it('should show languages comparison', () => {
      render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

      expect(screen.getByText('Sprachen')).toBeInTheDocument();
      expect(screen.getByText(/deutsch, englisch/i)).toBeInTheDocument();
      expect(screen.getAllByText(/deutsch/i)).toHaveLength(2); // Both speak German
    });

    it('should show availability comparison', () => {
      render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

      expect(screen.getByText('Verfügbarkeit')).toBeInTheDocument();
      expect(screen.getByText(/termine in 2 wochen/i)).toBeInTheDocument();
      expect(screen.getByText(/termine in 1 woche/i)).toBeInTheDocument();
    });

    it('should show services comparison', () => {
      render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

      expect(screen.getByText('Leistungen')).toBeInTheDocument();
      expect(screen.getAllByText('Einzeltherapie')).toHaveLength(2); // Both offer it
      expect(screen.getByText('Coaching')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should show contact buttons for each therapist', () => {
      render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

      // Button text uses first word of name (Dr., Mag., etc.)
      expect(screen.getByRole('link', { name: /dr\. kontaktieren/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /mag\. kontaktieren/i })).toBeInTheDocument();
    });

    it('should link to therapist profiles', () => {
      render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

      const link1 = screen.getByRole('link', { name: /dr\. kontaktieren/i });
      expect(link1).toHaveAttribute('href', '/therapists/therapist-1');

      const link2 = screen.getByRole('link', { name: /mag\. kontaktieren/i });
      expect(link2).toHaveAttribute('href', '/therapists/therapist-2');
    });

    it('should show close button in footer', () => {
      render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /schließen/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('should call onClose when footer close button is clicked', () => {
      render(<TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /schließen/i });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle therapist without rating', () => {
      const therapistsWithoutRating = [{ ...mockTherapists[0], rating: 0, reviews: 0 }];

      render(<TherapistComparison therapists={therapistsWithoutRating} onClose={mockOnClose} />);

      expect(screen.getByText(/noch keine bewertungen/i)).toBeInTheDocument();
    });

    it('should handle therapist without experience', () => {
      const therapistsWithoutExperience = [{ ...mockTherapists[0], yearsExperience: undefined }];

      render(
        <TherapistComparison
          therapists={therapistsWithoutExperience as any}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByText('—')).toBeInTheDocument(); // Em dash for missing data
    });

    it('should handle therapist with many focus areas', () => {
      const therapistWithManyFocus = [
        { ...mockTherapists[0], focus: ['Area1', 'Area2', 'Area3', 'Area4', 'Area5', 'Area6'] },
      ];

      render(<TherapistComparison therapists={therapistWithManyFocus} onClose={mockOnClose} />);

      expect(screen.getByText('+2 weitere')).toBeInTheDocument(); // Shows +2 more
    });

    it('should not render anything when therapists array is empty', () => {
      const { container } = render(<TherapistComparison therapists={[]} onClose={mockOnClose} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Modal Styling', () => {
    it('should have modal overlay', () => {
      const { container } = render(
        <TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />,
      );

      expect(container.querySelector('.fixed.inset-0')).toBeInTheDocument();
    });

    it('should have scrollable content area', () => {
      const { container } = render(
        <TherapistComparison therapists={mockTherapists} onClose={mockOnClose} />,
      );

      expect(container.querySelector('.overflow-auto')).toBeInTheDocument();
    });
  });
});
