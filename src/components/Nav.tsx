import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Magnetic from './Magnetic';
import { site } from '../data/site';

const links = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Contact', href: '/#contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const go = (href: string) => {
    setOpen(false);
    const hash = href.split('#')[1];
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? 'border-b border-line bg-base/80 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link to="/" className="font-display text-lg font-bold tracking-tight">
            {site.name}
            <span className="text-acid">.</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="group relative font-mono text-xs tracking-widest text-fog uppercase transition-colors hover:text-ink"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-acid transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <Magnetic strength={0.25}>
              <button
                onClick={() => go('/#contact')}
                className="rounded-full bg-acid px-5 py-2 font-mono text-xs font-medium tracking-widest text-base uppercase transition-transform hover:scale-105"
              >
                Start a project
              </button>
            </Magnetic>
          </div>

          <button
            className="flex flex-col gap-1.5 p-2 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className={`h-0.5 w-6 bg-ink transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 w-6 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-ink transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-base/95 px-8 backdrop-blur-md md:hidden"
          >
            {links.map((l, i) => (
              <motion.button
                key={l.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.4 }}
                onClick={() => go(l.href)}
                className="border-b border-line py-6 text-left font-display text-4xl font-bold tracking-tight"
              >
                {l.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              onClick={() => go('/#contact')}
              className="mt-10 rounded-full bg-acid px-6 py-4 text-center font-mono text-sm font-medium tracking-widest text-base uppercase"
            >
              Start a project
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
