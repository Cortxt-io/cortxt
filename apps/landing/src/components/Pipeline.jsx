import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import { content } from '../data/content';

// ── Custom node types ──────────────────────────────────────

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
  cursor: 'default',
};

function PipelineNode({ data }) {
  return (
    <div style={nodeStyle}>
      <Handle type="target" position={Position.Top}
        style={{ background: '#334155', border: 'none' }} />
      {data.label}
      {data.sublabel && (
        <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: '4px' }}>
          {data.sublabel}
        </div>
      )}
      <Handle type="source" position={Position.Bottom}
        style={{ background: '#334155', border: 'none' }} />
    </div>
  );
}

function FutureNode({ data }) {
  return (
    <div
      style={{
        ...nodeStyle,
        border: '1px dashed var(--border)',
        color: 'var(--muted)',
        opacity: 0.6,
      }}
    >
      {data.label}
      <div style={{ fontSize: '0.6rem', marginTop: '4px', color: 'var(--accent)' }}>
        coming soon
      </div>
    </div>
  );
}

function TrackLabelNode({ data }) {
  return (
    <div
      style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '0.7rem',
        color: 'var(--muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        textAlign: 'center',
        cursor: 'default',
      }}
    >
      {data.label}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

const nodeTypes = {
  pipeline: PipelineNode,
  future: FutureNode,
  trackLabel: TrackLabelNode,
};

// ── Layout constants ───────────────────────────────────────
const LEFT_X   = 100;  // external track
const RIGHT_X  = 500;  // internal track
const CENTER_X = 280;  // center merge column
const Y_STEP   = 120;

const edgeStyle = { stroke: '#334155', strokeWidth: 1.5 };
const markerEnd = { type: MarkerType.ArrowClosed, color: '#334155' };

// ── Build nodes from content ───────────────────────────────
function buildNodes(pipeline) {
  const nodes = [];

  // Track labels
  nodes.push({
    id: 'label-external',
    type: 'trackLabel',
    position: { x: LEFT_X + 10,  y: -50 },
    data: { label: pipeline.tracks[0].label },
    draggable: false,
    selectable: false,
  });
  nodes.push({
    id: 'label-internal',
    type: 'trackLabel',
    position: { x: RIGHT_X + 10, y: -50 },
    data: { label: pipeline.tracks[1].label },
    draggable: false,
    selectable: false,
  });

  // External track nodes
  pipeline.tracks[0].nodes.forEach((node, i) => {
    nodes.push({
      id: node.id,
      type: 'pipeline',
      position: { x: LEFT_X, y: i * Y_STEP },
      data: { label: node.label, sublabel: node.sublabel },
      draggable: false,
      selectable: false,
    });
  });

  // Internal track nodes
  pipeline.tracks[1].nodes.forEach((node, i) => {
    nodes.push({
      id: node.id,
      type: 'pipeline',
      position: { x: RIGHT_X, y: i * Y_STEP },
      data: { label: node.label, sublabel: node.sublabel },
      draggable: false,
      selectable: false,
    });
  });

  // Center nodes: merge → review → approved
  const lastTrackY = (pipeline.tracks[0].nodes.length - 1) * Y_STEP;
  const mergeY     = lastTrackY + Y_STEP + 20;
  const reviewY    = mergeY + Y_STEP;
  const approvedY  = reviewY + Y_STEP;

  nodes.push({
    id: pipeline.mergeNode.id,
    type: 'pipeline',
    position: { x: CENTER_X, y: mergeY },
    data: { label: pipeline.mergeNode.label },
    draggable: false,
    selectable: false,
  });
  nodes.push({
    id: pipeline.reviewNode.id,
    type: 'pipeline',
    position: { x: CENTER_X, y: reviewY },
    data: { label: pipeline.reviewNode.label },
    draggable: false,
    selectable: false,
  });
  nodes.push({
    id: pipeline.approvedNode.id,
    type: 'pipeline',
    position: { x: CENTER_X, y: approvedY },
    data: { label: pipeline.approvedNode.label },
    draggable: false,
    selectable: false,
  });

  // Output split: git (left) and digest (right)
  const splitY = approvedY + Y_STEP;
  const dashboardY = splitY + Y_STEP;
  nodes.push({
    id: pipeline.outputNodes[0].id,  // git
    type: 'pipeline',
    position: { x: LEFT_X + 30, y: splitY },
    data: { label: pipeline.outputNodes[0].label },
    draggable: false,
    selectable: false,
  });
  nodes.push({
    id: pipeline.outputNodes[1].id,  // digest
    type: 'pipeline',
    position: { x: RIGHT_X - 30, y: splitY },
    data: { label: pipeline.outputNodes[1].label },
    draggable: false,
    selectable: false,
  });
  nodes.push({
    id: pipeline.outputNodes[2].id,  // dashboard
    type: 'pipeline',
    position: { x: RIGHT_X - 30, y: dashboardY },
    data: { label: pipeline.outputNodes[2].label },
    draggable: false,
    selectable: false,
  });

  // Future nodes are shown only in the legend below — not in the diagram
  return nodes;
}

