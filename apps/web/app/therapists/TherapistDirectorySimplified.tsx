'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Sparkles,
  MapPin,
  LocateFixed,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Search,
  User,
  Shield,
  Video,
  Building2,
  Monitor,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';
import type { TherapistCard } from './types';
import { useTherapistFiltering, type FormatFilter } from '../components/hooks/useTherapistFiltering';
import { LocationInput } from '../components/therapist-search/LocationInput';
import { SpecializationFilters } from '../components/therapist-search/SpecializationFilters';
import { LanguageFilters } from '../components/therapist-search/LanguageFilters';
import { PriceRangeFilter } from '../components/therapist-search/PriceRangeFilter';
import { InsuranceFilters } from '../components/therapist-search/InsuranceFilters';
import { SortOptions } from '../components/therapist-search/SortOptions';
import { useTranslation } from '@/lib/i18n';

// Utility function to merge classNames
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

const ITEMS_PER_PAGE = 20;

// These will be replaced with translations inside the component
const FORMAT_ICONS: Record<FormatFilter, typeof Video> = {
  online: Video,
  praesenz: Building2,
  hybrid: Monitor,
};

const gradients = [
  'from-blue-600 to-cyan-600',
  'from-purple-600 to-pink-600',
  'from-green-600 to-teal-600',
  'from-orange-600 to-amber-600',
  'from-red-600 to-rose-600',
  'from-indigo-600 to-purple-600',
];

