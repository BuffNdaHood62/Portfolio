import { site } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import Magnetic from '../components/Magnetic';
import Reveal from '../components/Reveal';
import BookingCalendar from '../components/BookingCalendar';

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 bg-surface/60 px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="Contact"
          title={
            <>
              Let&apos;s ship something worth signing<span className="text-accent">.</span>
            </>
          }
          intro={`Currently booking ${site.availability.replace('Available for ', '')} — one engagement at a time, full attention.`}
        />

        <div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-6">
            <p className="text-lg leading-relaxed text-muted">
              The fastest path is a direct note. Tell me what you&apos;re building, where it&apos;s
              stuck, and when you want it live — I reply to every serious enquiry within one
              business day.
            </p>
            <Magnetic className="mt-10 inline-block">
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent('Project enquiry')}`}
                className="inline-block rounded-full bg-ink px-9 py-4 font-mono text-[0.7rem] font-medium tracking-[0.2em] uppercase text-paper transition-colors hover:bg-accent"
              >
                {site.email}
              </a>
            </Magnetic>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="label transition-colors hover:text-ink"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12} className="md:col-span-6">
            <BookingCalendar />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
