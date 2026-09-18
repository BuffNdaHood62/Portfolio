# Portfolio (src-v2) — Project Notes

Michael Nnamdi portfolio. React 19 + Vite 6 + TypeScript + Tailwind v4, static deploy via `.verdentc.json`.

**Current shape: a single-page site.** One route renders one page. There are no case
studies, no project data and no detail pages (removed 2026-09-17).

## Non-obvious facts that cause bugs

- **Source root is `src-v2/`.** There is no `src/`. `index.html` loads `/src-v2/main.tsx`.
  `tsconfig.json` includes `src-v2` only. If you add a source dir, extend `include` —
  a `tsc` run that doesn't see the files **still exits 0**, producing a false green.
- **Router is `HashRouter`**, which makes in-page anchors a trap. `href="#services"`
  is parsed by the router as the route `services`, so it silently falls through to
  the catch-all, renders Home and resets scroll — the section is never reached. To
  jump to a section use `document.getElementById(id)?.scrollIntoView(...)` in an
  `onClick` (see `Nav.tsx`, `Hero.tsx`). Use `<Link>` for real route changes only.
- **Design tokens** live in `src-v2/index.css` `@theme`: `paper`, `surface`, `ink`,
  `muted`, `line`, `accent`. Invented names like `text-fog` / `border-acid` do **not**
  exist and fail silently (unstyled render).
- **Reduced motion is handled in two layers on purpose**: `useReducedMotion()` for
  framer-motion, plus a global `@media (prefers-reduced-motion)` block in `index.css`
  for CSS/compositor animation. Both are required — don't "dedupe" them.
- **All content lives in `data/site.ts`** — the only data file. Sections are
  `Hero`, `Approach`, `Services`, `About`, `Contact` (5, in `pages/Home.tsx`).
  Edit data before JSX.
- **`site.email` is the only place the address is written.** Nav CTA, Footer and
  Contact all read it. Currently `michaelnnamdi04@gmail.com`.
- **Social links carry an `icon` field**, typed by `IconName` from
  `components/Icon.tsx`. `Icon.tsx` holds six glyphs as inline single paths
  (no icon package) with a **per-icon `viewBox`** — simple-icons are 24×24,
  bootstrap-icons are 16×16. Don't hand-edit the path data; re-fetch from the
  source package. Adding a social means adding an icon name to the union too,
  or `tsc` will reject it.
- **`site.stats` has exactly one entry** ("3+ years of designing & shipping").
  Hero renders it as a single baseline row, not a grid — the old 3-column grid
  left one stat stranded. If you add stats back, revisit that layout.

## Navigation

- Nav and Footer both link exactly the four anchored sections: `approach`, `services`,
  `about`, `contact`. Keep these in sync with the `id=` attributes in `sections/`.
- **Nav desktop breakpoint is `md`** with `gap-8`. It was briefly `lg` while six links
  existed; four fit at 768px comfortably. If you add links, re-check the width.

## Workflow

- `npm run verify` = typecheck + lint + build. Run before handoff.
- `npm run dev` / `build` / `preview`; `typecheck`, `lint`, `lint:fix`, `format`, `format:check`.
- Quality gates: TypeScript strict + noUnused{Locals,Parameters} + verbatimModuleSyntax;
  ESLint 9 flat config (typescript-eslint type-checked, react-hooks, jsx-a11y); Prettier.

## Known deferred work

- **Bundle size**: ~405 KB raw / 129 KB gzip. Driven by `framer-motion@13` pulling the
  full `motion-dom` engine, though the app uses only `motion.*`, `useMotionValue`,
  `useSpring`, `useReducedMotion`, `AnimatePresence`. Options: `LazyMotion` +
  `domAnimation`, or the `framer-motion/dom/mini` entry.
- **`react-router-dom` is now near-dead weight.** Every route renders Home, so the
  router only serves `location.state.scrollTo` and `ScrollToTop`. Removing it
  (`main.tsx`, `App.tsx`, `Nav`, `Footer`) would cut bundle size and complexity —
  but it also means rewriting the scroll-to-section logic, so do it deliberately.
- **`src-v2/assets/portrait.svg` is unused.** Kept in case it is wanted for an About
  photo; delete if not.
- No test runner or CI yet. `verify` is the current gate.

## Watch for orphaned claims

Numbers and names in prose drift out of sync with the data they describe. Real
examples already caught here: "8+ years" in About survived the stat changing to
3+; "40+ launches" in Approach survived the 40+ stat being deleted; testimonial
attributions survived the client rename. **When you change or delete a metric,
client or project, grep the prose for it.**

## Environment gotchas (not project bugs)

- **Dev server: use `127.0.0.1`, NOT `0.0.0.0`.** `npm run dev` is
  `vite --host 0.0.0.0`, which **hangs silently** in this sandbox — no output,
  no listener, no error (may surface as esbuild `write EPIPE` loading
  `vite.config.ts`, which is a red herring). Working:
  `nohup npx vite --host 127.0.0.1 --port 5199 > /tmp/v.log 2>&1 &`
  Verify with `netstat -ano | grep <port>` + `curl` — never trust the log.
  Requesting a deleted/unknown module from the dev server returns **200 with
  `index.html`** (SPA fallback), not 404 — don't mistake that for a stale cache.
- `vite build` may fail with `[safe-delete] ... genie-trash ... ETIMEDOUT` in
  `prepareOutDir`/`emptyDir` — sandbox trash shim. Clears once `dist/` is emptied.
- `vite preview` can return 502 for assets through the sandbox proxy even when the
  files are correct. Verify by reading `dist/` directly.
- **Visual verification: `agent-browser` does not work here** (no browser runtime
  installed; its CLI `open` times out). Drive system Chrome instead:

  ```bash
  CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
  WD="$(cygpath -w /tmp/shots)"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --force-prefers-reduced-motion --virtual-time-budget=6000 \
    --window-size=1280,1000 --screenshot="$WD\\x.png" "http://127.0.0.1:5199/"
  ```

  Three traps, all of which fail **silently** (exit 0, no file written):
  (1) Chrome is a Windows binary — a POSIX `--screenshot=/tmp/...` path writes
  nothing, so convert with `cygpath -w` first; (2) `--force-prefers-reduced-motion`
  is **mandatory** or the framer-motion entrance animations haven't run and the
  hero captures *invisible*; (3) Windows headless clamps to a **~500px minimum
  window width**, so a 390px shot is silently misleading — test at 500+.

## The lesson this codebase keeps teaching

Three separate defects here all had one root cause: **two things claiming to be
authoritative**, each drifting silently.

| Two sources of truth | Result |
| --- | --- |
| `src/` vs `src-v2/` | 1,609 LOC never type-checked |
| `tsconfig` vs `index.html` | False-green typecheck |
| `site.ts` testimonials vs `projects.ts` testimonials | Quotes from non-existent clients |

All three were fixed by **removing the duplication**, not by syncing it. The
codebase is now at the healthy end state: one data file, one source root, one
config. Keep it that way — **derive, don't duplicate.**

## History

- v1 (`src/`, 40 files) removed 2026-09-15; recoverable at commit `9943200`.
- Type-safety restoration + tooling added in `8f29922`.
- Testimonials deduplicated from `projects` in `9bf621a` (later removed entirely).
- Case studies, `projects.ts`, Testimonials section and cover assets removed, and
  Lagos replaced with Nigeria, in `fa1da45` (2026-09-17).
- Email/socials/WhatsApp + single stat in `e9ac090`; hero stat row realigned to
  `items-center` in `98a7da6` (2026-09-18).
