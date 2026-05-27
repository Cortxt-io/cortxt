// ── Status labels ──────────────────────────────────────────
export const STATUS_LABELS = {
  idea: 'Idea',
  early_mvp: 'Early MVP',
  mvp: 'MVP',
  live: 'Live',
  shelved: 'Shelved',
};
export const getStatusLabel = (s) => STATUS_LABELS[s] ?? s;

// ── Status colors (Tailwind classes for dark theme) ───────
export const STATUS_COLORS = {
  idea:        { bg: 'bg-slate-800',      text: 'text-slate-300',    border: 'border-slate-600' },
  early_mvp:   { bg: 'bg-amber-900/40',   text: 'text-amber-300',   border: 'border-amber-600' },
  mvp:         { bg: 'bg-emerald-900/40',  text: 'text-emerald-300', border: 'border-emerald-600' },
  live:        { bg: 'bg-emerald-900/60',  text: 'text-emerald-200', border: 'border-emerald-400' },
  shelved:     { bg: 'bg-rose-900/40',     text: 'text-rose-300',    border: 'border-rose-600' },
};
export const getStatusColor = (s) =>
  STATUS_COLORS[s] ?? { bg: 'bg-gray-800', text: 'text-gray-400', border: 'border-gray-600' };

// ── Status colors (hex for inline styles / SVG) ──────────
export const STATUS_HEX_COLORS = {
  idea: '#94a3b8',
  early_mvp: '#fbbf24',
  mvp: '#34d399',
  live: '#6ee7b7',
  shelved: '#fb7185',
};
export const getStatusHexColor = (s) => STATUS_HEX_COLORS[s] ?? '#64748b';

// ── MVP stage labels ──────────────────────────────────────
export const STAGE_LABELS = {
  hypothesis: 'Hypothesis',
  problem_interviews: 'Problem Interviews',
  solution_test: 'Solution Test',
  demand_test: 'Demand Test',
  launch: 'Launch',
};
export const getStageLabel = (s) => STAGE_LABELS[s] ?? s;

// ── Family labels (dual-mapping: current + future values) ─
export const FAMILY_LABELS = {
  'developer-tools': 'Developer Tools',
  'digest-pipeline': 'Digest Pipeline',
  'internal-monitoring': 'Internal Monitoring',
  'monitoring-pipeline': 'Monitoring Pipeline',
  'cns-core': 'CNS Core',
  'cns-platform': 'CNS Platform',
  'ideas': 'Ideas',
};
export const getFamilyLabel = (f) => FAMILY_LABELS[f] ?? f;

// ── Family colors (old and new map to same accent) ────────
export const FAMILY_COLORS = {
  'developer-tools': '#6366f1',
  'digest-pipeline': '#8b5cf6',
  'internal-monitoring': '#06b6d4',
  'monitoring-pipeline': '#8b5cf6',
  'cns-core': '#f59e0b',
  'cns-platform': '#f59e0b',
  'ideas': '#64748b',
};
export const getFamilyColor = (f) => FAMILY_COLORS[f] ?? '#64748b';
