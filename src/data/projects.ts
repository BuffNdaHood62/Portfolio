import coverPulse from '../assets/covers/pulse.svg';
import coverAtlas from '../assets/covers/atlas.svg';
import coverNomad from '../assets/covers/nomad.svg';
import coverWaveform from '../assets/covers/waveform.svg';
import beforePulse from '../assets/covers/pulse-before.svg';
import beforeAtlas from '../assets/covers/atlas-before.svg';
import beforeNomad from '../assets/covers/nomad-before.svg';
import beforeWaveform from '../assets/covers/waveform-before.svg';
import detailPulse from '../assets/covers/pulse-detail.svg';
import detailAtlas from '../assets/covers/atlas-detail.svg';
import detailNomad from '../assets/covers/nomad-detail.svg';
import detailWaveform from '../assets/covers/waveform-detail.svg';

export type ProjectType = 'Product UX' | 'Design System' | 'Creative Frontend';

export const projectTypes: ProjectType[] = ['Product UX', 'Design System', 'Creative Frontend'];

export const projectIndustries = ['Payments', 'Lending', 'Savings'];

export const projectSkills = [
  'Research',
  'Design Tokens',
  'WebGL',
  'Motion Design',
  'Conversion',
  'React',
];

export interface CaseStudy {
  slug: string;
  title: string;
  category: string;
  type: ProjectType;
  industry: string;
  skills: string[];
  year: string;
  client: string;
  role: string;
  timeline: string;
  stack: string[];
  blurb: string;
  details: string[];
  cover: string;
  before: string;
  gallery: { src: string; caption: string }[];
  testimonial: { quote: string; author: string; role: string };
  context: string;
  problem: string;
  process: { index: string; title: string; body: string }[];
  solution: string;
  outcomes: { value: string; label: string }[];
  impact: string;
}

