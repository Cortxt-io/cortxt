import { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import useProjects from './hooks/useProjects';
import usePending from './hooks/usePending';
import useAnalyzeList from './hooks/useAnalyzeList';
import Nav from './components/Nav';
import Sidebar from './components/Sidebar';
import GraphView from './components/GraphView';
import ProjectDetail from './components/ProjectDetail';
import PortfolioView from './views/PortfolioView';
import MetricsView from './views/MetricsView';
import PendingView from './views/PendingView';
import ActivityView from './views/ActivityView';
import AnalyzeView from './views/AnalyzeView';

function AppShell() {
  const { projects, loading, error } = useProjects();
  const { pending, loading: pendingLoading, error: pendingError, refresh: refreshPending } = usePending();
  const { projects: analyzeProjects, loading: analyzeLoading, refresh: refreshAnalyze } = useAnalyzeList();
  const [showGraph, setShowGraph] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleGraphNavigate = useCallback((slug) => {
    navigate('/project/' + slug);
    setShowGraph(false);
  }, [navigate]);

  const navItems = [
    { path: '/', label: 'Portfolio', icon: '⊞' },
    { path: '/metrics', label: 'Metrics', icon: '▦' },
    { path: '/analyze', label: 'AI / Analysera', icon: '⚡', badge: pending.length },
    { path: '/activity', label: 'Activity', icon: '◎' },
  ];

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

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        <Sidebar navItems={navItems} currentPath={location.pathname} />
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Routes>
            <Route
              path="/"
              element={<PortfolioView projects={projects} loading={loading} error={error} />}
            />
            <Route
              path="/metrics"
              element={<MetricsView projects={projects} />}
            />
            <Route
              path="/analyze"
              element={
                <AnalyzeView
                  analyzeProjects={analyzeProjects}
                  analyzeLoading={analyzeLoading}
                  refreshAnalyze={refreshAnalyze}
                  pending={pending}
                  pendingLoading={pendingLoading}
                  refreshPending={refreshPending}
                  projects={projects}
                />
              }
            />
            {/* #/pending kept for backwards-compat, redirects to #/analyze */}
            <Route path="/pending" element={<PendingView />} />
            <Route path="/activity" element={<ActivityView />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />
          </Routes>
        </main>
      </div>
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
