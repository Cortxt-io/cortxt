import { useState, useEffect, useCallback } from 'react';
import { fetchQuest } from '../lib/api';

export default function useQuest(questId) {
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!questId) return;
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const data = await fetchQuest(questId);
        if (!cancelled) {
          setQuest(data.quest ?? null);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setQuest(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [questId, tick]);

  return { quest, loading, error, refresh };
}
