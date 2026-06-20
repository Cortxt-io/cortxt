import { cn } from '@/lib/utils';

/**
 * "Unlit instrument" — the cockpit's placeholder for a feature that is planned
 * but not yet wired. Dimmed panel, mono instrument label, an unlit gauge, and a
 * status line. It never fakes data, and the status colour is always paired with a
 * text label (a11y — the same rule as the health-colour language). Shared signature
 * with apps/web; here it signposts cockpit tools that are on the way.
 */
export function PlannedFeature({ label, note = 'planerad', hint, action, className, ...props }) {
  return (
    <div
      className={cn(
        'select-none rounded-lg border border-border bg-card p-5 opacity-70 transition-opacity hover:opacity-100',
        className,
      )}
      {...props}
    >
      <div className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>

      <div
        aria-hidden="true"
        className="mt-3 h-2 rounded-sm"
        style={{
          opacity: 0.5,
          backgroundImage:
            'repeating-linear-gradient(90deg, var(--health-unknown) 0 8px, transparent 8px 15px)',
        }}
      />

      {hint && <p className="mt-3 text-sm text-muted-foreground">{hint}</p>}

      <div className="mt-3 flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wide text-muted-foreground">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'var(--health-unknown)' }} />
        <span>· {note}</span>
        {action && (
          <a href={action.href} className="ml-auto normal-case tracking-normal text-primary hover:underline">
            {action.label}
          </a>
        )}
      </div>
    </div>
  );
}
