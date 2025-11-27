'use client';

import { useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Sparkles, ClipboardCheck } from 'lucide-react';
import { useMatchingWizard } from '../components/matching/MatchingWizardContext';
import { MatchingWizard } from '../components/matching/MatchingWizard';
import { MatchingResults } from '../components/matching/MatchingResults';
import { NavigationPills } from './SearchModeSelector';

interface Props {
  children: ReactNode;
}

export function TherapistsLayoutClient({ children }: Props) {
  const searchParams = useSearchParams();
  const isMatchingMode = searchParams.get('matching') === 'true';
  const { openWizard, closeWizard, isOpen, showResults } = useMatchingWizard();

  // Open wizard when in matching mode, close when leaving
  useEffect(() => {
    if (isMatchingMode) {
      if (!isOpen && !showResults) {
        openWizard();
      }
    } else {
      // Reset wizard state when leaving matching mode
      if (isOpen || showResults) {
        closeWizard();
      }
    }
  }, [isMatchingMode, openWizard, closeWizard, isOpen, showResults]);

  // If matching mode, show dedicated matching UI
  if (isMatchingMode) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Hero Section with Background Image */}
        <div className="relative">
          {/* Background Image */}
          <div className="absolute inset-0 h-[400px] sm:h-[450px]">
            <Image
              src="/images/search/matching-hero.jpg"
              alt="Therapeuten-Matching – finde die passende Unterstützung"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-50" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Top Navigation */}
            <nav className="flex items-center justify-between px-4 sm:px-6 pt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Startseite</span>
              </Link>
              <Link
                href="/triage"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/80 hover:text-white transition-colors"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Wissenschaftlicher Test</span>
              </Link>
            </nav>

            {/* Hero Content */}
            <div className="text-center px-4 pt-8 pb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Geführte Suche
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Schritt für Schritt zur
                <br className="hidden sm:block" />
                <span className="text-primary-200"> passenden Therapie</span>
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
                Wir helfen dir, die richtigen Fragen zu stellen und finden
                Therapeut:innen, die zu deinen Bedürfnissen passen.
              </p>

              {/* Navigation Pills */}
              <NavigationPills active="guided" />
            </div>
          </div>
        </div>

        {/* Main Content - Wizard */}
        <main className="relative z-10 -mt-4 px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Glassmorphism Container */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8">
              {/* Intro when wizard is closed and no results */}
              {!isOpen && !showResults && (
                <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-10 h-10 text-primary-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Bereit? Los geht&apos;s!
                  </h2>
                  <p className="text-slate-600 max-w-md mx-auto">
                    In wenigen Schritten findest du Therapeut:innen,
                    die wirklich zu dir passen.
                  </p>
                  <button
                    onClick={openWizard}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white font-semibold rounded-2xl hover:bg-primary-600 transition-colors shadow-lg"
                  >
                    <Sparkles className="w-5 h-5" />
                    Jetzt starten
                  </button>
                </div>
              )}

              {/* Matching Wizard */}
              <MatchingWizard />

              {/* Results */}
              <MatchingResults />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <Link href="/" className="hover:text-slate-700 transition-colors">
                Startseite
              </Link>
              <Link href="/quiz" className="hover:text-slate-700 transition-colors">
                Schnell-Quiz
              </Link>
              <Link href="/therapists" className="hover:text-slate-700 transition-colors">
                Alle Therapeut:innen
              </Link>
              <Link href="/triage" className="hover:text-slate-700 transition-colors">
                Wissenschaftlicher Test
              </Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Normal mode: just show children (the therapists page handles its own layout)
  return <>{children}</>;
}
