import { useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_BASE || '';

export default function usePending() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function fetchPending() {
      try {
        const res = await fetch(`${API}/api/pending`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setPending(data.pending ?? []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setPending([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPending();
    return () => { cancelled = true; };
  }, [tick]);

  return { pending, loading, error, refresh };
}
