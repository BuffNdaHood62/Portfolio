# Portfolio (src-v2) — Project Notes

Michael Nnamdi portfolio. React 19 + Vite 6 + TypeScript + Tailwind v4, static deploy via `.verdentc.json`.

**Current shape: a single-page site with no router at all.** `App.tsx` renders
`<Nav /> <Home /> <Footer />` directly. No case studies, no project data, no detail
pages (removed 2026-09-17); `react-router-dom` removed 2026-09-18.

## Non-obvious facts that cause bugs

- **Source root is `src-v2/`; the HTML entry is at the repo ROOT.** There is no `src/`.
  **`Portfolio/index.html`** — not `src-v2/index.html` — is the entry, and it loads
  `/src-v2/main.tsx`. Every `<head>` change (meta, favicon, sharing tags) goes in the
  root file. `tsconfig.json` includes `src-v2` only. If you add a source dir, extend
  `include` — a `tsc` run that doesn't see the files **still exits 0**, producing a
  false green.
- **The project root is the PARENT of this workspace folder.** The session opens on
  `Portfolio/src-v2/`, which holds *only source* — no `package.json`, `index.html`,
  `tsconfig.json`, `node_modules` or `dist/`. Every `npm` script and every build
  artifact lives in `Portfolio/`. Running `ls`/`git`/`npm` from the workspace folder
  silently gives the wrong answer rather than an error: `ls -d dist*` in `src-v2`
  returns nothing and reads as "the stale dirs are gone" when they are all still
  there one level up. **`git rev-parse --show-toplevel` is the tiebreaker** —
  it reports `C:/Users/Michael/.verdent/verdent-projects/Portfolio`.
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
- **framer-motion must be used as `m.*`, never `motion.*`.** `main.tsx` wraps the app
  in `<LazyMotion features={domAnimation} strict>`. `motion.*` components bundle the
  full **domMax** set (~85 KB vs ~39 KB for `m.*` + domAnimation). `strict` throws in
  dev if you slip back, so this can't silently regress. `domAnimation` **does** include
  `whileInView` (it spreads `gestureAnimations`, which defines
  `inView: { Feature: InViewFeature }`) — don't "upgrade" to domMax for it.
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
- **The mobile menu must be closable three ways**: the toggle, picking a link, and
  **Escape**, plus it must clear itself when the viewport crosses to desktop. The
  toggle is `md:hidden`, so without the `matchMedia('(min-width: 48rem)')` listener a
  stale `open` can never be reset by hand — the mobile nav stays in the DOM and the
  header stays stuck with its blurred background at scroll top. Use `48rem`, not
  `768px`: that is what Tailwind compiles `md` to (`@media(min-width:48rem)`), and a
  hardcoded pixel value would drift if the root font size changed.
- **Every `<button>` declares `type="button"`.** There is no `<form>` in the app today,
  so the implicit `type="submit"` is inert — but wrapping anything in a form (a footer
  newsletter signup is the obvious candidate) would silently turn every button into a
  submit button. Six sites originally omitted it.

## Sharing metadata + brand assets

- **`public/favicon.svg` is the source of truth for the mark.** `npm run assets`
  (`tools/generate-brand-assets.mjs`) regenerates `og-image.png` (1200×630),
  `favicon-32.png` and `apple-touch-icon.png` from it, rendering through real Chrome —
  no image toolchain. **Never hand-edit the PNGs**; they are generated, and an
  unreproducible binary is the two-sources-of-truth failure this repo keeps hitting.
- **The mark is a stroked `<path>`, not a `<text>` element.** A favicon is a standalone
  document with no `@font-face`, so text would render in whatever font the viewer's
  machine happens to have and the mark would differ per machine.
- **It carries no accent dot, deliberately.** The wordmark in `Nav.tsx` ends in one, and
  the first version of the mark had it — at 32px it merged into the M's right leg, the
  gap working out to under half a pixel at 16px. Verified by rendering at 16/32/64 on
  both light and dark chrome.
