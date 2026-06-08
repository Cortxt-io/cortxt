import { useState, useEffect, Component } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from './components/ToastProvider';
import useProjects from './hooks/useProjects';
import usePending from './hooks/usePending';
import useBrief from './hooks/useBrief';
import useQuests from './hooks/useQuests';
import useKeyboard from './hooks/useKeyboard';
import ActivityBar from './components/ActivityBar';
import BottomPanel from './components/BottomPanel';
import StatusBar from './components/StatusBar';
import GraphCanvas from './components/GraphCanvas';
import DetailPanel from './components/DetailPanel';
import CommandPalette from './components/CommandPalette';
import Breadcrumb from './components/Breadcrumb';
import HomeView from './views/HomeView';
import QuestBoardView from './views/QuestBoardView';

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
  const { quests } = useQuests();

  const [activeMode, setActiveMode] = useState('graph');
  const [selectedProject, setSelectedProject] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [hasNewEvents, setHasNewEvents] = useState(false);

  useEffect(() => {
    if (hasNewEvents) {
      const timer = setTimeout(() => setHasNewEvents(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [hasNewEvents]);

  useKeyboard({
    onModeChange: setActiveMode,
    onClosePanel: () => setSelectedProject(null),
    onOpenPalette: () => setPaletteOpen(true),
    onClosePalette: () => setPaletteOpen(false),
    paletteOpen,
  });

  return (
    <>
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        projects={projects}
        onSelectProject={(p) => { setSelectedProject(p); setActiveMode('graph'); }}
        onChangeMode={setActiveMode}
      />
      <div className="ide-shell">
        <ActivityBar activeMode={activeMode} onModeChange={setActiveMode} questCount={quests.length} />
        <div className="main-area">
          <Breadcrumb
            activeMode={activeMode}
            selectedProject={selectedProject}
            onDeselectProject={() => setSelectedProject(null)}
          />
          <div className="main-content-row">
            <div className="main-content">
              {activeMode === 'graph' && <GraphCanvas projects={projects} loading={loading} error={error} onSelectNode={setSelectedProject} selectedProject={selectedProject} />}
              {activeMode === 'quests' && <QuestBoardView projects={projects} />}
              {activeMode === 'overview' && <HomeView brief={brief} loading={briefLoading} error={briefError} refresh={refreshBrief} generatedAt={briefGeneratedAt} projects={projects} />}
            </div>
            {selectedProject && activeMode === 'graph' && (
              <DetailPanel project={selectedProject} onClose={() => setSelectedProject(null)} />
            )}
          </div>
          <BottomPanel projects={projects} brief={brief} briefLoading={briefLoading} onNewEvents={() => setHasNewEvents(true)} />
        </div>
        <StatusBar projectCount={projects.length} questCount={quests.length} hasNewEvents={hasNewEvents} />
      </div>
    </>
  );
}

export default function App() {
  return (
    <MemoryRouter>
      <ToastProvider>
        <ErrorBoundary>
          <AppShell />
        </ErrorBoundary>
      </ToastProvider>
    </MemoryRouter>
  );
}
