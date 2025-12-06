import { useMemo, useState } from 'react';
import type { TherapistCard } from '../therapists/types';
import type { Coordinates } from '../therapists/location-data';
import { useDebouncedValue } from './useDebouncedValue';

export type FormatFilter = 'online' | 'praesenz' | 'hybrid';

export type SortOption =
  | 'relevance'
  | 'distance'
  | 'price-low'
  | 'price-high'
  | 'experience'
  | 'rating'
  | 'availability';

export type GenderFilter = 'male' | 'female' | 'any';

export type TherapistFilters = {
  searchQuery: string;
  location: string;
  nearbyOnly: boolean;
  radius: number; // in km
  formats: Set<FormatFilter>;
  specializations: Set<string>;
  userLocation: Coordinates | null;
  languages: Set<string>;
  priceRange: { min: number; max: number } | null; // in euros
  acceptsInsurance: boolean;
  insuranceProviders: Set<string>;
  sortBy: SortOption;
  gender: GenderFilter;
};

export type UseTherapistFilteringOptions = {
  therapists: TherapistCard[];
  initialFilters?: Partial<TherapistFilters>;
};

export type UseTherapistFilteringReturn = {
  // Filters
  filters: TherapistFilters;
  setSearchQuery: (query: string) => void;
  setLocation: (location: string) => void;
  setNearbyOnly: (nearby: boolean) => void;
  setRadius: (radius: number) => void;
  setFormats: (formats: Set<FormatFilter>) => void;
  setSpecializations: (specializations: Set<string>) => void;
  setUserLocation: (location: Coordinates | null) => void;
  setLanguages: (languages: Set<string>) => void;
  setPriceRange: (range: { min: number; max: number } | null) => void;
  setAcceptsInsurance: (accepts: boolean) => void;
  setInsuranceProviders: (providers: Set<string>) => void;
  setSortBy: (sortBy: SortOption) => void;
  setGender: (gender: GenderFilter) => void;
  resetFilters: () => void;

  // Results
  filteredTherapists: TherapistCard[];
  totalCount: number;
  hasActiveFilters: boolean;

  // Stats
  availableSpecializations: string[];
  availableLanguages: string[];
  availableInsuranceProviders: string[];
  priceRangeStats: { min: number; max: number } | null;
};

const EARTH_RADIUS_KM = 6371;

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates distance between two coordinates using Haversine formula
 */
function calculateDistanceKm(a: Coordinates, b: Coordinates): number {
  const latDistance = degreesToRadians(b.lat - a.lat);
  const lngDistance = degreesToRadians(b.lng - a.lng);
  const normalizedLatA = degreesToRadians(a.lat);
  const normalizedLatB = degreesToRadians(b.lat);

  const sinLat = Math.sin(latDistance / 2);
  const sinLng = Math.sin(lngDistance / 2);

  const haversine =
    sinLat * sinLat + sinLng * sinLng * Math.cos(normalizedLatA) * Math.cos(normalizedLatB);
  const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  const distance = EARTH_RADIUS_KM * c;
  return Math.round(distance * 10) / 10;
}

/**
 * Hook for filtering and searching therapists
 * Includes debouncing, distance calculation, and multi-tier filtering
 */
