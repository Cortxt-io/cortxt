import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary px-2.5 py-0.5 text-primary-foreground',
        secondary: 'border-transparent bg-secondary px-2.5 py-0.5 text-secondary-foreground',
        // Instrument chip — mono, hairline border, muted (matches the readout voice).
        outline: 'border border-border px-1.5 py-px font-mono text-[0.7rem] tracking-[0.03em] text-muted-foreground rounded',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
