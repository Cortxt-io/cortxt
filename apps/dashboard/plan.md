# Phase 2 — Hybrid Dashboard Implementation Plan

## Context
The cortxt dashboard currently lands on BriefView (`#/`). The goal is to replace it with a three-section hybrid landing (MINNE / BESLUT / KARTA) that surfaces real-time activity (eventstream), a daily digest (devlog), a compact brief/quest panel, and a hierarchical tree of the framework. The old devlog-HTML and ActivityView are replaced by the new Timeline + ActivitySummary components. BriefView moves to `#/brief` unchanged.

Backend endpoints (verified in Phase 1):
- `GET /api/eventstream/events?slug=&source=` → `{count, events: [{id, what, when, why, how, who, where, source, slug, meta}], source}`
- `GET /api/devlog` → `{text, generated_at, event_count, status}`
- `GET /api/projects` → nodes with `kind, stage, part_of, feeds, depends_on, layer`

---

## Task 1: API Layer — `src/lib/api.js`

**Add two functions at end of file:**

- `fetchEventstream(filters = {})` — builds `URLSearchParams` from `filters.slug` and `filters.source`, GETs `/api/eventstream/events`, uses `authHeaders()`, same error pattern as `fetchQuests`
- `fetchDevlog()` — GET `/api/devlog`, uses `authHeaders()`, same error pattern as `fetchBrief`

---

## Task 2: Event Colors — `src/data/labels.js`

**Add at end of file:**

- `EVENT_COLORS` map: `stage_change → #10b981` (green), `deploy → #06b6d4` (cyan), `pull_request → #a855f7` (purple), `push → #6366f1` (blue/accent), `md_change → #64748b` (gray), `workflow_run → #475569` (dimmed)
- `getEventColor(what)` with `#64748b` fallback

---

## Task 3: Hook — `src/hooks/useEventstream.js` (NEW)

- State: `events`, `source`, `loading`, `error`, `tick`
- `refresh = useCallback(() => setTick(t => t + 1))`
- `useEffect` on `[tick, JSON.stringify(filters)]`:
  - Fetch via `fetchEventstream(filters)`
  - Set `events = data.events ?? []`, `source = data.source ?? 'redis'`
  - **30-second polling**: `setInterval(() => setTick(t => t + 1), 30000)` inside effect, `clearInterval` in cleanup
  - Cancellation guard: `let cancelled = false`
- Returns `{ events, source, loading, error, refresh }`

---

## Task 4: Hook — `src/hooks/useDevlog.js` (NEW)

