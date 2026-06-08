const BASE = import.meta.env.VITE_API_BASE || '';
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

export async function updateProject(slug, fields) {
  const res = await fetch(`${BASE}/api/project/${slug}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function runDevwatch() {
  const res = await fetch(`${BASE}/api/devwatch/run`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function runDevlog() {
  const res = await fetch(`${BASE}/api/devlog/run`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function runUpdate() {
  const res = await fetch(`${BASE}/api/update/run`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ── Quest lifecycle API ──────────────────────────────────────────────────

// No auth — quests are readable
export async function fetchQuests(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.slug) params.set('slug', filters.slug);
  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${BASE}/api/quests${qs}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchQuest(id) {
  const res = await fetch(`${BASE}/api/quests/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createQuest(payload) {
  const res = await fetch(`${BASE}/api/quests`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function activateQuest(id) {
  const res = await fetch(`${BASE}/api/quests/${id}/activate`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function completeQuest(id, summary) {
  const body = summary ? { result_summary: summary } : {};
  const res = await fetch(`${BASE}/api/quests/${id}/complete`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function archiveQuest(id) {
  const res = await fetch(`${BASE}/api/quests/${id}/archive`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function promoteBriefQuest(suggestion) {
  const res = await fetch(`${BASE}/api/quests/from-brief`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      slug: suggestion.target_slug,
      title: suggestion.title,
      description: suggestion.description,
      estimated_impact: suggestion.estimated_impact,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ── Eventstream + Devlog API ────────────────────────────────────────────────

export async function fetchEventstream(filters = {}) {
  const params = new URLSearchParams();
  if (filters.slug) params.set('slug', filters.slug);
  if (filters.source) params.set('source', filters.source);
  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${BASE}/api/eventstream/events${qs}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchDevlog() {
  const res = await fetch(`${BASE}/api/devlog`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function suggestQuest(slug) {
  const res = await fetch(`${BASE}/api/project/${slug}/suggest-quest`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
