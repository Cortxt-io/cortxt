import { Container, Section, Eyebrow, H1, Lead } from '@cortxt/ui';
import { useModels } from '../lib/useModels.js';
import { ReadoutList } from '../components/ReadoutList.jsx';
import { PlannedFeature } from '../components/PlannedFeature.jsx';

/* Verktyg = the launcher. Products with a live URL, as readout rows that link OUT.
 * Parked ventures live in the cockpit, not here. */
export default function Tools() {
  const { models, loading, error } = useModels({ productsOnly: true });
  const launchable = models.filter((m) => m.urlLive);

  return (
    <Section>
      <Container>
        <div className="page-head">
          <Eyebrow>Verktyg</Eyebrow>
          <H1>Verktyg</H1>
          <Lead>Vertikala verktyg byggda på samma motor — öppna dem direkt.</Lead>
        </div>

        <ReadoutList
          models={launchable}
          loading={loading}
          error={error}
          hrefFor={(m) => m.urlLive}
          emptyText="Inga live-verktyg ännu — fyll url_live för en venture i catalog.yaml."
        />

        {/* Roadmap signpost — the parked CNS portfolio graph lands here as a tool. */}
        <div className="section-gap">
          <PlannedFeature
            label="Portföljgraf"
            hint="Interaktiv karta över systemen och deras beroenden — den parkerade CNS-grafen, inkopplad som ett verktyg här."
          />
        </div>
      </Container>
    </Section>
  );
}
