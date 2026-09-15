import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { CaseStudy } from '../data/projects';

interface ProjectCardProps {
  project: CaseStudy;
  index: number;
}

/** Showcase card with expandable project details. */
export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-colors hover:border-fog/40"
    >
      <Link to={`/case-study/${project.slug}`} className="relative block overflow-hidden">
        <img
          src={project.cover}
          alt={`${project.title} — ${project.category}`}
          loading="lazy"
          className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-base/80 px-3 py-1 font-mono text-[0.65rem] tracking-widest text-ink uppercase backdrop-blur-sm">
            {project.type}
          </span>
          <span className="rounded-full bg-base/80 px-3 py-1 font-mono text-[0.65rem] tracking-widest text-fog uppercase backdrop-blur-sm">
            {project.industry}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="font-mono text-xs text-acid">
          ({String(index + 1).padStart(2, '0')}) — {project.year}
        </p>
        <h3 className="mt-2 font-display text-3xl font-bold tracking-tight uppercase">
          <Link to={`/case-study/${project.slug}`} className="transition-colors hover:text-acid">
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-fog">{project.blurb}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.skills.map((s) => (
            <span
              key={s}
              className="rounded-full border border-line px-3 py-1 font-mono text-[0.6rem] tracking-widest text-fog uppercase"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-4 border-t border-line">
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  {project.details.map((d, i) => (
                    <p key={i} className="mb-3 text-sm leading-relaxed text-fog last:mb-0">
                      {d}
                    </p>
                  ))}
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {project.outcomes.slice(0, 2).map((o) => (
                      <span key={o.label} className="font-mono text-xs text-ink">
                        <span className="text-acid">{o.value}</span> {o.label}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto flex items-center justify-between pt-5">
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="font-mono text-xs font-medium tracking-widest text-fog uppercase transition-colors hover:text-acid"
          >
            {open ? '− Less' : '+ Details'}
          </button>
          <Link
            to={`/case-study/${project.slug}`}
            className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-widest text-ink uppercase"
          >
            Case study
            <span className="transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-acid">
              →
            </span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
