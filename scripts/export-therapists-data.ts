#!/usr/bin/env tsx

/**
 * Export all therapist data from production database to CSV
 *
 * This script exports all therapist profiles with their current data status,
 * making it easy to identify which profiles need enrichment.
 *
 * Usage:
 *   DATABASE_URL="..." tsx scripts/export-therapists-data.ts
 *
 * Output:
 *   - therapists-export-{timestamp}.csv
 *   - therapists-stats-{timestamp}.json
 */

import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'

const prisma = new PrismaClient()

interface TherapistExportRow {
  id: string
  displayName: string
  firstName: string
  lastName: string
  email: string
  status: string
  isPublic: boolean

  // Contact & Location
  city: string
  latitude: string
  longitude: string

  // Professional Info
  title: string
  licenseId: string
  licenseAuthority: string
  yearsExperience: string

  // Profile Content
  headline: string
  about: string
  profileImageUrl: string
  videoUrl: string

  // Practice Details
  modalities: string
  specialties: string
  languages: string
  ageGroups: string
  services: string
  qualifications: string

  // Pricing & Insurance
  priceMin: string
  priceMax: string
  pricingNote: string
  acceptedInsurance: string
  privatePractice: string

  // Availability
  online: string
  acceptingClients: string
  availabilityStatus: string
  availabilityNote: string
  estimatedWaitWeeks: string

  // Web Presence
  websiteUrl: string
  socialLinkedin: string
  socialInstagram: string
  socialFacebook: string

  // Microsite
  micrositeSlug: string
  micrositeStatus: string

  // Metadata
  createdAt: string
  updatedAt: string

  // Completeness Flags (0 or 1)
  has_profileImage: string
  has_about: string
  has_website: string
  has_social: string
  has_video: string
  has_pricing: string
  has_coordinates: string
  has_availability: string

  // Completeness Score (0-100)
  completeness_score: string
}

interface Stats {
  total: number
  publicProfiles: number
  verifiedProfiles: number
  fieldStats: {
    [key: string]: {
      filled: number
      empty: number
      percentage: number
    }
  }
  completenessDistribution: {
    '0-25%': number
    '26-50%': number
    '51-75%': number
    '76-100%': number
  }
  cityDistribution: { [key: string]: number }
  stateDistribution: { [key: string]: number }
  timestamp: string
}

/**
 * Calculate completeness score for a profile
 */
function calculateCompleteness(profile: any): number {
  let score = 0
  let maxScore = 0

  // Essential fields (weight: 2)
  const essentialFields = [
    'displayName', 'city', 'about', 'profileImageUrl'
  ]
  essentialFields.forEach(field => {
    maxScore += 2
    if (profile[field]) score += 2
  })

  // Important fields (weight: 1.5)
  const importantFields = [
    'websiteUrl', 'priceMin', 'priceMax', 'availabilityStatus'
  ]
  importantFields.forEach(field => {
    maxScore += 1.5
    if (profile[field]) score += 1.5
  })

  // Additional fields (weight: 1)
  const additionalFields = [
    'headline', 'videoUrl', 'socialLinkedin', 'socialInstagram',
    'socialFacebook', 'latitude', 'longitude', 'yearsExperience',
    'pricingNote', 'availabilityNote'
  ]
  additionalFields.forEach(field => {
    maxScore += 1
    if (profile[field]) score += 1
  })

  // Array fields (weight: 1)
  const arrayFields = [
    'modalities', 'specialties', 'languages', 'ageGroups',
    'services', 'qualifications', 'acceptedInsurance'
  ]
  arrayFields.forEach(field => {
    maxScore += 1
    if (profile[field]?.length > 0) score += 1
  })

  return Math.round((score / maxScore) * 100)
}

/**
 * Convert profile to CSV row
 */
