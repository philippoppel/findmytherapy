import { Home, Search, Sparkles, BookOpen, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';

export default function TherapistsLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Background - Static */}
      <div className="relative">
        <div className="absolute inset-0 h-[380px] sm:h-[420px] bg-gradient-to-b from-primary-900 via-primary-800 to-slate-50" />

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
              aria-label="Wissenschaftlicher Test"
            >
              <ClipboardCheck className="w-4 h-4" aria-hidden />
              <span className="hidden sm:inline" aria-hidden>Wissenschaftlicher Test</span>
            </Link>
          </nav>

          {/* Hero Content */}
          <div className="text-center px-4 pt-8 pb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
              <Search className="w-4 h-4" />
              Direkte Suche
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Alle Therapeut:innen
              <br className="hidden sm:block" />
              <span className="text-primary-200"> durchsuchen</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
              Filtere nach deinen Kriterien und finde passende
              Therapeut:innen in unserem kuratierten Netzwerk.
            </p>

            {/* Navigation Pills - Static */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-3">
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-black/40 text-white backdrop-blur-md border border-white/20">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Geführte Suche</span>
                <span className="sm:hidden">Geführt</span>
              </div>
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-white text-primary-700 shadow-lg">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Selber filtern</span>
                <span className="sm:hidden">Filter</span>
              </div>
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-black/40 text-white backdrop-blur-md border border-white/20">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Schnell-Quiz</span>
                <span className="sm:hidden">Quiz</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Skeleton */}
      <main className="relative z-10 -mt-8 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
            {/* Header Skeleton */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
              <div className="space-y-2">
                <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-64 bg-slate-100 rounded animate-pulse" />
              </div>
              <div className="h-8 w-24 bg-primary-100 rounded-full animate-pulse" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
              {/* Sidebar Skeleton */}
              <div className="space-y-4">
                <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
              </div>

              {/* Cards Skeleton */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-4 animate-pulse">
                    <div className="flex gap-4 mb-3">
                      <div className="w-16 h-16 bg-slate-200 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-slate-200 rounded w-3/4" />
                        <div className="h-4 bg-slate-100 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-100 rounded" />
                      <div className="h-3 bg-slate-100 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
