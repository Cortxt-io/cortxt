import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import useProject from '../hooks/useProject';
import useActionState from '../hooks/useActionState';
import ActionButton from '../components/ActionButton';
import StatusBadge from './StatusBadge';
import FamilyBadge from './FamilyBadge';
import LayerBadge from './LayerBadge';
import KindBadge from './KindBadge';
import NodeRelationsList from './NodeRelationsList';
import QuestSection from './QuestSection';
import { getStageLabel, getNodeStageLabel, getNodeStageColor, STATUS_LABELS, STAGE_LABELS, getLayerLabel, getPipelineLabel } from '../data/labels';
import {
  updateProject,
  analyzeProject,
  approveProject,
  rejectProject,
} from '../lib/api';

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

// ─── File section (unchanged) ──────────────────────────────────────────────

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

// ─── ProjectPendingSection (embedded, takes single pending object) ────────

function formatFieldValue(value) {
  if (value === null || value === undefined) return '(null)';
  if (Array.isArray(value)) return `${value.length} risker`;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function formatDiffValue(value) {
  if (value === null || value === undefined) return '(null)';
  if (Array.isArray(value)) return `${value.length} risker`;
  if (typeof value === 'object') return JSON.stringify(value);
  const str = String(value);
  return str.length > 100 ? str.slice(0, 100) + '…' : str;
}

function ProjectPendingSection({ pending, meta, slug, refresh }) {
  const { set, get } = useActionState();

  async function handleAnalyze() {
    set('analyze', 'loading', null);
    try {
      await analyzeProject(slug);
      set('analyze', 'done', null);
      refresh();
      setTimeout(() => set('analyze', 'idle', null), 2000);
    } catch (err) {
      set('analyze', 'error', err.message);
    }
  }

  async function handleApprove() {
    set('approve', 'loading', null);
    try {
      await approveProject(slug);
      set('approve', 'done', null);
      refresh();
      setTimeout(() => set('approve', 'idle', null), 2000);
    } catch (err) {
      set('approve', 'error', err.message);
    }
  }

  async function handleReject() {
    set('reject', 'loading', null);
    try {
      await rejectProject(slug);
      set('reject', 'done', null);
      refresh();
      setTimeout(() => set('reject', 'idle', null), 2000);
    } catch (err) {
      set('reject', 'error', err.message);
    }
  }

  const hasPending = pending && pending.suggestions && Object.keys(pending.suggestions).length > 0;
  const suggestionCount = hasPending ? Object.keys(pending.suggestions).length : 0;
  const analyzedAt = pending?.analyzed_at
    ? new Date(pending.analyzed_at).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' })
    : '—';

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)' }}>
          AI-FÖRSLAG {hasPending ? `(${suggestionCount})` : ''}
        </div>
        <ActionButton
          label="Analysera →"
          loadingLabel="Analyserar…"
          onClick={handleAnalyze}
          btnState={get('analyze')}
          variant="accent"
        />
      </div>

      {hasPending && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>
            Analyserad {analyzedAt} · {suggestionCount} förslag
          </div>

          {pending.overall && (
            <div style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 6,
              padding: '8px 12px',
              fontSize: 12,
              color: 'var(--text)',
              lineHeight: 1.6,
            }}>
              {pending.overall}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(pending.suggestions).map(([field, proposedValue]) => {
              if (field === 'updated_at') return null;
              const currentValue = meta?.[field];
              const hasCurrent = currentValue !== undefined && currentValue !== null;
              return (
                <div
                  key={field}
                  style={{
                    background: 'var(--bg)',
                    borderRadius: 4,
                    padding: '6px 10px',
                    fontSize: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>{field}</span>
                    {hasCurrent && (
                      <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', textDecoration: 'line-through' }}>
                        {formatFieldValue(currentValue)}
                      </span>
                    )}
                    <span style={{ color: 'var(--muted)', fontSize: 10 }}>→</span>
                    <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono, monospace)', wordBreak: 'break-word' }}>
                      {formatDiffValue(proposedValue)}
                    </span>
                  </div>
                  {pending.reasoning?.[field] && (
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic', marginTop: 2 }}>
                      {pending.reasoning[field]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <ActionButton
              label="✓ Godkänn"
              loadingLabel="Godkänner…"
              onClick={handleApprove}
              btnState={get('approve')}
              variant="success"
            />
            <ActionButton
              label="✕ Avvisa"
              loadingLabel="Avvisar…"
              onClick={handleReject}
              btnState={get('reject')}
              variant="danger"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { project, loading, error, refresh } = useProject(slug);
  const { set, get } = useActionState();

  const [status, setStatus] = useState('');
  const [mvpStage, setMvpStage] = useState('');
  const [currentSlice, setCurrentSlice] = useState('');

  useEffect(() => {
    if (project?.meta) {
      setStatus(project.meta.status || '');
      setMvpStage(project.meta.mvp_stage || '');
      setCurrentSlice(project.meta.current_slice || '');
    }
  }, [slug, project?.meta?.updated]);

  async function handleSave() {
    if (!project?.meta) return;
    const fields = {};
    if (status !== (project.meta.status || '')) fields.status = status;
    if (mvpStage !== (project.meta.mvp_stage || '')) fields.mvp_stage = mvpStage;
    if (currentSlice !== (project.meta.current_slice || '')) fields.current_slice = currentSlice;

    if (Object.keys(fields).length === 0) return;

    set('save', 'loading', null);
    try {
      await updateProject(slug, fields);
      set('save', 'done', null);
      refresh();
      setTimeout(() => set('save', 'idle', null), 2000);
    } catch (err) {
      set('save', 'error', err.message);
    }
  }

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

  const { meta, sections, project_files, pending } = project;

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

      {/* Header — kind-aware with fallback */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-3xl font-extrabold text-text" style={{ letterSpacing: '-0.03em' }}>
          {meta.title}
        </h1>
        {meta.kind ? (
          <KindBadge kind={meta.kind} />
        ) : (
          <>
            <StatusBadge status={meta.status} />
            <LayerBadge layer={meta.layer} />
            <FamilyBadge family={meta.family} />
          </>
        )}
        <span
          className="text-xs text-muted"
          style={{ fontFamily: '"JetBrains Mono", monospace', color: meta.kind ? getNodeStageColor(meta.stage) : undefined }}
        >
          {meta.kind ? getNodeStageLabel(meta.stage) : getStageLabel(meta.mvp_stage)}
        </span>
      </div>

      {/* Mini-brief */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 20,
          marginBottom: '2rem',
        }}
      >
        <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 12, fontFamily: 'var(--font-mono, monospace)' }}>
          PROJEKT-STATUS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', display: 'block', marginBottom: 4 }}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: 4,
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: 13,
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              {Object.keys(STATUS_LABELS).map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', display: 'block', marginBottom: 4 }}>MVP-steg</label>
            <select
              value={mvpStage}
              onChange={(e) => setMvpStage(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: 4,
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: 13,
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              {Object.keys(STAGE_LABELS).map((s) => (
                <option key={s} value={s}>{STAGE_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', display: 'block', marginBottom: 4 }}>Current slice</label>
            <textarea
              value={currentSlice}
              onChange={(e) => setCurrentSlice(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: 4,
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: 13,
                fontFamily: 'var(--font-mono, monospace)',
                resize: 'vertical',
              }}
            />
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <ActionButton
            label="Spara →"
            loadingLabel="Sparar…"
            onClick={handleSave}
            btnState={get('save')}
            variant="accent"
          />
        </div>
      </div>

      {/* Quest section */}
      <QuestSection slug={slug} projects={[]} />

      {/* Node relations (kind-aware) */}
      <NodeRelationsList partOf={meta.part_of} feeds={meta.feeds} dependsOn={meta.depends_on} />

      {/* Pending suggestions */}
      <ProjectPendingSection pending={pending} meta={meta} slug={slug} refresh={refresh} />

      {/* Meta grid */}
      <div
        className="grid gap-4 mb-8"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
      >
        <MetaItem label="ROI" value={`${meta.roi_percent ?? 0}%`} valueStyle={{ color: roiColor(meta.roi_percent) }} />
        <MetaItem label="Cost" value={formatSEK(meta.cost_sek)} />
        <MetaItem label="Value" value={formatSEK(meta.value_sek)} />
        {meta.kind && <MetaItem label="Kind" value={meta.kind} valueStyle={{ fontFamily: 'var(--font-mono, monospace)', color: getNodeStageColor(meta.stage) }} />}
        {meta.stage && <MetaItem label="Stage" value={meta.stage} valueStyle={{ fontFamily: 'var(--font-mono, monospace)', color: getNodeStageColor(meta.stage) }} />}
        {meta.part_of && <MetaItem label="Part of" value={meta.part_of} />}
        {meta.layer && <MetaItem label="Layer" value={getLayerLabel(meta.layer)} />}
        {meta.pipeline && <MetaItem label="Pipeline" value={getPipelineLabel(meta.pipeline)} />}
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