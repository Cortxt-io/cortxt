import { Container, Section, Eyebrow, H1, Lead, Grid, Card, H3 } from '@cortxt/ui';
import useCommandCenter from '../hooks/useCommandCenter.js';

/* Cockpit — the woven portfolio view. Renders the composed Command Center state
 * (missions/sitrep/orders/freshness) that CNS Core builds in one read. This is
 * the app's first live CNS surface: catalog → composer → /api/command-center → here. */

const READINESS_LABEL = {
  operational: 'Operativ',
  watch: 'Bevakas',
  degraded: 'Försämrad',
  dark: 'Mörk',
};

/* Drift/infra-rad — lyser rött när prod kör gammal kod. Stänger hålet som lät en
 * 5-dygns deploy-frysning gömma sig bakom "allt operativt". Färg paras alltid med
 * text (a11y, --health-*-regeln). */
const DRIFT_HEADING = {
  healthy: 'Drift: prod kör aktuell kod',
  attention: 'Drift: deploy pågår eller prod nyss bakom',
  degraded: 'Drift: prod är stale',
  unknown: 'Drift: status okänd',
};

function DriftRow({ infra }) {
  if (!infra) return null;
  const level = infra.level ?? 'unknown';
  const detail = infra.checks?.[0]?.feedback ?? '';
  const behind = level !== 'healthy' && infra.running && infra.main_head
    ? `${infra.running} → main ${infra.main_head}`
    : '';
  return (
    <div className={`drift drift--${level}`}>
      <span className="drift-dot" aria-hidden="true" />
      <div>
        <strong>{DRIFT_HEADING[level] ?? DRIFT_HEADING.unknown}</strong>
        {detail && <span className="drift-detail"> — {detail}</span>}
        {behind && <span className="drift-refs"> · {behind}</span>}
      </div>
    </div>
  );
}

function Sitrep({ sitrep }) {
  const cells = [
    { key: 'operational', label: 'Operativa' },
    { key: 'watch', label: 'Bevakas' },
    { key: 'degraded', label: 'Försämrade' },
    { key: 'dark', label: 'Mörka' },
  ];
  return (
    <Grid cols={4}>
      {cells.map((c) => (
        <Card key={c.key}>
          <div className="cockpit-stat">{sitrep?.[c.key] ?? 0}</div>
          <p className="tool-meta">{c.label}</p>
        </Card>
      ))}
    </Grid>
  );
}

function Missions({ missions }) {
  if (!missions?.length) return <p className="placeholder">Inga aktiva uppdrag.</p>;
  return (
    <Grid cols={2}>
      {missions.map((m) => (
        <Card key={m.number}>
          <H3>{m.title}</H3>
          <p className="tool-meta">
            {READINESS_LABEL[m.readiness] ?? m.readiness}
            {' · '}{m.open_objectives} öppna{m.commander ? ' · har ägare' : ''}
          </p>
          {m.order && <p className="cockpit-order">{m.order}</p>}
        </Card>
      ))}
    </Grid>
  );
}

function Orders({ orders }) {
  if (!orders?.length) return <p className="placeholder">Inga rekommendationer just nu.</p>;
  return (
    <Grid cols={1}>
      {orders.map((o, i) => (
        <Card key={o.refs?.join(',') ?? i}>
          <H3>{o.title ?? o.type}</H3>
          {o.motivation && <p className="tool-meta">{o.motivation}</p>}
          {o.refs?.length ? <p className="cockpit-refs">{o.refs.join(' · ')}</p> : null}
        </Card>
      ))}
    </Grid>
  );
}

function fmtAge(s) {
  if (s == null) return null;
  const d = Math.floor(s / 86400);
  if (d >= 1) return `${d}d sedan`;
  const h = Math.floor(s / 3600);
  return h >= 1 ? `${h}h sedan` : 'nyss';
}

/* Vertikaler — per-produkt läge + nästa drag. Svaret på "vad gör jag med infon":
 * var står juvahem/bkfinans/orgkomp/crusade och vad är nästa steg för var och en. */
function Verticals({ verticals }) {
  if (!verticals?.length) return null;
  return (
    <Grid cols={2}>
      {verticals.map((v) => {
        const age = fmtAge(v.activity?.last_commit_age_s);
        const deploy = v.deploy?.state && v.deploy.state !== 'unknown' ? v.deploy.state : null;
        return (
          <Card key={v.slug}>
            <H3>
              {v.title}
              {v.url_live && (
                <a href={v.url_live} target="_blank" rel="noreferrer" className="vert-live"> live ↗</a>
              )}
            </H3>
            <p className="tool-meta">
              {v.url_live ? 'Live' : 'Ej live'}
              {deploy ? ` · ${deploy}` : ''}
              {` · ${v.open_issues} öppna`}
              {age ? ` · senast aktiv ${age}` : ''}
            </p>
            <p className="cockpit-order">{v.next_step}</p>
          </Card>
        );
      })}
    </Grid>
  );
}

export default function Cockpit() {
  const { state, loading, error } = useCommandCenter();

  return (
    <Section>
      <Container>
        <div className="page-head">
          <Eyebrow>Cockpit</Eyebrow>
          <H1>Portföljöversikt</H1>
          <Lead>Den sammanvävda lägesbilden — uppdrag, läge och nästa steg, direkt från CNS Core.</Lead>
        </div>

        {loading && <p className="placeholder">Hämtar lägesbild…</p>}
        {error && (
          <p className="placeholder">
            Kunde inte nå CNS Core: {error}. Kontrollera att backenden är uppe.
          </p>
        )}

        {state && !loading && (
          <>
            <DriftRow infra={state.infra} />
            <Sitrep sitrep={state.sitrep} />

            <div className="page-head" style={{ marginTop: '2rem' }}>
              <Eyebrow>Vertikaler</Eyebrow>
            </div>
            <Verticals verticals={state.verticals} />

            <div className="page-head" style={{ marginTop: '2rem' }}>
              <Eyebrow>Uppdrag</Eyebrow>
            </div>
            <Missions missions={state.missions} />

            <div className="page-head" style={{ marginTop: '2rem' }}>
              <Eyebrow>Nästa steg</Eyebrow>
            </div>
            <Orders orders={state.orders} />

            {state.freshness && (
              <p className="tool-meta" style={{ marginTop: '1.5rem' }}>
                {state.freshness.reachable ? 'Källa nåbar' : 'Källa ej nåbar'}
                {state.freshness.age_s != null
                  ? ` · ${Math.round(state.freshness.age_s)}s sedan uppdatering`
                  : ''}
              </p>
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
