'use client'

import { Search, X } from 'lucide-react'
import { useCallback } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Suche nach Name, Spezialisierung, Thema...',
}: SearchBarProps) {
  const handleClear = useCallback(() => {
    onChange('')
  }, [onChange])

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Search className="h-5 w-5 text-neutral-400" aria-hidden />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border-2 border-neutral-200 bg-white pl-12 pr-12 text-base text-neutral-900 placeholder:text-neutral-400 transition-all focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100 sm:h-16 sm:text-lg"
        aria-label="Therapeuten suchen"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 transition-colors hover:text-neutral-600"
          aria-label="Suche löschen"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      )}
    </div>
  )
}
