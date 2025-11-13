'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'
import { TherapistCard } from './TherapistCard'
import { TherapistCardPremium } from './TherapistCardPremium'
import { SearchBar } from './SearchBar'
import { QuickFilters } from './QuickFilters'
import { SortDropdown } from './SortDropdown'
import { ActiveFilters } from './ActiveFilters'
import { AdvancedFilterModal } from './AdvancedFilterModal'
import type { TherapistWithListing, FilterState, SortOption } from './types'

interface TherapistGridProps {
  therapists: TherapistWithListing[]
}

// Helper functions for URL state
function filtersToSearchParams(filters: FilterState, sortBy: SortOption): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.searchQuery) params.set('q', filters.searchQuery)
  if (filters.formats.length > 0) params.set('formats', filters.formats.join(','))
  if (filters.acceptingClients) params.set('accepting', 'true')
  if (filters.location) params.set('location', filters.location)
  if (filters.specialties.length > 0) params.set('specialties', filters.specialties.join(','))
  if (filters.languages.length > 0) params.set('languages', filters.languages.join(','))
  if (filters.modalities.length > 0) params.set('modalities', filters.modalities.join(','))
  if (filters.insurance.length > 0) params.set('insurance', filters.insurance.join(','))
  if (filters.ageGroups.length > 0) params.set('ageGroups', filters.ageGroups.join(','))
  if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 250) {
    params.set('priceMin', filters.priceRange[0].toString())
    params.set('priceMax', filters.priceRange[1].toString())
  }
  if (sortBy !== 'recommended') params.set('sort', sortBy)

  return params
}

function searchParamsToFilters(params: URLSearchParams): { filters: FilterState; sortBy: SortOption } {
  return {
    filters: {
      searchQuery: params.get('q') || '',
      formats: params.get('formats')?.split(',').filter(Boolean) as FilterState['formats'] || [],
      acceptingClients: params.get('accepting') === 'true' ? true : null,
      location: params.get('location') || '',
      specialties: params.get('specialties')?.split(',').filter(Boolean) || [],
      languages: params.get('languages')?.split(',').filter(Boolean) || [],
      modalities: params.get('modalities')?.split(',').filter(Boolean) || [],
      insurance: params.get('insurance')?.split(',').filter(Boolean) || [],
      ageGroups: params.get('ageGroups')?.split(',').filter(Boolean) || [],
      priceRange: [
        parseInt(params.get('priceMin') || '0', 10),
        parseInt(params.get('priceMax') || '250', 10),
      ],
    },
    sortBy: (params.get('sort') as SortOption) || 'recommended',
  }
}

