import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import { services } from '../data/site';

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-36">
      <SectionHeading index="03" title="Services" hint="Ways to hire me" />

      <div className="flex flex-col">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={0.08 * i}>
            <div className="group grid gap-6 border-t border-line py-10 transition-colors last:border-b hover:bg-surface md:grid-cols-12 md:items-start md:gap-10 md:px-4">
              <div className="md:col-span-5">
                <h3 className="font-display text-3xl font-bold tracking-tight uppercase transition-colors group-hover:text-acid md:text-4xl">
                  {s.title}
                </h3>
              </div>
              <div className="md:col-span-5">
                <p className="leading-relaxed text-fog">{s.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line px-3 py-1 font-mono text-[0.65rem] tracking-widest text-fog uppercase"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 md:text-right">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-widest text-ink uppercase transition-colors hover:text-acid"
                >
                  Enquire
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
