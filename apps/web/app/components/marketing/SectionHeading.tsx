'use client';

import type { ReactNode } from 'react';
import { cn } from '@mental-health/ui';

type Alignment = 'left' | 'center';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: Alignment;
  actions?: ReactNode;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  actions,
  className,
}: SectionHeadingProps) {
  const alignmentStyles =
    align === 'center' ? 'mx-auto text-center items-center' : 'text-left items-start';

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-4',
        alignmentStyles,
        align === 'center' ? 'max-w-3xl' : 'max-w-2xl',
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-default sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-pretty text-lg leading-relaxed text-muted">{description}</p>
      ) : null}
      {actions ? (
        <div
          className={cn(
            'flex flex-wrap items-center gap-4',
            align === 'center' ? 'justify-center' : 'justify-start',
          )}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}
