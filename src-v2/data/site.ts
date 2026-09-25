import type { IconName } from '../components/Icon';

/**
 * Facts that prose quotes, named once and interpolated everywhere they appear.
 *
 * This is not tidiness for its own sake. The old About section hardcoded "For 3+ years"
 * beside a stat that said 3+, and the two had already drifted once. Every number or
 * name below is stated once and derived from everywhere else.
 */
export const country = 'Nigeria';
export const buildsWith = 'React';

/**
 * The anchored sections, in page order. Nav and Footer both render this list, and
 * every section heading derives its number from its position here — never a stored
 * `index`. "Work" (#work) wraps both the shipped projects and the upcoming queue.
 */
export const sections = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'contact', label: 'Contact' },
] as const;

/** '01'…'NN' from a section's position in `sections` — never a stored number. */
export function sectionNumber(id: string): string {
  return String(
    sections.findIndex((s) => s.id === id) + 1,
  ).padStart(2, '0');
}

export const site = {
  name: 'Michael Nnamdi',
  firstName: 'Michael',
  handle: 'michael.nnamdi',
  role: 'Frontend Developer',
  tagline: 'Building web apps that ship.',
  email: 'michaelnnamdi04@gmail.com',
  location: `${country} · working worldwide`,
  availability: 'Open to opportunities',
  intro: `Frontend developer focused on clean, typed React — I take designs and turn them into interfaces that actually ship. I work with TypeScript and Tailwind daily, am building my way through Next.js and Supabase, and learn best by publishing what I make — one deployed project at a time.`,
  socials: [
    { label: 'GitHub', href: 'https://github.com/BuffNdaHood62', icon: 'github' },
    { label: 'Email', href: 'mailto:michaelnnamdi04@gmail.com', icon: 'mail' },
    { label: 'WhatsApp', href: 'https://wa.me/2349065239603', icon: 'whatsapp' },
  ] satisfies { label: string; href: string; icon: IconName }[],
};

/** Honest self-rating levels — a skill is exactly one of these, no fake percentages. */
export type SkillLevel = 'core' | 'confident' | 'learning';

export const skills = [
  {
    emoji: '⚛️',
    name: buildsWith,
    level: 'core',
    tag: 'Primary language',
    body: 'Components, hooks, state and composition. Every project I have shipped is React — with the strict TypeScript settings this site itself runs on.',
  },
  {
    emoji: '🟦',
    name: 'TypeScript',
    level: 'core',
    tag: 'Daily driver',
    body: 'Typed props, discriminated unions, `satisfies` over casts. I treat type errors as design feedback, not friction.',
  },
  {
    emoji: '🎨',
    name: 'Tailwind CSS',
    level: 'confident',
    tag: 'Styling',
    body: 'Token-driven styling with custom @theme systems — like the paper/ink palette behind this page — instead of one-off hex values.',
  },
  {
    emoji: '📐',
    name: 'HTML & CSS',
    level: 'confident',
    tag: 'Foundations',
    body: 'Semantic markup, flex/grid layout, responsive breakpoints and accessibility basics: landmarks, contrast, focus states.',
  },
  {
    emoji: '▲',
    name: 'Next.js',
    level: 'learning',
    tag: 'Actively learning',
    body: 'App Router, file-based routing and server components — learned by rebuilding Taskflow as a real task manager UI.',
  },
  {
    emoji: '⚡',
    name: 'Supabase & Postgres',
    level: 'learning',
    tag: 'Actively learning',
    body: 'Auth flows, typed tables and SQL policies, wired into Meridian Health EHR as my first real backend.',
  },
  {
    emoji: '🛠️',
    name: 'Tooling',
    level: 'confident',
    tag: 'Workflow',
    body: 'Git & GitHub, Vite, ESLint, Prettier, CI checks, Figma-to-code handoffs, and Vercel deploys.',
  },
] satisfies {
  emoji: string;
  name: string;
  level: SkillLevel;
  tag: string;
  body: string;
}[];

