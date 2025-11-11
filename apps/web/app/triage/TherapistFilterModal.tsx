'use client'

import { useState, useEffect } from 'react'
import { X, Filter, Search } from 'lucide-react'
import { Button } from '@mental-health/ui'
import { motion, AnimatePresence } from 'framer-motion'

type FilterState = {
  formats: string[]
  specialties: string[]
  languages: string[]
}

type TherapistFilterModalProps = {
  isOpen: boolean
  onClose: () => void
  availableSpecialties: string[]
  availableLanguages: string[]
  onApplyFilters: (filters: FilterState) => void
  initialFilters?: FilterState
}

const formatOptions = [
  { value: 'online', label: 'Online' },
  { value: 'praesenz', label: 'Vor Ort' },
  { value: 'hybrid', label: 'Hybrid' },
]

export function TherapistFilterModal({
  isOpen,
  onClose,
  availableSpecialties,
  availableLanguages,
  onApplyFilters,
  initialFilters,
}: TherapistFilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      formats: [],
      specialties: [],
      languages: [],
    }
  )

  // Reset filters when modal opens with new initial filters
  useEffect(() => {
    if (isOpen && initialFilters) {
      setFilters(initialFilters)
    }
  }, [isOpen, initialFilters])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      formats: [],
      specialties: [],
      languages: [],
    })
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  const activeFilterCount =
    filters.formats.length + filters.specialties.length + filters.languages.length

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-teal-900/95 to-cyan-900/95 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Filter className="h-5 w-5 text-white" aria-hidden />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Erweiterte Filter</h2>
                <p className="text-sm text-white/70">Finde die passende Therapeut:in</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Schließen"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            <div className="space-y-6">
              {/* Format Filter */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">Format</h3>
                  {filters.formats.length > 0 && (
                    <span className="text-xs text-white/60">{filters.formats.length} ausgewählt</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {formatOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleFilter('formats', option.value)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        filters.formats.includes(option.value)
                          ? 'border-teal-400 bg-teal-400 text-teal-950'
                          : 'border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/20'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialties Filter */}
              {availableSpecialties.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">Schwerpunkte</h3>
                    {filters.specialties.length > 0 && (
                      <span className="text-xs text-white/60">{filters.specialties.length} ausgewählt</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSpecialties.map((specialty) => (
                      <button
                        key={specialty}
                        type="button"
                        onClick={() => toggleFilter('specialties', specialty)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          filters.specialties.includes(specialty)
                            ? 'border-teal-400 bg-teal-400 text-teal-950'
                            : 'border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/20'
                        }`}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages Filter */}
              {availableLanguages.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">Sprachen</h3>
                    {filters.languages.length > 0 && (
                      <span className="text-xs text-white/60">{filters.languages.length} ausgewählt</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableLanguages.map((language) => (
                      <button
                        key={language}
                        type="button"
                        onClick={() => toggleFilter('languages', language)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          filters.languages.includes(language)
                            ? 'border-teal-400 bg-teal-400 text-teal-950'
                            : 'border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/20'
                        }`}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 ? (
                <>
                  <span className="text-sm text-white/80">
                    {activeFilterCount} {activeFilterCount === 1 ? 'Filter' : 'Filter'} aktiv
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    Zurücksetzen
                  </Button>
                </>
              ) : (
                <span className="text-sm text-white/50">Keine Filter ausgewählt</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-white/60 bg-white/5 text-white hover:border-white hover:bg-white/15"
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleApply}
                className="bg-teal-600 text-white shadow-lg hover:bg-teal-500"
              >
                <Search className="mr-2 h-4 w-4" aria-hidden />
                Anwenden
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
