export const site = {
  name: 'Michael Nnamdi',
  firstName: 'Michael',
  role: 'UI/UX Designer & Creative Frontend',
  tagline: 'Interfaces that feel alive — and ship.',
  email: 'hello@michaelnnamdi.design',
  location: 'Lagos, Nigeria · working worldwide',
  availability: 'Available for Q4 2026 projects',
  intro:
    'I blend product thinking with production-grade frontend craft, so the design you approve is the design your users get. Most designers hand off mockups. I hand off working interfaces.',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Dribbble', href: 'https://dribbble.com/' },
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'Read.cv', href: 'https://read.cv/' },
  ],
  stats: [
    { value: '8+', label: 'Years designing & shipping' },
    { value: '40+', label: 'Products launched with teams' },
    { value: '+28%', label: 'Median conversion lift across projects' },
  ],
  marquee: [
    'Product Design',
    'Design Systems',
    'Creative Frontend',
    'Prototyping',
    'Motion & Interaction',
    'UX Research',
  ],
};

export const process = [
  {
    index: '01',
    title: 'Discover',
    body: 'Stakeholder interviews, analytics teardown and user research. We find the real problem before touching a pixel — you get a written point of view, not a mood board.',
  },
  {
    index: '02',
    title: 'Design',
    body: 'Flows, wireframes and high-fidelity UI in tight weekly loops. Interactive prototypes you can click, test with users and sign off on — no static-page guessing.',
  },
  {
    index: '03',
    title: 'Deliver',
    body: 'I build the frontend myself or pair with your engineers. Design tokens, components and motion specs ship to production — what you approved is what goes live.',
  },
];

export const services = [
  {
    title: 'Product UX',
    body: 'End-to-end product design: research, flows, wireframes and polished UI for web and mobile apps that need to do more than look good.',
    tags: ['Research', 'Flows & IA', 'UI Design', 'Usability testing'],
  },
  {
    title: 'Design Systems',
    body: 'Token-first component libraries that keep large products consistent and fast to build — documented and wired for engineering handoff.',
    tags: ['Tokens', 'Component libraries', 'Documentation', 'Governance'],
  },
  {
    title: 'Creative Frontend',
    body: 'Award-grade marketing sites and interactive experiences built with React — motion, 3D and micro-interactions with production performance.',
    tags: ['React & Vite', 'Motion design', 'WebGL/Three.js', 'Performance'],
  },
];

export const testimonials = [
  {
    quote:
      'Alex rebuilt our onboarding end to end and activation jumped 34% in one quarter. The rare designer who ships production code and sweats the metrics.',
    author: 'Maya Lindqvist',
    role: 'VP Product, Pulse',
    rating: 5,
  },
  {
    quote:
      'Our design system went from a Figma graveyard to a living library the whole org actually uses. Delivery speed on new features roughly doubled.',
    author: 'Daniel Okafor',
    role: 'Head of Engineering, Atlas',
    rating: 5,
  },
  {
    quote:
      'The site Alex designed and built for us feels like nothing else in our category. Clients mention it in the first five minutes of every call.',
    author: 'Sofia Marchetti',
    role: 'Founder, Waveform',
    rating: 5,
  },
];

export const estimateConfig = {
  currency: '€',
  base: { 'Product UX': 12000, 'Design System': 18000, 'Creative Frontend': 15000 } as Record<string, number>,
  scope: [
    {
      id: 'standard',
      label: 'Standard',
      mult: 1,
      desc: 'One focused engagement — a single flow, system or site.',
    },
    {
      id: 'advanced',
      label: 'Advanced',
      mult: 1.5,
      desc: 'Multi-flow product work with research and testing baked in.',
    },
    {
      id: 'full',
      label: 'Full-scale',
      mult: 2.2,
      desc: 'End-to-end ownership: strategy, design and shipped frontend.',
    },
  ],
  timeline: [
    { id: 'relaxed', label: 'Relaxed', mult: 0.95, desc: 'Start in 4+ weeks, flexible milestones.' },
    { id: 'standard', label: 'Standard', mult: 1, desc: 'Start within 2–4 weeks.' },
    { id: 'rush', label: 'Rush', mult: 1.25, desc: 'Start within 2 weeks, priority scheduling.' },
  ],
};

export const budgetOptions = ['< €5k', '€5–10k', '€10–25k', '€25–50k', '€50k+', 'Not sure yet'];

export const booking = {
  label: 'Free 30-min intro call',
  timezone: 'WAT — Lagos (UTC+1)',
  daysAhead: 14,
  times: ['09:00', '10:30', '13:00', '15:00', '16:30'],
};

/** Deterministic pseudo-availability so the calendar looks real without a backend. */
export function isSlotBooked(dayIndex: number, slotIndex: number) {
  return ((dayIndex + 2) * (slotIndex + 3)) % 5 === 0;
}
