import { useParams, Link } from 'react-router-dom';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlannedFeature } from '@/components/PlannedFeature';
import { COURSES } from '../data/courses.js';

export default function CourseDetail() {
  const { slug } = useParams();
  const course = COURSES.find((c) => c.slug === slug);

  if (!course) {
    return (
      <Section>
        <Container>
          <h1 className="cx-h1">Kursen hittades inte</h1>
          <p className="cx-lead mt-2">
            <Link to="/academy" className="text-primary hover:underline">← Tillbaka till academy</Link>
          </p>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container className="max-w-[760px]">
        <Link to="/academy" className="cx-muted hover:text-foreground">← Academy</Link>
        <div className="mt-4">
          <Badge variant={course.kind === 'vertical' ? 'secondary' : 'muted'}>
            {course.kind === 'vertical' ? 'Vertikal kurs' : 'Generell kurs'}
          </Badge>
        </div>
        <h1 className="cx-h1 mt-3">{course.title}</h1>
        <p className="cx-lead mt-3">{course.blurb}</p>

        <h2 className="cx-h2 mt-10">Vad du lär dig</h2>
        <ul className="mt-3 grid list-disc gap-2 pl-5">
          {course.learn.map((l) => <li key={l}>{l}</li>)}
        </ul>

        <h3 className="cx-h3 mt-8">För vem</h3>
        <p className="cx-muted mt-2">{course.audience}</p>

        {/* CTA — no real checkout yet; structure is ready for Stripe later (see CLAUDE.md). */}
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Anmäl intresse</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="cx-muted mb-4">
              Kursen är under uppbyggnad. Lämna intresse så hör vi av oss när den öppnar.
            </p>
            <Button asChild>
              <a href={`mailto:hej@cortxt.io?subject=Intresse: ${encodeURIComponent(course.title)}`}>
                Anmäl intresse
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Roadmap signpost — direct checkout lands here once Stripe is wired. */}
        <PlannedFeature
          className="mt-4"
          label="Direktbetalning"
          hint="Köp och kom igång direkt. Kortbetalning kopplas på samma anmälningsflöde."
        />
      </Container>
    </Section>
  );
}
