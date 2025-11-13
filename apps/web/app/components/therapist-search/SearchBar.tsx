'use client'

import { Search, X } from 'lucide-react'
import { useCallback, useState, useEffect } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Suche nach Name, Spezialisierung, Thema...',
  debounceMs = 300,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounce onChange
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [localValue, value, onChange, debounceMs])

  const handleClear = useCallback(() => {
    setLocalValue('')
    onChange('')
  }, [onChange])

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 sm:pl-6">
        <Search className="h-5 w-5 text-neutral-400" aria-hidden />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border-2 border-neutral-200 bg-white pl-12 pr-12 text-base text-neutral-900 placeholder:text-neutral-400 transition-all focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-100 sm:h-16 sm:pl-14 sm:text-lg"
        aria-label="Therapeuten suchen"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-5 text-neutral-400 transition-colors hover:text-neutral-600 active:text-neutral-700"
          aria-label="Suche löschen"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      )}
    </div>
  )
}
