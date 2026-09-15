import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import { testimonials } from '../data/site';

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const t = testimonials[index];

  const step = (dir: 1 | -1) => {
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  };

  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        <SectionHeading index="04" title="Kind Words" />

        <Reveal>
          <div className="grid gap-10 md:grid-cols-12">
            <p className="font-display text-sm text-acid md:col-span-2">
              0{index + 1} <span className="text-fog">/ 0{testimonials.length}</span>
            </p>

            <div className="md:col-span-10">
              <div className="min-h-[12rem] md:min-h-[10rem]">
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="max-w-4xl font-display text-2xl leading-snug font-medium md:text-4xl">
                      “{t.quote}”
                    </p>
                    <footer className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="text-sm tracking-widest text-acid" aria-label={`${t.rating} out of 5 stars`}>
                        {'★'.repeat(t.rating)}
                        <span className="text-line">{'★'.repeat(5 - t.rating)}</span>
                      </span>
                      <span className="font-mono text-xs tracking-widest text-fog uppercase">
                        {t.author} — {t.role}
                      </span>
                    </footer>
                  </motion.blockquote>
                </AnimatePresence>
              </div>

              <div className="mt-10 flex gap-3">
                <button
                  onClick={() => step(-1)}
                  aria-label="Previous testimonial"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:border-acid hover:text-acid"
                >
                  ←
                </button>
                <button
                  onClick={() => step(1)}
                  aria-label="Next testimonial"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:border-acid hover:text-acid"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
