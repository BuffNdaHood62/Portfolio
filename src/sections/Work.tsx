import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import { projects, projectTypes, projectIndustries, projectSkills } from '../data/projects';

type Dimension = 'type' | 'industry' | 'skill';

interface Filters {
  type: string | null;
  industry: string | null;
  skill: string | null;
}

const emptyFilters: Filters = { type: null, industry: null, skill: null };

export default function Work() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  const toggle = (dimension: Dimension, value: string) => {
    setFilters((f) => ({
      ...emptyFilters,
      [dimension]: f[dimension] === value ? null : value,
    }));
  };

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (!filters.type || p.type === filters.type) &&
          (!filters.industry || p.industry === filters.industry) &&
          (!filters.skill || p.skills.includes(filters.skill)),
      ),
    [filters],
  );

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <section id="work" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-36">
      <SectionHeading index="01" title="Selected Work" hint="Interactive showcase" />

      {/* filter bar */}
      <div className="mb-4 flex flex-col gap-4 rounded-lg border border-line bg-surface/60 p-5 md:p-6">
        <FilterRow
          label="Type"
          options={projectTypes}
          active={filters.type}
          onToggle={(v) => toggle('type', v)}
        />
        <FilterRow
          label="Industry"
          options={projectIndustries}
          active={filters.industry}
          onToggle={(v) => toggle('industry', v)}
        />
        <FilterRow
          label="Skill"
          options={projectSkills}
          active={filters.skill}
          onToggle={(v) => toggle('skill', v)}
        />
      </div>

      <div className="mb-10 flex items-center justify-between">
        <p className="font-mono text-xs tracking-widest text-fog uppercase" aria-live="polite">
          {filtered.length} project{filtered.length === 1 ? '' : 's'}
          {activeCount > 0 && ' matched'}
        </p>
        {activeCount > 0 && (
          <button
            onClick={() => setFilters(emptyFilters)}
            className="font-mono text-xs tracking-widest text-acid uppercase underline-offset-4 hover:underline"
          >
            ✕ Clear filters
          </button>
        )}
      </div>

      {/* grid */}
      {filtered.length > 0 ? (
        <motion.div layout className="grid gap-8 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="rounded-lg border border-dashed border-line py-20 text-center">
          <p className="font-display text-2xl font-bold tracking-tight text-fog uppercase">
            Nothing matches that combination
          </p>
          <p className="mt-3 text-sm text-fog">
            Try removing a filter — or be the first client to commission it.
          </p>
          <button
            onClick={() => setFilters(emptyFilters)}
            className="mt-6 rounded-full border border-line px-6 py-3 font-mono text-xs tracking-widest text-ink uppercase transition-colors hover:border-acid hover:text-acid"
          >
            Show all work
          </button>
        </div>
      )}
    </section>
  );
}

function FilterRow({
  label,
  options,
  active,
  onToggle,
}: {
  label: string;
  options: string[];
  active: string | null;
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 w-16 shrink-0 font-mono text-[0.65rem] tracking-widest text-fog uppercase">
        {label}
      </span>
      {options.map((opt) => {
        const isActive = active === opt;
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            aria-pressed={isActive}
            className={`rounded-full border px-4 py-1.5 font-mono text-xs tracking-widest uppercase transition-all ${
              isActive
                ? 'border-acid bg-acid text-base'
                : 'border-line text-fog hover:border-fog hover:text-ink'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
