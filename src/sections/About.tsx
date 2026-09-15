import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import { site, process } from '../data/site';
import portrait from '../assets/portrait.svg';

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 border-y border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        <SectionHeading index="02" title="About" hint="Designer who codes" />

        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-5">
            <div className="overflow-hidden rounded-lg border border-line">
              <img
                src={portrait}
                alt={`${site.name} portrait`}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <p className="mt-4 font-mono text-xs tracking-widest text-fog uppercase">
              {site.location}
            </p>
          </Reveal>

          <div className="md:col-span-7">
            <Reveal>
              <p className="font-display text-2xl leading-snug font-medium md:text-4xl">
                Most designers hand off mockups and hope for the best. I stay until it{' '}
                <span className="text-acid">ships</span> — because a design isn&apos;t done when the
                Figma file is pretty. It&apos;s done when users are using it.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-xl leading-relaxed text-fog">{site.intro}</p>
              <p className="mt-4 max-w-xl leading-relaxed text-fog">
                Eight years across fintech, SaaS and consumer products — in-house, agency and
                independent. I work best with founders and product teams who care about outcomes,
                not deliverable counts.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {site.stats.map((s, i) => (
                <Reveal key={s.label} delay={0.1 * i}>
                  <div className="border-l-2 border-acid pl-4">
                    <p className="font-display text-4xl font-bold tracking-tight">{s.value}</p>
                    <p className="mt-1 text-sm text-fog">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-24 md:mt-32">
          <Reveal>
            <p className="mb-10 font-mono text-xs tracking-widest text-fog uppercase">
              (How we&apos;ll work together)
            </p>
          </Reveal>
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {process.map((step, i) => (
              <Reveal key={step.index} delay={0.12 * i}>
                <div className="group border-t border-line pt-6 transition-colors hover:border-acid">
                  <p className="font-mono text-sm text-acid">{step.index}</p>
                  <h3 className="mt-3 font-display text-2xl font-bold tracking-tight uppercase">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-fog">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
