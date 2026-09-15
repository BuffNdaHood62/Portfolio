import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProject, relatedProjects } from '../data/projects';
import { site } from '../data/site';
import Reveal from '../components/Reveal';
import Magnetic from '../components/Magnetic';
import BeforeAfter from '../components/BeforeAfter';
import Gallery from '../components/Gallery';

const chapters = [
  { id: 'context', label: 'Context' },
  { id: 'problem', label: 'Problem' },
  { id: 'process', label: 'Process' },
  { id: 'solution', label: 'Solution' },
  { id: 'impact', label: 'Impact' },
];

function useScrollSpy() {
  const [active, setActive] = useState(chapters[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    for (const c of chapters) {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return active;
}

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;
  const active = useScrollSpy();

  const next = useMemo(() => {
    if (!project) return undefined;
    return relatedProjects(project, 2);
  }, [project]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-start justify-center px-5 md:px-8">
        <p className="font-mono text-sm text-acid">(404)</p>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-tight uppercase">
          Case study not found
        </h1>
        <Link
          to="/"
          className="mt-8 font-mono text-xs tracking-widest text-fog uppercase underline-offset-4 hover:text-ink hover:underline"
        >
          ← Back to all work
        </Link>
      </div>
    );
  }

  const meta = [
    { label: 'Client', value: project.client },
    { label: 'Role', value: project.role },
    { label: 'Timeline', value: project.timeline },
    { label: 'Stack', value: project.stack.join(', ') },
  ];

  return (
    <article className="pt-24 md:pt-32">
      {/* header */}
      <header className="mx-auto max-w-7xl px-5 md:px-8">
        <Link
          to="/"
          className="font-mono text-xs tracking-widest text-fog uppercase underline-offset-4 hover:text-ink hover:underline"
        >
          ← All work
        </Link>
        <Reveal>
          <p className="mt-10 font-mono text-sm text-acid">
            {project.category} — {project.year}
          </p>
          <h1 className="mt-3 font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] font-bold tracking-tight uppercase">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog">{project.blurb}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-2 gap-6 border-y border-line py-8 md:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label}>
                <p className="font-mono text-[0.65rem] tracking-widest text-fog uppercase">{m.label}</p>
                <p className="mt-2 text-sm leading-relaxed">{m.value}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </header>

      {/* cover */}
      <Reveal className="mx-auto mt-12 max-w-7xl px-5 md:px-8">
        <div className="overflow-hidden rounded-lg border border-line">
          <img
            src={project.cover}
            alt={`${project.title} cover`}
            className="aspect-[16/8] w-full object-cover"
          />
        </div>
      </Reveal>

      {/* sticky chapter nav */}
      <nav className="sticky top-16 z-30 mt-16 border-y border-line bg-base/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-5 py-4 md:px-8">
          {chapters.map((c, i) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(c.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex shrink-0 items-baseline gap-2 font-mono text-xs tracking-widest uppercase transition-colors ${
                active === c.id ? 'text-acid' : 'text-fog hover:text-ink'
              }`}
            >
              <span className="text-[0.6rem]">0{i + 1}</span>
              {c.label}
            </a>
          ))}
        </div>
      </nav>

      {/* body */}
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <section id="context" className="scroll-mt-32 py-16 md:py-24">
          <Chapter title="Context" />
          <Reveal>
            <p className="max-w-3xl text-lg leading-relaxed text-fog">{project.context}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 max-w-3xl border-l-2 border-line pl-6">
              {project.details.map((d, i) => (
                <p key={i} className="mb-4 text-sm leading-relaxed text-fog last:mb-0">
                  {d}
                </p>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="problem" className="scroll-mt-32 border-t border-line py-16 md:py-24">
          <Chapter title="Problem" />
          <Reveal>
            <p className="max-w-3xl text-lg leading-relaxed text-fog">{project.problem}</p>
          </Reveal>
        </section>

        <section id="process" className="scroll-mt-32 border-t border-line py-16 md:py-24">
          <Chapter title="Process" />
          <div className="mt-2 grid gap-10 md:grid-cols-2 md:gap-8">
            {project.process.map((step, i) => (
              <Reveal key={step.index} delay={0.08 * i}>
                <div className="border-t border-line pt-6">
                  <p className="font-mono text-sm text-acid">{step.index}</p>
                  <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-fog">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="solution" className="scroll-mt-32 border-t border-line py-16 md:py-24">
          <Chapter title="Solution" />
          <Reveal>
            <p className="max-w-3xl text-lg leading-relaxed text-fog">{project.solution}</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-14">
            <p className="mb-4 font-mono text-xs tracking-widest text-fog uppercase">
              (Drag the handle — before / after)
            </p>
            <BeforeAfter
              before={project.before}
              after={project.cover}
              caption="Slide to compare the original direction with the shipped design"
            />
          </Reveal>

          <Reveal delay={0.15} className="mt-14">
            <p className="mb-4 font-mono text-xs tracking-widest text-fog uppercase">
              (Selected frames)
            </p>
            <Gallery items={project.gallery} />
          </Reveal>
        </section>

        <section id="impact" className="scroll-mt-32 border-t border-line py-16 md:py-24">
          <Chapter title="Impact" />
          <div className="grid gap-8 sm:grid-cols-3">
            {project.outcomes.map((o, i) => (
              <Reveal key={o.label} delay={0.08 * i}>
                <div className="border-l-2 border-acid pl-4">
                  <p className="font-display text-5xl font-bold tracking-tight">{o.value}</p>
                  <p className="mt-2 text-sm text-fog">{o.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <p className="mt-12 max-w-3xl text-lg leading-relaxed text-fog">{project.impact}</p>
          </Reveal>

          <Reveal delay={0.2}>
            <figure className="mt-14 rounded-lg border border-line bg-surface p-8 md:p-12">
              <blockquote>
                <p className="max-w-3xl font-display text-xl leading-snug font-medium md:text-3xl">
                  “{project.testimonial.quote}”
                </p>
              </blockquote>
              <figcaption className="mt-6 font-mono text-xs tracking-widest text-fog uppercase">
                {project.testimonial.author} — {project.testimonial.role}
              </figcaption>
            </figure>
          </Reveal>
        </section>

        {/* smart recommendations + CTA */}
        {next && next.length > 0 && (
          <Reveal>
            <section className="border-t border-line py-16 md:py-24" aria-label="Related work">
              <p className="font-mono text-xs tracking-widest text-fog uppercase">
                (Because you&apos;re viewing {project.title} — related work)
              </p>
              <div className="mt-8 grid gap-8 md:grid-cols-2">
                {next.map(({ project: rel, reasons }) => (
                  <Link
                    key={rel.slug}
                    to={`/case-study/${rel.slug}`}
                    className="group overflow-hidden rounded-lg border border-line transition-colors hover:border-fog/50"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={rel.cover}
                        alt={`${rel.title} — ${rel.category}`}
                        loading="lazy"
                        className="aspect-[16/9] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {reasons.slice(0, 3).map((r) => (
                          <span
                            key={r}
                            className="rounded-full border border-acid/50 px-3 py-1 font-mono text-[0.6rem] tracking-widest text-acid uppercase"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                      <h3 className="mt-4 font-display text-3xl font-bold tracking-tight uppercase transition-colors group-hover:text-acid">
                        {rel.title}
                        <span className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                          →
                        </span>
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-fog">{rel.blurb}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        <Reveal>
          <div className="mb-24 flex flex-col items-start gap-6 rounded-lg border border-acid/40 bg-surface p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <h2 className="font-display text-3xl font-bold tracking-tight uppercase md:text-4xl">
              Want results like this<span className="text-acid">?</span>
            </h2>
            <Magnetic>
              <a
                href={`mailto:${site.email}`}
                className="shrink-0 rounded-full bg-acid px-7 py-3.5 font-mono text-xs font-medium tracking-widest text-base uppercase transition-transform hover:scale-105"
              >
                Start a project
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </article>
  );
}

function Chapter({ title }: { title: string }) {
  return (
    <h2 className="mb-10 flex items-baseline gap-4 font-display text-3xl font-bold tracking-tight uppercase md:text-5xl">
      <span className="font-mono text-sm font-normal text-acid">/</span>
      {title}
    </h2>
  );
}
