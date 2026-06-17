/* CNS Core client (stub).
 *
 * On app.cortxt.io this is how the workspace will talk to the CNS Core backend:
 * fetch a node's decision brief (the same data `cns export <slug>` produces in
 * Project-CNS). Today it returns dummy data; swap the body for a real fetch when
 * the backend exposes e.g. GET /api/export?slug=<slug> (or /api/node/<slug>/export).
 *
 * Keep this the single seam — UI components call fetchDecisionModel(), never fetch directly.
 */

const API_BASE = import.meta.env.VITE_CNS_API_BASE ?? ''; // '' = same-origin proxy, set per env

export async function fetchDecisionModel(slug) {
  // TODO(cns): replace stub with:
  //   const res = await fetch(`${API_BASE}/api/export?slug=${encodeURIComponent(slug)}&format=json`);
  //   if (!res.ok) throw new Error(`CNS export failed: ${res.status}`);
  //   return res.json();
  void API_BASE;
  return {
    slug,
    fields: {
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      summary: 'Dummy decision model — replace with live CNS Core export.',
      type: 'tool',
      domain: 'cortxt',
    },
    decision: '_No live data yet. This is a stub from apps/app/src/lib/cns.js._',
  };
}
