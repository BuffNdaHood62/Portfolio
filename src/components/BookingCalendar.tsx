import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { booking, isSlotBooked, site } from '../data/site';

interface DaySlot {
  date: Date;
  dayIndex: number;
  label: string;
  weekday: string;
}

/** Availability calendar for booking an intro call. Confirmation happens via prefilled email. */
export default function BookingCalendar() {
  const days = useMemo<DaySlot[]>(() => {
    const list: DaySlot[] = [];
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (list.length < 8) {
      const dow = d.getDay();
      if (dow !== 0 && dow !== 6) {
        list.push({
          date: new Date(d),
          dayIndex: list.length,
          label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          weekday: d.toLocaleDateString('en-GB', { weekday: 'short' }),
        });
      }
      d.setDate(d.getDate() + 1);
    }
    return list;
  }, []);

  const [activeDay, setActiveDay] = useState(0);
  const [pickedSlot, setPickedSlot] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);

  const day = days[activeDay];

  const request = (slot: string) => {
    setPickedSlot(slot);
    const dateLabel = day.date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    const subject = encodeURIComponent(`Intro call request — ${dateLabel}, ${slot} (${booking.timezone})`);
    const body = encodeURIComponent(
      `Hi ${site.firstName},\n\nI'd like to book the ${booking.label.toLowerCase()} on ${dateLabel} at ${slot} (${booking.timezone}).\n\nLooking forward to it!`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setRequested(true);
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-line bg-surface/60 p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-2xl font-bold tracking-tight uppercase">{booking.label}</h3>
        <p className="font-mono text-[0.65rem] tracking-widest text-fog uppercase">
          {booking.timezone}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {requested ? (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-1 flex-col items-start justify-center"
          >
            <p className="font-mono text-sm text-acid">✓ Slot requested</p>
            <p className="mt-4 font-display text-2xl font-bold tracking-tight">
              {day.weekday} {day.label} — {pickedSlot}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-fog">
              Your email app is opening with the request pre-filled. I&apos;ll confirm within a few
              hours with a video-call link.
            </p>
            <button
              onClick={() => {
                setRequested(false);
                setPickedSlot(null);
              }}
              className="mt-6 font-mono text-xs tracking-widest text-fog uppercase underline-offset-4 hover:text-ink hover:underline"
            >
              ← Pick another slot
            </button>
          </motion.div>
        ) : (
          <motion.div key="picker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex flex-1 flex-col">
            <p className="mb-3 font-mono text-[0.65rem] tracking-widest text-fog uppercase">
              Pick a day
            </p>
            <div className="grid grid-cols-4 gap-2">
              {days.map((d, i) => (
                <button
                  key={d.label}
                  onClick={() => setActiveDay(i)}
                  aria-pressed={activeDay === i}
                  className={`rounded-md border px-2 py-3 text-center transition-all ${
                    activeDay === i
                      ? 'border-acid bg-acid/5'
                      : 'border-line hover:border-fog'
                  }`}
                >
                  <span className={`block font-mono text-[0.6rem] tracking-widest uppercase ${activeDay === i ? 'text-acid' : 'text-fog'}`}>
                    {d.weekday}
                  </span>
                  <span className="mt-1 block font-mono text-sm">{d.label}</span>
                </button>
              ))}
            </div>

            <p className="mt-6 mb-3 font-mono text-[0.65rem] tracking-widest text-fog uppercase">
              Available slots
            </p>
            <div className="flex flex-wrap gap-2">
              {booking.times.map((t, si) => {
                const booked = isSlotBooked(day.dayIndex + activeDay * 3, si);
                return (
                  <button
                    key={t}
                    disabled={booked}
                    onClick={() => request(t)}
                    aria-pressed={pickedSlot === t}
                    className={`rounded-md border px-4 py-2.5 font-mono text-xs tracking-widest uppercase transition-all ${
                      booked
                        ? 'cursor-not-allowed border-line/50 text-fog/40 line-through'
                        : pickedSlot === t
                          ? 'border-acid bg-acid text-base'
                          : 'border-line text-ink hover:border-acid hover:text-acid'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-fog">
              Video call, no strings attached. We&apos;ll talk about your project, timeline and
              whether I&apos;m the right fit — you&apos;ll leave with a clear next step either way.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
