import { useState, useEffect, useCallback } from 'react';
import { fetchActivity } from '../lib/api';

export default function useActivity() {
  const [devwatchEvents, setDevwatchEvents] = useState([]);
  const [devwatchDate, setDevwatchDate] = useState('');
  const [devlogHtml, setDevlogHtml] = useState('');
  const [devlogDate, setDevlogDate] = useState('');
  const [hasActivity, setHasActivity] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const data = await fetchActivity();
        if (!cancelled) {
          setDevwatchEvents(data.devwatch_events ?? []);
          setDevwatchDate(data.devwatch_date ?? '');
          setDevlogHtml(data.devlog_html ?? '');
          setDevlogDate(data.devlog_date ?? '');
          setHasActivity(data.has_activity ?? false);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setDevwatchEvents([]);
          setDevlogHtml('');
          setHasActivity(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tick]);

  return { devwatchEvents, devwatchDate, devlogHtml, devlogDate, hasActivity, loading, error, refresh };
}