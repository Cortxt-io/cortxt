import { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  SelectionMode,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ELK from 'elkjs/lib/elk.bundled.js';
import SystemContainerNode from './SystemContainerNode';
import ComponentNode from './ComponentNode';
import GraphLegend from './GraphLegend';
import BulkActions from './BulkActions';
import ContextMenu from './ContextMenu';
import Skeleton from './Skeleton';
import { getKindHexColor } from '../data/labels';

const nodeTypes = { systemContainer: SystemContainerNode, componentNode: ComponentNode };
const elk = new ELK();

// ── Edge color constants ──────────────────────────────────
const FEEDS_EDGE_COLOR = '#007acc';
const DEPENDS_EDGE_COLOR = '#f59e0b';

// ── Layout constants ──────────────────────────────────────
const CONTAINER_PADDING = '[top=44,left=16,bottom=16,right=16]';
const CHILD_WIDTH = 180;
const CHILD_HEIGHT = 50;

const ELK_OPTIONS = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '40',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
  'elk.edgeRouting': 'ORTHOGONAL',
  'elk.partitioning.activate': 'true',
};

const LANE_ORDER = {
  'infrastructure': 0,
  'pipeline-intern': 1,
  'pipeline-extern': 1,
  'pipeline-review': 1,
  'interface': 2,
};

// ── Classification logic ──────────────────────────────────
function classifyProjects(projects) {
  // Exclude framework nodes
  const visible = projects.filter(p => p.kind !== 'framework');

  const slugSet = new Set(visible.map(p => p.slug));

  // Container slugs: slugs that other nodes point to via part_of
  const containerSlugs = new Set(
    visible.filter(p => p.part_of && slugSet.has(p.part_of)).map(p => p.part_of)
  );

  const containers = [];
  const children = [];
  const topLevel = [];

  for (const p of visible) {
    if (containerSlugs.has(p.slug)) {
      containers.push(p);
    } else if (p.part_of && containerSlugs.has(p.part_of)) {
      children.push(p);
    } else {
      // Top-level leaf (including nodes whose part_of points to a non-container or non-existent slug)
      topLevel.push(p);
    }
  }

  return { containers, children, topLevel, containerSlugs };
}

// ── Topological sort for containers (parent before child for nested containers) ──
function topoSortContainers(containers, containerSlugs) {
  const containerMap = new Map(containers.map(c => [c.slug, c]));
  const visited = new Set();
  const result = [];

  function visit(slug) {
    if (visited.has(slug)) return;
    visited.add(slug);
    const c = containerMap.get(slug);
    if (c && c.part_of && containerSlugs.has(c.part_of)) {
      visit(c.part_of);
    }
    if (c) result.push(c);
  }

  for (const c of containers) {
    visit(c.slug);
  }

  return result;
}

// ── Build edges (feeds + depends_on only, NO part_of) ─────
function buildEdges(projects, containerSlugs) {
  const slugSet = new Set(projects.filter(p => p.kind !== 'framework').map(p => p.slug));
  const edges = [];

  for (const p of projects) {
    if (p.kind === 'framework') continue;

    if (p.feeds) {
      for (const target of p.feeds) {
        if (slugSet.has(target)) {
          edges.push({
            id: `feed-${p.slug}-${target}`,
            source: p.slug,
            target,
            type: 'smoothstep',
            style: { stroke: FEEDS_EDGE_COLOR, strokeWidth: 1.5 },
            markerEnd: { type: MarkerType.ArrowClosed, color: FEEDS_EDGE_COLOR, width: 12, height: 12 },
          });
        }
      }
    }

    if (p.depends_on) {
      for (const dep of p.depends_on) {
        if (slugSet.has(dep)) {
          edges.push({
            id: `dep-${dep}-${p.slug}`,
            source: dep,
            target: p.slug,
            type: 'smoothstep',
            style: { stroke: DEPENDS_EDGE_COLOR, strokeWidth: 1.5 },
            markerEnd: { type: MarkerType.ArrowClosed, color: DEPENDS_EDGE_COLOR, width: 12, height: 12 },
          });
        }
      }
    }
  }

  return edges;
}

