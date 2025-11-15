#!/usr/bin/env tsx

/**
 * Batch Geocoding Script for Therapist Profiles
 *
 * This script geocodes all therapist profiles that don't have coordinates yet.
 * It uses the Nominatim API from OpenStreetMap (free, 1 req/sec rate limit).
 *
 * Usage:
 *   tsx scripts/geocode-therapist-profiles.ts
 *
 * Options:
 *   --dry-run: Show what would be geocoded without saving to database
 *   --force: Re-geocode all profiles, even if they already have coordinates
 *   --limit=N: Only process N profiles (for testing)
 */

import { PrismaClient } from '@prisma/client'
import { geocodeTherapistLocation } from '../apps/web/app/therapists/geocoding'

const prisma = new PrismaClient()

// Parse CLI arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const force = args.includes('--force')
const limitArg = args.find(arg => arg.startsWith('--limit='))
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined

interface GeocodingStats {
  total: number
  success: number
  failed: number
  skipped: number
  fromNominatim: number
  fromFallback: number
}

async function main() {
  console.log('🗺️  Geocoding Therapist Profiles\n')
  console.log('=' .repeat(80))
  console.log(`Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'}`)
  console.log(`Force re-geocode: ${force ? 'YES' : 'NO'}`)
  if (limit) {
    console.log(`Limit: ${limit} profiles`)
  }
  console.log('=' .repeat(80) + '\n')

  // Fetch profiles to geocode
  const whereClause = force
    ? { isPublic: true }
    : {
        isPublic: true,
        OR: [
          { latitude: null },
          { longitude: null },
        ],
      }

  const profiles = await prisma.therapistProfile.findMany({
    where: whereClause,
    select: {
      id: true,
      displayName: true,
      city: true,
      postalCode: true,
      street: true,
      state: true,
      country: true,
      latitude: true,
      longitude: true,
    },
    take: limit,
  })

  if (profiles.length === 0) {
    console.log('✅ All profiles already have coordinates!')
    return
  }

  console.log(`Found ${profiles.length} profile(s) to geocode\n`)

  const stats: GeocodingStats = {
    total: profiles.length,
    success: 0,
    failed: 0,
    skipped: 0,
    fromNominatim: 0,
    fromFallback: 0,
  }

  for (let i = 0; i < profiles.length; i++) {
    const profile = profiles[i]
    const progress = `[${i + 1}/${profiles.length}]`
    const name = profile.displayName || profile.id.substring(0, 8)

    // Skip if no location data at all
    if (!profile.city && !profile.postalCode && !profile.street) {
      console.log(`${progress} ⏭️  SKIPPED: ${name} - No location data`)
      stats.skipped++
      continue
    }

    const locationStr = [profile.street, profile.postalCode, profile.city]
      .filter(Boolean)
      .join(', ')

    console.log(`${progress} 🔍 Processing: ${name} (${locationStr})`)

    try {
      const result = await geocodeTherapistLocation({
        street: profile.street,
        postalCode: profile.postalCode,
        city: profile.city,
        state: profile.state,
        country: profile.country || 'AT',
      })

      if (!result.success) {
        console.log(`         ❌ FAILED: ${result.error}`)
        stats.failed++
        continue
      }

      const { coordinates, source, displayName } = result
      console.log(`         ✅ SUCCESS: ${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`)
      console.log(`         📍 Source: ${source}`)
      if (displayName) {
        console.log(`         🏷️  Name: ${displayName}`)
      }

      // Track source
      if (source === 'nominatim') {
        stats.fromNominatim++
      } else if (source === 'fallback') {
        stats.fromFallback++
      }

      // Update database (unless dry run)
      if (!isDryRun) {
        await prisma.therapistProfile.update({
          where: { id: profile.id },
          data: {
            latitude: coordinates.lat,
            longitude: coordinates.lng,
          },
        })
        console.log(`         💾 Saved to database`)
      } else {
        console.log(`         🔸 DRY RUN: Would save to database`)
      }

      stats.success++
    } catch (error) {
      console.error(`         ❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`)
      stats.failed++
    }

    console.log('') // Empty line for readability
  }

  // Print summary
  console.log('\n' + '=' .repeat(80))
  console.log('📊 GEOCODING SUMMARY')
  console.log('=' .repeat(80))
  console.log(`Total profiles processed: ${stats.total}`)
  console.log(`✅ Successful: ${stats.success} (${((stats.success / stats.total) * 100).toFixed(1)}%)`)
  console.log(`   - From Nominatim API: ${stats.fromNominatim}`)
  console.log(`   - From Fallback (hardcoded): ${stats.fromFallback}`)
  console.log(`❌ Failed: ${stats.failed} (${((stats.failed / stats.total) * 100).toFixed(1)}%)`)
  console.log(`⏭️  Skipped (no location data): ${stats.skipped}`)
  console.log('=' .repeat(80))

  if (isDryRun) {
    console.log('\n⚠️  This was a DRY RUN. No changes were saved to the database.')
    console.log('Run without --dry-run to save changes.')
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
