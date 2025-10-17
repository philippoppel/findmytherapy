'use client';

import * as React from 'react';

import { cn } from '../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, 'aria-invalid': ariaInvalid, rows = 4, ...props }, ref) => {
    const appliedAriaInvalid = hasError ?? ariaInvalid;

    return (
      <textarea
        ref={ref}
        className={cn('textarea', className)}
        rows={rows}
        aria-invalid={appliedAriaInvalid ?? undefined}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
