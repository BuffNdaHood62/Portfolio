/**
 * In-page scrolling that respects `prefers-reduced-motion`.
 *
 * `scrollIntoView({ behavior: 'smooth' })` animates **regardless** of the preference.
 * Nothing else in the app covers that case: the `@media (prefers-reduced-motion)` block
 * in `index.css` only reaches CSS transitions and compositor animation, and `SmoothScroll`
 * bails out of Lenis. So the in-page navigation was the one motion path that ignored the
 * setting — measured at 25 distinct scroll positions across ~500ms with the preference
 * active.
 *
 * The preference is read at call time rather than through a hook: it can change while the
 * page is open, and an event handler needs the current value, not the one from the last
 * render. `matchMedia` here matches how `Nav.tsx` and `SmoothScroll.tsx` already read it.
 */

/** True when the user has asked the system to reduce motion. */
function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Scroll a section into view, clearing the fixed header.
 *
 * Every section carries `scroll-mt-24`, which is what provides that offset — this only
 * decides whether the movement is animated.
 */
export function scrollToSection(id: string): void {
  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  });
}

/** Return to the top of the page, likewise honouring the preference. */
export function scrollToPageTop(): void {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}
