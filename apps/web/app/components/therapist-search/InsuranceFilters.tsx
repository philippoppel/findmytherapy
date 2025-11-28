'use client';

import React from 'react';
import { Shield } from 'lucide-react';

export type InsuranceFiltersProps = {
  availableInsuranceProviders: string[];
  acceptsInsurance: boolean;
  onAcceptsInsuranceChange: (accepts: boolean) => void;
  insuranceProviders: Set<string>;
  onInsuranceProvidersChange: (providers: Set<string>) => void;
  compact?: boolean;
};

export function InsuranceFilters({
  availableInsuranceProviders,
  acceptsInsurance,
  onAcceptsInsuranceChange,
  insuranceProviders,
  onInsuranceProvidersChange,
  compact = false,
}: InsuranceFiltersProps) {
  const handleToggleProvider = (provider: string) => {
    const newProviders = new Set(insuranceProviders);
    if (newProviders.has(provider)) {
      newProviders.delete(provider);
    } else {
      newProviders.add(provider);
    }
    onInsuranceProvidersChange(newProviders);
  };

  return (
    <div className={compact ? 'space-y-2' : 'space-y-4'}>
      {/* General insurance toggle - hidden in compact mode as it's shown in parent */}
      {!compact && (
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptsInsurance}
              onChange={(e) => onAcceptsInsuranceChange(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-400 focus:ring-offset-0"
            />
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Shield className="h-4 w-4 text-primary-500" />
              Akzeptiert Versicherung
            </span>
          </label>
        </div>
      )}

      {/* Specific insurance providers */}
      {availableInsuranceProviders.length > 0 && (
        <div>
          {!compact && <p className="mb-3 text-sm font-medium text-slate-700">Spezifische Versicherungen</p>}
          <div className={`space-y-1.5 max-h-36 overflow-y-auto ${compact ? '' : 'pr-2'}`}>
            {availableInsuranceProviders.map((provider) => {
              const isSelected = insuranceProviders.has(provider);
              return (
                <label key={provider} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleProvider(provider)}
                    className={`rounded border-slate-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-400 focus:ring-offset-0 ${
                      compact ? 'h-3.5 w-3.5' : 'h-4 w-4'
                    }`}
                  />
                  <span className={`text-slate-600 group-hover:text-slate-900 transition-colors ${
                    compact ? 'text-xs' : 'text-sm'
                  }`}>
                    {provider}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
