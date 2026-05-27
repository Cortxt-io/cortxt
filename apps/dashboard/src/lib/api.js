const BASE = 'https://project-cns-production.up.railway.app';
const TOKEN = import.meta.env.VITE_API_TOKEN ?? '';

function authHeaders() {
  return TOKEN
    ? {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    : { 'Content-Type': 'application/json', Accept: 'application/json' };
}

export async function fetchAnalyzeList() {
  const res = await fetch(`${BASE}/api/analyze`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function analyzeProject(slug) {
  const res = await fetch(`${BASE}/api/analyze/${slug}`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function analyzeAll() {
  const res = await fetch(`${BASE}/api/analyze/all`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function approveProject(slug) {
  const res = await fetch(`${BASE}/api/review/${slug}/approve`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function rejectProject(slug) {
  const res = await fetch(`${BASE}/api/review/${slug}/reject`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
