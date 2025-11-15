'use client'

import React from 'react'
import { Shield } from 'lucide-react'

export type InsuranceFiltersProps = {
  availableInsuranceProviders: string[]
  acceptsInsurance: boolean
  onAcceptsInsuranceChange: (accepts: boolean) => void
  insuranceProviders: Set<string>
  onInsuranceProvidersChange: (providers: Set<string>) => void
}

export function InsuranceFilters({
  availableInsuranceProviders,
  acceptsInsurance,
  onAcceptsInsuranceChange,
  insuranceProviders,
  onInsuranceProvidersChange,
}: InsuranceFiltersProps) {
  const handleToggleProvider = (provider: string) => {
    const newProviders = new Set(insuranceProviders)
    if (newProviders.has(provider)) {
      newProviders.delete(provider)
    } else {
      newProviders.add(provider)
    }
    onInsuranceProvidersChange(newProviders)
  }

  return (
    <div className="space-y-4">
      {/* General insurance toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptsInsurance}
            onChange={(e) => onAcceptsInsuranceChange(e.target.checked)}
            className="h-5 w-5 rounded border-white/30 bg-white/10 text-primary-600 focus:ring-2 focus:ring-primary-400 focus:ring-offset-0"
          />
          <span className="flex items-center gap-2 text-sm font-medium text-white/90">
            <Shield className="h-4 w-4 text-primary-400" />
            Akzeptiert Versicherung
          </span>
        </label>
      </div>

      {/* Specific insurance providers */}
      {availableInsuranceProviders.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-white/90">
            Spezifische Versicherungen
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {availableInsuranceProviders.map((provider) => {
              const isSelected = insuranceProviders.has(provider)
              return (
                <label
                  key={provider}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleProvider(provider)}
                    className="h-4 w-4 rounded border-white/30 bg-white/10 text-primary-600 focus:ring-2 focus:ring-primary-400 focus:ring-offset-0"
                  />
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                    {provider}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