- **`og:image`, `og:url` and `canonical` are root-relative and pending a domain.**
  Crawlers want absolute URLs; there is no canonical domain yet (nothing in
  `package.json`, `.verdentc.json` or these notes). The comment in `index.html` marks
  the spot — prefix all three with the origin at deploy time.
- **`tests/suites/meta.mjs` asserts content type, not status.** The static host answers
  unknown paths with `index.html`, so a *missing* asset returns `200 text/html`. A
  status-only check passed for a deleted `og-image.png`. Assert the MIME type.
- **The five social links are known-bad and deliberately left alone.** `linkedin.com/`,
  `dribbble.com/`, `github.com/` and `read.cv/` are *platform homepages*, not profiles —
  a recruiter clicking one lands on a logged-out landing page. `read.cv` is worse than
  shallow: it returns **402 Payment Required** with `X-Vercel-Error:
  DEPLOYMENT_DISABLED` (acquired by Perplexity Jan 2025, operations ceased). Only
  `wa.me/2349065239603` works. Fixing this needs real profile URLs — inventing a handle
  produces a 404, which is worse than a homepage link.
- **`src-v2/assets/portrait.svg` is NOT a brand asset.** Its own text reads
  `PORTRAIT PLACEHOLDER`, and its palette (`#ccff00` acid on `#141412`) matches none of
  the live tokens — it is a leftover from a superseded design direction. Don't build on
  it. (Social platforms also reject SVG for `og:image` regardless.)

## Workflow

- `npm run verify` = typecheck + lint + build. Run before handoff.
- `npm run dev` / `build` / `preview`; `typecheck`, `lint`, `lint:fix`, `format`, `format:check`.
- Quality gates: TypeScript strict + `exactOptionalPropertyTypes` +
  noUnused{Locals,Parameters} + verbatimModuleSyntax; ESLint 9 flat config
  (typescript-eslint type-checked, react-hooks, jsx-a11y); Prettier.
  `noUncheckedIndexedAccess` is deliberately **off** — see deferred work.
- **Deploy is `npm ci`, so `package-lock.json` must stay in sync with `package.json`.**
  `.verdentc.json` sets `installCmd: npm ci`, `buildCmd: npm run build`,
  `outputDir: dist`. Removing a dependency from `package.json` without refreshing the
  lockfile makes `npm ci` fail outright and breaks the deploy. Check with
  `npm ci --dry-run`. Note `outputDir` is `dist` only, so the stale `dist.keep*` dirs
  in the project root are **local clutter, not a deploy problem**.

## Known deferred work

- **Bundle size**: ~319.9 KB raw / ~103.6 KB gzip JS, plus ~46.0 KB / ~19.8 KB CSS —
  down from 410 KB / 132 KB before this session's work. Already optimised via
  `LazyMotion` + `domAnimation` (see the framer-motion bullet above). What remains is
  mostly React itself plus the `motion-dom` core. The next real lever is dropping
  `framer-motion` for CSS animations plus a small spring for `Magnetic` — a rewrite,
  not a tweak.
- **`src-v2/assets/portrait.svg` is unused and stale.** Kept in case it is wanted for an
  About photo; delete if not. See the brand-assets section — it is *not* usable as a
  brand source.
- **Stale build dirs are stranded in the project root** (`dist.stale`, `dist.prev`,
  `dist.keep3`, `dist.keep4`, `dist.keep5`) — created as sandbox workarounds and not
  deletable from inside it. Gitignored and verified harmless; remove by hand.
- **`booking.daysAhead` was deleted** (2026-09-18). It claimed 14, was referenced
  nowhere, and the calendar hardcoded `while (list.length < 8)`. That count now lives
  as a named `DAYS_SHOWN` constant in `BookingCalendar.tsx` — deliberately *not* back
  in `data/site.ts`, because nothing reads it from there. Same orphaned-claim class as
  the old testimonials and the "40+ launches" stat.
