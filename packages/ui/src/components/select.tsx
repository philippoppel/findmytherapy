'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '../lib/utils';

export interface SelectTriggerProps extends SelectPrimitive.SelectTriggerProps {
  hasError?: boolean;
}

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectGroup = SelectPrimitive.Group;
const SelectLabel = SelectPrimitive.Label;
const SelectSeparator = SelectPrimitive.Separator;

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, hasError, 'aria-invalid': ariaInvalid, children, ...props }, ref) => {
    const appliedAriaInvalid = hasError ?? ariaInvalid;

    return (
      <SelectPrimitive.Trigger
        ref={ref}
        aria-invalid={appliedAriaInvalid ?? undefined}
        className={cn(
          'select-trigger inline-flex items-center justify-between gap-2 text-left font-medium',
          className,
        )}
        {...props}
      >
        {children ?? <SelectPrimitive.Value />}
        <SelectPrimitive.Icon asChild>
          <ChevronDown size={18} className="text-subtle" aria-hidden />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    );
  },
);

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectContentProps
>(({ className, position = 'popper', children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn('select-content', className)}
      position={position}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1 text-muted">
        <ChevronUp size={18} aria-hidden />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1 text-muted">
        <ChevronDown size={18} aria-hidden />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectItemProps
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn('select-item rounded-lg outline-none transition-colors', className)}
    {...props}
  >
    <SelectPrimitive.ItemIndicator className="flex h-4 w-4 shrink-0 items-center justify-center text-link">
      <Check size={18} aria-hidden />
    </SelectPrimitive.ItemIndicator>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));

SelectItem.displayName = SelectPrimitive.Item.displayName;

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
};
