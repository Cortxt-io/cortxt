import { Link } from 'react-router-dom';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlannedFeature } from '@/components/PlannedFeature';
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
          <div className="cx-eyebrow">Beslut & lärande med AI</div>
          <h1 className="cx-h1">Strukturerade modeller<br />för bättre beslut.</h1>
          <p className="cx-lead mt-4 max-w-[620px]">
            Cortxt är plattformen där du modellerar beslut, lär dig metoden och bygger
            verktyg — för dig, ditt team eller dina kunder.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/academy">Utforska kurser</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/metod">Lär dig metoden</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Vad vi gör */}
      <Section bordered>
        <Container>
          <div className="cx-eyebrow">Vad vi gör</div>
          <h2 className="cx-h2">Tre delar, en motor</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {WHAT_WE_DO.map((w) => (
              <Card key={w.title}>
                <CardContent className="p-6">
                  <h3 className="cx-h3">{w.title}</h3>
                  <p className="cx-muted mt-2">{w.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Vertikaler */}
      <Section bordered>
        <Container>
          <div className="cx-eyebrow">Vertikaler</div>
          <h2 className="cx-h2">Samma motor, olika beslut</h2>
          <p className="cx-lead mt-2">Fokuserade verktyg byggda på CNS Core.</p>
          {/* Lit instruments (live verticals) you can use; unlit ones are planned. */}
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {VERTICALS.map((v) => {
              if (!v.live) {
                return (
                  <PlannedFeature
                    key={v.name}
                    label={`${v.name} · ${v.tagline}`}
                    hint={v.desc}
                  />
                );
              }
              const external = v.href.startsWith('http');
              return (
                <a
                  key={v.name}
                  href={v.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                  className="block rounded-lg"
                >
                  <Card className="h-full hover:border-primary">
                    <CardContent className="p-6">
                      <h3 className="cx-h3">{v.name}</h3>
                      <div className="cx-eyebrow mt-2">{v.tagline}</div>
                      <p className="cx-muted mt-2">{v.desc}</p>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Kurser & resurser */}
      <Section bordered>
        <Container>
          <div className="cx-eyebrow">Kurser & resurser</div>
          <h2 className="cx-h2">Lär dig bygga beslut</h2>
          <p className="cx-lead mb-6 mt-2">
            Generella kurser i modellering och AI, plus vertikal-specifika bygg-kurser.
          </p>
          <Button asChild>
            <Link to="/academy">Till academy →</Link>
          </Button>
        </Container>
      </Section>

      {/* Arbeta med oss */}
      <Section bordered>
        <Container>
          <div className="cx-eyebrow">Arbeta med oss</div>
          <h2 className="cx-h2">Samarbete & uppdrag</h2>
          <p className="cx-lead mt-2">
            Vill du bygga en datadriven vertikal eller modellera era beslut? Vi tar utvalda
            samarbeten. <Link to="/metod" className="text-primary hover:underline">Läs om metoden</Link>.
          </p>
        </Container>
      </Section>
    </>
  );
}
