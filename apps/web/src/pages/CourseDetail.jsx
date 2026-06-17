import { useParams, Link } from 'react-router-dom';
import { Container, Section, Eyebrow, H1, H2, H3, Lead, Card, Button } from '@cortxt/ui';
import { COURSES } from '../data/courses.js';

export default function CourseDetail() {
  const { slug } = useParams();
  const course = COURSES.find((c) => c.slug === slug);

  if (!course) {
    return (
      <Section><Container>
        <H1>Kursen hittades inte</H1>
        <Lead style={{ marginTop: '0.5rem' }}><Link to="/academy">← Tillbaka till academy</Link></Lead>
      </Container></Section>
    );
  }

  return (
    <Section>
      <Container style={{ maxWidth: 760 }}>
        <Link to="/academy" className="cx-muted">← Academy</Link>
        <Eyebrow>{course.kind === 'vertical' ? 'Vertikal kurs' : 'Generell kurs'}</Eyebrow>
        <H1>{course.title}</H1>
        <Lead style={{ marginTop: '0.75rem' }}>{course.blurb}</Lead>

        <H2 style={{ marginTop: '2.5rem' }}>Vad du lär dig</H2>
        <ul style={{ marginTop: '0.75rem', paddingLeft: '1.2rem', display: 'grid', gap: '0.5rem' }}>
          {course.learn.map((l) => <li key={l}>{l}</li>)}
        </ul>

        <H3 style={{ marginTop: '2rem' }}>För vem</H3>
        <p className="cx-muted" style={{ marginTop: '0.4rem' }}>{course.audience}</p>

        {/* CTA — no real checkout yet; structure is ready for Stripe later (see CLAUDE.md). */}
        <Card style={{ marginTop: '2.5rem' }}>
          <H3>Anmäl intresse</H3>
          <p className="cx-muted" style={{ margin: '0.4rem 0 1rem' }}>
            Kursen är under uppbyggnad. Lämna intresse så hör vi av oss när den öppnar.
          </p>
          <Button href={`mailto:hej@cortxt.io?subject=Intresse: ${encodeURIComponent(course.title)}`}>
            Anmäl intresse
          </Button>
        </Card>
      </Container>
    </Section>
  );
}
