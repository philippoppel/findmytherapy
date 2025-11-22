import type { ListingPlan } from '@mental-health/db'

export interface TherapistWithListing {
  id: string
  displayName: string | null
  title: string | null
  profileImageUrl: string | null
  specialties: string[]
  modalities: string[]
  approachSummary: string | null
  city: string | null
  country: string | null
  online: boolean
  priceMin: number | null
  priceMax: number | null
  languages: string[]
  yearsExperience: number | null
  acceptingClients: boolean
  availabilityNote: string | null
  availabilityStatus: 'AVAILABLE' | 'LIMITED' | 'WAITLIST' | 'UNAVAILABLE' | null
  estimatedWaitWeeks: number | null
  acceptedInsurance: string[]
  ageGroups: string[]
  rating: number | null
  reviewCount: number
  listings: Array<{
    id: string
    plan: ListingPlan
    status: string
  }>
}

export interface FilterState {
  searchQuery: string
  specialties: string[]
  formats: ('online' | 'in-person' | 'hybrid')[]
  languages: string[]
  priceRange: [number, number]
  insurance: string[]
  ageGroups: string[]
  modalities: string[]
  acceptingClients: boolean | null
  location: string
}

export type SortOption =
  | 'recommended'
  | 'availability'
  | 'experience'
  | 'price-low'
  | 'price-high'

export const initialFilters: FilterState = {
  searchQuery: '',
  specialties: [],
  formats: [],
  languages: [],
  priceRange: [0, 200],
  insurance: [],
  ageGroups: [],
  modalities: [],
  acceptingClients: null,
  location: '',
}
