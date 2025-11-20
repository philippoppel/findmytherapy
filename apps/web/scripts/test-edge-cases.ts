import { PrismaClient } from '@prisma/client'
import { findMatches } from '../lib/matching/matching-service'
import type { MatchingPreferencesInput } from '../lib/matching/types'

const prisma = new PrismaClient()

async function testEdgeCases() {
  try {
    console.log('🧪 Teste Edge Cases für Matching-Algorithmus\n')
    console.log('=' .repeat(80))

    // Edge Case 1: Türkisch + Online (vermutlich keine Ergebnisse)
    console.log('\n\n📋 EDGE CASE 1: Türkisch + Online')
    console.log('-'.repeat(80))
    const test1: MatchingPreferencesInput = {
      problemAreas: ['Angst'],
      languages: ['Türkisch'],
      insuranceType: 'ANY',
      format: 'ONLINE',
    }

    const result1 = await findMatches(test1, { limit: 10, includeFiltered: true })

    console.log(`\n${result1.total === 0 ? '❌' : '✅'} Gefunden: ${result1.total} passende Therapeut:innen`)
    if (result1.filtered && result1.filtered.length > 0) {
      console.log(`⚠️  ${result1.filtered.length} Therapeut:innen wurden gefiltert:`)
      const filterReasons = result1.filtered.reduce((acc, f) => {
        acc[f.reason] = (acc[f.reason] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      Object.entries(filterReasons).forEach(([reason, count]) => {
        console.log(`   - ${reason}: ${count}`)
      })
    }

    // Edge Case 2: Nur ONLINE wünschen, schauen ob wirklich NUR Online kommt
    console.log('\n\n📋 EDGE CASE 2: Nur Online-Therapeuten (Kontrolle)')
    console.log('-'.repeat(80))
    const test2: MatchingPreferencesInput = {
      problemAreas: ['Depression'],
      languages: ['Deutsch'],
      insuranceType: 'ANY',
      format: 'ONLINE',
    }

    const result2 = await findMatches(test2, { limit: 5 })

    console.log(`\n✅ Gefunden: ${result2.total} passende Therapeut:innen`)
    console.log(`📊 Prüfe ob ALLE Online anbieten:\n`)

    const allOnline = result2.matches.every(m => m.therapist.online)
    console.log(`${allOnline ? '✅' : '❌'} ALLE Ergebnisse bieten Online an: ${allOnline}`)

    result2.matches.forEach((match, i) => {
      console.log(`${i + 1}. ${match.therapist.displayName}`)
      console.log(`   🌐 Online: ${match.therapist.online ? '✅ JA' : '❌ NEIN'}`)
      console.log(`   📍 Stadt: ${match.therapist.city || 'k.A.'}`)
    })

    // Edge Case 3: Nur IN_PERSON, schauen ob keine rein-online kommen
    console.log('\n\n📋 EDGE CASE 3: Nur Präsenz-Therapeuten (Kontrolle)')
    console.log('-'.repeat(80))
    const test3: MatchingPreferencesInput = {
      problemAreas: ['Angst'],
      languages: ['Deutsch'],
      insuranceType: 'ANY',
      format: 'IN_PERSON',
      latitude: 48.2082,
      longitude: 16.3738,
      maxDistanceKm: 50,
    }

    const result3 = await findMatches(test3, { limit: 5 })

    console.log(`\n✅ Gefunden: ${result3.total} passende Therapeut:innen`)
    console.log(`📊 Prüfe ob ALLE Präsenz anbieten:\n`)

    result3.matches.forEach((match, i) => {
      const hasLocation = !!(match.therapist.city || match.therapist.latitude)
      console.log(`${i + 1}. ${match.therapist.displayName}`)
      console.log(`   📍 Standort: ${hasLocation ? '✅ JA' : '❌ NEIN'} (${match.therapist.city || 'k.A.'})`)
      console.log(`   🌐 Nur Online: ${!hasLocation && match.therapist.online ? '❌ JA (FEHLER!)' : '✅ NEIN'}`)
    })

    console.log('\n' + '='.repeat(80))
    console.log('✨ Edge Case Tests abgeschlossen!')
    console.log('='.repeat(80))

  } catch (error) {
    console.error('❌ Fehler beim Testen:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testEdgeCases()
