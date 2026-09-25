import { useCallback, useRef, useState } from 'react';

/** Crossfade duration from the `theme-animating` rule in index.css, plus a frame. */
const CROSSFADE_MS = 250 + 50;

/**
 * Class-based theme, mirroring the bootstrap script in index.html.
 *
 * The initial state is read from the `dark` class the head script already set —
 * not recomputed from storage — so React and the pre-paint script cannot disagree
 * about what is on screen. The 'theme' key and 'dark' class name must stay in sync
 * with that script.
 */
export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const timer = useRef(0);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    // Enables the colour crossfade for the flip; see the `theme-animating` block
    // in index.css. Reduced-motion users get the instant switch — the media block
    // there neutralises the transitions, not this code.
    root.classList.add('theme-animating');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => root.classList.remove('theme-animating'), CROSSFADE_MS);

    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light');
      } catch {
        /* storage unavailable (private mode): the class flip still applies live */
      }
      return next;
    });
  }, []);

  return { dark, toggle };
}
