import { projects } from '../data/projects';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';

export default function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-24 px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="Testimonials"
          title={
            <>
              Words from the shipped<span className="text-accent">.</span>
            </>
          }
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((p, i) => (
            <figure key={p.slug} className="flex flex-col bg-paper p-8 md:p-10">
              <Reveal delay={i * 0.1} className="flex h-full flex-col">
                <div aria-hidden className="font-display text-4xl leading-none text-accent">
                  &ldquo;
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink md:text-base">
                  {p.testimonial.quote}
                </blockquote>
                <figcaption className="mt-8 border-t border-line pt-5">
                  <p className="font-display text-base font-medium tracking-tight">
                    {p.testimonial.author}
                  </p>
                  <p className="mt-1 text-xs text-muted">{p.testimonial.role}</p>
                </figcaption>
              </Reveal>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
