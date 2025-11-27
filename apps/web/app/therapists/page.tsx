import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, Sparkles, Search, BookOpen, ClipboardCheck } from 'lucide-react';

import { TherapistDirectory } from './TherapistDirectorySimplified';
import { getTherapistCards } from './getTherapistCards';

// Force dynamic rendering to prevent database access during build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Therapeut:innen finden in Österreich – FindMyTherapy',
  description:
    'Finde zertifizierte Psychotherapeut:innen in Österreich mit klarer Spezialisierung, verfügbaren Terminen und transparenten Therapieschwerpunkten. Verifizierte Profile, Online und Vor-Ort-Termine.',
  keywords: [
    'Therapeut finden Österreich',
    'Psychotherapeut Wien',
    'Online Therapie Österreich',
    'Psychotherapie Termine',
    'Therapeutensuche',
    'Kassenplatz Therapie',
    'verifizierte Therapeuten',
  ],
  openGraph: {
    title: 'Therapeut:innen finden in Österreich – Verifizierte Profile',
    description:
      'Entdecke zertifizierte Psychotherapeut:innen mit verfügbaren Terminen. Online und vor Ort in Wien, Graz, Linz und ganz Österreich.',
    type: 'website',
    url: 'https://findmytherapy.net/therapists',
    locale: 'de_AT',
    siteName: 'FindMyTherapy',
  },
  alternates: {
    canonical: 'https://findmytherapy.net/therapists',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Therapeut:innen finden in Österreich',
    description:
      'Zertifizierte Psychotherapeut:innen mit verfügbaren Terminen. Transparent, verifiziert, DSGVO-konform.',
  },
};

export default async function TherapistsPage() {
  const { therapists } = await getTherapistCards();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
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
            <Search className="w-6 h-6 text-primary-500" />
            <h1 className="text-xl font-bold text-slate-900">Selber filtern</h1>
          </div>

          {/* Alternative options */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-3 pt-3 border-t border-slate-100">
            <Link
              href="/therapists?matching=true"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Geführte Suche</span>
              <span className="sm:hidden">Geführt</span>
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Schnell-Quiz</span>
              <span className="sm:hidden">Quiz</span>
            </Link>
            <Link
              href="/triage"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Wissenschaftlicher Test</span>
              <span className="sm:hidden">Test</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <section id="therapist-list" className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
              <div className="relative flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="max-w-2xl space-y-2">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Alle Therapeut:innen
                  </h2>
                  <p className="text-base text-slate-600">
                    Nutze die Filter um passende Therapeut:innen zu finden.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-700">
                  <Sparkles className="h-4 w-4" />
                  {therapists.length} Profile
                </div>
              </div>
              <div className="relative pt-6">
                <TherapistDirectory therapists={therapists} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-700 transition-colors">
              Startseite
            </Link>
            <Link href="/quiz" className="hover:text-slate-700 transition-colors">
              Schnell-Quiz
            </Link>
            <Link href="/therapists?matching=true" className="hover:text-slate-700 transition-colors">
              Geführte Suche
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
