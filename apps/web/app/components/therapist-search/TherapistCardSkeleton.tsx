export function TherapistCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-sm">
      {/* Image Skeleton */}
      <div className="relative h-48 w-full animate-pulse bg-neutral-200" />

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Name and Specialty Skeleton */}
        <div>
          <div className="h-6 w-3/4 animate-pulse rounded-lg bg-neutral-200" />
          <div className="mt-1.5 h-4 w-1/2 animate-pulse rounded-lg bg-neutral-200" />
        </div>

        {/* Details Skeleton */}
        <div className="space-y-2.5">
          <div className="flex items-start gap-2.5">
            <div className="h-4 w-4 animate-pulse rounded bg-neutral-200" />
            <div className="h-4 flex-1 animate-pulse rounded-lg bg-neutral-200" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-4 w-4 animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-2/3 animate-pulse rounded-lg bg-neutral-200" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-4 w-4 animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-1/2 animate-pulse rounded-lg bg-neutral-200" />
          </div>
        </div>

        {/* Price and Languages Skeleton */}
        <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-4">
          <div className="h-4 w-20 animate-pulse rounded-lg bg-neutral-200" />
          <div className="h-3 w-24 animate-pulse rounded-lg bg-neutral-200" />
        </div>

        {/* CTA Skeleton */}
        <div className="mt-2 h-12 animate-pulse rounded-xl bg-neutral-200" />
      </div>
    </div>
  );
}
