import { useState, useEffect, useCallback } from 'react';
import { fetchBrief } from '../lib/api';

const CACHE_KEY = 'cortxt_brief_cache';

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
}

export default function useBrief() {
  const cached = readCache();
  const [brief, setBrief] = useState(cached?.brief ?? null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);
  const [generatedAt, setGeneratedAt] = useState(cached?.generatedAt ?? '');
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    // Only show loading spinner if we have no cached data
    if (!brief) setLoading(true);

    async function load() {
      try {
        const data = await fetchBrief();
        if (!cancelled) {
          const newBrief = data.brief ?? null;
          const newGeneratedAt = data.generated_at ?? '';
          setBrief(newBrief);
          setGeneratedAt(newGeneratedAt);
          setError(null);
          writeCache({ brief: newBrief, generatedAt: newGeneratedAt });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          if (!brief) setBrief(null);
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
