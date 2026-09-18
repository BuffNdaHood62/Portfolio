import type { IconName } from '../components/Icon';

export const site = {
  name: 'Michael Nnamdi',
  firstName: 'Michael',
  role: 'UI/UX Designer & Creative Frontend',
  tagline: 'The design you approve is the design your users get.',
  email: 'michaelnnamdi04@gmail.com',
  location: 'Nigeria · working worldwide',
  availability: 'Available for Q4 2026 projects',
  intro:
    'I blend product thinking with production-grade frontend craft, so the design you approve is the design your users get. Most designers hand off mockups. I hand off working interfaces.',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
    { label: 'Dribbble', href: 'https://dribbble.com/', icon: 'dribbble' },
    { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
    { label: 'Read.cv', href: 'https://read.cv/', icon: 'readcv' },
    { label: 'WhatsApp', href: 'https://wa.me/2349065239603', icon: 'whatsapp' },
  ] satisfies { label: string; href: string; icon: IconName }[],
  stats: [{ value: '3+', label: 'years of designing & shipping' }],
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

export const booking = {
  label: 'Free 30-min intro call',
  timezone: 'WAT — Nigeria (UTC+1)',
  times: ['09:00', '10:30', '13:00', '15:00', '16:30'],
};

/** How many of a single day's slots the fabricated pattern may take. */
const MAX_BOOKED_PER_DAY = 2;

/** The raw pattern, before the per-day cap is applied. */
const looksTaken = (dayIndex: number, slotIndex: number) =>
  ((dayIndex + 2) * (slotIndex + 3)) % 5 === 0;

/**
 * Deterministic pseudo-availability so the calendar looks real without a backend.
 *
 * The cap is the point. The raw pattern takes *every* slot whenever
 * `dayIndex ≡ 3 (mod 5)`, which rendered whole days with nothing left to book —
 * five struck-through buttons under an "Available slots" heading, and no way
 * forward. The availability is invented anyway, so a sold-out day could only
 * ever turn away an enquiry.
 */
export function isSlotBooked(dayIndex: number, slotIndex: number) {
  if (!looksTaken(dayIndex, slotIndex)) return false;
  let takenEarlier = 0;
  for (let earlier = 0; earlier < slotIndex; earlier += 1) {
    if (looksTaken(dayIndex, earlier)) takenEarlier += 1;
  }
  return takenEarlier < MAX_BOOKED_PER_DAY;
}
