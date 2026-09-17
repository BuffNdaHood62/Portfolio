import { useLocation, useNavigate } from 'react-router-dom';
import { site } from '../data/site';
import Icon from './Icon';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const goTo = (id: string) => {
    // Navigation is fire-and-forget: Home reads scrollTo from location.state.
    if (location.pathname !== '/') void navigate('/', { state: { scrollTo: id } });
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-3xl font-semibold tracking-tight">
              {site.firstName} Nnamdi<span className="text-accent">.</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {site.role} — {site.location}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-block text-sm underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
            >
              {site.email}
            </a>
          </div>

          <nav className="flex flex-col gap-2.5" aria-label="Footer">
            {['approach', 'services', 'about', 'contact'].map((id) => (
              <button
                key={id}
                onClick={() => goTo(id)}
                className="label text-left transition-colors hover:text-ink"
              >
                {id}
              </button>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="label inline-flex w-fit items-center gap-2 transition-colors hover:text-ink"
              >
                <Icon name={s.icon} className="size-4 shrink-0" />
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase">
            Designed & built in Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}
