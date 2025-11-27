'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, Sparkles, Search } from 'lucide-react';
import { useMatchingWizard } from '../components/matching/MatchingWizardContext';
import { MatchingWizard } from '../components/matching/MatchingWizard';
import { MatchingResults } from '../components/matching/MatchingResults';

export default function MatchPage() {
  const { openWizard, isOpen, showResults } = useMatchingWizard();

  // Auto-open wizard on mount
  useEffect(() => {
    if (!isOpen && !showResults) {
      openWizard();
    }
  }, [openWizard, isOpen, showResults]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm">Startseite</span>
          </Link>

          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <span className="font-medium text-slate-900">Geführte Suche</span>
          </div>

          <Link
            href="/therapists"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors text-sm"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Selber filtern</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Intro when wizard is closed and no results */}
        {!isOpen && !showResults && (
          <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-10 h-10 text-primary-500" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              Geführte Therapeut:innen-Suche
            </h1>
            <p className="text-slate-600 max-w-md mx-auto">
              In wenigen Schritten findest du passende Therapeut:innen,
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

      {/* Footer Links */}
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
