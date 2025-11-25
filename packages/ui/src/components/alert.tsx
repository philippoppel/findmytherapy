'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, CheckCircle2, AlertCircle, Info } from 'lucide-react';

import { cn } from '../lib/utils';

const alertVariants = cva('alert', {
  variants: {
    variant: {
      info: 'alert-info',
      success: 'alert-success',
      warning: 'alert-warning',
      danger: 'alert-danger',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

const iconForVariant = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
} as const;

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

const roleForVariant: Record<AlertVariant, 'status' | 'alert'> = {
  info: 'status',
  success: 'status',
  warning: 'alert',
  danger: 'alert',
};

export interface AlertProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'>,
    VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, description, icon, children, role, ...props }, ref) => {
    const alertVariant = variant ?? 'info';
    const roleAttribute = role ?? roleForVariant[alertVariant];
    const Icon = icon ? null : iconForVariant[alertVariant];

    return (
      <div
        ref={ref}
        role={roleAttribute}
        aria-live={roleAttribute === 'status' ? 'polite' : 'assertive'}
        className={cn(alertVariants({ variant: alertVariant }), className)}
        {...props}
      >
        <div className="alert-icon" aria-hidden>
          {icon ?? (Icon ? <Icon size={20} /> : null)}
        </div>
        <div className="alert-content">
          {title ? <div className="alert-title">{title}</div> : null}
          {description ? <div className="alert-description">{description}</div> : null}
          {children}
        </div>
      </div>
    );
  },
);

Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<'h3'>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn('alert-title', className)} {...props}>
      {children}
    </h3>
  ),
);

AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<'p'>
>(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn('alert-description', className)} {...props}>
    {children}
  </p>
));

AlertDescription.displayName = 'AlertDescription';

export { Alert, alertVariants, AlertTitle, AlertDescription };
