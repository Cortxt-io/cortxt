import { useState, useMemo } from 'react';
import ProjectCard from '../components/ProjectCard';
import { getStatusColor, getFamilyColor, getLayerColor, getKindHexColor } from '../data/labels';

function roiColor(value) {
  if (value >= 250) return 'var(--success)';
  if (value > 0) return '#f59e0b';
  return 'var(--muted)';
}

function formatSEK(n) {
  if (n == null) return '—';
  return n.toLocaleString('sv-SE') + ' kr';
}

export default function PortfolioView({ projects, loading, error }) {
  const [selectedStatuses, setSelectedStatuses] = useState(new Set());
  const [selectedFamilies, setSelectedFamilies] = useState(new Set());
  const [selectedLayers, setSelectedLayers] = useState(new Set());
  const [selectedPipelines, setSelectedPipelines] = useState(new Set());
  const [selectedKinds, setSelectedKinds] = useState(new Set());
  const [sortBy, setSortBy] = useState('updated');

  const uniqueStatuses = useMemo(
    () => [...new Set(projects.map((p) => p.status))].sort(),
    [projects]
  );
  const uniqueFamilies = useMemo(
    () => [...new Set(projects.map((p) => p.family))].sort(),
    [projects]
  );
  const uniqueLayers = useMemo(
    () => [...new Set(projects.filter((p) => p.layer).map((p) => p.layer))].sort(),
    [projects]
  );
  const uniquePipelines = useMemo(
    () => [...new Set(projects.filter((p) => p.pipeline).map((p) => p.pipeline))].sort(),
    [projects]
  );
  const uniqueKinds = useMemo(
    () => [...new Set(projects.filter((p) => p.kind).map((p) => p.kind))].sort(),
    [projects]
  );

  const filtered = useMemo(() => {
    const result = projects.filter((p) => {
      const statusOk = selectedStatuses.size === 0 || selectedStatuses.has(p.status);
      const familyOk = selectedFamilies.size === 0 || selectedFamilies.has(p.family);
      const layerOk = selectedLayers.size === 0 || selectedLayers.has(p.layer);
      const pipelineOk = selectedPipelines.size === 0 || selectedPipelines.has(p.pipeline);
      const kindOk = selectedKinds.size === 0 || selectedKinds.has(p.kind);
      return statusOk && familyOk && layerOk && pipelineOk && kindOk;
    });

    const sorters = {
      updated: (a, b) => (b.updated || '').localeCompare(a.updated || ''),
      roi: (a, b) => (b.roi_percent ?? 0) - (a.roi_percent ?? 0),
      title: (a, b) => a.title.localeCompare(b.title, 'sv'),
      status: (a, b) => (a.status || '').localeCompare(b.status || ''),
      kind: (a, b) => (a.kind || '').localeCompare(b.kind || ''),
    };

    return sorters[sortBy] ? result.sort(sorters[sortBy]) : result;
  }, [projects, selectedStatuses, selectedFamilies, selectedLayers, selectedPipelines, selectedKinds, sortBy]);

  function toggleFilter(setter, current, value) {
    const next = new Set(current);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

  // Summary metrics
  const totalCost = projects.reduce((sum, p) => sum + (p.cost_sek || 0), 0);
  const totalValue = projects.reduce((sum, p) => sum + (p.value_sek || 0), 0);
  const withRoi = projects.filter((p) => p.roi_percent > 0);
  const avgRoi = withRoi.length
    ? Math.round(withRoi.reduce((s, p) => s + p.roi_percent, 0) / withRoi.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <p className="text-muted animate-pulse font-mono text-sm">Loading projects…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <p className="text-rose-400 text-sm">Error loading projects: {error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <p className="text-muted text-sm">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* Summary row */}
      <div className="grid-4-cols" style={{ marginBottom: '2rem' }}>
        <SummaryCard label="Noder" value={projects.length} />
        <SummaryCard label="Kostnad" value={formatSEK(totalCost)} />
        <SummaryCard label="Värde" value={formatSEK(totalValue)} />
        <SummaryCard
          label="Snitt ROI"
          value={`${avgRoi}%`}
          valueStyle={{ color: roiColor(avgRoi) }}
        />
      </div>

      {/* Sort + Filter panel */}
      <div style={{ marginBottom: '2rem' }}>
        {/* Sort dropdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.75rem',
              color: 'var(--muted)',
            }}
          >
            Sortera
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '0.4rem 0.8rem',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.75rem',
            }}
          >
            <option value="updated">Senast uppdaterad</option>
            <option value="roi">ROI (högst först)</option>
            <option value="title">Titel (A–Ö)</option>
            <option value="status">Status</option>
            <option value="kind">Kind</option>
          </select>
        </div>

        {/* Status chips */}
        {uniqueStatuses.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="text-xs text-muted font-mono"
              style={{ marginRight: '0.25rem' }}
            >
              Status
            </span>
            {uniqueStatuses.map((s) => {
              const color = getStatusColor(s);
              const active = selectedStatuses.has(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleFilter(setSelectedStatuses, selectedStatuses, s)}
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border transition-all ${active
                    ? `${color.bg} ${color.text} ${color.border}`
                    : 'bg-transparent text-muted border-border hover:border-muted'
                  }`}
                >
                  {s.replace(/_/g, ' ')}
                </button>
              );
            })}
            {selectedStatuses.size > 0 && (
              <button
                onClick={() => setSelectedStatuses(new Set())}
                className="text-xs text-muted hover:text-text ml-1"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Family chips */}
        {uniqueFamilies.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-xs text-muted font-mono"
              style={{ marginRight: '0.25rem' }}
            >
              Family
            </span>
            {uniqueFamilies.map((f) => {
              const color = getFamilyColor(f);
              const active = selectedFamilies.has(f);
              return (
                <button
                  key={f}
                  onClick={() => toggleFilter(setSelectedFamilies, selectedFamilies, f)}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border transition-all"
                  style={{
                    background: active ? `${color}15` : 'transparent',
                    color: active ? color : 'var(--muted)',
                    borderLeft: active ? `3px solid ${color}` : '1px solid var(--border)',
                    borderRight: active ? '1px solid var(--border)' : undefined,
                    borderTop: active ? '1px solid var(--border)' : undefined,
                    borderBottom: active ? '1px solid var(--border)' : undefined,
                    cursor: 'pointer',
                  }}
                >
                  {f.replace(/-/g, ' ')}
                </button>
              );
            })}
            {selectedFamilies.size > 0 && (
              <button
                onClick={() => setSelectedFamilies(new Set())}
                className="text-xs text-muted hover:text-text ml-1"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Layer chips */}
        {uniqueLayers.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="text-xs text-muted font-mono"
              style={{ marginRight: '0.25rem' }}
            >
              Layer
            </span>
            {uniqueLayers.map((l) => {
              const color = getLayerColor(l);
              const active = selectedLayers.has(l);
              return (
                <button
                  key={l}
                  onClick={() => toggleFilter(setSelectedLayers, selectedLayers, l)}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border transition-all"
                  style={{
                    background: active ? `${color}15` : 'transparent',
                    color: active ? color : 'var(--muted)',
                    borderLeft: active ? `3px solid ${color}` : '1px solid var(--border)',
                    borderRight: active ? '1px solid var(--border)' : undefined,
                    borderTop: active ? '1px solid var(--border)' : undefined,
                    borderBottom: active ? '1px solid var(--border)' : undefined,
                    cursor: 'pointer',
                  }}
                >
                  {l.replace(/-/g, ' ')}
                </button>
              );
            })}
            {selectedLayers.size > 0 && (
              <button
                onClick={() => setSelectedLayers(new Set())}
                className="text-xs text-muted hover:text-text ml-1"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Pipeline chips */}
        {uniquePipelines.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-xs text-muted font-mono"
              style={{ marginRight: '0.25rem' }}
            >
              Pipeline
            </span>
            {uniquePipelines.map((p) => {
              const color = getLayerColor('pipeline');
              const active = selectedPipelines.has(p);
              return (
                <button
                  key={p}
                  onClick={() => toggleFilter(setSelectedPipelines, selectedPipelines, p)}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border transition-all"
                  style={{
                    background: active ? `${color}15` : 'transparent',
                    color: active ? color : 'var(--muted)',
                    borderLeft: active ? `3px solid ${color}` : '1px solid var(--border)',
                    borderRight: active ? '1px solid var(--border)' : undefined,
                    borderTop: active ? '1px solid var(--border)' : undefined,
                    borderBottom: active ? '1px solid var(--border)' : undefined,
                    cursor: 'pointer',
                  }}
                >
                  {p.replace(/pipeline-/g, '').replace(/-/g, ' ')}
                </button>
              );
            })}
            {selectedPipelines.size > 0 && (
              <button
                onClick={() => setSelectedPipelines(new Set())}
                className="text-xs text-muted hover:text-text ml-1"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Kind chips */}
        {uniqueKinds.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="text-xs text-muted font-mono"
              style={{ marginRight: '0.25rem' }}
            >
              Kind
            </span>
            {uniqueKinds.map((k) => {
              const color = getKindHexColor(k);
              const active = selectedKinds.has(k);
              return (
                <button
                  key={k}
                  onClick={() => toggleFilter(setSelectedKinds, selectedKinds, k)}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border transition-all"
                  style={{
                    background: active ? `${color}15` : 'transparent',
                    color: active ? color : 'var(--muted)',
                    borderLeft: active ? `3px solid ${color}` : '1px solid var(--border)',
                    borderRight: active ? '1px solid var(--border)' : undefined,
                    borderTop: active ? '1px solid var(--border)' : undefined,
                    borderBottom: active ? '1px solid var(--border)' : undefined,
                    cursor: 'pointer',
                  }}
                >
                  {k}
                </button>
              );
            })}
            {selectedKinds.size > 0 && (
              <button
                onClick={() => setSelectedKinds(new Set())}
                className="text-xs text-muted hover:text-text ml-1"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Card grid */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
      >
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {filtered.length === 0 && projects.length > 0 && (
        <p className="text-muted text-sm text-center" style={{ marginTop: '3rem' }}>
          No projects match the selected filters.
        </p>
      )}
    </div>
  );
}

function SummaryCard({ label, value, valueStyle }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '1rem',
      }}
    >
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.7rem',
          color: 'var(--muted)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: '0.4rem',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--text)',
          ...valueStyle,
        }}
      >
        {value}
      </div>
    </div>
  );
}