/** Scores how closely two projects relate — shared type, industry and skills. */
export function relatedProjects(project: CaseStudy, count = 2) {
  return projects
    .filter((p) => p.slug !== project.slug)
    .map((p) => {
      const sharedSkills = p.skills.filter((s) => project.skills.includes(s));
      let score = sharedSkills.length;
      if (p.type === project.type) score += 3;
      if (p.industry === project.industry) score += 2;
      return {
        project: p,
        score,
        reasons: [
          p.type === project.type ? p.type : null,
          p.industry === project.industry ? p.industry : null,
          ...sharedSkills,
        ].filter(Boolean) as string[],
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

export const projects: CaseStudy[] = [
  {
    slug: 'nairaflow',
    title: 'Nairaflow',
    category: 'Payments Platform',
    type: 'Product UX',
    industry: 'Payments',
    skills: ['Research', 'Conversion', 'React'],
    year: '2026',
    client: 'Nairaflow (Series B fintech, Lagos)',
    role: 'Lead Product Designer & Frontend',
    timeline: '14 weeks',
    stack: ['Figma', 'React', 'TypeScript', 'Recharts'],
    blurb:
      'Rebuilding onboarding and the core dashboard for a cross-border payments platform — activation up 34% in one quarter.',
    details: [
      'Nairaflow lets Nigerians in the diaspora send money home instantly, and lets local businesses collect in naira. The product had found real value with its champions, but new customers were churning before their first successful transfer. I embedded with the product team in Lagos for 14 weeks, owning onboarding and the core dashboard end to end.',
      'The engagement spanned research, interaction design, visual design and production React — including the experiment instrumentation that let the team ship with confidence.',
    ],
    cover: coverPulse,
    before: beforePulse,
    gallery: [
      { src: coverPulse, caption: 'The redesigned dashboard — transfers and collections first, everything else one level down' },
      { src: detailPulse, caption: 'Progressive onboarding: first transfer value shown before setup completes' },
      { src: beforePulse, caption: 'The original dashboard — data-first, task-last' },
    ],
    testimonial: {
      quote:
        'Michael rebuilt our onboarding end to end and activation jumped 34% in one quarter. The rare designer who ships production code and sweats the metrics.',
      author: 'Chiamaka Obi',
      role: 'VP Product, Nairaflow',
    },
    context:
      'Nairaflow serves two sides of one market: diaspora senders funding transfers in pounds and dollars, and Nigerian merchants collecting in naira. Product usage was strong among early adopters, but only 38% of sign-ups ever completed a first transaction — the moment the product proves itself.',
    problem:
      'Onboarding demanded 11 fields and a KYC wait before showing any value, and the dashboard buried the two daily jobs — send and collect — under data categories. Support tickets told the story: "I signed up, but I don\'t know what to do first."',
    process: [
      {
        index: '01',
        title: 'Research sprint',
        body: 'Interviewed 12 senders and merchants in Lagos and London, and mined 300+ support tickets. Mapped the activation funnel and found the drop-off concentrated at KYC and first transfer.',
      },
      {
        index: '02',
        title: 'Progressive onboarding',
        body: 'Replaced the 11-field wall with a progressive profile: verify identity once, watch one live exchange-rate quote lock in, then finish setup in context.',
      },
      {
        index: '03',
        title: 'Dashboard redesign',
        body: 'Reorganised the dashboard around the two daily jobs — send money home, collect payments — with rates, balances and everything else one level down.',
      },
      {
        index: '04',
        title: 'Ship & measure',
        body: 'Built the onboarding flow in React myself, paired with Nairaflow engineers on the dashboard, and instrumented every step for the A/B rollout.',
      },
    ],
    solution:
      'A progressive onboarding that shows real product value in under three minutes, and a dashboard redesigned around daily jobs instead of data categories. Both shipped behind flags and rolled out cohort by cohort across Nigeria, Ghana and the UK.',
    outcomes: [
      { value: '+34%', label: 'Sign-up to first transaction' },
      { value: '-41%', label: 'Onboarding support tickets' },
      { value: '2.6×', label: 'Weekly active transfers' },
    ],
    impact:
      'Within one quarter of full rollout, activation rose from 38% to 51% and onboarding-related support volume dropped by 41%. The progressive-setup pattern became the template for every new Nairaflow corridor.',
  },
  {
    slug: 'kobo',
    title: 'Kobo',
    category: 'Lending Infrastructure',
    type: 'Design System',
    industry: 'Lending',
    skills: ['Design Tokens', 'React'],
    year: '2025',
    client: 'Kobo (SME lending infrastructure, Lagos)',
    role: 'Design Systems Lead',
    timeline: '20 weeks',
    stack: ['Figma', 'Storybook', 'React', 'Style Dictionary'],
    blurb:
      'Unifying a lending platform built through mergers into a token-first design system used by 5 teams and 90 engineers.',
    details: [
      'Kobo provides credit scoring and loan origination infrastructure to Nigerian banks and microfinance institutions. The product had grown through acquisitions, and every acquired team brought its own UI habits. I led the design-systems effort for 20 weeks — part designer, part diplomat.',
      'The system was built to be adopted, not admired: lint rules, migration clinics and a public adoption dashboard made the healthy path the easy path.',
    ],
    cover: coverAtlas,
    before: beforeAtlas,
    gallery: [
      { src: coverAtlas, caption: 'The consolidated component library — 38 components, one vocabulary' },
      { src: detailAtlas, caption: 'Three-tier token architecture: primitive → semantic → component' },
      { src: beforeAtlas, caption: 'Before: five product teams, five different button styles' },
    ],
    testimonial: {
      quote:
        'Our design system went from a Figma graveyard to a living library the whole org actually uses. Delivery speed on new features roughly doubled.',
      author: 'Emeka Eze',
      role: 'Head of Engineering, Kobo',
    },
    context:
      'Kobo\'s platform serves banks, microfinance institutions and BNPL startups across Nigeria. After three acquisitions, the product carried four teams\' worth of UI patterns: three button styles, two date pickers and no shared vocabulary — a real problem when every screen must pass partner bank security review.',
    problem:
      'Design and engineering were working from different sources of truth. Figma components drifted from code, new features took weeks of bespoke UI work, and visual regressions were caught by partner banks — not by Kobo.',
    process: [
      {
        index: '01',
        title: 'Component audit',
        body: 'Catalogued 214 UI instances across the platform. Consolidated them into 38 components with clear variants — and killed 60 one-off patterns.',
      },
      {
        index: '02',
        title: 'Token architecture',
        body: 'Built a three-tier token system (primitive → semantic → component) synced between Figma and code through Style Dictionary, so a colour change ships everywhere at once.',
      },
      {
        index: '03',
        title: 'Living documentation',
        body: 'Every component ships in Storybook with usage guidelines, do/don\'t examples and accessibility notes in plain English — the docs are the contract.',
      },
      {
        index: '04',
        title: 'Adoption program',
        body: 'Ran migration clinics with each Lagos-based team and added lint rules that nudge new code toward system components. Adoption tracked publicly on a dashboard.',
      },
    ],
    solution:
      'A token-first system of 38 documented React components, generated documentation, and a governance model the org actually follows. New features now assemble from the shelf instead of baking from scratch.',
    outcomes: [
      { value: '2×', label: 'Feature delivery speed' },
      { value: '87%', label: 'Component adoption after 6 months' },
      { value: '-63%', label: 'Visual QA regressions' },
    ],
    impact:
      'Six months post-launch, 87% of new UI ships from system components and feature teams report roughly doubled delivery speed on standard flows. Partner-bank security reviews that once flagged visual inconsistencies now pass the platform first time.',
  },
  {
    slug: 'ajo',
    title: 'Ajo',
    category: 'Savings App',
    type: 'Product UX',
    industry: 'Savings',
    skills: ['Research', 'Conversion'],
    year: '2025',
    client: 'Ajo (consumer savings startup, Lagos)',
    role: 'Product Designer',
    timeline: '10 weeks',
    stack: ['Figma', 'React Native', 'Paystack'],
    blurb:
      'A goal-based savings app redesigned around how Nigerians actually save — sign-up to funded goal up 21%.',
    details: [
      'Ajo digitises the rotating savings culture it is named after: friends and family saving toward shared goals. Despite strong word-of-mouth growth, the web onboarding converted at 1.9% — people browsed, but never funded their first goal. I spent 10 weeks redesigning the flow around how that decision actually happens.',
      'The goal-first model, upfront fee transparency and the "start with ₦500" path came directly from diary-study evidence — then survived eight rounds of moderated testing before a single line of production code changed.',
    ],
    cover: coverNomad,
    before: beforeNomad,
    gallery: [
      { src: coverNomad, caption: 'Goal-first flow: target, amount and schedule as persistent cards' },
      { src: detailNomad, caption: 'Start with ₦500 — lowering the barrier to a funded first goal' },
      { src: beforeNomad, caption: 'Before: a linear form that lost people before they saved a kobo' },
    ],
    testimonial: {
      quote:
        'Michael took a flow we had stopped questioning and made it the strongest part of our funnel. Funded goals are up 21% and climbing.',
      author: 'Funmi Adeyemi',
      role: 'CEO, Ajo',
    },
    context:
      'Ajo targets young Nigerian professionals saving for school fees, December rent and group goals with friends. Content marketing drove strong top-of-funnel traffic, but the web onboarding converted at 1.9% — well below category benchmarks.',
    problem:
      'The flow treated saving like a bank application: one long form, no way to try a goal before committing, and fees only visible at the last step. Users researched on Ajo, then saved the old way — cash in an envelope, trust in the group.',
    process: [
      {
        index: '01',
        title: 'Journey mapping',
        body: 'Session recordings and 9 diary-study participants revealed a two-session pattern: explore goals on mobile during the commute, decide in the evening. The flow fought both.',
      },
      {
        index: '02',
        title: 'Goal-first redesign',
        body: 'Reframed the flow around a persistent goal plan: target, amount and schedule captured as cards, with fee transparency from the first screen.',
      },
      {
        index: '03',
        title: 'Start small',
        body: 'Introduced a "start with ₦500" path — fund a real goal with pocket change instead of facing a minimum deposit wall. The single most requested change in research.',
      },
      {
        index: '04',
        title: 'Continuous testing',
        body: 'Prototyped in Figma, validated with 8 moderated tests, then shipped behind an experiment with the funding funnel instrumented end to end.',
      },
    ],
    solution:
      'A goal-first onboarding with upfront fee transparency, cross-device continuity and a start-small funding path. The redesign treats saving like a habit to begin — not a form to survive — and meets people where Nigeria\'s savings culture already lives.',
    outcomes: [
      { value: '+21%', label: 'Sign-up to funded goal' },
      { value: '+45%', label: 'Cross-device completions' },
      { value: '31%', label: 'Of new goals start at ₦500' },
    ],
    impact:
      'Conversion rose from 1.9% to 2.3% within two months of rollout, and nearly a third of all new goals now start with the small-stakes path — recovering intent that previously leaked out of the funnel entirely.',
  },
  {
    slug: 'owo',
    title: 'Owo',
    category: 'Payments Brand Experience',
    type: 'Creative Frontend',
    industry: 'Payments',
    skills: ['WebGL', 'Motion Design', 'React'],
    year: '2024',
    client: 'Owo (payments infrastructure, Lagos)',
    role: 'Creative Designer & Frontend',
    timeline: '8 weeks',
    stack: ['React', 'Three.js', 'GSAP', 'WebGL'],
    blurb:
      'An award-grade interactive site where live payment activity becomes the artwork — average session up to 3.4 minutes.',
    details: [
      'Owo builds payment rails for African businesses, and wanted a site that felt like the speed of its infrastructure. Over 8 weeks I art-directed and built an experience where the homepage visualises live transaction flow as generative art — every payment that crosses the network becomes part of the piece.',
      'The build pushed performance as hard as aesthetics: adaptive quality tiers hold 60fps on mid-range Android phones (the majority of Nigerian traffic), with a reduced-motion path that keeps the art direction intact.',
    ],
    cover: coverWaveform,
    before: beforeWaveform,
    gallery: [
      { src: coverWaveform, caption: 'Transaction-reactive visuals — the network rendered as light' },
      { src: detailWaveform, caption: 'Merchant stories generating their own visual identity' },
      { src: beforeWaveform, caption: 'Before: a standard grid that bounced in 29 seconds' },
    ],
    testimonial: {
      quote:
        'The site Michael designed and built for us feels like nothing else in our category. Enterprise clients mention it in the first five minutes of every call.',
      author: 'Derin Ajayi',
      role: 'Founder, Owo',
    },
    context:
      'Owo competes for enterprise merchants against established African payment giants. Their old site was a standard feature grid — functional, forgettable, and bounced in under 30 seconds. For a company whose whole pitch is speed and reliability, the site said neither.',
    problem:
      'Nothing about the site communicated what Owo does at scale: thousands of transactions settling per second, quietly, reliably. Enterprise buyers had no reason to feel the difference — and in payments, trust is felt before it is proven.',
    process: [
      {
        index: '01',
        title: 'Art direction',
        body: 'Defined a visual language where live network activity drives the design — flow fields, light trails and typography that pulse with real transaction volume.',
      },
      {
        index: '02',
        title: 'Reactive visuals',
        body: 'Built a WebGL layer driven by anonymised transaction events: the site literally visualises the rails it sells, so browsing is believing.',
      },
      {
        index: '03',
        title: 'Editorial storytelling',
        body: 'Replaced the feature grid with a narrative feed — uptime stories, merchant spotlights from Kano to Port Harcourt, and architecture notes for technical buyers.',
      },
      {
        index: '04',
        title: 'Performance pass',
        body: 'Tuned the experience to hold 60fps on mid-range Android: adaptive quality tiers, lazy shader loading and a reduced-motion fallback that keeps the art direction.',
      },
    ],
    solution:
      'An editorial, transaction-reactive brand experience where the product proves itself on the homepage. Browsing Owo now feels like watching the rails move — which is exactly the pitch.',
    outcomes: [
      { value: '3.4 min', label: 'Average session (from 0:29)' },
      { value: '+58%', label: 'Returning visitors' },
      { value: '2 ×', label: 'Site-of-the-day features' },
    ],
    impact:
      'Average session length grew from 29 seconds to 3.4 minutes and returning traffic rose 58%. The site picked up two site-of-the-day features and, more importantly, enterprise demos requested through it doubled within a quarter.',
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
