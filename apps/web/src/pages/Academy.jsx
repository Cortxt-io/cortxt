import { Link } from 'react-router-dom';
import { Container, Section } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { COURSES } from '../data/courses.js';

export default function Academy() {
  return (
    <Section>
      <Container>
        <div className="cx-eyebrow">Academy</div>
        <h1 className="cx-h1">Kurser</h1>
        <p className="cx-lead mb-7 mt-2">
          Generella Cortxt-kurser och vertikal-specifika bygg-kurser.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          {COURSES.map((c) => (
            <Link key={c.slug} to={`/academy/${c.slug}`} className="block rounded-lg">
              <Card className="h-full hover:border-primary">
                <CardContent className="p-6">
                  <Badge variant={c.kind === 'vertical' ? 'secondary' : 'muted'}>
                    {c.kind === 'vertical' ? 'Vertikal' : 'Generell'}
                  </Badge>
                  <h3 className="cx-h3 mt-3">{c.title}</h3>
                  <p className="cx-muted mt-2">{c.blurb}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
