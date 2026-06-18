import { Container, Section, Eyebrow, H1, Lead } from '@cortxt/ui';
import { useModels } from '../lib/useModels.js';
import { ReadoutList } from '../components/ReadoutList.jsx';

/* Live portfolio — every CNS system as a readout row, grouped by domain.
 * Same seam and rows as the cockpit; deliberately NOT the parked graph. */
const DOMAIN_LABELS = {
  cortxt: 'Cortxt — plattform & agentur',
  bkfinans: 'BK Finans',
  crusade: 'Crusade',
  juvahem: 'Juvahem',
  orgkomp: 'Orgkomp',
};

function groupByDomain(models) {
  const groups = new Map();
  for (const m of models) {
    const key = m.domain || 'okänd';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(m);
  }
  return [...groups.entries()].sort(([a], [b]) => {
    if (a === 'cortxt') return 1;
    if (b === 'cortxt') return -1;
    return a.localeCompare(b);
  });
}

export default function Portfolio() {
  const { models, loading, error } = useModels();
  const groups = groupByDomain(models);

  return (
    <Section>
      <Container>
        <div className="page-head">
          <Eyebrow>Portfölj</Eyebrow>
          <H1>Alla system</H1>
          <Lead>Allt CNS Core känner till, grupperat per domän — hälsa härledd ur datamodellen.</Lead>
        </div>

        {(loading || error || !models.length) ? (
          <ReadoutList models={models} loading={loading} error={error} emptyText="Katalogen är tom." />
        ) : (
          groups.map(([domain, items]) => (
            <div className="portfolio-group" key={domain}>
              <div className="portfolio-group__head">
                <span className="cx-label">{DOMAIN_LABELS[domain] || domain}</span>
                <span className="portfolio-group__count">{items.length} system</span>
              </div>
              <ReadoutList models={items} loading={false} error={null} />
            </div>
          ))
        )}
      </Container>
    </Section>
  );
}