export const projects = [
  {
    emoji: '🌾',
    name: 'Gandaria Farms',
    url: 'https://github.com/BuffNdaHood62/Gandaria-Farms',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind'],
    status: 'Live on Vercel',
    body: 'Agribusiness marketing site built from Figma mockups: multi-page layout, real product photography and a token-based Tailwind theme. My first design-to-code-to-deploy cycle end to end.',
  },
  {
    emoji: '✅',
    name: 'Taskflow',
    url: 'https://github.com/BuffNdaHood62/Taskflow',
    tags: ['Next.js', 'TypeScript', 'Tailwind'],
    status: 'Shipped',
    body: 'Task manager UI in the Next.js App Router — kanban board, calendar and list views, a task detail panel, a command palette, and dark-mode theming.',
  },
];

export const upcoming = [
  {
    emoji: '🏥',
    name: 'Meridian Health EHR',
    url: 'https://github.com/BuffNdaHood62/meridian-health-ehr',
    tags: ['React', 'TypeScript', 'Supabase'],
    status: 'In progress',
    body: 'Electronic health records app: Supabase auth and Postgres data, clinician charts and dashboards, a CI pipeline and written engineering standards. My biggest codebase yet.',
  },
  {
    emoji: '🧩',
    name: 'Component library',
    url: null,
    tags: ['React', 'TypeScript', 'a11y'],
    status: 'Planned',
    body: 'Extract the accessible, token-driven components I keep rebuilding — buttons, dialogs, nav — into a documented library with its own site.',
  },
  {
    emoji: '🌀',
    name: 'Motion studies',
    url: null,
    tags: ['Framer Motion', 'CSS'],
    status: 'Planned',
    body: 'A series of small experiments in scroll choreography, springs and reduced-motion fallbacks — the polish layer I want to get genuinely good at.',
  },
];

export type RoadmapStatus = 'done' | 'in-progress' | 'next' | 'planned';

/**
 * The published learning roadmap. Statuses are data, so flipping a stage from
 * 'next' to 'in-progress' updates the page, the stats and the tests at once.
 */
export const roadmap: {
  title: string;
  body: string;
  status: RoadmapStatus;
}[] = [
  {
    title: 'HTML, CSS & JavaScript fundamentals',
    body: 'Semantic markup, layout, and the language itself — closures, async, the DOM — before any framework.',
    status: 'done',
  },
  {
    title: 'React + TypeScript',
    body: 'Components, hooks and typed props, practised on every project shipped since.',
    status: 'done',
  },
  {
    title: 'Design-to-code & Tailwind',
    body: 'Turning Figma mockups into responsive interfaces with token systems, not pixel-guessing.',
    status: 'done',
  },
  {
    title: 'Git, GitHub & deploys',
    body: 'Branching, PRs and Vercel deployments — every project on this page went through them.',
    status: 'done',
  },
  {
    title: 'Next.js App Router',
    body: 'Routing, server components and rendering modes, learned by building Taskflow.',
    status: 'in-progress',
  },
  {
    title: 'Supabase auth & Postgres',
    body: 'Real data and sessions behind Meridian Health EHR — the backend-for-frontend step.',
    status: 'in-progress',
  },
  {
    title: 'Testing & CI discipline',
    body: 'Automated checks that catch regressions before deploy, like the harness this site runs on.',
    status: 'next',
  },
  {
    title: 'Advanced motion & interaction polish',
    body: 'Scroll choreography, gesture physics and reduced-motion craft at production quality.',
    status: 'next',
  },
  {
    title: 'Full-stack fluency',
    body: 'Owning a feature end to end: schema, API, UI, deploy, monitor.',
    status: 'planned',
  },
];

export const aboutMeta = [
  { key: 'Focus', value: `${buildsWith} · TypeScript · UI craft` },
  { key: 'Loves', value: 'Clean components, honest states' },
  { key: 'Learning', value: 'Next.js & Supabase' },
  { key: 'Style', value: 'Ship, then sharpen' },
] as const;

/**
 * Hero stats derived from the content itself — the count of shipped projects is
 * whatever `projects` says, never a typed-in number that can drift.
 */
export const stats = [
  { value: String(projects.length), label: 'projects shipped' },
  {
    value: String(skills.filter((s) => s.level === 'core' || s.level === 'confident').length),
    label: 'technologies I work with',
  },
  {
    value: String(roadmap.filter((r) => r.status === 'in-progress').length),
    label: 'skills in progress right now',
  },
];
