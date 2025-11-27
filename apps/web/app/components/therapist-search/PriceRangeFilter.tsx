'use client';

import React, { useState, useEffect } from 'react';
import { Euro } from 'lucide-react';

export type PriceRangeFilterProps = {
  priceRange: { min: number; max: number } | null;
  onChange: (range: { min: number; max: number } | null) => void;
  priceRangeStats: { min: number; max: number } | null;
};

export function PriceRangeFilter({ priceRange, onChange, priceRangeStats }: PriceRangeFilterProps) {
  const [enabled, setEnabled] = useState(priceRange !== null);
  const [minValue, setMinValue] = useState<string>(
    priceRange?.min.toString() ?? priceRangeStats?.min.toString() ?? '50',
  );
  const [maxValue, setMaxValue] = useState<string>(
    priceRange?.max.toString() ?? priceRangeStats?.max.toString() ?? '200',
  );

  useEffect(() => {
    setEnabled(priceRange !== null);
    if (priceRange) {
      setMinValue(priceRange.min.toString());
      setMaxValue(priceRange.max.toString());
    }
  }, [priceRange]);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);

    if (newEnabled) {
      const min = parseInt(minValue) || priceRangeStats?.min || 50;
      const max = parseInt(maxValue) || priceRangeStats?.max || 200;
      onChange({ min, max });
    } else {
      onChange(null);
    }
  };

  const handleMinChange = (value: string) => {
    setMinValue(value);
    if (enabled && value) {
      const min = parseInt(value);
      const max = parseInt(maxValue);
      if (!isNaN(min) && !isNaN(max)) {
        onChange({ min, max });
      }
    }
  };

  const handleMaxChange = (value: string) => {
    setMaxValue(value);
    if (enabled && value) {
      const min = parseInt(minValue);
      const max = parseInt(value);
      if (!isNaN(min) && !isNaN(max)) {
        onChange({ min, max });
      }
    }
  };

  if (!priceRangeStats) {
    return null;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">Preisbereich</p>
        <button
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-primary-500' : 'bg-slate-300'
          }`}
          aria-pressed={enabled}
          aria-label="Preisfilter aktivieren/deaktivieren"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="price-min" className="mb-1 block text-xs text-slate-500">
                Min. €
              </label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="price-min"
                  type="number"
                  value={minValue}
                  onChange={(e) => handleMinChange(e.target.value)}
                  min={priceRangeStats.min}
                  max={priceRangeStats.max}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50"
                  placeholder={priceRangeStats.min.toString()}
                />
              </div>
            </div>

            <div>
              <label htmlFor="price-max" className="mb-1 block text-xs text-slate-500">
                Max. €
              </label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="price-max"
                  type="number"
                  value={maxValue}
                  onChange={(e) => handleMaxChange(e.target.value)}
                  min={priceRangeStats.min}
                  max={priceRangeStats.max}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50"
                  placeholder={priceRangeStats.max.toString()}
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Verfügbar: {priceRangeStats.min}€ - {priceRangeStats.max}€ pro Sitzung
          </p>
        </div>
      )}
    </div>
  );
}
