import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import useProject from '../hooks/useProject';
import StatusBadge from './StatusBadge';
import FamilyBadge from './FamilyBadge';
import { getStageLabel } from '../data/labels';

marked.use({ breaks: true, gfm: true });

function roiColor(value) {
  if (value >= 250) return 'var(--success)';
  if (value > 0) return '#f59e0b';
  return 'var(--muted)';
}

function formatSEK(n) {
  if (n == null) return '—';
  return n.toLocaleString('sv-SE') + ' kr';
}

function FileSection({ name, files }) {
  const [open, setOpen] = useState(false);
  if (!files || files.length === 0) return null;

  return (
    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-semibold text-text"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <span style={{ fontSize: '0.7rem' }}>{open ? '▼' : '▶'}</span>
        {name.charAt(0).toUpperCase() + name.slice(1)} ({files.length} {files.length === 1 ? 'file' : 'files'})
      </button>
      {open && (
        <div style={{ marginTop: '1rem' }}>
          {files.map((f, i) => (
            <div key={i} style={{ marginBottom: '1.5rem' }}>
              <h4
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.8rem',
                  color: 'var(--accent)',
                  marginBottom: '0.5rem',
                }}
              >
                {f.filename}
              </h4>
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: marked.parse(f.content || '') }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { project, loading, error } = useProject(slug);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <p className="text-muted animate-pulse font-mono text-sm">Loading…</p>
      </div>
    );
  }

  if (error === 'not_found') {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: '50vh', gap: '1rem' }}>
        <p className="text-muted text-lg">Project not found</p>
        <button
          onClick={() => navigate('/')}
          className="text-accent hover:text-accent-h font-mono text-sm"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← Back to portfolio
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: '50vh', gap: '1rem' }}>
        <p className="text-rose-400 text-sm">Error: {error}</p>
        <button
          onClick={() => navigate('/')}
          className="text-accent hover:text-accent-h font-mono text-sm"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← Back to portfolio
        </button>
      </div>
    );
  }

  if (!project) return null;

  const { meta, sections, project_files } = project;

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="text-muted hover:text-text font-mono text-sm mb-6 inline-block"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        ← Portfolio
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-3xl font-extrabold text-text" style={{ letterSpacing: '-0.03em' }}>
          {meta.title}
        </h1>
        <StatusBadge status={meta.status} />
        <FamilyBadge family={meta.family} />
        <span
          className="text-xs text-muted"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          {getStageLabel(meta.mvp_stage)}
        </span>
      </div>

      {/* Meta grid */}
      <div
        className="grid gap-4 mb-8"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
      >
        <MetaItem label="ROI" value={`${meta.roi_percent ?? 0}%`} valueStyle={{ color: roiColor(meta.roi_percent) }} />
        <MetaItem label="Cost" value={formatSEK(meta.cost_sek)} />
        <MetaItem label="Value" value={formatSEK(meta.value_sek)} />
        <MetaItem label="Created" value={meta.created || '—'} />
        <MetaItem label="Updated" value={meta.updated || '—'} />
        {meta.url_live && <MetaItem label="Live" value={meta.url_live} link />}
        {meta.url_repo && <MetaItem label="Repo" value={meta.url_repo} link />}
      </div>

      {/* Tags */}
      {meta.tags && meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-xs font-mono border bg-surface border-border text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Sections */}
      {sections && Object.entries(sections).map(([key, content]) => (
        content ? (
          <div key={key} style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginTop: '2rem' }}>
            <h2 className="text-xl font-bold text-text mb-4">{key}</h2>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
            />
          </div>
        ) : null
      ))}

      {/* Project files */}
      {project_files && Object.keys(project_files).some(k => project_files[k]?.length > 0) && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginTop: '2rem' }}>
          <h2 className="text-xl font-bold text-text mb-2">Project Files</h2>
          {Object.entries(project_files).map(([dir, files]) => (
            <FileSection key={dir} name={dir} files={files} />
          ))}
        </div>
      )}
    </div>
  );
}

function MetaItem({ label, value, valueStyle, link }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-3">
      <div
        className="text-xs text-muted mb-1"
        style={{ fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.05em', textTransform: 'uppercase' }}
      >
        {label}
      </div>
      {link ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-accent hover:text-accent-h truncate block"
        >
          {value}
        </a>
      ) : (
        <div className="text-sm font-semibold text-text" style={valueStyle}>{value}</div>
      )}
    </div>
  );
}
