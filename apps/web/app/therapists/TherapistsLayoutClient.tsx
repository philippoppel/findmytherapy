'use client';

import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Sparkles, Search, BookOpen, ClipboardCheck } from 'lucide-react';
import { useMatchingWizard } from '../components/matching/MatchingWizardContext';
import { MatchingWizard } from '../components/matching/MatchingWizard';
import { MatchingResults } from '../components/matching/MatchingResults';

interface Props {
  children: ReactNode;
}

// Navigation Pills Component
function NavigationPills({ active }: { active: 'guided' | 'filter' | 'quiz' }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      <Link
        href="/therapists?matching=true"
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          active === 'guided'
            ? 'bg-white text-primary-700 shadow-lg'
            : 'bg-black/40 text-white hover:bg-black/50 backdrop-blur-md border border-white/20'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        <span className="hidden sm:inline">Geführte Suche</span>
        <span className="sm:hidden">Geführt</span>
      </Link>
      <Link
        href="/therapists"
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          active === 'filter'
            ? 'bg-white text-primary-700 shadow-lg'
            : 'bg-black/40 text-white hover:bg-black/50 backdrop-blur-md border border-white/20'
        }`}
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Selber filtern</span>
        <span className="sm:hidden">Filter</span>
      </Link>
      <Link
        href="/quiz"
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          active === 'quiz'
            ? 'bg-white text-primary-700 shadow-lg'
            : 'bg-black/40 text-white hover:bg-black/50 backdrop-blur-md border border-white/20'
        }`}
      >
        <BookOpen className="w-4 h-4" />
        <span className="hidden sm:inline">Schnell-Quiz</span>
        <span className="sm:hidden">Quiz</span>
      </Link>
    </div>
  );
}

export function TherapistsLayoutClient({ children }: Props) {
  const [isMatchingMode, setIsMatchingMode] = useState(false);
  const { openWizard, isOpen, showResults } = useMatchingWizard();

  // Check URL for ?matching=true
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('matching') === 'true') {
      setIsMatchingMode(true);
      if (!isOpen && !showResults) {
        openWizard();
      }
    }
  }, [openWizard, isOpen, showResults]);

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
              alt=""
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
        <main className="relative z-10 -mt-16 px-4 pb-12">
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
                    Bereit? Los geht's!
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
  return (
    <>
      <MatchingWizard />
      <MatchingResults />
      {children}
    </>
  );
}
