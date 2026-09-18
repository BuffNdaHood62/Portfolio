import { useEffect, useState } from 'react';
import { site } from '../data/site';
import Magnetic from './Magnetic';

const links = [
  { id: 'approach', label: 'Approach' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Single-page site: every nav action is an in-page scroll. Each section
  // carries `scroll-mt-24` so it clears the fixed header.
  const goTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? 'bg-paper/85 backdrop-blur-md border-b border-line'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <button
          type="button"
          onClick={scrollToTop}
          className="font-display text-lg font-semibold tracking-tight"
        >
          {site.firstName} Nnamdi
          <span className="text-accent">.</span>
        </button>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => goTo(l.id)}
              className="label transition-colors hover:text-ink"
            >
              {l.label}
            </button>
          ))}
          <Magnetic strength={0.2}>
            <a
              href={`mailto:${site.email}`}
              className="inline-block rounded-full border border-ink px-5 py-2 font-mono text-[0.65rem] font-medium tracking-[0.2em] uppercase transition-colors hover:bg-ink hover:text-paper"
            >
              Start a project
            </a>
          </Magnetic>
        </nav>

        <button
          className="flex flex-col gap-1.5 p-2 md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          <span
            className={`h-px w-6 bg-ink transition-transform ${open ? 'translate-y-[3.5px] rotate-45' : ''}`}
          />
          <span
            className={`h-px w-6 bg-ink transition-transform ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`}
          />
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper px-6 pt-2 pb-8 md:hidden" aria-label="Mobile">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => goTo(l.id)}
              className="block w-full py-3 text-left font-display text-2xl tracking-tight"
            >
              {l.label}
            </button>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="mt-4 inline-block rounded-full border border-ink px-5 py-2.5 font-mono text-[0.65rem] font-medium tracking-[0.2em] uppercase"
          >
            Start a project
          </a>
        </nav>
      )}
    </header>
  );
}
