import { Link } from 'react-router-dom';
import { Container, Section, Eyebrow, H1, H3, Lead, Grid, Card } from '@cortxt/ui';
import { COURSES } from '../data/courses.js';

export default function Academy() {
  return (
    <Section>
      <Container>
        <Eyebrow>Academy</Eyebrow>
        <H1>Kurser</H1>
        <Lead style={{ marginTop: '0.5rem', marginBottom: '1.75rem' }}>
          Generella Cortxt-kurser och vertikal-specifika bygg-kurser.
        </Lead>
        <Grid cols={2}>
          {COURSES.map((c) => (
            <Card key={c.slug} as={Link} link to={`/academy/${c.slug}`}>
              <div className="cx-eyebrow">{c.kind === 'vertical' ? 'Vertikal' : 'Generell'}</div>
              <H3 className="">{c.title}</H3>
              <p className="cx-muted" style={{ marginTop: '0.5rem' }}>{c.blurb}</p>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
