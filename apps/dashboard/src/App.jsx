import { useState, useCallback, Component } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import useProjects from './hooks/useProjects';
import usePending from './hooks/usePending';
import useBrief from './hooks/useBrief';
import useIsMobile from './hooks/useIsMobile';
import Nav from './components/Nav';
import Sidebar from './components/Sidebar';
import GraphView from './components/GraphView';
import ProjectDetail from './components/ProjectDetail';
import HomeView from './views/HomeView';
import BriefView from './views/BriefView';
import PortfolioView from './views/PortfolioView';
import MetricsView from './views/MetricsView';
import PendingView from './views/PendingView';
import Timeline from './components/Timeline';
import QuestBoardView from './views/QuestBoardView';
import QuestDetailView from './views/QuestDetailView';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, color: 'var(--text)', fontFamily: 'monospace', fontSize: 13 }}>
          <div style={{ color: '#f87171', fontWeight: 700, marginBottom: 8 }}>App kraschade</div>
          <pre style={{ whiteSpace: 'pre-wrap', color: 'var(--muted)' }}>{String(this.state.error)}</pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 16, padding: '6px 16px', borderRadius: 4, cursor: 'pointer', background: 'var(--accent)', color: '#fff', border: 'none' }}
          >
            Ladda om
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppShell() {
  const { projects, loading, error } = useProjects();
  const { pending, loading: pendingLoading, error: pendingError, refresh: refreshPending } = usePending();
  const { brief, loading: briefLoading, error: briefError, refresh: refreshBrief, generatedAt: briefGeneratedAt } = useBrief();
  const [showGraph, setShowGraph] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleGraphNavigate = useCallback((slug) => {
    navigate('/project/' + slug);
    setShowGraph(false);
  }, [navigate]);

  const navItems = [
    { path: '/', label: 'Hem', icon: '⌂' },
    { path: '/brief', label: 'Brief', icon: '◈' },
    { path: '/quests', label: 'Quests', icon: '⚡' },
    { path: '/portfolio', label: 'Portfolio', icon: '⊞' },
    { path: '/timeline', label: 'Tidslinje', icon: '◎' },
    { path: '/metrics', label: 'Metrics', icon: '▦' },
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
        <main style={{ flex: 1, overflow: 'auto', minWidth: 0, paddingBottom: isMobile ? 70 : 0 }}>
          <Routes>
            <Route
              path="/"
              element={
                <HomeView
                  brief={brief}
                  loading={briefLoading}
                  error={briefError}
                  refresh={refreshBrief}
                  generatedAt={briefGeneratedAt}
                  projects={projects}
                />
              }
            />
            <Route
              path="/brief"
              element={
                <BriefView
                  brief={brief}
                  loading={briefLoading}
                  error={briefError}
                  refresh={refreshBrief}
                  generatedAt={briefGeneratedAt}
                  pending={pending}
                  pendingLoading={pendingLoading}
                  projects={projects}
                  refreshPending={refreshPending}
                  refreshAnalyze={refreshPending}
                />
              }
            />
            <Route
              path="/portfolio"
              element={<PortfolioView projects={projects} loading={loading} error={error} />}
            />
            <Route
              path="/metrics"
              element={<MetricsView projects={projects} />}
            />
            <Route path="/analyze" element={<Navigate to="/portfolio" replace />} />
            {/* #/pending kept for backwards-compat, redirects to #/portfolio */}
            <Route path="/pending" element={<PendingView />} />
            <Route path="/activity" element={<Navigate to="/timeline" replace />} />
            <Route path="/timeline" element={<Timeline projects={projects} />} />
            <Route path="/quests" element={<QuestBoardView projects={projects} />} />
            <Route path="/quest/:questId" element={<QuestDetailView projects={projects} />} />
            <Route path="/project/:slug" element={<ProjectDetail projects={projects} />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
        <AppShell />
      </ErrorBoundary>
    </HashRouter>
  );
}
