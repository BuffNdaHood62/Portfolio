import { site, country, buildsWith, aboutMeta, stats } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-surface/60 px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="about"
          label="About"
          title={
            <>
              A developer who learns by shipping<span className="text-accent">.</span>
            </>
          }
        />

        <div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-7">
            <div className="space-y-6 text-base leading-relaxed text-muted md:text-lg">
              <p>
                I&apos;m {site.name}, a frontend developer based in {country}. I fell for the web
                through the immediacy of {buildsWith} — the feeling of going from a vague idea to a
                working interface in a single afternoon still drives everything I build.
              </p>
              <p>
                Most of my work lives between a Figma frame and a deployed URL. I like the unglamorous
                parts as much as the polish: typed props that refuse nonsense, Tailwind token systems
                instead of stray hex values, and components that stay accessible when nobody is
                watching.
              </p>
              <p>
                Right now I&apos;m pushing through Next.js and Supabase with my biggest project yet, an
                EHR app. I&apos;m early in that journey — and I&apos;d rather publish an honest roadmap
                of where I actually am than pretend otherwise.
              </p>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8">
              {aboutMeta.map((m) => (
                <div key={m.key}>
                  <dt className="label">{m.key}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed">{m.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.15} className="md:col-span-5">
            <dl className="flex flex-col divide-y divide-line border-y border-line">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-x-2.5 py-6">
                  {/* dt before dd keeps the markup valid; order-1/order-2 swap
                      them visually so the value reads first. */}
                  <dt className="order-2 text-sm text-muted">{s.label}</dt>
                  <dd className="order-1 font-display text-4xl font-medium leading-none tracking-tight md:text-5xl">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 label">{site.location}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
