# CLAUDE.md — cortxt

Turborepo-monorepo: dashboarden och landningssidan för CNS/Cortxt. Läs detta först varje session. Arbetsspråk: **svenska**.

**Backenden och nodmodellen bor i det separata `Project-CNS`-repot** — läs dess CLAUDE.md för datamodellen. Det finns ingen backend i det här repot.

## Appar
- `apps/dashboard` — React + Vite + ReactFlow + ELK. Deployad på Vercel: `app.cortxt.io`.
- landing — `cortxt.io`.

## Dataflöde (viktigt)
- Dashboarden hämtar `/api/nodes` (`useProjects.js`). `VITE_API_BASE` är **tom** → relativ path.
- `apps/dashboard/vercel.json` rewrite:ar `/api/*` → Railway-backenden (`project-cns-production.up.railway.app`). **All node-data och alla mutationer går dit.**
- Admin-endpoints (analyze, suggest-quest, redigering) kräver auth; token via `VITE_API_TOKEN` (sätts i Vercels env, inte i .env-filen). Saknas den → 401 på admin-anrop.
- DNS: `app.cortxt.io` = Vercel via en CNAME i Cloudflare. Faller subdomänen bort (NXDOMAIN) men `cortxt.io` lever → kolla Cloudflare DNS + Vercel → Domains; det är posten, inte koden.

## Nodmodellen (sammanfattning)
`kind` (component/system/framework, emergerar ur `part_of`-struktur), `stage` (idea/building/working/maturing), relationer `part_of`/`feeds`/`depends_on`. Detaljer i Project-CNS/CLAUDE.md.

## Packages
- `packages/cns-schema` (`@cortxt/cns-schema`) — **enda källan på JS-sidan för nodmodellens enum-värden** (`STATUSES`, `KINDS`, `NODE_STAGES`, `MVP_STAGES`, `RISK_CATEGORIES`, `TYPES`, `DOMAINS`). `index.js` är **genererad** — kör `node generate.mjs` (eller `pnpm --filter @cortxt/cns-schema generate`); redigera inte för hand. Enkälla är `Project-CNS/schemas/enums.json` (läses även av backendens `validator.py`). `labels.js` importerar/re-exporterar dessa och håller bara presentation (etiketter/färger). (layer/pipeline/family ligger kvar i `labels.js` tills deras drift retts ut.)
- `packages/ui` (`@cortxt/ui`) — delade komponenter.

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
- Spec först. Bygg inte om det som funkar. Återanvänd `labels.js`-konstanter och befintliga komponenter.

## Underhåll av denna fil
Läses in varje session. **Uppdatera den i samma ändring** som du ändrar arkitektur, dataflöde, graf-/nodside-struktur eller konventioner. Koncis och högsignalerad — det du behöver för att inte göra fel, inte fullständig dokumentation.
