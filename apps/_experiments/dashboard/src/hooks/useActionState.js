import { useState, useCallback } from 'react';

/**
 * Shared action button state machine.
 *
 * Usage:
 *   const { set, get } = useActionState();
 *   set('save', 'loading', null);
 *   set('save', 'done', null);
 *   set('save', 'error', err.message);
 *   <ActionButton btnState={get('save')} ... />
 */
export default function useActionState() {
  const [states, setStates] = useState({});

  const set = useCallback((key, state, errMsg) => {
    setStates((prev) => ({ ...prev, [key]: { state, errMsg } }));
  }, []);

  const get = useCallback(
    (key) => states[key] ?? { state: 'idle', errMsg: null },
    [states],
  );

  return { set, get };
}
