// Single source for all landing copy. Course sales page for Cortxt.
// Edit text here — components are presentation-only. Visible copy: Swedish.
// Angle: idea-to-ops product development with AI. Offer: free intro → paid.

export const content = {
  brand: 'Cortxt',

  nav: {
    links: [
      { label: 'Kursen', href: '#kursen' },
      { label: 'Upplägg', href: '#upplagg' },
      { label: 'Pris', href: '#pris' },
      { label: 'FAQ', href: '#faq' },
    ],
    cta: { label: 'Börja gratis', href: '#pris' },
  },

  hero: {
    eyebrow: 'AI-assisterad produktutveckling',
    headline: ['Från idé till drift —', 'byggd med AI, inte trots den.'],
    subtext:
      'En kurs i att utveckla riktiga produkter med AI som motor: modellera, ' +
      'bygg och driv — från första idé till något som faktiskt körs i produktion. ' +
      'Inte fler prototyper som dör i en mapp.',
    ctaPrimary: { label: 'Börja gratis', href: '#pris' },
    ctaSecondary: { label: 'Se upplägget', href: '#upplagg' },
    note: 'Gratis introduktion · ingen kortuppgift för att börja',
  },

  problem: {
    eyebrow: 'Problemet',
    title: 'AI gör dig snabb — på fel saker',
    points: [
      {
        title: 'Spridd kontext',
        body: 'Idéer, beslut och kod ligger utspritt. Varje AI-session börjar om från noll och du blir integratorn som håller ihop allt i huvudet.',
      },
      {
        title: 'Prototyp-kyrkogården',
        body: 'AI gör det lätt att starta, svårt att landa. Halvfärdiga projekt staplas på hög; inget når drift.',
      },
      {
        title: 'Inget system',
        body: 'Utan ett arbetssätt blir AI slumpartad. Du saknar en repeterbar väg från idé till något som lever.',
      },
    ],
  },

  promise: {
    eyebrow: 'Efter kursen',
    title: 'Ett repeterbart arbetssätt — inte tur',
    points: [
      'Tar en idé hela vägen till drift, själv, med AI som motor.',
      'Håller kontext strukturerad så varje session bygger vidare i stället för om.',
      'Vet när du ska tänka, modellera, bygga och granska — och låter AI göra rätt sak i varje fas.',
      'Skeppar fler produkter med mindre friktion och lägre token-kostnad.',
    ],
  },

  curriculum: {
    eyebrow: 'Kursen',
    title: 'Vad du lär dig',
    sub: 'Sex moduler, från idé till drift. Praktiskt — du bygger en riktig produkt under tiden.',
    modules: [
      { n: '01', title: 'Idé & discovery', body: 'Fånga och forma idéer med AI utan att fastna i analys. Vad ska byggas — och varför.' },
      { n: '02', title: 'Modellera systemet', body: 'Strukturera produkten så att kontexten håller: komponenter, relationer, beslut på ett ställe.' },
      { n: '03', title: 'Driv med agenter', body: 'Sätt AI i arbete på riktiga uppgifter — dispatcha, granska, iterera utan att tappa kontroll.' },
      { n: '04', title: 'Leverans & drift', body: 'Från kod till körande produkt: deploy, datasanning och vad "klart" faktiskt betyder.' },
      { n: '05', title: 'Token-effektivitet', body: 'Jobba kostnadsmedvetet — mät, kapa och få ut mer av varje AI-session.' },
      { n: '06', title: 'Skala arbetssättet', body: 'Driv flera produkter parallellt utan att drunkna. Vanor och rutiner som håller.' },
    ],
  },

  method: {
    eyebrow: 'Upplägg',
    title: 'En tydlig väg, sex faser',
    sub: 'Samma loop varje gång — du lär dig växla läge medvetet i stället för att treva.',
    steps: [
      { label: 'Discovery', desc: 'Fånga & forma idén' },
      { label: 'Definition', desc: 'Bestäm scope & approach' },
      { label: 'Delivery', desc: 'Bygg med AI' },
      { label: 'Review', desc: 'Granska & härda' },
      { label: 'Drift', desc: 'Skeppa & kör' },
    ],
  },

  audience: {
    eyebrow: 'För vem',
    title: 'Byggd för dig som vill skeppa',
    points: [
      { title: 'Solo-byggare & indie-hackers', body: 'Du vill driva flera idéer själv och behöver ett system som gör det möjligt.' },
      { title: 'Utvecklare', body: 'Du kan koda men vill få ut maximalt av AI utan att tappa kvalitet eller kontroll.' },
      { title: 'Produktfolk', body: 'Du tänker i produkter och vill bygga riktiga saker utan ett helt team.' },
    ],
  },

  pricing: {
    eyebrow: 'Pris',
    title: 'Börja gratis. Betala när du vill ha allt.',
    sub: 'Introduktionen är gratis och ger dig hela arbetssättet i översikt. Full kurs när du vill gå på djupet.',
    tiers: [
      {
        name: 'Introduktion',
        price: 'Gratis',
        priceNote: '',
        features: [
          'Översikt av hela idé-till-drift-metoden',
          'Första modulen i sin helhet',
          'Mallar att börja med direkt',
        ],
        cta: { label: 'Börja gratis', href: '#' },
        highlighted: false,
      },
      {
        name: 'Full kurs',
        price: 'TBD',
        priceNote: 'engångspris',
        features: [
          'Alla sex moduler',
          'Bygg en riktig produkt steg för steg',
          'Token-effektivitet & skalnings-modulerna',
          'Uppdateringar när kursen växer',
        ],
        cta: { label: 'Lås upp full kurs', href: '#' },
        highlighted: true,
      },
    ],
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Vanliga frågor',
    items: [
      { q: 'Behöver jag kunna koda?', a: 'Det hjälper, men kursen handlar om arbetssättet. Du lär dig styra AI oavsett om du skriver varje rad själv.' },
      { q: 'Vilken AI / vilka verktyg?', a: 'Metoden är verktygsoberoende men visas med moderna AI-agenter. Du behöver inget dyrt setup för att börja.' },
      { q: 'Hur lång är kursen?', a: 'Sex moduler i egen takt. Introduktionen tar en kort kväll; full kurs går du när det passar.' },
      { q: 'Vad kostar full kurs?', a: 'Pris sätts inför lansering. Börja med den gratis introduktionen under tiden.' },
    ],
  },

  finalCta: {
    title: 'Sluta starta om. Börja skeppa.',
    sub: 'Ta den gratis introduktionen och få hela arbetssättet i översikt — idag.',
    cta: { label: 'Börja gratis', href: '#pris' },
  },

  footer: {
    tagline: 'Idé till drift, med AI.',
    links: [
      { label: 'app.cortxt.io', href: 'https://app.cortxt.io' },
      { label: 'GitHub', href: 'https://github.com/Cortxt-io' },
    ],
  },
};
