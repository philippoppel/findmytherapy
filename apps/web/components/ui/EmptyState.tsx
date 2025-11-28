import { cn } from '@/lib/utils';
import { Search, FileQuestion, Users, Inbox, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type EmptyStateVariant = 'search' | 'no-results' | 'no-data' | 'error' | 'empty';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

const variantIcons: Record<EmptyStateVariant, React.ReactNode> = {
  search: <Search className="h-12 w-12" />,
  'no-results': <FileQuestion className="h-12 w-12" />,
  'no-data': <Inbox className="h-12 w-12" />,
  error: <AlertCircle className="h-12 w-12" />,
  empty: <Users className="h-12 w-12" />,
};

const variantColors: Record<EmptyStateVariant, string> = {
  search: 'text-primary-400 bg-primary-50',
  'no-results': 'text-amber-500 bg-amber-50',
  'no-data': 'text-muted bg-surface-2',
  error: 'text-red-500 bg-red-50',
  empty: 'text-primary-400 bg-primary-50',
};

export function EmptyState({
  variant = 'empty',
  title,
  description,
  icon,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const IconComponent = icon || variantIcons[variant];

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className={cn('mb-6 flex h-20 w-20 items-center justify-center rounded-2xl', variantColors[variant])}>
        {IconComponent}
      </div>

      <h3 className="mb-2 text-xl font-semibold text-default">{title}</h3>

      {description && (
        <p className="mb-6 max-w-md text-muted">{description}</p>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {action && (
            action.href ? (
              <Link
                href={action.href}
                className="btn-interactive inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary-700 focus-ring"
              >
                {action.label}
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className="btn-interactive inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary-700 focus-ring"
              >
                {action.label}
              </button>
            )
          )}

          {secondaryAction && (
            secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className="btn-interactive inline-flex items-center justify-center rounded-full border border-divider bg-surface-1 px-6 py-3 text-sm font-semibold text-default hover:bg-surface-2 focus-ring"
              >
                {secondaryAction.label}
              </Link>
            ) : (
              <button
                onClick={secondaryAction.onClick}
                className="btn-interactive inline-flex items-center justify-center rounded-full border border-divider bg-surface-1 px-6 py-3 text-sm font-semibold text-default hover:bg-surface-2 focus-ring"
              >
                {secondaryAction.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export function NoSearchResults({
  query,
  onClear,
  suggestions,
}: {
  query: string;
  onClear: () => void;
  suggestions?: string[];
}) {
  return (
    <EmptyState
      variant="search"
      title="Keine Ergebnisse gefunden"
      description={`Für "${query}" wurden keine Treffer gefunden. Versuche andere Suchbegriffe.`}
      action={{
        label: 'Suche zurücksetzen',
        onClick: onClear,
      }}
    >
      {suggestions && suggestions.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-sm text-muted">Vorschläge:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="rounded-full bg-surface-2 px-4 py-2 text-sm text-default hover:bg-surface-3 transition-colors focus-ring"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </EmptyState>
  );
}

export function NoTherapistsFound({ onReset }: { onReset: () => void }) {
  return (
    <EmptyState
      variant="no-results"
      title="Keine Therapeut:innen gefunden"
      description="Mit den aktuellen Filtern wurden keine passenden Therapeut:innen gefunden. Versuche, deine Filter anzupassen."
      action={{
        label: 'Filter zurücksetzen',
        onClick: onReset,
      }}
      secondaryAction={{
        label: 'Alle Therapeut:innen',
        href: '/therapists',
      }}
    />
  );
}
