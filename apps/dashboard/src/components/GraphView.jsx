import { useMemo } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  Controls,
} from 'reactflow';
import StatusBadge from './StatusBadge';
import { getFamilyLabel, getFamilyColor } from '../data/labels';

// ── Custom node styles (reused from landing/Pipeline.jsx) ──

const nodeStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '10px 16px',
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.8rem',
  color: 'var(--text)',
  width: '200px',
  minWidth: '200px',
  maxWidth: '200px',
  textAlign: 'center',
  cursor: 'pointer',
};

function ProjectNode({ data }) {
  return (
    <div
      style={nodeStyle}
      onClick={() => data.onNavigate(data.slug)}
      title="View project"
    >
      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{data.label}</div>
      <StatusBadge status={data.status} />
    </div>
  );
}

function GroupNode({ data }) {
  return (
    <div
      style={{
        background: `${data.color}08`,
        border: `1px dashed ${data.color}40`,
        borderRadius: '12px',
        padding: '20px 16px 16px',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.7rem',
          color: data.color,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 500,
          marginBottom: '8px',
        }}
      >
        {data.label}
      </div>
    </div>
  );
}

const nodeTypes = {
  projectNode: ProjectNode,
  groupNode: GroupNode,
};

// ── Build graph data ───────────────────────────────────────

const GROUP_PADDING = 60;
const GROUP_HEADER = 30;
const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const Y_STEP = 80;
const X_STEP = 260;

function buildGraphData(projects, onNavigate) {
  const families = {};
  projects.forEach((p) => {
    if (!families[p.family]) families[p.family] = [];
    families[p.family].push(p);
  });

  const familyKeys = Object.keys(families);
  const nodes = [];

  familyKeys.forEach((family, colIdx) => {
    const familyProjects = families[family];
    const familyColor = getFamilyColor(family);
    const familyLabel = getFamilyLabel(family);
    const groupX = colIdx * X_STEP;
    const groupHeight = GROUP_HEADER + familyProjects.length * Y_STEP + GROUP_PADDING;

    // Group node
    nodes.push({
      id: `group-${family}`,
      type: 'groupNode',
      position: { x: groupX, y: 0 },
      data: { label: familyLabel, color: familyColor },
      style: {
        width: NODE_WIDTH + GROUP_PADDING,
        height: groupHeight,
        background: 'transparent',
        border: 'none',
      },
      draggable: false,
      selectable: false,
    });

    // Project nodes inside the group
    familyProjects.forEach((project, rowIdx) => {
      nodes.push({
        id: project.slug,
        type: 'projectNode',
        position: {
          x: groupX + GROUP_PADDING / 2,
          y: GROUP_HEADER + rowIdx * Y_STEP,
        },
        data: {
          label: project.title,
          status: project.status,
          slug: project.slug,
          onNavigate,
        },
        draggable: false,
        selectable: false,
        style: { pointerEvents: 'all' },
      });
    });
  });

  return { nodes, edges: [] };
}

// ── GraphView component ────────────────────────────────────

export default function GraphView({ projects, onClose, onNavigate }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildGraphData(projects, onNavigate),
    [projects, onNavigate]
  );

  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'var(--bg)',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1.5rem',
          zIndex: 210,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '0.4rem 0.8rem',
          color: 'var(--text)',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.8rem',
          cursor: 'pointer',
        }}
      >
        ✕ Close
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        onNodeClick={(_, node) => {
          if (node.type === 'projectNode') {
            onNavigate(node.id);
          }
        }}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnDoubleClick={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        selectNodesOnDrag={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--border)" gap={32} size={1} />
        <Controls
          showInteractive={false}
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        />
      </ReactFlow>
    </div>
  );
}
