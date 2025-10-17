'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '../lib/utils';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : 'a';

    return <Component ref={ref} className={cn('link', className)} {...props} />;
  },
);

Link.displayName = 'Link';

export { Link };
