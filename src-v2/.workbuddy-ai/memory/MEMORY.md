# Portfolio (src-v2) — Project Notes

Michael Nnamdi portfolio. React 19 + Vite 6 + TypeScript + Tailwind v4, static deploy via `.verdentc.json`.

## Non-obvious facts that cause bugs

- **Source root is `src-v2/`.** There is no `src/`. `index.html` loads `/src-v2/main.tsx`.
  `tsconfig.json` includes `src-v2` only. If you add a source dir, extend `include` —
  a `tsc` run that doesn't see the files **still exits 0**, producing a false green.
- **Router is `HashRouter`** (static host, no rewrites). Internal links must use
  `<Link>` / `useNavigate`. Hand-written `href="#/..."` bypasses the router and is the
  exact bug class that was fixed in Hero.tsx.
- **Routes are data-derived.** "Next case study" uses `relatedProjects()` (relevance
  scoring on shared type/industry/skills) — not array rotation.
- **Design tokens** live in `src-v2/index.css` `@theme`: `paper`, `surface`, `ink`,
  `muted`, `line`, `accent`. Invented names like `text-fog` / `border-acid` do **not**
  exist and fail silently (unstyled render).
- **Reduced motion is handled in two layers on purpose**: `useReducedMotion()` for
  framer-motion, plus a global `@media (prefers-reduced-motion)` block in `index.css`
  for CSS/compositor animation. Both are required — don't "dedupe" them.
- **Content is data-driven**: `data/site.ts` (copy/services/testimonials),
  `data/projects.ts` (case studies incl. `details`, `context`, `problem`, `process`,
  `outcomes`). Edit data before JSX.

## Workflow

- `npm run verify` = typecheck + lint + build. Run before handoff.
- `npm run dev` / `build` / `preview`; `typecheck`, `lint`, `lint:fix`, `format`, `format:check`.
- Quality gates: TypeScript strict + noUnused{Locals,Parameters} + verbatimModuleSyntax;
  ESLint 9 flat config (typescript-eslint type-checked, react-hooks, jsx-a11y); Prettier.

## Known deferred work

- **Bundle size**: ~449 KB raw / 140 KB gzip, driven by `framer-motion@13` pulling the
  full `motion-dom` engine. App only uses `motion.*`, `useMotionValue`, `useSpring`,
  `useReducedMotion`, `AnimatePresence`. Options: `LazyMotion` + `domAnimation`, the
  `framer-motion/dom/mini` entry, or `React.lazy` on the CaseStudy route.
- No test runner or CI yet. `verify` is the current gate.

## Environment gotchas (not project bugs)

- **Dev server: use `127.0.0.1`, NOT `0.0.0.0`.** `npm run dev` is
  `vite --host 0.0.0.0`, which **hangs silently** in this sandbox — no output,
  no listener, no error (may surface as esbuild `write EPIPE` loading
  `vite.config.ts`, which is a red herring). Working:
  `nohup npx vite --host 127.0.0.1 --port 5199 > /tmp/v.log 2>&1 &`
  Verify with `netstat -ano | grep <port>` + `curl` — never trust the log.
- `vite build` may fail with `[safe-delete] ... genie-trash ... ETIMEDOUT` in
  `prepareOutDir`/`emptyDir` — sandbox trash shim. Clears once `dist/` is emptied.
- `vite preview` can return 502 for assets through the sandbox proxy even when the
  files are correct. Verify by reading `dist/` directly.

## Content single-source-of-truth rule (learned the hard way)

- **Testimonials render from `projects`, NOT from a standalone list.** Each
  project carries its own `testimonial` in `data/projects.ts`, and
  `sections/Testimonials.tsx` maps over `projects`. Do not reintroduce a
  duplicate testimonial array in `site.ts` — the previous one drifted and ended
  up attributing quotes to companies (Pulse/Atlas/Waveform) that do not exist
  in the roster (Nairaflow/Kobo/Ajo/Owo). Fixed in `9bf621a`.
- `data/site.ts` holds only site-wide copy (name, role, intro, stats, socials,
  booking, process, services). Project-specific content lives in `projects.ts`.
- **Nav breakpoint is `lg`, not `md`.** Six links (work, approach, services,
  about, testimonials, contact) do not fit at 768px. If you add a seventh link,
  re-check the width or shorten a label.

## History

- v1 (`src/`, 40 files) removed 2026-09-15; recoverable at commit `9943200`.
- Type-safety restoration + tooling added in `8f29922`.
