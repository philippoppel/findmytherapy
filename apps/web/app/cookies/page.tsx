'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@mental-health/ui';
import { getCookieConsent, saveCookieConsent, cookieCategoryInfo } from '../../lib/cookies';
import { BackLink } from '../components/BackLink';
import { useTranslation } from '@/lib/i18n';

export default function CookiePolicyPage() {
  const { t, language } = useTranslation();

  const [currentConsent, setCurrentConsent] = useState<{
    essential: boolean;
    analytics: boolean;
    errorTracking: boolean;
  } | null>(null);

  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    errorTracking: false,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (consent) {
      setCurrentConsent({
        essential: consent.essential,
        analytics: consent.analytics,
        errorTracking: consent.errorTracking,
      });
      setPreferences({
        essential: consent.essential,
        analytics: consent.analytics,
        errorTracking: consent.errorTracking,
      });
    }
  }, []);

  const handleSave = () => {
    saveCookieConsent(preferences);
    setCurrentConsent(preferences);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const formatDate = () => {
    return new Date().toLocaleDateString(language === 'de' ? 'de-AT' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="marketing-theme bg-surface text-default">
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {/* Back Link */}
          <BackLink />

          {/* Header */}
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-1000">
                <Cookie className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">
                  {t('legalPages.cookiePolicy')}
                </h1>
                <p className="text-sm text-muted">
                  {t('legalPages.lastUpdate')} {formatDate()}
                </p>
              </div>
            </div>
            <p className="text-neutral-700 leading-relaxed">
              {t('legalPages.whatAreCookiesText1')}
            </p>
          </header>

          {/* Quick Navigation */}
          <nav className="rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft">
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">{t('legalPages.quickNavigation')}</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#what-are-cookies" className="text-link hover:underline">
                  {t('legalPages.whatAreCookies')}
                </a>
              </li>
              <li>
                <a href="#cookie-categories" className="text-link hover:underline">
                  {t('legalPages.cookieCategories')}
                </a>
              </li>
              <li>
                <a href="#manage-cookies" className="text-link hover:underline">
                  {t('legalPages.manageCookies')}
                </a>
              </li>
              <li>
                <a href="#third-party" className="text-link hover:underline">
                  {t('legalPages.thirdPartyCookies')}
                </a>
              </li>
            </ul>
          </nav>

          {/* What are cookies */}
          <section
            id="what-are-cookies"
            className="space-y-4 rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft"
          >
            <h2 className="text-2xl font-semibold text-neutral-950">{t('legalPages.whatAreCookies')}</h2>
            <div className="space-y-3 text-sm leading-relaxed text-neutral-700">
              <p>{t('legalPages.whatAreCookiesText1')}</p>
              <p>{t('legalPages.whatAreCookiesText2')}</p>
            </div>
          </section>

          {/* Cookie Categories */}
          <section id="cookie-categories" className="space-y-6">
            <h2 className="text-2xl font-semibold text-neutral-950">{t('legalPages.cookieCategories')}</h2>

            {/* Essential Cookies */}
            <div className="rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-neutral-950">
                    {t('legalPages.essential')}
                  </h3>
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                    {t('legalPages.alwaysActive')}
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
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">
                        {t('legalPages.cookieName')}
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">{t('legalPages.purpose')}</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">
                        {t('legalPages.duration')}
                      </th>
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
                <strong>{t('legalPages.legalBasis')}</strong> Art. 6 Abs. 1 lit. f DSGVO
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-neutral-950">
                    {t('legalPages.analytics')}
                  </h3>
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                    {t('legalPages.optional')}
                  </span>
                </div>
              </div>
              <p className="mb-4 text-sm text-neutral-700">
                {t('legalPages.analyticsDesc')}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-divider bg-surface-2">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">{t('legalPages.service')}</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">{t('legalPages.purpose')}</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">
                        {t('legalPages.details')}
                      </th>
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
                  <strong>{t('legalPages.privacyNote')}</strong> Plausible Analytics - GDPR compliant
                </div>
                <div className="rounded-lg bg-surface-2 p-4 text-xs text-muted">
                  <strong>{t('legalPages.legalBasis')}</strong> Art. 6 Abs. 1 lit. a DSGVO
                </div>
              </div>
            </div>

            {/* Error Tracking */}
            <div className="rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-neutral-950">
                    {t('legalPages.errorTracking')}
                  </h3>
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                    {t('legalPages.optional')}
                  </span>
                </div>
              </div>
              <p className="mb-4 text-sm text-neutral-700">
                {t('legalPages.errorTrackingDesc')}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-divider bg-surface-2">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">{t('legalPages.service')}</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">{t('legalPages.purpose')}</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">
                        {t('legalPages.details')}
                      </th>
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
                  <strong>{t('legalPages.note')}</strong> Sentry - error tracking
                </div>
                <div className="rounded-lg bg-surface-2 p-4 text-xs text-muted">
                  <strong>{t('legalPages.legalBasis')}</strong> Art. 6 Abs. 1 lit. a DSGVO
                </div>
              </div>
            </div>
          </section>

          {/* Manage Cookies */}
          <section
            id="manage-cookies"
            className="space-y-4 rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-semibold text-neutral-950">
                {t('legalPages.manageCookies')}
              </h2>
            </div>

            {currentConsent && (
              <div className="mb-6 rounded-lg bg-primary-50 p-4 text-sm text-primary-900">
                <strong>{t('legalPages.yourCurrentSettings')}</strong>
                <ul className="mt-2 space-y-1">
                  <li>✅ {t('legalPages.essential')}: {t('legalPages.alwaysActive')}</li>
                  <li>
                    {currentConsent.analytics ? '✅' : '❌'} {t('legalPages.analytics')}:{' '}
                    {currentConsent.analytics ? t('legalPages.activated') : t('legalPages.deactivated')}
                  </li>
                  <li>
                    {currentConsent.errorTracking ? '✅' : '❌'} {t('legalPages.errorTracking')}:{' '}
                    {currentConsent.errorTracking ? t('legalPages.activated') : t('legalPages.deactivated')}
                  </li>
                </ul>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-sm text-neutral-700">
                {t('legalPages.manageCookiesText')}
              </p>

              <div className="space-y-3">
                {/* Essential - always on */}
                <div className="flex items-center justify-between rounded-lg border border-divider bg-surface-2 p-4">
                  <div>
                    <h4 className="font-semibold text-neutral-900">{t('legalPages.essential')}</h4>
                    <p className="text-sm text-muted">{t('legalPages.essentialDesc')}</p>
                  </div>
                  <div className="text-primary-600 font-semibold">{t('legalPages.alwaysOn')}</div>
                </div>

                {/* Analytics toggle */}
                <div className="flex items-center justify-between rounded-lg border border-divider bg-surface-1 p-4">
                  <div>
                    <h4 className="font-semibold text-neutral-900">{t('legalPages.analytics')}</h4>
                    <p className="text-sm text-muted">{t('legalPages.analyticsDesc')}</p>
                  </div>
                  <label
                    className="relative inline-flex cursor-pointer items-center"
                    aria-label={t('legalPages.analytics')}
                  >
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences({ ...preferences, analytics: e.target.checked })
                      }
                      className="peer sr-only"
                      aria-label={t('legalPages.analytics')}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-surface-2 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300"></div>
                  </label>
                </div>

                {/* Error tracking toggle */}
                <div className="flex items-center justify-between rounded-lg border border-divider bg-surface-1 p-4">
                  <div>
                    <h4 className="font-semibold text-neutral-900">{t('legalPages.errorTracking')}</h4>
                    <p className="text-sm text-muted">{t('legalPages.errorTrackingDesc')}</p>
                  </div>
                  <label
                    className="relative inline-flex cursor-pointer items-center"
                    aria-label={t('legalPages.errorTracking')}
                  >
                    <input
                      type="checkbox"
                      checked={preferences.errorTracking}
                      onChange={(e) =>
                        setPreferences({ ...preferences, errorTracking: e.target.checked })
                      }
                      className="peer sr-only"
                      aria-label={t('legalPages.errorTracking')}
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
                  {saved ? t('legalPages.settingsSaved') : t('legalPages.saveSettings')}
                </Button>
              </div>
            </div>
          </section>

          {/* Third Party */}
          <section
            id="third-party"
            className="space-y-4 rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft"
          >
            <h2 className="text-2xl font-semibold text-neutral-950">{t('legalPages.thirdPartyCookies')}</h2>
            <div className="space-y-3 text-sm leading-relaxed text-neutral-700">
              <p>
                {t('legalPages.thirdPartyCookiesText')}
              </p>
              <ul className="space-y-2 pl-5">
                <li className="list-disc">
                  <strong>Plausible Analytics:</strong> EU-based, cookie-free, anonymized
                </li>
                <li className="list-disc">
                  <strong>Sentry:</strong> Standard Contractual Clauses (SCCs)
                </li>
              </ul>
              <p>
                {t('legalPages.moreInfoText')}{' '}
                <Link href="/privacy" className="text-link hover:underline">
                  {t('legalPages.privacyPolicy')}
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Browser Controls */}
          <section className="space-y-4 rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-neutral-950">{t('legalPages.browserSettings')}</h2>
            <div className="space-y-3 text-sm leading-relaxed text-neutral-700">
              <p>{t('legalPages.browserSettingsText')}</p>
              <ul className="space-y-2 pl-5">
                <li className="list-disc">
                  <strong>Chrome:</strong> Settings → Privacy and Security → Cookies
                </li>
                <li className="list-disc">
                  <strong>Firefox:</strong> Settings → Privacy & Security
                </li>
                <li className="list-disc">
                  <strong>Safari:</strong> Settings → Privacy
                </li>
                <li className="list-disc">
                  <strong>Edge:</strong> Settings → Cookies and site permissions
                </li>
              </ul>
              <p className="text-amber-700">
                <strong>{t('legalPages.note')}</strong> {t('legalPages.browserWarning')}
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-2xl border border-primary-200 bg-primary-50 p-6">
            <h2 className="mb-3 text-xl font-semibold text-primary-950">{t('legalPages.cookieQuestions')}</h2>
            <p className="mb-4 text-sm text-primary-900">
              {t('legalPages.cookieQuestionsText')}
            </p>
            <div className="space-y-2 text-sm text-primary-900">
              <p>
                <strong>{t('legalPages.email')}</strong>{' '}
                <a
                  href="mailto:privacy@findmytherapy.net"
                  className="underline hover:text-primary-700"
                >
                  privacy@findmytherapy.net
                </a>
              </p>
              <p>
                <strong>{t('legalPages.moreInfo')}:</strong>{' '}
                <Link href="/privacy" className="underline hover:text-primary-700">
                  {t('legalPages.privacyPolicy')}
                </Link>
                {' | '}
                <Link href="/imprint" className="underline hover:text-primary-700">
                  {t('legalPages.imprint')}
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
