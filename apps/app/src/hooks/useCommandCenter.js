import { useState, useEffect } from 'react';
import { fetchCommandCenter } from '../lib/cns.js';

/**
 * Reads the composed Command Center state from CNS Core via fetchCommandCenter().
 * One read on mount; the composer already weaves health + recommend + sessions +
 * quests server-side, so the hook stays thin. Returns the woven state plus
 * loading/error so the cockpit can degrade gracefully.
 */
export default function useCommandCenter() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchCommandCenter();
        if (!cancelled) {
          setState(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setState(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return { state, loading, error };
}
