# Portfolio — Michael Nnamdi

React 19 + Vite 6 + TypeScript + Tailwind v4 single-page portfolio.

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
- Content is data-driven: **`data/site.ts` is the only data file.** Prefer editing data
  over JSX. It also exports `sections` (the four anchored sections, rendered by both
  `Nav` and `Footer`) and the prose constants `country`, `bookingWindow` and
  `yearsExperience` — interpolate those rather than restating the value in copy.

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
- Respect reduced motion: use `useReducedMotion()` for framer-motion. The
  `prefers-reduced-motion` block in `index.css` covers CSS-only animation and is
  deliberate — see the comment there before removing it.
- Use the design tokens in `index.css` `@theme` (`bg-paper`, `text-ink`, `text-muted`,
  `border-line`, `text-accent`). Do not invent token names such as `text-fog` or
  `border-acid` — they do not exist and will silently render unstyled.
- Decorative motion wrappers: prefer the existing `Reveal` / `LineMask` / `Magnetic`
  components over one-off animation code.
- **Never restate a fact that lives in `data/site.ts`.** Interpolate it. A hardcoded
  "For 3+ years" beside a stat saying 3+ is how this codebase has repeatedly drifted:
  the same bug shipped once already as "8+ years". `tests/suites/consistency.mjs`
  enforces it, and `noUnusedLocals` catches the common case by flagging the import you
  stopped using.
- **Derive list positions; don't store them.** `process` used to carry its own
  `index: '01'`, so reordering the array would have printed 02, 01, 03.

## Brand assets

- `public/favicon.svg` is the **source of truth** for the mark. Edit it, then run
  `npm run assets` to rebuild `og-image.png`, `favicon-32.png` and
  `apple-touch-icon.png`. Never hand-edit the PNGs — they are generated.
- The mark is a stroked `<path>`, not a `<text>` element, because a favicon is a
  standalone document with no `@font-face`: text would render in whatever font the
  viewer's machine happens to have.
- It carries no accent dot on purpose. The dot used to be there and merged into the
  M's right leg at 32px — the gap is under half a pixel at 16px.
- `tests/suites/meta.mjs` fetches every asset the `<head>` declares and checks the
  content type, because the static host answers missing files with `index.html` at
  HTTP 200 — a status-only check reports success for a file that is not there.

## Publishing

- `.verdentc.json` defines the build contract: `npm ci && npm run build` → `dist`.
- Run `npm run verify` before handing off. A build that type-checks nothing can
  otherwise reach production unnoticed.
- **Pending: `og:image`, `og:url` and `canonical` are root-relative.** Crawlers want
  absolute URLs and there is no canonical domain yet. Once there is one, prefix all
  three with the origin — the comment in `index.html` marks the spot.
