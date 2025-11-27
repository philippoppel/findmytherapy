'use client';

import React from 'react';

export type LanguageFiltersProps = {
  availableLanguages: string[];
  selectedLanguages: Set<string>;
  onChange: (languages: Set<string>) => void;
};

export function LanguageFilters({
  availableLanguages,
  selectedLanguages,
  onChange,
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
      <p className="mb-3 text-sm font-medium text-white/90">Sprachen</p>
      {/* Horizontal scrollable container - swipeable on mobile */}
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
                    ? 'border-primary-400 bg-primary-500/30 text-white'
                    : 'border-white/30 bg-white/10 text-white/80 hover:bg-white/15'
                }`}
                aria-pressed={isSelected}
              >
                {language}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
