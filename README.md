# cortxt

Turborepo that carries **cortxt.io** (brand + courses) and **app.cortxt.io** (signed-in workspace).
Backend and the node model live in the separate **Project-CNS** repo — there is no backend here.

## Structure

```
apps/
  web/                 @cortxt/web  → cortxt.io        (brand, academy, method)
  app/                 @cortxt/app  → app.cortxt.io    (thin workspace; auth + CNS stubs)
  _experiments/
    dashboard/         parked CNS portfolio graph (not v1)
packages/
  ui/                  @cortxt/ui   → shared design system (tokens + primitives)
  cns-schema/          @cortxt/cns-schema → generated enum values from Project-CNS
```

## Run locally

```bash
pnpm install
pnpm --filter @cortxt/web dev    # cortxt.io       → http://localhost:5173
pnpm --filter @cortxt/app dev    # app.cortxt.io   → http://localhost:5174
pnpm build                       # build all active apps + packages (turbo)
```

## Where things plug in

- **Shared UI:** add primitives to `packages/ui` (`@cortxt/ui`), import `@cortxt/ui/styles.css` once per app. Don't hardcode colors/components per app.
- **CNS Core calls:** `apps/app/src/lib/cns.js` → `fetchDecisionModel(slug)` (stub today; swap for a real fetch against the CNS export endpoint).
- **Auth:** `apps/app/src/lib/auth.js` → `useAuth()` placeholder; wire Clerk/Supabase/Auth0 there.

## Deploy

Both apps target **Vercel** (each has a `vercel.json` SPA rewrite). Point each Vercel project's
Root Directory at the app: `apps/web` for cortxt.io, `apps/app` for app.cortxt.io. A legacy
GitHub Pages workflow (`deploy-landing.yml`) still builds `@cortxt/web` — Vercel is the target.

See `CLAUDE.md` for architecture details, the CNS seam, and future business legs.
