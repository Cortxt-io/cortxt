import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Topbar } from './components/Topbar.jsx';
import Workspace from './pages/Workspace.jsx';
import Cockpit from './pages/Cockpit.jsx';
import Tools from './pages/Tools.jsx';

// Lazy — the per-project view pulls in reactflow + elkjs (~1.6MB); code-split so only
// /vertikal/:slug pays for it, keeping the main bundle (cockpit/workspace) lean.
const Vertical = lazy(() => import('./pages/Vertical.jsx'));

export default function App() {
  return (
    <div className="app-shell">
      <Topbar />
      <main className="app-main">
        <Suspense fallback={<p className="placeholder">Laddar…</p>}>
          <Routes>
            <Route path="/" element={<Workspace />} />
            <Route path="/cockpit" element={<Cockpit />} />
            <Route path="/vertikal/:slug" element={<Vertical />} />
            <Route path="/verktyg" element={<Tools />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
