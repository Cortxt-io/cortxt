import { Container, Section, Eyebrow, H1, H2, Lead } from '@cortxt/ui';

export default function Method() {
  return (
    <>
      <Section>
        <Container style={{ maxWidth: 760 }}>
          <Eyebrow>Metod</Eyebrow>
          <H1>CNS Core + vertikaler</H1>
          <Lead style={{ marginTop: '0.75rem' }}>
            Vi modellerar beslut i en strukturerad kärna och bygger fokuserade verktyg ovanpå.
            AI används för att skriva och analysera — men modellen är alltid sanningen.
          </Lead>
        </Container>
      </Section>

      <Section bordered>
        <Container style={{ maxWidth: 760 }}>
          <H2>En horisontell motor</H2>
          <p style={{ marginTop: '0.75rem' }}>
            <strong style={{ color: 'var(--text-bright)' }}>CNS Core</strong> är en enkel modell:
            komponenter, beslut och beroenden. Den beskriver <em>vad</em> ett system är och
            <em> varför</em> valen ser ut som de gör — och kan exporteras som ett tydligt
            beslutsunderlag.
          </p>
          <p className="cx-muted" style={{ marginTop: '0.75rem' }}>
            Ovanpå motorn bygger vi <strong style={{ color: 'var(--text)' }}>vertikaler</strong> —
            Juvahem (jobb & boende), Orgkomp (organisation), m.fl. Samma sätt att tänka, olika
            beslut. Det betyder att en kurs, en rapport och ett verktyg kan dela samma kärna.
          </p>
        </Container>
      </Section>

      <Section bordered>
        <Container style={{ maxWidth: 760 }}>
          <H2>Varför det spelar roll</H2>
          <p style={{ marginTop: '0.75rem' }}>
            Utspridd kontext kostar tid och pengar — särskilt i AI-arbete. En tydlig modell gör
            besluten begripliga för människor och användbara för AI, utan att du drunknar i verktyg.
          </p>
        </Container>
      </Section>
    </>
  );
}
