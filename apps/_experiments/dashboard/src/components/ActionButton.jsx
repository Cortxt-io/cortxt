/**
 * Shared action button with loading/done/error states.
 *
 * Props:
 *   label        — default label text
 *   loadingLabel — label while loading (default: 'Laddar…')
 *   doneLabel    — label on success (default: '✓ Klar')
 *   errorLabel   — label on error (default: 'Fel')
 *   onClick      — click handler
 *   btnState     — { state: 'idle'|'loading'|'done'|'error', errMsg: string|null }
 *   variant      — 'accent' | 'success' | 'danger' | 'secondary'
 *   disabled     — optional, extra disable on top of loading state
 */
export default function ActionButton({
  label,
  loadingLabel = 'Laddar…',
  doneLabel = '✓ Klar',
  errorLabel = 'Fel',
  onClick,
  btnState,
  variant = 'accent',
  disabled = false,
}) {
  const { state, errMsg } = btnState;

  const baseStyle = {
    padding: '4px 12px',
    borderRadius: 4,
    fontSize: 13,
    fontFamily: 'var(--font-mono, monospace)',
    cursor: state === 'loading' || disabled ? 'not-allowed' : 'pointer',
    transition: 'opacity 0.15s',
    opacity: state === 'loading' || disabled ? 0.6 : 1,
    border: '1px solid',
  };

  const variantStyles = {
    accent: {
      background: 'transparent',
      borderColor: 'var(--accent)',
      color: 'var(--accent)',
    },
    success: {
      background: 'transparent',
      borderColor: '#34d399',
      color: '#34d399',
    },
    danger: {
      background: 'transparent',
      borderColor: '#fb7185',
      color: '#fb7185',
    },
    secondary: {
      background: 'transparent',
      borderColor: 'var(--muted)',
      color: 'var(--muted)',
    },
    done: {
      background: 'transparent',
      borderColor: '#34d399',
      color: '#34d399',
    },
    error: {
      background: 'transparent',
      borderColor: '#fb7185',
      color: '#fb7185',
    },
  };

  const displayVariant = state === 'done' ? 'done' : state === 'error' ? 'error' : variant;
  const displayLabel =
    state === 'loading'
      ? loadingLabel
      : state === 'done'
      ? doneLabel
      : state === 'error'
      ? errorLabel
      : label;

  return (
    <div>
      <button
        onClick={onClick}
        disabled={state === 'loading' || disabled}
        style={{ ...baseStyle, ...variantStyles[displayVariant] }}
      >
        {displayLabel}
      </button>
      {state === 'error' && errMsg && (
        <div style={{ color: '#fb7185', fontSize: 11, marginTop: 3 }}>{errMsg}</div>
      )}
    </div>
  );
}
