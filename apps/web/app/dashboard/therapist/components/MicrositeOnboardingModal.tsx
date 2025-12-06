'use client';

import { useState, useEffect } from 'react';
import { X, Globe, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

const ONBOARDING_STORAGE_KEY = 'microsite-onboarding-completed';

export function MicrositeOnboardingModal() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Check if user has already seen the onboarding
    const hasSeenOnboarding = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!hasSeenOnboarding) {
      // Show modal after a short delay for better UX
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    }
    setIsOpen(false);
  };

  const handleGetStarted = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-1000 p-6 text-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition"
            aria-label={t('micrositeOnboarding.close')}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Globe className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t('micrositeOnboarding.welcomeTitle')}</h2>
              <p className="text-primary-100 text-sm">
                {t('micrositeOnboarding.welcomeSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('micrositeOnboarding.accessToMicrosite')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('micrositeOnboarding.micrositeDescription')}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-primary-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-primary-600 mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">{t('micrositeOnboarding.benefits.professionalWebsite')}</h4>
              <p className="text-sm text-gray-600">{t('micrositeOnboarding.benefits.professionalWebsiteDesc')}</p>
            </div>
            <div className="p-4 bg-primary-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-primary-700 mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">{t('micrositeOnboarding.benefits.contactForm')}</h4>
              <p className="text-sm text-gray-600">
                {t('micrositeOnboarding.benefits.contactFormDesc')}
              </p>
            </div>
            <div className="p-4 bg-primary-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-primary-600 mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">{t('micrositeOnboarding.benefits.seoOptimization')}</h4>
              <p className="text-sm text-gray-600">{t('micrositeOnboarding.benefits.seoOptimizationDesc')}</p>
            </div>
          </div>

          {/* Steps */}
          <div className="bg-gray-50 rounded-lg p-5 mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">{t('micrositeOnboarding.stepsTitle')}</h4>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-sm font-medium">
                  1
                </span>
                <div>
                  <span className="font-medium text-gray-900">{t('micrositeOnboarding.step1Title')}</span>
                  <p className="text-sm text-gray-600">
                    {t('micrositeOnboarding.step1Desc')}
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-sm font-medium">
                  2
                </span>
                <div>
                  <span className="font-medium text-gray-900">{t('micrositeOnboarding.step2Title')}</span>
                  <p className="text-sm text-gray-600">
                    {t('micrositeOnboarding.step2Desc')}
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-sm font-medium">
                  3
                </span>
                <div>
                  <span className="font-medium text-gray-900">{t('micrositeOnboarding.step3Title')}</span>
                  <p className="text-sm text-gray-600">
                    {t('micrositeOnboarding.step3Desc')}
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard/therapist/microsite"
              onClick={handleGetStarted}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-1000 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transition shadow-lg shadow-primary-500/30"
            >
              {t('micrositeOnboarding.goToMicrosite')}
              <ExternalLink className="h-4 w-4" />
            </Link>
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              {t('micrositeOnboarding.later')}
            </button>
          </div>

          {/* Don't show again checkbox */}
          <label className="flex items-center gap-2 mt-4 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            {t('micrositeOnboarding.dontShowAgain')}
          </label>
        </div>
      </div>
    </div>
  );
}
