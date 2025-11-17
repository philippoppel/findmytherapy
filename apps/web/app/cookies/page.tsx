'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, RefreshCw, Settings } from 'lucide-react'
import { Button } from '@mental-health/ui'
import { getCookieConsent, saveCookieConsent, cookieCategoryInfo } from '../../lib/cookies'

export default function CookiePolicyPage() {
  const [currentConsent, setCurrentConsent] = useState<{
    essential: boolean
    analytics: boolean
    errorTracking: boolean
  } | null>(null)

  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    errorTracking: false,
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const consent = getCookieConsent()
    if (consent) {
      setCurrentConsent({
        essential: consent.essential,
        analytics: consent.analytics,
        errorTracking: consent.errorTracking,
      })
      setPreferences({
        essential: consent.essential,
        analytics: consent.analytics,
        errorTracking: consent.errorTracking,
      })
    }
  }, [])

  const handleSave = () => {
    saveCookieConsent(preferences)
    setCurrentConsent(preferences)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="marketing-theme bg-surface text-default">
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-10">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-1000">
              <Cookie className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">
                Cookie-Richtlinie
              </h1>
              <p className="text-sm text-muted">
                Letzte Aktualisierung: {new Date().toLocaleDateString('de-AT', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <p className="text-neutral-700 leading-relaxed">
            Diese Seite erklärt, wie FindMyTherapy Cookies und ähnliche Technologien verwendet,
            um Ihnen die bestmögliche Erfahrung zu bieten und unsere Dienste zu verbessern.
          </p>
        </header>

        {/* Quick Navigation */}
        <nav className="rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold text-neutral-950">Schnellnavigation</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#what-are-cookies" className="text-link hover:underline">
                Was sind Cookies?
              </a>
            </li>
            <li>
              <a href="#cookie-categories" className="text-link hover:underline">
                Cookie-Kategorien
              </a>
            </li>
            <li>
              <a href="#manage-cookies" className="text-link hover:underline">
                Cookie-Einstellungen verwalten
              </a>
            </li>
            <li>
              <a href="#third-party" className="text-link hover:underline">
                Drittanbieter-Cookies
              </a>
            </li>
          </ul>
        </nav>

        {/* What are cookies */}
        <section id="what-are-cookies" className="space-y-4 rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-neutral-950">Was sind Cookies?</h2>
          <div className="space-y-3 text-sm leading-relaxed text-neutral-700">
            <p>
              Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie eine Website besuchen.
              Sie helfen Websites, sich an Ihre Präferenzen zu erinnern und Ihre Benutzererfahrung zu verbessern.
            </p>
            <p>
              Wir verwenden Cookies sparsam und transparent. Die meisten unserer Funktionen benötigen keine Cookies,
              und Sie haben volle Kontrolle über optionale Cookies.
            </p>
          </div>
        </section>

        {/* Cookie Categories */}
        <section id="cookie-categories" className="space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-950">Cookie-Kategorien im Detail</h2>

          {/* Essential Cookies */}
          <div className="rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-neutral-950">
                  {cookieCategoryInfo.essential.title}
                </h3>
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                  Immer aktiv
                </span>
              </div>
            </div>
            <p className="mb-4 text-sm text-neutral-700">
              {cookieCategoryInfo.essential.description}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-divider bg-surface-2">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Cookie-Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Zweck</th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Gültigkeit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cookieCategoryInfo.essential.cookies.map((cookie) => (
                    <tr key={cookie.name} className="hover:bg-surface-2/60">
                      <td className="px-4 py-3 font-mono text-xs">{cookie.name}</td>
                      <td className="px-4 py-3 text-neutral-700">{cookie.purpose}</td>
                      <td className="px-4 py-3 text-muted">{cookie.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 rounded-lg bg-surface-2 p-4 text-xs text-muted">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
              Diese Cookies sind technisch notwendig für die Grundfunktionen der Website und benötigen keine Einwilligung.
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-neutral-950">
                  {cookieCategoryInfo.analytics.title}
                </h3>
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                  Optional
                </span>
              </div>
            </div>
            <p className="mb-4 text-sm text-neutral-700">
              {cookieCategoryInfo.analytics.description}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-divider bg-surface-2">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Dienst</th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Zweck</th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cookieCategoryInfo.analytics.cookies.map((cookie) => (
                    <tr key={cookie.name} className="hover:bg-surface-2/60">
                      <td className="px-4 py-3 font-semibold text-neutral-900">{cookie.name}</td>
                      <td className="px-4 py-3 text-neutral-700">{cookie.purpose}</td>
                      <td className="px-4 py-3 text-muted">{cookie.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-2">
              <div className="rounded-lg bg-primary-50 p-4 text-xs text-primary-900">
                <strong>Datenschutz-Hinweis:</strong> Plausible Analytics ist ein datenschutzfreundliches Tool,
                das keine Cookies setzt und keine personenbezogenen Daten speichert. Es erfüllt die DSGVO-Anforderungen
                und benötigt theoretisch keine Einwilligung, wir fragen dennoch aus Transparenzgründen.
              </div>
              <div className="rounded-lg bg-surface-2 p-4 text-xs text-muted">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
                Diese Cookies werden nur mit Ihrer ausdrücklichen Zustimmung aktiviert.
              </div>
            </div>
          </div>

          {/* Error Tracking */}
          <div className="rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-neutral-950">
                  {cookieCategoryInfo.errorTracking.title}
                </h3>
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                  Optional
                </span>
              </div>
            </div>
            <p className="mb-4 text-sm text-neutral-700">
              {cookieCategoryInfo.errorTracking.description}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-divider bg-surface-2">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Dienst</th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Zweck</th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cookieCategoryInfo.errorTracking.cookies.map((cookie) => (
                    <tr key={cookie.name} className="hover:bg-surface-2/60">
                      <td className="px-4 py-3 font-semibold text-neutral-900">{cookie.name}</td>
                      <td className="px-4 py-3 text-neutral-700">{cookie.purpose}</td>
                      <td className="px-4 py-3 text-muted">{cookie.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-2">
              <div className="rounded-lg bg-amber-50 p-4 text-xs text-amber-900">
                <strong>Hinweis:</strong> Sentry erfasst technische Fehlerberichte, die möglicherweise
                IP-Adressen und Browser-Informationen enthalten. Sensible Daten werden automatisch entfernt.
              </div>
              <div className="rounded-lg bg-surface-2 p-4 text-xs text-muted">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
                Diese Cookies werden nur mit Ihrer ausdrücklichen Zustimmung aktiviert.
              </div>
            </div>
          </div>
        </section>

        {/* Manage Cookies */}
        <section id="manage-cookies" className="space-y-4 rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-neutral-950">
              Cookie-Einstellungen verwalten
            </h2>
          </div>

          {currentConsent && (
            <div className="mb-6 rounded-lg bg-primary-50 p-4 text-sm text-primary-900">
              <strong>Ihre aktuellen Einstellungen:</strong>
              <ul className="mt-2 space-y-1">
                <li>✅ Essenziell: Immer aktiv</li>
                <li>{currentConsent.analytics ? '✅' : '❌'} Analytics: {currentConsent.analytics ? 'Aktiviert' : 'Deaktiviert'}</li>
                <li>{currentConsent.errorTracking ? '✅' : '❌'} Fehlererfassung: {currentConsent.errorTracking ? 'Aktiviert' : 'Deaktiviert'}</li>
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-sm text-neutral-700">
              Sie können Ihre Cookie-Einstellungen jederzeit anpassen. Änderungen werden sofort wirksam.
            </p>

            <div className="space-y-3">
              {/* Essential - always on */}
              <div className="flex items-center justify-between rounded-lg border border-divider bg-surface-2 p-4">
                <div>
                  <h4 className="font-semibold text-neutral-900">Essenziell</h4>
                  <p className="text-sm text-muted">Technisch notwendig, immer aktiv</p>
                </div>
                <div className="text-primary-600 font-semibold">Immer an</div>
              </div>

              {/* Analytics toggle */}
              <div className="flex items-center justify-between rounded-lg border border-divider bg-surface-1 p-4">
                <div>
                  <h4 className="font-semibold text-neutral-900">Analytics</h4>
                  <p className="text-sm text-muted">Anonyme Besuchsstatistiken</p>
                </div>
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
                  <div className="peer h-6 w-11 rounded-full bg-surface-2 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300"></div>
                </label>
              </div>

              {/* Error tracking toggle */}
              <div className="flex items-center justify-between rounded-lg border border-divider bg-surface-1 p-4">
                <div>
                  <h4 className="font-semibold text-neutral-900">Fehlererfassung</h4>
                  <p className="text-sm text-muted">Hilft uns, Fehler zu beheben</p>
                </div>
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
                  <div className="peer h-6 w-11 rounded-full bg-surface-2 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300"></div>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {saved ? 'Gespeichert!' : 'Einstellungen speichern'}
              </Button>
            </div>
          </div>
        </section>

        {/* Third Party */}
        <section id="third-party" className="space-y-4 rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-neutral-950">Drittanbieter-Cookies</h2>
          <div className="space-y-3 text-sm leading-relaxed text-neutral-700">
            <p>
              Wir verwenden ausschließlich Dienste, die DSGVO-konform sind oder deren Einsatz wir
              von Ihrer Einwilligung abhängig machen:
            </p>
            <ul className="space-y-2 pl-5">
              <li className="list-disc">
                <strong>Plausible Analytics:</strong> EU-basiert, cookie-frei, anonymisiert
              </li>
              <li className="list-disc">
                <strong>Sentry:</strong> Standard-Vertragsklauseln (SCCs), Datenschutz-Garantien
              </li>
            </ul>
            <p>
              Weitere Informationen finden Sie in unserer{' '}
              <Link href="/privacy" className="text-link hover:underline">
                Datenschutzerklärung
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Browser Controls */}
        <section className="space-y-4 rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-neutral-950">Browser-Einstellungen</h2>
          <div className="space-y-3 text-sm leading-relaxed text-neutral-700">
            <p>
              Sie können Cookies auch direkt in Ihrem Browser verwalten und blockieren:
            </p>
            <ul className="space-y-2 pl-5">
              <li className="list-disc">
                <strong>Chrome:</strong> Einstellungen → Datenschutz und Sicherheit → Cookies
              </li>
              <li className="list-disc">
                <strong>Firefox:</strong> Einstellungen → Datenschutz & Sicherheit
              </li>
              <li className="list-disc">
                <strong>Safari:</strong> Einstellungen → Datenschutz
              </li>
              <li className="list-disc">
                <strong>Edge:</strong> Einstellungen → Cookies und Websiteberechtigungen
              </li>
            </ul>
            <p className="text-amber-700">
              <strong>Hinweis:</strong> Das Blockieren essentieller Cookies kann die Funktionalität
              der Website beeinträchtigen.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-2xl border border-primary-200 bg-primary-50 p-6">
          <h2 className="mb-3 text-xl font-semibold text-primary-950">Fragen zu Cookies?</h2>
          <p className="mb-4 text-sm text-primary-900">
            Bei Fragen zu unserer Cookie-Nutzung kontaktieren Sie uns:
          </p>
          <div className="space-y-2 text-sm text-primary-900">
            <p>
              <strong>E-Mail:</strong>{' '}
              <a href="mailto:privacy@findmytherapy.net" className="underline hover:text-primary-700">
                privacy@findmytherapy.net
              </a>
            </p>
            <p>
              <strong>Weitere Infos:</strong>{' '}
              <Link href="/privacy" className="underline hover:text-primary-700">
                Datenschutzerklärung
              </Link>
              {' | '}
              <Link href="/imprint" className="underline hover:text-primary-700">
                Impressum
              </Link>
            </p>
          </div>
        </section>
      </div>
      </main>
    </div>
  )
}
