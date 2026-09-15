import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { getProject, relatedProjects } from '../data/projects';
import Reveal, { LineMask } from '../components/Reveal';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CaseStudy() {
  const { slug } = useParams();
  const reduce = useReducedMotion();
  const project = getProject(slug ?? '');

  if (!project) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-start justify-center px-6 md:px-10">
        <p className="label">404</p>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight md:text-5xl">
          That case study doesn&apos;t exist.
        </h1>
        <Link
          to="/"
          className="mt-8 rounded-full bg-ink px-7 py-3.5 font-mono text-[0.65rem] font-medium tracking-[0.2em] uppercase text-paper transition-colors hover:bg-accent"
        >
          ← Back home
        </Link>
      </div>
    );
  }

  const related = relatedProjects(project, 1);
  const next = related[0]?.project ?? getProject(project.slug)!;
  const nextReason = related[0]?.reasons[0];

  return (
    <article>
      {/* Header */}
      <header className="px-6 pt-36 pb-14 md:px-10 md:pt-44 md:pb-20">
        <div className="mx-auto max-w-6xl">
          <Reveal y={12}>
            <Link to="/" className="label transition-colors hover:text-ink">
              ← All work
            </Link>
          </Reveal>
          <h1 className="mt-8 font-display text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.02em]">
            <LineMask>{project.title}</LineMask>
            <LineMask delay={0.12}>
              <span className="text-muted italic font-light">{project.category}</span>
            </LineMask>
          </h1>
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { k: 'Client', v: project.client },
              { k: 'Role', v: project.role },
              { k: 'Timeline', v: `${project.timeline} · ${project.year}` },
              { k: 'Stack', v: project.stack.join(', ') },
            ].map((m) => (
              <div key={m.k}>
                <dt className="label">{m.k}</dt>
                <dd className="mt-2 text-sm leading-relaxed">{m.v}</dd>
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* Cover */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: EASE }}
        className="px-6 md:px-10"
      >
        <div className="mx-auto max-w-6xl overflow-hidden rounded-lg bg-surface">
          <img
            src={project.cover}
            alt={`${project.title} — ${project.category}`}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      </motion.div>

      {/* Narrative */}
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-14 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <p className="label">Overview</p>
              <p className="mt-5 text-sm leading-relaxed text-muted">{project.blurb}</p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {project.skills.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.6rem] font-medium tracking-[0.15em] uppercase text-muted"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="space-y-16 md:col-span-8">
            {project.details.length > 0 && (
              <Reveal>
                <div className="border-l-2 border-accent pl-6 md:pl-8">
                  <div className="space-y-5 text-lg leading-relaxed md:text-xl">
                    {project.details.map((paragraph) => (
                      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
            <Reveal>
              <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                Context
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">{project.context}</p>
            </Reveal>
            <Reveal>
              <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                The problem
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">{project.problem}</p>
            </Reveal>

            <Reveal>
              <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                Process
              </h2>
              <ol className="mt-6 flex flex-col divide-y divide-line border-y border-line">
                {project.process.map((step) => (
                  <li key={step.index} className="grid gap-2 py-6 md:grid-cols-12 md:gap-6">
                    <span className="font-mono text-xs tracking-[0.2em] text-accent md:col-span-1">
                      {step.index}
                    </span>
                    <h3 className="font-display text-lg font-medium tracking-tight md:col-span-4">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted md:col-span-7">{step.body}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal>
              <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                Solution
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">{project.solution}</p>
            </Reveal>
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-20 flex flex-col gap-10">
          {project.gallery.map((g, i) => (
            <Reveal key={i}>
              <figure>
                <div className="overflow-hidden rounded-lg bg-surface">
                  <img
                    src={g.src}
                    alt={g.caption}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-xs leading-relaxed text-muted">
                  {g.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Outcomes */}
        <Reveal className="mt-20">
          <div className="rounded-lg bg-surface/70 p-8 md:p-14">
            <p className="label">Outcomes</p>
            <dl className="mt-8 grid gap-8 sm:grid-cols-3">
              {project.outcomes.map((o) => (
                <div key={o.label} className="flex flex-col">
                  <dd className="order-2 mt-2 text-sm leading-snug text-muted">{o.label}</dd>
                  <dt className="order-1 font-display text-4xl font-medium tracking-tight md:text-5xl">
                    {o.value}
                  </dt>
                </div>
              ))}
            </dl>
            <p className="mt-10 border-t border-line pt-8 text-base leading-relaxed text-muted">
              {project.impact}
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-16">
          <blockquote className="border-l-2 border-accent pl-8">
            <p className="font-display text-xl font-light leading-relaxed tracking-tight md:text-2xl">
              &ldquo;{project.testimonial.quote}&rdquo;
            </p>
            <footer className="mt-5 text-sm text-muted">
              — {project.testimonial.author}, {project.testimonial.role}
            </footer>
          </blockquote>
        </Reveal>
      </div>

      {/* Next project */}
      <nav className="border-t border-line" aria-label="Next case study">
        <Link
          to={`/case-study/${next.slug}`}
          className="group mx-auto flex max-w-6xl flex-col gap-2 px-6 py-16 md:flex-row md:items-center md:justify-between md:px-10 md:py-20"
        >
          <div>
            <p className="label">Next case study</p>
            <p className="mt-3 font-display text-3xl font-medium tracking-tight transition-colors group-hover:text-accent md:text-5xl">
              {next.title}
              <span
                aria-hidden
                className="ml-4 inline-block transition-transform duration-300 group-hover:translate-x-2"
                style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
              >
                →
              </span>
            </p>
          </div>
          <p className="text-sm text-muted">
            {nextReason ? `${next.category} · shares ${nextReason}` : next.category}
          </p>
        </Link>
      </nav>
    </article>
  );
}
