import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_BASE || '';

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProjects() {
      try {
        const res = await fetch(`${API}/api/nodes`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setProjects(data.nodes ?? []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setProjects([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProjects();
    return () => { cancelled = true; };
  }, []);

  return { projects, loading, error };
}
