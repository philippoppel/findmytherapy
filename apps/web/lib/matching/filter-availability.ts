import { prisma } from '@/lib/prisma'
import type { InsuranceType, TherapyFormat } from '@prisma/client'
import type { FilterOption, FilterOptionsResponse } from './types'
import { LANGUAGES, PROBLEM_AREAS } from '@/app/components/matching/types'
import { getCached, setCached } from '@/lib/redis'

interface CurrentFilters {
  languages?: string[]
  insuranceType?: InsuranceType
  format?: TherapyFormat
  problemAreas?: string[]
  maxDistanceKm?: number
  latitude?: number
  longitude?: number
}

interface TherapistForFiltering {
  id: string
  languages: string[]
  specialties: string[]
  online: boolean
  acceptedInsurance: string[]
  privatePractice: boolean
}

/**
 * Berechnet verfügbare Filter-Optionen basierend auf aktuellen Filtern
 * Zeigt Counts für jede Option (wie viele Therapeuten verfügbar)
 * Nutzt Redis Caching für Performance (5 Minuten TTL)
 */
export async function getAvailableFilterOptions(
  currentFilters: CurrentFilters = {}
): Promise<FilterOptionsResponse> {
  // Cache Key basierend auf den Filtern
  const cacheKey = `filter-options:${JSON.stringify(currentFilters)}`

  // Versuche aus Redis Cache zu lesen (mit Fallback falls Redis nicht verfügbar)
  const cached = await getCached<FilterOptionsResponse>(cacheKey)
  if (cached) {
    console.log('[Cache] Filter options loaded from Redis')
    return cached
  }

  // Base WHERE clause - immer public und verified
  const baseWhere = {
    isPublic: true,
    status: 'VERIFIED' as const,
    deletedAt: null,
  }

  // Alle Therapeuten die die AKTUELLEN Filter erfüllen
  const baseTherapists = await prisma.therapistProfile.findMany({
    where: {
      ...baseWhere,
      ...(currentFilters.format === 'ONLINE' && { online: true }),
      ...(currentFilters.languages && currentFilters.languages.length > 0 && {
        languages: {
          hasSome: currentFilters.languages,
        },
      }),
      ...(currentFilters.insuranceType && currentFilters.insuranceType !== 'ANY' && {
        OR: [
          // Public insurance
          ...(currentFilters.insuranceType === 'PUBLIC' ? [{
            acceptedInsurance: {
              has: 'ÖGK' // Österreichische Gesundheitskasse
            }
          }] : []),
          // Private insurance
          ...(currentFilters.insuranceType === 'PRIVATE' ? [{
            AND: [
              { privatePractice: true },
              { acceptedInsurance: { isEmpty: false } }
            ]
          }] : []),
          // Self-pay
          ...(currentFilters.insuranceType === 'SELF_PAY' ? [{
            privatePractice: true
          }] : []),
        ]
      }),
    },
    select: {
      id: true,
      languages: true,
      specialties: true,
      online: true,
      acceptedInsurance: true,
      privatePractice: true,
    },
  })

  // 1. Language Options
  const languageOptions = await calculateLanguageOptions(baseTherapists, currentFilters)

  // 2. Insurance Type Options
  const insuranceOptions = await calculateInsuranceOptions(baseTherapists, currentFilters)

  // 3. Problem Area Options
  const problemAreaOptions = await calculateProblemAreaOptions(baseTherapists, currentFilters)

  // 4. Format Options
  const formatOptions = await calculateFormatOptions(baseTherapists, currentFilters)

  const options: FilterOptionsResponse = {
    languages: languageOptions,
    insuranceTypes: insuranceOptions,
    problemAreas: problemAreaOptions,
    formats: formatOptions,
  }

  // In Redis cachen (5 Minuten TTL) - mit Fallback falls Redis nicht verfügbar
  await setCached(cacheKey, options, 300)

  return options
}

/**
 * Berechnet verfügbare Sprachen
 */
