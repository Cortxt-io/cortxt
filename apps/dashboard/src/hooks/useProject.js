import { useState, useEffect } from 'react';

const API = 'https://project-cns-production.up.railway.app';

export default function useProject(slug) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    async function fetchProject() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API}/api/project/${slug}/full`);
        if (res.status === 404) {
          if (!cancelled) setError('not_found');
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setProject({
            meta: data.meta,
            sections: data.sections,
            project_files: data.project_files,
            pending: data.pending,
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProject();
    return () => { cancelled = true; };
  }, [slug]);

  return { project, loading, error };
}
