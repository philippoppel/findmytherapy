const URGENT_PATTERNS = [
  /heute/i,
  /sofort/i,
  /innerhalb.*(?:tage|wochen)/i,
  /kurzfrist/i,
  /freie?n?\s+slots?/i,
  /akut/i,
  /telefon/i,
]

const SOON_PATTERNS = [
  /nächste?\s+woche/i,
  /in\s+[12]\s*wochen?/i,
  /ab\s+kommender\s+woche/i,
  /ab\s+\d{1,2}\.\s*(?:kw|woche)/i,
  /slots?\s+in\s+1/i,
]

const WAITLIST_PATTERNS = [/warteliste/i, /keine\s+kapazität/i, /auf\s+anfrage/i, /ausgebucht/i]

const MONTHS_DE: Record<string, number> = {
  januar: 0,
  jaenner: 0,
  jänner: 0,
  februar: 1,
  märz: 2,
  maerz: 2,
  april: 3,
  mai: 4,
  may: 4,
  juni: 5,
  juli: 6,
  august: 7,
  september: 8,
  oktober: 9,
  november: 10,
  dezember: 11,
  dez: 11,
}

export type AvailabilityMeta = {
  label: string
  rank: number
  nextAvailableDate: Date | null
}

export function getAvailabilityMeta(note: string | null | undefined, acceptingClients: boolean): AvailabilityMeta {
  const label = buildAvailabilityLabel(note, acceptingClients)
  const normalizedSource = (note ?? label).toLowerCase()
  let rank = acceptingClients ? 1 : 3

  if (WAITLIST_PATTERNS.some((pattern) => pattern.test(normalizedSource))) {
    rank = 4
  }
  if (SOON_PATTERNS.some((pattern) => pattern.test(normalizedSource))) {
    rank = Math.min(rank, 1)
  }
  if (URGENT_PATTERNS.some((pattern) => pattern.test(normalizedSource))) {
    rank = 0
  }

  const nextDate = extractNextDate(normalizedSource)
  if (nextDate) {
    const diffDays = Math.ceil((nextDate.getTime() - today().getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays <= 7) {
      rank = Math.min(rank, 1)
    } else if (diffDays <= 21) {
      rank = Math.max(rank, 2)
    } else {
      rank = Math.max(rank, 3)
    }
  }

  return {
    label,
    rank,
    nextAvailableDate: nextDate,
  }
}

function buildAvailabilityLabel(note: string | null | undefined, acceptingClients: boolean) {
  if (!note) {
    return acceptingClients ? 'Aktuell verfügbar' : 'Kapazität auf Anfrage'
  }

  const registerPhoneMatch = note.match(/Telefon lt\. Register:\s*([0-9A-Za-z+()/\s-]+)/i)
  if (/Psychotherapie-Verzeichnis/i.test(note)) {
    if (registerPhoneMatch) {
      return `Telefon laut Register: ${registerPhoneMatch[1].trim()}`
    }
    return 'Kontakt laut Gesundheitsministerium'
  }

  const sanitized = note
    .replace(/Eintragung seit [0-9.-]+/i, '')
    .replace(/Telefon lt\. Register:\s*[0-9A-Za-z+()/\s-]+/i, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (sanitized) {
    return sanitized
  }

  return acceptingClients ? 'Aktuell verfügbar' : 'Kapazität auf Anfrage'
}

function extractNextDate(normalizedNote: string) {
  const match = normalizedNote.match(/(\d{1,2})\.\s*(januar|jaenner|jänner|februar|märz|maerz|april|mai|juni|juli|august|september|oktober|november|dezember|dez)\b/)
  if (!match) {
    return null
  }
  const day = Number(match[1])
  const monthKey = match[2]
  const monthIndex = MONTHS_DE[monthKey]
  if (Number.isNaN(day) || monthIndex === undefined) {
    return null
  }

  const currentYear = today().getFullYear()
  const candidate = new Date(Date.UTC(currentYear, monthIndex, day))
  if (candidate.getTime() < today().getTime()) {
    candidate.setUTCFullYear(currentYear + 1)
  }
  return candidate
}

function today() {
  return new Date()
}
