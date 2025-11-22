'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Cookie, ChevronDown, ChevronUp, X } from 'lucide-react'
import { Button } from '@mental-health/ui'
import {
  shouldShowCookieBanner,
  acceptAllCookies,
  rejectAllCookies,
  saveCookieConsent,
  cookieCategoryInfo,
} from '../lib/cookies'

const disableCookieBanner =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DISABLE_COOKIE_BANNER === 'true'

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    errorTracking: false,
  })

  useEffect(() => {
    // Show banner if consent not given (unless explicitly disabled for tests)
    if (!disableCookieBanner) {
      setIsVisible(shouldShowCookieBanner())
    }
  }, [])

  const handleAcceptAll = () => {
    acceptAllCookies()
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    rejectAllCookies()
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    saveCookieConsent(preferences)
    setIsVisible(false)
  }

  const handleClose = () => {
    // Close = same as reject all (GDPR compliant)
    rejectAllCookies()
    setIsVisible(false)
  }

  if (!isVisible || disableCookieBanner) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Escape' && handleClose()}
        role="button"
        tabIndex={0}
        aria-label="Schließen (nur essenziell)"
      />

      {/* Banner */}
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-5xl p-4 sm:p-6" data-testid="cookie-consent-banner">
        <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Cookie-Banner schließen (nur essenziell)"
            data-testid="cookie-banner-close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500">
                <Cookie className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                  Cookies & Datenschutz
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  Wir nutzen Cookies, um Ihnen die bestmögliche Erfahrung zu bieten. Essenziell notwendige Cookies sind für die Grundfunktionen erforderlich.
                  Mit Ihrer Zustimmung können wir zusätzlich Analytics und Fehlererfassung aktivieren, um unseren Service zu verbessern.
                </p>
              </div>
            </div>

            {/* Quick actions */}
            {!showDetails && (
              <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                  size="lg"
                  data-testid="cookie-accept-all"
                >
                  Alle akzeptieren
                </Button>
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                  data-testid="cookie-reject-all"
                >
                  Nur Essenziell
                </Button>
                <Button
                  onClick={() => setShowDetails(!showDetails)}
                  variant="outline"
                  size="lg"
                  className="sm:w-auto"
                >
                  Einstellungen
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Detailed settings */}
            {showDetails && (
              <div className="mb-6 space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
                {/* Essential - always enabled */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">
                        {cookieCategoryInfo.essential.title}
                      </h3>
                      <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
                        Immer aktiv
                      </span>
                    </div>
                  </div>
                  <p className="mb-3 text-sm text-gray-600">
                    {cookieCategoryInfo.essential.description}
                  </p>
                  <div className="space-y-2">
                    {cookieCategoryInfo.essential.cookies.map((cookie) => (
                      <div key={cookie.name} className="text-xs text-gray-500">
                        <span className="font-mono font-medium">{cookie.name}</span> - {cookie.purpose} ({cookie.duration})
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analytics */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {cookieCategoryInfo.analytics.title}
                    </h3>
                    <label className="relative inline-flex cursor-pointer items-center" aria-label="Analytics aktivieren/deaktivieren">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences({ ...preferences, analytics: e.target.checked })
                        }
                        className="peer sr-only"
                        aria-label="Analytics aktivieren/deaktivieren"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300"></div>
                    </label>
                  </div>
                  <p className="mb-3 text-sm text-gray-600">
                    {cookieCategoryInfo.analytics.description}
                  </p>
                  <div className="space-y-2">
                    {cookieCategoryInfo.analytics.cookies.map((cookie) => (
                      <div key={cookie.name} className="text-xs text-gray-500">
                        <span className="font-mono font-medium">{cookie.name}</span> - {cookie.purpose} ({cookie.duration})
                      </div>
                    ))}
                  </div>
                </div>

                {/* Error Tracking */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {cookieCategoryInfo.errorTracking.title}
                    </h3>
                    <label className="relative inline-flex cursor-pointer items-center" aria-label="Fehlererfassung aktivieren/deaktivieren">
                      <input
                        type="checkbox"
                        checked={preferences.errorTracking}
                        onChange={(e) =>
                          setPreferences({ ...preferences, errorTracking: e.target.checked })
                        }
                        className="peer sr-only"
                        aria-label="Fehlererfassung aktivieren/deaktivieren"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300"></div>
                    </label>
                  </div>
                  <p className="mb-3 text-sm text-gray-600">
                    {cookieCategoryInfo.errorTracking.description}
                  </p>
                  <div className="space-y-2">
                    {cookieCategoryInfo.errorTracking.cookies.map((cookie) => (
                      <div key={cookie.name} className="text-xs text-gray-500">
                        <span className="font-mono font-medium">{cookie.name}</span> - {cookie.purpose} ({cookie.duration})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons when details shown */}
            {showDetails && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                  size="lg"
                >
                  Auswahl speichern
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Alle akzeptieren
                </Button>
                <Button
                  onClick={() => setShowDetails(false)}
                  variant="ghost"
                  size="lg"
                  className="sm:w-auto"
                >
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Weniger
                </Button>
              </div>
            )}

            {/* Legal links */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-200 pt-4 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-teal-600 hover:underline">
                Datenschutzerklärung
              </Link>
              <Link href="/cookies" className="hover:text-teal-600 hover:underline">
                Cookie-Richtlinie
              </Link>
              <Link href="/imprint" className="hover:text-teal-600 hover:underline">
                Impressum
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
