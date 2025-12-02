import { BackLink } from '../components/BackLink';

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-4 sm:gap-8 mb-4 sm:mb-0 sm:float-left">
            <BackLink />
            <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900">Blog</h1>
          </div>
          <div className="relative w-full sm:max-w-sm sm:float-right">
            <div className="h-11 sm:h-10 rounded-lg bg-neutral-100 animate-pulse" />
          </div>
          <div className="clear-both" />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Featured Article Skeleton */}
        <div className="mb-10 sm:mb-16 -mx-4 sm:mx-0">
          <div className="relative aspect-[4/3] sm:aspect-[2.5/1] overflow-hidden sm:rounded-2xl bg-neutral-100 animate-pulse">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skeleton-shimmer" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-12">
              <div className="h-4 w-32 bg-neutral-200/50 rounded mb-3 animate-pulse" />
              <div className="h-8 sm:h-10 w-3/4 bg-neutral-200/50 rounded mb-3 animate-pulse" />
              <div className="h-5 w-1/2 bg-neutral-200/50 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Articles Grid Skeleton */}
        <section className="mb-12 sm:mb-20">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="group">
                <div className="flex sm:block gap-4">
                  <div className="relative aspect-square sm:aspect-[16/10] w-24 sm:w-full flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-neutral-100 sm:mb-4 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skeleton-shimmer" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-3 w-24 bg-neutral-100 rounded animate-pulse" />
                    <div className="h-5 w-full bg-neutral-100 rounded animate-pulse" />
                    <div className="h-5 w-2/3 bg-neutral-100 rounded animate-pulse hidden sm:block" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category Section Skeleton */}
        <section className="mb-12 sm:mb-20">
          <div className="h-7 w-48 bg-neutral-100 rounded mb-6 sm:mb-8 animate-pulse" />
          <div className="flex gap-4 overflow-hidden pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[3/2] sm:aspect-[2.5/1] flex-shrink-0 w-[260px] sm:w-auto bg-neutral-100 animate-pulse"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skeleton-shimmer" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <div className="h-6 w-32 bg-neutral-200/50 rounded mb-2 animate-pulse" />
                  <div className="h-4 w-20 bg-neutral-200/50 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Friendly loading message */}
        <div className="flex items-center justify-center gap-3 py-8 text-neutral-400">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Artikel werden geladen...</span>
        </div>
      </main>

      {/* Shimmer animation styles */}
      <style jsx>{`
        .skeleton-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