export function useTherapistFiltering({
  therapists,
  initialFilters,
}: UseTherapistFilteringOptions): UseTherapistFilteringReturn {
  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialFilters?.searchQuery ?? '');
  const [location, setLocation] = useState(initialFilters?.location ?? '');
  const [nearbyOnly, setNearbyOnly] = useState(initialFilters?.nearbyOnly ?? false);
  const [radius, setRadius] = useState(initialFilters?.radius ?? 50);
  const [formats, setFormats] = useState<Set<FormatFilter>>(initialFilters?.formats ?? new Set());
  const [specializations, setSpecializations] = useState<Set<string>>(
    initialFilters?.specializations ?? new Set(),
  );
  const [userLocation, setUserLocation] = useState<Coordinates | null>(
    initialFilters?.userLocation ?? null,
  );
  const [languages, setLanguages] = useState<Set<string>>(initialFilters?.languages ?? new Set());
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(
    initialFilters?.priceRange ?? null,
  );
  const [acceptsInsurance, setAcceptsInsurance] = useState(
    initialFilters?.acceptsInsurance ?? false,
  );
  const [insuranceProviders, setInsuranceProviders] = useState<Set<string>>(
    initialFilters?.insuranceProviders ?? new Set(),
  );
  const [sortBy, setSortBy] = useState<SortOption>(initialFilters?.sortBy ?? 'relevance');
  const [gender, setGender] = useState<GenderFilter>(initialFilters?.gender ?? 'any');

  // Debounce expensive inputs
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

  // Calculate distances (only when user location changes)
  const therapistsWithDistances = useMemo(() => {
    if (!userLocation) {
      return therapists;
    }

    console.log('[Filter Debug] User location:', userLocation);

    const withoutCoords = therapists.filter((t) => !t.coordinates);
    if (withoutCoords.length > 0) {
      console.log(
        `[Filter Debug] ${withoutCoords.length} therapist(s) missing coordinates:`,
        withoutCoords.map((t) => ({ id: t.id, name: t.name, city: t.city })),
      );
    }

    const withDistances = therapists.map((therapist) => {
      if (!therapist.coordinates) {
        return { ...therapist, distanceInKm: undefined };
      }

      const distance = calculateDistanceKm(userLocation, therapist.coordinates);
      return {
        ...therapist,
        distanceInKm: distance,
      };
    });

    console.log(
      '[Filter Debug] Distances calculated:',
      withDistances
        .filter((t) => t.distanceInKm !== undefined)
        .map((t) => ({ name: t.name, distance: t.distanceInKm, coords: t.coordinates })),
    );

    return withDistances;
  }, [userLocation, therapists]);

  // Filter therapists
  const filteredTherapists = useMemo(() => {
    return therapistsWithDistances.filter((therapist) => {
      // 1. Text search (name or specialization)
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesName = therapist.name.toLowerCase().includes(query);
        const matchesSpecialty = therapist.focus.some((f) => f.toLowerCase().includes(query));
        if (!matchesName && !matchesSpecialty) {
          return false;
        }
      }

      // 2. Format filter (online/präsenz/hybrid)
      if (formats.size > 0) {
        const hasMatchingFormat = therapist.formatTags.some((tag) => formats.has(tag));
        if (!hasMatchingFormat) {
          return false;
        }
      }

      // 3. Specialization filter
      if (specializations.size > 0) {
        const hasMatchingSpecialization = therapist.focus.some((f) => specializations.has(f));
        if (!hasMatchingSpecialization) {
          return false;
        }
      }

      // 4. Nearby filter (CORRECTED LOGIC)
      if (nearbyOnly) {
        // If nearby mode is active but no location, filter out ALL
        if (!userLocation) {
          console.log('[Filter Debug] nearbyOnly active but no userLocation - filtering out all');
          return false;
        }

        // Online therapists are always "nearby" - they can serve anyone
        const isOnlineOnly =
          therapist.formatTags.includes('online') && !therapist.formatTags.includes('praesenz');
        if (isOnlineOnly) {
          console.log(`[Filter Debug] ${therapist.name} is online-only - keeping`);
          return true; // Skip distance check for online-only therapists
        }

        // If therapist has no coordinates, filter out
        if (typeof therapist.distanceInKm !== 'number') {
          console.log(`[Filter Debug] ${therapist.name} has no coordinates - filtering out`);
          return false;
        }

        // Check if within radius
        if (therapist.distanceInKm > radius) {
          console.log(
            `[Filter Debug] ${therapist.name} is ${therapist.distanceInKm}km away (radius: ${radius}km) - filtering out`,
          );
          return false;
        }

        console.log(
          `[Filter Debug] ${therapist.name} is ${therapist.distanceInKm}km away (radius: ${radius}km) - keeping`,
        );
      }

      // 5. Language filter
      if (languages.size > 0) {
        const hasMatchingLanguage = therapist.languages.some((lang) => languages.has(lang));
        if (!hasMatchingLanguage) {
          return false;
        }
      }

      // 6. Price range filter
      if (priceRange) {
        const minInCents = priceRange.min * 100;
        const maxInCents = priceRange.max * 100;

        // If therapist has no price info, filter out
        if (!therapist.priceMin && !therapist.priceMax) {
          return false;
        }

        // Check if therapist's price range overlaps with filter range
        const therapistMin = therapist.priceMin ?? 0;
        const therapistMax = therapist.priceMax ?? Infinity;

        // No overlap if therapist's min price is above filter max, or therapist's max is below filter min
        if (therapistMin > maxInCents || therapistMax < minInCents) {
          return false;
        }
      }

      // 7. Insurance filter
      if (acceptsInsurance) {
        if (therapist.acceptedInsurance.length === 0) {
          return false;
        }
      }

      // 8. Specific insurance provider filter
      if (insuranceProviders.size > 0) {
        const hasMatchingInsurance = therapist.acceptedInsurance.some((insurance) =>
          insuranceProviders.has(insurance),
        );
        if (!hasMatchingInsurance) {
          return false;
        }
      }

      // 9. Gender filter
      if (gender !== 'any') {
        if (therapist.gender !== gender) {
          return false;
        }
      }

      return true;
    });
  }, [
    therapistsWithDistances,
    debouncedSearchQuery,
    formats,
    specializations,
    nearbyOnly,
    userLocation,
    radius,
    languages,
    priceRange,
    acceptsInsurance,
    insuranceProviders,
    gender,
  ]);

  // Sort therapists
  const sortedTherapists = useMemo(() => {
    const sorted = [...filteredTherapists];

    switch (sortBy) {
      case 'distance':
        // Sort by distance (closest first)
        sorted.sort((a, b) => {
          const distA = a.distanceInKm ?? Infinity;
          const distB = b.distanceInKm ?? Infinity;
          return distA - distB;
        });
        break;

      case 'price-low':
        // Sort by price (lowest first)
        sorted.sort((a, b) => {
          const priceA = a.priceMin ?? Infinity;
          const priceB = b.priceMin ?? Infinity;
          return priceA - priceB;
        });
        break;

      case 'price-high':
        // Sort by price (highest first)
        sorted.sort((a, b) => {
          const priceA = a.priceMax ?? 0;
          const priceB = b.priceMax ?? 0;
          return priceB - priceA;
        });
        break;

      case 'experience':
        // Sort by years of experience (most experienced first)
        sorted.sort((a, b) => {
          // Extract years from experience string (e.g., "12 Jahre Praxis")
          const yearsA = parseInt(a.experience.match(/\d+/)?.[0] ?? '0');
          const yearsB = parseInt(b.experience.match(/\d+/)?.[0] ?? '0');
          return yearsB - yearsA;
        });
        break;

      case 'rating':
        // Sort by rating (highest first)
        sorted.sort((a, b) => {
          return b.rating - a.rating;
        });
        break;

      case 'availability':
        // Sort by availability (most available first)
        sorted.sort((a, b) => {
          return a.availabilityRank - b.availabilityRank;
        });
        break;

      case 'relevance':
      default:
        // Default: Sort by status (verified first), then by availability
        sorted.sort((a, b) => {
          // Verified profiles first
          if (a.status === 'VERIFIED' && b.status !== 'VERIFIED') return -1;
          if (a.status !== 'VERIFIED' && b.status === 'VERIFIED') return 1;

          // Then by availability
          return a.availabilityRank - b.availabilityRank;
        });
        break;
    }

    return sorted;
  }, [filteredTherapists, sortBy]);

  // Get all available specializations
  const availableSpecializations = useMemo(() => {
    const specs = new Set<string>();
    therapists.forEach((therapist) => {
      therapist.focus.forEach((f) => specs.add(f));
    });
    return Array.from(specs).sort();
  }, [therapists]);

  // Get all available languages
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    therapists.forEach((therapist) => {
      therapist.languages.forEach((lang) => langs.add(lang));
    });
    return Array.from(langs).sort();
  }, [therapists]);

  // Get all available insurance providers
  const availableInsuranceProviders = useMemo(() => {
    const providers = new Set<string>();
    therapists.forEach((therapist) => {
      therapist.acceptedInsurance.forEach((insurance) => providers.add(insurance));
    });
    return Array.from(providers).sort();
  }, [therapists]);

  // Calculate price range stats
  const priceRangeStats = useMemo(() => {
    const prices = therapists
      .filter((t) => t.priceMin || t.priceMax)
      .flatMap((t) => [t.priceMin, t.priceMax])
      .filter((p): p is number => p != null)
      .map((p) => p / 100); // Convert cents to euros

    if (prices.length === 0) return null;

    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [therapists]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      debouncedSearchQuery.length > 0 ||
      formats.size > 0 ||
      specializations.size > 0 ||
      nearbyOnly ||
      languages.size > 0 ||
      priceRange !== null ||
      acceptsInsurance ||
      insuranceProviders.size > 0 ||
      gender !== 'any'
    );
  }, [
    debouncedSearchQuery,
    formats,
    specializations,
    nearbyOnly,
    languages,
    priceRange,
    acceptsInsurance,
    insuranceProviders,
    gender,
  ]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setLocation('');
    setNearbyOnly(false);
    setRadius(50);
    setFormats(new Set());
    setSpecializations(new Set());
    setUserLocation(null);
    setLanguages(new Set());
    setPriceRange(null);
    setAcceptsInsurance(false);
    setInsuranceProviders(new Set());
    setSortBy('relevance');
    setGender('any');
  };

  return {
    filters: {
      searchQuery,
      location,
      nearbyOnly,
      radius,
      formats,
      specializations,
      userLocation,
      languages,
      priceRange,
      acceptsInsurance,
      insuranceProviders,
      sortBy,
      gender,
    },
    setSearchQuery,
    setLocation,
    setNearbyOnly,
    setRadius,
    setFormats,
    setSpecializations,
    setUserLocation,
    setLanguages,
    setPriceRange,
    setAcceptsInsurance,
    setInsuranceProviders,
    setSortBy,
    setGender,
    resetFilters,
    filteredTherapists: sortedTherapists,
    totalCount: therapists.length,
    hasActiveFilters,
    availableSpecializations,
    availableLanguages,
    availableInsuranceProviders,
    priceRangeStats,
  };
}
