import { skills } from '../data/site';
import type { SkillLevel } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';

const LEVEL_LABEL: Record<SkillLevel, string> = {
  core: 'Core',
  confident: 'Confident',
  learning: 'Learning',
};

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="skills"
          label="Skills"
          title={
            <>
              What I work with, and how honestly I&apos;d rate it<span className="text-accent">.</span>
            </>
          }
          intro="No inflated percentages. Just where I actually am today — every claim below has a repository behind it."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s, i) => (
            <Reveal key={s.name} delay={0.05 * (i % 3)} className="h-full">
              <article className="flex h-full flex-col bg-paper p-8 transition-colors hover:bg-surface/70">
                <div className="flex items-center justify-between gap-4">
                  <span aria-hidden="true" className="text-2xl">
                    {s.emoji}
                  </span>
                  <span
                    className={`label rounded-full border px-3 py-1 ${
                      s.level === 'learning'
                        ? 'border-accent/40 text-accent'
                        : 'border-line text-muted'
                    }`}
                  >
                    {LEVEL_LABEL[s.level]}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-medium tracking-tight">{s.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{s.body}</p>
                <p className="label mt-6">{s.tag}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
