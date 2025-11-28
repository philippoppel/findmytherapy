import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'text-sm' | 'heading' | 'avatar' | 'image' | 'button' | 'card';
}

export function Skeleton({ className, variant }: SkeletonProps) {
  const variantClasses = {
    text: 'skeleton-text',
    'text-sm': 'skeleton-text-sm',
    heading: 'skeleton-heading',
    avatar: 'skeleton-avatar',
    image: 'skeleton-image',
    button: 'skeleton-button',
    card: '',
  };

  return (
    <div
      className={cn('skeleton', variant && variantClasses[variant], className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-divider bg-surface-1 p-6', className)}>
      <Skeleton variant="image" className="mb-4" />
      <Skeleton variant="heading" className="mb-3" />
      <Skeleton variant="text" className="mb-2" />
      <Skeleton variant="text-sm" className="mb-4" />
      <div className="flex items-center gap-3">
        <Skeleton variant="avatar" />
        <div className="flex-1">
          <Skeleton variant="text-sm" className="mb-1 w-24" />
          <Skeleton variant="text-sm" className="w-16" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTherapistCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-divider bg-surface-1 overflow-hidden', className)}>
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-5">
        <Skeleton variant="heading" className="mb-2" />
        <Skeleton variant="text-sm" className="mb-4 w-32" />
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-divider">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonBlogCard({ className }: { className?: string }) {
  return (
    <div className={cn('', className)}>
      <Skeleton variant="image" className="mb-4" />
      <Skeleton variant="text-sm" className="mb-2 w-32" />
      <Skeleton variant="heading" className="mb-2" />
      <Skeleton variant="text" />
    </div>
  );
}
