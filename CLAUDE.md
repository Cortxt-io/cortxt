# CLAUDE.md — cortxt

Turborepo-monorepo: dashboarden och landningssidan för CNS/Cortxt. Läs detta först varje session. Arbetsspråk: **svenska**.

**Backenden och nodmodellen bor i det separata `Project-CNS`-repot** — läs dess CLAUDE.md för datamodellen. Det finns ingen backend i det här repot.

## Appar (v1 — alla tre aktiva)
- `apps/dashboard` — **CNS-UI:t.** React + Vite + ReactFlow + ELK. Portfölj-graf + nodsidor; läser CNS via Railway-proxy (se Dataflöde). Deployad på Vercel: `app.cortxt.io`.
- `apps/landing` — **kurs-sälj-sidan.** React + Vite + Tailwind, sektionsbaserad (Nav/Hero/Problem/Curriculum/Method/Pricing/Faq). Ingen backend. Deployad på `cortxt.io` via GitHub Pages (`.github/workflows/deploy-landing.yml`).
- `apps/academy` — **kursleverans-appen.** React + Vite + Tailwind, läs-app med localStorage-progress (2-veckors-curriculum). Ingen auth/backend ännu (Clerk + Neon planeras vid betalande kunder).

**Konvention för framtida experiment:** appar som inte hör till v1 flyttas till `apps/_experiments/<namn>/` (utanför turbo-default-loopen) snarare än att raderas. Inga appar ligger där nu — alla tre ovan är aktiva.

## Dataflöde (viktigt)
- Dashboarden hämtar `/api/nodes` (`useProjects.js`). `VITE_API_BASE` är **tom** → relativ path.
- `apps/dashboard/vercel.json` rewrite:ar `/api/*` → Railway-backenden (`project-cns-production.up.railway.app`). **All node-data och alla mutationer går dit.**
- Admin-endpoints (analyze, suggest-quest, redigering) kräver auth; token via `VITE_API_TOKEN` (sätts i Vercels env, inte i .env-filen). Saknas den → 401 på admin-anrop.
- DNS: `app.cortxt.io` = Vercel via en CNAME i Cloudflare. Faller subdomänen bort (NXDOMAIN) men `cortxt.io` lever → kolla Cloudflare DNS + Vercel → Domains; det är posten, inte koden.

## Koppling till CNS Core (minsta nivå)
cortxt har **ingen egen backend** — det är en projektion av CNS. Kontraktet är medvetet smalt:
- **Idag:** CNS exponerar `GET /api/nodes` (Railway; kör `export_json()` mot deploy-tidens katalog). Dashboarden konsumerar det via `useProjects.js`; proxas av `apps/dashboard/vercel.json`. Minimikrav: *exponerar CNS `/api/nodes`, kan dashboarden rita grafen.*
- **Framåt (planerat, ej byggt):** CNS Core har CLI-kommandot `cns export <slug>` (Markdown/JSON decision-brief). Om backenden senare exponerar det per slug (t.ex. `GET /api/node/<slug>/export`) kan en cortxt-yta (academy/landing) visa ett färdigt beslutsunderlag/kursavsnitt utan egen logik. Bygg inte detta i förväg — dokumenterat som seam, inte feature.

## Nodmodellen (sammanfattning)
`kind` (component/system/framework, emergerar ur `part_of`-struktur), `stage` (idea/building/working/maturing), relationer `part_of`/`feeds`/`depends_on`. Detaljer i Project-CNS/CLAUDE.md.

## Packages
- `packages/cns-schema` (`@cortxt/cns-schema`) — **enda källan på JS-sidan för nodmodellens enum-värden** (`STATUSES`, `KINDS`, `NODE_STAGES`, `MVP_STAGES`, `RISK_CATEGORIES`, `TYPES`, `DOMAINS`). `index.js` är **genererad** — kör `node generate.mjs` (eller `pnpm --filter @cortxt/cns-schema generate`); redigera inte för hand. Enkälla är `Project-CNS/schemas/enums.json` (läses även av backendens `validator.py`). Importeras bara av `apps/dashboard`. `labels.js` importerar/re-exporterar dessa och håller bara presentation (etiketter/färger). (layer/pipeline/family ligger kvar i `labels.js` tills deras drift retts ut.)

(`packages/ui` / `@cortxt/ui` är **borttaget** — var ett tomt paket, finns varken på disk eller som beroende.)

## Graf
- `ContainerGraphCanvas.jsx` — container-vyn (system som behållare, komponenter inuti via ReactFlow `parentNode` + ELK `INCLUDE_CHILDREN`). Aktiveras av `USE_CONTAINER_GRAPH = true` i `GraphCanvas.jsx`.
- `SystemContainerNode.jsx` / `ComponentNode.jsx` — nodtyper. `GraphLegend.jsx` — legend.
- **Klassificera container på STRUKTUR** (någon nod har `part_of === slug`), inte på `kind`-fältet.
- **Dra färger/etiketter från `src/data/labels.js`** (`KIND_HEX_COLORS`, `NODE_STAGE_COLORS`, `getKindHexColor`, `getNodeStageColor`) — hårdkoda inte hex i komponenter, då driver legend och nod isär.
- Zoom (semantisk) + fokusläge är byggda. **Nästa arbete:** läsbar layout (roll-lanes substrat→flöde→yta, konsekvent flödesriktning, idé-/oplacerade noder på egen hylla). Den nya positioneringen får inte bryta zoom/fokus.

## Nodsida
- `NodePage.jsx` + `NodePage/` (IdentityZone, TimelineZone, ContextZone, DocsZone). Zon→sektion-mappning per kind i `src/data/zoneSections.js` (`ZONE_SECTION_MAP`).
- suggest-quest: `useSuggestQuest` → backend `/api/node/<slug>/suggest-quest`. Knappen ligger under fliken "Nästa".

## Arbetsregler
- **Git/GitHub-grund:** branchstandard (trunk-based, `feat/`/`fix/`/`chore/`/`docs/`, squash-merge) + org/branch-protection
  är låsta i `Project-CNS/decisions/git-github-grund.md`. Följ den.
- Spec först. Bygg inte om det som funkar. Återanvänd `labels.js`-konstanter och befintliga komponenter.

## Underhåll av denna fil
Läses in varje session. **Uppdatera den i samma ändring** som du ändrar arkitektur, dataflöde, graf-/nodside-struktur eller konventioner. Koncis och högsignalerad — det du behöver för att inte göra fel, inte fullständig dokumentation.
