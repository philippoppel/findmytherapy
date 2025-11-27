'use client';

import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { Home, Sparkles, Search, BookOpen } from 'lucide-react';
import { useMatchingWizard } from '../components/matching/MatchingWizardContext';
import { MatchingWizard } from '../components/matching/MatchingWizard';
import { MatchingResults } from '../components/matching/MatchingResults';

interface Props {
  children: ReactNode;
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
      <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            {/* Top: Back to home */}
            <div className="flex items-center justify-between mb-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Zurück zur Startseite</span>
              </Link>
            </div>

            {/* Title */}
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-500" />
              <h1 className="text-xl font-bold text-slate-900">Geführte Suche</h1>
            </div>

            {/* Alternative options */}
            <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-slate-100">
              <Link
                href="/therapists"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              >
                <Search className="w-4 h-4" />
                Selber filtern
              </Link>
              <Link
                href="/quiz"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Schnell-Quiz
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content - Only Wizard */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Intro when wizard is closed and no results */}
          {!isOpen && !showResults && (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-primary-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Finde passende Therapeut:innen
              </h2>
              <p className="text-slate-600 max-w-md mx-auto">
                Beantworte ein paar Fragen und wir zeigen dir Therapeut:innen,
                die zu deinen Bedürfnissen passen.
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
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-100 py-8 mt-auto">
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

  // Normal mode: show MatchingSection inline + children
  return (
    <>
      <MatchingWizard />
      <MatchingResults />
      {children}
    </>
  );
}
