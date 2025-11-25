'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import type { SortOption } from '../../hooks/useTherapistFiltering';

export type SortOptionsProps = {
  sortBy: SortOption;
  onChange: (sortBy: SortOption) => void;
};

const SORT_OPTIONS: { value: SortOption; label: string; description: string }[] = [
  {
    value: 'relevance',
    label: 'Relevanz',
    description: 'Verifiziert & Verfügbarkeit',
  },
  {
    value: 'availability',
    label: 'Verfügbarkeit',
    description: 'Schnellste Termine',
  },
  {
    value: 'distance',
    label: 'Entfernung',
    description: 'Nächstgelegene zuerst',
  },
  {
    value: 'price-low',
    label: 'Preis aufsteigend',
    description: 'Günstigste zuerst',
  },
  {
    value: 'price-high',
    label: 'Preis absteigend',
    description: 'Teuerste zuerst',
  },
  {
    value: 'experience',
    label: 'Erfahrung',
    description: 'Meiste Jahre Praxis',
  },
  {
    value: 'rating',
    label: 'Bewertung',
    description: 'Beste Bewertungen',
  },
];

export function SortOptions({ sortBy, onChange }: SortOptionsProps) {
  const currentOption = SORT_OPTIONS.find((opt) => opt.value === sortBy);

  return (
    <div className="w-full">
      <label htmlFor="sort-select" className="mb-2 block text-sm font-medium text-white/90">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Sortieren nach
        </div>
      </label>

      <select
        id="sort-select"
        value={sortBy}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm text-white focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 backdrop-blur cursor-pointer"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="bg-gray-900 text-white">
            {option.label} – {option.description}
          </option>
        ))}
      </select>

      {currentOption && <p className="mt-1.5 text-xs text-white/60">{currentOption.description}</p>}
    </div>
  );
}
