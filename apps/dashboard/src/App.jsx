import { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import useProjects from './hooks/useProjects';
import usePending from './hooks/usePending';
import Nav from './components/Nav';
import Sidebar from './components/Sidebar';
import GraphView from './components/GraphView';
import ProjectDetail from './components/ProjectDetail';
import PortfolioView from './views/PortfolioView';
import MetricsView from './views/MetricsView';
import PendingView from './views/PendingView';
import ActivityView from './views/ActivityView';

function AppShell() {
  const { projects, loading, error } = useProjects();
  const { pending, loading: pendingLoading, error: pendingError } = usePending();
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
    { path: '/pending', label: 'AI / Pending', icon: '⚡', badge: pending.length },
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
              path="/pending"
              element={
                <PendingView
                  projects={projects}
                  pending={pending}
                  pendingLoading={pendingLoading}
                  pendingError={pendingError}
                />
              }
            />
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
