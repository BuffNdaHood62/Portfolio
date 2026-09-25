import { useEffect, useState } from 'react';
import { scrollToPageTop } from '../lib/scroll';
import Icon from './Icon';

/**
 * Appears once the hero is left behind and stays until the top is reached again —
 * a button that only existed at the very end of the page would be useless for the
 * scroll above it.
 *
 * Plain CSS transitions on a permanently mounted button, deliberately not framer:
 * the shown/hidden state retargets mid-fade when the user scrolls back and forth,
 * which transitions handle and keyframes do not. `inert` removes it from tab order
 * and hit-testing while invisible. `scrollToPageTop` already honours
 * prefers-reduced-motion; the media block in index.css flattens the fade itself.
 */
export default function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToPageTop}
      aria-label="Back to top"
      inert={!shown}
      className={`fixed right-6 bottom-6 z-40 grid size-11 place-items-center rounded-full border border-line bg-surface text-ink transition-[opacity,translate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-ink ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <Icon name="arrowUp" className="size-4" />
    </button>
  );
}
