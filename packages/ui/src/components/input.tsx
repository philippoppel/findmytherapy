'use client';

import * as React from 'react';

import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, 'aria-invalid': ariaInvalid, ...props }, ref) => {
    const appliedAriaInvalid = hasError ?? ariaInvalid;

    return (
      <input
        ref={ref}
        className={cn('input', className)}
        aria-invalid={appliedAriaInvalid ?? undefined}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export { Input };