- State: `digest`, `generatedAt`, `status`, `loading`, `error`, `tick`
- `useEffect` on `[tick]`: fetch via `fetchDevlog()`, set `digest = data.text`, `generatedAt = data.generated_at`, `status = data.status`
- No polling (digest doesn't need live updates)
- Returns `{ digest, generatedAt, status, loading, error, refresh }`

---

## Task 5: Component — `src/components/Timeline.jsx` (NEW)

**Props:** `{ slug, projects }` — `slug` optional for filtering, `projects` for title lookup

**Logic:**
- Call `useEventstream({ slug })`
- Group events by day using `event.when` date key, sorted newest-first
- Day headers: "Idag" (today), "Igår" (yesterday), formatted date for older
- Each event row:
  - Color-coded 8px dot from `getEventColor(event.what)`
  - `event.why` as title text
  - Subtitle: `event.who` + `event.where` + relative time
  - If `slug` prop provided → show node title as clickable link to `#/project/<slug>`
  - If no slug (portfolio mode) → look up node by **`event.slug`** (not `event.where`) in projects, show clickable title. `event.where` is a repo:branch string like "rian010194/Project-CNS:main", not a node slug — it should only be shown as display text, never used for navigation lookup.
  - If `event.slug` is null/empty (global events with no node) → no node link, show `event.where` as plain text only
- Empty state: "Ingen aktivitet än" (muted text)
- Fallback notice: if `source === 'fallback'` → "Redis ej tillgänglig, visar arkiv" (discrete muted banner)
- Left-border timeline line connecting the dots (2px border-left pattern)
- Styling: `var(--surface)` cards, `var(--border)` separators, `var(--muted)` for subtitles

---

## Task 6: Component — `src/components/ActivitySummary.jsx` (NEW)

**Props:** none (self-contained, calls `useDevlog()` internally)

**Logic:**
- Call `useDevlog()`
- If `status === 'not_found'` → "Ingen sammanfattning än — kör Uppdatera underlag"
- If `digest` has content → render via `marked.parse(digest)` with `dangerouslySetInnerHTML` + `.prose` class
- Show `generatedAt` discretely (small muted mono text, same pattern as BriefView)
- Wrap in `var(--surface)` card with `var(--border)` border
- Import `marked` (already in package.json, used in ProjectDetail)

---

## Task 7: Component — `src/components/FrameworkTree.jsx` (NEW)

**Props:** `{ projects }`

**Logic:**
- Build hierarchy from `part_of`:
  - Frameworks: `projects` where `kind === 'framework'` and no `part_of`
  - Systems: `projects` where `kind === 'system'`, grouped by `part_of` (parent framework slug)
  - Components: `projects` where `kind === 'component'`, grouped by `part_of` (parent system slug)
  - Unplaced: nodes without `part_of` and `kind !== 'framework'` → "Oplacerade" group
- Each node row: stage-colored dot (from `getNodeStageColor`) + name + `KindBadge` (reuse existing)
- Collapsible systems (toggle icon ▶/▼, same pattern as FileSection in ProjectDetail)
- Click node → `navigate('/project/' + slug)`
- "Visa full graf →" disabled link at bottom (opacity 0.4, pointer-events none, title="Kommer snart")
- Styling: indented levels (0/20/40px padding-left), `var(--surface)` cards, `var(--border)` separators

**Important:** The `projects` array items have **top-level fields** (e.g., `p.kind`, `p.part_of`, `p.stage`, `p.slug`, `p.title`). The `meta` nesting only exists in the single-project detail response from `useProject(slug)`. FrameworkTree accesses via `p.kind`, `p.part_of`, `p.stage` directly.

---

## Task 8: View — `src/views/HomeView.jsx` (NEW)

**Props from AppShell:** `brief`, `briefLoading`, `briefError`, `briefRefresh`, `briefGeneratedAt`, `projects`

**Internal hooks:** `useQuests({ status: 'in_progress' })` and `useQuests({ status: 'active' })`

**Structure — three sections, top-down:**

1. **MINNE** section:
   - `<ActivitySummary />`
   - `<Timeline projects={projects} />` (no slug = whole portfolio)
   - Section heading: "MINNE" (same label style as BriefView: fontSize 12, muted mono, fontWeight 600)

2. **BESLUT** section:
   - Compact brief card: "SITUATION" label + `brief?.situation` text
   - Quest suggestion: title + description if `brief?.quest_suggestion` exists
   - "Se hela briefen →" link navigating to `#/brief`
   - Active/in-progress quests: compact rows with title + status badge (same style as BriefView's in-progress banner)

3. **KARTA** section:
   - `<FrameworkTree projects={projects} />`

Sections "breathe" with `marginBottom: 40` between them.

---

## Task 9: Routing + Sidebar — `src/App.jsx`

**Changes:**

1. **Imports:** Add `HomeView`, `Timeline`
2. **navItems:** Change to:
   ```
   { path: '/', label: 'Hem', icon: '⌂' },
   { path: '/brief', label: 'Brief', icon: '◈' },
   { path: '/quests', label: 'Quests', icon: '⚡' },
   { path: '/portfolio', label: 'Portfolio', icon: '⊞' },
   { path: '/timeline', label: 'Tidslinje', icon: '◎' },
   { path: '/metrics', label: 'Metrics', icon: '▦' },
   ```
3. **Sidebar `isActive` logic:** Add `/brief` to the exact-match list (so `/` and `/brief` don't cross-highlight):
   ```js
   if (item.path === '/' || item.path === '/brief' || item.path === '/portfolio') {
     return currentPath === item.path;
   }
   ```
4. **Routes:**
   - `/` → `<HomeView brief={brief} ... projects={projects} />`
   - `/brief` → `<BriefView ... />` (same props as before)
   - `/timeline` → `<Timeline projects={projects} />` (standalone page)
   - `/activity` → `<Navigate to="/timeline" replace />` (redirect, backwards compat)
   - All other routes unchanged

---

## Task 10: ProjectDetail — Node Timeline (Bonus) — `src/components/ProjectDetail.jsx`

**Changes:**
1. Add `import Timeline from './Timeline'`
2. Thread `projects` prop from App: change Route to `<ProjectDetail projects={projects} />`
3. Add "AKTIVITET" section between QuestSection and NodeRelationsList:
   ```
   <Timeline slug={slug} projects={projects} />
   ```
4. Add `projects = []` to ProjectDetail's destructured props

---

## Verification

**Technical checks (automated):**

1. `pnpm --filter @cortxt/dashboard build` succeeds
2. No console errors on `#/`, `#/brief`, `#/timeline`, `#/project/<slug>` routes
3. Sidebar highlights correct item for each route

**Live UX test (manual, on app.cortxt.io):**

1. `#/` shows MINNE (digest + timeline), BESLUT (brief + quests), KARTA (tree) — all three sections visible and breathing
2. cns-brief-event in timeline shows green/blue color and clickable node link
3. Framework tree shows framework → system → component hierarchy, clicking leads to project page
4. Timeline auto-updates within 30s (watch for a new event appearing while the view is open)
5. `/activity` redirects to `/timeline`
6. `#/brief` unchanged and still works
7. Subjective: does the view feel like the overview you wanted? Does MINNE/BESLUT/KARTA feel like memory/decision/map in the right order? Report back.

## Key Risks

- **API response field names:** Verified via live test. Event fields are at top level: `event.what`, `event.when`, `event.why`, `event.how`, `event.who`, `event.where`, `event.slug`, `event.source`. Meta fields: `event.meta.slugs`, `event.meta.is_multi_slug`, `event.meta.sha`, `event.meta.url`. No guessing needed.
- **Node linking:** Use `event.slug` for navigation (not `event.where`). `event.where` is repo:branch text like "rian010194/Project-CNS:main" — display only. If `event.slug` is null, no node link (global events).
- **Projects data shape:** Verified: top-level fields (`p.kind`, `p.part_of`, `p.stage`, `p.slug`, `p.title`). No `meta` nesting in the projects array.
- **Mobile nav overflow:** 6 items may be tight. If needed, hide "Tidslinje" on mobile bottom nav since it's also accessible from the Hem view's MINNE section.
- **`marked.use()` is global:** Both ProjectDetail and ActivitySummary use same config `{ breaks: true, gfm: true }`, no conflict.