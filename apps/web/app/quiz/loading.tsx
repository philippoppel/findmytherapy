import { Home, Search, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function QuizLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Background - Static */}
      <div className="relative">
        <div className="absolute inset-0 h-[340px] sm:h-[380px] bg-gradient-to-b from-primary-900 via-primary-800 to-slate-50" />

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
            <span className="text-sm text-white/70">Lädt...</span>
          </nav>

          {/* Hero Content */}
          <div className="text-center px-4 pt-6 pb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Schnell-Quiz
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
              Finde heraus, was
              <br className="hidden sm:block" />
              <span className="text-primary-200"> zu dir passt</span>
            </h1>
            <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto mb-8">
              6 kurze Fragen – in 2 Minuten zu persönlichen Empfehlungen
            </p>

            {/* Navigation Pills - Static */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-3">
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-black/40 text-white backdrop-blur-md border border-white/20">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Geführte Suche</span>
                <span className="sm:hidden">Geführt</span>
              </div>
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-black/40 text-white backdrop-blur-md border border-white/20">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Selber filtern</span>
                <span className="sm:hidden">Filter</span>
              </div>
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-white text-primary-700 shadow-lg">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Schnell-Quiz</span>
                <span className="sm:hidden">Quiz</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Skeleton */}
      <main className="relative z-10 -mt-6 px-4 pb-12">
        <div className="max-w-2xl lg:max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 md:p-8">
            {/* Card Skeleton */}
            <div className="space-y-6">
              {/* Swipe Hint */}
              <div className="flex items-center justify-center gap-4 text-sm text-slate-300">
                <span>← Nein</span>
                <span>|</span>
                <span>Ja →</span>
              </div>

              {/* Topic Card Skeleton */}
              <div className="rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[3/2] sm:aspect-[4/3] md:aspect-[16/9] bg-slate-200" />
                <div className="p-4 sm:p-6 md:p-8 bg-white">
                  <div className="h-6 w-3/4 mx-auto bg-slate-200 rounded" />
                </div>
              </div>

              {/* Buttons Skeleton */}
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-1 h-14 bg-slate-100 rounded-2xl animate-pulse" />
                <div className="flex-1 h-14 bg-primary-200 rounded-2xl animate-pulse" />
              </div>

              {/* Progress Dots Skeleton */}
              <div className="flex justify-center gap-1 pt-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full bg-slate-200 ${i === 1 ? 'w-4' : 'w-1.5'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
