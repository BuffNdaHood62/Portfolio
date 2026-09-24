import { useEffect, useState } from 'react';
import { site, sections } from '../data/site';
import { scrollToSection, scrollToPageTop } from '../lib/scroll';
import { useTheme } from '../lib/theme';
import Magnetic from './Magnetic';
import Icon from './Icon';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { dark, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape closes the mobile menu. Without this the only ways out are the toggle and
  // picking a link, which is not what a keyboard user expects from a menu.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // The toggle is `md:hidden`, so once the viewport crosses the desktop breakpoint the
  // menu can no longer be dismissed by hand: `open` would stay true forever, leaving
  // the header stuck with its blurred background and the mobile nav in the DOM. Match
  // Tailwind's own breakpoint (`min-width: 48rem`) so the JS and the CSS cannot
  // disagree if the root font size ever changes.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 48rem)');
    const sync = () => {
      if (desktop.matches) setOpen(false);
    };
    sync();
    desktop.addEventListener('change', sync);
    return () => desktop.removeEventListener('change', sync);
  }, []);

  // Single-page site: every nav action is an in-page scroll. Each section carries
  // `scroll-mt-24` so it clears the fixed header. The scroll helpers honour
  // prefers-reduced-motion — `scrollIntoView`'s 'smooth' does not.
  const goTo = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };

  const scrollToTop = () => {
    setOpen(false);
    scrollToPageTop();
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
          {sections.map((l) => (
            <button
              key={l.id}
              type="button"
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
              Get in touch
            </a>
          </Magnetic>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="rounded-full p-2 transition-colors hover:bg-surface"
          >
            <Icon name={dark ? 'sun' : 'moon'} className="size-4" />
          </button>

          <button
            type="button"
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
      </div>

      {open && (
        <nav className="border-t border-line bg-paper px-6 pt-2 pb-8 md:hidden" aria-label="Mobile">
          {sections.map((l) => (
            <button
              key={l.id}
              type="button"
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
            Get in touch
          </a>
        </nav>
      )}
    </header>
  );
}
