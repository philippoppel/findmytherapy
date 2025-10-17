import type { PropsWithChildren } from 'react';
import { cn } from '@mental-health/ui';

type PreviewTheme = 'theme-light' | 'theme-dark' | 'theme-simple';

interface ThemePreviewProps extends PropsWithChildren {
  theme: PreviewTheme;
  title: string;
  description?: string;
}

export const ThemePreview = ({ theme, title, description, children }: ThemePreviewProps) => (
  <div className="space-y-4">
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">{title}</p>
      {description ? <p className="text-subtle text-sm">{description}</p> : null}
    </div>
    <div
      className={cn(
        theme,
        'rounded-3xl border border-strong bg-surface-1 p-8 shadow-[0_20px_40px_-30px_rgb(var(--shadow-color))]',
      )}
    >
      <div className="space-y-6">{children}</div>
    </div>
  </div>
);
