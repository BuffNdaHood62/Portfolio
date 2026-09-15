# Portfolio — Michael Nnamdi

React 19 + Vite 6 + TypeScript + Tailwind v4 single-page portfolio.

## Layout

- Source lives in **`src-v2/`** and is loaded by `index.html` → `/src-v2/main.tsx`.
  There is no `src/` directory; do not recreate one.
- `tsconfig.json` covers `src-v2` only. If you add a top-level source directory,
  add it to `include` — a `tsc` run that does not see your files still exits 0.
- Routing is **`HashRouter`** (static hosting; no server rewrites). Internal links
  must use `<Link>`/`useNavigate`. Never hand-write `href="#/..."` — derive routes
  from `data/projects.ts` so a slug rename cannot silently break a CTA.
- Content is data-driven: `data/site.ts` (copy, services, testimonials) and
  `data/projects.ts` (case studies). Prefer editing data over JSX.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on `0.0.0.0` |
| `npm run typecheck` | `tsc --noEmit` against `src-v2` |
| `npm run lint` / `lint:fix` | ESLint (TS + react-hooks + jsx-a11y) |
| `npm run format` / `format:check` | Prettier |
| `npm run build` | `tsc -b && vite build` |
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

## Publishing

- `.verdentc.json` defines the build contract: `npm ci && npm run build` → `dist`.
- Run `npm run verify` before handing off. A build that type-checks nothing can
  otherwise reach production unnoticed.
