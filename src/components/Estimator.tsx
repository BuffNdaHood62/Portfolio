import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { estimateConfig, budgetOptions } from '../data/site';

interface EstimatorProps {
  onApply: (budget: string) => void;
}

function formatK(v: number) {
  return `€${Math.round(v / 1000)}k`;
}

function bucketFor(high: number) {
  if (high < 5000) return budgetOptions[0];
  if (high < 10000) return budgetOptions[1];
  if (high < 25000) return budgetOptions[2];
  if (high < 50000) return budgetOptions[3];
  return budgetOptions[4];
}

export default function Estimator({ onApply }: EstimatorProps) {
  const types = Object.keys(estimateConfig.base);
  const [type, setType] = useState(types[0]);
  const [scopeId, setScopeId] = useState('standard');
  const [timelineId, setTimelineId] = useState('standard');

  const scope = estimateConfig.scope.find((s) => s.id === scopeId)!;
  const timeline = estimateConfig.timeline.find((t) => t.id === timelineId)!;

  const range = useMemo(() => {
    const mid = estimateConfig.base[type] * scope.mult * timeline.mult;
    return { low: mid * 0.85, high: mid * 1.15 };
  }, [type, scope, timeline]);

  return (
    <div className="rounded-lg border border-line bg-surface/60 p-6 md:p-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl font-bold tracking-tight uppercase md:text-3xl">
          Scope your project
        </h3>
        <p className="font-mono text-xs tracking-widest text-fog uppercase">
          Instant estimate — no email required
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-7">
        <div>
          <p className="mb-3 font-mono text-[0.65rem] tracking-widest text-fog uppercase">
            01 — What do you need?
          </p>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                aria-pressed={type === t}
                className={`rounded-full border px-5 py-2 font-mono text-xs tracking-widest uppercase transition-all ${
                  type === t
                    ? 'border-acid bg-acid text-base'
                    : 'border-line text-fog hover:border-fog hover:text-ink'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 font-mono text-[0.65rem] tracking-widest text-fog uppercase">
            02 — How big is the scope?
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {estimateConfig.scope.map((s) => (
              <button
                key={s.id}
                onClick={() => setScopeId(s.id)}
                aria-pressed={scopeId === s.id}
                className={`rounded-md border p-4 text-left transition-all ${
                  scopeId === s.id
                    ? 'border-acid bg-acid/5'
                    : 'border-line hover:border-fog'
                }`}
              >
                <span className={`font-mono text-xs font-medium tracking-widest uppercase ${scopeId === s.id ? 'text-acid' : 'text-ink'}`}>
                  {s.label}
                </span>
                <span className="mt-2 block text-xs leading-relaxed text-fog">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 font-mono text-[0.65rem] tracking-widest text-fog uppercase">
            03 — When do you want to start?
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {estimateConfig.timeline.map((t) => (
              <button
                key={t.id}
                onClick={() => setTimelineId(t.id)}
                aria-pressed={timelineId === t.id}
                className={`rounded-md border p-4 text-left transition-all ${
                  timelineId === t.id
                    ? 'border-acid bg-acid/5'
                    : 'border-line hover:border-fog'
                }`}
              >
                <span className={`font-mono text-xs font-medium tracking-widest uppercase ${timelineId === t.id ? 'text-acid' : 'text-ink'}`}>
                  {t.label}
                </span>
                <span className="mt-2 block text-xs leading-relaxed text-fog">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-9 flex flex-col items-start gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${range.low}-${range.high}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="font-display text-4xl font-bold tracking-tight md:text-5xl"
            >
              {formatK(range.low)}
              <span className="text-fog"> — </span>
              {formatK(range.high)}
            </motion.p>
          </AnimatePresence>
          <p className="mt-2 font-mono text-[0.65rem] tracking-widest text-fog uppercase">
            Indicative range for {type} · {scope.label} · {timeline.label}
          </p>
        </div>
        <button
          onClick={() => onApply(bucketFor(range.high))}
          className="shrink-0 rounded-full bg-acid px-7 py-3.5 font-mono text-xs font-medium tracking-widest text-base uppercase transition-transform hover:scale-105"
        >
          Use in enquiry →
        </button>
      </div>
    </div>
  );
}
