// â”€â”€ Status labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { STATUSES, KINDS, NODE_STAGES } from '@cortxt/cns-schema';

// Canonical node-model enum values live in @cortxt/cns-schema (single source,
// mirrors Project-CNS/scripts/validator.py). Re-exported so existing imports
// from './data/labels' keep working; the label/colour maps below are presentation.
export { STATUSES, KINDS, NODE_STAGES };

export const STATUS_LABELS = {
  idea: 'Idea',
  early_mvp: 'Early MVP',
  mvp: 'MVP',
  live: 'Live',
  shelved: 'Shelved',
};
export const getStatusLabel = (s) => STATUS_LABELS[s] ?? s;

// â”€â”€ Status colors (Tailwind classes for dark theme) â”€â”€â”€â”€â”€â”€â”€
export const STATUS_COLORS = {
  idea:        { bg: 'bg-slate-800',      text: 'text-slate-300',    border: 'border-slate-600' },
  early_mvp:   { bg: 'bg-amber-900/40',   text: 'text-amber-300',   border: 'border-amber-600' },
  mvp:         { bg: 'bg-emerald-900/40',  text: 'text-emerald-300', border: 'border-emerald-600' },
  live:        { bg: 'bg-emerald-900/60',  text: 'text-emerald-200', border: 'border-emerald-400' },
  shelved:     { bg: 'bg-rose-900/40',     text: 'text-rose-300',    border: 'border-rose-600' },
};
export const getStatusColor = (s) =>
  STATUS_COLORS[s] ?? { bg: 'bg-gray-800', text: 'text-gray-400', border: 'border-gray-600' };

// â”€â”€ Status colors (hex for inline styles / SVG) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const STATUS_HEX_COLORS = {
  idea: '#94a3b8',
  early_mvp: '#fbbf24',
  mvp: '#34d399',
  live: '#6ee7b7',
  shelved: '#fb7185',
};
export const getStatusHexColor = (s) => STATUS_HEX_COLORS[s] ?? '#64748b';

// â”€â”€ MVP stage labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const STAGE_LABELS = {
  hypothesis: 'Hypothesis',
  problem_interviews: 'Problem Interviews',
  solution_test: 'Solution Test',
  demand_test: 'Demand Test',
  launch: 'Launch',
};
export const getStageLabel = (s) => STAGE_LABELS[s] ?? s;

// â”€â”€ Family labels (dual-mapping: current + future values) â”€
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

// â”€â”€ Family colors (old and new map to same accent) â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ Layer labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const LAYER_LABELS = {
  pipeline: 'Pipeline',
  infrastructure: 'Infrastructure',
  interface: 'Interface',
  concept: 'Concept',
};
export const getLayerLabel = (l) => LAYER_LABELS[l] ?? l;

// â”€â”€ Pipeline labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const PIPELINE_LABELS = {
  'pipeline-intern': 'Intern Pipeline',
  'pipeline-extern': 'Extern Pipeline',
  'pipeline-review': 'Review Pipeline',
};
export const getPipelineLabel = (p) => PIPELINE_LABELS[p] ?? p;

// â”€â”€ Layer colors (hex for inline styles) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const LAYER_COLORS = {
  pipeline: '#6366f1',
  infrastructure: '#f59e0b',
  interface: '#06b6d4',
  concept: '#64748b',
};
export const getLayerColor = (l) => LAYER_COLORS[l] ?? '#64748b';

// ── Node-model: Kind labels ──────────────────────────────────
export const KIND_LABELS = {
  framework: 'Framework',
  system: 'System',
  component: 'Component',
};
export const getKindLabel = (k) => KIND_LABELS[k] ?? k;

// ── Node-model: Kind colors (Tailwind classes) ──────────────
export const KIND_COLORS = {
  framework: { bg: 'bg-fuchsia-900/40', text: 'text-fuchsia-300', border: 'border-fuchsia-600' },
  system:     { bg: 'bg-cyan-900/40',    text: 'text-cyan-300',    border: 'border-cyan-600' },
  component:  { bg: 'bg-emerald-900/40', text: 'text-emerald-300', border: 'border-emerald-600' },
};
export const getKindColor = (k) =>
  KIND_COLORS[k] ?? { bg: 'bg-gray-800', text: 'text-gray-400', border: 'border-gray-600' };

// ── Node-model: Kind colors (hex for inline styles) ───────
export const KIND_HEX_COLORS = {
  framework: '#d946ef',
  system: '#22d3ee',
  component: '#34d399',
};
export const getKindHexColor = (k) => KIND_HEX_COLORS[k] ?? '#64748b';

// ── Node-model: Stage labels ────────────────────────────────
export const NODE_STAGE_LABELS = {
  idea: 'Idea',
  building: 'Building',
  working: 'Working',
  maturing: 'Maturing',
};
export const getNodeStageLabel = (s) => NODE_STAGE_LABELS[s] ?? s;

// ── Node-model: Stage colors (hex for inline styles) ──────
export const NODE_STAGE_COLORS = {
  idea: '#94a3b8',
  building: '#fbbf24',
  working: '#34d399',
  maturing: '#6ee7b7',
};
export const getNodeStageColor = (s) => NODE_STAGE_COLORS[s] ?? '#64748b';

// ── Eventstream: event-type colors (hex) ────────────────────
export const EVENT_COLORS = {
  stage_change:  '#10b981',  // green — most important
  deploy:        '#06b6d4',  // cyan
  pull_request:  '#a855f7',  // purple
  push:          '#6366f1',  // blue (accent)
  md_change:     '#64748b',  // gray
  workflow_run:  '#475569',  // dimmed slate
};
export const getEventColor = (what) => EVENT_COLORS[what] ?? '#64748b';
