// Course catalog for the academy. Structure (not payment) is what matters here —
// CTA is "anmäl intresse" until a real checkout (Stripe) is wired.
export const COURSES = [
  {
    slug: 'modellera-beslut',
    title: 'Modellera beslut med AI',
    kind: 'general',
    blurb: 'Bygg en strukturerad modell av en produktportfölj och driv den med AI utan att kontexten skenar.',
    audience: 'Bygg-sugna generalister, indie-utvecklare, produktledare.',
    learn: [
      'Strukturera kunskap som en nod-modell (komponenter, beslut, beroenden).',
      'Låt AI skriva och analysera — men håll modellen som sanning.',
      'Exportera beslutsunderlag som kurs, rapport eller verktyg.',
    ],
  },
  {
    slug: 'juvahem-datadrivet',
    title: 'Bygg ett datadrivet beslutsverktyg',
    kind: 'vertical',
    blurb: 'Från gratis svensk öppen data till ett live beslutsverktyg — fallet Juvahem.',
    audience: 'Den som vill bygga en datadriven vertikal från noll.',
    learn: [
      'Hitta och kombinera fri öppen data (Kolada, JobTech, SCB).',
      'Deterministisk scoring i klienten — ingen tung backend.',
      'Publicera SEO-vänligt och mät vad som funkar.',
    ],
  },
];
