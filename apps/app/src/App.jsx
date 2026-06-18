import { Routes, Route } from 'react-router-dom';
import { Topbar } from './components/Topbar.jsx';
import Overview from './pages/Overview.jsx';
import Tools from './pages/Tools.jsx';
import Portfolio from './pages/Portfolio.jsx';
import DecisionModel from './pages/DecisionModel.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Topbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/portfolj" element={<Portfolio />} />
          <Route path="/verktyg" element={<Tools />} />
          <Route path="/modell/:slug" element={<DecisionModel />} />
        </Routes>
      </main>
    </div>
  );
}
