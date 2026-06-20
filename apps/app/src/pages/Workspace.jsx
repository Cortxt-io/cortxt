import { Container, Section, Eyebrow, H1, Lead, Grid, Card, H3 } from '@cortxt/ui';

/* "Min arbetsyta" — placeholders shaped so live data slots in later:
 * models/cases (from CNS), recent exports, ongoing analyses. */
const SLOTS = [
  { title: 'Dina modeller', body: 'Modeller och cases du arbetar med dyker upp här — hämtas från CNS Core.' },
  { title: 'Senaste exports', body: 'Beslutsunderlag du exporterat (cns export) listas här.' },
  { title: 'Pågående analyser', body: 'Aktiva AI-analyser och sessions visas här.' },
];

export default function Workspace() {
  return (
    <Section>
      <Container>
        <div className="page-head">
          <Eyebrow>Arbetsyta</Eyebrow>
          <H1>Min arbetsyta</H1>
          <Lead>Här samlas dina modeller, pågående beslut och sessions.</Lead>
        </div>
        <Grid cols={3}>
          {SLOTS.map((s) => (
            <Card key={s.title}>
              <H3>{s.title}</H3>
              <p className="tool-meta">{s.body}</p>
            </Card>
          ))}
        </Grid>
        <p className="placeholder" style={{ marginTop: '1.5rem' }}>
          Inga data ännu — den här ytan kopplas mot CNS Core (se <code>src/lib/cns.js</code>).
        </p>
      </Container>
    </Section>
  );
}
