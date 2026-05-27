import { useState, useCallback, useMemo } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import useProjects from './hooks/useProjects';
import Nav from './components/Nav';
import ProjectCard from './components/ProjectCard';
import ProjectDetail from './components/ProjectDetail';
import GraphView from './components/GraphView';
import { getStatusColor, getFamilyColor } from './data/labels';

function PortfolioView({ projects, loading, error }) {
  const [selectedStatuses, setSelectedStatuses] = useState(new Set());
  const [selectedFamilies, setSelectedFamilies] = useState(new Set());

  const uniqueStatuses = useMemo(
    () => [...new Set(projects.map((p) => p.status))].sort(),
    [projects]
  );
  const uniqueFamilies = useMemo(
    () => [...new Set(projects.map((p) => p.family))].sort(),
    [projects]
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const statusOk = selectedStatuses.size === 0 || selectedStatuses.has(p.status);
      const familyOk = selectedFamilies.size === 0 || selectedFamilies.has(p.family);
      return statusOk && familyOk;
    });
  }, [projects, selectedStatuses, selectedFamilies]);

  function toggleFilter(setter, current, value) {
    const next = new Set(current);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

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
      {/* Filter panel */}
      <div style={{ marginBottom: '2rem' }}>
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

function AppShell() {
  const { projects, loading, error } = useProjects();
  const [showGraph, setShowGraph] = useState(false);
  const navigate = useNavigate();

  const handleGraphNavigate = useCallback((slug) => {
    navigate('/project/' + slug);
    setShowGraph(false);
  }, [navigate]);

  return (
    <>
      <Nav onToggleGraph={() => setShowGraph((v) => !v)} graphOpen={showGraph} />

      {showGraph && (
        <GraphView
          projects={projects}
          onClose={() => setShowGraph(false)}
          onNavigate={handleGraphNavigate}
        />
      )}

      <main style={{ paddingTop: '1rem', minHeight: 'calc(100vh - 60px)' }}>
        <Routes>
          <Route
            path="/"
            element={<PortfolioView projects={projects} loading={loading} error={error} />}
          />
          <Route path="/project/:slug" element={<ProjectDetail />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  );
}
