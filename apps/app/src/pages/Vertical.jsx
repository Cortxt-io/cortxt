import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Section, Eyebrow, H1, H3 } from '@cortxt/ui';
import { NodeGraph } from '@cortxt/graph';
import { fetchVertical, fetchGraph, fetchCookbook } from '../lib/cns.js';

/* Vertikalens kommandocenter — multi-panel, korslänkad. Grafen är kartan; en vald nod
 * drar ihop graf + plan + beslut till ett fokus: grafen dämpar allt utom noden + grannar,
 * och faser/beslut som rör noden tänds. Strategiska lagret (CNS äger riktning). */

const PHASE_STATUS = {
  done: { label: 'Klar', cls: 'cc-phase--done' },
  active: { label: 'Aktiv', cls: 'cc-phase--active' },
  todo: { label: 'Kvar', cls: 'cc-phase--todo' },
};
const HEALTH_LABEL = { healthy: 'Frisk', attention: 'Bevakas', degraded: 'Försämrad', unknown: 'Okänd' };

// En eller flera noder per del (epic/beslut/bygg-guide-steg). Bakåtkompat: läs `nodes`-lista
// eller en singulär `node`. Allt korslänkas mot grafen via samma helper.
const nodeRefs = (item) => item?.nodes ?? (item?.node ? [item.node] : []);
const touches = (item, slug) => !!slug && nodeRefs(item).includes(slug);
const NodeTags = ({ item }) => {
  const refs = nodeRefs(item);
  return refs.length ? <span className="cc-dim"> ·{refs.join(' ·')}</span> : null;
};

