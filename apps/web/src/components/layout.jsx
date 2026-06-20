import { cn } from '@/lib/utils';

/** Page-width wrapper (matches the brand --maxw of 1100px). */
export function Container({ className, children, ...props }) {
  return (
    <div className={cn('mx-auto w-full max-w-[1100px] px-6', className)} {...props}>
      {children}
    </div>
  );
}

/** Vertical rhythm block; `bordered` adds the hairline top divider used between sections. */
export function Section({ className, bordered = false, children, ...props }) {
  return (
    <section className={cn('py-16', bordered && 'border-t border-border', className)} {...props}>
      {children}
    </section>
  );
}
