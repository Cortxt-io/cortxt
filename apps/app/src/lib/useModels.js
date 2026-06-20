/* React hooks wrapping the cns.js seam with loading/empty/error state, so pages
 * stay declarative and never call fetch directly. Mirrors the cancelled-flag pattern
 * from apps/_experiments/dashboard/src/hooks/useProjects.js. */
import { useState, useEffect } from 'react';
import { fetchModels, fetchDecisionModel, fetchModelIssues } from './cns.js';

export function useModels(opts = {}) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Serialize opts so the effect re-runs on a real filter change, not every render.
  const key = JSON.stringify(opts);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchModels(JSON.parse(key))
      .then((m) => { if (!cancelled) { setModels(m); setError(null); } })
      .catch((e) => { if (!cancelled) { setError(e.message); setModels([]); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [key]);

  return { models, loading, error };
}

export function useDecisionModel(slug) {
  const [model, setModel] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchDecisionModel(slug), fetchModelIssues(slug).catch(() => [])])
      .then(([m, iss]) => { if (!cancelled) { setModel(m); setIssues(iss); setError(null); } })
      .catch((e) => { if (!cancelled) { setError(e.message); setModel(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  return { model, issues, loading, error };
}
