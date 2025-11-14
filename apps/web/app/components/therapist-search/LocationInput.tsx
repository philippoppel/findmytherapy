'use client'

import { useState, useEffect } from 'react'
import { MapPin, LocateFixed, Loader2 } from 'lucide-react'
import type { Coordinates } from '../../therapists/location-data'
import { validateLocationInput } from '../../therapists/location-data'

export type LocationInputProps = {
  value: string
  onChange: (value: string) => void
  onCoordinatesChange: (coordinates: Coordinates | null) => void
  nearbyOnly: boolean
  onNearbyOnlyChange: (nearby: boolean) => void
  radius: number
  onRadiusChange: (radius: number) => void
  className?: string
}

type GeoStatus = 'idle' | 'loading' | 'error'

const RADIUS_OPTIONS = [25, 50, 75, 120] as const

export function LocationInput({
  value,
  onChange,
  onCoordinatesChange,
  nearbyOnly,
  onNearbyOnlyChange,
  radius,
  onRadiusChange,
  className = '',
}: LocationInputProps) {
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle')
  const [geoError, setGeoError] = useState<string>('')
  const [locationError, setLocationError] = useState<string>('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Validate location input when it changes
  useEffect(() => {
    if (!value.trim()) {
      setLocationError('')
      setSuggestions([])
      onCoordinatesChange(null)
      return
    }

    const result = validateLocationInput(value)

    if (result.valid) {
      setLocationError('')
      setSuggestions([])
      onCoordinatesChange(result.coordinates)
    } else {
      setLocationError(result.error)
      setSuggestions(result.suggestions)
      onCoordinatesChange(null)
    }
  }, [value, onCoordinatesChange])

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation wird von deinem Browser nicht unterstützt.')
      setGeoStatus('error')
      return
    }

    setGeoStatus('loading')
    setGeoError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        onCoordinatesChange(coords)
        setGeoStatus('idle')
        onNearbyOnlyChange(true)
        // Clear text input when using geolocation
        onChange('')
        setLocationError('')
        setSuggestions([])
      },
      (error) => {
        setGeoStatus('error')
        if (error.code === 1) {
          setGeoError('Standort-Berechtigung verweigert. Gib manuell eine Stadt ein.')
        } else if (error.code === 2) {
          setGeoError('Standort konnte nicht ermittelt werden.')
        } else if (error.code === 3) {
          setGeoError('Zeitüberschreitung. Versuche es erneut.')
        } else {
          setGeoError(error.message || 'Standort konnte nicht ermittelt werden.')
        }
      },
      {
        maximumAge: 1000 * 60 * 5, // Cache for 5 minutes
        timeout: 10000, // 10 second timeout
        enableHighAccuracy: false,
      }
    )
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setSuggestions([])
    setLocationError('')
  }

  return (
    <div className={className}>
      {/* Location Input */}
      <div className="relative">
        <div className="relative">
          <MapPin
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
            aria-hidden
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Wien, 1010, Graz..."
            className="w-full min-h-[44px] rounded-xl border border-white/30 bg-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 backdrop-blur transition-colors"
            aria-label="Standort eingeben"
            aria-describedby={locationError ? 'location-error' : undefined}
          />
        </div>

        {/* Geolocation Button */}
        <button
          type="button"
          onClick={handleGeolocation}
          disabled={geoStatus === 'loading'}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/15 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px]"
          aria-label="Meinen Standort verwenden"
        >
          {geoStatus === 'loading' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              <span>Standort wird ermittelt...</span>
            </>
          ) : (
            <>
              <LocateFixed className="h-4 w-4" aria-hidden />
              <span>Mein Standort</span>
            </>
          )}
        </button>
      </div>

      {/* Location Error + Suggestions */}
      {locationError && nearbyOnly && (
        <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <p className="text-xs text-red-200" id="location-error">
            <span className="font-semibold">⚠️ {locationError}</span>
          </p>
          {suggestions.length > 0 && (
            <div className="mt-2">
              <p className="mb-1.5 text-xs text-red-200/80">Meintest du:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/20 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Geolocation Error */}
      {geoError && (
        <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
          <p className="text-xs text-amber-200">⚠️ {geoError}</p>
        </div>
      )}

      {/* Nearby Toggle + Radius Picker */}
      <div className="mt-4 space-y-3">
        {/* Nearby Toggle */}
        <button
          type="button"
          onClick={() => onNearbyOnlyChange(!nearbyOnly)}
          className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-medium transition-all min-h-[44px] ${
            nearbyOnly
              ? 'border-primary-400 bg-primary-500/20 text-white'
              : 'border-white/30 bg-white/10 text-white/80 hover:bg-white/15'
          }`}
          aria-pressed={nearbyOnly}
          aria-label="Nur Therapeuten in meiner Nähe anzeigen"
        >
          <span>Nur in meiner Nähe</span>
          <div
            className={`h-5 w-9 rounded-full transition-colors ${
              nearbyOnly ? 'bg-primary-500' : 'bg-white/30'
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                nearbyOnly ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </button>

        {/* Radius Picker (only when nearby is active) */}
        {nearbyOnly && (
          <div>
            <p className="mb-2 text-xs font-medium text-white/70">Umkreis:</p>
            <div className="grid grid-cols-4 gap-2">
              {RADIUS_OPTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onRadiusChange(r)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all min-h-[40px] ${
                    radius === r
                      ? 'border-primary-400 bg-primary-500/30 text-white'
                      : 'border-white/30 bg-white/10 text-white/80 hover:bg-white/15'
                  }`}
                  aria-pressed={radius === r}
                  aria-label={`${r} Kilometer Umkreis`}
                >
                  {r}km
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
