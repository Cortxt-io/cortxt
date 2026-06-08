import { getStatusLabel, getStatusHexColor } from '../data/labels';

function roiColorHex(value) {
  if (value >= 250) return '#10b981';
  if (value > 0) return '#f59e0b';
  return '#64748b';
}

function roiColor(value) {
  if (value >= 250) return 'var(--success)';
  if (value > 0) return '#f59e0b';
  return 'var(--muted)';
}

function formatSEK(n) {
  if (n == null) return '—';
  return n.toLocaleString('sv-SE') + ' kr';
}

export default function MetricsView({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <p className="text-muted text-sm">No projects data available.</p>
      </div>
    );
  }

  // ROI per project — sorted descending
  const roiSorted = [...projects]
    .filter((p) => p.roi_percent != null)
    .sort((a, b) => (b.roi_percent ?? 0) - (a.roi_percent ?? 0));
  const maxRoi = roiSorted.length > 0 ? roiSorted[0].roi_percent : 1;

  // Status distribution
  const statusCounts = {};
  projects.forEach((p) => {
    const s = p.status || 'unknown';
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });
  const statusEntries = Object.entries(statusCounts).sort((a, b) => b[1] - a[1]);
  const maxStatusCount = statusEntries.length > 0 ? statusEntries[0][1] : 1;

  // Cost vs Value — sorted by ROI descending
  const costValueSorted = [...projects]
    .sort((a, b) => (b.roi_percent ?? 0) - (a.roi_percent ?? 0));

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* Section 1: ROI per project */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="text-xl font-bold text-text mb-4">ROI per projekt</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {roiSorted.map((p) => {
            const width = maxRoi > 0 ? Math.max((p.roi_percent / maxRoi) * 100, 1) : 0;
            const color = roiColorHex(p.roi_percent);
            return (
              <div key={p.slug} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="roi-label">
                  {p.title}
                </span>
                <div style={{ flex: 1, position: 'relative' }}>
                  <div
                    style={{
                      width: `${width}%`,
                      height: 24,
                      borderRadius: 4,
                      background: color,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.75rem',
                    color: roiColor(p.roi_percent),
                    minWidth: 50,
                    textAlign: 'right',
                  }}
                >
                  {p.roi_percent ?? 0}%
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Status distribution */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="text-xl font-bold text-text mb-4">Statusfördelning</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {statusEntries.map(([status, count]) => {
            const pct = Math.round((count / projects.length) * 100);
            const barWidth = (count / maxStatusCount) * 100;
            return (
              <div key={status}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.3rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.8rem',
                      color: getStatusHexColor(status),
                    }}
                  >
                    {getStatusLabel(status)}
                  </span>
                  <span
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.75rem',
                      color: 'var(--muted)',
                    }}
                  >
                    {count} ({pct}%)
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: 8,
                    borderRadius: 4,
                    background: 'var(--border)',
                  }}
                >
                  <div
                    style={{
                      width: `${barWidth}%`,
                      height: 8,
                      borderRadius: 4,
                      background: getStatusHexColor(status),
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Cost vs Value table */}
      <section>
        <h2 className="text-xl font-bold text-text mb-4">Kostnad vs Värde</h2>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.85rem',
            }}
          >
            <thead>
              <tr>
                {['Nod', 'Kostnad', 'Värde', 'ROI'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem',
                      borderBottom: '1px solid var(--border)',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--muted)',
                      background: 'var(--surface)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {costValueSorted.map((p) => (
                <tr key={p.slug}>
                  <td
                    style={{
                      padding: '0.75rem',
                      borderBottom: '1px solid var(--border)',
                      color: 'var(--text)',
                    }}
                  >
                    {p.title}
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      borderBottom: '1px solid var(--border)',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.8rem',
                      color: 'var(--muted)',
                    }}
                  >
                    {formatSEK(p.cost_sek)}
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      borderBottom: '1px solid var(--border)',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.8rem',
                      color: 'var(--muted)',
                    }}
                  >
                    {formatSEK(p.value_sek)}
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      borderBottom: '1px solid var(--border)',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.8rem',
                      color: roiColor(p.roi_percent),
                    }}
                  >
                    {p.roi_percent ?? 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
