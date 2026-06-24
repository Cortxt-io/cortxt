import { useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ELK from 'elkjs/lib/elk.bundled.js';

/* @cortxt/graph — NodeGraph
 *
 * Lean, fetch-free ELK-laid-out node graph. Feed it CNS-shaped nodes
 * ({slug, title, kind, part_of, feeds[], depends_on[], health}) and it lays them
 * out (ELK layered, RIGHT) and renders feeds/depends_on/part_of edges with
 * kind-coloured nodes + a health dot.
 *
 * Selection-aware (the command-center signature): pass `selected` (slug) + `highlight`
 * (slugs to keep lit) + `onNodeClick`. The selected node gets an accent ring; everything
 * outside {selected ∪ highlight} dims. Layout (ELK) only re-runs when nodes change; the
 * selection styling is cheap (no re-layout). */

const elk = new ELK();

const ELK_OPTIONS = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.layered.spacing.nodeNodeBetweenLayers': '90',
  'elk.spacing.nodeNode': '40',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
  'elk.edgeRouting': 'ORTHOGONAL',
};

const NODE_W = 190;
const NODE_H = 56;

const KIND_COLOR = { framework: '#a78bfa', system: '#4ec9b0', component: '#60a5fa' };
const HEALTH_COLOR = {
  healthy: '#4ec9b0', attention: '#fbbf24', degraded: '#fb7185', unknown: '#64748b',
};
const ACCENT = '#4ec9b0';
const FEEDS = '#4ec9b0';
const DEPENDS = '#fbbf24';

/* A node should read as WHAT IT IS. `type` (technical/routing) drives a glyph so a
 * pipeline looks like a pipeline, a frontend like a frontend; `archetype` (reusable
 * functional role, e.g. etl/decision-engine) shows as a second tag when present. */
const TYPE_GLYPH = {
  frontend: '▤', service: '⚙', 'mcp-server': '⊡', pipeline: '⇶', cli: '›_',
  tool: '⛭', agent: '◈', infra: '☰', library: '▦', dataset: '⊞', 'ai-model': '✦',
};
const ARCHETYPE_GLYPH = {
  etl: '⇶', 'decision-engine': '⚖', input: '⌨', result: '▤',
};

const HANDLE_STYLE = { opacity: 0, width: 1, height: 1, border: 'none', minWidth: 0, minHeight: 0 };

function CnsNode({ data }) {
  const kindColor = KIND_COLOR[data.kind] || '#64748b';
  const healthColor = HEALTH_COLOR[data.health] || HEALTH_COLOR.unknown;
  // A parent (has hidden/visible components) shows an expand affordance; otherwise the
  // glyph reads the node's role: archetype (etl/decision-engine…) leads, else type.
  const glyph = data.isParent
    ? (data.expanded ? '⊖' : '⊕')
    : (ARCHETYPE_GLYPH[data.archetype] || TYPE_GLYPH[data.type] || '◻');
  const childHint = data.isParent && !data.expanded ? ` · ${data.childCount} delar` : '';
  const typeLine = ([data.archetype, data.type].filter(Boolean).join(' · ') || data.kind) + childHint;
  return (
    <div style={{
      width: NODE_W, height: NODE_H, boxSizing: 'border-box',
      borderRadius: 8, background: 'var(--surface, #1b1e24)',
      border: `1px solid ${data.selected ? ACCENT : 'var(--border, #2a2e37)'}`,
      borderLeft: `4px solid ${kindColor}`,
      boxShadow: data.selected ? `0 0 0 2px ${ACCENT}55` : 'none',
      padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      color: 'var(--text, #e8eaed)', fontSize: 13, overflow: 'hidden',
      opacity: data.dimmed ? 0.3 : 1,
      transition: 'opacity 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
      cursor: 'pointer',
    }}>
      <Handle type="target" position={Position.Left} style={HANDLE_STYLE} isConnectable={false} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
        <span title={data.isParent ? (data.expanded ? 'Fäll ihop' : 'Expandera komponenter') : (data.type || data.kind)} style={{
          flex: '0 0 auto', width: 18, textAlign: 'center',
          fontFamily: 'var(--font-mono, monospace)',
          color: data.isParent || data.selected ? ACCENT : 'var(--muted, #94a3b8)',
        }}>{glyph}</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.label}</span>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: healthColor, flex: '0 0 auto', marginLeft: 'auto' }} />
      </div>
      {typeLine && <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2, marginLeft: 24, fontFamily: 'var(--font-mono, monospace)' }}>{typeLine}</div>}
      <Handle type="source" position={Position.Right} style={HANDLE_STYLE} isConnectable={false} />
    </div>
  );
}

const nodeTypes = { cns: CnsNode };

