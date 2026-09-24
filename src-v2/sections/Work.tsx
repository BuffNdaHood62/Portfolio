import { projects, upcoming } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import Icon from '../components/Icon';

interface Card {
  emoji: string;
  name: string;
  url: string | null;
  tags: string[];
  status: string;
  body: string;
}

interface ProjectCardProps {
  item: Card;
  index: number;
  linked: boolean;
}

function ProjectCard({ item, index, linked }: ProjectCardProps) {
  return (
    <Reveal delay={0.06 * index} className="h-full">
      <article className="flex h-full flex-col border-t border-line bg-paper p-8 transition-colors hover:bg-surface/70 md:p-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="text-2xl">
              {item.emoji}
            </span>
            <h3 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
              {item.name}
            </h3>
          </div>
          <span className="label shrink-0 rounded-full border border-line px-3 py-1 text-muted">
            {item.status}
          </span>
        </div>

        <p className="mt-4 flex-1 text-base leading-relaxed text-muted">{item.body}</p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-2" aria-label={`${item.name} technologies`}>
            {item.tags.map((t) => (
              <li
                key={t}
                className="rounded-full bg-surface px-3 py-1 font-mono text-[0.65rem] tracking-[0.12em] uppercase text-muted"
              >
                {t}
              </li>
            ))}
          </ul>
          {linked && item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="label inline-flex items-center gap-2 transition-colors hover:text-accent"
            >
              <Icon name="github" className="size-4 shrink-0" />
              Repository
              <Icon name="external" className="size-3.5 shrink-0" />
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export default function Work() {
  return (
    <section id="work" className="scroll-mt-24 bg-surface/60 px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="work"
          label="Work"
          title={
            <>
              Things I&apos;ve built<span className="text-accent">.</span>
            </>
          }
          intro="Every project I've shipped so far, each card linking straight to the source on GitHub."
        />

        <div
          data-group="shipped"
          className="mt-16 flex flex-col gap-px overflow-hidden rounded-2xl border border-line bg-line"
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.name} item={p} index={i} linked />
          ))}
        </div>

        <Reveal>
          <h3 className="mt-24 border-t border-line pt-6 font-display text-3xl font-medium tracking-tight md:text-4xl">
            Coming next<span className="text-accent">.</span>
          </h3>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            The queue — what I&apos;m building now and what lands here next. This is where the list
            keeps growing.
          </p>
        </Reveal>

        <div
          data-group="queue"
          className="mt-10 flex flex-col gap-px overflow-hidden rounded-2xl border border-line bg-line"
        >
          {upcoming.map((u, i) => (
            <ProjectCard key={u.name} item={u} index={i} linked={u.url !== null} />
          ))}
        </div>
      </div>
    </section>
  );
}