export function TherapistGrid({ therapists }: TherapistGridProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize from URL params
  const initialState = useMemo(() => {
    return searchParamsToFilters(searchParams)
  }, [searchParams])

  const [filters, setFilters] = useState<FilterState>(initialState.filters)
  const [sortBy, setSortBy] = useState<SortOption>(initialState.sortBy)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [displayCount, setDisplayCount] = useState(12)

  // Sync filters to URL
  useEffect(() => {
    const params = filtersToSearchParams(filters, sortBy)
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(newUrl, { scroll: false })
  }, [filters, sortBy, pathname, router])

  // Extract unique options from therapists
  const availableOptions = useMemo(() => {
    const specialties = new Set<string>()
    const languages = new Set<string>()
    const modalities = new Set<string>()
    const insurance = new Set<string>()
    const ageGroups = new Set<string>()
    const cities = new Set<string>()

    therapists.forEach((therapist) => {
      therapist.specialties.forEach((s) => specialties.add(s))
      therapist.languages.forEach((l) => languages.add(l))
      therapist.modalities.forEach((m) => modalities.add(m))
      therapist.acceptedInsurance.forEach((i) => insurance.add(i))
      therapist.ageGroups.forEach((a) => ageGroups.add(a))
      if (therapist.city) cities.add(therapist.city)
    })

    return {
      specialties: Array.from(specialties).sort(),
      languages: Array.from(languages).sort(),
      modalities: Array.from(modalities).sort(),
      insurance: Array.from(insurance).sort(),
      ageGroups: Array.from(ageGroups).sort(),
      cities: Array.from(cities).sort(),
    }
  }, [therapists])

  // Filter and sort therapists
  const filteredAndSortedTherapists = useMemo(() => {
    const filtered = therapists.filter((therapist) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const matchesName = therapist.displayName?.toLowerCase().includes(query)
        const matchesSpecialty = therapist.specialties.some((s) =>
          s.toLowerCase().includes(query),
        )
        const matchesApproach = therapist.approachSummary?.toLowerCase().includes(query)
        if (!matchesName && !matchesSpecialty && !matchesApproach) return false
      }

      // Format filters
      if (filters.formats.length > 0) {
        const hasOnline = filters.formats.includes('online') && therapist.online
        const hasInPerson =
          filters.formats.includes('in-person') && therapist.city && !therapist.online
        const hasHybrid = filters.formats.includes('hybrid') && therapist.online && therapist.city
        if (!hasOnline && !hasInPerson && !hasHybrid) return false
      }

      // Accepting clients
      if (filters.acceptingClients !== null && therapist.acceptingClients !== filters.acceptingClients) {
        return false
      }

      // Location
      if (filters.location && therapist.city !== filters.location) {
        return false
      }

      // Specialties
      if (
        filters.specialties.length > 0 &&
        !filters.specialties.some((s) => therapist.specialties.includes(s))
      ) {
        return false
      }

      // Languages
      if (
        filters.languages.length > 0 &&
        !filters.languages.some((l) => therapist.languages.includes(l))
      ) {
        return false
      }

      // Modalities
      if (
        filters.modalities.length > 0 &&
        !filters.modalities.some((m) => therapist.modalities.includes(m))
      ) {
        return false
      }

      // Insurance
      if (
        filters.insurance.length > 0 &&
        !filters.insurance.some((i) => therapist.acceptedInsurance.includes(i))
      ) {
        return false
      }

      // Age groups
      if (
        filters.ageGroups.length > 0 &&
        !filters.ageGroups.some((a) => therapist.ageGroups.includes(a))
      ) {
        return false
      }

      // Price range
      const avgPrice =
        therapist.priceMin && therapist.priceMax
          ? (therapist.priceMin + therapist.priceMax) / 2 / 100
          : therapist.priceMin
            ? therapist.priceMin / 100
            : therapist.priceMax
              ? therapist.priceMax / 100
              : null
      if (avgPrice !== null) {
        if (avgPrice < filters.priceRange[0] || avgPrice > filters.priceRange[1]) {
          return false
        }
      }

      return true
    })

    // Sort therapists
    filtered.sort((a, b) => {
      // Get tier order
      const getTierValue = (therapist: TherapistWithListing) => {
        const activeListing = therapist.listings.find((l) => l.status === 'ACTIVE')
        if (!activeListing) return 0
        if (activeListing.plan === 'PRO_PLUS') return 3
        if (activeListing.plan === 'PRO') return 2
        return 1
      }

      const aTier = getTierValue(a)
      const bTier = getTierValue(b)

      // Always prioritize by tier first
      if (aTier !== bTier) return bTier - aTier

      // Then sort by selected option
      switch (sortBy) {
        case 'recommended':
          // After tier, sort by rating, then accepting clients
          if ((a.rating || 0) !== (b.rating || 0)) return (b.rating || 0) - (a.rating || 0)
          if (a.acceptingClients !== b.acceptingClients)
            return a.acceptingClients ? -1 : 1
          return 0

        case 'availability':
          if (a.acceptingClients !== b.acceptingClients)
            return a.acceptingClients ? -1 : 1
          return 0

        case 'experience':
          return (b.yearsExperience || 0) - (a.yearsExperience || 0)

        case 'price-low': {
          const aPrice = a.priceMin || a.priceMax || Infinity
          const bPrice = b.priceMin || b.priceMax || Infinity
          return aPrice - bPrice
        }

        case 'price-high': {
          const aPriceHigh = a.priceMax || a.priceMin || 0
          const bPriceHigh = b.priceMax || b.priceMin || 0
          return bPriceHigh - aPriceHigh
        }

        default:
          return 0
      }
    })

    return filtered
  }, [therapists, filters, sortBy])

  const displayedTherapists = filteredAndSortedTherapists.slice(0, displayCount)

  const handleFiltersChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setDisplayCount(12) // Reset display count when filters change
  }, [])

  const handleLoadMore = useCallback(() => {
    setDisplayCount((prev) => prev + 12)
  }, [])

  // Scroll to top when filters change
  useEffect(() => {
    const resultsSection = document.getElementById('therapist-results')
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [filters, sortBy])

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div>
        <SearchBar
          value={filters.searchQuery}
          onChange={(value) => handleFiltersChange({ searchQuery: value })}
        />
      </div>

      {/* Quick Filters + Sort + Advanced */}
      <div className="flex flex-col gap-4">
        {/* Quick Filters - Horizontal scroll on mobile */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <QuickFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </div>

        {/* Sort + Advanced Filters */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border-2 border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition-all hover:border-teal-300 hover:bg-teal-50"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            <span className="sm:inline">Filter</span>
          </button>
          <div className="flex-1 sm:flex-none">
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <div id="therapist-results">
        <ActiveFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          resultCount={filteredAndSortedTherapists.length}
        />
      </div>

      {/* Therapist Grid */}
      {displayedTherapists.length > 0 ? (
        <>
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
            {displayedTherapists.map((therapist) => {
              const isPremium =
                therapist.listings.find((l) => l.status === 'ACTIVE')?.plan === 'PRO_PLUS'
              return isPremium ? (
                <TherapistCardPremium key={therapist.id} therapist={therapist} />
              ) : (
                <TherapistCard key={therapist.id} therapist={therapist} />
              )
            })}
          </div>

          {/* Load More */}
          {displayCount < filteredAndSortedTherapists.length && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={handleLoadMore}
                className="rounded-xl border-2 border-teal-200 bg-white px-6 py-3 text-sm font-semibold text-teal-700 transition-all hover:border-teal-300 hover:bg-teal-50 sm:px-8"
              >
                Mehr laden ({filteredAndSortedTherapists.length - displayCount} weitere)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-6 py-12 text-center sm:px-8 sm:py-16">
          <p className="text-lg font-semibold text-neutral-900">
            Keine Therapeut:innen gefunden
          </p>
          <p className="mt-2 text-sm text-neutral-600 sm:text-base">
            Versuche andere Suchbegriffe oder Filter
          </p>
        </div>
      )}

      {/* Advanced Filter Modal */}
      <AdvancedFilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filters={filters}
        onApply={handleFiltersChange}
        availableOptions={availableOptions}
      />
    </div>
  )
}
