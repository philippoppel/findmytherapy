'use client'

import { X } from 'lucide-react'
import { useCallback } from 'react'
import type { FilterState } from './types'
import { initialFilters } from './types'

interface ActiveFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: Partial<FilterState>) => void
  resultCount: number
}

export function ActiveFilters({ filters, onFiltersChange, resultCount }: ActiveFiltersProps) {
  const activeFilterCount = getActiveFilterCount(filters)

  const handleClearAll = useCallback(() => {
    onFiltersChange(initialFilters)
  }, [onFiltersChange])

  const removeFilter = useCallback(
    (key: keyof FilterState, value?: string) => {
      if (key === 'searchQuery') {
        onFiltersChange({ searchQuery: '' })
      } else if (key === 'acceptingClients') {
        onFiltersChange({ acceptingClients: null })
      } else if (Array.isArray(filters[key])) {
        const currentArray = filters[key] as string[]
        onFiltersChange({
          [key]: value ? currentArray.filter((v) => v !== value) : [],
        })
      } else if (key === 'location') {
        onFiltersChange({ location: '' })
      }
    },
    [filters, onFiltersChange],
  )

  if (activeFilterCount === 0) {
    return (
      <div className="text-center text-sm text-neutral-600 py-2">
        <span className="font-medium">{resultCount}</span> Therapeut:innen gefunden
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search Query */}
        {filters.searchQuery && (
          <FilterPill
            label={`Suche: "${filters.searchQuery}"`}
            onRemove={() => removeFilter('searchQuery')}
          />
        )}

        {/* Formats */}
        {filters.formats.map((format) => (
          <FilterPill
            key={format}
            label={formatLabel(format)}
            onRemove={() => removeFilter('formats', format)}
          />
        ))}

        {/* Accepting Clients */}
        {filters.acceptingClients && (
          <FilterPill
            label="Nimmt Klienten an"
            onRemove={() => removeFilter('acceptingClients')}
          />
        )}

        {/* Location */}
        {filters.location && (
          <FilterPill
            label={`Ort: ${filters.location}`}
            onRemove={() => removeFilter('location')}
          />
        )}

        {/* Specialties */}
        {filters.specialties.map((specialty) => (
          <FilterPill
            key={specialty}
            label={specialty}
            onRemove={() => removeFilter('specialties', specialty)}
          />
        ))}

        {/* Languages */}
        {filters.languages.map((language) => (
          <FilterPill
            key={language}
            label={language}
            onRemove={() => removeFilter('languages', language)}
          />
        ))}

        {/* Modalities */}
        {filters.modalities.map((modality) => (
          <FilterPill
            key={modality}
            label={modality}
            onRemove={() => removeFilter('modalities', modality)}
          />
        ))}

        {/* Insurance */}
        {filters.insurance.map((ins) => (
          <FilterPill
            key={ins}
            label={`Versicherung: ${ins}`}
            onRemove={() => removeFilter('insurance', ins)}
          />
        ))}

        {/* Age Groups */}
        {filters.ageGroups.map((age) => (
          <FilterPill
            key={age}
            label={age}
            onRemove={() => removeFilter('ageGroups', age)}
          />
        ))}

        {/* Clear All */}
        <button
          type="button"
          onClick={handleClearAll}
          className="rounded-full border-2 border-neutral-300 bg-white px-4 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
        >
          Alle löschen
        </button>
      </div>

      <div className="text-center text-sm text-neutral-600">
        <span className="font-medium">{resultCount}</span> Therapeut:innen gefunden
      </div>
    </div>
  )
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="flex items-center gap-1.5 rounded-full border border-primary-300 bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100"
    >
      <span>{label}</span>
      <X className="h-3.5 w-3.5" aria-hidden />
    </button>
  )
}

function getActiveFilterCount(filters: FilterState): number {
  let count = 0
  if (filters.searchQuery) count++
  if (filters.acceptingClients) count++
  if (filters.location) count++
  count += filters.formats.length
  count += filters.specialties.length
  count += filters.languages.length
  count += filters.modalities.length
  count += filters.insurance.length
  count += filters.ageGroups.length
  return count
}

function formatLabel(format: 'online' | 'in-person' | 'hybrid'): string {
  switch (format) {
    case 'online':
      return 'Online'
    case 'in-person':
      return 'Präsenz'
    case 'hybrid':
      return 'Hybrid'
  }
}
