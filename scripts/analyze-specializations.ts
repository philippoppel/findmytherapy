#!/usr/bin/env tsx

/**
 * Specialization Analysis Script
 *
 * Analyzes all specializations in the database and suggests categories.
 * This helps identify patterns, duplicates, and create a standardized taxonomy.
 *
 * Usage:
 *   DATABASE_URL="..." tsx scripts/analyze-specializations.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface SpecialtyStats {
  specialty: string
  count: number
  variations: Set<string>
}

function normalizeSpecialty(specialty: string): string {
  return specialty
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, ' ') // Normalize whitespace
}

function calculateSimilarity(a: string, b: string): number {
  const longer = a.length > b.length ? a : b
  const shorter = a.length > b.length ? b : a

  if (longer.length === 0) return 1.0

  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(0))

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // insertion
        matrix[j - 1][i] + 1,     // deletion
        matrix[j - 1][i - 1] + cost // substitution
      )
    }
  }

  return matrix[b.length][a.length]
}

function groupSimilarSpecialties(specialties: Map<string, SpecialtyStats>): Map<string, string[]> {
  const groups = new Map<string, string[]>()
  const processed = new Set<string>()

  const sortedSpecialties = Array.from(specialties.entries())
    .sort((a, b) => b[1].count - a[1].count) // Sort by frequency

  for (const [specialty, stats] of sortedSpecialties) {
    if (processed.has(specialty)) continue

    const group: string[] = [specialty]
    processed.add(specialty)

    // Find similar unprocessed specialties
    for (const [otherSpecialty] of sortedSpecialties) {
      if (processed.has(otherSpecialty)) continue

      const similarity = calculateSimilarity(specialty, otherSpecialty)

      // Group if similarity > 70% or one contains the other
      if (
        similarity > 0.7 ||
        specialty.includes(otherSpecialty) ||
        otherSpecialty.includes(specialty)
      ) {
        group.push(otherSpecialty)
        processed.add(otherSpecialty)
      }
    }

    if (group.length > 0) {
      groups.set(specialty, group)
    }
  }

  return groups
}

async function main() {
  console.log('🔍 Analyzing Specializations\n')
  console.log('=' .repeat(80))

  // Fetch all therapist profiles with specialties
  const profiles = await prisma.therapistProfile.findMany({
    where: {
      isPublic: true,
      status: 'VERIFIED',
    },
    select: {
      id: true,
      specialties: true,
    },
  })

  console.log(`Found ${profiles.length} verified profiles\n`)

  // Aggregate all specialties
  const specialtyMap = new Map<string, SpecialtyStats>()
  let totalSpecialties = 0

  for (const profile of profiles) {
    for (const specialty of profile.specialties || []) {
      if (!specialty || specialty.trim().length === 0) continue

      totalSpecialties++
      const normalized = normalizeSpecialty(specialty)

      if (!specialtyMap.has(normalized)) {
        specialtyMap.set(normalized, {
          specialty: normalized,
          count: 0,
          variations: new Set(),
        })
      }

      const stats = specialtyMap.get(normalized)!
      stats.count++
      stats.variations.add(specialty) // Keep original for reference
    }
  }

  console.log(`📊 STATISTICS:`)
  console.log(`Total specialty mentions: ${totalSpecialties}`)
  console.log(`Unique specialties (normalized): ${specialtyMap.size}`)
  console.log(`Average specialties per profile: ${(totalSpecialties / profiles.length).toFixed(1)}`)
  console.log('')

  // Sort by frequency
  const sortedSpecialties = Array.from(specialtyMap.entries())
    .sort((a, b) => b[1].count - a[1].count)

  // Top specialties
  console.log('🏆 TOP 30 SPECIALIZATIONS:')
  console.log('=' .repeat(80))
  sortedSpecialties.slice(0, 30).forEach(([specialty, stats], index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${specialty.padEnd(40)} ${stats.count.toString().padStart(3)}x`)
    if (stats.variations.size > 1) {
      console.log(`    Variations: ${Array.from(stats.variations).slice(0, 3).join(', ')}`)
    }
  })
  console.log('')

  // Group similar specialties
  console.log('🔗 SIMILAR SPECIALTIES (Potential Duplicates):')
  console.log('=' .repeat(80))
  const groups = groupSimilarSpecialties(specialtyMap)
  let groupCount = 0

  for (const [main, similar] of groups.entries()) {
    if (similar.length > 1) {
      groupCount++
      const totalCount = similar.reduce((sum, s) => sum + (specialtyMap.get(s)?.count || 0), 0)
      console.log(`\nGroup ${groupCount}: "${main}" (${totalCount} mentions)`)
      similar.forEach(s => {
        const count = specialtyMap.get(s)?.count || 0
        console.log(`  - ${s} (${count}x)`)
      })
    }
  }
  console.log('')

  // Suggest categories based on common themes
  console.log('💡 SUGGESTED CATEGORIES:')
  console.log('=' .repeat(80))

  const categoryKeywords = {
    'Angst & Panik': ['angst', 'panik', 'phobie', 'zwang'],
    'Depression': ['depression', 'depressiv', 'burnout', 'erschopfung'],
    'Trauma & PTBS': ['trauma', 'ptbs', 'ptsd', 'missbrauch', 'gewalt'],
    'Beziehungen & Familie': ['beziehung', 'partnerschaft', 'ehe', 'familie', 'trennung', 'scheidung'],
    'Ess-Störungen': ['essstorung', 'anorexie', 'bulimie', 'binge'],
    'Sucht': ['sucht', 'abhangigkeit', 'alkohol', 'drogen'],
    'Persönlichkeitsstörungen': ['personlichkeit', 'borderline', 'narziss'],
    'Stress & Lebenskrise': ['stress', 'krise', 'lebenskrise', 'sinnkrise'],
    'Selbstwert': ['selbstwert', 'selbstvertrauen', 'selbstbewusstsein'],
    'Schlaf': ['schlaf', 'schlafstorung', 'insomnie'],
    'Trauer & Verlust': ['trauer', 'verlust', 'tod'],
    'Sexualität': ['sexualitat', 'sexuelle'],
    'Kinder & Jugendliche': ['kinder', 'jugend', 'eltern'],
    'Arbeit & Karriere': ['arbeit', 'karriere', 'beruf', 'mobbing'],
  }

  const categoryMatches = new Map<string, { specialties: string[]; count: number }>()

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const matches: string[] = []
    let totalCount = 0

    for (const [specialty, stats] of specialtyMap.entries()) {
      if (keywords.some(kw => specialty.includes(kw))) {
        matches.push(specialty)
        totalCount += stats.count
      }
    }

    if (matches.length > 0) {
      categoryMatches.set(category, { specialties: matches, count: totalCount })
    }
  }

  // Print categorization results
  Array.from(categoryMatches.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .forEach(([category, data]) => {
      console.log(`\n📁 ${category} (${data.count} mentions, ${data.specialties.length} specialties)`)
      data.specialties.slice(0, 8).forEach(s => {
        const count = specialtyMap.get(s)?.count || 0
        console.log(`   - ${s} (${count}x)`)
      })
      if (data.specialties.length > 8) {
        console.log(`   ... and ${data.specialties.length - 8} more`)
      }
    })

  console.log('\n' + '=' .repeat(80))
  console.log('✅ Analysis complete!')
}

main()
  .catch(error => {
    console.error('Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
