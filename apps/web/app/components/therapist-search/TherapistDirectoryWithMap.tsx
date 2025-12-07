'use client';

/**
 * Therapist Directory with Map View
 *
 * Enhanced therapist directory with integrated map view.
 * Features:
 * - Split view (map + list) on desktop
 * - Toggle between map/list on mobile
 * - Synchronized map and list interactions
 * - Filter sync between views
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Map, List, MapPin } from 'lucide-react';
import type { TherapistCard } from '../../therapists/types';
import { UnifiedTherapistSearch } from './UnifiedTherapistSearch';
import { TherapistMap, type TherapistMapMarker } from '../map/TherapistMap';
import { useTranslation } from '@/lib/i18n/useTranslation';

export type TherapistDirectoryWithMapProps = {
  therapists: TherapistCard[];
  totalCount: number;
  defaultView?: 'split' | 'map' | 'list';
};

export function TherapistDirectoryWithMap({
  therapists: initialTherapists,
  totalCount,
  defaultView = 'split',
}: TherapistDirectoryWithMapProps) {
  const { t } = useTranslation();
  const [allTherapists, setAllTherapists] = useState<TherapistCard[]>(initialTherapists);
  const [filteredTherapists, setFilteredTherapists] = useState<TherapistCard[]>(initialTherapists);
  const [view, setView] = useState<'split' | 'map' | 'list'>(defaultView);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>();
  const [searchRadius] = useState<number | undefined>();
  const [selectedTherapistId, setSelectedTherapistId] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(allTherapists.length < totalCount);

  const handleFilteredResults = useCallback((filtered: TherapistCard[]) => {
    setFilteredTherapists(filtered);
  }, []);

  const mapMarkers: TherapistMapMarker[] = useMemo(() => {
    return filteredTherapists
      .filter((t) => t.coordinates && t.coordinates.lat !== 0 && t.coordinates.lng !== 0)
      .map((t) => ({
        id: t.id,
        name: t.name,
        latitude: t.coordinates!.lat,
        longitude: t.coordinates!.lng,
        city: t.city || undefined,
        availabilityStatus: undefined,
        profileUrl: `/therapists/${t.id}`,
        imageUrl: t.image || undefined,
        specialties: t.focus,
      }));
  }, [filteredTherapists]);

  useEffect(() => {
    if (mapMarkers.length === 0) return;

    const firstWithCoords = mapMarkers[0];
    if (firstWithCoords) {
      setMapCenter({
        lat: firstWithCoords.latitude,
        lng: firstWithCoords.longitude,
      });
    }
  }, [mapMarkers]);

  const handleMarkerClick = (therapist: TherapistMapMarker) => {
    setSelectedTherapistId(therapist.id);
    const element = document.getElementById(`therapist-${therapist.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const response = await fetch(`/api/therapists?limit=50&offset=${allTherapists.length}`);
      if (!response.ok) throw new Error('Failed to load more therapists');

      const data = await response.json();
      setAllTherapists((prev) => [...prev, ...data.therapists]);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error loading more therapists:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="w-full">
      <UnifiedTherapistSearch
        therapists={allTherapists}
        onFilteredResults={handleFilteredResults}
        className="mb-6"
      />

      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/20">
              <MapPin className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {filteredTherapists.length === 0 ? (
                  t('directory.noResults')
                ) : (
                  <>
                    <span className="text-primary-400">{filteredTherapists.length}</span>{' '}
                    {filteredTherapists.length === 1
                      ? t('directory.therapistCount', { count: filteredTherapists.length })
                      : t('directory.therapistCountPlural', { count: filteredTherapists.length })}
                  </>
                )}
              </h2>
              <p className="text-sm text-white/60">
                {filteredTherapists.length === 0 ? (
                  t('directory.adjustFilters')
                ) : mapMarkers.length < filteredTherapists.length ? (
                  <>
                    {t('directory.withLocation', { count: mapMarkers.length })} •{' '}
                    {t('directory.onlineOnly', {
                      count: filteredTherapists.length - mapMarkers.length,
                    })}
                  </>
                ) : (
                  t('directory.allWithLocation')
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-2 md:hidden">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                view === 'list' ? 'bg-primary-500 text-white' : 'bg-white/10 text-white/70'
              }`}
              aria-label={t('directory.listView')}
            >
              <List className="h-4 w-4" />
              {t('directory.list')}
            </button>
            <button
              onClick={() => setView('map')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                view === 'map' ? 'bg-primary-500 text-white' : 'bg-white/10 text-white/70'
              }`}
              aria-label={t('directory.mapView')}
            >
              <Map className="h-4 w-4" />
              {t('directory.map')}
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="hidden md:grid md:grid-cols-2 md:gap-6 lg:gap-8">
          <div className="sticky top-4 h-[calc(100vh-200px)] min-h-[600px] rounded-2xl overflow-hidden border border-white/10 bg-gray-900">
            <TherapistMap
              therapists={mapMarkers}
              center={mapCenter}
              zoom={mapMarkers.length > 0 ? 10 : 7}
              radius={searchRadius}
              onMarkerClick={handleMarkerClick}
              showRadiusCircle={!!searchRadius}
              className="h-full w-full"
            />
          </div>

          <div>
            <TherapistListView
              therapists={filteredTherapists}
              selectedId={selectedTherapistId}
              t={t}
            />
          </div>
        </div>

        {view === 'map' && (
          <div className="md:hidden">
            <div className="h-[60vh] min-h-[400px] rounded-2xl overflow-hidden border border-white/10 mb-4">
              <TherapistMap
                therapists={mapMarkers}
                center={mapCenter}
                zoom={mapMarkers.length > 0 ? 10 : 7}
                radius={searchRadius}
                onMarkerClick={handleMarkerClick}
                showRadiusCircle={!!searchRadius}
                className="h-full w-full"
              />
            </div>
            <p className="text-xs text-white/60 text-center mb-4">{t('directory.tapMarker')}</p>
          </div>
        )}

        {view === 'list' && (
          <div className="md:hidden">
            <TherapistListView
              therapists={filteredTherapists}
              selectedId={selectedTherapistId}
              t={t}
            />
          </div>
        )}

        {filteredTherapists.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-12 backdrop-blur">
            <div className="max-w-md mx-auto text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/20">
                  <MapPin className="h-8 w-8 text-primary-400" />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                {t('directory.noTherapistsFound')}
              </h3>

              <p className="text-sm text-white/70 mb-6">{t('directory.noTherapistsFoundDesc')}</p>

              <div className="space-y-3 mb-6 text-left">
                <p className="text-sm font-medium text-white/90">{t('directory.tipsTitle')}</p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-400 mt-0.5">•</span>
                    <span>{t('directory.tipExpandRadius')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-400 mt-0.5">•</span>
                    <span>{t('directory.tipRemoveFilters')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-400 mt-0.5">•</span>
                    <span>{t('directory.tipRelatedSpecializations')}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-500 transition-colors"
              >
                {t('directory.resetAllFilters')}
              </button>
            </div>
          </div>
        )}

        {filteredTherapists.length > 0 && hasMore && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="text-sm text-white/60">
              {t('directory.loadedCount', { loaded: allTherapists.length, total: totalCount })}
            </div>
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="rounded-xl bg-primary-600 px-8 py-3 text-sm font-semibold text-white hover:bg-primary-500 active:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoadingMore ? t('directory.loading') : t('directory.showMore')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TherapistListView({
  therapists,
  selectedId,
  t,
}: {
  therapists: TherapistCard[];
  selectedId: string | null;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  return (
    <div className="space-y-4">
      {therapists.map((therapist) => (
        <div
          key={therapist.id}
          id={`therapist-${therapist.id}`}
          className={`transition-all ${
            selectedId === therapist.id
              ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent'
              : ''
          }`}
        >
          <TherapistCardSimple therapist={therapist} t={t} />
        </div>
      ))}
    </div>
  );
}

function TherapistCardSimple({
  therapist,
  t,
}: {
  therapist: TherapistCard;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const availabilityColor =
    {
      [t('directory.availableNow')]: 'bg-green-500/20 text-green-300 border-green-500/30',
      Verfügbar: 'bg-green-500/20 text-green-300 border-green-500/30',
      [t('directory.limitedCapacity')]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      Warteliste: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      [t('directory.currentlyUnavailable')]: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    }[therapist.availability] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';

  const priceLabel =
    therapist.priceMin && therapist.priceMax
      ? `€${Math.floor(therapist.priceMin / 100)} - €${Math.floor(therapist.priceMax / 100)}`
      : null;

  return (
    <div className="group relative rounded-xl border border-white/10 bg-white/5 backdrop-blur transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-lg">
      <a href={`/therapists/${therapist.id}`} className="block p-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0 relative">
            {therapist.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={therapist.image}
                alt={therapist.name}
                className="h-20 w-20 rounded-lg object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xl">
                {therapist.initials}
              </div>
            )}
            {therapist.status === 'VERIFIED' && (
              <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs">
                ✓
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-white text-base truncate">{therapist.name}</h3>
              {therapist.rating > 0 && (
                <div className="flex items-center gap-1 text-xs text-yellow-400">
                  <span>★</span>
                  <span>{therapist.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-white/60 mb-2">{therapist.title}</p>

            <div className="mb-2">
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium border ${availabilityColor}`}
              >
                {therapist.availability}
              </span>
            </div>

            {therapist.focus.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {therapist.focus.slice(0, 3).map((f, i) => (
                  <span
                    key={i}
                    className="inline-block rounded px-2 py-0.5 text-xs bg-white/10 text-white/80"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 text-xs text-white/60 flex-wrap">
              {therapist.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {therapist.location}
                </span>
              )}
              {therapist.experience && <span>{therapist.experience}</span>}
              {priceLabel && <span className="text-primary-400 font-medium">{priceLabel}</span>}
              {therapist.distanceInKm !== undefined && (
                <span className="text-primary-400 font-medium">
                  {therapist.distanceInKm.toFixed(1)} km
                </span>
              )}
            </div>
          </div>
        </div>
      </a>

      <div className="border-t border-white/10 p-3 flex gap-2">
        <a
          href={`/therapists/${therapist.id}`}
          className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-primary-500 transition-colors"
        >
          {t('directory.viewProfile')}
        </a>
        <button
          onClick={(e) => {
            e.preventDefault();
            alert(t('directory.contactComingSoon'));
          }}
          className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
        >
          {t('directory.contact')}
        </button>
      </div>
    </div>
  );
}
