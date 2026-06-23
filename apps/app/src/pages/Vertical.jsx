import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Section, Eyebrow, H1, H3, Lead, Card } from '@cortxt/ui';
import { fetchVertical } from '../lib/cns.js';

/* Per-projekt-vy — ombyggnadens ritning för en vertikal: receptets faser (klar/aktiv/kvar),
 * nyckel-epics per fas, och de öppna besluten. Strategiska lagret (CNS); granulära stories
 * bor i GitHub-repot senare. */

const PHASE_STATUS = {
  done: { label: 'Klar', cls: 'drift--healthy' },
  active: { label: 'Aktiv', cls: 'drift--attention' },
  todo: { label: 'Kvar', cls: 'drift--unknown' },
};

export default function Vertical() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchVertical(slug)
      .then((d) => { if (!cancelled) { setData(d); setError(null); } })
      .catch((e) => { if (!cancelled) { setError(e.message); setData(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  const rm = data?.roadmap;
  const v = data?.vertical;

  return (
    <Section>
      <Container>
        <div className="page-head">
          <Eyebrow><Link to="/cockpit" className="vert-title">← Cockpit</Link></Eyebrow>
          <H1>{v?.title ?? slug}</H1>
          {v?.url_live && <Lead><a href={v.url_live} target="_blank" rel="noreferrer">{v.url_live} ↗</a></Lead>}
        </div>

        {loading && <p className="placeholder">Hämtar roadmap…</p>}
        {error && <p className="placeholder">Kunde inte hämta: {error}</p>}
        {!loading && !error && !rm && (
          <p className="placeholder">Ingen roadmap för {slug} ännu — skapa <code>roadmaps/{slug}.md</code>.</p>
        )}

        {rm && (
          <>
            <div className="page-head" style={{ marginTop: '1.5rem' }}>
              <Eyebrow>Faser</Eyebrow>
            </div>
            {rm.phases.map((p) => {
              const st = PHASE_STATUS[p.status] ?? PHASE_STATUS.todo;
              const here = p.key === rm.current_phase;
              return (
                <div key={p.key} className={`drift ${st.cls}`} style={{ marginBottom: '0.75rem' }}>
                  <span className="drift-dot" aria-hidden="true" />
                  <div style={{ width: '100%' }}>
                    <strong>{p.title} — {st.label}{here ? ' (här)' : ''}</strong>
                    <span className="drift-detail"> — {p.summary}</span>
                    {p.epics?.length > 0 && (
                      <ul className="vert-epics">
                        {p.epics.map((e, i) => (
                          <li key={i} className={e.done ? 'vert-epic-done' : ''}>
                            {e.done ? '✓ ' : '○ '}{e.title}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="page-head" style={{ marginTop: '2rem' }}>
              <Eyebrow>Öppna beslut</Eyebrow>
            </div>
            {rm.open_decisions.length === 0 ? (
              <p className="tool-meta">Inga öppna beslut.</p>
            ) : (
              rm.open_decisions.map((d, i) => (
                <Card key={i} style={{ marginBottom: '0.75rem' }}>
                  <H3>{d.title}</H3>
                  {d.why && <p className="tool-meta">{d.why}</p>}
                </Card>
              ))
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
