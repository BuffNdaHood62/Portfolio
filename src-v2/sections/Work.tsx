import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import { site } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';

export default function Work() {
  return (
    <section id="work" className="scroll-mt-24 px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="Selected Work"
          title={
            <>
              Case studies with receipts<span className="text-accent">.</span>
            </>
          }
          intro="Every project below shipped to production and moved a number that mattered. Click through for the full story — research, decisions, and outcomes."
        />

        <div className="mt-16 flex flex-col gap-20 md:gap-28">
          {projects.map((p, i) => (
            <Reveal key={p.slug}>
              <Link
                to={`/case-study/${p.slug}`}
                className="group grid items-center gap-8 md:grid-cols-12 md:gap-10"
              >
                <div className={`md:col-span-7 ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="overflow-hidden rounded-lg bg-surface">
                    <motion.img
                      src={p.cover}
                      alt={`${p.title} — ${p.category}`}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover"
                      whileHover={undefined}
                    />
                  </div>
                </div>

                <div className={`md:col-span-5 ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                  <p className="label">
                    {String(i + 1).padStart(2, '0')} — {p.category} · {p.year}
                  </p>
                  <h3 className="mt-4 font-display text-3xl font-medium tracking-tight transition-colors group-hover:text-accent md:text-4xl">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">{p.blurb}</p>

                  <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                    {p.outcomes.slice(0, 2).map((o) => (
                      <div key={o.label}>
                        <dd className="font-display text-xl font-medium tracking-tight">
                          {o.value}
                        </dd>
                        <dt className="mt-0.5 text-xs text-muted">{o.label}</dt>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-6 inline-flex items-center gap-2 font-mono text-[0.65rem] font-medium tracking-[0.2em] uppercase">
                    Read case study
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
                    >
                      →
                    </span>
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 border-t border-line pt-8">
          <p className="text-sm text-muted">
            {site.stats[1].value} products shipped with teams — the four above tell the story best.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
