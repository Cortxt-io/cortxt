import { Link } from 'react-router-dom';

export default function BrandFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '2.5rem 0', marginTop: '2rem' }}>
      <div className="cx-container" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 800, color: 'var(--text-bright)' }}>cortxt<span style={{ color: 'var(--accent)' }}>.</span></div>
          <p className="cx-muted" style={{ fontSize: '0.85rem', maxWidth: 320, marginTop: '0.5rem' }}>
            Plattform för beslut & lärande med AI och strukturerade modeller.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '3rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <strong style={{ color: 'var(--text-bright)' }}>Cortxt</strong>
            <Link to="/academy">Kurser</Link>
            <Link to="/metod">Metod</Link>
            <a href="https://app.cortxt.io">App</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <strong style={{ color: 'var(--text-bright)' }}>Vertikaler</strong>
            <a href="https://juvahem.se">Juvahem</a>
            <a href="https://orgkomp.com">Orgkomp</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
