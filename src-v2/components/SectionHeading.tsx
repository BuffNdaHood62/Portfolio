import type { ReactNode } from 'react';
import { sectionNumber } from '../data/site';
import Reveal from './Reveal';

interface SectionHeadingProps {
  id: string;
  label: string;
  title?: ReactNode;
  intro?: string;
}

export default function SectionHeading({ id, label, title, intro }: SectionHeadingProps) {
  return (
    <Reveal>
      <div className="border-t border-line pt-6">
        <p className="label">
          {sectionNumber(id)} — {label}
        </p>
        {title && (
          <h2 className="mt-6 max-w-2xl font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl">
            {title}
          </h2>
        )}
        {intro && <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">{intro}</p>}
      </div>
    </Reveal>
  );
}
