import { Container, Section } from '@/components/layout';

export default function Method() {
  return (
    <>
      <Section>
        <Container className="max-w-[760px]">
          <div className="cx-eyebrow">Metod</div>
          <h1 className="cx-h1">CNS Core + vertikaler</h1>
          <p className="cx-lead mt-3">
            Vi modellerar beslut i en strukturerad kärna och bygger fokuserade verktyg ovanpå.
            AI används för att skriva och analysera — men modellen är alltid sanningen.
          </p>
        </Container>
      </Section>

      <Section bordered>
        <Container className="max-w-[760px]">
          <h2 className="cx-h2">En horisontell motor</h2>
          <p className="mt-3">
            <strong className="text-text-bright">CNS Core</strong> är en enkel modell:
            komponenter, beslut och beroenden. Den beskriver <em>vad</em> ett system är och
            <em> varför</em> valen ser ut som de gör — och kan exporteras som ett tydligt
            beslutsunderlag.
          </p>
          <p className="cx-muted mt-3">
            Ovanpå motorn bygger vi <strong className="text-foreground">vertikaler</strong> —
            Juvahem (jobb & boende), Orgkomp (organisation), m.fl. Samma sätt att tänka, olika
            beslut. Det betyder att en kurs, en rapport och ett verktyg kan dela samma kärna.
          </p>
        </Container>
      </Section>

      <Section bordered>
        <Container className="max-w-[760px]">
          <h2 className="cx-h2">Varför det spelar roll</h2>
          <p className="mt-3">
            Utspridd kontext kostar tid och pengar — särskilt i AI-arbete. En tydlig modell gör
            besluten begripliga för människor och användbara för AI, utan att du drunknar i verktyg.
          </p>
        </Container>
      </Section>
    </>
  );
}
