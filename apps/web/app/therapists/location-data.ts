export type Coordinates = {
  lat: number
  lng: number
}

export const PLACEHOLDER_IMAGE_KEYWORDS = ['/images/therapists/therapy-']

const CITY_KEY_SYNONYMS: Record<string, string> = {
  vienna: 'wien',
  'sankt polten': 'st polten',
  'sankt-poelten': 'st polten',
  'st. polten': 'st polten',
  'st polten': 'st polten',
  'st polten land': 'st polten',
  'steyr land': 'steyr',
  innsbruckstadt: 'innsbruck',
  'klosterneuburg': 'klosterneuburg',
}

const CITY_COORDINATES: Record<string, Coordinates> = {
  wien: { lat: 48.2082, lng: 16.3738 },
  'st polten': { lat: 48.2085, lng: 15.6245 },
  graz: { lat: 47.0707, lng: 15.4395 },
  linz: { lat: 48.3069, lng: 14.2858 },
  salzburg: { lat: 47.8095, lng: 13.055 },
  innsbruck: { lat: 47.2692, lng: 11.4041 },
  klagenfurt: { lat: 46.636, lng: 14.3122 },
  villach: { lat: 46.6141, lng: 13.8506 },
  wels: { lat: 48.157, lng: 14.0249 },
  bregenz: { lat: 47.5031, lng: 9.7471 },
  dornbirn: { lat: 47.4125, lng: 9.7431 },
  feldkirch: { lat: 47.243, lng: 9.5851 },
  eisenstadt: { lat: 47.8456, lng: 16.5235 },
  modling: { lat: 48.0861, lng: 16.2892 },
  moedling: { lat: 48.0861, lng: 16.2892 },
  baden: { lat: 48.005, lng: 16.2306 },
  steyr: { lat: 48.0427, lng: 14.4213 },
  'wiener neustadt': { lat: 47.8049, lng: 16.2362 },
  'steyr land': { lat: 48.0427, lng: 14.4213 },
  'klosterneuburg': { lat: 48.3059, lng: 16.3253 },
  'sankt poelten': { lat: 48.2085, lng: 15.6245 },
  'steyr-stadt': { lat: 48.0427, lng: 14.4213 },
  'steyr stadt': { lat: 48.0427, lng: 14.4213 },
  'steyr-stadt & bezirk': { lat: 48.0427, lng: 14.4213 },
  'leoben': { lat: 47.3842, lng: 15.0913 },
  'bruck an der mur': { lat: 47.4107, lng: 15.2671 },
  'feldkirchen in karnten': { lat: 46.7228, lng: 14.0956 },
  'schwechat': { lat: 48.1366, lng: 16.474 },
  'amstetten': { lat: 48.1221, lng: 14.8721 },
  'st polten-land': { lat: 48.2085, lng: 15.6245 },
  'st pölten': { lat: 48.2085, lng: 15.6245 },
  'wien-umgebung': { lat: 48.2082, lng: 16.3738 },
  'online': { lat: 0, lng: 0 },
}

const CITY_POSTAL_HINTS: Record<string, string[]> = {
  wien: [
    '1010',
    '1020',
    '1030',
    '1040',
    '1050',
    '1060',
    '1070',
    '1080',
    '1090',
    '1100',
    '1110',
    '1120',
    '1130',
    '1140',
    '1150',
    '1160',
    '1170',
    '1180',
    '1190',
    '1200',
    '1210',
    '1220',
    '1230',
  ],
  graz: ['8010', '8020', '8036', '8042', '8045', '8046', '8051', '8053', '8054', '8055', '8061', '8071', '8074', '8075'],
  linz: ['4020', '4030', '4040', '4050'],
  salzburg: ['5020', '5026', '5023', '5081', '5082', '5083', '5084'],
  innsbruck: ['6020', '6026', '6030', '6060', '6071', '6080'],
  klagenfurt: ['9020', '9061', '9063', '9073'],
  villach: ['9500', '9521', '9580', '9601'],
  wels: ['4600', '4611', '4614'],
  bregenz: ['6900', '6911', '6912'],
  dornbirn: ['6850', '6853', '6858'],
  feldkirch: ['6800', '6804', '6820'],
  eisenstadt: ['7000', '7001'],
  baden: ['2500', '2504', '2514'],
  modling: ['2340', '2345', '2351', '2393'],
  steyr: ['4400', '4407'],
  'wiener neustadt': ['2700', '2702', '2721'],
  'st polten': ['3100', '3107', '3124', '3130', '3140'],
  'bruck an der mur': ['8600', '8605', '8611'],
  'leoben': ['8700', '8713'],
  'schwechat': ['2320', '2325'],
  amstetten: ['3300', '3321', '3361'],
}

export function normalizeLocationValue(value?: string | null) {
  if (!value) {
    return ''
  }
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function resolveCityKey(value?: string | null): string | null {
  const normalized = normalizeLocationValue(value)
  if (!normalized) {
    return null
  }
  return CITY_KEY_SYNONYMS[normalized] ?? normalized
}

export function getCityCoordinates(value?: string | null): Coordinates | null {
  const key = resolveCityKey(value)
  if (!key) {
    return null
  }
  return CITY_COORDINATES[key] ?? null
}

export function getCoordinatesForPostalCode(value?: string | null): Coordinates | null {
  if (!value) {
    return null
  }
  const numeric = parseInt(value, 10)
  if (!Number.isFinite(numeric) || value.length < 4 || value.length > 5) {
    return null
  }
  for (const [cityKey, codes] of Object.entries(CITY_POSTAL_HINTS)) {
    if (codes.includes(value)) {
      return CITY_COORDINATES[cityKey] ?? null
    }
  }
  return null
}

export function resolveCoordinatesFromSearch(value?: string | null) {
  if (!value) {
    return null
  }
  return getCityCoordinates(value) ?? getCoordinatesForPostalCode(value)
}

export function buildLocationTokens(city?: string | null, locationLabel?: string | null) {
  const tokens = new Set<string>()
  const inputs = [city, locationLabel]
  inputs.forEach((input) => {
    if (!input) {
      return
    }
    const normalized = normalizeLocationValue(input)
    if (normalized) {
      tokens.add(normalized)
      normalized.split(' ').forEach((part) => tokens.add(part))
    }
  })

  const cityKey = resolveCityKey(city)
  if (cityKey) {
    tokens.add(cityKey)
    tokens.add(cityKey.replace(/\s+/g, ''))
    const hints = CITY_POSTAL_HINTS[cityKey]
    if (hints) {
      hints.forEach((hint) => tokens.add(hint))
    }
  }

  return Array.from(tokens).filter(Boolean)
}
