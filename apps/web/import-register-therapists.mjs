import fs from 'node:fs'
import path from 'node:path'
import { TextDecoder } from 'node:util'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const decoder = new TextDecoder('latin1')

const DEFAULT_FILE = '/tmp/pth_search.csv'

const args = process.argv.slice(2)
const options = parseArgs(args)

async function main() {
  const csvPath = path.resolve(options.file ?? DEFAULT_FILE)
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found at ${csvPath}`)
  }

  const rows = loadCsv(csvPath)
  const limitedRows =
    typeof options.limit === 'number' && options.limit > 0 ? rows.slice(0, options.limit) : rows

  console.log(
    `📥 Loaded ${limitedRows.length} therapist records from ${csvPath}${
      options.dryRun ? ' (dry-run)' : ''
    }`,
  )

  const licenseIds = Array.from(
    new Set(
      limitedRows
        .map((row) => value(row, 'Eintragungs Nummer'))
        .filter((license) => Boolean(license)),
    ),
  )

  const candidateEmails = Array.from(
    new Set(
      limitedRows
        .map((row) => sanitizeEmail(pickEmail(row)))
        .filter((email) => Boolean(email)),
    ),
  )

  const [existingProfiles, existingEmailRecords] = await Promise.all([
    licenseIds.length
      ? prisma.therapistProfile.findMany({
          where: { licenseId: { in: licenseIds } },
          select: { id: true, licenseId: true, userId: true },
        })
      : Promise.resolve([]),
    candidateEmails.length
      ? prisma.user.findMany({
          where: { email: { in: candidateEmails } },
          select: { email: true },
        })
      : Promise.resolve([]),
  ])

  const existingProfilesByLicense = new Map(
    existingProfiles.map((profile) => [profile.licenseId, profile]),
  )
  const takenEmails = new Set(existingEmailRecords.map((entry) => entry.email.toLowerCase()))
  const assignedEmails = new Set()
  const processedLicenses = new Set()

  let created = 0
  let updated = 0
  let skipped = 0

  for (const row of limitedRows) {
    const mapped = mapRow(row)
    if (!mapped) {
      skipped += 1
      continue
    }

    if (processedLicenses.has(mapped.licenseId)) {
      skipped += 1
      continue
    }
    processedLicenses.add(mapped.licenseId)

    const existing = existingProfilesByLicense.get(mapped.licenseId)
    if (existing) {
      if (options.skipUpdates) {
        skipped += 1
        continue
      }
      if (options.dryRun) {
        console.log(`🔁 [dry-run] Would update profile ${mapped.profile.displayName}`)
        updated += 1
        continue
      }

      await prisma.$transaction([
        prisma.therapistProfile.update({
          where: { id: existing.id },
          data: mapped.profile,
        }),
        prisma.user.update({
          where: { id: existing.userId },
          data: {
            firstName: mapped.user.firstName,
            lastName: mapped.user.lastName,
          },
        }),
      ])
      updated += 1
      continue
    }

    const resolvedEmail = resolveEmail(
      mapped.emailCandidate,
      mapped.fallbackEmail,
      takenEmails,
      assignedEmails,
    )

    if (options.dryRun) {
      console.log(
        `✨ [dry-run] Would create profile ${mapped.profile.displayName} (${mapped.licenseId}) with email ${resolvedEmail}`,
      )
      created += 1
      continue
    }

    await prisma.user.create({
      data: {
        email: resolvedEmail,
        role: 'THERAPIST',
        locale: 'de-AT',
        marketingOptIn: false,
        firstName: mapped.user.firstName,
        lastName: mapped.user.lastName,
        therapistProfile: {
          create: mapped.profile,
        },
      },
    })
    created += 1
  }

  console.log(
    `✅ Completed register import: created ${created}, updated ${updated}, skipped ${skipped}.`,
  )
}

function parseArgs(input) {
  const result = {
    file: DEFAULT_FILE,
    limit: undefined,
    dryRun: false,
    skipUpdates: false,
  }

  for (let i = 0; i < input.length; i += 1) {
    const arg = input[i]
    if (arg === '--file' && input[i + 1]) {
      result.file = input[i + 1]
      i += 1
    } else if (arg === '--limit' && input[i + 1]) {
      result.limit = Number.parseInt(input[i + 1], 10)
      i += 1
    } else if (arg === '--dry-run') {
      result.dryRun = true
    } else if (arg === '--skip-updates' || arg === '--new-only') {
      result.skipUpdates = true
    }
  }

  return result
}

function loadCsv(filePath) {
  const raw = fs.readFileSync(filePath)
  const content = decoder.decode(raw)
  const lines = content.split(/\r?\n/)
  const headersLine = lines.shift()
  if (!headersLine) {
    return []
  }

  const headers = parseLine(headersLine).map((header) => header.replace(/^\ufeff/, '').trim())
  const rows = []

  for (const line of lines) {
    if (!line || !line.trim()) {
      continue
    }
    const values = parseLine(line)
    if (values.length === 1 && values[0] === '') {
      continue
    }

    const entry = {}
    headers.forEach((header, index) => {
      entry[header] = values[index] ?? ''
    })
    rows.push(entry)
  }

  return rows
}

function parseLine(line) {
  const cells = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ';' && !inQuotes) {
      cells.push(current)
      current = ''
    } else {
      current += char
    }
  }

  cells.push(current)
  return cells.map((cell) => cell.trim())
}

function mapRow(row) {
  const licenseId = value(row, 'Eintragungs Nummer')
  if (!licenseId) {
    return null
  }

  const firstName = formatName(value(row, 'Vorname'))
  const lastName = formatName(value(row, 'Familien-/Nachname'))
  const displayName = [firstName, lastName].filter(Boolean).join(' ').trim()
  if (!displayName) {
    return null
  }

  const title = value(row, 'Titel') || 'Psychotherapeut:in'
  const entryDate = parseDate(value(row, 'Eintragungdatum'))
  const yearsExperience = entryDate ? Math.max(differenceInYears(entryDate), 0) : null
  const specialties = parseList(value(row, 'PTH-Methoden'))
  const services = buildServices(row)
  const acceptedInsurance = buildInsurance(row)
  const locations = buildLocationInfo(row)
  const approachSummary = specialties.length
    ? `Methode: ${specialties.join(', ')}`
    : 'Psychotherapeutische Praxis'
  const experienceSummary = entryDate
    ? `Im Register seit ${entryDate.getFullYear()}`
    : 'Im BMSGPK-Register gelistet'
  const availabilityNoteParts = [
    entryDate ? `Eintragung seit ${entryDate.toISOString().slice(0, 10)}` : null,
    locations.phone ? `Telefon lt. Register: ${locations.phone}` : null,
    'Kontaktdaten laut Psychotherapie-Verzeichnis (gesundheit.gv.at).',
  ].filter(Boolean)
  const pricingNote = `GPL: ${value(row, 'GPL') || 'k. A.'} · KPL: ${value(row, 'KPL') || 'k. A.'}`

  const aboutSections = [
    'Automatischer Import aus dem Psychotherapie-Verzeichnis des BMSGPK.',
    locations.overview ? `Standorte: ${locations.overview}` : null,
  ].filter(Boolean)

  const methods = specialties.length ? specialties : ['Psychotherapie']

  return {
    licenseId,
    emailCandidate: sanitizeEmail(pickEmail(row)),
    fallbackEmail: buildFallbackEmail(licenseId),
    user: {
      firstName: firstName || null,
      lastName: lastName || null,
    },
    profile: {
      status: 'VERIFIED',
      licenseAuthority: 'BMSGPK Psychotherapie-Verzeichnis',
      licenseId,
      displayName,
      title,
      headline: locations.city ? `Psychotherapie in ${locations.city}` : 'Psychotherapie in Österreich',
      profileImageUrl: '/images/therapists/default.jpg',
      approachSummary,
      experienceSummary,
      services,
      acceptingClients: true,
      yearsExperience,
      responseTime: 'Antwort innerhalb weniger Tage',
      modalities: services.includes('Psychotherapie') ? ['Persönliche Sitzungen'] : [],
      specialties: methods,
      priceMin: null,
      priceMax: null,
      languages: ['Deutsch'],
      online: false,
      city: locations.city,
      country: 'AT',
      about: aboutSections.join(' '),
      availabilityNote: availabilityNoteParts.join(' '),
      pricingNote,
      isPublic: true,
      galleryImages: [],
      qualifications: title ? [title] : [],
      ageGroups: [],
      acceptedInsurance,
      privatePractice: true,
      rating: 0,
      reviewCount: 0,
    },
  }
}

function value(row, key) {
  const raw = row[key]
  if (!raw) {
    return ''
  }
  return String(raw).replace(/\s+/g, ' ').trim()
}

function pickEmail(row) {
  const keys = ['Email1', 'Email2', 'Email3']
  for (const key of keys) {
    const candidate = value(row, key)
    if (candidate && candidate.includes('@')) {
      return candidate
    }
  }
  return null
}

function sanitizeEmail(email) {
  if (!email) {
    return null
  }
  const normalized = email.trim().toLowerCase()
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
  return emailRegex.test(normalized) ? normalized : null
}

function formatName(input) {
  if (!input) {
    return ''
  }
  const lowercase = input.toLocaleLowerCase('de-AT')
  return lowercase.replace(/(^|[\s\-'])\p{L}/gu, (match) =>
    match.toLocaleUpperCase('de-AT'),
  )
}

function parseDate(value) {
  if (!value) {
    return null
  }
  const parts = value.split('.').map((part) => part.trim()).filter(Boolean)
  if (parts.length < 3) {
    return null
  }
  const [year, month, day] = parts.map((part) => Number.parseInt(part, 10))
  if (!year || !month || !day) {
    return null
  }
  const iso = new Date(Date.UTC(year, month - 1, day))
  return Number.isNaN(iso.getTime()) ? null : iso
}

function differenceInYears(date) {
  const now = new Date()
  let diff = now.getFullYear() - date.getFullYear()
  const monthDiff = now.getMonth() - date.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) {
    diff -= 1
  }
  return diff
}

function parseList(value) {
  if (!value) {
    return []
  }
  return value
    .split(/[,/;]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function buildServices(row) {
  const list = []
  if (value(row, 'Psychotherapie').toLowerCase() === 'ja') {
    list.push('Psychotherapie')
  }
  if (value(row, 'Musiktherapie').toLowerCase() === 'ja') {
    list.push('Musiktherapie')
  }
  return list.length ? list : ['Psychotherapie']
}

function buildInsurance(row) {
  const list = []
  const gpl = value(row, 'GPL').toLowerCase()
  const kpl = value(row, 'KPL').toLowerCase()
  if (gpl === 'ja') {
    list.push('GPL')
  }
  if (kpl === 'ja') {
    list.push('KPL')
  }
  return list
}

function buildLocationInfo(row) {
  const berufssitz = collectLocations(row, 'Berufssitz', 'Berufssitz')
  const arbeitsort = collectLocations(row, 'Arbeitsort', 'Arbeitsort')
  const combined = [...berufssitz, ...arbeitsort]

  const overview = combined
    .map((entry) => `${entry.type}: ${formatLocation(entry)}`)
    .filter(Boolean)
    .join(' | ')

  const phone = combined.find((entry) => entry.phone)?.phone || ''
  const city = (combined.find((entry) => entry.city)?.city || '').trim() || null

  return {
    overview,
    phone,
    city,
  }
}

function collectLocations(row, prefix, typeLabel) {
  const entries = []
  for (let i = 1; i <= 4; i += 1) {
    const label = value(row, `${prefix} ${i}`)
    const city = value(row, `${prefix} Ort ${i}`)
    const plz = value(row, `${prefix} PLZ ${i}`)
    const street = value(row, `${prefix} Straße ${i}`)
    const house = value(row, `${prefix} HausNr ${i}`)
    const phone = value(row, `${prefix} Telefon ${i}`)

    if (label || city || plz || street) {
      entries.push({
        type: typeLabel,
        label,
        city,
        plz,
        street,
        house,
        phone,
      })
    }
  }
  return entries
}

function formatLocation(entry) {
  const parts = []
  if (entry.label) {
    parts.push(entry.label)
  }
  const streetLine = [entry.street, entry.house].filter(Boolean).join(' ').trim()
  const cityLine = [entry.plz, entry.city].filter(Boolean).join(' ').trim()
  const addressParts = [streetLine, cityLine].filter(Boolean)
  if (addressParts.length) {
    parts.push(addressParts.join(', '))
  }
  return parts.join(' – ')
}

function resolveEmail(candidate, fallback, takenEmails, assignedEmails) {
  const normalized = candidate?.toLowerCase()
  if (normalized && !takenEmails.has(normalized) && !assignedEmails.has(normalized)) {
    assignedEmails.add(normalized)
    return normalized
  }
  const fallbackNormalized = fallback.toLowerCase()
  assignedEmails.add(fallbackNormalized)
  return fallbackNormalized
}

function buildFallbackEmail(licenseId) {
  const normalized = licenseId
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '')
  const slug = normalized || `auto${Math.random().toString(36).slice(2, 8)}`
  return `register+${slug}@findmytherapy.at`
}

main()
  .catch((error) => {
    console.error('❌ Register import failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
