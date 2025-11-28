'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, User, Shield } from 'lucide-react';
import type { TherapistCard } from '../../therapists/types';
import {
  useTherapistFiltering,
  type FormatFilter,
  type TherapistFilters,
  type GenderFilter as GenderFilterType,
} from '../../hooks/useTherapistFiltering';
import type { Coordinates } from '../../therapists/location-data';
import { LocationInput } from './LocationInput';
import { SpecializationFilters } from './SpecializationFilters';
import { LanguageFilters } from './LanguageFilters';
import { PriceRangeFilter } from './PriceRangeFilter';
import { InsuranceFilters } from './InsuranceFilters';
import { SortOptions } from './SortOptions';
import { GenderFilter } from './GenderFilter';

export type UnifiedTherapistSearchProps = {
  therapists: TherapistCard[];
  onFilteredResults: (therapists: TherapistCard[]) => void;
  className?: string;
};

const FORMAT_LABELS: Record<FormatFilter, string> = {
  online: 'Online',
  praesenz: 'Präsenz',
  hybrid: 'Hybrid',
};

export function UnifiedTherapistSearch({
  therapists,
  onFilteredResults,
  className = '',
}: UnifiedTherapistSearchProps) {
  // Show advanced filters by default on desktop
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Use ref to keep callback stable across renders
  const onFilteredResultsRef = useRef(onFilteredResults);

  useEffect(() => {
    onFilteredResultsRef.current = onFilteredResults;
  }, [onFilteredResults]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isFilterModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterModalOpen]);

  const {
    filters,
    setSearchQuery,
    setLocation,
    setNearbyOnly,
    setRadius,
    setFormats,
    setSpecializations,
    setUserLocation,
    setLanguages,
    setPriceRange,
    setAcceptsInsurance,
    setInsuranceProviders,
    setSortBy,
    setGender,
    resetFilters,
    filteredTherapists,
    totalCount,
    hasActiveFilters,
    availableSpecializations,
    availableLanguages,
    availableInsuranceProviders,
    priceRangeStats,
  } = useTherapistFiltering({ therapists });

  // Update parent with filtered results
  useEffect(() => {
    onFilteredResultsRef.current(filteredTherapists);
  }, [filteredTherapists]);

  const handleFormatToggle = (format: FormatFilter) => {
    const newFormats = new Set(filters.formats);
    if (newFormats.has(format)) {
      newFormats.delete(format);
    } else {
      newFormats.add(format);
    }
    setFormats(newFormats);
  };

  const activeFilterCount = () => {
    let count = 0;
    if (filters.formats.size > 0) count += filters.formats.size;
    if (filters.specializations.size > 0) count += filters.specializations.size;
    if (filters.nearbyOnly) count += 1;
    if (filters.gender !== 'any') count += 1;
    if (filters.acceptsInsurance) count += 1;
    if (filters.languages.size > 0) count += filters.languages.size;
    if (filters.priceRange) count += 1;
    return count;
  };

  const advancedFiltersProps: AdvancedFiltersContentProps = {
    filters,
    availableSpecializations,
    availableLanguages,
    availableInsuranceProviders,
    priceRangeStats,
    onLocationChange: setLocation,
    onCoordinatesChange: setUserLocation,
    onNearbyOnlyChange: setNearbyOnly,
    onRadiusChange: setRadius,
    onSpecializationsChange: setSpecializations,
    onLanguagesChange: setLanguages,
    onPriceRangeChange: setPriceRange,
    onAcceptsInsuranceChange: setAcceptsInsurance,
    onInsuranceProvidersChange: setInsuranceProviders,
    onGenderChange: setGender,
  };

  return (
    <div className={className}>
      {/* Search Input */}
      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Suche nach Name oder Spezialisierung..."
          className="w-full min-h-[48px] rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-colors"
          aria-label="Therapeuten suchen"
        />
      </div>

      {/* Format Quick Filters */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Format</p>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(FORMAT_LABELS) as FormatFilter[]).map((format) => {
            const isSelected = filters.formats.has(format);
            return (
              <button
                key={format}
                type="button"
                onClick={() => handleFormatToggle(format)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all min-h-[44px] ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
                aria-pressed={isSelected}
              >
                {FORMAT_LABELS[format]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender Quick Filter */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1">
          <User className="h-3 w-3" aria-hidden />
          Therapeut:in
        </p>
        <div className="grid grid-cols-3 gap-2">
          {([
            { value: 'any' as const, label: 'Egal' },
            { value: 'female' as const, label: 'Weiblich' },
            { value: 'male' as const, label: 'Männlich' },
          ]).map((option) => {
            const isSelected = filters.gender === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setGender(option.value)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all min-h-[44px] ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
                aria-pressed={isSelected}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Insurance Quick Filter */}
      <div className="mb-4">
        <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100 transition-colors">
          <input
            type="checkbox"
            checked={filters.acceptsInsurance}
            onChange={(e) => setAcceptsInsurance(e.target.checked)}
            className="h-5 w-5 rounded border-slate-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-400 focus:ring-offset-0"
          />
          <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Shield className="h-4 w-4 text-primary-500" aria-hidden />
            Akzeptiert Krankenkasse
          </span>
        </label>
      </div>

      {/* Sort Options */}
      <div className="mb-4">
        <SortOptions sortBy={filters.sortBy} onChange={setSortBy} />
      </div>

      {/* Advanced Filters Toggle (Desktop - Accordion) */}
      <div className="hidden lg:block">
        <button
          type="button"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 min-h-[44px]"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Erweiterte Filter
            {activeFilterCount() > 0 && (
              <span className="rounded-full bg-primary-500 text-white px-2 py-0.5 text-xs font-bold">
                {activeFilterCount()}
              </span>
            )}
          </span>
          {showAdvancedFilters ? (
            <ChevronUp className="h-4 w-4" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden />
          )}
        </button>

        {showAdvancedFilters && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <AdvancedFiltersContent {...advancedFiltersProps} />
          </div>
        )}
      </div>

      {/* Advanced Filters Button (Mobile - Opens Modal) */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsFilterModalOpen(true)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 min-h-[44px]"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Erweiterte Filter
            {activeFilterCount() > 0 && (
              <span className="rounded-full bg-primary-500 text-white px-2 py-0.5 text-xs font-bold">
                {activeFilterCount()}
              </span>
            )}
          </span>
        </button>
      </div>

      {/* Mobile Filter Modal (Bottom Sheet) */}
      {isFilterModalOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsFilterModalOpen(false)}
            aria-hidden="true"
          />

          {/* Bottom Sheet */}
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] w-full rounded-t-3xl bg-gradient-to-b from-primary-950 via-neutral-950 to-black shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex h-full flex-col">
              {/* Drag Handle */}
              <button
                type="button"
                className="flex justify-center pt-3 pb-2 cursor-pointer touch-none w-full"
                onClick={() => setIsFilterModalOpen(false)}
                aria-label="Filter schließen"
              >
                <div className="h-1.5 w-12 rounded-full bg-white/30" />
              </button>

              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-primary-400" aria-hidden="true" />
                  <h2 id="modal-title" className="text-lg font-semibold text-white">
                    Erweiterte Filter
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all hover:bg-white/10 hover:text-white hover:scale-110 active:scale-95"
                  aria-label="Filter schließen"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div
                className="flex-1 overflow-y-auto overscroll-contain p-4"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <AdvancedFiltersContent {...advancedFiltersProps} />
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 p-4 bg-gradient-to-t from-black/50 to-transparent">
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-full min-h-[48px] rounded-xl bg-primary-600 px-6 py-3 text-base font-semibold text-white hover:bg-primary-500 active:bg-primary-700 transition-colors shadow-lg"
                >
                  Ergebnisse anzeigen ({filteredTherapists.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Aktive Filter:</span>

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200">
              <Search className="h-3 w-3" aria-hidden />
              {filters.searchQuery}
            </span>
          )}

          {Array.from(filters.formats).map((format) => (
            <span
              key={format}
              className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-700 border border-primary-200"
            >
              {FORMAT_LABELS[format]}
            </span>
          ))}

          {Array.from(filters.specializations).map((spec) => (
            <span
              key={spec}
              className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-700 border border-primary-200"
            >
              {spec}
            </span>
          ))}

          {filters.nearbyOnly && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-700 border border-primary-200">
              📍 {filters.radius}km Umkreis
            </span>
          )}

          {filters.gender !== 'any' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-700 border border-primary-200">
              <User className="h-3 w-3" aria-hidden />
              {filters.gender === 'female' ? 'Weiblich' : 'Männlich'}
            </span>
          )}

          {filters.acceptsInsurance && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-700 border border-primary-200">
              <Shield className="h-3 w-3" aria-hidden />
              Krankenkasse
            </span>
          )}

          {Array.from(filters.languages).map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-700 border border-primary-200"
            >
              🌐 {lang}
            </span>
          ))}

          {filters.priceRange && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-700 border border-primary-200">
              💶 {filters.priceRange.min}–{filters.priceRange.max}€
            </span>
          )}

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 border border-red-200 hover:bg-red-200 transition-colors"
          >
            <X className="h-3 w-3" aria-hidden />
            Alle zurücksetzen
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-4 text-sm text-slate-500">
        <span className="font-semibold text-slate-700">{filteredTherapists.length}</span> von{' '}
        {totalCount} {totalCount === 1 ? 'Profil' : 'Profile'}
      </div>
    </div>
  );
}

