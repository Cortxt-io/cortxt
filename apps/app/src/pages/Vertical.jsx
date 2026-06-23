import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Section, Eyebrow, H1, H3 } from '@cortxt/ui';
import { NodeGraph } from '@cortxt/graph';
import { fetchVertical, fetchGraph } from '../lib/cns.js';

/* Vertikalens kommandocenter — multi-panel, korslänkad. Grafen är kartan; en vald nod
 * drar ihop graf + plan + beslut till ett fokus: grafen dämpar allt utom noden + grannar,
 * och faser/beslut som rör noden tänds. Strategiska lagret (CNS äger riktning). */

const PHASE_STATUS = {
  done: { label: 'Klar', cls: 'cc-phase--done' },
  active: { label: 'Aktiv', cls: 'cc-phase--active' },
  todo: { label: 'Kvar', cls: 'cc-phase--todo' },
};
const HEALTH_LABEL = { healthy: 'Frisk', attention: 'Bevakas', degraded: 'Försämrad', unknown: 'Okänd' };

export default function Vertical() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [graphNodes, setGraphNodes] = useState([]);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setSelected(null);
    fetchVertical(slug)
      .then((d) => { if (!cancelled) { setData(d); setError(null); } })
      .catch((e) => { if (!cancelled) { setError(e.message); setData(null); } });
    fetchGraph(slug)
      .then((ns) => { if (!cancelled) setGraphNodes(ns); })
      .catch(() => { if (!cancelled) setGraphNodes([]); });
    return () => { cancelled = true; };
  }, [slug]);

  const rm = data?.roadmap;
  const v = data?.vertical;
  const nodeBySlug = useMemo(() => Object.fromEntries(graphNodes.map((n) => [n.slug, n])), [graphNodes]);

  // Grannar till vald nod (feeds/depends_on/part_of, båda riktningar) = highlight-mängden.
  const highlight = useMemo(() => {
    if (!selected) return [];
    const sel = nodeBySlug[selected];
    const set = new Set();
    if (sel) [...(sel.feeds || []), ...(sel.depends_on || []), sel.part_of].forEach((s) => s && set.add(s));
    for (const n of graphNodes) {
      if ((n.feeds || []).includes(selected) || (n.depends_on || []).includes(selected) || n.part_of === selected) set.add(n.slug);
    }
    return [...set];
  }, [selected, graphNodes, nodeBySlug]);

  // Faser/beslut som rör vald nod (via epic/decision.node-referensen).
  const relatedEpics = useMemo(() => {
    if (!selected || !rm) return [];
    return rm.phases.flatMap((p) => (p.epics || []).filter((e) => e.node === selected).map((e) => ({ ...e, phase: p.title })));
  }, [selected, rm]);
  const relatedDecisions = useMemo(
    () => (selected && rm ? rm.open_decisions.filter((d) => d.node === selected) : []),
    [selected, rm],
  );

  const selNode = selected ? nodeBySlug[selected] : null;

  return (
    <Section>
      <Container>
        <div className="page-head">
          <Eyebrow><Link to="/cockpit" className="vert-title">← Cockpit</Link></Eyebrow>
          <H1>{v?.title ?? slug}</H1>
          <p className="cc-status">
            {v?.url_live && <a href={v.url_live} target="_blank" rel="noreferrer">{v.url_live} ↗</a>}
            {v?.roadmap && <span> · Fas {v.roadmap.phase_index}/{v.roadmap.total_phases} ({v.roadmap.current_phase_title})</span>}
            {v?.roadmap?.open_decisions ? <span> · {v.roadmap.open_decisions} beslut väntar</span> : null}
          </p>
        </div>

        {error && <p className="placeholder">Kunde inte hämta: {error}</p>}

        <div className="cc-grid">
          {/* Karta */}
          <div className="cc-panel">
            <div className="cc-panel-head">Arkitektur</div>
            {graphNodes.length > 1 ? (
              <div className="cc-graph">
                <NodeGraph nodes={graphNodes} selected={selected} highlight={highlight} onNodeClick={(s) => setSelected((cur) => (cur === s ? null : s))} />
              </div>
            ) : (
              <p className="placeholder">
                {slug} är ännu en enda nod — modellera dess interna system i <code>catalog.yaml</code>.
              </p>
            )}
          </div>

          {/* Readout — speglar valet */}
          <div className="cc-panel">
            <div className="cc-panel-head">{selNode ? selNode.title || selected : 'Översikt'}</div>
            {selNode ? (
              <div className="cc-readout">
                <p className="cc-meta">{selNode.kind || ''}{selNode.type ? ` · ${selNode.type}` : ''} · {HEALTH_LABEL[selNode.health?.level] || 'Okänd'}</p>
                {selNode.summary && <p className="cc-summary">{selNode.summary}</p>}
                {(selNode.url_live || selNode.url_repo) && (
                  <p className="cc-meta">
                    {selNode.url_live && <a href={selNode.url_live} target="_blank" rel="noreferrer">live ↗</a>}
                    {selNode.url_repo && <> {selNode.url_live ? '· ' : ''}<a href={selNode.url_repo} target="_blank" rel="noreferrer">repo ↗</a></>}
                  </p>
                )}
                {relatedEpics.length > 0 && (
                  <>
                    <div className="cc-sub">Epics som rör noden</div>
                    <ul className="cc-list">{relatedEpics.map((e, i) => <li key={i}>{e.done ? '✓ ' : '○ '}{e.title} <span className="cc-dim">({e.phase})</span></li>)}</ul>
                  </>
                )}
                {relatedDecisions.length > 0 && (
                  <>
                    <div className="cc-sub">Beslut som rör noden</div>
                    <ul className="cc-list">{relatedDecisions.map((d, i) => <li key={i}>{d.title}</li>)}</ul>
                  </>
                )}
                {relatedEpics.length === 0 && relatedDecisions.length === 0 && (
                  <p className="cc-dim">Inga länkade epics/beslut än — lägg <code>node: {selected}</code> på en epic i roadmappen.</p>
                )}
              </div>
            ) : (
              <div className="cc-readout">
                {v?.roadmap
                  ? <p className="cc-summary">Fas {v.roadmap.phase_index}/{v.roadmap.total_phases} — {v.roadmap.current_phase_title}.{v.roadmap.next_decision ? ` Nästa beslut: ${v.roadmap.next_decision}` : ''}</p>
                  : <p className="cc-dim">Ingen roadmap än — skapa <code>roadmaps/{slug}.md</code>.</p>}
                <p className="cc-dim">Välj en nod i grafen för att fokusera planen på den.</p>
              </div>
            )}
          </div>
        </div>

        {/* Roadmap-rail */}
        {rm && (
          <div className="cc-rail">
            <div className="cc-panel-head">Roadmap</div>
            {rm.phases.map((p) => {
              const st = PHASE_STATUS[p.status] ?? PHASE_STATUS.todo;
              return (
                <div key={p.key} className={`cc-phase ${st.cls}`}>
                  <strong>{p.title}</strong> <span className="cc-dim">· {st.label}{p.key === rm.current_phase ? ' · här' : ''}</span>
                  {p.epics?.length > 0 && (
                    <ul className="cc-list">
                      {p.epics.map((e, i) => {
                        const lit = e.node && e.node === selected;
                        return (
                          <li
                            key={i}
                            className={`${e.done ? 'vert-epic-done' : ''} ${e.node ? 'cc-linked' : ''} ${lit ? 'cc-lit' : ''}`}
                            onClick={e.node ? () => setSelected(e.node) : undefined}
                          >
                            {e.done ? '✓ ' : '○ '}{e.title}{e.node ? <span className="cc-dim"> ·{e.node}</span> : null}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
            <div className="cc-panel-head" style={{ marginTop: '1rem' }}>Öppna beslut</div>
            {rm.open_decisions.length === 0 ? (
              <p className="cc-dim">Inga öppna beslut.</p>
            ) : rm.open_decisions.map((d, i) => {
              const lit = d.node && d.node === selected;
              return (
                <div
                  key={i}
                  className={`cc-decision ${d.node ? 'cc-linked' : ''} ${lit ? 'cc-lit' : ''}`}
                  onClick={d.node ? () => setSelected(d.node) : undefined}
                >
                  <strong>{d.title}</strong>{d.node ? <span className="cc-dim"> ·{d.node}</span> : null}
                  {d.why && <p className="cc-meta">{d.why}</p>}
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </Section>
  );
}
