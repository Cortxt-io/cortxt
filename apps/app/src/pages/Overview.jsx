import { Container, Section, Eyebrow } from '@cortxt/ui';
import { useModels } from '../lib/useModels.js';
import { PortfolioPulse } from '../components/PortfolioPulse.jsx';
import { ReadoutList } from '../components/ReadoutList.jsx';

/* Översikt — the cockpit. One fetch drives both the portfolio pulse (all systems)
 * and the ventures readout (products). Health is derived in CNS, rendered here. */
export default function Overview() {
  const { models, loading, error } = useModels();
  const ventures = models.filter((m) => m.isProduct);

  return (
    <Section>
      <Container>
        <div className="page-head">
          <Eyebrow>Portfölj</Eyebrow>
        </div>

        {!loading && !error && models.length > 0 && (
          <PortfolioPulse models={models} ventureCount={ventures.length} />
        )}

        <div className="section-gap">
          <div className="cx-label">Ventures</div>
          <ReadoutList
            models={ventures}
            loading={loading}
            error={error}
            emptyText="Inga ventures i katalogen ännu — lägg till ett system med egen domän i catalog.yaml."
          />
        </div>
      </Container>
    </Section>
  );
}