// ── Build initial ReactFlow nodes (before layout) ────────
function buildInitialNodes(projects) {
  const { containers, children, topLevel, containerSlugs } = classifyProjects(projects);

  // Sort containers topologically
  const sortedContainers = topoSortContainers(containers, containerSlugs);

  // Group children by parent
  const childrenByParent = new Map();
  for (const c of children) {
    if (!childrenByParent.has(c.part_of)) childrenByParent.set(c.part_of, []);
    childrenByParent.get(c.part_of).push(c);
  }

  const nodes = [];

  // 1. Container nodes (parents before children)
  for (const c of sortedContainers) {
    const childList = childrenByParent.get(c.slug) || [];
    nodes.push({
      id: c.slug,
      type: 'systemContainer',
      data: {
        title: c.title || c.slug,
        kind: c.kind,
        stage: c.stage,
        childCount: childList.length,
        project: c,
      },
      position: { x: 0, y: 0 },
      style: { width: 400, height: 200 },
    });
  }

  // 2. Child nodes (inside containers)
  for (const c of sortedContainers) {
    const childList = childrenByParent.get(c.slug) || [];
    for (const ch of childList) {
      nodes.push({
        id: ch.slug,
        type: 'componentNode',
        data: {
          title: ch.title || ch.slug,
          kind: ch.kind,
          stage: ch.stage,
          project: ch,
        },
        position: { x: 0, y: 0 },
        parentNode: c.slug,
        extent: 'parent',
      });
    }
  }

  // 3. Top-level leaf nodes
  for (const t of topLevel) {
    nodes.push({
      id: t.slug,
      type: 'componentNode',
      data: {
        title: t.title || t.slug,
        kind: t.kind,
        stage: t.stage,
        project: t,
      },
      position: { x: 0, y: 0 },
    });
  }

  return nodes;
}

