import { useMemo, useState } from 'react';
import { m } from 'framer-motion';
import { booking, isSlotBooked, site } from '../data/site';

interface DaySlot {
  date: Date;
  dayIndex: number;
  label: string;
  weekday: string;
}

/** How many bookable weekdays the picker offers. */
const DAYS_SHOWN = 8;

/** Availability calendar for booking an intro call. Confirmation happens via prefilled email. */
export default function BookingCalendar() {
  const days = useMemo<DaySlot[]>(() => {
    const list: DaySlot[] = [];
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (list.length < DAYS_SHOWN) {
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

  // Derived once per selected day rather than recomputed inside the map. Note the
  // argument is plain `day.dayIndex`: the old `day.dayIndex + activeDay * 3` was
  // really `activeDay * 4`, because `dayIndex` is assigned `list.length` at push
  // time — so both terms were the same number, and the arithmetic read as though
  // it combined two different indices.
  const slots = booking.times.map((time, slotIndex) => ({
    time,
    booked: isSlotBooked(day.dayIndex, slotIndex),
  }));
  const hasAvailability = slots.some((slot) => !slot.booked);

  const request = (slot: string) => {
    setPickedSlot(slot);
    const dateLabel = day.date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    const subject = encodeURIComponent(
      `Intro call request — ${dateLabel}, ${slot} (${booking.timezone})`,
    );
    const body = encodeURIComponent(
      `Hi ${site.firstName},\n\nI'd like to book the ${booking.label.toLowerCase()} on ${dateLabel} at ${slot} (${booking.timezone}).\n\nLooking forward to it!`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setRequested(true);
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-line bg-paper p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-medium tracking-tight md:text-2xl">
          {booking.label}
        </h3>
        <p className="label">{booking.timezone}</p>
      </div>

      {requested ? (
        <m.div
          key="confirmed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-1 flex-col items-start justify-center"
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent">
            ✓ Slot requested
          </p>
          <p className="mt-4 font-display text-2xl font-medium tracking-tight">
            {day.weekday} {day.label} — {pickedSlot}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Your email app is opening with the request pre-filled. I&apos;ll confirm within a few
            hours with a video-call link.
          </p>
          <button
            type="button"
            onClick={() => {
              setRequested(false);
              setPickedSlot(null);
            }}
            className="mt-6 label transition-colors hover:text-ink"
          >
            ← Pick another slot
          </button>
        </m.div>
      ) : (
        <m.div
          key="picker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex flex-1 flex-col"
        >
          <p className="label">Pick a day</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {days.map((d, i) => (
              <button
                key={d.label}
                type="button"
                onClick={() => setActiveDay(i)}
                aria-pressed={activeDay === i}
                className={`rounded-md border px-2 py-3 text-center transition-colors ${
                  activeDay === i ? 'border-accent' : 'border-line hover:border-muted'
                }`}
              >
                <span
                  className={`block font-mono text-[0.6rem] tracking-[0.15em] uppercase ${
                    activeDay === i ? 'text-accent' : 'text-muted'
                  }`}
                >
                  {d.weekday}
                </span>
                <span className="mt-1 block font-mono text-sm">{d.label}</span>
              </button>
            ))}
          </div>

          <p className="label mt-6">Available slots</p>
          {hasAvailability ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {slots.map(({ time, booked }) => (
                <button
                  key={time}
                  type="button"
                  disabled={booked}
                  onClick={() => request(time)}
                  aria-pressed={pickedSlot === time}
                  className={`rounded-md border px-4 py-2.5 font-mono text-xs tracking-[0.15em] uppercase transition-colors ${
                    booked
                      ? 'cursor-not-allowed border-line/60 text-muted/50 line-through'
                      : pickedSlot === time
                        ? 'border-accent bg-accent text-paper'
                        : 'border-line hover:border-accent hover:text-accent'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            // Safety net. `isSlotBooked` caps bookings per day, so this should be
            // unreachable — but a day with nothing left has to say so, rather than
            // print "Available slots" above a row of dead buttons.
            <p className="mt-3 rounded-md border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-muted">
              Every slot on this day is taken. Pick another day above.
            </p>
          )}
          <p className="mt-5 text-xs leading-relaxed text-muted">
            Video call, no strings attached. We&apos;ll talk about your project, timeline and
            whether I&apos;m the right fit — you&apos;ll leave with a clear next step either way.
          </p>
        </m.div>
      )}
    </div>
  );
}
