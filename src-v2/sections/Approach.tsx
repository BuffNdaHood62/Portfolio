import { process } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';

export default function Approach() {
  return (
    <section id="approach" className="scroll-mt-24 bg-surface/60 px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="Approach"
          title={
            <>
              Three steps, no theatre<span className="text-accent">.</span>
            </>
          }
          intro="A process refined across 40+ launches — tight loops, visible progress, and deliverables you can click, not just look at."
        />

        <ol className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
          {process.map((step, i) => (
            <li key={step.index} className="bg-paper">
              <Reveal delay={i * 0.1} className="flex h-full flex-col p-8 md:p-10">
                <span className="font-mono text-xs tracking-[0.2em] text-accent">{step.index}</span>
                <h3 className="mt-6 font-display text-2xl font-medium tracking-tight md:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
