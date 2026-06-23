import { Routes, Route } from 'react-router-dom';
import { Topbar } from './components/Topbar.jsx';
import Workspace from './pages/Workspace.jsx';
import Cockpit from './pages/Cockpit.jsx';
import Vertical from './pages/Vertical.jsx';
import Tools from './pages/Tools.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Topbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Workspace />} />
          <Route path="/cockpit" element={<Cockpit />} />
          <Route path="/vertikal/:slug" element={<Vertical />} />
          <Route path="/verktyg" element={<Tools />} />
        </Routes>
      </main>
    </div>
  );
}
