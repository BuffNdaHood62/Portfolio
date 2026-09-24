import { useCallback, useState } from 'react';

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

  const toggle = useCallback(() => {
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
