import { useMemo, useCallback, useEffect, useState } from 'react';
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
import ContainerGraphCanvas from './ContainerGraphCanvas';
const USE_CONTAINER_GRAPH = true;
import GraphNode from './GraphNode';
import BulkActions from './BulkActions';
import ContextMenu from './ContextMenu';
import Skeleton from './Skeleton';

const nodeTypes = { project: GraphNode };
const elk = new ELK();

const NODE_WIDTH = 220;
const NODE_HEIGHT = 60;

const ELK_OPTIONS = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.layered.spacing.nodeNodeBetweenLayers': '120',
  'elk.spacing.nodeNode': '60',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
  'elk.edgeRouting': 'ORTHOGONAL',
  'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
};

async function getLayoutedElements(nodes, edges) {
  const graph = {
    id: 'root',
    layoutOptions: ELK_OPTIONS,
    children: nodes.map(n => ({
      id: n.id,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    })),
    edges: edges.map(e => ({
      id: e.id,
      sources: [e.source],
      targets: [e.target],
    })),
  };

  const layouted = await elk.layout(graph);

  const layoutedNodes = nodes.map(node => {
    const elkNode = layouted.children.find(n => n.id === node.id);
    return {
      ...node,
      position: { x: elkNode.x, y: elkNode.y },
    };
  });

  return { nodes: layoutedNodes, edges };
}

function buildEdges(projects) {
  const slugSet = new Set(projects.map(p => p.slug));
  const edges = [];

  for (const p of projects) {
    if (p.depends_on) {
      for (const dep of p.depends_on) {
        if (slugSet.has(dep)) {
          edges.push({
            id: `dep-${dep}-${p.slug}`,
            source: dep,
            target: p.slug,
            type: 'smoothstep',
            style: { stroke: '#4e4e4e', strokeWidth: 1.5 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#4e4e4e', width: 12, height: 12 },
          });
        }
      }
    }
    if (p.feeds) {
      for (const target of p.feeds) {
        if (slugSet.has(target)) {
          edges.push({
            id: `feed-${p.slug}-${target}`,
            source: p.slug,
            target: target,
            type: 'smoothstep',
            style: { stroke: '#007acc', strokeWidth: 1.5 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#007acc', width: 12, height: 12 },
          });
        }
      }
    }
    if (p.part_of && slugSet.has(p.part_of)) {
      edges.push({
        id: `partof-${p.slug}-${p.part_of}`,
        source: p.slug,
        target: p.part_of,
        type: 'smoothstep',
        style: { stroke: '#858585', strokeWidth: 1, strokeDasharray: '4 2' },
      });
    }
  }

  return edges;
}

function GraphCanvasInner({ projects = [], loading, error, onSelectNode, selectedProject }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [layouting, setLayouting] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodes, setSelectedNodes] = useState([]);

  const { setCenter, fitView } = useReactFlow();

  // Build initial (unpositioned) nodes and edges from projects
  const { initialNodes, initialEdges } = useMemo(() => {
    if (projects.length === 0) return { initialNodes: [], initialEdges: [] };

    const nodes = projects.map(p => ({
      id: p.slug,
      type: 'project',
      data: { title: p.title || p.slug, stage: p.stage, family: p.family, project: p },
      position: { x: 0, y: 0 },
    }));

    const edges = buildEdges(projects);
    return { initialNodes: nodes, initialEdges: edges };
  }, [projects]);

  // Run ELK layout whenever projects change
  useEffect(() => {
    if (initialNodes.length === 0) return;

    let cancelled = false;
    setLayouting(true);

    getLayoutedElements(initialNodes, initialEdges).then(({ nodes: ln, edges: le }) => {
      if (!cancelled) {
        setNodes(ln);
        setEdges(le);
        setLayouting(false);
      }
    }).catch(() => {
      if (!cancelled) setLayouting(false);
    });

    return () => { cancelled = true; };
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
      const matches = (p.title || '').toLowerCase().includes(q) ||
                      (p.slug || '').toLowerCase().includes(q) ||
                      (p.family || '').toLowerCase().includes(q);
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
    setCenter(node.position.x + NODE_WIDTH / 2, node.position.y + NODE_HEIGHT / 2, { zoom: 1.5, duration: 300 });
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

  if (loading || layouting) {
    return <Skeleton rows={5} style={{ height: '100%', justifyContent: 'center' }} />;
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
        <div style={{ color: '#f44747', fontSize: 13 }}>Kunde inte hämta projekt</div>
        <div style={{ color: '#858585', fontSize: 12, fontFamily: 'monospace' }}>{error}</div>
        <button onClick={() => window.location.reload()} style={{ marginTop: 8, padding: '4px 12px', background: '#007acc', color: '#fff', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 12 }}>
          Försök igen
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#858585', fontSize: 13 }}>
        Inga projekt hittades
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
            placeholder="Sök projekt..."
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
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        onSelectionChange={onSelectionChange}
        selectionOnDrag
        selectionMode={SelectionMode.Partial}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
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
          nodeColor={(node) => node.selected ? '#007acc' : '#3c3c3c'}
          maskColor="rgba(0,0,0,0.7)"
          style={{ background: '#252526', border: '1px solid #3c3c3c', borderRadius: 3 }}
        />
      </ReactFlow>
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

export default function GraphCanvas(props) {
  if (USE_CONTAINER_GRAPH) {
    return <ContainerGraphCanvas {...props} />;
  }
  return (
    <ReactFlowProvider>
      <GraphCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
