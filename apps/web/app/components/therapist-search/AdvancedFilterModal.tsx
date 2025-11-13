'use client'

import { X, SlidersHorizontal } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { FilterState } from './types'

interface AdvancedFilterModalProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onApply: (filters: Partial<FilterState>) => void
  availableOptions: {
    specialties: string[]
    languages: string[]
    modalities: string[]
    insurance: string[]
    ageGroups: string[]
    cities: string[]
  }
}

export function AdvancedFilterModal({
  isOpen,
  onClose,
  filters,
  onApply,
  availableOptions,
}: AdvancedFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      setLocalFilters(filters)
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, filters, onClose])

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  const handleOverlayKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
      onClose()
    }
  }

  if (!isOpen) return null

  const handleApply = () => {
    onApply(localFilters)
    onClose()
  }

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = (localFilters[key] as string[]) || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value]
    setLocalFilters({ ...localFilters, [key]: newArray })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayKeyDown}
      role="button"
      aria-label="Filter schließen"
      tabIndex={0}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-gradient-to-br from-surface to-surface-1 shadow-2xl sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-divider bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
              <SlidersHorizontal className="h-5 w-5 text-primary-600" aria-hidden />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">Erweiterte Filter</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Schließen"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-8">
            {/* Location */}
            <FilterSection title="Standort">
              <select
                value={localFilters.location}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, location: e.target.value })
                }
                className="w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3 text-neutral-900 transition-colors focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
              >
                <option value="">Alle Standorte</option>
                {availableOptions.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </FilterSection>

            {/* Specialties */}
            <FilterSection title="Spezialisierung / Fokus">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {availableOptions.specialties.map((specialty) => (
                  <CheckboxPill
                    key={specialty}
                    label={specialty}
                    checked={localFilters.specialties.includes(specialty)}
                    onChange={() => toggleArrayFilter('specialties', specialty)}
                  />
                ))}
              </div>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Preisspanne (pro Sitzung)">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={localFilters.priceRange[0]}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        priceRange: [Number(e.target.value), localFilters.priceRange[1]],
                      })
                    }
                    className="flex-1"
                  />
                  <span className="min-w-[4rem] text-sm font-medium text-neutral-700">
                    €{localFilters.priceRange[0]}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={localFilters.priceRange[1]}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        priceRange: [localFilters.priceRange[0], Number(e.target.value)],
                      })
                    }
                    className="flex-1"
                  />
                  <span className="min-w-[4rem] text-sm font-medium text-neutral-700">
                    €{localFilters.priceRange[1]}
                  </span>
                </div>
                <div className="text-center text-sm text-neutral-600">
                  €{localFilters.priceRange[0]} - €{localFilters.priceRange[1]}
                </div>
              </div>
            </FilterSection>

            {/* Insurance */}
            <FilterSection title="Akzeptierte Versicherung">
              <div className="grid grid-cols-2 gap-2">
                {availableOptions.insurance.map((ins) => (
                  <CheckboxPill
                    key={ins}
                    label={ins}
                    checked={localFilters.insurance.includes(ins)}
                    onChange={() => toggleArrayFilter('insurance', ins)}
                  />
                ))}
              </div>
            </FilterSection>

            {/* Languages */}
            <FilterSection title="Sprachen">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {availableOptions.languages.map((language) => (
                  <CheckboxPill
                    key={language}
                    label={language}
                    checked={localFilters.languages.includes(language)}
                    onChange={() => toggleArrayFilter('languages', language)}
                  />
                ))}
              </div>
            </FilterSection>

            {/* Modalities */}
            <FilterSection title="Therapeutischer Ansatz">
              <div className="grid grid-cols-2 gap-2">
                {availableOptions.modalities.map((modality) => (
                  <CheckboxPill
                    key={modality}
                    label={modality}
                    checked={localFilters.modalities.includes(modality)}
                    onChange={() => toggleArrayFilter('modalities', modality)}
                  />
                ))}
              </div>
            </FilterSection>

            {/* Age Groups */}
            <FilterSection title="Altersgruppen">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {availableOptions.ageGroups.map((age) => (
                  <CheckboxPill
                    key={age}
                    label={age}
                    checked={localFilters.ageGroups.includes(age)}
                    onChange={() => toggleArrayFilter('ageGroups', age)}
                  />
                ))}
              </div>
            </FilterSection>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-divider bg-white px-6 py-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-neutral-200 bg-white px-6 py-3 font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-primary-500 hover:to-primary-600 hover:shadow-xl"
            >
              Filter anwenden
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-bold text-neutral-900">{title}</h3>
      {children}
    </div>
  )
}

function CheckboxPill({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
        checked
          ? 'border-primary-500 bg-primary-500 text-white'
          : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-200 hover:bg-primary-50'
      }`}
    >
      {label}
    </button>
  )
}
