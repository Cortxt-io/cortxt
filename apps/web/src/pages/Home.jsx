import { Link } from 'react-router-dom';
import { Container, Section, Eyebrow, H1, H2, H3, Lead, Grid, Card, Button } from '@cortxt/ui';
import { VERTICALS } from '../data/verticals.js';

const WHAT_WE_DO = [
  { title: 'Beslutsstöd', body: 'Vi gör otydliga val tydliga — modellerar alternativ, beroenden och konsekvenser.' },
  { title: 'Modeller', body: 'Strukturerad kunskap som håller över tid: komponenter, beslut och relationer.' },
  { title: 'AI & agents', body: 'AI skriver och analyserar ovanpå modellen — modellen förblir sanningen.' },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Section>
        <Container>
          <Eyebrow>Beslut & lärande med AI</Eyebrow>
          <H1>Strukturerade modeller<br />för bättre beslut.</H1>
          <Lead style={{ maxWidth: 620, marginTop: '1rem' }}>
            Cortxt är plattformen där du modellerar beslut, lär dig metoden och bygger
            verktyg — för dig, ditt team eller dina kunder.
          </Lead>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
            <Button href="/academy">Utforska kurser</Button>
            <Button variant="secondary" href="/metod">Lär dig metoden</Button>
          </div>
        </Container>
      </Section>

      {/* Vad vi gör */}
      <Section bordered>
        <Container>
          <Eyebrow>Vad vi gör</Eyebrow>
          <H2>Tre delar, en motor</H2>
          <Grid cols={3} style={{ marginTop: '1.75rem' }}>
            {WHAT_WE_DO.map((w) => (
              <Card key={w.title}><H3>{w.title}</H3><p className="cx-muted" style={{ marginTop: '0.5rem' }}>{w.body}</p></Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Vertikaler */}
      <Section bordered>
        <Container>
          <Eyebrow>Vertikaler</Eyebrow>
          <H2>Samma motor, olika beslut</H2>
          <Lead style={{ marginTop: '0.5rem' }}>Fokuserade verktyg byggda på CNS Core.</Lead>
          <Grid cols={2} style={{ marginTop: '1.75rem' }}>
            {VERTICALS.map((v) => (
              <Card key={v.name} as="a" link href={v.href} target={v.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <H3>{v.name} {!v.live && <span className="cx-muted" style={{ fontSize: '0.8rem' }}>· snart</span>}</H3>
                <div className="cx-eyebrow" style={{ marginTop: '0.4rem' }}>{v.tagline}</div>
                <p className="cx-muted" style={{ marginTop: '0.4rem' }}>{v.desc}</p>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Kurser & resurser */}
      <Section bordered>
        <Container>
          <Eyebrow>Kurser & resurser</Eyebrow>
          <H2>Lär dig bygga beslut</H2>
          <Lead style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Generella kurser i modellering och AI, plus vertikal-specifika bygg-kurser.
          </Lead>
          <Button href="/academy">Till academy →</Button>
        </Container>
      </Section>

      {/* Arbeta med oss */}
      <Section bordered>
        <Container>
          <Eyebrow>Arbeta med oss</Eyebrow>
          <H2>Samarbete & uppdrag</H2>
          <Lead style={{ marginTop: '0.5rem' }}>
            Vill du bygga en datadriven vertikal eller modellera era beslut? Vi tar utvalda
            samarbeten. <Link to="/metod">Läs om metoden</Link>.
          </Lead>
        </Container>
      </Section>
    </>
  );
}
