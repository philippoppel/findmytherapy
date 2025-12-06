'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import type { SortOption } from '@/hooks/useTherapistFiltering';

export type SortOptionsProps = {
  sortBy: SortOption;
  onChange: (sortBy: SortOption) => void;
  compact?: boolean;
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

export function SortOptions({ sortBy, onChange, compact = false }: SortOptionsProps) {
  const currentOption = SORT_OPTIONS.find((opt) => opt.value === sortBy);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-slate-400" />
        <select
          id="sort-select-compact"
          value={sortBy}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 cursor-pointer"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-white text-slate-900">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label htmlFor="sort-select" className="mb-2 block text-sm font-medium text-slate-700">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Sortieren nach
        </div>
      </label>

      <select
        id="sort-select"
        value={sortBy}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 cursor-pointer"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="bg-white text-slate-900">
            {option.label} – {option.description}
          </option>
        ))}
      </select>

      {currentOption && <p className="mt-1.5 text-xs text-slate-500">{currentOption.description}</p>}
    </div>
  );
}
