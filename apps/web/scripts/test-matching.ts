import { PrismaClient } from '@prisma/client'
import { findMatches } from '../lib/matching/matching-service'
import type { MatchingPreferencesInput } from '../lib/matching/types'

const prisma = new PrismaClient()

async function testMatching() {
  try {
    console.log('🎯 Teste Matching-Algorithmus mit Live-Daten\n')
    console.log('=' .repeat(80))

    // Test Case 1: Angststörungen, Wien, Online möglich
    console.log('\n\n📋 TEST CASE 1: Angststörungen + Wien + Online')
    console.log('-'.repeat(80))
    const test1: MatchingPreferencesInput = {
      problemAreas: ['Angst', 'Depression'],
      languages: ['Deutsch'],
      insuranceType: 'PUBLIC',
      format: 'BOTH',
      maxDistanceKm: 50,
      latitude: 48.2082,  // Wien
      longitude: 16.3738,
      city: 'Wien',
      maxWaitWeeks: 4,
      preferredMethods: ['Verhaltenstherapie', 'Achtsamkeit'],
    }

    const result1 = await findMatches(test1, { limit: 5, includeFiltered: true })

    console.log(`\n✅ Gefunden: ${result1.total} passende Therapeut:innen`)
    if (result1.filtered && result1.filtered.length > 0) {
      console.log(`⚠️  ${result1.filtered.length} Therapeut:innen wurden gefiltert:`)
      const filterReasons = result1.filtered.reduce((acc, f) => {
        acc[f.reason] = (acc[f.reason] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      Object.entries(filterReasons).forEach(([reason, count]) => {
        console.log(`   - ${reason}: ${count}`)
      })
      console.log('')
    }
    console.log(`📊 Top ${result1.matches.length} Matches:\n`)

    result1.matches.forEach((match, i) => {
      console.log(`${i + 1}. ${match.therapist.displayName} - Score: ${(match.score * 100).toFixed(1)}%`)
      console.log(`   📍 ${match.therapist.city || 'Online'}${match.distanceKm ? ` (${match.distanceKm} km)` : ''}`)
      console.log(`   🎯 Spezialisierungen: ${match.therapist.specialties?.slice(0, 3).join(', ')}`)
      console.log(`   💰 ${match.therapist.priceMin && match.therapist.priceMax ? `€${match.therapist.priceMin/100}-${match.therapist.priceMax/100}` : 'k.A.'}`)
      console.log(`   Score-Details:`)
      console.log(`      - Spezialisierung: ${(match.scoreBreakdown.components.specialty.score * 100).toFixed(0)}%`)
      console.log(`      - Distanz: ${(match.scoreBreakdown.components.distance.score * 100).toFixed(0)}%`)
      console.log(`      - Verfügbarkeit: ${(match.scoreBreakdown.components.availability.score * 100).toFixed(0)}%`)
      console.log(`      - Methoden: ${(match.scoreBreakdown.components.methods.score * 100).toFixed(0)}%`)
      console.log(`   📝 Gründe: ${match.explanation?.reasons?.slice(0, 2).join(', ') || 'k.A.'}`)
      console.log('')
    })

    // Test Case 2: Trauma + EMDR, Graz Nähe
    console.log('\n\n📋 TEST CASE 2: Trauma + EMDR + Graz Nähe')
    console.log('-'.repeat(80))
    const test2: MatchingPreferencesInput = {
      problemAreas: ['Trauma', 'PTBS'],
      languages: ['Deutsch'],
      insuranceType: 'PRIVATE',
      format: 'IN_PERSON',
      maxDistanceKm: 30,
      latitude: 47.0707,  // Graz
      longitude: 15.4395,
      city: 'Graz',
      maxWaitWeeks: 8,
      preferredMethods: ['EMDR', 'Traumatherapie'],
    }

    const result2 = await findMatches(test2, { limit: 5 })

    console.log(`\n✅ Gefunden: ${result2.total} passende Therapeut:innen`)
    console.log(`📊 Top ${result2.matches.length} Matches:\n`)

    result2.matches.forEach((match, i) => {
      console.log(`${i + 1}. ${match.therapist.displayName} - Score: ${(match.score * 100).toFixed(1)}%`)
      console.log(`   📍 ${match.therapist.city || 'Online'}${match.distanceKm ? ` (${match.distanceKm} km)` : ''}`)
      console.log(`   🎯 Spezialisierungen: ${match.therapist.specialties?.slice(0, 3).join(', ')}`)
      console.log(`   Gesamt-Score: ${(match.score * 100).toFixed(1)}%`)
      console.log('')
    })

    // Test Case 3: Paartherapie, überall in Österreich, Online
    console.log('\n\n📋 TEST CASE 3: Paartherapie + Online')
    console.log('-'.repeat(80))
    const test3: MatchingPreferencesInput = {
      problemAreas: ['Beziehungsprobleme', 'Paartherapie'],
      languages: ['Deutsch'],
      insuranceType: 'ANY',
      format: 'ONLINE',
      preferredMethods: ['Systemische Therapie'],
    }

    const result3 = await findMatches(test3, { limit: 5 })

    console.log(`\n✅ Gefunden: ${result3.total} passende Therapeut:innen`)
    console.log(`📊 Top ${result3.matches.length} Matches:\n`)

    result3.matches.forEach((match, i) => {
      console.log(`${i + 1}. ${match.therapist.displayName} - Score: ${(match.score * 100).toFixed(1)}%`)
      console.log(`   📍 ${match.therapist.city || 'Online'}`)
      console.log(`   🎯 Spezialisierungen: ${match.therapist.specialties?.slice(0, 3).join(', ')}`)
      console.log(`   Gesamt-Score: ${(match.score * 100).toFixed(1)}%`)
      console.log('')
    })

    // Test Case 4: ADHS bei Kindern
    console.log('\n\n📋 TEST CASE 4: ADHS bei Kindern')
    console.log('-'.repeat(80))
    const test4: MatchingPreferencesInput = {
      problemAreas: ['ADHS', 'Lernstörungen'],
      languages: ['Deutsch'],
      insuranceType: 'PUBLIC',
      format: 'IN_PERSON',
      maxDistanceKm: 100,
      latitude: 48.3064,  // Linz
      longitude: 14.2858,
      city: 'Linz',
      maxWaitWeeks: 2,
    }

    const result4 = await findMatches(test4, { limit: 5 })

    console.log(`\n✅ Gefunden: ${result4.total} passende Therapeut:innen`)
    console.log(`📊 Top ${result4.matches.length} Matches:\n`)

    result4.matches.forEach((match, i) => {
      console.log(`${i + 1}. ${match.therapist.displayName} - Score: ${(match.score * 100).toFixed(1)}%`)
      console.log(`   📍 ${match.therapist.city || 'Online'}${match.distanceKm ? ` (${match.distanceKm} km)` : ''}`)
      console.log(`   🎯 Spezialisierungen: ${match.therapist.specialties?.slice(0, 3).join(', ')}`)
      console.log(`   Altersgruppen: ${match.therapist.ageGroups?.join(', ') || 'k.A.'}`)
      console.log(`   Gesamt-Score: ${(match.score * 100).toFixed(1)}%`)
      console.log('')
    })

    console.log('\n' + '='.repeat(80))
    console.log('✨ Matching-Tests abgeschlossen!')
    console.log('='.repeat(80))

  } catch (error) {
    console.error('❌ Fehler beim Testen:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testMatching()