function buildEdges(nodes) {
  const slugs = new Set(nodes.map((n) => n.slug));
  const edges = [];
  for (const n of nodes) {
    for (const t of n.feeds || []) {
      if (slugs.has(t)) edges.push({
        id: `feed-${n.slug}-${t}`, source: n.slug, target: t, type: 'smoothstep',
        style: { stroke: FEEDS, strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: FEEDS, width: 12, height: 12 },
      });
    }
    for (const d of n.depends_on || []) {
      if (slugs.has(d)) edges.push({
        id: `dep-${d}-${n.slug}`, source: d, target: n.slug, type: 'smoothstep',
        style: { stroke: DEPENDS, strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: DEPENDS, width: 12, height: 12 },
      });
    }
    if (n.part_of && slugs.has(n.part_of)) edges.push({
      id: `part-${n.slug}-${n.part_of}`, source: n.part_of, target: n.slug, type: 'smoothstep',
      style: { stroke: 'var(--border, #2a2e37)', strokeWidth: 1, strokeDasharray: '4 3' },
    });
  }
  return edges;
}

function Inner({ nodes: rawNodes, selected, highlight, onNodeClick }) {
  const [positions, setPositions] = useState(null);
  const [expanded, setExpanded] = useState(() => new Set());

  const bySlug = useMemo(() => Object.fromEntries(rawNodes.map((n) => [n.slug, n])), [rawNodes]);

  // A node is a parent if something is part_of it; the child count drives the affordance.
  const childCount = useMemo(() => {
    const c = {};
    for (const n of rawNodes) if (n.part_of) c[n.part_of] = (c[n.part_of] || 0) + 1;
    return c;
  }, [rawNodes]);

  // Visible = every ancestor (part_of chain) is expanded. A collapsed parent hides its subtree,
  // so a node "expands to show its components" on click. Top-level nodes are always visible.
  const visibleNodes = useMemo(() => rawNodes.filter((n) => {
    let p = n.part_of;
    while (p) { if (!expanded.has(p)) return false; p = bySlug[p]?.part_of; }
    return true;
  }), [rawNodes, expanded, bySlug]);

  const baseEdges = useMemo(() => buildEdges(visibleNodes), [visibleNodes]);

  // Selecting a hidden node (e.g. from the readout / an epic) auto-expands its ancestors.
  useEffect(() => {
    if (!selected) return;
    const need = [];
    let p = bySlug[selected]?.part_of;
    while (p) { need.push(p); p = bySlug[p]?.part_of; }
    if (!need.length) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      let changed = false;
      need.forEach((s) => { if (!next.has(s)) { next.add(s); changed = true; } });
      return changed ? next : prev;
    });
  }, [selected, bySlug]);

  useEffect(() => {
    let cancelled = false;
    const graph = {
      id: 'root',
      layoutOptions: ELK_OPTIONS,
      children: visibleNodes.map((n) => ({ id: n.slug, width: NODE_W, height: NODE_H })),
      edges: baseEdges.map((e) => ({ id: e.id, sources: [e.source], targets: [e.target] })),
    };
    elk.layout(graph).then((laid) => {
      if (cancelled) return;
      setPositions(Object.fromEntries((laid.children || []).map((c) => [c.id, { x: c.x, y: c.y }])));
    }).catch(() => { if (!cancelled) setPositions({}); });
    return () => { cancelled = true; };
  }, [visibleNodes, baseEdges]);

  // Selection set: the selected node + its explicit highlight neighbours. When nothing is
  // selected, everything is lit (no dimming).
  const lit = useMemo(() => {
    if (!selected) return null;
    return new Set([selected, ...(highlight || [])]);
  }, [selected, highlight]);

  const nodes = useMemo(() => {
    if (!positions) return [];
    return visibleNodes.map((n) => ({
      id: n.slug,
      type: 'cns',
      position: positions[n.slug] || { x: 0, y: 0 },
      data: {
        label: n.title || n.slug,
        kind: n.kind,
        type: n.type,
        archetype: n.archetype,
        health: n.health?.level,
        isParent: !!childCount[n.slug],
        expanded: expanded.has(n.slug),
        childCount: childCount[n.slug] || 0,
        selected: n.slug === selected,
        dimmed: lit ? !lit.has(n.slug) : false,
      },
    }));
  }, [visibleNodes, positions, selected, lit, childCount, expanded]);

  const edges = useMemo(() => {
    if (!lit) return baseEdges;
    return baseEdges.map((e) => ({
      ...e,
      style: { ...e.style, opacity: lit.has(e.source) && lit.has(e.target) ? 1 : 0.15 },
    }));
  }, [baseEdges, lit]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      nodesDraggable={false}
      nodesConnectable={false}
      onNodeClick={(_, n) => {
        if (childCount[n.id]) setExpanded((prev) => {
          const next = new Set(prev);
          if (next.has(n.id)) next.delete(n.id); else next.add(n.id);
          return next;
        });
        onNodeClick?.(n.id);
      }}
      fitView
      proOptions={{ hideAttribution: true }}
      minZoom={0.2}
    >
      <Background gap={20} color="var(--border, #2a2e37)" />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

export default function NodeGraph({ nodes, selected = null, highlight = [], onNodeClick }) {
  if (!nodes?.length) return null;
  return (
    <ReactFlowProvider>
      <Inner nodes={nodes} selected={selected} highlight={highlight} onNodeClick={onNodeClick} />
    </ReactFlowProvider>
  );
}
