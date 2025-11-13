'use client'

import { Monitor, Users, Blend, CheckCircle2 } from 'lucide-react'
import { useCallback } from 'react'
import type { FilterState } from './types'

interface QuickFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: Partial<FilterState>) => void
}

export function QuickFilters({ filters, onFiltersChange }: QuickFiltersProps) {
  const toggleFormat = useCallback(
    (format: 'online' | 'in-person' | 'hybrid') => {
      const currentFormats = filters.formats
      const newFormats = currentFormats.includes(format)
        ? currentFormats.filter((f) => f !== format)
        : [...currentFormats, format]
      onFiltersChange({ formats: newFormats })
    },
    [filters.formats, onFiltersChange],
  )

  const toggleAcceptingClients = useCallback(() => {
    onFiltersChange({
      acceptingClients: filters.acceptingClients === true ? null : true,
    })
  }, [filters.acceptingClients, onFiltersChange])

  const formatButtons = [
    { id: 'online' as const, label: 'Online', icon: Monitor },
    { id: 'in-person' as const, label: 'Präsenz', icon: Users },
    { id: 'hybrid' as const, label: 'Hybrid', icon: Blend },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {/* Format Filters */}
      {formatButtons.map((button) => {
        const Icon = button.icon
        const isActive = filters.formats.includes(button.id)
        return (
          <button
            key={button.id}
            type="button"
            onClick={() => toggleFormat(button.id)}
            className={`flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-medium transition-all sm:px-5 sm:py-3 sm:text-base ${
              isActive
                ? 'border-primary-500 bg-primary-500 text-white shadow-md'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50'
            }`}
            aria-pressed={isActive}
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            {button.label}
          </button>
        )
      })}

      {/* Accepting Clients Filter */}
      <button
        type="button"
        onClick={toggleAcceptingClients}
        className={`flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-medium transition-all sm:px-5 sm:py-3 sm:text-base ${
          filters.acceptingClients === true
            ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
            : 'border-neutral-200 bg-white text-neutral-700 hover:border-emerald-300 hover:bg-emerald-50'
        }`}
        aria-pressed={filters.acceptingClients === true}
      >
        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
        Nimmt Klienten an
      </button>
    </div>
  )
}
