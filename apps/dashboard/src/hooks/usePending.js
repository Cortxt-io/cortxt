import { useState, useEffect } from 'react';

const API = 'https://project-cns-production.up.railway.app';

export default function usePending() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

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
  }, []);

  return { pending, loading, error };
}
