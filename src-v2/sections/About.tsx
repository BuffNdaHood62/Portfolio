import { site, country, yearsExperience } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-surface/60 px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="About"
          title={
            <>
              Half designer, half engineer, fully accountable<span className="text-accent">.</span>
            </>
          }
        />

        <div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-7">
            <div className="space-y-6 text-base leading-relaxed text-muted md:text-lg">
              <p>
                I&apos;m {site.name}, a product designer and creative frontend developer based in{' '}
                {country}, working with teams worldwide. For {yearsExperience} years I&apos;ve
                designed and shipped products across fintech, infrastructure and consumer apps —
                always owning the work from first interview to production deploy.
              </p>
              <p>
                The gap between design and build is where most products lose their soul. I close
                that gap by writing the frontend myself: the prototype you approve, the motion you
                sign off on, and the interface your users touch are the same artifact. No
                translation loss, no &ldquo;the engineers simplified it.&rdquo;
              </p>
              <p>
                When I&apos;m not shipping client work, I&apos;m writing about interaction design
                and mentoring younger designers across the Nigerian product community.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="md:col-span-5">
            <dl className="flex flex-col divide-y divide-line border-y border-line">
              {site.stats.map((s) => (
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
