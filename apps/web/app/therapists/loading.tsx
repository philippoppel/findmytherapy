import { Search } from 'lucide-react';

// Skeleton für Therapeuten-Karten
function TherapistCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex gap-4">
        {/* Avatar Skeleton */}
        <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-white/10" />
        <div className="flex-1 space-y-2">
          {/* Name */}
          <div className="h-5 w-32 rounded bg-white/10" />
          {/* Title */}
          <div className="h-4 w-48 rounded bg-white/10" />
          {/* Tags */}
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-full bg-white/10" />
            <div className="h-6 w-16 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TherapistsLoading() {
  return (
    <div className="marketing-theme bg-surface text-default">
      {/* Header - same as real page */}
      <section className="relative isolate overflow-hidden px-2 py-16 sm:px-3 lg:px-4">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-100/40 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-64 w-64 rounded-full bg-secondary-100/50 blur-3xl" />
        </div>
        <div className="relative mx-auto flex w-full max-w-[1400px] flex-col gap-10">
          <div className="relative overflow-hidden rounded-3xl border border-divider bg-surface-1/95 p-8 shadow-soft-xl sm:p-12">
            <div className="relative space-y-8 text-center md:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-800">
                <Search className="h-4 w-4" />
                Direkte Suche
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
                  Alle Therapeut:innen durchsuchen
                </h1>
                <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted md:mx-0">
                  Filtere nach deinen Kriterien und finde passende Therapeut:innen in unserem
                  kuratierten Netzwerk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skeleton Grid */}
      <section className="relative pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-950 via-primary-950 to-neutral-900 p-8 shadow-soft-xl sm:p-10">
            {/* Header Skeleton */}
            <div className="relative flex flex-wrap items-center justify-between gap-6 pb-8">
              <div className="max-w-2xl space-y-3">
                <h2 className="text-3xl font-semibold text-white">
                  Ausgewählte Pilot-Therapeut:innen
                </h2>
                <p className="text-base text-white/80">
                  Transparente Profile mit Fokus, Verfügbarkeit und Praxisdetails
                </p>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
                <span className="text-sm">Lade Therapeut:innen...</span>
              </div>
            </div>

            {/* Cards Grid Skeleton */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <TherapistCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
