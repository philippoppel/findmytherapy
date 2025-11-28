import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Female first names (same as in seed-demo-therapists.ts)
const femaleFirstNames = new Set([
  'Anna', 'Maria', 'Sophie', 'Laura', 'Julia', 'Lena', 'Sarah', 'Lisa', 'Emma', 'Hannah',
  'Katharina', 'Christina', 'Elisabeth', 'Barbara', 'Monika', 'Sabine', 'Claudia', 'Petra', 'Andrea', 'Susanne',
  'Martina', 'Eva', 'Birgit', 'Michaela', 'Doris', 'Karin', 'Sandra', 'Silvia', 'Marion', 'Cornelia',
  'Anja', 'Nicole', 'Melanie', 'Daniela', 'Stefanie', 'Sonja', 'Jasmin', 'Nadine', 'Verena', 'Simone',
  'Helena', 'Margarethe', 'Ingrid', 'Renate', 'Ursula', 'Gabriele', 'Johanna',
])

// Male first names
const maleFirstNames = new Set([
  'Thomas', 'Michael', 'Stefan', 'Christian', 'Andreas', 'Markus', 'Alexander', 'Daniel', 'Martin', 'Peter',
  'Wolfgang', 'Franz', 'Georg', 'Robert', 'Tobias',
])

function inferGender(displayName: string | null, firstName: string | null): 'male' | 'female' | null {
  // Try to extract first name from displayName (removing titles like Dr., Mag., etc.)
  const nameToCheck = displayName || firstName
  if (!nameToCheck) return null

  // Remove common titles
  const cleanName = nameToCheck
    .replace(/^(Mag\.|Dr\.in|Dr\.|Mag\. Dr\.|Dipl\.-Psych\.|Prof\.|Univ\.-Prof\.)\s*/gi, '')
    .trim()

  // Get the first word (should be the first name)
  const firstWord = cleanName.split(/\s+/)[0]
  if (!firstWord) return null

  if (femaleFirstNames.has(firstWord)) return 'female'
  if (maleFirstNames.has(firstWord)) return 'male'

  // Check for common female name endings
  if (firstWord.endsWith('a') || firstWord.endsWith('e') || firstWord.endsWith('ine') || firstWord.endsWith('ia')) {
    return 'female'
  }

  return null
}

async function main() {
  console.log('🔍 Suche Therapeuten ohne Gender...\n')

  const therapistsWithoutGender = await prisma.therapistProfile.findMany({
    where: {
      OR: [
        { gender: null },
        { gender: '' },
      ],
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  })

  console.log(`📊 Gefunden: ${therapistsWithoutGender.length} Therapeuten ohne Gender\n`)

  if (therapistsWithoutGender.length === 0) {
    console.log('✅ Alle Therapeuten haben bereits ein Gender!')
    return
  }

  let updated = 0
  let skipped = 0

  for (const therapist of therapistsWithoutGender) {
    const inferredGender = inferGender(therapist.displayName, therapist.user.firstName)

    if (inferredGender) {
      await prisma.therapistProfile.update({
        where: { id: therapist.id },
        data: { gender: inferredGender },
      })
      updated++
      console.log(`  ✓ ${therapist.displayName}: ${inferredGender}`)
    } else {
      skipped++
      console.log(`  ⚠ ${therapist.displayName}: Gender konnte nicht ermittelt werden`)
    }
  }

  console.log(`\n✅ Fertig!`)
  console.log(`   Aktualisiert: ${updated}`)
  console.log(`   Übersprungen: ${skipped}`)

  // Show final statistics
  const genderStats = await prisma.therapistProfile.groupBy({
    by: ['gender'],
    _count: true,
  })

  console.log('\n📊 Gender-Verteilung:')
  genderStats.forEach(stat => {
    console.log(`   ${stat.gender || 'null'}: ${stat._count}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Update fehlgeschlagen:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
