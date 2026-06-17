import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import KindBadge from './KindBadge';
import { getNodeStageColor } from '../data/labels';

function TreeNode({ node, depth, navigate }) {
  const stageColor = getNodeStageColor(node.stage);
  return (
    <button
      onClick={() => navigate('/project/' + node.slug)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '6px 0',
        paddingLeft: depth * 20,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text)',
        fontSize: 13,
        fontFamily: 'inherit',
        textAlign: 'left',
      }}
    >
      {/* Stage dot */}
      <div style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        background: stageColor,
        flexShrink: 0,
      }} />
      <span style={{ fontWeight: 500 }}>{node.title}</span>
      <KindBadge kind={node.kind} />
    </button>
  );
}

function CollapsibleGroup({ label, nodes, depth, navigate, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          width: '100%',
          padding: '6px 0',
          paddingLeft: depth * 20,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text)',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: '"JetBrains Mono", monospace',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '0.7rem' }}>{open ? '▼' : '▶'}</span>
        {label}
        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>
          ({nodes.length})
        </span>
      </button>
      {open && (
        <div style={{ borderLeft: depth > 0 ? '1px solid var(--border)' : 'none', marginLeft: depth * 20 + 8 }}>
          {nodes.map((node) => (
            <TreeNode key={node.slug} node={node} depth={0} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FrameworkTree({ projects = [] }) {
  const navigate = useNavigate();

  // Build hierarchy using top-level fields: p.kind, p.part_of, p.stage, p.slug, p.title
  const hierarchy = useMemo(() => {
    const frameworks = projects.filter(p => p.kind === 'framework' && !p.part_of);
    const systems = projects.filter(p => p.kind === 'system');
    const components = projects.filter(p => p.kind === 'component');
    const unplaced = projects.filter(p => !p.part_of && p.kind !== 'framework');

    // Group systems by their parent framework
    const systemsByFramework = {};
    for (const sys of systems) {
      const parent = sys.part_of;
      if (!systemsByFramework[parent]) systemsByFramework[parent] = [];
      systemsByFramework[parent].push(sys);
    }

    // Group components by their parent system
    const componentsBySystem = {};
    for (const comp of components) {
      const parent = comp.part_of;
      if (!componentsBySystem[parent]) componentsBySystem[parent] = [];
      componentsBySystem[parent].push(comp);
    }

    return { frameworks, systemsByFramework, componentsBySystem, unplaced };
  }, [projects]);

  if (projects.length === 0) {
    return <div style={{ fontSize: 13, color: 'var(--muted)' }}>Inga projekt att visa</div>;
  }

  return (
    <div>
      {/* Framework groups */}
      {hierarchy.frameworks.map((fw) => {
        const sys = hierarchy.systemsByFramework[fw.slug] || [];
        return (
          <div key={fw.slug} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}>
            {/* Framework header */}
            <TreeNode node={fw} depth={0} navigate={navigate} />

            {/* Systems under this framework */}
            {sys.map((s) => {
              const comps = hierarchy.componentsBySystem[s.slug] || [];
              return (
                <CollapsibleGroup
                  key={s.slug}
                  label={s.title}
                  nodes={[s, ...comps]}
                  depth={1}
                  navigate={navigate}
                  defaultOpen={false}
                />
              );
            })}
          </div>
        );
      })}

      {/* Unplaced nodes */}
      {hierarchy.unplaced.length > 0 && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)', marginBottom: 8 }}>
            Oplacerade
          </div>
          {hierarchy.unplaced.map((node) => (
            <TreeNode key={node.slug} node={node} depth={0} navigate={navigate} />
          ))}
        </div>
      )}

      {/* Disabled "Visa full graf →" link */}
      <div style={{
        marginTop: 12,
        fontSize: 12,
        fontFamily: 'var(--font-mono, monospace)',
        color: 'var(--muted)',
        opacity: 0.4,
        pointerEvents: 'none',
        cursor: 'default',
      }}
        title="Kommer snart"
      >
        Visa full graf →
      </div>
    </div>
  );
}