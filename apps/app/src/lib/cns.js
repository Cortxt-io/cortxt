/* CNS Core client — the single seam between app.cortxt.io and the CNS backend.
 *
 * UI components MUST call these functions, never fetch() directly. That keeps the
 * backend swappable (proxy vs direct, schema changes) behind one file.
 *
 * Connectivity: VITE_CNS_API_BASE is empty by default → same-origin, relying on the
 * /api/* rewrite in vercel.json that proxies to the Railway backend. Set it to the
 * Railway URL for local dev (no Vercel proxy locally).
 *
 * Backend endpoints used (all read-only, public):
 *   GET /api/nodes               → { version, nodes[], agents[], edges[] }
 *   GET /api/node/<slug>/full    → { status, slug, meta, sections, node_files, pending }
 *   GET /api/issues?node=&state= → { issues[] }
 *   GET /api/command-center      → { missions, sitrep, logistics, orders, command, freshness }
 */

const API_BASE = import.meta.env.VITE_CNS_API_BASE ?? ''; // '' = same-origin proxy

/* Venture domains — fallback for classifying products when the backend has not yet
 * shipped the derived is_product field. Backend is the source of truth (domain != cortxt). */
export const VENTURE_DOMAINS = ['bkfinans', 'crusade', 'juvahem', 'orgkomp'];

async function getJSON(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`CNS ${path} failed: ${res.status}`);
  return res.json();
}

/* Normalize a raw nodes.json entry into the camelCase shape the UI renders.
 * is_product comes from the backend when present; otherwise derived from domain. */
function normalizeModel(n) {
  return {
    slug: n.slug,
    title: n.title || n.slug,
    summary: n.summary || '',
    type: n.type || '',
    domain: n.domain || '',
    health: n.health && n.health.level ? n.health : { level: 'unknown', checks: [] },
    realityStatus: n.reality_status || '',
    isProduct: n.is_product ?? (Boolean(n.domain) && n.domain !== 'cortxt'),
    urlLive: n.url_live || '',
    urlRepo: n.url_repo || '',
  };
}

/* List models from CNS Core.
 *   { productsOnly: true }       → only venture/product nodes (is_product)
 *   { domains: ['juvahem',...] } → only these domains
 * No options → the full portfolio. */
export async function fetchModels({ productsOnly = false, domains = null } = {}) {
  const data = await getJSON('/api/nodes');
  let models = (data.nodes ?? []).map(normalizeModel);
  if (productsOnly) models = models.filter((m) => m.isProduct);
  if (domains) models = models.filter((m) => domains.includes(m.domain));
  return models;
}

/* Full decision brief for one model: meta + prose sections + subdir files. */
export async function fetchDecisionModel(slug) {
  return getJSON(`/api/node/${encodeURIComponent(slug)}/full`);
}

/* Open work items (GitHub issues) tied to a model's node. */
export async function fetchModelIssues(slug) {
  const data = await getJSON(`/api/issues?node=${encodeURIComponent(slug)}&state=open`);
  return data.issues ?? [];
}

/* Composed Command Center state — the woven portfolio view CNS builds in one read
 * (missions/sitrep/orders/logistics/command/freshness). Wraps GET /api/command-center,
 * which exposes command_center_state() in Project-CNS. Rendered by the Cockpit page. */
export async function fetchCommandCenter() {
  return getJSON('/api/command-center');
}

/* Per-vertical roadmap detail (recipe phases + status/epics + open decisions) for the
 * per-project view. Wraps GET /api/vertical/<slug>. */
export async function fetchVertical(slug) {
  return getJSON(`/api/vertical/${encodeURIComponent(slug)}`);
}
