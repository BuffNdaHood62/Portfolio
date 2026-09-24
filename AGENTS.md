# Portfolio — Michael Nnamdi

React 19 + Vite 6 + TypeScript + Tailwind v4 single-page portfolio.
Frontend-developer site: honest skills, shipped projects, and a published learning
roadmap (structure inspired by developer-journey portfolios).

## Layout

- Source lives in **`src-v2/`** and is loaded by **`index.html` at the repo root** →
  `/src-v2/main.tsx`. There is no `src/` directory; do not recreate one, and do not go
  looking for `src-v2/index.html` — every `<head>` change belongs in the root file.
- `tsconfig.json` covers `src-v2` only. If you add a top-level source directory,
  add it to `include` — a `tsc` run that does not see your files still exits 0.
- **There is no router.** The app is one page: `App.tsx` renders `Nav`, `main > Home`
  and `Footer`. In-page navigation is `scrollIntoView` from the shared `sections` list;
  each section carries `scroll-mt-24` to clear the fixed header. Do not reintroduce
  `react-router` without a second page — a `HashRouter` used to be here, and it made
  `href="#services"` parse as a *route* named `services` instead of scrolling.
- Page order: `Hero`, `About`, `Skills`, `Work`, `Roadmap`, `Contact`. `Work` holds both
  the shipped projects and the "Coming next" queue in one `#work` anchor; the two grids
  carry `data-group="shipped"` / `data-group="queue"` because the consistency tests count
  them separately.
- Content is data-driven: **`data/site.ts` is the only data file.** Prefer editing data
  over JSX. It exports `sections` (the five anchored sections, rendered by both `Nav`
  and `Footer`), `skills` / `projects` / `upcoming` / `roadmap`, the `aboutMeta` grid,
  the derived `stats` (hero numbers are computed from those arrays — never typed), and
  the prose constant `country` — interpolate rather than restating values in copy.
- **Section numbers are derived, not stored.** `SectionHeading` renders
  `sectionNumber(id)` from the section's position in `sections`. Reordering `sections`
  renumbers every heading and the roadmap consistency test together.
- **Theme is a runtime class flip.** `index.css` defines `--paper`/`--surface`/`--ink`/
  `--muted`/`--line`/`--accent` on `:root` and `.dark`, exposed to Tailwind via
  `@theme inline` (plain `@theme` would bake the value into the utility and the toggle
  would silently do nothing). A bootstrap `<script>` in `index.html` applies the stored
  choice before first paint; `lib/theme.ts` reads the `dark` class React renders from.
  All three must agree on the `'theme'` storage key and `'dark'` class name — the
  reload check in `tests/suites/theme.mjs` fails when they don't.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on `0.0.0.0` |
| `npm run typecheck` | `tsc --noEmit` against `src-v2` |
| `npm run lint` / `lint:fix` | ESLint (TS + react-hooks + jsx-a11y) |
| `npm run format` / `format:check` | Prettier |
| `npm run build` | `tsc -b && vite build` |
| `npm run test:e2e` | Drive the built site in real Chrome over CDP (`node tests/run.mjs`) |
| `npm run assets` | Regenerate the raster brand assets from `public/favicon.svg` |
| `npm run verify` | typecheck + lint + build — **run before handoff** |

## Conventions

- `strict` + `noUnusedLocals` + `noUnusedParameters` + `verbatimModuleSyntax` are on.
  Use `import type { ... }` for type-only imports.
- Respect reduced motion — there are **three** layers, and all three are needed:
  `useReducedMotion()` for framer-motion; the `prefers-reduced-motion` block in
  `index.css` for CSS/compositor animation (deliberate — see the comment there before
  removing it); and **`lib/scroll.ts` for in-page scrolling**. That third one is not
  optional: `scrollIntoView({ behavior: 'smooth' })` animates *regardless* of the
  preference, and neither of the other two layers reaches it — measured at 25 distinct
  scroll positions with reduced motion active. Use `scrollToSection()` /
  `scrollToPageTop()` instead of calling `scrollIntoView` or `window.scrollTo` directly.
- Use the design tokens (`bg-paper`, `text-ink`, `text-muted`, `border-line`,
  `text-accent`) — they resolve through the `--paper`…`--accent` custom properties and
  flip with the theme automatically. Do not invent token names such as `text-fog` or
  `border-acid`, and do not hardcode hex colors in components: they will not follow
  dark mode.
- Decorative motion wrappers: prefer the existing `Reveal` / `LineMask` / `Magnetic`
  components over one-off animation code. `Reveal` takes `as="li"` for list rows so an
  `<ol>` never gets a `<div>` child.
- **Never restate a fact that lives in `data/site.ts`.** Interpolate it. A hardcoded
  "For 3+ years" beside a stat saying 3+ is how this codebase has repeatedly drifted:
  the same bug shipped once already as "8+ years". `tests/suites/consistency.mjs`
  enforces it (stats vs. rendered card counts, availability pill vs. Contact intro,
  country everywhere, roadmap numbering), and `noUnusedLocals` catches the common case
  by flagging the import you stopped using.
- **Derive list positions; don't store them.** Roadmap numbers, section numbers and
  hero stats all come from array order and counts.
- Skill levels are honest labels from `SkillLevel` (`core` / `confident` / `learning`),
  never percentages. Roadmap stages carry `RoadmapStatus` (`done` / `in-progress` /
  `next` / `planned`); flipping a status updates the page and the stats together.
- Project links must be real repository URLs (`github.com/BuffNdaHood62/<repo>`) —
  the consistency suite fails shipped cards whose link is a bare profile or off-domain.

## Brand assets

- `public/favicon.svg` is the **source of truth** for the mark. Edit it, then run
  `npm run assets` to rebuild `og-image.png`, `favicon-32.png` and
  `apple-touch-icon.png`. Never hand-edit the PNGs — they are generated.
- The og-image share card copy lives in `tools/generate-brand-assets.mjs`; update it in
  the same change as any headline/role change.
- The mark is a stroked `<path>`, not a `<text>` element, because a favicon is a
  standalone document with no `@font-face`: text would render in whatever font the
  viewer's machine happens to have.
- It carries no accent dot on purpose. The dot used to be there and merged into the
  M's right leg at 32px — the gap is under half a pixel at 16px.
- `tests/suites/meta.mjs` fetches every asset the `<head>` declares and checks the
  content type, because the static host answers missing files with `index.html` at
  HTTP 200 — a status-only check reports success for a file that is not there. It also
  cross-checks both `theme-color` metas against the light and dark `--paper` tokens by
  flipping the class, so it passes identically on a dark-boot browser.

## Publishing

- `.verdentc.json` defines the build contract: `npm ci && npm run build` → `dist`.
- Run `npm run verify` before handing off. A build that type-checks nothing can
  otherwise reach production unnoticed.
- **Pending: `og:image`, `og:url` and `canonical` are root-relative.** Crawlers want
  absolute URLs and there is no canonical domain yet. Once there is one, prefix all
  three with the origin — the comment in `index.html` marks the spot.
- **Pending: real profile links.** `site.socials` currently carries GitHub, email and
  WhatsApp only — add LinkedIn etc. with real URLs, not bare homepages.
