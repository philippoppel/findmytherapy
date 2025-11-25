'use client';

/**
 * Interactive Therapist Map Component
 *
 * Displays therapists on an interactive map using Mapbox GL JS.
 * Features:
 * - Interactive markers for each therapist
 * - Clustering for dense areas
 * - Click to view therapist details
 * - Filter by radius
 * - Responsive (desktop/mobile)
 *
 * Setup:
 * 1. Get a free Mapbox token: https://account.mapbox.com/access-tokens/
 * 2. Add to .env: NEXT_PUBLIC_MAPBOX_TOKEN="pk.your_token_here"
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Map, {
  Marker,
  NavigationControl,
  GeolocateControl,
  Popup,
  Source,
  Layer,
} from 'react-map-gl/mapbox';
import type { MapRef, LayerProps } from 'react-map-gl/mapbox';
import type { FeatureCollection, Point } from 'geojson';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface TherapistMapMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city?: string;
  availabilityStatus?: 'available' | 'limited' | 'waitlist' | 'unavailable';
  profileUrl?: string;
  imageUrl?: string;
  specialties?: string[];
}

interface TherapistMapProps {
  therapists: TherapistMapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  radius?: number; // in kilometers
  onMarkerClick?: (therapist: TherapistMapMarker) => void;
  className?: string;
  showRadiusCircle?: boolean;
  enableClustering?: boolean;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Default center: Vienna, Austria
const DEFAULT_CENTER = { lat: 48.2082, lng: 16.3738 };
const DEFAULT_ZOOM = 7;

export function TherapistMap({
  therapists,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  radius,
  onMarkerClick,
  className = '',
  showRadiusCircle = false,
  enableClustering = true,
}: TherapistMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: center.lng,
    latitude: center.lat,
    zoom,
  });
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistMapMarker | null>(null);

  // Convert therapists to GeoJSON for clustering
  const geojsonData = useMemo((): FeatureCollection<Point> => {
    return {
      type: 'FeatureCollection',
      features: therapists.map((therapist) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [therapist.longitude, therapist.latitude],
        },
        properties: {
          id: therapist.id,
          name: therapist.name,
          city: therapist.city,
          availabilityStatus: therapist.availabilityStatus,
          profileUrl: therapist.profileUrl,
          specialties: therapist.specialties,
        },
      })),
    };
  }, [therapists]);

  // Update view when center changes
  useEffect(() => {
    setViewState((prev) => ({
      ...prev,
      longitude: center.lng,
      latitude: center.lat,
      zoom: prev.zoom < zoom ? zoom : prev.zoom,
    }));
  }, [center.lat, center.lng, zoom]);

  // Fit bounds to show all therapists
  const fitBounds = useCallback(() => {
    if (!mapRef.current || therapists.length === 0) return;

    const map = mapRef.current.getMap();

    // Calculate bounds
    const lngs = therapists.map((t) => t.longitude);
    const lats = therapists.map((t) => t.latitude);

    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 50, maxZoom: 12 },
    );
  }, [therapists]);

  const handleMarkerClick = useCallback(
    (therapist: TherapistMapMarker) => {
      setSelectedTherapist(therapist);
      onMarkerClick?.(therapist);

      // Pan to marker
      setViewState((prev) => ({
        ...prev,
        longitude: therapist.longitude,
        latitude: therapist.latitude,
        zoom: Math.max(prev.zoom, 11),
      }));
    },
    [onMarkerClick],
  );

  // Handle cluster click - zoom into cluster
  const handleClusterClick = useCallback(
    (clusterId: number, longitude: number, latitude: number) => {
      const mapInstance = mapRef.current?.getMap();
      if (!mapInstance) return;

      const source = mapInstance.getSource('therapists') as mapboxgl.GeoJSONSource;
      if (!source) return;

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        setViewState((prev) => ({
          ...prev,
          longitude,
          latitude,
          zoom: zoom || prev.zoom + 2,
        }));
      });
    },
    [],
  );

  // Handle point click in clustering mode
  const handlePointClick = useCallback(
    (feature: { properties: { id: string } }) => {
      const therapistId = feature.properties.id;
      const therapist = therapists.find((t) => t.id === therapistId);
      if (therapist) {
        handleMarkerClick(therapist);
      }
    },
    [therapists, handleMarkerClick],
  );

  // Map click handler for clusters and points
  const onMapClick = useCallback(
    (event: {
      features?: Array<{
        layer: { id: string };
        properties: { cluster_id?: number; id?: string };
        geometry: { coordinates: [number, number] };
      }>;
    }) => {
      const features = event.features;
      if (!features || features.length === 0) return;

      const feature = features[0];

      if (feature.layer.id === 'clusters') {
        // Clicked on a cluster
        handleClusterClick(
          feature.properties.cluster_id!,
          feature.geometry.coordinates[0],
          feature.geometry.coordinates[1],
        );
      } else if (feature.layer.id === 'unclustered-point') {
        // Clicked on an individual point
        handlePointClick(feature as { properties: { id: string } });
      }
    },
    [handleClusterClick, handlePointClick],
  );

  // Layer styles for clustering
  const clusterLayer: LayerProps = {
    id: 'clusters',
    type: 'circle',
    source: 'therapists',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#3B82F6', // blue for small clusters
        10,
        '#F59E0B', // amber for medium clusters
        30,
        '#EF4444', // red for large clusters
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20, // 20px for small clusters
        10,
        30, // 30px for medium clusters
        30,
        40, // 40px for large clusters
      ],
      'circle-opacity': 0.8,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
    },
  };

  const clusterCountLayer: LayerProps = {
    id: 'cluster-count',
    type: 'symbol',
    source: 'therapists',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 14,
    },
    paint: {
      'text-color': '#ffffff',
    },
  };

  const unclusteredPointLayer: LayerProps = {
    id: 'unclustered-point',
    type: 'circle',
    source: 'therapists',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': [
        'match',
        ['get', 'availabilityStatus'],
        'available',
        '#10B981', // green
        'limited',
        '#F59E0B', // amber
        'waitlist',
        '#F97316', // orange
        'unavailable',
        '#9CA3AF', // gray
        '#3B82F6', // default blue
      ],
      'circle-radius': 10,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.8],
    },
  };

  // Check if Mapbox token is configured
  if (!MAPBOX_TOKEN || MAPBOX_TOKEN.includes('your_mapbox_token_here')) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg p-8 ${className}`}>
        <div className="text-center">
          <p className="text-gray-600 mb-2">🗺️ Karten-Ansicht nicht verfügbar</p>
          <p className="text-sm text-gray-500">
            Bitte Mapbox Token konfigurieren: NEXT_PUBLIC_MAPBOX_TOKEN
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        attributionControl={false}
        interactiveLayerIds={enableClustering ? ['clusters', 'unclustered-point'] : undefined}
        onClick={enableClustering ? onMapClick : undefined}
        cursor={enableClustering ? 'pointer' : 'grab'}
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" />

        {/* Geolocation Control */}
        <GeolocateControl position="top-right" trackUserLocation showUserHeading />

        {/* Clustering Mode */}
        {enableClustering ? (
          <Source
            id="therapists"
            type="geojson"
            data={geojsonData}
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
          >
            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
            <Layer {...unclusteredPointLayer} />
          </Source>
        ) : (
          /* Non-clustering Mode - Individual Markers */
          therapists.map((therapist) => (
            <Marker
              key={therapist.id}
              longitude={therapist.longitude}
              latitude={therapist.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(therapist);
              }}
            >
              <div className="cursor-pointer transform transition-transform hover:scale-110">
                <TherapistMarkerIcon status={therapist.availabilityStatus} />
              </div>
            </Marker>
          ))
        )}

        {/* Popup for selected therapist */}
        {selectedTherapist && (
          <Popup
            longitude={selectedTherapist.longitude}
            latitude={selectedTherapist.latitude}
            anchor="top"
            onClose={() => setSelectedTherapist(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold text-sm mb-1">{selectedTherapist.name}</h3>
              {selectedTherapist.city && (
                <p className="text-xs text-gray-600 mb-2">📍 {selectedTherapist.city}</p>
              )}
              {selectedTherapist.specialties && selectedTherapist.specialties.length > 0 && (
                <p className="text-xs text-gray-500 mb-2">
                  {selectedTherapist.specialties.slice(0, 2).join(', ')}
                </p>
              )}
              {selectedTherapist.availabilityStatus && (
                <AvailabilityBadge status={selectedTherapist.availabilityStatus} />
              )}
              {selectedTherapist.profileUrl && (
                <a
                  href={selectedTherapist.profileUrl}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-2 block"
                >
                  Profil ansehen →
                </a>
              )}
            </div>
          </Popup>
        )}

        {/* Radius Circle (if enabled) */}
        {showRadiusCircle && radius && (
          <RadiusCircle center={{ lat: center.lat, lng: center.lng }} radiusKm={radius} />
        )}
      </Map>

      {/* Floating controls */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm">
        <button onClick={fitBounds} className="text-blue-600 hover:text-blue-800 font-medium">
          🗺️ Alle anzeigen
        </button>
      </div>

      {/* Therapist count */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-medium">
        {therapists.length} Therapeut:innen
      </div>
    </div>
  );
}

/**
 * Therapist Marker Icon
 */
function TherapistMarkerIcon({ status }: { status?: string }) {
  const colorMap = {
    available: 'bg-green-500',
    limited: 'bg-yellow-500',
    waitlist: 'bg-orange-500',
    unavailable: 'bg-gray-400',
  };

  const color = status ? colorMap[status as keyof typeof colorMap] || 'bg-blue-500' : 'bg-blue-500';

  return (
    <div className="relative">
      <div
        className={`w-8 h-8 ${color} rounded-full border-2 border-white shadow-lg flex items-center justify-center`}
      >
        <span className="text-white text-xs font-bold">👤</span>
      </div>
      {/* Pointer */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0
        border-l-[6px] border-l-transparent
        border-r-[6px] border-r-transparent
        border-t-[8px] ${color.replace('bg-', 'border-t-')}`}
      />
    </div>
  );
}

/**
 * Availability Badge
 */
function AvailabilityBadge({ status }: { status: string }) {
  const config = {
    available: { label: 'Verfügbar', color: 'bg-green-100 text-green-800' },
    limited: { label: 'Begrenzt', color: 'bg-yellow-100 text-yellow-800' },
    waitlist: { label: 'Warteliste', color: 'bg-orange-100 text-orange-800' },
    unavailable: { label: 'Nicht verfügbar', color: 'bg-gray-100 text-gray-800' },
  };

  const badge = config[status as keyof typeof config] || config.available;

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
      {badge.label}
    </span>
  );
}

/**
 * Radius Circle Component
 * Draws a circle on the map to show the search radius
 */
function RadiusCircle({
  center,
  radiusKm,
}: {
  center: { lat: number; lng: number };
  radiusKm: number;
}) {
  // Create a circle polygon from center and radius
  const createCircleGeoJSON = (centerCoords: { lat: number; lng: number }, radiusInKm: number) => {
    const points = 64;
    const coords = {
      latitude: centerCoords.lat,
      longitude: centerCoords.lng,
    };

    const km = radiusInKm;
    const ret = [];
    const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
    const distanceY = km / 110.574;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = distanceX * Math.cos(theta);
      const y = distanceY * Math.sin(theta);

      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return {
      type: 'Feature' as const,
      geometry: {
        type: 'Polygon' as const,
        coordinates: [ret],
      },
      properties: {},
    };
  };

  const circleGeoJSON = createCircleGeoJSON(center, radiusKm);

  const circleLayer: LayerProps = {
    id: 'radius-circle',
    type: 'fill',
    source: 'radius-circle-source',
    paint: {
      'fill-color': '#3B82F6',
      'fill-opacity': 0.1,
    },
  };

  const circleOutlineLayer: LayerProps = {
    id: 'radius-circle-outline',
    type: 'line',
    source: 'radius-circle-source',
    paint: {
      'line-color': '#3B82F6',
      'line-width': 2,
      'line-opacity': 0.5,
    },
  };

  return (
    <Source id="radius-circle-source" type="geojson" data={circleGeoJSON}>
      <Layer {...circleLayer} />
      <Layer {...circleOutlineLayer} />
    </Source>
  );
}
