'use client';

import React from 'react';
import { User } from 'lucide-react';
import type { GenderFilter as GenderFilterType } from '@/hooks/useTherapistFiltering';

export type GenderFilterProps = {
  gender: GenderFilterType;
  onChange: (gender: GenderFilterType) => void;
};

const GENDER_OPTIONS: { value: GenderFilterType; label: string }[] = [
  { value: 'any', label: 'Egal' },
  { value: 'female', label: 'Weiblich' },
  { value: 'male', label: 'Männlich' },
];

export function GenderFilter({ gender, onChange }: GenderFilterProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-slate-700 flex items-center gap-2">
        <User className="h-4 w-4" />
        Geschlecht
      </p>
      <div className="grid grid-cols-3 gap-2">
        {GENDER_OPTIONS.map((option) => {
          const isSelected = gender === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all min-h-[40px] ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              aria-pressed={isSelected}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
