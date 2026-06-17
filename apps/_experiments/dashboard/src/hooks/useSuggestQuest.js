import { useState, useCallback } from 'react';
import { suggestQuest } from '../lib/api';

export default function useSuggestQuest(slug) {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuggestion(null);
    try {
      const data = await suggestQuest(slug);
      setSuggestion(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const clear = useCallback(() => {
    setSuggestion(null);
    setError(null);
  }, []);

  return { suggestion, loading, error, generate, clear };
}
