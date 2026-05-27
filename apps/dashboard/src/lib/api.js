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

export async function fetchBrief() {
  const res = await fetch(`${BASE}/api/brief`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// No auth — /api/activity is public
export async function fetchActivity() {
  const res = await fetch(`${BASE}/api/activity`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function pushQuestToPlanning(slug, quest) {
  const res = await fetch(`${BASE}/api/planning/quest`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ slug, quest }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
