import { site } from '../data/site';

export default function Marquee() {
  const items = [...site.marquee, ...site.marquee];

  return (
    <div className="overflow-hidden border-y border-line bg-surface py-4" aria-hidden="true">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-lg font-medium tracking-wide text-ink uppercase">
              {item}
            </span>
            <span className="text-sm text-acid">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
