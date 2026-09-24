/**
 * The in-page scroll must honour `prefers-reduced-motion` — and must still animate when
 * the preference is absent.
 *
 * Both halves matter. `scrollIntoView({ behavior: 'smooth' })` ignores the preference
 * entirely, and nothing else in the app covered that: the `@media (prefers-reduced-motion)`
 * block in `index.css` only reaches CSS transitions and compositor animation, and
 * `SmoothScroll` bails out of Lenis. Measured before the fix: **25 distinct scroll
 * positions** across ~500ms with the preference active.
 *
 * The test would be worthless if it only checked the reduced case, because "always jump
 * instantly" also passes that — hence the animated check first.
 *
 * The preference is toggled at runtime with `Emulation.setEmulatedMedia` rather than by
 * launching two browsers, so both halves run against the same page.
 */
export default {
  name: 'motion',
  // Start with motion allowed so the animated half can be tested at all.
  reducedMotion: false,

  async run({ evaluate, waitFor, click, send, sleep }, t) {
    await waitFor(`!!document.querySelector('nav[aria-label="Primary"] button')`, 'the nav');

    const setReducedMotion = (value) =>
      send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value }],
      });

    const prefersReduced = () =>
      evaluate(`window.matchMedia('(prefers-reduced-motion: reduce)').matches`);

    // Where #about should land: its offset, less the fixed header that every section
    // clears with `scroll-mt-24` (96px).
    const expected = await evaluate(`(() => {
      const el = document.getElementById('about');
      return Math.round(el.getBoundingClientRect().top + window.scrollY - 96);
    })()`);

    /**
     * Start far down the page, click the first nav link, then sample the scroll position
     * every 20ms. An animated scroll passes through many positions; an instant one is
     * already at its destination on the first sample.
     *
     * The sampling window is deliberately short — it only has to *detect* movement. The
     * landing position is read afterwards, once the scroll has stopped, because a smooth
     * scroll runs longer than the window (it was still 67px short when this read the last
     * sample instead of waiting).
     */
    const scrollAndSample = async () => {
      await evaluate('window.scrollTo(0, 3200)');
      await sleep(400);
      await click('nav[aria-label="Primary"] button', 0);
      const samples = [];
      for (let i = 0; i < 20; i++) {
        samples.push(await evaluate('Math.round(window.scrollY)'));
        await sleep(20);
      }

      // Poll until the position stops changing (two identical reads in a row).
      let previous = null;
      let settled = samples.at(-1);
      for (let i = 0; i < 40; i++) {
        await sleep(50);
        settled = await evaluate('Math.round(window.scrollY)');
        if (settled === previous) break;
        previous = settled;
      }
      return { distinct: [...new Set(samples)], settled };
    };

    // --- motion allowed: the scroll should animate ---------------------------------
    await setReducedMotion('no-preference');
    const off = await prefersReduced();
    t.check('the motion preference can be turned off for the test', off === false, `matches=${off}`);

    const animated = await scrollAndSample();
    t.check(
      'with motion allowed, the in-page scroll animates',
      animated.distinct.length > 3,
      `${animated.distinct.length} distinct positions, settled at ${animated.settled}`,
    );
    t.check(
      'the animated scroll lands on the section',
      Math.abs(animated.settled - expected) <= 2,
      `settled ${animated.settled}, expected ${expected}`,
    );

    // --- reduced motion: it must not ------------------------------------------------
    await setReducedMotion('reduce');
    const on = await prefersReduced();
    t.check('the motion preference can be turned on for the test', on === true, `matches=${on}`);

    const instant = await scrollAndSample();
    t.check(
      'with reduced motion, the in-page scroll is instant',
      instant.distinct.length === 1,
      `${instant.distinct.length} distinct position(s): ${instant.distinct.slice(0, 4).join(', ')}`,
    );
    t.check(
      'the reduced-motion jump still lands on the section',
      Math.abs(instant.settled - expected) <= 2,
      `settled ${instant.settled}, expected ${expected}`,
    );
  },
};
