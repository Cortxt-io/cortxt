import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProject from '../hooks/useProject';
import { ZONE_SECTION_MAP } from '../data/zoneSections';
import IdentityZone from './NodePage/IdentityZone';
import TimelineZone from './NodePage/TimelineZone';
import ContextZone from './NodePage/ContextZone';
import DocsZone from './NodePage/DocsZone';

export default function NodePage({ projects = [] }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { project, loading, error, refresh } = useProject(slug);

  // Compute zone sections for this node's kind
  const kind = project?.meta?.kind;
  const zoneSections = kind && ZONE_SECTION_MAP[kind] ? ZONE_SECTION_MAP[kind] : { gjort: [], nu: [], nasta: [], sammanhang: [] };

  // Flatten all consumed section names into a Set
  const consumedSections = useMemo(() => {
    const set = new Set();
    for (const group of Object.values(zoneSections)) {
      if (Array.isArray(group)) {
        for (const name of group) set.add(name);
      }
    }
    return set;
  }, [kind]);

  // ── Loading state ──
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <p style={{
          color: 'var(--muted)',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 14,
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          Loading…
        </p>
      </div>
    );
  }

  // ── Not found ──
  if (error === 'not_found') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem' }}>
        <p style={{ color: 'var(--muted)', fontSize: 18 }}>Project not found</p>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--accent)',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 14,
          }}
        >
          ← Tillbaka
        </button>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem' }}>
        <p style={{ color: '#fb7185', fontSize: 14 }}>Error: {error}</p>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--accent)',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 14,
          }}
        >
          ← Tillbaka
        </button>
      </div>
    );
  }

  if (!project) return null;

  const { meta, sections, project_files, pending } = project;

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--muted)',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 14,
          marginBottom: 24,
          display: 'inline-block',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; }}
      >
        ← Wiki
      </button>

      {/* Zone 1: Identity — full width */}
      <IdentityZone meta={meta} projects={projects} />

      {/* Zone 2 + Zone 3: Timeline + Context side by side on desktop */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: 24,
        alignItems: 'start',
      }}
        className="nodepage-zones"
      >
        {/* Zone 2: Timeline (main column) */}
        <TimelineZone
          slug={slug}
          meta={meta}
          sections={sections}
          zoneSections={zoneSections}
          projects={projects}
          pending={pending}
          refresh={refresh}
        />

        {/* Zone 3: Context (sidebar) */}
        <ContextZone
          kind={kind}
          meta={meta}
          sections={sections}
          zoneSections={zoneSections}
          projects={projects}
          slug={slug}
        />
      </div>

      {/* Zone 4: Docs — full width below */}
      <DocsZone
        sections={sections}
        consumedSections={consumedSections}
        projectFiles={project_files}
      />

      {/* Responsive: stack on mobile via injected style tag */}
      <style>{`
        @media (max-width: 767px) {
          .nodepage-zones {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