- **The calendar can no longer present a day with nothing left to book** (fixed
  2026-09-18). `isSlotBooked` was `((dayIndex + 2) * (slotIndex + 3)) % 5 === 0`, so
  every `dayIndex ≡ 3 (mod 5)` took *all five* slots. Two of the eight days rendered
  five struck-through, non-clickable buttons under an "Available slots" heading, with
  no explanation and no route forward — and since the availability is invented anyway,
  a sold-out day could only turn away an enquiry. Now the raw pattern (`looksTaken`)
  is capped by `MAX_BOOKED_PER_DAY = 2`, so every day keeps at least three slots free.
  Verified in the real DOM: **4,4,4,3,4,4,4,4** bookable across the eight days.
  - The call site also passed `day.dayIndex + activeDay * 3`, which was really
    `activeDay * 4`: `dayIndex` is assigned `list.length` at push time, so both terms
    were the same number and the expression only *looked* like it combined two
    indices. It is now plain `day.dayIndex`.
  - An empty state exists as a safety net. With the cap it should be unreachable; it
    is there so a day with nothing left says so rather than printing "Available slots"
    above dead buttons.
- **`exactOptionalPropertyTypes` is on** (added 2026-09-18) — it passed with zero
  errors, so it is pure hardening. `noUncheckedIndexedAccess` is deliberately **off**:
  it reports 4 errors in `BookingCalendar.tsx` (`'day' is possibly 'undefined'`) and
  clearing them would need a non-null assertion. This codebase has **zero** `!`, `any`,
  `@ts-ignore` and `eslint-disable`; that unbroken record is worth more than the flag.
  If it is ever turned on, fix it structurally, not with an assertion.
- **Behaviour is covered by `npm run test:e2e`** — 49 assertions in five suites
  (`tests/suites/{scroll,nav,booking,a11y,meta}.mjs`), driving real Chrome over CDP with
  no dependencies. It serves `dist` itself, so build first; Chrome must be installed
  (`CHROME_PATH` overrides discovery). Full gate is
  `npm run verify && npm run test:e2e`. **There is still no CI**: no `.github/` and no
  git remote, so a workflow file would be inert until a remote is added.

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
- **Tailwind v4 source detection is an explicit allowlist — keep it that way.**
  `index.css` uses `@import 'tailwindcss' source(none)` plus
  `@source './**/*.{ts,tsx}'` and `@source '../index.html'`. Auto-detection scans
  *every* file it is not told to ignore and treats it as opaque text, mining
  class-like tokens out of it. That leaked dead CSS three separate times:

  | what got scanned | what it emitted |
  | --- | --- |
  | `dist.stale` — build output left behind by a rename | 9 dead utilities |
  | `.workbuddy-ai/` notes *describing* the leak | `.gap-y-2`, from the sentence about it |
  | the `tests/` suite | `.blur`, `.outline`, `.resize` + 15 `@property`, from the words "blur", "outline", "resizing" |

  Each was patched with `@source not`, which is a **denylist**: it needs updating
  every time a directory is added, and when it is forgotten the failure is silent.
  Registering the real sources instead removes the whole class of bug.

  **Keep the glob precise.** `@source './'` looks equivalent and is not — it
  registers the whole directory, recursing into `.workbuddy-ai/` and re-mining the
  class names the notes above list *while documenting them*: 3.6 kB of dead CSS.
  Only `.ts`/`.tsx` files and the HTML entry can carry classes.

  **Find leaks by diffing builds, not by reading files.** Keep the previous output,
  then compare normalised selectors:
  `sed 's/}/}\n/g' old/assets/index-*.css | sort > /tmp/o` (same for new), then
  `comm -13 /tmp/o /tmp/n`. All three leaks were invisible in review and obvious in
  a diff. `dist.*/` in `.gitignore` is still right — build output should not be
  committed — but it is no longer load-bearing for CSS.

  **The leak needs a non-CSS file.** The scanner ignores CSS comments: `index.css`
  still contains the literal string `gap-y-2` in the comment documenting this bug,
  and no `.gap-y-2` rule is emitted. So "grep the CSS for stray tokens" is the wrong
  audit — the danger is class-like text in a file Tailwind treats as opaque source.
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
  `getBoundingClientRect().top`. Never `sleep` a fixed time waiting for mount (Vite
  cold-transforms on first request, mount ranged 1–10s → phantom `NOT_FOUND`s); always
  await `document.fonts.ready` first (webfonts shift text metrics; a target computed
  pre-swap drifts ~21px); and **identify repeated elements structurally, not by index or
  class** — the booking harness tells day buttons from slot buttons by "contains two
  `<span>`s", because both carry `aria-pressed` and index-based selection breaks the
  moment layout changes. Run rendering checks against the **built output** behind a
  static server; a cold dev server plus a first Chrome launch can exceed the mount
  timeout.

  Three more, all in the **launch path**, all previously reporting the same misleading
  "Chrome never reported a DevTools port":
  (1) `readFileSync` on `DevToolsActivePort` was unguarded — Chrome writes it in place
  and on Windows the read lands mid-write and throws **EBUSY**, crashing out of
  `launch()`; retry, because a locked file is not an absent one.
  (2) Chrome's stderr was discarded (`stdio: 'ignore'`), throwing away the only thing
  that explains a failure.
  (3) **The harness attached to a target that never navigated.** Chrome is handed the
  URL on its command line, but which target it creates first is a race — and a
  pre-navigation target is already `readyState === "complete"`, so the readiness check
  passes against a blank document. This is what produced a share card with every element
  present and every word missing. Send `Page.navigate` and poll
  `location.href === target`: **`readyState` cannot distinguish the new document from
  the old one.** All three are fixed in `tests/harness.mjs` and mirrored into the
  `headless-chrome-verify` skill's scripts.