// ── ELK layout ────────────────────────────────────────────
async function getLayoutedElements(nodes, edges, projects) {
  const { containers, children, topLevel, containerSlugs } = classifyProjects(projects);
  const sortedContainers = topoSortContainers(containers, containerSlugs);

  const childrenByParent = new Map();
  for (const c of children) {
    if (!childrenByParent.has(c.part_of)) childrenByParent.set(c.part_of, []);
    childrenByParent.get(c.part_of).push(c);
  }

  // Build ELK graph
  const elkChildren = [];

  for (const c of sortedContainers) {
    const childList = childrenByParent.get(c.slug) || [];
    const elkContainer = {
      id: c.slug,
      layoutOptions: {
        'elk.padding': CONTAINER_PADDING,
        'elk.partitioning.partition': String(LANE_ORDER[c.slug] ?? 1),
      },
      children: childList.map(ch => ({
        id: ch.slug,
        width: CHILD_WIDTH,
        height: CHILD_HEIGHT,
      })),
    };
    elkChildren.push(elkContainer);
  }

  const orphans = topLevel.filter(p => !p.feeds?.length && !p.depends_on?.length && p.kind !== 'framework');
  const flowParticipants = topLevel.filter(p => !orphans.includes(p));

  for (const t of flowParticipants) {
    elkChildren.push({
      id: t.slug,
      width: CHILD_WIDTH,
      height: CHILD_HEIGHT,
    });
  }

  // Build ELK edges (only feeds and depends_on, NOT part_of)
  const elkEdges = [];
  const slugSet = new Set(nodes.map(n => n.id));

  for (const p of projects) {
    if (p.kind === 'framework') continue;

    if (p.feeds) {
      for (const target of p.feeds) {
        if (slugSet.has(target)) {
          elkEdges.push({ id: `feed-${p.slug}-${target}`, sources: [p.slug], targets: [target] });
        }
      }
    }
    if (p.depends_on) {
      for (const dep of p.depends_on) {
        if (slugSet.has(dep)) {
          elkEdges.push({ id: `dep-${dep}-${p.slug}`, sources: [dep], targets: [p.slug] });
        }
      }
    }
  }

  const elkGraph = {
    id: 'root',
    layoutOptions: ELK_OPTIONS,
    children: elkChildren,
    edges: elkEdges,
  };

  const layouted = await elk.layout(elkGraph);

  // Map ELK results back to ReactFlow nodes
  // Helper: recursively find ELK node by id
  function findElkNode(elkNode, id) {
    if (elkNode.id === id) return elkNode;
    if (elkNode.children) {
      for (const child of elkNode.children) {
        const found = findElkNode(child, id);
        if (found) return found;
      }
    }
    return null;
  }

  const layoutedNodes = nodes.map(node => {
    const elkNode = findElkNode(layouted, node.id);
    if (!elkNode) return node;

    // Container nodes: position + size from ELK
    if (node.type === 'systemContainer') {
      return {
        ...node,
        position: { x: elkNode.x, y: elkNode.y },
        style: { ...node.style, width: elkNode.width, height: elkNode.height },
      };
    }

    // Child nodes: position relative to parent (ELK gives relative coords for children)
    // Top-level leaves: absolute position from ELK
    return {
      ...node,
      position: { x: elkNode.x, y: elkNode.y },
    };
  });

  // ── Position orphan nodes below the main graph ──
  if (orphans.length > 0) {
    const containerNodes = layoutedNodes.filter(n => n.type === 'systemContainer' || !n.parentNode);
    const maxY = Math.max(...containerNodes.map(n => (n.position?.y || 0) + (n.style?.height || 50)));
    const ORPHAN_GAP = 80;
    const ORPHAN_SPACING = 200;

    const orphanNodes = orphans.map((p, i) => ({
      id: p.slug,
      type: 'componentNode',
      data: {
        title: p.title || p.slug,
        kind: p.kind,
        stage: p.stage,
        project: p,
        parked: true,
      },
      position: { x: i * ORPHAN_SPACING, y: maxY + ORPHAN_GAP },
    }));

    layoutedNodes.push(...orphanNodes);
  }

  return { nodes: layoutedNodes, edges };
}

