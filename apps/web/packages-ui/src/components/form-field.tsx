'use client';

import * as React from 'react';

import { cn } from '../lib/utils';

export interface FormFieldProps {
  id: string;
  label: React.ReactNode;
  children: React.ReactElement;
  required?: boolean;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  className?: string;
}

const FormField = ({
  id,
  label,
  children,
  helperText,
  errorText,
  required,
  className,
}: FormFieldProps) => {
  const helperId = helperText ? `${id}-help` : undefined;
  const errorId = errorText ? `${id}-error` : undefined;

  const childProps = (children as React.ReactElement).props as Record<string, unknown>;
  const existingDescribedBy = childProps?.['aria-describedby'];

  const describedBy = [
    ...(existingDescribedBy ? String(existingDescribedBy).split(' ') : []),
    helperId,
    errorId,
  ].filter(Boolean);

  const clonedChild = React.isValidElement(children)
    ? React.cloneElement(children, {
        id,
        'aria-describedby': describedBy.length > 0 ? describedBy.join(' ') : undefined,
        'aria-invalid': errorText ? true : childProps?.['aria-invalid'],
        'aria-required': required ?? childProps?.['aria-required'],
        ...(errorText && 'hasError' in childProps ? { hasError: true } : {}),
      } as Record<string, unknown>)
    : children;

  return (
    <div className={cn('form-control', className)}>
      <label htmlFor={id} className={cn(errorText ? 'text-danger' : undefined)}>
        {label}
        {required ? (
          <span aria-hidden className="text-danger">
            *
          </span>
        ) : null}
      </label>
      {clonedChild}
      {helperText && !errorText ? (
        <p id={helperId} className="help-text">
          {helperText}
        </p>
      ) : null}
      {errorText ? (
        <p id={errorId} className="error-text">
          {errorText}
        </p>
      ) : null}
    </div>
  );
};

FormField.displayName = 'FormField';

export { FormField };
