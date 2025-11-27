import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Background Image */}
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 h-[380px] sm:h-[420px]">
          <Image
            src="/images/search/suche-hero.jpg"
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
          <div className="text-center px-4 pt-8 pb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
              <Search className="w-4 h-4" />
              Direkte Suche
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Alle Therapeut:innen
              <br className="hidden sm:block" />
              <span className="text-primary-200"> durchsuchen</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Filtere nach deinen Kriterien und finde passende
              Therapeut:innen in unserem kuratierten Netzwerk.
            </p>

            {/* Navigation Pills */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <Link
                href="/therapists?matching=true"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all bg-black/40 text-white hover:bg-black/50 backdrop-blur-md border border-white/20"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Geführte Suche</span>
                <span className="sm:hidden">Geführt</span>
              </Link>
              <Link
                href="/therapists"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all bg-white text-primary-700 shadow-lg"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Selber filtern</span>
                <span className="sm:hidden">Filter</span>
              </Link>
              <Link
                href="/quiz"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all bg-black/40 text-white hover:bg-black/50 backdrop-blur-md border border-white/20"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Schnell-Quiz</span>
                <span className="sm:hidden">Quiz</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 -mt-8 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Directory Container */}
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-900">
                  Verifizierte Therapeut:innen
                </h2>
                <p className="text-slate-600 text-sm">
                  Nutze die Filter um passende Therapeut:innen zu finden.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-700">
                <Sparkles className="h-4 w-4" />
                {therapists.length} Profile
              </div>
            </div>
            <TherapistDirectory therapists={therapists} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
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
