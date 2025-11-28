'use client';

import { useState, useEffect } from 'react';
import { MapPin, LocateFixed, Loader2 } from 'lucide-react';
import type { Coordinates } from '../../therapists/location-data';
import { validateLocationInput } from '../../therapists/location-data';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

export type LocationInputProps = {
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange: (coordinates: Coordinates | null) => void;
  nearbyOnly: boolean;
  onNearbyOnlyChange: (nearby: boolean) => void;
  radius: number;
  onRadiusChange: (radius: number) => void;
  className?: string;
  compact?: boolean;
};

type GeoStatus = 'idle' | 'loading' | 'error';

const RADIUS_OPTIONS = [25, 50, 75, 120] as const;

export function LocationInput({
  value,
  onChange,
  onCoordinatesChange,
  nearbyOnly,
  onNearbyOnlyChange,
  radius,
  onRadiusChange,
  className = '',
  compact = false,
}: LocationInputProps) {
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');
  const [geoError, setGeoError] = useState<string>('');
  const [locationError, setLocationError] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Debounce location input to prevent validation on every keystroke
  const debouncedValue = useDebouncedValue(value, 500);

  // Validate location input when debounced value changes
  useEffect(() => {
    if (!debouncedValue.trim()) {
      setLocationError('');
      setSuggestions([]);
      onCoordinatesChange(null);
      return;
    }

    const result = validateLocationInput(debouncedValue);

    if (result.valid) {
      setLocationError('');
      setSuggestions([]);
      onCoordinatesChange(result.coordinates);
      // Auto-enable nearby filter when valid location is entered
      if (!nearbyOnly) {
        onNearbyOnlyChange(true);
      }
    } else {
      setLocationError(result.error);
      setSuggestions(result.suggestions);
      onCoordinatesChange(null);
    }
  }, [debouncedValue, onCoordinatesChange, nearbyOnly, onNearbyOnlyChange]);

  const handleGeolocation = async () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation wird von deinem Browser nicht unterstützt.');
      setGeoStatus('error');
      return;
    }

    // Check if geolocation is allowed by permissions policy
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'denied') {
          setGeoError('Standort-Berechtigung verweigert. Gib manuell eine Stadt ein.');
          setGeoStatus('error');
          return;
        }
      }
    } catch {
      // Permissions API not supported or geolocation blocked by policy
      setGeoError('Standorterkennung ist auf dieser Seite nicht verfügbar. Gib manuell eine Stadt ein.');
      setGeoStatus('error');
      return;
    }

    setGeoStatus('loading');
    setGeoError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        onCoordinatesChange(coords);
        setGeoStatus('idle');
        onNearbyOnlyChange(true);
        // Clear text input when using geolocation
        onChange('');
        setLocationError('');
        setSuggestions([]);
      },
      (error) => {
        setGeoStatus('error');
        if (error.code === 1) {
          setGeoError('Standort-Berechtigung verweigert. Gib manuell eine Stadt ein.');
        } else if (error.code === 2) {
          setGeoError('Standort konnte nicht ermittelt werden.');
        } else if (error.code === 3) {
          setGeoError('Zeitüberschreitung. Versuche es erneut.');
        } else {
          setGeoError(error.message || 'Standort konnte nicht ermittelt werden.');
        }
      },
      {
        maximumAge: 1000 * 60 * 5, // Cache for 5 minutes
        timeout: 10000, // 10 second timeout
        enableHighAccuracy: false,
      },
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setSuggestions([]);
    setLocationError('');
  };

  return (
    <div className={className}>
      {/* Location Input */}
      <div className="relative">
        <div className="relative">
          <MapPin
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Wien, 1010, Graz..."
            className={`w-full border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-colors ${
              compact ? 'rounded-lg py-2 min-h-[40px]' : 'rounded-xl py-2.5 min-h-[44px]'
            }`}
            aria-label="Standort eingeben"
            aria-describedby={locationError ? 'location-error' : undefined}
          />
        </div>

        {/* Geolocation Button */}
        <button
          type="button"
          onClick={handleGeolocation}
          disabled={geoStatus === 'loading'}
          className={`mt-3 flex w-full items-center justify-center gap-2 border border-slate-200 bg-slate-50 font-medium text-slate-700 transition-all hover:bg-slate-100 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50 ${
            compact ? 'rounded-lg px-3 py-2 text-xs min-h-[36px]' : 'rounded-xl px-4 py-2.5 text-sm min-h-[44px]'
          }`}
          aria-label="Mein Standort"
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
      {locationError && value.trim() && (
        <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3">
          <p className="text-xs text-amber-800" id="location-error">
            <span className="font-semibold">⚠️ {locationError}</span>
          </p>
          {suggestions.length > 0 && (
            <div className="mt-2">
              <p className="mb-1.5 text-xs text-amber-700">Meintest du:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          {!nearbyOnly && (
            <p className="mt-2 text-xs text-amber-700">
              💡 Aktiviere &ldquo;Nur in meiner Nähe&rdquo; um nach Standort zu filtern
            </p>
          )}
        </div>
      )}

      {/* Geolocation Error */}
      {geoError && (
        <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3">
          <p className="text-xs text-amber-800">⚠️ {geoError}</p>
        </div>
      )}

      {/* Nearby Toggle + Radius Picker */}
      <div className={compact ? 'mt-3 space-y-2' : 'mt-4 space-y-3'}>
        {/* Nearby Toggle */}
        <button
          type="button"
          onClick={() => onNearbyOnlyChange(!nearbyOnly)}
          className={`flex w-full items-center justify-between border font-medium transition-all ${
            compact ? 'rounded-lg px-3 py-2 text-xs min-h-[36px]' : 'rounded-xl px-4 py-2.5 text-sm min-h-[44px]'
          } ${
            nearbyOnly
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
          aria-pressed={nearbyOnly}
          aria-label="Nur in meiner Nähe"
        >
          <span>Nur in meiner Nähe</span>
          <div
            className={`rounded-full transition-colors ${compact ? 'h-4 w-7' : 'h-5 w-9'} ${
              nearbyOnly ? 'bg-primary-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`rounded-full bg-white shadow-sm transition-transform ${compact ? 'h-4 w-4' : 'h-5 w-5'} ${
                nearbyOnly ? (compact ? 'translate-x-3' : 'translate-x-4') : 'translate-x-0'
              }`}
            />
          </div>
        </button>

        {/* Radius Picker (only when nearby is active) */}
        {nearbyOnly && (
          <div>
            <p className={`font-medium text-slate-500 ${compact ? 'mb-1.5 text-[10px]' : 'mb-2 text-xs'}`}>Umkreis:</p>
            <div className="grid grid-cols-4 gap-1.5">
              {RADIUS_OPTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onRadiusChange(r)}
                  className={`rounded-lg border font-semibold transition-all ${
                    compact ? 'px-2 py-1.5 text-[10px] min-h-[32px]' : 'px-3 py-2 text-xs min-h-[40px]'
                  } ${
                    radius === r
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
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
  );
}
