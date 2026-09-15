import { type MouseEvent } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'framer-motion';
import { LineMask } from '../components/Reveal';
import Magnetic from '../components/Magnetic';
import { site } from '../data/site';

export default function Hero() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(50);
  const my = useMotionValue(35);
  const glow = useMotionTemplate`radial-gradient(600px circle at ${mx}% ${my}%, rgba(204,255,0,0.07), transparent 65%)`;

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <section
      onMouseMove={onMove}
      className="relative flex min-h-screen flex-col justify-end overflow-hidden"
    >
      {/* faint vertical grid lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0 mx-auto hidden max-w-7xl grid-cols-4 md:grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="border-l border-line/60 last:border-r" />
        ))}
      </div>

      {/* cursor-reactive glow */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />

      <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 pb-14 md:px-8 md:pb-20">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8 flex items-center gap-3 font-mono text-xs tracking-widest text-fog uppercase"
        >
          <span className="inline-block h-2 w-2 animate-pulse-dot rounded-full bg-acid" />
          {site.availability}
        </motion.p>

        <h1 className="font-display leading-[0.92] font-bold tracking-tight uppercase">
          <LineMask delay={0.15} className="text-[clamp(3.2rem,11vw,9.5rem)]">
            Design that
          </LineMask>
          <LineMask delay={0.3} className="text-outline text-[clamp(3.2rem,11vw,9.5rem)]">
            feels alive
          </LineMask>
          <LineMask delay={0.45} className="text-[clamp(3.2rem,11vw,9.5rem)]">
            <span>
              &amp; ships<span className="text-acid">.</span>
            </span>
          </LineMask>
        </h1>

        <div className="mt-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="max-w-md"
          >
            <p className="text-base leading-relaxed text-fog md:text-lg">
              {site.firstName} {site.name.split(' ')[1]} — {site.role.toLowerCase()}. {site.intro}
            </p>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="flex items-center gap-4"
          >
            <Magnetic>
              <button
                onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-full bg-acid px-7 py-3.5 font-mono text-xs font-medium tracking-widest text-base uppercase transition-transform hover:scale-105"
              >
                View selected work
              </button>
            </Magnetic>
            <Magnetic>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-full border border-line px-7 py-3.5 font-mono text-xs font-medium tracking-widest text-ink uppercase transition-colors hover:border-acid hover:text-acid"
              >
                Get in touch
              </button>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-14 flex items-center gap-3 font-mono text-[0.65rem] tracking-widest text-fog uppercase"
        >
          <span>Scroll</span>
          <span className="relative h-px w-16 overflow-hidden bg-line">
            <motion.span
              className="absolute inset-y-0 left-0 w-1/2 bg-acid"
              animate={reduce ? undefined : { x: ['-100%', '200%'] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
          <span>
            {site.location} — © {new Date().getFullYear()}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
