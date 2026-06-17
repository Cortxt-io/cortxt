import { useState, useEffect, useCallback } from 'react';
import { fetchDevlog } from '../lib/api';

export default function useDevlog() {
  const [digest, setDigest] = useState('');
  const [generatedAt, setGeneratedAt] = useState('');
  const [status, setStatus] = useState('ok');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const data = await fetchDevlog();
        if (!cancelled) {
          setDigest(data.text ?? '');
          setGeneratedAt(data.generated_at ?? '');
          setStatus(data.status ?? 'ok');
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setDigest('');
          setStatus('not_found');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tick]);

  return { digest, generatedAt, status, loading, error, refresh };
}