function profileToRow(profile: any): TherapistExportRow {
  const completeness = calculateCompleteness(profile)

  return {
    id: profile.id || '',
    displayName: profile.displayName || '',
    firstName: profile.user?.firstName || '',
    lastName: profile.user?.lastName || '',
    email: profile.user?.email || '',
    status: profile.status || '',
    isPublic: profile.isPublic ? '1' : '0',

    // Contact & Location
    city: profile.city || '',
    latitude: profile.latitude?.toString() || '',
    longitude: profile.longitude?.toString() || '',

    // Professional Info
    title: profile.title || '',
    licenseId: profile.licenseId || '',
    licenseAuthority: profile.licenseAuthority || '',
    yearsExperience: profile.yearsExperience?.toString() || '',

    // Profile Content
    headline: profile.headline || '',
    about: (profile.about || '').replace(/\n/g, ' ').replace(/"/g, '""'),
    profileImageUrl: profile.profileImageUrl || '',
    videoUrl: profile.videoUrl || '',

    // Practice Details
    modalities: (profile.modalities || []).join('; '),
    specialties: (profile.specialties || []).join('; '),
    languages: (profile.languages || []).join('; '),
    ageGroups: (profile.ageGroups || []).join('; '),
    services: (profile.services || []).join('; '),
    qualifications: (profile.qualifications || []).join('; '),

    // Pricing & Insurance
    priceMin: profile.priceMin ? (profile.priceMin / 100).toString() : '',
    priceMax: profile.priceMax ? (profile.priceMax / 100).toString() : '',
    pricingNote: (profile.pricingNote || '').replace(/\n/g, ' ').replace(/"/g, '""'),
    acceptedInsurance: (profile.acceptedInsurance || []).join('; '),
    privatePractice: profile.privatePractice ? '1' : '0',

    // Availability
    online: profile.online ? '1' : '0',
    acceptingClients: profile.acceptingClients ? '1' : '0',
    availabilityStatus: profile.availabilityStatus || '',
    availabilityNote: (profile.availabilityNote || '').replace(/\n/g, ' ').replace(/"/g, '""'),
    estimatedWaitWeeks: profile.estimatedWaitWeeks?.toString() || '',

    // Web Presence
    websiteUrl: profile.websiteUrl || '',
    socialLinkedin: profile.socialLinkedin || '',
    socialInstagram: profile.socialInstagram || '',
    socialFacebook: profile.socialFacebook || '',

    // Microsite
    micrositeSlug: profile.micrositeSlug || '',
    micrositeStatus: profile.micrositeStatus || '',

    // Metadata
    createdAt: profile.createdAt?.toISOString() || '',
    updatedAt: profile.updatedAt?.toISOString() || '',

    // Completeness Flags
    has_profileImage: profile.profileImageUrl ? '1' : '0',
    has_about: profile.about ? '1' : '0',
    has_website: profile.websiteUrl ? '1' : '0',
    has_social: (profile.socialLinkedin || profile.socialInstagram || profile.socialFacebook) ? '1' : '0',
    has_video: profile.videoUrl ? '1' : '0',
    has_pricing: (profile.priceMin && profile.priceMax) ? '1' : '0',
    has_coordinates: (profile.latitude && profile.longitude) ? '1' : '0',
    has_availability: profile.availabilityStatus ? '1' : '0',

    completeness_score: completeness.toString(),
  }
}

/**
 * Convert object to CSV row string
 */
function rowToCSV(row: TherapistExportRow): string {
  return Object.values(row)
    .map(val => `"${val}"`)
    .join(',')
}

/**
 * Main export function
 */
async function main() {
  console.log('📊 Exporting therapist data from production database...\n')

  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0]
  const csvFilename = `therapists-export-${timestamp}.csv`
  const statsFilename = `therapists-stats-${timestamp}.json`

  // Fetch all therapist profiles
  console.log('🔍 Fetching profiles...')
  const profiles = await prisma.therapistProfile.findMany({
    select: {
      id: true,
      displayName: true,
      status: true,
      isPublic: true,

      // Contact & Location (only fields that exist in prod)
      city: true,
      latitude: true,
      longitude: true,

      // Professional Info
      title: true,
      licenseId: true,
      licenseAuthority: true,
      yearsExperience: true,

      // Profile Content
      headline: true,
      about: true,
      profileImageUrl: true,
      videoUrl: true,
      approachSummary: true,
      experienceSummary: true,

      // Practice Details
      modalities: true,
      specialties: true,
      languages: true,
      ageGroups: true,
      services: true,
      qualifications: true,

      // Pricing & Insurance
      priceMin: true,
      priceMax: true,
      pricingNote: true,
      acceptedInsurance: true,
      privatePractice: true,

      // Availability
      online: true,
      acceptingClients: true,
      availabilityStatus: true,
      availabilityNote: true,
      estimatedWaitWeeks: true,

      // Web Presence
      websiteUrl: true,
      socialLinkedin: true,
      socialInstagram: true,
      socialFacebook: true,

      // Gallery
      galleryImages: true,

      // Rating
      rating: true,
      reviewCount: true,

      // Microsite
      micrositeSlug: true,
      micrositeStatus: true,

      // Metadata
      createdAt: true,
      updatedAt: true,
      deletedAt: true,

      // User relation
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: {
      displayName: 'asc',
    },
  })

  console.log(`✅ Found ${profiles.length} profiles\n`)

  // Convert to CSV
  console.log('📝 Converting to CSV...')
  const headers = Object.keys(profileToRow(profiles[0] || {}))
  const csvRows = [
    headers.join(','),
    ...profiles.map(p => rowToCSV(profileToRow(p)))
  ]
  const csvContent = csvRows.join('\n')

  // Write CSV file
  writeFileSync(csvFilename, csvContent, 'utf-8')
  console.log(`✅ CSV exported to: ${csvFilename}\n`)

  // Calculate statistics
  console.log('📊 Calculating statistics...')
  const stats: Stats = {
    total: profiles.length,
    publicProfiles: profiles.filter(p => p.isPublic).length,
    verifiedProfiles: profiles.filter(p => p.status === 'VERIFIED').length,
    fieldStats: {},
    completenessDistribution: {
      '0-25%': 0,
      '26-50%': 0,
      '51-75%': 0,
      '76-100%': 0,
    },
    cityDistribution: {},
    stateDistribution: {},
    timestamp: new Date().toISOString(),
  }

  // Field statistics
  const fields = [
    'profileImageUrl', 'about', 'websiteUrl', 'videoUrl',
    'priceMin', 'priceMax', 'latitude', 'longitude',
    'socialLinkedin', 'socialInstagram', 'socialFacebook',
    'availabilityStatus', 'headline', 'yearsExperience',
    'micrositeSlug', 'pricingNote', 'availabilityNote'
  ]

  fields.forEach(field => {
    const filled = profiles.filter(p => {
      const value = (p as any)[field]
      return value !== null && value !== undefined && value !== ''
    }).length
    const empty = profiles.length - filled
    stats.fieldStats[field] = {
      filled,
      empty,
      percentage: Math.round((filled / profiles.length) * 100),
    }
  })

  // Completeness distribution
  profiles.forEach(profile => {
    const score = calculateCompleteness(profile)
    if (score <= 25) stats.completenessDistribution['0-25%']++
    else if (score <= 50) stats.completenessDistribution['26-50%']++
    else if (score <= 75) stats.completenessDistribution['51-75%']++
    else stats.completenessDistribution['76-100%']++
  })

  // City distribution (top 20)
  const cities: { [key: string]: number } = {}
  profiles.forEach(p => {
    if (p.city) {
      cities[p.city] = (cities[p.city] || 0) + 1
    }
  })
  const topCities = Object.entries(cities)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
  stats.cityDistribution = Object.fromEntries(topCities)

  // State distribution
  const states: { [key: string]: number } = {}
  profiles.forEach(p => {
    if (p.state) {
      states[p.state] = (states[p.state] || 0) + 1
    }
  })
  stats.stateDistribution = states

  // Write stats file
  writeFileSync(statsFilename, JSON.stringify(stats, null, 2), 'utf-8')
  console.log(`✅ Statistics exported to: ${statsFilename}\n`)

  // Print summary
  console.log('=' .repeat(80))
  console.log('📊 SUMMARY')
  console.log('='.repeat(80))
  console.log(`Total profiles: ${stats.total}`)
  console.log(`Public profiles: ${stats.publicProfiles} (${Math.round(stats.publicProfiles / stats.total * 100)}%)`)
  console.log(`Verified profiles: ${stats.verifiedProfiles} (${Math.round(stats.verifiedProfiles / stats.total * 100)}%)`)
  console.log()
  console.log('Field Completeness:')
  console.log(`  Profile Image: ${stats.fieldStats.profileImageUrl.percentage}% (${stats.fieldStats.profileImageUrl.filled}/${stats.total})`)
  console.log(`  About Text: ${stats.fieldStats.about.percentage}% (${stats.fieldStats.about.filled}/${stats.total})`)
  console.log(`  Website: ${stats.fieldStats.websiteUrl.percentage}% (${stats.fieldStats.websiteUrl.filled}/${stats.total})`)
  console.log(`  Pricing: ${stats.fieldStats.priceMin.percentage}% (${stats.fieldStats.priceMin.filled}/${stats.total})`)
  console.log(`  Coordinates: ${stats.fieldStats.latitude.percentage}% (${stats.fieldStats.latitude.filled}/${stats.total})`)
  console.log(`  LinkedIn: ${stats.fieldStats.socialLinkedin.percentage}% (${stats.fieldStats.socialLinkedin.filled}/${stats.total})`)
  console.log(`  Instagram: ${stats.fieldStats.socialInstagram.percentage}% (${stats.fieldStats.socialInstagram.filled}/${stats.total})`)
  console.log(`  Facebook: ${stats.fieldStats.socialFacebook.percentage}% (${stats.fieldStats.socialFacebook.filled}/${stats.total})`)
  console.log()
  console.log('Completeness Distribution:')
  console.log(`  0-25%: ${stats.completenessDistribution['0-25%']} profiles`)
  console.log(`  26-50%: ${stats.completenessDistribution['26-50%']} profiles`)
  console.log(`  51-75%: ${stats.completenessDistribution['51-75%']} profiles`)
  console.log(`  76-100%: ${stats.completenessDistribution['76-100%']} profiles`)
  console.log()
  console.log('Top 10 Cities:')
  Object.entries(stats.cityDistribution)
    .slice(0, 10)
    .forEach(([city, count]) => {
      console.log(`  ${city}: ${count} profiles`)
    })
  console.log()
  console.log('='.repeat(80))
  console.log()
  console.log(`✅ Export complete!`)
  console.log(`   CSV: ${csvFilename}`)
  console.log(`   Stats: ${statsFilename}`)
}

main()
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
