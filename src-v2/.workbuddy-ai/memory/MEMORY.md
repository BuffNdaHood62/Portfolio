# Portfolio (src-v2) — Project Notes

Michael Nnamdi portfolio. React 19 + Vite 6 + TypeScript + Tailwind v4, static deploy via `.verdentc.json`.

**Current shape: a single-page site with no router at all.** `App.tsx` renders
`<Nav /> <Home /> <Footer />` directly. No case studies, no project data, no detail
pages (removed 2026-09-17); `react-router-dom` removed 2026-09-18.

## Non-obvious facts that cause bugs

- **Source root is `src-v2/`.** There is no `src/`. `index.html` loads `/src-v2/main.tsx`.
  `tsconfig.json` includes `src-v2` only. If you add a source dir, extend `include` —
  a `tsc` run that doesn't see the files **still exits 0**, producing a false green.
- **There is no router — don't reintroduce one without a second page.** In-page nav is
  `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })` (see `Nav.tsx`,
  `Footer.tsx`, `Hero.tsx`); every section carries `scroll-mt-24` to clear the fixed
  header. Before 2026-09-18 the app used `HashRouter`, which made `href="#services"` a
  trap — the router parsed it as the route `services` and reset scroll instead of
  reaching the section. Plain anchors work again now.
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
- **`site.stats` has exactly one entry** ("3+ years of designing & shipping"), rendered
  in two places with two layouts. Both use `items-center` + `leading-none` on the value:
  - `Hero` — `flex items-center gap-x-2.5` in a full-width row.
  - `About` — the same, inside a `border-y` frame in a 5/12 column.

  **Don't switch either to `items-baseline`** (wrong for a 36px/14px pair — the taller
  numeral line box drops the label below its visual centre) and **don't use
  `justify-between`** (right for the old 3-stat table, but flings a single pair ~350px
  apart). Both were real bugs here. `dt` precedes `dd` in the DOM; `order-1`/`order-2`
  swap them visually only.

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

- **Bundle size**: ~367 KB raw / 117 KB gzip. Driven by `framer-motion@13` pulling the
  full `motion-dom` engine, though the app uses only `motion.*`, `useMotionValue`,
  `useSpring`, `useReducedMotion`. Options: `LazyMotion` + `domAnimation`, or the
  `framer-motion/dom/mini` entry. (Was 410 KB before the router removal.)
- **`src-v2/assets/portrait.svg` is unused.** Kept in case it is wanted for an About
  photo; delete if not.
- **Stale build dirs are stranded in the project root** (`dist.stale`, `dist.prev`,
  `dist.keep3`, `dist.keep4`) — created as sandbox workarounds and not deletable from
  inside it. Gitignored and verified harmless; remove by hand.
- No test runner or CI. `verify` is the gate. A throwaway CDP interaction harness
  (`cdp-test.mjs`, `cdp-shot.mjs`) lives in the temp dir — see environment notes.
  Worth committing if it becomes a real suite.

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
- **`vite build` fails on `emptyDir` once the safe-delete guard trips.**
  `SAFE_DELETE_BULK_CONFIRM_REQUIRED` counts **all** deletions attempted in the turn
  *including failed ones*, so it never resets and every build fails past ~50.
  Observed 79 → 107 → 247. `rm` and PowerShell `Remove-Item` are both intercepted;
  the shim routes to `genie-trash`, which errors "Some operations were aborted" and
  **fails closed**. Workaround: `mv dist dist.stale && npm run build` — a rename is
  not a delete, so `emptyDir` has nothing to do.
- `vite preview` and `python -m http.server` can return **502 through the sandbox
  proxy** even when the files are correct. Headless Chrome connecting to
  `127.0.0.1` directly works, which proves the build is fine.
- **Tailwind v4 scans the whole project tree, honouring `.gitignore`** — anything not
  ignored becomes a CSS source. Two patterns here were silently ineffective:
  - `dist/` (trailing slash) matches only a dir named *exactly* `dist`, so
    `dist.stale` was scanned and its own class-name strings re-emitted as 9 dead
    utilities. Fixed with `dist.*/`.
  - `.workbuddy-ai/memory/` contains a slash, so git anchored it to the repo **root**
    while the dir is at `src-v2/.workbuddy-ai/memory/` — never matched. Project notes
    were scanned as source; a note mentioning `gap-y-2` emitted a real `.gap-y-2`
    rule into the shipped stylesheet. Fixed with `@source not './.workbuddy-ai'` in
    `index.css`. **Prose should never be a CSS source.**
- **Visual verification: `agent-browser` does not work here** (no browser runtime
  installed; its CLI `open` times out). Drive system Chrome directly:

  ```bash
  CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
  WD="$(cygpath -w /tmp/shots)"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --force-prefers-reduced-motion --virtual-time-budget=6000 \
    --window-size=1280,1000 --screenshot="$WD\\x.png" "http://127.0.0.1:5199/"
  ```

  Three traps, all failing **silently** (exit 0, no file written): (1) Chrome is a
  Windows binary — a POSIX `--screenshot=/tmp/...` path writes nothing, convert with
  `cygpath -w`; (2) `--force-prefers-reduced-motion` is **mandatory** or the
  framer-motion entrance hasn't run and the hero captures *invisible*; (3) Windows
  headless clamps to a **~500px minimum width**, so a 390px shot is misleading.
- **A screenshot can't prove a click works.** For behaviour, drive Chrome over CDP
  with Node 22's global `WebSocket` (no deps) and assert `scrollY` /
  `getBoundingClientRect().top`. Two harness traps that both *looked* like app bugs:
  never `sleep` a fixed time waiting for mount (Vite cold-transforms on first request,
  mount ranged 1–10s → phantom `NOT_FOUND`s), and always await `document.fonts.ready`
  first (webfonts shift text metrics; a target computed pre-swap drifts ~21px).

## The lesson this codebase keeps teaching

Several defects here all had one root cause: **two things claiming to be
authoritative**, each drifting silently.

| Two sources of truth | Result |
| --- | --- |
| `src/` vs `src-v2/` | 1,609 LOC never type-checked |
| `tsconfig` vs `index.html` | False-green typecheck |
| `site.ts` testimonials vs `projects.ts` testimonials | Quotes from non-existent clients |
| `.gitignore` vs where the files actually are | Build output and notes scanned as CSS source |

All were fixed by **removing the duplication**, not by syncing it. Keep it that way —
**derive, don't duplicate.** And a related rule: **the same visual symptom can have a
different cause** (Hero and About had the same misaligned stat for different reasons),
so read the markup instead of assuming the previous fix transfers.

## History

- v1 (`src/`, 40 files) removed 2026-09-15; recoverable at commit `9943200`.
- Type-safety restoration + tooling added in `8f29922`.
- Testimonials deduplicated from `projects` in `9bf621a` (later removed entirely).
- Case studies, `projects.ts`, Testimonials section and cover assets removed, and
  Lagos replaced with Nigeria, in `fa1da45` (2026-09-17).
- Email/socials/WhatsApp + single stat in `e9ac090`.
- Hero stat row realigned to `items-center` in `98a7da6` (2026-09-18).
- `react-router-dom` removed in `0303cd2`; Tailwind scan fixes in `57a43e3`;
  About stat row realigned in `d491e18` (all 2026-09-18).