export default function Vertical() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [graphNodes, setGraphNodes] = useState([]);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('roadmap'); // plan tab: roadmap | bygg | beslut

  useEffect(() => {
    let cancelled = false;
    setSelected(null);
    fetchVertical(slug)
      .then((d) => { if (!cancelled) { setData(d); setError(null); } })
      .catch((e) => { if (!cancelled) { setError(e.message); setData(null); } });
    fetchGraph(slug)
      .then((ns) => { if (!cancelled) setGraphNodes(ns); })
      .catch(() => { if (!cancelled) setGraphNodes([]); });
    fetchCookbook(slug)
      .then((cb) => { if (!cancelled) setCookbook(cb?.steps?.length ? cb : null); })
      .catch(() => { if (!cancelled) setCookbook(null); });
    return () => { cancelled = true; };
  }, [slug]);

  const [cookbook, setCookbook] = useState(null);

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

  // Epics/beslut/bygg-guide-steg som rör vald nod (en-eller-flera-noder-ref).
  const relatedEpics = useMemo(() => {
    if (!selected || !rm) return [];
    return rm.phases.flatMap((p) => (p.epics || []).filter((e) => touches(e, selected)).map((e) => ({ ...e, phase: p.title })));
  }, [selected, rm]);
  const relatedDecisions = useMemo(
    () => (selected && rm ? rm.open_decisions.filter((d) => touches(d, selected)) : []),
    [selected, rm],
  );
  const relatedSteps = useMemo(
    () => (selected && cookbook ? cookbook.steps.filter((s) => touches(s, selected)) : []),
    [selected, cookbook],
  );

  const selNode = selected ? nodeBySlug[selected] : null;

  // Plan surfaces (roadmap / bygg-guide / decisions) become tabs — one at a time, not
  // three stacked rails. Show only available tabs; fall back if the current one is empty.
  const availTabs = [rm && 'roadmap', cookbook && 'bygg', rm && 'beslut'].filter(Boolean);
  const activeTab = availTabs.includes(tab) ? tab : (availTabs[0] ?? 'roadmap');

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

        {/* Arkitektur = kartan (full bredd, hjälte). Readout dyker upp som overlay på selektion. */}
        <div className="cc-panel cc-mappanel">
          <div className="cc-panel-head">Arkitektur</div>
          {graphNodes.length > 1 ? (
            <div className="cc-graph">
              <NodeGraph nodes={graphNodes} selected={selected} highlight={highlight} onNodeClick={(s) => setSelected((cur) => (cur === s ? null : s))} />
              {!selNode && <span className="cc-graph-hint">Välj en nod för att fokusera planen.</span>}
              {selNode && (
                <div className="cc-readout-overlay">
                  <button className="cc-readout-close" type="button" onClick={() => setSelected(null)} aria-label="Stäng">✕</button>
                  <div className="cc-sub" style={{ marginTop: 0 }}>{selNode.title || selected}</div>
                  <p className="cc-meta">{selNode.kind || ''}{selNode.type ? ` · ${selNode.type}` : ''} · {HEALTH_LABEL[selNode.health?.level] || 'Okänd'}</p>
                  {selNode.summary && <p className="cc-summary">{selNode.summary}</p>}
                  {(selNode.url_live || selNode.url_repo) && (
                    <p className="cc-meta">
                      {selNode.url_live && <a href={selNode.url_live} target="_blank" rel="noreferrer">live ↗</a>}
                      {selNode.url_repo && <> {selNode.url_live ? '· ' : ''}<a href={selNode.url_repo} target="_blank" rel="noreferrer">repo ↗</a></>}
                    </p>
                  )}
                  {(relatedEpics.length || relatedDecisions.length || relatedSteps.length) ? (
                    <p className="cc-dim">Rör noden: {relatedEpics.length} epics · {relatedDecisions.length} beslut · {relatedSteps.length} steg — tänds i flikarna nedan.</p>
                  ) : (
                    <p className="cc-dim">Inga länkade plan-rader än — lägg <code>nodes: [{selected}]</code> på en epic/steg.</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="placeholder">
              {slug} är ännu en enda nod — modellera dess interna system i <code>catalog.yaml</code>.
            </p>
          )}
        </div>

        {/* Plan — Roadmap / Bygg-guide / Beslut som flikar (en i taget, ej staplade). */}
        {availTabs.length > 0 && (
          <div className="cc-rail">
            <div className="cc-tabs" role="tablist" aria-label="Plan">
              {rm && (
                <button className={`cc-tab ${activeTab === 'roadmap' ? 'active' : ''}`} role="tab" type="button"
                  aria-selected={activeTab === 'roadmap'} onClick={() => setTab('roadmap')}>Roadmap</button>
              )}
              {cookbook && (
                <button className={`cc-tab ${activeTab === 'bygg' ? 'active' : ''}`} role="tab" type="button"
                  aria-selected={activeTab === 'bygg'} onClick={() => setTab('bygg')}>Bygg-guide</button>
              )}
              {rm && (
                <button className={`cc-tab ${activeTab === 'beslut' ? 'active' : ''}`} role="tab" type="button"
                  aria-selected={activeTab === 'beslut'} onClick={() => setTab('beslut')}>
                  Beslut{rm.open_decisions.length ? ` (${rm.open_decisions.length})` : ''}
                </button>
              )}
            </div>

            <div className="cc-tabpanel">
              {activeTab === 'roadmap' && rm && rm.phases.map((p) => {
                const st = PHASE_STATUS[p.status] ?? PHASE_STATUS.todo;
                return (
                  <div key={p.key} className={`cc-phase ${st.cls}`}>
                    <strong>{p.title}</strong> <span className="cc-dim">· {st.label}{p.key === rm.current_phase ? ' · här' : ''}</span>
                    {p.epics?.length > 0 && (
                      <ul className="cc-list">
                        {p.epics.map((e, i) => {
                          const refs = nodeRefs(e);
                          return (
                            <li
                              key={i}
                              className={`${e.done ? 'vert-epic-done' : ''} ${refs.length ? 'cc-linked' : ''} ${touches(e, selected) ? 'cc-lit' : ''}`}
                              onClick={refs.length ? () => setSelected(refs[0]) : undefined}
                            >
                              {e.done ? '✓ ' : '○ '}{e.title}<NodeTags item={e} />
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}

              {activeTab === 'bygg' && cookbook && (
                <>
                  {cookbook.generated_at && (
                    <p className="cc-dim" style={{ marginTop: 0 }}>senast genererad {cookbook.generated_at}{cookbook.source === 'seed' ? ' · seed' : ''}</p>
                  )}
                  {['backend', 'ui_ux'].map((disc) => {
                    const steps = cookbook.steps.filter((s) => s.discipline === disc);
                    if (!steps.length) return null;
                    return (
                      <div key={disc} style={{ marginTop: '0.6rem' }}>
                        <div className="cc-sub">{disc === 'ui_ux' ? 'UI/UX' : 'Backend'}</div>
                        <ol className="cc-steps">
                          {steps.map((s, i) => {
                            const refs = nodeRefs(s);
                            return (
                              <li
                                key={s.key || i}
                                className={`${refs.length ? 'cc-linked' : ''} ${touches(s, selected) ? 'cc-lit' : ''}`}
                                onClick={refs.length ? () => setSelected(refs[0]) : undefined}
                              >
                                <strong>{s.title}</strong><NodeTags item={s} />
                                {s.detail && <p className="cc-meta">{s.detail}</p>}
                              </li>
                            );
                          })}
                        </ol>
                      </div>
                    );
                  })}
                  {cookbook.source === 'seed' && (
                    <p className="cc-dim" style={{ marginTop: '0.6rem' }}>Seed — kör <code>cns cookbook {slug}</code> (med ANTHROPIC_API_KEY) för en AI-genererad version mot nuläget.</p>
                  )}
                </>
              )}

              {activeTab === 'beslut' && rm && (
                rm.open_decisions.length === 0 ? (
                  <p className="cc-dim">Inga öppna beslut.</p>
                ) : rm.open_decisions.map((d, i) => {
                  const refs = nodeRefs(d);
                  return (
                    <div
                      key={i}
                      className={`cc-decision ${refs.length ? 'cc-linked' : ''} ${touches(d, selected) ? 'cc-lit' : ''}`}
                      onClick={refs.length ? () => setSelected(refs[0]) : undefined}
                    >
                      <strong>{d.title}</strong><NodeTags item={d} />
                      {d.why && <p className="cc-meta">{d.why}</p>}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
