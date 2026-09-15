import { site } from '../data/site';

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-display text-lg font-bold tracking-tight">
            {site.name}
            <span className="text-acid">.</span>
          </p>
          <p className="mt-1 font-mono text-xs tracking-wide text-fog">
            {site.location} — {site.availability}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs tracking-widest text-fog uppercase transition-colors hover:text-acid"
            >
              {s.label}
            </a>
          ))}
        </div>

        <p className="font-mono text-xs text-fog">© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
