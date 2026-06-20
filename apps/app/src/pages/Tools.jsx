import { Container, Section, Eyebrow, H1, Lead, Grid, Card, H3, Button } from '@cortxt/ui';

/* Vertical tools. External ones link out today; future in-app tools route internally. */
const TOOLS = [
  { name: 'Juvahem', desc: 'Jobb & boende-beslut för par som ska flytta — rankar 290 kommuner.', href: 'https://juvahem.se', live: true },
  { name: 'Orgkomp', desc: 'Organisationsdesign & kompetenskartläggning — redigerbar org-graf.', href: 'https://orgkomp.com', live: true },
  { name: 'BK Finans', desc: 'Enkla finansierings- och likviditetsbeslut.', href: '#', live: false },
  { name: 'Liaguiden', desc: 'LIA-/praktik- och karriärbeslut.', href: '#', live: false },
];

export default function Tools() {
  return (
    <Section>
      <Container>
        <div className="page-head">
          <Eyebrow>Verktyg</Eyebrow>
          <H1>Verktyg</H1>
          <Lead>Vertikala verktyg byggda på samma motor (CNS Core).</Lead>
        </div>
        <Grid cols={2}>
          {TOOLS.map((t) => (
            <Card key={t.name} as="a" link href={t.href} target={t.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              <H3>{t.name}{!t.live && <span className="tool-meta"> · snart</span>}</H3>
              <p className="tool-meta">{t.desc}</p>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