// ── Inner component ───────────────────────────────────────
function ContainerGraphCanvasInner({ projects = [], loading, error, onSelectNode, selectedProject }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [layouting, setLayouting] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [collapsedSystems, setCollapsedSystems] = useState(new Set());

  const { setCenter, fitView } = useReactFlow();

  // ── Semantic zoom: collapse/expand based on zoom level with hysteresis ──
  // Track the last zoom level that actually triggered a state change.
  // Only respond to threshold crossings, not every move-end event.
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  const lastZoomRef = useRef(null);
  const initializedRef = useRef(false);

  const onMoveEnd = useCallback((event, viewport) => {
    const zoom = viewport.zoom;

    // Skip until the component is fully initialized (layout done, first fitView complete)
    if (!initializedRef.current) return;

    // Skip if nodesRef is empty (layout not yet applied)
    if (nodesRef.current.length === 0) return;

    const prev = lastZoomRef.current;
    lastZoomRef.current = zoom;

    // First call after init — just record zoom, don't change state
    if (prev === null) return;

    // Only act when crossing thresholds (hysteresis)
    if (zoom < 0.6 && prev >= 0.6) {
      // Crossed INTO collapse zone
      setCollapsedSystems(() => {
        const allContainers = nodesRef.current.filter(n => n.type === 'systemContainer').map(n => n.id);
        return new Set(allContainers);
      });
    } else if (zoom > 0.7 && prev <= 0.7) {
      // Crossed INTO expand zone
      setCollapsedSystems(curr => {
        if (curr.size === 0) return curr;
        return new Set();
      });
    }
    // Otherwise (staying in same zone, or in dead zone) — do nothing
  }, []);

  // Build initial nodes and edges from projects
  const { initialNodes, initialEdges } = useMemo(() => {
    if (projects.length === 0) return { initialNodes: [], initialEdges: [] };

    const nodes = buildInitialNodes(projects);
    const edges = buildEdges(projects);
    return { initialNodes: nodes, initialEdges: edges };
  }, [projects]);

  // Run ELK layout whenever projects change
  useEffect(() => {
    if (initialNodes.length === 0) return;

    let cancelled = false;
    setLayouting(true);
    initializedRef.current = false;

    getLayoutedElements(initialNodes, initialEdges, projects).then(({ nodes: ln, edges: le }) => {
      if (!cancelled) {
        setNodes(ln);
        setEdges(le);
        setLayouting(false);

        // Fit view after layout, then mark as initialized
        requestAnimationFrame(() => {
          try { fitView({ padding: 0.2, duration: 300 }); } catch { /* ignore */ }
          // Mark initialized after fitView animation settles (duration + buffer)
          setTimeout(() => {
            if (!cancelled) initializedRef.current = true;
          }, 400);
        });
      }
    }).catch(() => {
      if (!cancelled) setLayouting(false);
    });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Update selected state without re-layout
  useEffect(() => {
    setNodes(nds => nds.map(n => ({
      ...n,
      selected: selectedProject && selectedProject.slug === n.id,
    })));
  }, [selectedProject, setNodes]);

  // Apply search dimming
  useEffect(() => {
    if (!searchQuery) {
      setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, dimmed: false } })));
      return;
    }
    const q = searchQuery.toLowerCase();
    setNodes(nds => nds.map(n => {
      const p = n.data.project;
      const matches = (p?.title || '').toLowerCase().includes(q) ||
                      (p?.slug || '').toLowerCase().includes(q) ||
                      (p?.family || '').toLowerCase().includes(q) ||
                      (p?.kind || '').toLowerCase().includes(q);
      return { ...n, data: { ...n.data, dimmed: !matches } };
    }));
  }, [searchQuery, setNodes]);

  // Open floating search on / or Ctrl+F
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && !searchOpen && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchOpen]);

  const onNodeClick = useCallback((event, node) => {
    onSelectNode && onSelectNode(node.data.project);
  }, [onSelectNode]);

  const onNodeDoubleClick = useCallback((event, node) => {
    const w = node.style?.width || CHILD_WIDTH;
    const h = node.style?.height || CHILD_HEIGHT;
    setCenter(node.position.x + w / 2, node.position.y + h / 2, { zoom: 1.5, duration: 300 });
  }, [setCenter]);

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, project: node.data.project });
  }, []);

  const onPaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  const onSelectionChange = useCallback(({ nodes: selected }) => {
    setSelectedNodes(selected || []);
  }, []);

  // ── Apply collapsed state to nodes/edges ──
  // IMPORTANT: We use `hidden: true` instead of filtering nodes out, because
  // ReactFlow's onNodesChange operates on the same nodes array. Filtering
  // creates a desync that causes nodes to disappear on any viewport change.
  const visibleNodes = useMemo(() => {
    if (collapsedSystems.size === 0) {
      // Ensure all containers have collapsed: false
      const needsUpdate = nodes.some(n => n.type === 'systemContainer' && n.data?.collapsed);
      if (!needsUpdate) return nodes;
      return nodes.map(n => {
        if (n.type === 'systemContainer' && n.data?.collapsed) {
          return { ...n, data: { ...n.data, collapsed: false }, hidden: false };
        }
        return n;
      });
    }

    return nodes.map(n => {
      // Hide children of collapsed containers
      if (n.parentNode && collapsedSystems.has(n.parentNode)) {
        return { ...n, hidden: true };
      }
      // Collapsed container: compact size
      if (n.type === 'systemContainer' && collapsedSystems.has(n.id)) {
        return {
          ...n,
          data: { ...n.data, collapsed: true },
          style: { ...n.style, width: 220, height: 60 },
          hidden: false,
        };
      }
      // Expanded container
      if (n.type === 'systemContainer' && !collapsedSystems.has(n.id)) {
        return { ...n, data: { ...n.data, collapsed: false }, hidden: false };
      }
      // Regular top-level leaf
      return { ...n, hidden: false };
    });
  }, [nodes, collapsedSystems]);

  const visibleEdges = useMemo(() => {
    if (collapsedSystems.size === 0) return edges;

    const hiddenNodeIds = new Set(
      nodes.filter(n => n.parentNode && collapsedSystems.has(n.parentNode)).map(n => n.id)
    );

    const mapped = edges.map(e => {
      let source = e.source;
      let target = e.target;

      const sourceNode = nodes.find(n => n.id === e.source);
      const targetNode = nodes.find(n => n.id === e.target);

      if (sourceNode && hiddenNodeIds.has(sourceNode.id)) {
        source = sourceNode.parentNode;
      }
      if (targetNode && hiddenNodeIds.has(targetNode.id)) {
        target = targetNode.parentNode;
      }

      if (source === target) return null;

      if (source !== e.source || target !== e.target) {
        return { ...e, id: `${e.id}-collapsed`, source, target, hidden: false };
      }
      return { ...e, hidden: false };
    }).filter(Boolean);

    // Deduplicate retargeted edges by source+target
    const seen = new Set();
    return mapped.filter(e => {
      const key = `${e.source}->${e.target}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [edges, nodes, collapsedSystems]);

  if (loading || layouting) {
    return <Skeleton rows={5} style={{ height: '100%', justifyContent: 'center' }} />;
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
        <div style={{ color: '#f44747', fontSize: 13 }}>Could not load projects</div>
        <div style={{ color: '#858585', fontSize: 12, fontFamily: 'monospace' }}>{error}</div>
        <button onClick={() => window.location.reload()} style={{ marginTop: 8, padding: '4px 12px', background: '#007acc', color: '#fff', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 12 }}>
          Retry
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#858585', fontSize: 13 }}>
        No projects found
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Floating search */}
      {searchOpen && (
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          zIndex: 100, display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <input
            autoFocus
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); } }}
            style={{
              width: 280, padding: '6px 12px', fontSize: 12,
              background: '#252526', border: '1px solid #3c3c3c',
              borderRadius: 4, color: '#cccccc', outline: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
          />
          <button
            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
            style={{
              width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#252526', border: '1px solid #3c3c3c', borderRadius: 4,
              color: '#858585', cursor: 'pointer', fontSize: 14,
            }}
          >×</button>
        </div>
      )}

      {/* Bulk actions bar */}
      {selectedNodes.length > 1 && (
        <BulkActions
          count={selectedNodes.length}
          nodes={selectedNodes}
          onDeselect={() => setNodes(nds => nds.map(n => ({ ...n, selected: false })))}
        />
      )}

      <ReactFlow
        nodes={visibleNodes}
        edges={visibleEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        onSelectionChange={onSelectionChange}
        onMoveEnd={onMoveEnd}
        selectionOnDrag
        selectionMode={SelectionMode.Partial}
        nodeTypes={nodeTypes}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        style={{ background: '#1e1e1e' }}
      >
        <Background color="#2d2d2d" gap={20} size={1} />
        <Controls
          style={{ background: '#252526', border: '1px solid #3c3c3c', borderRadius: 3 }}
          showInteractive={false}
        />
        <MiniMap
          nodeColor={(node) => {
            if (node.selected) return '#007acc';
            if (node.type === 'systemContainer') {
              const kind = node.data?.kind;
              return kind ? getKindHexColor(kind) : '#22d3ee';
            }
            return '#3c3c3c';
          }}
          maskColor="rgba(0,0,0,0.7)"
          style={{ background: '#252526', border: '1px solid #3c3c3c', borderRadius: 3 }}
        />
      </ReactFlow>

      {/* Legend */}
      <GraphLegend />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          project={contextMenu.project}
          onClose={() => setContextMenu(null)}
          onSelectNode={onSelectNode}
        />
      )}
    </div>
  );
}

export default function ContainerGraphCanvas(props) {
  return (
    <ReactFlowProvider>
      <ContainerGraphCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
