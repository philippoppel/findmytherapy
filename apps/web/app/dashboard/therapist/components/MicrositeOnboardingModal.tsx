'use client';

import { useState, useEffect } from 'react';
import { X, Globe, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const ONBOARDING_STORAGE_KEY = 'microsite-onboarding-completed';

export function MicrositeOnboardingModal() {
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
            aria-label="Schließen"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Globe className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Willkommen bei FindMyTherapy!</h2>
              <p className="text-primary-100 text-sm">
                Ihre professionelle Online-Präsenz ist bereit
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Sie haben jetzt Zugang zu Ihrer eigenen Microsite
            </h3>
            <p className="text-gray-600 mb-4">
              Als verifizierter Therapeut erhalten Sie automatisch eine professionelle Website –
              ohne Kosten, ohne technisches Know-how. Ihre Microsite hilft Ihnen, online gefunden zu
              werden und neue Klient:innen zu gewinnen.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-primary-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-primary-600 mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Professionelle Website</h4>
              <p className="text-sm text-gray-600">Automatisch generiert aus Ihrem Profil</p>
            </div>
            <div className="p-4 bg-primary-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-primary-700 mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Kontaktformular</h4>
              <p className="text-sm text-gray-600">
                Potenzielle Klient:innen können Sie direkt erreichen
              </p>
            </div>
            <div className="p-4 bg-primary-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-primary-600 mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Suchmaschinen-Optimierung</h4>
              <p className="text-sm text-gray-600">Werden Sie automatisch in Google gefunden</p>
            </div>
          </div>

          {/* Steps */}
          <div className="bg-gray-50 rounded-lg p-5 mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">In 3 einfachen Schritten starten:</h4>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-sm font-medium">
                  1
                </span>
                <div>
                  <span className="font-medium text-gray-900">Profil vervollständigen</span>
                  <p className="text-sm text-gray-600">
                    Fügen Sie mindestens 3 Spezialisierungen, eine Headline und Ihre Erfahrung hinzu
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-sm font-medium">
                  2
                </span>
                <div>
                  <span className="font-medium text-gray-900">Microsite veröffentlichen</span>
                  <p className="text-sm text-gray-600">
                    Ein Klick genügt – Ihre Website geht sofort online
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full text-sm font-medium">
                  3
                </span>
                <div>
                  <span className="font-medium text-gray-900">Link teilen und gefunden werden</span>
                  <p className="text-sm text-gray-600">
                    Teilen Sie Ihre persönliche URL und empfangen Sie Kontaktanfragen
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
              Zur Microsite
              <ExternalLink className="h-4 w-4" />
            </Link>
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              Später
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
            Nicht mehr anzeigen
          </label>
        </div>
      </div>
    </div>
  );
}
