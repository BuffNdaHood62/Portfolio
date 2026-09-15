import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import Magnetic from '../components/Magnetic';
import Estimator from '../components/Estimator';
import BookingCalendar from '../components/BookingCalendar';
import { site, budgetOptions } from '../data/site';

interface FormState {
  name: string;
  email: string;
  type: string;
  budget: string;
  message: string;
}

const projectTypes = ['Product UX', 'Design System', 'Creative Frontend', 'Something else'];

const initialForm: FormState = {
  name: '',
  email: '',
  type: projectTypes[0],
  budget: budgetOptions[5],
  message: '',
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = 'Tell me your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'A valid email, please';
    if (form.message.trim().length < 10) next.message = 'A few more details help (10+ characters)';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const subject = encodeURIComponent(`New project enquiry — ${form.type} (${form.budget})`);
    const body = encodeURIComponent(
      `Hi ${site.firstName},\n\nProject type: ${form.type}\nBudget: ${form.budget}\n\n${form.message}\n\n— ${form.name} (${form.email})`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const applyEstimate = (budget: string) => {
    set('budget', budget);
    document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToCalendar = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const inputClass = (hasError?: string) =>
    `w-full rounded-md border bg-surface px-4 py-3 text-ink placeholder:text-fog/60 focus:outline-none focus:ring-1 ${
      hasError ? 'border-red-500/70 focus:ring-red-500/60' : 'border-line focus:ring-acid'
    }`;

  const channels = [
    { label: 'Email me', desc: 'Best for briefs & RFPs', action: copyEmail, value: copied ? 'Copied ✓' : site.email },
    { label: 'Book a call', desc: `Free 30-min intro — ${site.location.split('·')[0].trim()}`, action: scrollToCalendar, value: 'Pick a slot' },
    ...site.socials.slice(0, 2).map((s) => ({
      label: s.label,
      desc: 'Connect & see more work',
      action: () => window.open(s.href, '_blank'),
      value: 'Open profile',
    })),
  ];

  return (
    <section id="contact" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-36">
      <SectionHeading index="05" title="Contact" hint="Usually replies within 24h" />

      <div className="grid gap-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <Reveal>
            <h3 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95] font-bold tracking-tight uppercase">
              Let&apos;s make something
              <br />
              <span className="text-outline-acid">people remember</span>
              <span className="text-acid">.</span>
            </h3>
            <p className="mt-8 max-w-md leading-relaxed text-fog">
              Have a product that needs to convert, a system that needs untangling, or a launch
              that needs to land? Reach out however suits you — estimate the project, book a call,
              or just write.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {channels.map((c) => (
                <button
                  key={c.label}
                  onClick={c.action}
                  className="group rounded-md border border-line bg-surface/60 p-4 text-left transition-all hover:border-acid/60"
                >
                  <span className="font-mono text-xs font-medium tracking-widest text-ink uppercase transition-colors group-hover:text-acid">
                    {c.label}
                  </span>
                  <span className="mt-1 block truncate font-mono text-[0.65rem] tracking-wide text-fog">
                    {c.value} — {c.desc}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-6 font-mono text-xs tracking-widest text-fog uppercase">
              {site.location} — {site.availability}
            </p>
          </Reveal>
        </div>

        {/* enquiry form */}
        <div className="md:col-span-6" id="enquiry-form">
          <Reveal delay={0.15}>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex h-full min-h-[24rem] flex-col items-start justify-center rounded-lg border border-acid/40 bg-surface p-8"
                >
                  <p className="font-mono text-sm text-acid">✓ Message drafted</p>
                  <h4 className="mt-4 font-display text-3xl font-bold tracking-tight">
                    Your email app should be opening.
                  </h4>
                  <p className="mt-4 max-w-sm leading-relaxed text-fog">
                    If nothing happened, send the details straight to{' '}
                    <a href={`mailto:${site.email}`} className="text-acid underline underline-offset-4">
                      {site.email}
                    </a>{' '}
                    — I reply within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm(initialForm);
                    }}
                    className="mt-8 font-mono text-xs tracking-widest text-fog uppercase underline-offset-4 hover:text-ink hover:underline"
                  >
                    ← Write another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -12 }}
                  onSubmit={onSubmit}
                  noValidate
                  className="flex flex-col gap-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-name" className="mb-2 block font-mono text-xs tracking-widest text-fog uppercase">
                        Name
                      </label>
                      <input
                        id="c-name"
                        type="text"
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        placeholder="Jane Founder"
                        className={inputClass(errors.name)}
                      />
                      {errors.name && <p className="mt-2 text-xs text-red-400">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="c-email" className="mb-2 block font-mono text-xs tracking-widest text-fog uppercase">
                        Email
                      </label>
                      <input
                        id="c-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        placeholder="jane@company.com"
                        className={inputClass(errors.email)}
                      />
                      {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-type" className="mb-2 block font-mono text-xs tracking-widest text-fog uppercase">
                        Project type
                      </label>
                      <select
                        id="c-type"
                        value={form.type}
                        onChange={(e) => set('type', e.target.value)}
                        className={inputClass()}
                      >
                        {projectTypes.map((t) => (
                          <option key={t} value={t} className="bg-surface">
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="c-budget" className="mb-2 block font-mono text-xs tracking-widest text-fog uppercase">
                        Budget
                      </label>
                      <select
                        id="c-budget"
                        value={form.budget}
                        onChange={(e) => set('budget', e.target.value)}
                        className={inputClass()}
                      >
                        {budgetOptions.map((b) => (
                          <option key={b} value={b} className="bg-surface">
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="c-message" className="mb-2 block font-mono text-xs tracking-widest text-fog uppercase">
                      About the project
                    </label>
                    <textarea
                      id="c-message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                      placeholder="What are you building, who is it for, and when do you need it live?"
                      className={`${inputClass(errors.message)} resize-y`}
                    />
                    {errors.message && <p className="mt-2 text-xs text-red-400">{errors.message}</p>}
                  </div>

                  <Magnetic className="self-start">
                    <button
                      type="submit"
                      className="rounded-full bg-acid px-8 py-3.5 font-mono text-xs font-medium tracking-widest text-base uppercase transition-transform hover:scale-105"
                    >
                      Send enquiry →
                    </button>
                  </Magnetic>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>

      {/* estimator */}
      <Reveal className="mt-20 md:mt-28">
        <Estimator onApply={applyEstimate} />
      </Reveal>

      {/* booking calendar */}
      <Reveal className="mt-12 md:mt-16" delay={0.05}>
        <div id="booking" className="scroll-mt-32">
          <BookingCalendar />
        </div>
      </Reveal>
    </section>
  );
}
