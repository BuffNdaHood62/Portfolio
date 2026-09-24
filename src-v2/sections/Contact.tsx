import { useState } from 'react';
import { site } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import Magnetic from '../components/Magnetic';
import Reveal from '../components/Reveal';
import Icon from '../components/Icon';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
    } catch {
      /* clipboard unavailable (permissions/insecure context): the mailto link
         beside the button remains the fallback, so silence is the right UX */
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 bg-surface/60 px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="contact"
          label="Contact"
          title={
            <>
              Let&apos;s build something useful<span className="text-accent">.</span>
            </>
          }
          intro={`${site.availability} — for roles, collaborations and interesting frontend problems. The fastest way to reach me is email.`}
        />

        <div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-7">
            <p className="text-lg leading-relaxed text-muted">
              Tell me what you&apos;re building, where it&apos;s stuck, and when you want it live —
              I reply to every serious enquiry within one business day.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic className="inline-block">
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent('Project enquiry')}`}
                  className="inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-4 font-mono text-[0.7rem] font-medium tracking-[0.2em] uppercase text-paper transition-colors hover:bg-accent"
                >
                  <Icon name="mail" className="size-4 shrink-0" />
                  {site.email}
                </a>
              </Magnetic>

              <button
                type="button"
                onClick={() => {
                  void copyEmail();
                }}
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3.5 font-mono text-[0.65rem] font-medium tracking-[0.2em] uppercase transition-colors hover:border-ink"
              >
                <Icon name={copied ? 'check' : 'copy'} className="size-4 shrink-0" />
                {copied ? 'Copied' : 'Copy email'}
              </button>
            </div>
            {/* Announced for screen readers: the button's own label changes, but
                focus stays put, so live text carries the state change. */}
            <p aria-live="polite" className="sr-only">
              {copied ? 'Email address copied to clipboard' : ''}
            </p>
          </Reveal>

          <Reveal delay={0.12} className="md:col-span-5">
            <div className="flex flex-col gap-2.5 border-t border-line pt-6">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="label inline-flex w-fit items-center gap-2 transition-colors hover:text-accent"
                >
                  <Icon name={s.icon} className="size-4 shrink-0" />
                  {s.label}
                  <Icon name="external" className="size-3 shrink-0" />
                </a>
              ))}
            </div>
            <p className="mt-8 text-sm leading-relaxed text-muted">{site.location}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
