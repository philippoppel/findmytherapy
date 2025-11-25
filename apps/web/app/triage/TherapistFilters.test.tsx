/**
 * TherapistFilters Tests
 * Tests filter functionality for therapists
 */

import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { TherapistFilters } from './TherapistFilters';

describe('TherapistFilters', () => {
  const mockAvailableSpecialties = ['Angststörungen', 'Depression', 'Trauma', 'Burnout', 'Stress'];

  const mockAvailableLanguages = ['Deutsch', 'Englisch', 'Französisch', 'Spanisch'];

  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render filter button', () => {
    render(
      <TherapistFilters
        availableSpecialties={mockAvailableSpecialties}
        availableLanguages={mockAvailableLanguages}
        onFilterChange={mockOnFilterChange}
      />,
    );

    expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
  });

  it('should expand filters when button is clicked', () => {
    render(
      <TherapistFilters
        availableSpecialties={mockAvailableSpecialties}
        availableLanguages={mockAvailableLanguages}
        onFilterChange={mockOnFilterChange}
      />,
    );

    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);

    expect(screen.getByText('Format')).toBeInTheDocument();
    expect(screen.getByText('Schwerpunkte')).toBeInTheDocument();
    expect(screen.getByText('Sprachen')).toBeInTheDocument();
  });

  describe('Format Filters', () => {
    beforeEach(() => {
      render(
        <TherapistFilters
          availableSpecialties={mockAvailableSpecialties}
          availableLanguages={mockAvailableLanguages}
          onFilterChange={mockOnFilterChange}
        />,
      );

      const filterButton = screen.getByRole('button', { name: /filter/i });
      fireEvent.click(filterButton);
    });

    it('should show format filter options', () => {
      expect(screen.getByRole('button', { name: 'Online' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Präsenz' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Hybrid' })).toBeInTheDocument();
    });

    it('should select format filter when clicked', () => {
      const onlineButton = screen.getByRole('button', { name: 'Online' });
      fireEvent.click(onlineButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        formats: ['online'],
        specialties: [],
        languages: [],
      });
    });

    it('should deselect format filter when clicked again', () => {
      const onlineButton = screen.getByRole('button', { name: 'Online' });

      // Select
      fireEvent.click(onlineButton);

      // Deselect
      fireEvent.click(onlineButton);

      expect(mockOnFilterChange).toHaveBeenLastCalledWith({
        formats: [],
        specialties: [],
        languages: [],
      });
    });

    it('should allow multiple format filters', () => {
      const onlineButton = screen.getByRole('button', { name: 'Online' });
      const hybridButton = screen.getByRole('button', { name: 'Hybrid' });

      fireEvent.click(onlineButton);
      fireEvent.click(hybridButton);

      expect(mockOnFilterChange).toHaveBeenLastCalledWith({
        formats: ['online', 'hybrid'],
        specialties: [],
        languages: [],
      });
    });
  });

  describe('Specialty Filters', () => {
    beforeEach(() => {
      render(
        <TherapistFilters
          availableSpecialties={mockAvailableSpecialties}
          availableLanguages={mockAvailableLanguages}
          onFilterChange={mockOnFilterChange}
        />,
      );

      const filterButton = screen.getByRole('button', { name: /filter/i });
      fireEvent.click(filterButton);
    });

    it('should show specialty filter options', () => {
      expect(screen.getByRole('button', { name: 'Angststörungen' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Depression' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Trauma' })).toBeInTheDocument();
    });

    it('should select specialty filter when clicked', () => {
      const anxietyButton = screen.getByRole('button', { name: 'Angststörungen' });
      fireEvent.click(anxietyButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        formats: [],
        specialties: ['Angststörungen'],
        languages: [],
      });
    });
  });

  it('should show max 10 specialties initially', () => {
    const manySpecialties = Array.from({ length: 15 }, (_, i) => `Specialty ${i}`);

    render(
      <TherapistFilters
        availableSpecialties={manySpecialties}
        availableLanguages={mockAvailableLanguages}
        onFilterChange={mockOnFilterChange}
      />,
    );

    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);

    expect(screen.getByText(/\+5 weitere schwerpunkte verfügbar/i)).toBeInTheDocument();
  });

  describe('Language Filters', () => {
    beforeEach(() => {
      render(
        <TherapistFilters
          availableSpecialties={mockAvailableSpecialties}
          availableLanguages={mockAvailableLanguages}
          onFilterChange={mockOnFilterChange}
        />,
      );

      const filterButton = screen.getByRole('button', { name: /filter/i });
      fireEvent.click(filterButton);
    });

    it('should show language filter options', () => {
      expect(screen.getByRole('button', { name: 'Deutsch' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Englisch' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Französisch' })).toBeInTheDocument();
    });

    it('should select language filter when clicked', () => {
      const germanButton = screen.getByRole('button', { name: 'Deutsch' });
      fireEvent.click(germanButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        formats: [],
        specialties: [],
        languages: ['Deutsch'],
      });
    });
  });

  it('should show max 8 languages initially', () => {
    const manyLanguages = Array.from({ length: 12 }, (_, i) => `Language ${i}`);

    render(
      <TherapistFilters
        availableSpecialties={mockAvailableSpecialties}
        availableLanguages={manyLanguages}
        onFilterChange={mockOnFilterChange}
      />,
    );

    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);

    expect(screen.getByText(/\+4 weitere sprachen verfügbar/i)).toBeInTheDocument();
  });

  describe('Active Filter Count', () => {
    it('should show active filter count badge', () => {
      render(
        <TherapistFilters
          availableSpecialties={mockAvailableSpecialties}
          availableLanguages={mockAvailableLanguages}
          onFilterChange={mockOnFilterChange}
        />,
      );

      const filterButton = screen.getByRole('button', { name: /filter/i });
      fireEvent.click(filterButton);

      // Select some filters
      const onlineButton = screen.getByRole('button', { name: 'Online' });
      const anxietyButton = screen.getByRole('button', { name: 'Angststörungen' });

      fireEvent.click(onlineButton);
      fireEvent.click(anxietyButton);

      // Badge should show 2
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should not show badge when no filters active', () => {
      render(
        <TherapistFilters
          availableSpecialties={mockAvailableSpecialties}
          availableLanguages={mockAvailableLanguages}
          onFilterChange={mockOnFilterChange}
        />,
      );

      // No badge should be visible initially
      const buttons = screen.getAllByRole('button');
      const badgeExists = buttons.some((btn) => btn.textContent?.match(/^\d+$/));
      expect(badgeExists).toBe(false);
    });
  });

  describe('Clear Filters', () => {
    it('should show "Filter löschen" button when filters are active', () => {
      render(
        <TherapistFilters
          availableSpecialties={mockAvailableSpecialties}
          availableLanguages={mockAvailableLanguages}
          onFilterChange={mockOnFilterChange}
        />,
      );

      const filterButtons = screen.getAllByRole('button', { name: /^filter$/i });
      fireEvent.click(filterButtons[0]);

      // Select a filter
      const onlineButton = screen.getByRole('button', { name: 'Online' });
      fireEvent.click(onlineButton);

      // Clear button should appear - use queryByText since it's inside another button
      expect(screen.getByText(/filter löschen/i)).toBeInTheDocument();
    });

    it('should clear all filters when "Filter löschen" is clicked', () => {
      render(
        <TherapistFilters
          availableSpecialties={mockAvailableSpecialties}
          availableLanguages={mockAvailableLanguages}
          onFilterChange={mockOnFilterChange}
        />,
      );

      const filterButtons = screen.getAllByRole('button', { name: /^filter$/i });
      fireEvent.click(filterButtons[0]);

      // Select multiple filters
      const onlineButton = screen.getByRole('button', { name: 'Online' });
      const anxietyButton = screen.getByRole('button', { name: 'Angststörungen' });

      fireEvent.click(onlineButton);
      fireEvent.click(anxietyButton);

      // Clear all - click the text since button is nested
      const clearButton = screen.getByText(/filter löschen/i);
      fireEvent.click(clearButton);

      expect(mockOnFilterChange).toHaveBeenLastCalledWith({
        formats: [],
        specialties: [],
        languages: [],
      });
    });
  });

  describe('Combined Filters', () => {
    it('should allow multiple filters across different categories', () => {
      render(
        <TherapistFilters
          availableSpecialties={mockAvailableSpecialties}
          availableLanguages={mockAvailableLanguages}
          onFilterChange={mockOnFilterChange}
        />,
      );

      const filterButton = screen.getByRole('button', { name: /filter/i });
      fireEvent.click(filterButton);

      // Select from all categories
      const onlineButton = screen.getByRole('button', { name: 'Online' });
      const anxietyButton = screen.getByRole('button', { name: 'Angststörungen' });
      const germanButton = screen.getByRole('button', { name: 'Deutsch' });

      fireEvent.click(onlineButton);
      fireEvent.click(anxietyButton);
      fireEvent.click(germanButton);

      expect(mockOnFilterChange).toHaveBeenLastCalledWith({
        formats: ['online'],
        specialties: ['Angststörungen'],
        languages: ['Deutsch'],
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty specialties list', () => {
      render(
        <TherapistFilters
          availableSpecialties={[]}
          availableLanguages={mockAvailableLanguages}
          onFilterChange={mockOnFilterChange}
        />,
      );

      const filterButton = screen.getByRole('button', { name: /filter/i });
      fireEvent.click(filterButton);

      // Specialties section should not be rendered
      expect(screen.queryByText('Schwerpunkte')).not.toBeInTheDocument();
    });

    it('should handle empty languages list', () => {
      render(
        <TherapistFilters
          availableSpecialties={mockAvailableSpecialties}
          availableLanguages={[]}
          onFilterChange={mockOnFilterChange}
        />,
      );

      const filterButton = screen.getByRole('button', { name: /filter/i });
      fireEvent.click(filterButton);

      // Languages section should not be rendered
      expect(screen.queryByText('Sprachen')).not.toBeInTheDocument();
    });
  });
});
