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
    <div className="flex items-center gap-2 sm:gap-3 min-w-max sm:min-w-0 sm:flex-wrap">
      {/* Format Filters */}
      {formatButtons.map((button) => {
        const Icon = button.icon
        const isActive = filters.formats.includes(button.id)
        return (
          <button
            key={button.id}
            type="button"
            onClick={() => toggleFormat(button.id)}
            className={`flex items-center gap-1.5 rounded-xl border-2 px-3.5 py-2.5 text-sm font-medium transition-all touch-manipulation whitespace-nowrap ${
              isActive
                ? 'border-teal-500 bg-teal-500 text-white shadow-sm'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-teal-300 hover:bg-teal-50'
            }`}
            aria-pressed={isActive}
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{button.label}</span>
          </button>
        )
      })}

      {/* Accepting Clients Filter */}
      <button
        type="button"
        onClick={toggleAcceptingClients}
        className={`flex items-center gap-1.5 rounded-xl border-2 px-3.5 py-2.5 text-sm font-medium transition-all touch-manipulation whitespace-nowrap ${
          filters.acceptingClients === true
            ? 'border-teal-500 bg-teal-500 text-white shadow-sm'
            : 'border-neutral-200 bg-white text-neutral-700 hover:border-teal-300 hover:bg-teal-50'
        }`}
        aria-pressed={filters.acceptingClients === true}
      >
        <CheckCircle2 className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">Nimmt Klienten an</span>
        <span className="sm:hidden">Verfügbar</span>
      </button>
    </div>
  )
}
