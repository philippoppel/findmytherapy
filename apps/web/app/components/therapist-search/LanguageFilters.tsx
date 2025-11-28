'use client';

import React from 'react';

export type LanguageFiltersProps = {
  availableLanguages: string[];
  selectedLanguages: Set<string>;
  onChange: (languages: Set<string>) => void;
  compact?: boolean;
};

export function LanguageFilters({
  availableLanguages,
  selectedLanguages,
  onChange,
  compact = false,
}: LanguageFiltersProps) {
  const handleToggle = (language: string) => {
    const newLanguages = new Set(selectedLanguages);
    if (newLanguages.has(language)) {
      newLanguages.delete(language);
    } else {
      newLanguages.add(language);
    }
    onChange(newLanguages);
  };

  if (availableLanguages.length === 0) {
    return null;
  }

  return (
    <div>
      {!compact && <p className="mb-3 text-sm font-medium text-slate-700">Sprachen</p>}
      {compact ? (
        // Compact: Wrapped grid layout for sidebar
        <div className="flex flex-wrap gap-1.5">
          {availableLanguages.map((language) => {
            const isSelected = selectedLanguages.has(language);
            return (
              <button
                key={language}
                type="button"
                onClick={() => handleToggle(language)}
                className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'border-primary-400 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
                aria-pressed={isSelected}
              >
                {language}
              </button>
            );
          })}
        </div>
      ) : (
        // Regular: Horizontal scrollable container - swipeable on mobile
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
          <div className="flex gap-2" style={{ width: 'max-content' }}>
            {availableLanguages.map((language) => {
              const isSelected = selectedLanguages.has(language);
              return (
                <button
                  key={language}
                  type="button"
                  onClick={() => handleToggle(language)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  aria-pressed={isSelected}
                >
                  {language}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
