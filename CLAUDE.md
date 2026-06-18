# CLAUDE.md — cortxt

Turborepo-monorepo som bär **cortxt.io** (brand/kurser) och **app.cortxt.io** (inloggad arbetsyta). Läs detta först varje session. Arbetsspråk: **svenska**.

**Backenden och nodmodellen bor i det separata `Project-CNS`-repot** — läs dess CLAUDE.md för datamodellen. Det finns ingen backend i det här repot.

## Två appar + delat designsystem
- **`apps/web` (`@cortxt/web`) → cortxt.io.** Brand + kurser + vertikal-översikt. Vite+React+react-router, sidor: `/` (Home), `/academy` (+ `/:slug`), `/metod`. Deployas på Vercel (SPA-rewrite i `apps/web/vercel.json`). En GitHub Pages-workflow (`deploy-landing.yml`) finns kvar som legacy — **Vercel är målet** (se "Deploy").
- **`apps/app` (`@cortxt/app`) → app.cortxt.io.** Tunn inloggad arbetsyta, **cockpit-IA**: `/` (Översikt — `PortfolioPulse`-signaturen [hälso-rollup, tes-rad, puls-bar] + ventures som instrumentrader), `/portfolj` (alla system per domän, rader), `/verktyg` (launcher: produkter med live-URL, länkar ut), `/modell/:slug` (beslutsmodell-vy). Presentationen är **instrumentrader** (`ReadoutRow`/`ReadoutList`), inte feta kort (ModelCard/ModelGrid pensionerade). Auth-placeholder (`src/lib/auth.js`) + **CNS-klient (`src/lib/cns.js`, levande söm — inte längre stub)**. Avsiktligt lätt — bygg inte tunga dashboards här (den tunga grafen är parkerad i `_experiments`).
- **`packages/ui` (`@cortxt/ui`) → delat designsystem.** Tailwind-oberoende: tokens (CSS-variabler) + primitiver (Button/Card/Layout/Typography/Input/Grid) i `styles.css`. Konsumeras som **käll-JSX** av båda apparna (`optimizeDeps.exclude`). Importera en gång: `import '@cortxt/ui/styles.css'`. **Cockpit-identitet (2026-06-18):** inky dark-bas (`--bg #15171c`), **brand-teal `--accent #4ec9b0`** (ej VS Code-blå), display-font **Space Grotesk** (`--font-display`, på `.cx-h*`), mono (JetBrains) som strukturell röst (`.cx-eyebrow`/`.cx-label`), och **`--health-{healthy,attention,degraded,unknown}`** = sidans enda färgspråk (hälsa förmedlas aldrig av färg ensam — alltid parad med text, a11y). Träffar BÅDE app + web (samma familj). **`apps/academy` är isolerad** (egna tokens i sin `index.css`, ej `@cortxt/ui`) — token-ändringar når den inte.
- **`apps/_experiments/dashboard`** — den tunga CNS-portfölj-grafen (ReactFlow+ELK), **parkerad** utanför `apps/*`-workspace-globben. Inte v1; länkas in som ett verktyg i app:en senare. Rivs inte.

**Konvention:** appar som inte hör till v1 flyttas till `apps/_experiments/<namn>/` (utanför turbo-loopen) snarare än raderas.

> ⚠️ **Vercel-omkoppling krävs:** app.cortxt.io:s Vercel-projekt byggde tidigare `apps/dashboard`. Efter flytten måste projektets *Root Directory* peka om till `apps/app`. cortxt.io = nytt Vercel-projekt mot `apps/web` (eller behåll GH Pages tills omkopplat).

## Dataflöde (gäller parkerade dashboarden)
- Dashboarden (nu i `apps/_experiments/dashboard`) hämtar `/api/nodes` (`useProjects.js`). `VITE_API_BASE` är **tom** → relativ path.
- `apps/_experiments/dashboard/vercel.json` rewrite:ar `/api/*` → Railway-backenden (`project-cns-production.up.railway.app`). **All node-data och alla mutationer går dit.**
- Admin-endpoints (analyze, suggest-quest, redigering) kräver auth; token via `VITE_API_TOKEN` (sätts i Vercels env, inte i .env-filen). Saknas den → 401 på admin-anrop.
- DNS: `app.cortxt.io` = Vercel via en CNAME i Cloudflare. Faller subdomänen bort (NXDOMAIN) men `cortxt.io` lever → kolla Cloudflare DNS + Vercel → Domains; det är posten, inte koden.