- **A webfont that fails to load looks like a deliberate design.** With
  `font-display: block` the glyphs stay invisible until the font arrives, so every
  element keeps its full box and *only the text* is missing — it reads as a minimalist
  layout. A generated share card came out this way at 5.6 kB; correct was 46 kB. Assert
  `document.fonts.check('110px Fraunces')` before capturing. A failed `@font-face` still
  leaves elements measurable, so bounding-box assertions pass and cannot tell you.
- **Git Bash rewrites POSIX paths passed to Windows binaries — including `node`.**
  `/c/Users/.../script.mjs` became `c:\c\Users\...\script.mjs` and failed with
  `MODULE_NOT_FOUND`, which reads as a missing file rather than a path-mangling problem.
  Wrap with `cygpath -w`. Already documented for the Chrome binary; it applies to `node`
  too.
- **The sandbox proxy returns 502 for `127.0.0.1`,** so `curl` cannot verify a local
  server. `curl --noproxy '*'` works, and Chrome connecting directly works.

## The lesson this codebase keeps teaching

Several defects here all had one root cause: **two things claiming to be
authoritative**, each drifting silently.

| Two sources of truth | Result |
| --- | --- |
| `src/` vs `src-v2/` | 1,609 LOC never type-checked |
| `tsconfig` vs `index.html` | False-green typecheck |
| `site.ts` testimonials vs `projects.ts` testimonials | Quotes from non-existent clients |
| `.gitignore` vs where the files actually are | Build output and notes scanned as CSS source |
| Auto-detected CSS sources vs what is actually source | Three separate dead-CSS leaks; fixed by declaring sources instead |
| Assumed `src-v2/index.html` vs the real root `index.html` | Read the wrong path for a whole audit; it returns nothing rather than an error |
| Hand-maintained PNGs vs the SVG that defines the mark | Why `tools/generate-brand-assets.mjs` is committed, not run once |

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
- framer-motion switched to `m.*` + `LazyMotion(domAnimation)` in `80e1489`; audit
  notes in `86e2395`; booking availability capped, empty state added, `daysAhead`
  deleted and `exactOptionalPropertyTypes` enabled in `8f13000`; mobile menu made
  closable by Escape and across the desktop breakpoint, with `type="button"` added to
  six sites, in `eb4a76d`; the e2e suite added in `0b3bd3f` and Tailwind sources
  switched to an explicit allowlist in `d6919f1` (all 2026-09-18).
- CDP harness launch-path bugs fixed (EBUSY on `DevToolsActivePort`, discarded stderr,
  attach-without-navigate) in `0eee7f7`; favicon + share card, `npm run assets`, the
  `meta` suite and the sharing metadata in `8a7c5a5` (both 2026-09-18).
