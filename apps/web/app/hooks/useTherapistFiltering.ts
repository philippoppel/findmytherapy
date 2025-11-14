import { useMemo, useState } from 'react'
import type { TherapistCard } from '../therapists/types'
import type { Coordinates } from '../therapists/location-data'
import { useDebouncedValue } from './useDebouncedValue'

export type FormatFilter = 'online' | 'praesenz' | 'hybrid'

export type TherapistFilters = {
  searchQuery: string
  location: string
  nearbyOnly: boolean
  radius: number // in km
  formats: Set<FormatFilter>
  specializations: Set<string>
  userLocation: Coordinates | null
}

export type UseTherapistFilteringOptions = {
  therapists: TherapistCard[]
  initialFilters?: Partial<TherapistFilters>
}

export type UseTherapistFilteringReturn = {
  // Filters
  filters: TherapistFilters
  setSearchQuery: (query: string) => void
  setLocation: (location: string) => void
  setNearbyOnly: (nearby: boolean) => void
  setRadius: (radius: number) => void
  setFormats: (formats: Set<FormatFilter>) => void
  setSpecializations: (specializations: Set<string>) => void
  setUserLocation: (location: Coordinates | null) => void
  resetFilters: () => void

  // Results
  filteredTherapists: TherapistCard[]
  totalCount: number
  hasActiveFilters: boolean

  // Stats
  availableSpecializations: string[]
}

const EARTH_RADIUS_KM = 6371

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

/**
 * Calculates distance between two coordinates using Haversine formula
 */
function calculateDistanceKm(a: Coordinates, b: Coordinates): number {
  const latDistance = degreesToRadians(b.lat - a.lat)
  const lngDistance = degreesToRadians(b.lng - a.lng)
  const normalizedLatA = degreesToRadians(a.lat)
  const normalizedLatB = degreesToRadians(b.lat)

  const sinLat = Math.sin(latDistance / 2)
  const sinLng = Math.sin(lngDistance / 2)

  const haversine =
    sinLat * sinLat + sinLng * sinLng * Math.cos(normalizedLatA) * Math.cos(normalizedLatB)
  const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  const distance = EARTH_RADIUS_KM * c
  return Math.round(distance * 10) / 10
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
  const [searchQuery, setSearchQuery] = useState(initialFilters?.searchQuery ?? '')
  const [location, setLocation] = useState(initialFilters?.location ?? '')
  const [nearbyOnly, setNearbyOnly] = useState(initialFilters?.nearbyOnly ?? false)
  const [radius, setRadius] = useState(initialFilters?.radius ?? 50)
  const [formats, setFormats] = useState<Set<FormatFilter>>(
    initialFilters?.formats ?? new Set()
  )
  const [specializations, setSpecializations] = useState<Set<string>>(
    initialFilters?.specializations ?? new Set()
  )
  const [userLocation, setUserLocation] = useState<Coordinates | null>(
    initialFilters?.userLocation ?? null
  )

  // Debounce expensive inputs
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300)
  const debouncedLocation = useDebouncedValue(location, 500) // Longer for location lookup

  // Calculate distances (only when user location changes)
  const therapistsWithDistances = useMemo(() => {
    if (!userLocation) {
      return therapists
    }

    return therapists.map((therapist) => {
      if (!therapist.coordinates) {
        return { ...therapist, distanceInKm: undefined }
      }

      return {
        ...therapist,
        distanceInKm: calculateDistanceKm(userLocation, therapist.coordinates),
      }
    })
  }, [userLocation, therapists])

  // Filter therapists
  const filteredTherapists = useMemo(() => {
    return therapistsWithDistances.filter((therapist) => {
      // 1. Text search (name or specialization)
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase()
        const matchesName = therapist.name.toLowerCase().includes(query)
        const matchesSpecialty = therapist.focus.some((f) =>
          f.toLowerCase().includes(query)
        )
        if (!matchesName && !matchesSpecialty) {
          return false
        }
      }

      // 2. Format filter (online/präsenz/hybrid)
      if (formats.size > 0) {
        const hasMatchingFormat = therapist.formatTags.some((tag) => formats.has(tag))
        if (!hasMatchingFormat) {
          return false
        }
      }

      // 3. Specialization filter
      if (specializations.size > 0) {
        const hasMatchingSpecialization = therapist.focus.some((f) =>
          specializations.has(f)
        )
        if (!hasMatchingSpecialization) {
          return false
        }
      }

      // 4. Nearby filter (CORRECTED LOGIC)
      if (nearbyOnly) {
        // If nearby mode is active but no location, filter out ALL
        if (!userLocation) {
          return false
        }

        // If therapist has no coordinates, filter out
        if (typeof therapist.distanceInKm !== 'number') {
          return false
        }

        // Check if within radius
        if (therapist.distanceInKm > radius) {
          return false
        }
      }

      return true
    })
  }, [
    therapistsWithDistances,
    debouncedSearchQuery,
    formats,
    specializations,
    nearbyOnly,
    userLocation,
    radius,
  ])

  // Get all available specializations
  const availableSpecializations = useMemo(() => {
    const specs = new Set<string>()
    therapists.forEach((therapist) => {
      therapist.focus.forEach((f) => specs.add(f))
    })
    return Array.from(specs).sort()
  }, [therapists])

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      debouncedSearchQuery.length > 0 ||
      formats.size > 0 ||
      specializations.size > 0 ||
      nearbyOnly
    )
  }, [debouncedSearchQuery, formats, specializations, nearbyOnly])

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('')
    setLocation('')
    setNearbyOnly(false)
    setRadius(50)
    setFormats(new Set())
    setSpecializations(new Set())
    setUserLocation(null)
  }

  return {
    filters: {
      searchQuery,
      location,
      nearbyOnly,
      radius,
      formats,
      specializations,
      userLocation,
    },
    setSearchQuery,
    setLocation,
    setNearbyOnly,
    setRadius,
    setFormats,
    setSpecializations,
    setUserLocation,
    resetFilters,
    filteredTherapists,
    totalCount: therapists.length,
    hasActiveFilters,
    availableSpecializations,
  }
}
