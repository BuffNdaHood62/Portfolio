interface SectionHeadingProps {
  index: string;
  title: string;
  hint?: string;
}

export default function SectionHeading({ index, title, hint }: SectionHeadingProps) {
  return (
    <div className="mb-12 flex items-end justify-between gap-6 border-b border-line pb-6 md:mb-16">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-sm text-acid">({index})</span>
        <h2 className="font-display text-4xl font-bold tracking-tight uppercase md:text-6xl">{title}</h2>
      </div>
      {hint && <p className="hidden font-mono text-xs tracking-widest text-fog uppercase md:block">{hint}</p>}
    </div>
  );
}
