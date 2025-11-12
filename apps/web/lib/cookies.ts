/**
 * Cookie Consent Management
 * GDPR/DSGVO compliant cookie consent utilities
 */

export type CookieCategory = 'essential' | 'analytics' | 'errorTracking'

export interface CookieConsent {
  essential: boolean // always true, can't be disabled
  analytics: boolean
  errorTracking: boolean
  timestamp: number
  version: string // consent version for tracking changes
}

const CONSENT_COOKIE_NAME = 'findmytherapy_cookie_consent'
const CONSENT_VERSION = '1.0'
const COOKIE_EXPIRY_DAYS = 365

/**
 * Get current cookie consent from localStorage
 */
export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(CONSENT_COOKIE_NAME)
    if (!stored) return null

    const consent = JSON.parse(stored) as CookieConsent

    // Check if consent version matches
    if (consent.version !== CONSENT_VERSION) {
      return null // Outdated consent, require new consent
    }

    return consent
  } catch (error) {
    console.error('Error reading cookie consent:', error)
    return null
  }
}

/**
 * Save cookie consent to localStorage and set consent cookie
 */
export function saveCookieConsent(consent: Omit<CookieConsent, 'timestamp' | 'version'>): void {
  if (typeof window === 'undefined') return

  const fullConsent: CookieConsent = {
    ...consent,
    essential: true, // Always true
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  }

  try {
    // Save to localStorage
    localStorage.setItem(CONSENT_COOKIE_NAME, JSON.stringify(fullConsent))

    // Set a cookie to indicate consent was given (for server-side detection)
    const expires = new Date()
    expires.setDate(expires.getDate() + COOKIE_EXPIRY_DAYS)
    document.cookie = `${CONSENT_COOKIE_NAME}=true; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`

    // Trigger custom event for other components to react
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: fullConsent }))
  } catch (error) {
    console.error('Error saving cookie consent:', error)
  }
}

/**
 * Check if user has given consent for a specific category
 */
export function hasConsent(category: CookieCategory): boolean {
  const consent = getCookieConsent()
  if (!consent) return false
  return consent[category] === true
}

/**
 * Accept all cookies
 */
export function acceptAllCookies(): void {
  saveCookieConsent({
    essential: true,
    analytics: true,
    errorTracking: true,
  })
}

/**
 * Reject all non-essential cookies
 */
export function rejectAllCookies(): void {
  saveCookieConsent({
    essential: true,
    analytics: false,
    errorTracking: false,
  })
}

/**
 * Check if user needs to be shown the cookie banner
 */
export function shouldShowCookieBanner(): boolean {
  return getCookieConsent() === null
}

/**
 * Category descriptions for the UI
 */
export const cookieCategoryInfo = {
  essential: {
    title: 'Essenziell',
    description: 'Notwendige Cookies für grundlegende Funktionen wie Login und Sicherheit. Diese können nicht deaktiviert werden.',
    cookies: [
      {
        name: 'next-auth.session-token',
        purpose: 'Authentifizierung und Sitzungsverwaltung',
        duration: '30 Tage',
      },
      {
        name: 'findmytherapy_cookie_consent',
        purpose: 'Speichert Ihre Cookie-Einstellungen',
        duration: '1 Jahr',
      },
    ],
  },
  analytics: {
    title: 'Analytics',
    description: 'Hilft uns zu verstehen, wie Besucher unsere Website nutzen. Wir verwenden Plausible Analytics, ein datenschutzfreundliches Tool ohne Cookies.',
    cookies: [
      {
        name: 'Plausible Analytics',
        purpose: 'Anonyme Besuchsstatistiken (cookie-less)',
        duration: 'Keine Cookies, nur temporäre Session-Daten',
      },
    ],
  },
  errorTracking: {
    title: 'Fehlererfassung',
    description: 'Erfasst technische Fehler, um die Stabilität und Sicherheit der Plattform zu verbessern. Verwendet Sentry.',
    cookies: [
      {
        name: 'Sentry',
        purpose: 'Fehler- und Performance-Monitoring',
        duration: 'Session-basiert',
      },
    ],
  },
} as const
