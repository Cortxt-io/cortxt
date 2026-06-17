import { useState, useEffect, useCallback } from 'react';
import { fetchEventstream } from '../lib/api';

export default function useEventstream(filters = {}) {
  const [events, setEvents] = useState([]);
  const [source, setSource] = useState('redis');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const data = await fetchEventstream(filters);
        if (!cancelled) {
          setEvents(data.events ?? []);
          setSource(data.source ?? 'redis');
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setEvents([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    // Polling: refresh every 30 seconds
    const intervalId = setInterval(() => setTick((t) => t + 1), 30000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [tick, JSON.stringify(filters)]);

  return { events, source, loading, error, refresh };
}