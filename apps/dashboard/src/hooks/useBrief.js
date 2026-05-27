import { useState, useEffect, useCallback } from 'react';
import { fetchBrief } from '../lib/api';

export default function useBrief() {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatedAt, setGeneratedAt] = useState('');
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const data = await fetchBrief();
        if (!cancelled) {
          setBrief(data.brief ?? null);
          setGeneratedAt(data.generated_at ?? '');
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setBrief(null);
          setGeneratedAt('');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tick]);

  return { brief, loading, error, refresh, generatedAt };
}