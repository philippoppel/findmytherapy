'use client';

import { ArrowUpDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { SortOption } from './types';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'recommended', label: 'Empfohlen' },
  { value: 'availability', label: 'Verfügbarkeit' },
  { value: 'experience', label: 'Erfahrung' },
  { value: 'price-low', label: 'Preis: Niedrig → Hoch' },
  { value: 'price-high', label: 'Preis: Hoch → Niedrig' },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const currentLabel = sortOptions.find((opt) => opt.value === value)?.label || 'Empfohlen';

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border-2 border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-primary-300 hover:bg-primary-50 sm:px-5 sm:py-3 sm:text-base"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <ArrowUpDown className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
        <span>Sortieren: {currentLabel}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border-2 border-neutral-200 bg-white shadow-xl">
          <ul role="listbox" className="py-2">
            {sortOptions.map((option) => {
              const isSelected = value === option.value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-primary-600" aria-hidden />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
