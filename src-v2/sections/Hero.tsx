import { m, useReducedMotion } from 'framer-motion';
import { site } from '../data/site';
import { scrollToSection } from '../lib/scroll';
import { LineMask } from '../components/Reveal';
import Magnetic from '../components/Magnetic';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="flex min-h-[92vh] flex-col justify-end px-6 pt-32 pb-16 md:px-10 md:pb-24">
      <div className="mx-auto w-full max-w-6xl">
        <m.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="label flex items-center gap-2.5"
        >
          <span className="inline-block size-1.5 rounded-full bg-accent animate-pulse-dot" />
          {site.availability}
        </m.p>

        <h1 className="mt-8 font-display text-[clamp(2.75rem,8vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.02em]">
          <LineMask delay={0.15}>Design that feels</LineMask>
          <LineMask delay={0.28}>
            inevitable<span className="text-accent">.</span>
          </LineMask>
          <LineMask delay={0.41}>
            <span className="text-muted italic font-light">And ships.</span>
          </LineMask>
        </h1>

        <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <m.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
            className="max-w-md text-base leading-relaxed text-muted"
          >
            {site.intro}
          </m.p>

          <m.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.72, ease: EASE }}
            className="flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToSection('services')}
                className="inline-block rounded-full bg-ink px-7 py-3.5 font-mono text-[0.65rem] font-medium tracking-[0.2em] uppercase text-paper transition-colors hover:bg-accent"
              >
                What I do
              </button>
            </Magnetic>
            <Magnetic>
              <a
                href={`mailto:${site.email}`}
                className="inline-block rounded-full border border-line px-7 py-3.5 font-mono text-[0.65rem] font-medium tracking-[0.2em] uppercase transition-colors hover:border-ink"
              >
                Get in touch
              </a>
            </Magnetic>
          </m.div>
        </div>

        <m.dl
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-16 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-line pt-8"
        >
          {site.stats.map((s) => (
            <div key={s.label} className="flex items-center gap-x-2.5">
              <dt className="order-2 text-sm text-muted">{s.label}</dt>
              <dd className="order-1 font-display text-3xl font-medium leading-none tracking-tight md:text-4xl">
                {s.value}
              </dd>
            </div>
          ))}
        </m.dl>
      </div>
    </section>
  );
}
