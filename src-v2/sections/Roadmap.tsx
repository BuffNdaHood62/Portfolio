import { roadmap } from '../data/site';
import type { RoadmapStatus } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import Icon from '../components/Icon';

const STATUS_LABEL: Record<RoadmapStatus, string> = {
  done: 'Done',
  'in-progress': 'In progress',
  next: 'Next',
  planned: 'Planned',
};

export default function Roadmap() {
  return (
    <section id="roadmap" className="scroll-mt-24 px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="roadmap"
          label="Roadmap"
          title={
            <>
              The frontend roadmap<span className="text-accent">.</span>
            </>
          }
          intro="Where I am and what's next, published on purpose — keeping the plan visible keeps me honest about progress."
        />

        <ol className="mt-16 flex flex-col">
          {roadmap.map((r, i) => (
            <Reveal
              key={r.title}
              delay={0.04 * (i % 4)}
              as="li"
              className="grid grid-cols-[1fr_auto] gap-x-6 border-b border-line py-7 first:pt-0 md:grid-cols-[5rem_auto_1fr_auto] md:items-baseline"
            >
              <span className="label hidden md:block">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-xl font-medium tracking-tight md:text-2xl">
                {r.title}
              </h3>
              <p className="col-span-2 mt-2 text-sm leading-relaxed text-muted md:col-span-1 md:mt-0 md:px-6">
                {r.body}
              </p>
              <span
                className={`label inline-flex w-fit items-center gap-1.5 self-start rounded-full border px-3 py-1 md:self-baseline ${
                  r.status === 'done'
                    ? 'border-accent/40 text-accent'
                    : r.status === 'in-progress'
                      ? 'border-ink text-ink'
                      : 'border-line text-muted'
                }`}
              >
                {r.status === 'done' && <Icon name="check" className="size-3 shrink-0" />}
                {STATUS_LABEL[r.status]}
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
