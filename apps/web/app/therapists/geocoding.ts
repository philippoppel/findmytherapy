import { getCityCoordinates, Coordinates } from './location-data';

/**
 * Geocoding Service using OpenStreetMap Nominatim API
 * Free tier: 1 request per second
 * Documentation: https://nominatim.org/release-docs/latest/api/Search/
 */

export type GeocodingResult =
  | {
      success: true;
      coordinates: Coordinates;
      source: 'nominatim' | 'fallback' | 'cache';
      displayName?: string;
    }
  | {
      success: false;
      error: string;
    };

type NominatimResponse = {
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
}[];

// Rate limiting: 1 request per second for Nominatim
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

async function waitForRateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }
  lastRequestTime = Date.now();
}

/**
 * Geocode an address using OpenStreetMap Nominatim API
 * @param address - Full address or city name
 * @param country - Country code (default: "AT" for Austria)
 * @returns Geocoding result with coordinates or error
 */
export async function geocodeAddress(
  address: string,
  country: string = 'AT',
): Promise<GeocodingResult> {
  if (!address || address.trim().length === 0) {
    return {
      success: false,
      error: 'Address is required',
    };
  }

  // Try fallback to hardcoded coordinates first (faster, no API call)
  const fallbackCoords = getCityCoordinates(address);
  if (fallbackCoords && fallbackCoords.lat !== 0 && fallbackCoords.lng !== 0) {
    return {
      success: true,
      coordinates: fallbackCoords,
      source: 'fallback',
    };
  }

  // Build query for Nominatim
  const query = new URLSearchParams({
    q: `${address}, ${country}`,
    format: 'json',
    addressdetails: '1',
    limit: '1',
    countrycodes: country.toLowerCase(),
  });

  try {
    // Rate limiting
    await waitForRateLimit();

    const response = await fetch(`https://nominatim.openstreetmap.org/search?${query}`, {
      headers: {
        'User-Agent': 'FindMyTherapy-Platform/1.0 (contact@findmytherapy.at)',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        return {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        };
      }
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data: NominatimResponse = await response.json();

    if (!data || data.length === 0) {
      return {
        success: false,
        error: `No results found for address: ${address}`,
      };
    }

    const result = data[0];
    const coordinates: Coordinates = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    };

    // Validate coordinates
    if (!isValidCoordinate(coordinates.lat, coordinates.lng)) {
      return {
        success: false,
        error: 'Invalid coordinates received from geocoding service',
      };
    }

    return {
      success: true,
      coordinates,
      source: 'nominatim',
      displayName: result.display_name,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown geocoding error',
    };
  }
}

/**
 * Geocode multiple addresses (street, postal code, city) and return best match
 * Tries in order: full address > city + postal code > city only
 */
export async function geocodeTherapistLocation(params: {
  street?: string | null;
  postalCode?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string;
}): Promise<GeocodingResult> {
  const { street, postalCode, city, state, country = 'AT' } = params;

  // Try 1: Full address with street
  if (street && city) {
    const fullAddress = [street, postalCode, city, state].filter(Boolean).join(', ');
    const result = await geocodeAddress(fullAddress, country);
    if (result.success) {
      return result;
    }
  }

  // Try 2: City + Postal Code
  if (city && postalCode) {
    const cityPLZ = `${postalCode} ${city}`;
    const result = await geocodeAddress(cityPLZ, country);
    if (result.success) {
      return result;
    }
  }

  // Try 3: City only
  if (city) {
    const result = await geocodeAddress(city, country);
    if (result.success) {
      return result;
    }
  }

  // Try 4: State as fallback
  if (state) {
    const result = await geocodeAddress(state, country);
    if (result.success) {
      return result;
    }
  }

  return {
    success: false,
    error: 'Could not geocode location with provided address components',
  };
}

/**
 * Validate latitude and longitude values
 */
function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Batch geocode with delays to respect rate limits
 * Processes addresses one at a time with 1-second delays
 */
export async function batchGeocode(
  addresses: Array<{
    id: string;
    street?: string | null;
    postalCode?: string | null;
    city?: string | null;
    state?: string | null;
  }>,
  onProgress?: (completed: number, total: number, current?: string) => void,
): Promise<Array<{ id: string; result: GeocodingResult }>> {
  const results: Array<{ id: string; result: GeocodingResult }> = [];

  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    const displayAddress = [address.street, address.postalCode, address.city]
      .filter(Boolean)
      .join(', ');

    onProgress?.(i, addresses.length, displayAddress || address.id);

    const result = await geocodeTherapistLocation(address);
    results.push({ id: address.id, result });

    // Progress callback
    onProgress?.(i + 1, addresses.length);
  }

  return results;
}