function getGradientClass(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export type TherapistDirectoryProps = {
  therapists: TherapistCard[];
};

export function TherapistDirectory({ therapists }: TherapistDirectoryProps) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    location: true,
    format: true,
    gender: true,
    specializations: false,
    languages: false,
    price: false,
    insurance: false,
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  // Translated labels
  const statusLabel: Record<TherapistCard['status'], string> = {
    VERIFIED: t('therapistDirectory.verified'),
    PENDING: t('therapistDirectory.pending'),
    DRAFT: t('therapistDirectory.draft'),
  };

  const FORMAT_LABELS: Record<FormatFilter, { label: string; icon: typeof Video }> = {
    online: { label: t('therapistDirectory.online'), icon: FORMAT_ICONS.online },
    praesenz: { label: t('therapistDirectory.inPerson'), icon: FORMAT_ICONS.praesenz },
    hybrid: { label: t('therapistDirectory.hybrid'), icon: FORMAT_ICONS.hybrid },
  };

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
    hasActiveFilters,
    availableSpecializations,
    availableLanguages,
    availableInsuranceProviders,
    priceRangeStats,
  } = useTherapistFiltering({ therapists });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredTherapists.length]);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFilterOpen]);

  // Pagination
  const totalPages = Math.ceil(filteredTherapists.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTherapists = filteredTherapists.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleFormatToggle = (format: FormatFilter) => {
    const newFormats = new Set(filters.formats);
    if (newFormats.has(format)) {
      newFormats.delete(format);
    } else {
      newFormats.add(format);
    }
    setFormats(newFormats);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count += 1;
    if (filters.formats.size > 0) count += filters.formats.size;
    if (filters.specializations.size > 0) count += filters.specializations.size;
    if (filters.nearbyOnly) count += 1;
    if (filters.gender !== 'any') count += 1;
    if (filters.acceptsInsurance) count += 1;
    if (filters.languages.size > 0) count += filters.languages.size;
    if (filters.priceRange) count += 1;
    return count;
  }, [filters]);

  // Gender options with translations
  const genderOptions = [
    { value: 'any' as const, label: t('therapistDirectory.genderAny') },
    { value: 'female' as const, label: t('therapistDirectory.genderFemale') },
    { value: 'male' as const, label: t('therapistDirectory.genderMale') },
  ];

  // Filter sidebar content (shared between desktop and mobile)
  const FilterContent = () => (
    <div className="space-y-1">
      {/* Search */}
      <div className="p-4 border-b border-slate-200">
        <label htmlFor="filter-search" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          {t('therapistDirectory.searchTerm')}
        </label>
        <div className="relative">
          <input
            id="filter-search"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('therapistDirectory.searchPlaceholder')}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Location Section */}
      <FilterSection
        title={t('therapistDirectory.location')}
        isExpanded={expandedSections.location}
        onToggle={() => toggleSection('location')}
      >
        <LocationInput
          value={filters.location}
          onChange={setLocation}
          onCoordinatesChange={setUserLocation}
          nearbyOnly={filters.nearbyOnly}
          onNearbyOnlyChange={setNearbyOnly}
          radius={filters.radius}
          onRadiusChange={setRadius}
          compact
        />
      </FilterSection>

      {/* Format Section */}
      <FilterSection
        title={t('therapistDirectory.format')}
        isExpanded={expandedSections.format}
        onToggle={() => toggleSection('format')}
      >
        <div className="space-y-2">
          {(Object.keys(FORMAT_LABELS) as FormatFilter[]).map((format) => {
            const { label, icon: Icon } = FORMAT_LABELS[format];
            const isSelected = filters.formats.has(format);
            return (
              <label
                key={format}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-all',
                  isSelected
                    ? 'border-primary-300 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                )}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleFormatToggle(format)}
                  className="sr-only"
                />
                <Icon className={cn('h-4 w-4', isSelected ? 'text-primary-600' : 'text-slate-400')} />
                <span className="text-sm font-medium">{label}</span>
                {isSelected && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-primary-500" />
                )}
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Gender Section */}
      <FilterSection
        title={t('therapistDirectory.gender')}
        isExpanded={expandedSections.gender}
        onToggle={() => toggleSection('gender')}
      >
        <div className="space-y-2">
          {genderOptions.map((option) => {
            const isSelected = filters.gender === option.value;
            return (
              <label
                key={option.value}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-all',
                  isSelected
                    ? 'border-primary-300 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                )}
              >
                <input
                  type="radio"
                  name="gender"
                  checked={isSelected}
                  onChange={() => setGender(option.value)}
                  className="sr-only"
                />
                <User className={cn('h-4 w-4', isSelected ? 'text-primary-600' : 'text-slate-400')} />
                <span className="text-sm font-medium">{option.label}</span>
                {isSelected && option.value !== 'any' && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-primary-500" />
                )}
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Insurance */}
      <FilterSection
        title={t('therapistDirectory.insurance')}
        isExpanded={expandedSections.insurance}
        onToggle={() => toggleSection('insurance')}
      >
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 transition-all hover:border-slate-300 hover:bg-slate-50">
          <input
            type="checkbox"
            checked={filters.acceptsInsurance}
            onChange={(e) => setAcceptsInsurance(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          <Shield className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">{t('therapistDirectory.acceptsInsurance')}</span>
        </label>
        {filters.acceptsInsurance && (
          <div className="mt-3">
            <InsuranceFilters
              availableInsuranceProviders={availableInsuranceProviders}
              acceptsInsurance={filters.acceptsInsurance}
              onAcceptsInsuranceChange={setAcceptsInsurance}
              insuranceProviders={filters.insuranceProviders}
              onInsuranceProvidersChange={setInsuranceProviders}
              compact
            />
          </div>
        )}
      </FilterSection>

      {/* Specializations */}
      <FilterSection
        title={t('therapistDirectory.specializations')}
        isExpanded={expandedSections.specializations}
        onToggle={() => toggleSection('specializations')}
        badge={filters.specializations.size > 0 ? filters.specializations.size : undefined}
      >
        <SpecializationFilters
          availableSpecializations={availableSpecializations}
          selectedSpecializations={filters.specializations}
          onChange={setSpecializations}
          compact
        />
      </FilterSection>

      {/* Languages */}
      <FilterSection
        title={t('therapistDirectory.languages')}
        isExpanded={expandedSections.languages}
        onToggle={() => toggleSection('languages')}
        badge={filters.languages.size > 0 ? filters.languages.size : undefined}
      >
        <LanguageFilters
          availableLanguages={availableLanguages}
          selectedLanguages={filters.languages}
          onChange={setLanguages}
          compact
        />
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title={t('therapistDirectory.price')}
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <PriceRangeFilter
          priceRange={filters.priceRange}
          onChange={setPriceRange}
          priceRangeStats={priceRangeStats}
          compact
        />
      </FilterSection>

      {/* Reset Button */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={resetFilters}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
          >
            <RotateCcw className="h-4 w-4" />
            {t('therapistDirectory.resetFilters')}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8" ref={resultsRef}>
      {/* Desktop Sidebar - Sticky like willhaben */}
      <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
        <div className="sticky top-24">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary-500" />
                  Filter
                </h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    {t('common.reset')}
                  </button>
                )}
              </div>
            </div>
            {/* Filter Content */}
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto overscroll-contain">
              <FilterContent />
            </div>
            {/* Footer with count */}
            <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500 text-center">
                <span className="font-semibold text-slate-700">{filteredTherapists.length}</span> {t('therapistDirectory.therapists')}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Filter Button - Floating style */}
      <div className="lg:hidden sticky top-20 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-primary-500 px-1.5 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <div className="flex-1">
            <SortOptions sortBy={filters.sortBy} onChange={setSortBy} compact />
          </div>
        </div>
        <p className="text-xs text-slate-500 text-center mt-2">
          <span className="font-medium text-slate-700">{filteredTherapists.length}</span> {t('therapistDirectory.results')}
        </p>
      </div>

      {/* Mobile Filter Drawer - Modern slide-in */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default animate-in fade-in duration-200"
            onClick={() => setIsMobileFilterOpen(false)}
            aria-label={t('therapistDirectory.closeFilters')}
          />
          {/* Drawer */}
          <div className="absolute inset-y-0 left-0 w-full max-w-[340px] bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-white">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{t('therapistDirectory.filters')}</h2>
                  {activeFilterCount > 0 && (
                    <p className="text-xs text-slate-500 mt-0.5">{activeFilterCount} {t('therapistDirectory.active')}</p>
                  )}
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain bg-slate-50">
                <FilterContent />
              </div>

              {/* Footer Actions */}
              <div className="border-t border-slate-200 bg-white p-4 space-y-3 safe-area-bottom">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {t('therapistDirectory.resetAllFilters')}
                  </button>
                )}
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full rounded-xl bg-primary-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-primary-700 transition-colors"
                >
                  {t('therapistDirectory.showResults', { count: filteredTherapists.length.toString() })}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex-1 min-w-0">
        {/* Results Header - Desktop only (mobile has it in filter bar) */}
        <div className="hidden lg:flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{filteredTherapists.length}</span> {t('therapistDirectory.therapists')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <SortOptions sortBy={filters.sortBy} onChange={setSortBy} compact />
          </div>
        </div>

        {/* Pagination Top */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              t={t}
            />
            <span className="text-xs text-slate-500">
              {startIndex + 1}–{Math.min(endIndex, filteredTherapists.length)} {t('therapistDirectory.of')} {filteredTherapists.length}
            </span>
          </div>
        )}

        {/* Results List */}
        {filteredTherapists.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto max-w-md space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-base font-semibold text-slate-900">{t('therapistDirectory.noResults')}</p>
              <p className="text-sm text-slate-600">
                {t('therapistDirectory.noResultsMessage')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary-700"
                >
                  <Sparkles className="h-4 w-4" />
                  {t('therapistDirectory.startQuiz')}
                </Link>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t('therapistDirectory.reset')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedTherapists.map((therapist) => (
              <TherapistListCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        )}

        {/* Pagination Bottom */}
        {totalPages > 1 && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              t={t}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Filter Section Component
function FilterSection({
  title,
  isExpanded,
  onToggle,
  children,
  badge,
}: {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-100/50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">{title}</span>
          {badge !== undefined && badge > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-primary-100 px-1.5 text-[10px] font-bold text-primary-700">
              {badge}
            </span>
          )}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>
      {isExpanded && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

// Pagination Component
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  t,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  t: (key: string) => string;
}) {
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = 7;

    if (totalPages <= showPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">{t('common.back')}</span>
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, idx) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                currentPage === page
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">{t('common.next')}</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// Horizontal List Card
function TherapistListCard({ therapist }: { therapist: TherapistCard }) {
  const gradientClass = getGradientClass(therapist.id);
  const primaryFocus = therapist.focus.slice(0, 4);
  const distance =
    typeof therapist.distanceInKm === 'number'
      ? `${Math.max(1, Math.round(therapist.distanceInKm))} km`
      : null;

  return (
    <Link href={`/therapists/${therapist.id}`} prefetch={false} className="group block">
      <article className="flex flex-col sm:flex-row overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-md">
        {/* Image Section */}
        <div className="relative w-full sm:w-48 md:w-56 lg:w-64 flex-shrink-0">
          <div className="aspect-[4/3] sm:aspect-auto sm:h-full">
            {therapist.image ? (
              <Image
                src={therapist.image}
                alt={`${therapist.name}`}
                fill
                className="object-cover brightness-[0.97] group-hover:brightness-100 transition-all"
                sizes="(max-width: 640px) 100vw, 256px"
              />
            ) : (
              <div
                className={cn(
                  'flex h-full w-full items-center justify-center bg-gradient-to-br',
                  gradientClass
                )}
              >
                <span className="text-4xl font-bold text-white">{therapist.initials}</span>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="absolute left-2 top-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold uppercase shadow-sm backdrop-blur-sm',
                therapist.status === 'VERIFIED'
                  ? 'bg-emerald-500/90 text-white'
                  : therapist.status === 'PENDING'
                    ? 'bg-amber-500/90 text-white'
                    : 'bg-slate-500/90 text-white'
              )}
            >
              <ShieldCheck className="h-3 w-3" />
              <span className="hidden sm:inline">{statusLabel[therapist.status]}</span>
            </span>
          </div>

          {/* Distance Badge */}
          {distance && (
            <div className="absolute right-2 top-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-primary-500/90 px-2 py-1 text-[10px] font-semibold text-white shadow-sm backdrop-blur-sm">
                <LocateFixed className="h-3 w-3" />
                {distance}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-primary-700 transition-colors truncate">
                {therapist.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">{therapist.title}</p>
            </div>
            <div className="hidden sm:flex flex-col items-end text-right flex-shrink-0">
              <span
                className={cn(
                  'text-xs font-semibold',
                  therapist.availabilityRank <= 2
                    ? 'text-emerald-600'
                    : therapist.availabilityRank <= 4
                      ? 'text-amber-600'
                      : 'text-red-600'
                )}
              >
                {therapist.availability}
              </span>
            </div>
          </div>

          {/* Info Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs sm:text-sm text-slate-600">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span className="truncate max-w-[180px]">{therapist.location}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary-500" />
              {therapist.experience}
            </span>
          </div>

          {/* Focus Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {primaryFocus.map((focus, index) => (
              <span
                key={index}
                className="inline-block rounded-md bg-slate-100 px-2 py-1 text-[11px] sm:text-xs font-medium text-slate-600"
              >
                {focus}
              </span>
            ))}
            {therapist.focus.length > 4 && (
              <span className="inline-block rounded-md bg-slate-100 px-2 py-1 text-[11px] sm:text-xs font-medium text-slate-400">
                +{therapist.focus.length - 4}
              </span>
            )}
          </div>

          {/* Format Tags */}
          <div className="mt-auto flex items-center gap-2">
            {therapist.formatTags.map((tag) => {
              const config = FORMAT_LABELS[tag];
              const Icon = config.icon;
              return (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] sm:text-xs font-medium text-slate-600"
                >
                  <Icon className="h-3 w-3" />
                  {config.label}
                </span>
              );
            })}

            {/* Mobile availability */}
            <span
              className={cn(
                'sm:hidden ml-auto text-xs font-semibold',
                therapist.availabilityRank <= 2
                  ? 'text-emerald-600'
                  : therapist.availabilityRank <= 4
                    ? 'text-amber-600'
                    : 'text-red-600'
              )}
            >
              {therapist.availability}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