function calculateLanguageOptions(
  therapists: TherapistForFiltering[],
  _currentFilters: CurrentFilters
): FilterOption[] {
  // Zähle wie oft jede Sprache vorkommt
  const languageCounts = new Map<string, number>()

  for (const therapist of therapists) {
    const langs = therapist.languages || []
    for (const lang of langs) {
      languageCounts.set(lang, (languageCounts.get(lang) || 0) + 1)
    }
  }

  // Erstelle Options aus LANGUAGES Konstante
  return LANGUAGES.map(lang => ({
    value: lang.id,
    label: lang.label,
    count: languageCounts.get(lang.id) || 0,
    available: (languageCounts.get(lang.id) || 0) > 0,
  }))
}

/**
 * Berechnet verfügbare Versicherungstypen
 */
function calculateInsuranceOptions(
  therapists: TherapistForFiltering[],
  _currentFilters: CurrentFilters
): FilterOption[] {
  const counts = {
    ANY: therapists.length,
    PUBLIC: 0,
    PRIVATE: 0,
    SELF_PAY: 0,
  }

  for (const therapist of therapists) {
    // Public insurance (ÖGK, etc.)
    if (therapist.acceptedInsurance?.includes('ÖGK')) {
      counts.PUBLIC++
    }

    // Private insurance
    if (therapist.privatePractice && therapist.acceptedInsurance?.length > 0) {
      counts.PRIVATE++
    }

    // Self-pay (alle mit privatePractice)
    if (therapist.privatePractice) {
      counts.SELF_PAY++
    }
  }

  return [
    { value: 'ANY', label: 'Egal', count: counts.ANY, available: counts.ANY > 0 },
    { value: 'PUBLIC', label: 'Krankenkasse', count: counts.PUBLIC, available: counts.PUBLIC > 0 },
    { value: 'PRIVATE', label: 'Privat', count: counts.PRIVATE, available: counts.PRIVATE > 0 },
    { value: 'SELF_PAY', label: 'Selbstzahler', count: counts.SELF_PAY, available: counts.SELF_PAY > 0 },
  ]
}

/**
 * Berechnet verfügbare Problemfelder
 */
function calculateProblemAreaOptions(
  therapists: TherapistForFiltering[],
  _currentFilters: CurrentFilters
): FilterOption[] {
  // Zähle wie oft jede Spezialisierung vorkommt
  const specialtyCounts = new Map<string, number>()

  for (const therapist of therapists) {
    const specs = therapist.specialties || []
    for (const spec of specs) {
      const normalized = spec.toLowerCase()
      // Mapppe auf Problemfelder
      for (const area of PROBLEM_AREAS) {
        const areaLower = area.label.toLowerCase()
        if (normalized.includes(areaLower) || areaLower.includes(normalized)) {
          specialtyCounts.set(area.id, (specialtyCounts.get(area.id) || 0) + 1)
        }
      }
    }
  }

  return PROBLEM_AREAS.map(area => ({
    value: area.id,
    label: area.label,
    count: specialtyCounts.get(area.id) || 0,
    available: (specialtyCounts.get(area.id) || 0) > 0,
  }))
}

/**
 * Berechnet verfügbare Formate
 */
function calculateFormatOptions(
  therapists: TherapistForFiltering[],
  _currentFilters: CurrentFilters
): FilterOption[] {
  const counts = {
    BOTH: 0,
    ONLINE: 0,
    IN_PERSON: 0,
  }

  for (const therapist of therapists) {
    if (therapist.online) {
      counts.ONLINE++
      counts.BOTH++
    }
    // Wenn kein "online" Flag, dann vermutlich nur Präsenz
    if (!therapist.online) {
      counts.IN_PERSON++
      counts.BOTH++
    }
  }

  return [
    { value: 'BOTH', label: 'Beides', count: counts.BOTH, available: counts.BOTH > 0 },
    { value: 'IN_PERSON', label: 'Präsenz', count: counts.IN_PERSON, available: counts.IN_PERSON > 0 },
    { value: 'ONLINE', label: 'Online', count: counts.ONLINE, available: counts.ONLINE > 0 },
  ]
}
