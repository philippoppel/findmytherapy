import type { Coordinates } from './location-data'
import type { TherapistStatus } from '@/lib/prisma'

export type TherapistCard = {
  id: string
  name: string
  title: string
  focus: string[]
  approach: string
  location: string
  city: string | null
  coordinates: Coordinates | null
  availability: string
  availabilityRank: number
  languages: string[]
  rating: number
  reviews: number
  experience: string
  image: string | null
  initials: string
  status: TherapistStatus
  formatTags: Array<'online' | 'praesenz' | 'hybrid'>
  distanceInKm?: number
  locationTokens: string[]
}
