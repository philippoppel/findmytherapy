'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@mental-health/ui'

type FilterState = {
  formats: string[]
  specialties: string[]
  languages: string[]
}

type TherapistFiltersProps = {
  availableSpecialties: string[]
  availableLanguages: string[]
  onFilterChange: (filters: FilterState) => void
  className?: string
}

export function TherapistFilters({
  availableSpecialties,
  availableLanguages,
  onFilterChange,
  className = '',
}: TherapistFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    formats: [],
    specialties: [],
    languages: [],
  })

  const formatOptions = [
    { value: 'online', label: 'Online' },
    { value: 'praesenz', label: 'Präsenz' },
    { value: 'hybrid', label: 'Hybrid' },
  ]

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const newFilters = {
      ...filters,
      [category]: filters[category].includes(value)
        ? filters[category].filter((item) => item !== value)
        : [...filters[category], value],
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearAllFilters = () => {
    const emptyFilters = {
      formats: [],
      specialties: [],
      languages: [],
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const activeFilterCount =
    filters.formats.length + filters.specialties.length + filters.languages.length

  return (
    <div className={`rounded-2xl border border-divider bg-white/90 ${className}`}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left transition hover:bg-surface-1/50"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" aria-hidden />
          <span className="font-semibold text-default">Filter</span>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </div>
        {isExpanded && activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              clearAllFilters()
            }}
          >
            <X className="mr-1 h-3 w-3" aria-hidden />
            Filter löschen
          </Button>
        )}
      </button>

      {isExpanded && (
        <div className="space-y-4 border-t border-divider p-4">
          {/* Format Filter */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-default">Format</h4>
            <div className="flex flex-wrap gap-2">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleFilter('formats', option.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    filters.formats.includes(option.value)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-divider bg-white text-default hover:border-primary/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spezialisierung Filter */}
          {availableSpecialties.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-default">Schwerpunkte</h4>
              <div className="flex flex-wrap gap-2">
                {availableSpecialties.slice(0, 10).map((specialty) => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => toggleFilter('specialties', specialty)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      filters.specialties.includes(specialty)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-divider bg-white text-default hover:border-primary/50'
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
              {availableSpecialties.length > 10 && (
                <p className="mt-2 text-xs text-muted">
                  +{availableSpecialties.length - 10} weitere Schwerpunkte verfügbar
                </p>
              )}
            </div>
          )}

          {/* Sprachen Filter */}
          {availableLanguages.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-default">Sprachen</h4>
              <div className="flex flex-wrap gap-2">
                {availableLanguages.slice(0, 8).map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => toggleFilter('languages', language)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      filters.languages.includes(language)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-divider bg-white text-default hover:border-primary/50'
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
              {availableLanguages.length > 8 && (
                <p className="mt-2 text-xs text-muted">
                  +{availableLanguages.length - 8} weitere Sprachen verfügbar
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
