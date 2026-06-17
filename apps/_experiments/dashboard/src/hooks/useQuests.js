import { useState, useEffect, useCallback } from 'react';
import { fetchQuests } from '../lib/api';

export default function useQuests(filters = {}) {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const data = await fetchQuests(filters);
        if (!cancelled) {
          setQuests(data.quests ?? []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setQuests([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tick, JSON.stringify(filters)]);

  return { quests, loading, error, refresh };
}