// ── Build edges from content ───────────────────────────────
function buildEdges(pipeline) {
  const edges = [];
  const animated = true;

  // Helper: create a standard edge with hex colors and arrowhead
  const edge = (id, source, target) => ({
    id, source, target,
    type: 'smoothstep',
    style: edgeStyle,
    markerEnd,
    animated,
  });

  // External track: ext-docs → docswatch → engine
  const extNodes = pipeline.tracks[0].nodes;
  extNodes.forEach((node, i) => {
    if (i < extNodes.length - 1)
      edges.push(edge(`e-ext-${i}`, extNodes[i].id, extNodes[i + 1].id));
  });

  // Internal track: proj-md → cns-watch → cns-devwatch
  const intNodes = pipeline.tracks[1].nodes;
  intNodes.forEach((node, i) => {
    if (i < intNodes.length - 1)
      edges.push(edge(`e-int-${i}`, intNodes[i].id, intNodes[i + 1].id));
  });

  // Both last track nodes → merge (claude) — accent color highlights convergence
  edges.push({
    ...edge('e-ext-merge', extNodes[extNodes.length - 1].id, pipeline.mergeNode.id),
    style: { stroke: '#6366f1', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
  });
  edges.push({
    ...edge('e-int-merge', intNodes[intNodes.length - 1].id, pipeline.mergeNode.id),
    style: { stroke: '#6366f1', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
  });

  // Center chain: claude → vault → approved
  edges.push(edge('e-claude-vault',   pipeline.mergeNode.id,  pipeline.reviewNode.id));
  edges.push(edge('e-vault-approved', pipeline.reviewNode.id, pipeline.approvedNode.id));

  // approved → git, approved → digest
  edges.push(edge('e-approved-git',    pipeline.approvedNode.id, pipeline.outputNodes[0].id));
  edges.push(edge('e-approved-digest', pipeline.approvedNode.id, pipeline.outputNodes[1].id));

  // digest → dashboard
  edges.push(edge('e-digest-dashboard', pipeline.outputNodes[1].id, pipeline.outputNodes[2].id));

  return edges;
}

// ── Pipeline component ─────────────────────────────────────

export default function Pipeline() {
  const { pipeline } = content;

  const [nodes] = useNodesState(buildNodes(pipeline));
  const [edges] = useEdgesState(buildEdges(pipeline));

  return (
    <section id="pipeline" className="section">
      <div className="container">
        <div className="center fade-in" style={{ marginBottom: '3rem' }}>
          <div className="section-label">Architecture</div>
          <h2 className="section-title">The full picture</h2>
          <p className="section-sub">From external signals to structured decisions</p>
        </div>

        {/* Reactflow diagram */}
        <div
          style={{
            height: 1050,
            width: '100%',
            background: 'var(--surface)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2, includeHiddenNodes: false }}
            zoomOnDoubleClick={false}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="var(--border)" gap={32} size={1} />
          </ReactFlow>
        </div>

        {/* Scoring Studio note */}
        <div className="scoring-note fade-in">
          <span>⚙️</span>
          <p>
            <strong>{pipeline.configNote.label}</strong> —{' '}
            {pipeline.configNote.description}
          </p>
        </div>

        {/* Future nodes legend */}
        <div
          className="fade-in"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '0.75rem',
            maxWidth: '760px',
            margin: '2rem auto 0',
          }}
        >
          {pipeline.futureNodes.map((node) => (
            <div
              key={node.id}
              style={{
                background: 'var(--surface)',
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                padding: '0.6rem 1rem',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.75rem',
                color: 'var(--muted)',
                opacity: 0.6,
                textAlign: 'center',
              }}
            >
              {node.label}
              <div style={{ fontSize: '0.6rem', marginTop: '4px', color: 'var(--accent)' }}>
                coming soon
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