type AdvancedFiltersContentProps = {
  filters: TherapistFilters;
  availableSpecializations: string[];
  availableLanguages: string[];
  availableInsuranceProviders: string[];
  priceRangeStats: { min: number; max: number } | null;
  onLocationChange: (value: string) => void;
  onCoordinatesChange: (coords: Coordinates | null) => void;
  onNearbyOnlyChange: (nearbyOnly: boolean) => void;
  onRadiusChange: (radius: number) => void;
  onSpecializationsChange: (specializations: Set<string>) => void;
  onLanguagesChange: (languages: Set<string>) => void;
  onPriceRangeChange: (range: { min: number; max: number } | null) => void;
  onAcceptsInsuranceChange: (accepts: boolean) => void;
  onInsuranceProvidersChange: (providers: Set<string>) => void;
  onGenderChange: (gender: GenderFilterType) => void;
};

function AdvancedFiltersContent({
  filters,
  availableSpecializations,
  availableLanguages,
  availableInsuranceProviders,
  priceRangeStats,
  onLocationChange,
  onCoordinatesChange,
  onNearbyOnlyChange,
  onRadiusChange,
  onSpecializationsChange,
  onLanguagesChange,
  onPriceRangeChange,
  onAcceptsInsuranceChange,
  onInsuranceProvidersChange,
  onGenderChange,
}: AdvancedFiltersContentProps) {
  return (
    <div className="space-y-6">
      <LocationInput
        value={filters.location}
        onChange={onLocationChange}
        onCoordinatesChange={onCoordinatesChange}
        nearbyOnly={filters.nearbyOnly}
        onNearbyOnlyChange={onNearbyOnlyChange}
        radius={filters.radius}
        onRadiusChange={onRadiusChange}
      />

      <div className="border-t border-slate-200 pt-6">
        <GenderFilter gender={filters.gender} onChange={onGenderChange} />
      </div>

      <SpecializationFilters
        availableSpecializations={availableSpecializations}
        selectedSpecializations={filters.specializations}
        onChange={onSpecializationsChange}
      />

      <div className="border-t border-slate-200 pt-6">
        <LanguageFilters
          availableLanguages={availableLanguages}
          selectedLanguages={filters.languages}
          onChange={onLanguagesChange}
        />
      </div>

      <div className="border-t border-slate-200 pt-6">
        <PriceRangeFilter
          priceRange={filters.priceRange}
          onChange={onPriceRangeChange}
          priceRangeStats={priceRangeStats}
        />
      </div>

      <div className="border-t border-slate-200 pt-6">
        <InsuranceFilters
          availableInsuranceProviders={availableInsuranceProviders}
          acceptsInsurance={filters.acceptsInsurance}
          onAcceptsInsuranceChange={onAcceptsInsuranceChange}
          insuranceProviders={filters.insuranceProviders}
          onInsuranceProvidersChange={onInsuranceProvidersChange}
        />
      </div>
    </div>
  );
}
