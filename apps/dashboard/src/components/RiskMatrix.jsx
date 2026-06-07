import { useState } from 'react';

const COLORS = {
  low: '#22c55e',      // 1-5
  medium: '#eab308',   // 6-12
  high: '#ef4444',     // 13-25
};

function riskColor(score) {
  if (score <= 5) return COLORS.low;
  if (score <= 12) return COLORS.medium;
  return COLORS.high;
}

export default function RiskMatrix({ risks = [] }) {
  const [selected, setSelected] = useState(null);

  // Filter to only new-format risks (with probability + impact)
  const matrixRisks = risks.filter(r => r.probability && r.impact);
  const legacyRisks = risks.filter(r => !r.probability || !r.impact);

  if (!risks.length) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#e5e7eb' }}>
        Risk Assessment
      </h4>

      {matrixRisks.length > 0 && (
        <div style={{ position: 'relative', marginBottom: 12 }}>
          {/* Matrix grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '24px repeat(5, 48px)',
            gridTemplateRows: 'repeat(5, 32px) 24px',
            gap: 2,
            alignItems: 'center',
            justifyItems: 'center',
          }}>
            {/* Y-axis label */}
            <div style={{
              gridColumn: 1, gridRow: '1 / 6',
              writingMode: 'vertical-rl', textOrientation: 'mixed',
              fontSize: 10, color: '#9ca3af', transform: 'rotate(180deg)',
            }}>
              Probability
            </div>

            {/* Grid cells with risk dots */}
            {Array.from({ length: 5 }, (_, probIdx) => {
              const prob = 5 - probIdx; // Y-axis: 5 at top, 1 at bottom
              return Array.from({ length: 5 }, (_, impIdx) => {
                const imp = impIdx + 1; // X-axis: 1 to 5
                const score = prob * imp;
                const risksHere = matrixRisks.filter(
                  r => r.probability === prob && r.impact === imp
                );
                return (
                  <div
                    key={`${prob}-${imp}`}
                    style={{
                      gridColumn: impIdx + 2,
                      gridRow: probIdx + 1,
                      width: 44, height: 28,
                      borderRadius: 4,
                      backgroundColor: `${riskColor(score)}15`,
                      border: `1px solid ${riskColor(score)}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: risksHere.length ? 'pointer' : 'default',
                      position: 'relative',
                    }}
                    onClick={() => risksHere.length && setSelected(
                      selected && selected[0] === prob && selected[1] === imp
                        ? null : [prob, imp]
                    )}
                  >
                    {risksHere.length > 0 && (
                      <div style={{
                        width: 8 + risksHere.length * 4,
                        height: 8 + risksHere.length * 4,
                        borderRadius: '50%',
                        backgroundColor: riskColor(score),
                        maxWidth: 20, maxHeight: 20,
                      }} title={risksHere.map(r => r.description).join('; ')} />
                    )}
                  </div>
                );
              });
            })}

            {/* X-axis labels */}
            <div style={{ gridColumn: '2 / 7', gridRow: 6, fontSize: 10, color: '#9ca3af', textAlign: 'center' }}>
              Impact
            </div>
            {[1,2,3,4,5].map(imp => (
              <div key={imp} style={{
                gridColumn: imp + 1, gridRow: 6,
                fontSize: 9, color: '#6b7280',
              }}>
                {imp}
              </div>
            ))}
            {/* Y-axis numbers */}
            {[5,4,3,2,1].map((prob, idx) => (
              <div key={prob} style={{
                gridColumn: 1, gridRow: idx + 1,
                fontSize: 9, color: '#6b7280', width: 16, textAlign: 'right',
              }}>
                {prob}
              </div>
            ))}
          </div>

          {/* Selected risk detail */}
          {selected && (
            <div style={{
              marginTop: 8, padding: 8, borderRadius: 6,
              backgroundColor: '#1e293b', border: '1px solid #334155',
            }}>
              {matrixRisks
                .filter(r => r.probability === selected[0] && r.impact === selected[1])
                .map((r, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#e5e7eb', marginBottom: 4 }}>
                    <span style={{
                      color: riskColor(r.score),
                      fontWeight: 600,
                    }}>
                      {r.category}
                    </span>
                    {' '}(P{r.probability} x I{r.impact} = {r.score}/25){' '}
                    {r.description}
                    {r.mitigation && (
                      <span style={{ color: '#9ca3af' }}> Mitigation: {r.mitigation}</span>
                    )}
                  </div>
                ))
              }
            </div>
          )}

          {/* Legend */}
          <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 10 }}>
            <span style={{ color: COLORS.low }}>Low (1-5)</span>
            <span style={{ color: COLORS.medium }}>Medium (6-12)</span>
            <span style={{ color: COLORS.high }}>High (13-25)</span>
          </div>
        </div>
      )}

      {/* Legacy risks as simple list */}
      {legacyRisks.length > 0 && (
        <div style={{ marginTop: matrixRisks.length > 0 ? 8 : 0 }}>
          {matrixRisks.length > 0 && (
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>
              Legacy format:
            </div>
          )}
          {legacyRisks.map((r, i) => (
            <div key={i} style={{ fontSize: 12, color: '#d1d5db', marginBottom: 2 }}>
              <span style={{ fontWeight: 600, color: '#f59e0b' }}>{r.category}</span>
              {' '}(score {r.score}/5) {r.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}