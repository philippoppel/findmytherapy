'use client'

import { Check } from 'lucide-react'

export type SpecializationFiltersProps = {
  availableSpecializations: string[]
  selectedSpecializations: Set<string>
  onChange: (specializations: Set<string>) => void
  className?: string
}

export function SpecializationFilters({
  availableSpecializations,
  selectedSpecializations,
  onChange,
  className = '',
}: SpecializationFiltersProps) {
  const handleToggle = (specialization: string) => {
    const newSet = new Set(selectedSpecializations)
    if (newSet.has(specialization)) {
      newSet.delete(specialization)
    } else {
      newSet.add(specialization)
    }
    onChange(newSet)
  }

  if (availableSpecializations.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/70">
        Spezialisierung
      </p>
      <div className="flex flex-wrap gap-2">
        {availableSpecializations.map((specialization) => {
          const isSelected = selectedSpecializations.has(specialization)
          return (
            <button
              key={specialization}
              type="button"
              onClick={() => handleToggle(specialization)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all min-h-[36px] ${
                isSelected
                  ? 'border-primary-400 bg-primary-500/30 text-white'
                  : 'border-white/30 bg-white/10 text-white/80 hover:bg-white/15'
              }`}
              aria-pressed={isSelected}
            >
              {isSelected && <Check className="h-3 w-3" aria-hidden />}
              <span>{specialization}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