## Koppling till CNS Core (minsta nivå)
cortxt har **ingen egen backend** — det är en projektion av CNS. Kontraktet är medvetet smalt och går genom **en fil**: `apps/app/src/lib/cns.js`. UI anropar alltid dess funktioner, **aldrig `fetch` direkt**.
- **Sömmen (`src/lib/cns.js`):** `fetchModels({productsOnly,domains})` → `GET /api/nodes` (normaliserar till camelCase, läser `is_product` från backend med venture-domän som fallback); `fetchDecisionModel(slug)` → `GET /api/node/<slug>/full`; `fetchModelIssues(slug)` → `GET /api/issues?node=`. Hooks `useModels`/`useDecisionModel` i `src/lib/useModels.js` wrappar med loading/error.
- **Konnektivitet:** `apps/app/vercel.json` proxar `/api/* → Railway` (same-origin i prod). Lokalt: sätt `VITE_CNS_API_BASE` till Railway-URL (ingen Vercel-proxy lokalt). **OBS: Railway redeployar bara vid push till main** — nya ventures/`url_live` i `catalog.yaml` syns på riktiga app.cortxt.io först efter redeploy.
- **Delade UI-byggstenar:** `components/ModelCard` (kort → `/modell/:slug`), `ModelGrid` (loading/empty/error), `HealthBadge` (`health.level` → badge). Återanvänds av Workspace/Tools/Portfolio.
- **Auth-seam:** `apps/app/src/lib/auth.js` (`useAuth()`) är platshållaren. Clerk/Supabase/Auth0 wire:as i `main.jsx` + ersätter hooken; gate:a routes i `App.jsx` på `user`.

## Nodmodellen (sammanfattning)
`kind` (component/system/framework, emergerar ur `part_of`-struktur), `stage` (idea/building/working/maturing), relationer `part_of`/`feeds`/`depends_on`. Detaljer i Project-CNS/CLAUDE.md.

## Packages
- `packages/ui` (`@cortxt/ui`) — delat designsystem (se ovan). Tailwind-oberoende; käll-JSX.
- `packages/cns-schema` (`@cortxt/cns-schema`) — JS-enkälla för nodmodellens enum-värden, **genererad** ur `Project-CNS/schemas/enums.json` (`node generate.mjs`). Används idag bara av den parkerade dashboarden. Regenerera när enums ändras (t.ex. nya `ENTITY_TYPES`).

## Kör lokalt
```bash
pnpm install
pnpm --filter @cortxt/web dev    # cortxt.io  → http://localhost:5173
pnpm --filter @cortxt/app dev    # app.cortxt.io → http://localhost:5174
pnpm build                       # turbo bygger alla aktiva appar + paket
```
Mönster: brand-sidor i `apps/web/src/pages`, app-ytor i `apps/app/src/pages`; **all delad UI ligger i `@cortxt/ui`** — lägg primitiver där, inte per app. CNS-anrop → `apps/app/src/lib/cns.js`; auth → `apps/app/src/lib/auth.js`.

## Framtida affärsben (lås inte intäktsmodellen)
Arkitekturen ska hålla flera intäktsströmmar öppna samtidigt:
- **Kurser (B2C/B2B)** — `apps/web` academy; CTA "anmäl intresse" idag, Stripe-checkout pluggas på samma `CourseDetail`-struktur senare.
- **Licensierade verktyg (SaaS)** — `apps/app` + vertikaler (juvahem/orgkomp) bakom auth.
- **Rapporter** — CNS-export per case (`cns export <slug>`) paketerad som beslutsunderlag.
- **Konsult/partnerskap** — "Arbeta med oss" på Home.
Bygg smala slices, men håll copy och struktur breda nog för alla fyra.

## Parkerad dashboard (`apps/_experiments/dashboard`)
Den tunga CNS-grafen (ReactFlow+ELK, NodePage, `useProjects`/Railway-proxy, `labels.js`-färger) lever här tills den länkas in som ett verktyg i `apps/app`. Rör den inte i v1-arbete.

## Arbetsregler
- **Git/GitHub-grund:** branchstandard (trunk-based, `feat/`/`fix/`/`chore/`/`docs/`, squash-merge) + org/branch-protection är låsta i `Project-CNS/decisions/git-github-grund.md`. Följ den.
- Spec först. Bygg inte om det som funkar. **Återanvänd `@cortxt/ui`-primitiver** — hårdkoda inte färger/komponenter per app. Håll app:en tunn (inga tunga dashboards/control centers).

## Underhåll av denna fil
Läses in varje session. **Uppdatera den i samma ändring** som du ändrar arkitektur, dataflöde, graf-/nodside-struktur eller konventioner. Koncis och högsignalerad — det du behöver för att inte göra fel, inte fullständig dokumentation.
