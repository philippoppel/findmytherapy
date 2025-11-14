'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import type { TherapistCard } from '../../therapists/types'
import {
  useTherapistFiltering,
  type FormatFilter,
  type TherapistFilters,
} from '../../hooks/useTherapistFiltering'
import type { Coordinates } from '../../therapists/location-data'
import { LocationInput } from './LocationInput'
import { SpecializationFilters } from './SpecializationFilters'

export type UnifiedTherapistSearchProps = {
  therapists: TherapistCard[]
  onFilteredResults: (therapists: TherapistCard[]) => void
  className?: string
}

const FORMAT_LABELS: Record<FormatFilter, string> = {
  online: 'Online',
  praesenz: 'Präsenz',
  hybrid: 'Hybrid',
}

export function UnifiedTherapistSearch({
  therapists,
  onFilteredResults,
  className = '',
}: UnifiedTherapistSearchProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Use ref to keep callback stable across renders
  const onFilteredResultsRef = useRef(onFilteredResults)

  useEffect(() => {
    onFilteredResultsRef.current = onFilteredResults
  }, [onFilteredResults])

  // Client-side only mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isFilterModalOpen) {
      document.body.style.overflow = 'hidden'
      console.log('🔍 Mobile filter modal opened')
    } else {
      document.body.style.overflow = ''
      console.log('🔍 Mobile filter modal closed')
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFilterModalOpen])

  const {
    filters,
    setSearchQuery,
    setLocation,
    setNearbyOnly,
    setRadius,
    setFormats,
    setSpecializations,
    setUserLocation,
    resetFilters,
    filteredTherapists,
    totalCount,
    hasActiveFilters,
    availableSpecializations,
  } = useTherapistFiltering({ therapists })

  // Update parent with filtered results
  useEffect(() => {
    onFilteredResultsRef.current(filteredTherapists)
  }, [filteredTherapists])

  const handleFormatToggle = (format: FormatFilter) => {
    const newFormats = new Set(filters.formats)
    if (newFormats.has(format)) {
      newFormats.delete(format)
    } else {
      newFormats.add(format)
    }
    setFormats(newFormats)
  }

  const activeFilterCount = () => {
    let count = 0
    if (filters.formats.size > 0) count += filters.formats.size
    if (filters.specializations.size > 0) count += filters.specializations.size
    if (filters.nearbyOnly) count += 1
    return count
  }

  const advancedFiltersProps: AdvancedFiltersContentProps = {
    filters,
    availableSpecializations,
    onLocationChange: setLocation,
    onCoordinatesChange: setUserLocation,
    onNearbyOnlyChange: setNearbyOnly,
    onRadiusChange: setRadius,
    onSpecializationsChange: setSpecializations,
  }

  return (
    <div className={className}>
      {/* Search Input */}
      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
          aria-hidden
        />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Suche nach Name oder Spezialisierung..."
          className="w-full min-h-[48px] rounded-xl border border-white/30 bg-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 backdrop-blur transition-colors"
          aria-label="Therapeuten suchen"
        />
      </div>

      {/* Format Quick Filters */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/70">Format</p>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(FORMAT_LABELS) as FormatFilter[]).map((format) => {
            const isSelected = filters.formats.has(format)
            return (
              <button
                key={format}
                type="button"
                onClick={() => handleFormatToggle(format)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all min-h-[44px] ${
                  isSelected
                    ? 'border-primary-400 bg-primary-500/30 text-white'
                    : 'border-white/30 bg-white/10 text-white/80 hover:bg-white/15'
                }`}
                aria-pressed={isSelected}
              >
                {FORMAT_LABELS[format]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Advanced Filters Toggle (Desktop - Accordion) */}
      <div className="hidden lg:block">
        <button
          type="button"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex w-full items-center justify-between rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/15 min-h-[44px]"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Erweiterte Filter
            {activeFilterCount() > 0 && (
              <span className="rounded-full bg-primary-500 px-2 py-0.5 text-xs font-bold">
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
          <div className="mt-4 rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur">
            <AdvancedFiltersContent {...advancedFiltersProps} />
          </div>
        )}
      </div>

      {/* Advanced Filters Button (Mobile - Opens Modal) */}
      <div className="block lg:hidden">
        <button
          type="button"
          onClick={() => {
            console.log('🔍 Mobile filter button clicked')
            setIsFilterModalOpen(true)
          }}
          className="flex w-full items-center justify-between rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/15 active:bg-white/20 min-h-[44px]"
          aria-label="Erweiterte Filter öffnen"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Erweiterte Filter
            {activeFilterCount() > 0 && (
              <span className="rounded-full bg-primary-500 px-2 py-0.5 text-xs font-bold">
                {activeFilterCount()}
              </span>
            )}
          </span>
        </button>
      </div>

      {/* Mobile Filter Modal (Bottom Sheet) */}
      {mounted && isFilterModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] lg:hidden" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-200"
              onClick={() => setIsFilterModalOpen(false)}
              aria-hidden="true"
            />

            {/* Bottom Sheet */}
            <div
              className="absolute inset-x-0 bottom-0 max-h-[85vh] w-full rounded-t-3xl bg-gradient-to-b from-primary-950 via-neutral-950 to-black shadow-2xl transition-transform duration-300 ease-out"
              style={{ transform: 'translateY(0)' }}
            >
              <div className="flex h-full flex-col">
                {/* Drag Handle */}
                <div
                  className="flex justify-center pt-3 pb-2 cursor-pointer touch-none"
                  onClick={() => setIsFilterModalOpen(false)}
                >
                  <div className="h-1.5 w-12 rounded-full bg-white/30" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 p-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-primary-400" aria-hidden="true" />
                    <h2 id="modal-title" className="text-lg font-semibold text-white">Erweiterte Filter</h2>
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
                <div className="flex-1 overflow-y-auto overscroll-contain p-4" style={{ WebkitOverflowScrolling: 'touch' }}>
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
          </div>,
          document.body
        )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-white/70">Aktive Filter:</span>

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white">
              <Search className="h-3 w-3" aria-hidden />
              {filters.searchQuery}
            </span>
          )}

          {Array.from(filters.formats).map((format) => (
            <span
              key={format}
              className="inline-flex items-center gap-1 rounded-lg bg-primary-500/20 px-2.5 py-1 text-xs font-medium text-white"
            >
              {FORMAT_LABELS[format]}
            </span>
          ))}

          {Array.from(filters.specializations).map((spec) => (
            <span
              key={spec}
              className="inline-flex items-center gap-1 rounded-lg bg-primary-500/20 px-2.5 py-1 text-xs font-medium text-white"
            >
              {spec}
            </span>
          ))}

          {filters.nearbyOnly && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-primary-500/20 px-2.5 py-1 text-xs font-medium text-white">
              📍 {filters.radius}km Umkreis
            </span>
          )}

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 rounded-lg bg-red-500/20 px-2.5 py-1 text-xs font-medium text-red-200 hover:bg-red-500/30 transition-colors"
          >
            <X className="h-3 w-3" aria-hidden />
            Alle zurücksetzen
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-4 text-sm text-white/70">
        <span className="font-semibold text-white">{filteredTherapists.length}</span> von{' '}
        {totalCount} {totalCount === 1 ? 'Profil' : 'Profile'}
      </div>
    </div>
  )
}

type AdvancedFiltersContentProps = {
  filters: TherapistFilters
  availableSpecializations: string[]
  onLocationChange: (value: string) => void
  onCoordinatesChange: (coords: Coordinates | null) => void
  onNearbyOnlyChange: (nearbyOnly: boolean) => void
  onRadiusChange: (radius: number) => void
  onSpecializationsChange: (specializations: Set<string>) => void
}

function AdvancedFiltersContent({
  filters,
  availableSpecializations,
  onLocationChange,
  onCoordinatesChange,
  onNearbyOnlyChange,
  onRadiusChange,
  onSpecializationsChange,
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

      <SpecializationFilters
        availableSpecializations={availableSpecializations}
        selectedSpecializations={filters.specializations}
        onChange={onSpecializationsChange}
      />
    </div>
  )
}
