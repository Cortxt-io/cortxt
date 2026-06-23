import { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ELK from 'elkjs/lib/elk.bundled.js';

/* @cortxt/graph — NodeGraph
 *
 * Lean, fetch-free ELK-laid-out node graph. Feed it CNS-shaped nodes
 * ({slug, title, kind, part_of, feeds[], depends_on[], health}) and it lays them
 * out (ELK layered, RIGHT) and renders feeds (blue) / depends_on (amber) /
 * part_of (faint, child→parent) edges with kind-coloured nodes + a health dot.
 *
 * Reuses the dashboard's proven ELK options + feeds/depends_on edge mapping, but
 * flat (no container nesting) — these per-product graphs are small. Props in, no
 * data fetching (the consumer owns that). */

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

const KIND_COLOR = {
  framework: '#a78bfa',
  system: '#4ec9b0',
  component: '#60a5fa',
};
const HEALTH_COLOR = {
  healthy: '#4ec9b0',
  attention: '#fbbf24',
  degraded: '#fb7185',
  unknown: '#64748b',
};
const FEEDS = '#4ec9b0';
const DEPENDS = '#fbbf24';

function CnsNode({ data }) {
  const kindColor = KIND_COLOR[data.kind] || '#64748b';
  const healthColor = HEALTH_COLOR[data.health] || HEALTH_COLOR.unknown;
  return (
    <div style={{
      width: NODE_W, height: NODE_H, boxSizing: 'border-box',
      borderLeft: `4px solid ${kindColor}`, borderRadius: 8,
      background: 'var(--surface, #1b1e24)', border: '1px solid var(--border, #2a2e37)',
      borderLeftWidth: 4, borderLeftColor: kindColor,
      padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      color: 'var(--text, #e8eaed)', fontSize: 13, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: healthColor, flex: '0 0 auto' }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.label}</span>
      </div>
      {data.kind && <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{data.kind}</div>}
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

function Inner({ nodes: rawNodes }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const rfEdges = buildEdges(rawNodes);
    const graph = {
      id: 'root',
      layoutOptions: ELK_OPTIONS,
      children: rawNodes.map((n) => ({ id: n.slug, width: NODE_W, height: NODE_H })),
      edges: rfEdges.map((e) => ({ id: e.id, sources: [e.source], targets: [e.target] })),
    };
    elk.layout(graph).then((laid) => {
      if (cancelled) return;
      const pos = Object.fromEntries((laid.children || []).map((c) => [c.id, { x: c.x, y: c.y }]));
      setNodes(rawNodes.map((n) => ({
        id: n.slug,
        type: 'cns',
        position: pos[n.slug] || { x: 0, y: 0 },
        data: { label: n.title || n.slug, kind: n.kind, health: n.health?.level },
      })));
      setEdges(rfEdges);
    }).catch(() => { if (!cancelled) { setNodes([]); setEdges([]); } });
    return () => { cancelled = true; };
  }, [rawNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      proOptions={{ hideAttribution: true }}
      minZoom={0.2}
    >
      <Background gap={20} color="var(--border, #2a2e37)" />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

export default function NodeGraph({ nodes }) {
  if (!nodes?.length) return null;
  return (
    <ReactFlowProvider>
      <Inner nodes={nodes} />
    </ReactFlowProvider>
  );
}
