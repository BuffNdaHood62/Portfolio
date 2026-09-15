import { testimonials } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';

export default function Testimonials() {
  return (
    <section className="px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="Testimonials"
          title={
            <>
              Words from the shipped<span className="text-accent">.</span>
            </>
          }
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure key={t.author} className="flex flex-col bg-paper p-8 md:p-10">
              <Reveal delay={i * 0.1} className="flex h-full flex-col">
                <div aria-hidden className="font-display text-4xl leading-none text-accent">
                  &ldquo;
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink md:text-base">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8 border-t border-line pt-5">
                  <p className="font-display text-base font-medium tracking-tight">{t.author}</p>
                  <p className="mt-1 text-xs text-muted">{t.role}</p>
                </figcaption>
              </Reveal>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
