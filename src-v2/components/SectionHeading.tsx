import type { ReactNode } from 'react';
import Reveal from './Reveal';

interface SectionHeadingProps {
  label: string;
  title?: ReactNode;
  intro?: string;
}

export default function SectionHeading({ label, title, intro }: SectionHeadingProps) {
  return (
    <Reveal>
      <div className="border-t border-line pt-6">
        <p className="label">{label}</p>
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
