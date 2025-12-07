'use client';

import { Check } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export type SpecializationFiltersProps = {
  availableSpecializations: string[];
  selectedSpecializations: Set<string>;
  onChange: (specializations: Set<string>) => void;
  className?: string;
  compact?: boolean;
};

export function SpecializationFilters({
  availableSpecializations,
  selectedSpecializations,
  onChange,
  className = '',
  compact = false,
}: SpecializationFiltersProps) {
  const { t } = useTranslation();

  const handleToggle = (specialization: string) => {
    const newSet = new Set(selectedSpecializations);
    if (newSet.has(specialization)) {
      newSet.delete(specialization);
    } else {
      newSet.add(specialization);
    }
    onChange(newSet);
  };

  if (availableSpecializations.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {!compact && (
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
          {t('directory.specialization')}
        </p>
      )}
      {compact ? (
        // Compact: Wrapped grid layout for sidebar
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
          {availableSpecializations.map((specialization) => {
            const isSelected = selectedSpecializations.has(specialization);
            return (
              <button
                key={specialization}
                type="button"
                onClick={() => handleToggle(specialization)}
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'border-primary-400 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
                aria-pressed={isSelected}
              >
                {isSelected && <Check className="h-2.5 w-2.5" aria-hidden />}
                <span>{specialization}</span>
              </button>
            );
          })}
        </div>
      ) : (
        // Regular: Horizontal scrollable container - swipeable on mobile
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
          <div className="flex gap-2" style={{ width: 'max-content' }}>
            {availableSpecializations.map((specialization) => {
              const isSelected = selectedSpecializations.has(specialization);
              return (
                <button
                  key={specialization}
                  type="button"
                  onClick={() => handleToggle(specialization)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all min-h-[36px] whitespace-nowrap ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  aria-pressed={isSelected}
                >
                  {isSelected && <Check className="h-3 w-3" aria-hidden />}
                  <span>{specialization}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
