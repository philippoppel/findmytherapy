'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@mental-health/ui';
import {
  shouldShowCookieBanner,
  acceptAllCookies,
  rejectAllCookies,
  saveCookieConsent,
  useCookieCategoryInfo,
} from '../lib/cookies';
import { useTranslation } from '@/lib/i18n';

const disableCookieBanner =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DISABLE_COOKIE_BANNER === 'true';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    errorTracking: false,
  });
  const { t } = useTranslation();
  const cookieCategoryInfo = useCookieCategoryInfo();

  useEffect(() => {
    // Show banner if consent not given (unless explicitly disabled for tests)
    if (!disableCookieBanner) {
      setIsVisible(shouldShowCookieBanner());
    }
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    rejectAllCookies();
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    saveCookieConsent(preferences);
    setIsVisible(false);
  };

  const handleClose = () => {
    // Close = same as reject all (GDPR compliant)
    rejectAllCookies();
    setIsVisible(false);
  };

  if (!isVisible || disableCookieBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Escape' && handleClose()}
        role="button"
        tabIndex={0}
        aria-label={t('cookies.closeEssentialOnly')}
      />

      {/* Banner */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-5xl p-4 sm:p-6"
        data-testid="cookie-consent-banner"
      >
        <div className="relative rounded-2xl border border-divider bg-surface-1 shadow-2xl">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-lg p-1 text-muted transition hover:bg-surface-2 hover:text-default"
            aria-label={t('cookies.closeBanner')}
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
                <h2 className="mb-2 text-xl font-semibold text-default">{t('cookies.title')}</h2>
                <p className="text-sm leading-relaxed text-muted">
                  {t('cookies.description')}
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
                  {t('cookies.acceptAll')}
                </Button>
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                  data-testid="cookie-reject-all"
                >
                  {t('cookies.essentialOnly')}
                </Button>
                <Button
                  onClick={() => setShowDetails(!showDetails)}
                  variant="outline"
                  size="lg"
                  className="sm:w-auto"
                >
                  {t('cookies.settings')}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Detailed settings */}
            {showDetails && (
              <div className="mb-6 space-y-4 rounded-xl border border-divider bg-surface-2 p-6">
                {/* Essential - always enabled */}
                <div className="rounded-lg border border-divider bg-surface-1 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-default">
                        {cookieCategoryInfo.essential.title}
                      </h3>
                      <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
                        {t('cookies.alwaysActive')}
                      </span>
                    </div>
                  </div>
                  <p className="mb-3 text-sm text-muted">
                    {cookieCategoryInfo.essential.description}
                  </p>
                  <div className="space-y-2">
                    {cookieCategoryInfo.essential.cookies.map((cookie) => (
                      <div key={cookie.name} className="text-xs text-subtle">
                        <span className="font-mono font-medium">{cookie.name}</span> -{' '}
                        {cookie.purpose} ({cookie.duration})
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analytics */}
                <div className="rounded-lg border border-divider bg-surface-1 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold text-default">
                      {cookieCategoryInfo.analytics.title}
                    </h3>
                    <label
                      className="relative inline-flex cursor-pointer items-center"
                      aria-label={t('cookies.toggleAnalytics')}
                    >
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences({ ...preferences, analytics: e.target.checked })
                        }
                        className="peer sr-only"
                        aria-label={t('cookies.toggleAnalytics')}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-surface-3 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-divider after:bg-surface-1 after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300"></div>
                    </label>
                  </div>
                  <p className="mb-3 text-sm text-muted">
                    {cookieCategoryInfo.analytics.description}
                  </p>
                  <div className="space-y-2">
                    {cookieCategoryInfo.analytics.cookies.map((cookie) => (
                      <div key={cookie.name} className="text-xs text-subtle">
                        <span className="font-mono font-medium">{cookie.name}</span> -{' '}
                        {cookie.purpose} ({cookie.duration})
                      </div>
                    ))}
                  </div>
                </div>

                {/* Error Tracking */}
                <div className="rounded-lg border border-divider bg-surface-1 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold text-default">
                      {cookieCategoryInfo.errorTracking.title}
                    </h3>
                    <label
                      className="relative inline-flex cursor-pointer items-center"
                      aria-label={t('cookies.toggleErrorTracking')}
                    >
                      <input
                        type="checkbox"
                        checked={preferences.errorTracking}
                        onChange={(e) =>
                          setPreferences({ ...preferences, errorTracking: e.target.checked })
                        }
                        className="peer sr-only"
                        aria-label={t('cookies.toggleErrorTracking')}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-surface-3 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-divider after:bg-surface-1 after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300"></div>
                    </label>
                  </div>
                  <p className="mb-3 text-sm text-muted">
                    {cookieCategoryInfo.errorTracking.description}
                  </p>
                  <div className="space-y-2">
                    {cookieCategoryInfo.errorTracking.cookies.map((cookie) => (
                      <div key={cookie.name} className="text-xs text-subtle">
                        <span className="font-mono font-medium">{cookie.name}</span> -{' '}
                        {cookie.purpose} ({cookie.duration})
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
                  {t('cookies.saveSelection')}
                </Button>
                <Button onClick={handleAcceptAll} variant="outline" className="flex-1" size="lg">
                  {t('cookies.acceptAll')}
                </Button>
                <Button
                  onClick={() => setShowDetails(false)}
                  variant="ghost"
                  size="lg"
                  className="sm:w-auto"
                >
                  <ChevronUp className="mr-2 h-4 w-4" />
                  {t('cookies.less')}
                </Button>
              </div>
            )}

            {/* Legal links */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-divider pt-4 text-xs text-subtle">
              <Link href="/privacy" className="hover:text-teal-600 hover:underline">
                {t('cookies.privacyPolicy')}
              </Link>
              <Link href="/cookies" className="hover:text-teal-600 hover:underline">
                {t('cookies.cookiePolicy')}
              </Link>
              <Link href="/imprint" className="hover:text-teal-600 hover:underline">
                {t('cookies.imprint')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
