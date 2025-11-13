import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const REGISTER_AUTHORITY = 'BMSGPK Psychotherapie-Verzeichnis'
const BATCH_SIZE = 250

const FOCUS_RULES = [
  {
    pattern: /verhaltenstherapie|kognitive|behavior/i,
    tags: ['Angst & Panik', 'Depression', 'Stress & Burnout'],
  },
  {
    pattern: /systemische|familien|paar|relational/i,
    tags: ['Familie & Beziehungen', 'Paartherapie', 'Kinder & Jugendliche'],
  },
  {
    pattern: /psychoanalyse|psychoanalytisch|psychodynamisch/i,
    tags: ['Selbstwert & Identität', 'Langzeittherapie', 'Emotionale Tiefe'],
  },
  {
    pattern: /gestalt|humanistisch|personzentriert|personenzentriert|klienten/i,
    tags: ['Selbstentwicklung', 'Krisenbewältigung', 'Resilienz & Ressourcen'],
  },
  {
    pattern: /integrativ|existenzanalyse|logotherapie/i,
    tags: ['Sinn & Orientierung', 'Lebenskrisen', 'Trauma & Belastung'],
  },
  {
    pattern: /hypnose|katathym|imaginativ|trance/i,
    tags: ['Körper & Psyche', 'Schlaf & Entspannung', 'Trauma & Belastung'],
  },
  {
    pattern: /gruppen/i,
    tags: ['Gruppentherapie', 'soziale Kompetenzen'],
  },
  {
    pattern: /musik/i,
    tags: ['Kreative Therapie', 'Kinder & Jugendliche'],
  },
]

const DEFAULT_TAGS = [
  'Allgemeine Psychotherapie',
  'Stärkung der mentalen Gesundheit',
  'Individuelle Begleitung',
]

const TAG_PRIORITY = [
  'Angst & Panik',
  'Depression',
  'Stress & Burnout',
  'Familie & Beziehungen',
  'Paartherapie',
  'Kinder & Jugendliche',
  'Trauma & Belastung',
  'Selbstwert & Identität',
  'Körper & Psyche',
  'Langzeittherapie',
  'Selbstentwicklung',
  'Krisenbewältigung',
  'Resilienz & Ressourcen',
  'Sinn & Orientierung',
  'Lebenskrisen',
  'Emotionale Tiefe',
  'Gruppentherapie',
  'soziale Kompetenzen',
  'Kreative Therapie',
  'Allgemeine Psychotherapie',
  'Stärkung der mentalen Gesundheit',
  'Individuelle Begleitung',
]

async function main() {
  const total = await prisma.therapistProfile.count({
    where: { licenseAuthority: REGISTER_AUTHORITY },
  })

  console.log(`🔎 Found ${total} register-imported profiles to enrich`)

  let skip = 0
  let updated = 0

  while (skip < total) {
    const profiles = await prisma.therapistProfile.findMany({
      where: { licenseAuthority: REGISTER_AUTHORITY },
      select: {
        id: true,
        specialties: true,
        services: true,
        qualifications: true,
      },
      skip,
      take: BATCH_SIZE,
      orderBy: { id: 'asc' },
    })

    if (!profiles.length) {
      break
    }

    for (const profile of profiles) {
      const methods = profile.specialties ?? []
      const services = profile.services ?? []
      const focusTags = deriveFocusTags(methods, services)
      const methodQualifications = methods
        .filter((method) => Boolean(method))
        .map((method) => `Methode: ${method}`)

      const mergedQualifications = mergeUniqueArrays(
        profile.qualifications ?? [],
        methodQualifications,
      ).slice(0, 8)

      const needsUpdate =
        !arraysEqual(profile.specialties, focusTags) ||
        !arraysEqual(profile.qualifications ?? [], mergedQualifications)

      if (!needsUpdate) {
        continue
      }

      await prisma.therapistProfile.update({
        where: { id: profile.id },
        data: {
          specialties: focusTags,
          qualifications: mergedQualifications,
        },
      })
      updated += 1
    }

    skip += profiles.length
    console.log(`… processed ${Math.min(skip, total)} / ${total}`)
  }

  console.log(`✅ Enrichment complete. Updated ${updated} profiles out of ${total}.`)
}

function deriveFocusTags(methods, services) {
  const tags = new Set()
  const normalizedMethods = methods.map((method) => method?.toLowerCase() ?? '')
  for (const method of normalizedMethods) {
    for (const rule of FOCUS_RULES) {
      if (rule.pattern.test(method)) {
        rule.tags.forEach((tag) => tags.add(tag))
      }
    }
  }

  if (services.some((service) => service.toLowerCase().includes('musik'))) {
    tags.add('Kreative Therapie')
  }

  if (tags.size === 0) {
    DEFAULT_TAGS.forEach((tag) => tags.add(tag))
  }

  const sorted = Array.from(tags).sort((a, b) => {
    const indexA = TAG_PRIORITY.indexOf(a)
    const indexB = TAG_PRIORITY.indexOf(b)
    return (indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA) -
      (indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB)
  })

  return sorted.slice(0, 5)
}

function mergeUniqueArrays(existing, additions) {
  const set = new Set(existing.filter(Boolean))
  additions.forEach((item) => {
    if (item) {
      set.add(item)
    }
  })
  return Array.from(set)
}

function arraysEqual(a = [], b = []) {
  if (a.length !== b.length) {
    return false
  }
  return a.every((value, index) => value === b[index])
}

main()
  .catch((error) => {
    console.error('❌ Enrichment failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
