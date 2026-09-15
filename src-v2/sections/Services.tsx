import { services } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="Services"
          title={
            <>
              What I can do for you<span className="text-accent">.</span>
            </>
          }
        />

        <div className="mt-16 flex flex-col">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="group grid gap-6 border-t border-line py-10 transition-colors last:border-b hover:bg-surface/50 md:grid-cols-12 md:gap-10 md:px-4">
                <div className="md:col-span-1">
                  <span className="font-mono text-xs tracking-[0.2em] text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="md:col-span-5">
                  <h3 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                    {s.title}
                  </h3>
                </div>
                <div className="md:col-span-6">
                  <p className="text-sm leading-relaxed text-muted md:text-base">{s.body}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.6rem] font-medium tracking-[0.15em] uppercase text-muted"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
