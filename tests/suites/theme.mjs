/**
 * Theme toggle, crossfade and persistence.
 *
 * The dark palette is a runtime class flip, and three separate pieces must agree:
 * the bootstrap script in index.html, the `dark` class, and the 'theme' storage key
 * lib/theme.ts writes. A mismatch is invisible in a screenshot — the page just
 * quietly ignores the user's choice on the next visit — so the reload half of this
 * suite is the part that matters.
 *
 * The crossfade is the `theme-animating` class lib/theme.ts puts on <html> around a
 * toggle, which index.css turns into a 250ms colour transition. It must exist when
 * motion is allowed and be flattened to instant when reduced — the class is checked
 * in the same evaluate as the click, because it is gone again after ~300ms.
 */
export default {
  name: 'theme',
  // Starts with motion allowed so the crossfade half can be observed at all;
  // reduced motion is toggled later with Emulation.setEmulatedMedia.
  reducedMotion: false,

  async run({ evaluate, waitFor, send, sleep }, t) {
    await waitFor(`!!document.querySelector('header')`, 'the header');

    const toggleSel = `header button[aria-label^="Switch to"]`;
    const toggle = await evaluate(`(() => {
      const b = document.querySelector(${JSON.stringify(toggleSel)});
      return b ? b.getAttribute('aria-label') : null;
    })()`);
    t.check('the header offers a named theme toggle', Boolean(toggle), String(toggle));

    // --- the crossfade ---------------------------------------------------------------
    const setReducedMotion = (value) =>
      send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value }],
      });

    // Click and read in one evaluate: the class is added synchronously by the
    // handler and removed 300ms later — a round trip would miss it.
    const probeToggle = () =>
      evaluate(`(() => {
        document.querySelector(${JSON.stringify(toggleSel)}).click();
        return {
          animating: document.documentElement.classList.contains('theme-animating'),
          duration: parseFloat(getComputedStyle(document.body).transitionDuration),
        };
      })()`);

    await setReducedMotion('no-preference');
    const animated = await probeToggle();
    t.check(
      'the toggle arms the colour crossfade',
      animated.animating && Math.abs(animated.duration - 0.25) < 0.01,
      `theme-animating=${animated.animating}, body transition ${animated.duration}s`,
    );
    await sleep(450);
    t.check(
      'the crossfade class clears itself',
      !(await evaluate(`document.documentElement.classList.contains('theme-animating')`)),
      'theme-animating removed after the flip',
    );

    await setReducedMotion('reduce');
    const instant = await probeToggle();
    t.check(
      'reduced motion keeps the flip instant',
      instant.duration < 0.05,
      `body transition ${instant.duration}s with the preference active`,
    );
    await setReducedMotion('no-preference');
    await sleep(450);

    const startDark = await evaluate(`document.documentElement.classList.contains('dark')`);

    await evaluate(`document.querySelector(${JSON.stringify(toggleSel)}).click()`);
    await sleep(250);
    const flipped = await evaluate(
      `document.documentElement.classList.contains('dark')`,
    );
    t.check(
      'clicking the toggle flips the theme class',
      flipped === !startDark,
      `was ${startDark}, now ${flipped}`,
    );

    const paper = await evaluate(
      `getComputedStyle(document.documentElement).getPropertyValue('--paper').trim()`,
    );
    const expectedPaper = flipped ? '#14110d' : '#faf7f2';
    t.check(
      'the paper token follows the theme class',
      paper.toLowerCase() === expectedPaper,
      `--paper = ${paper}`,
    );

    const stored = await evaluate(`localStorage.getItem('theme')`);
    t.check(
      'the choice is written to storage',
      stored === (flipped ? 'dark' : 'light'),
      `localStorage.theme = ${stored}`,
    );

    // Reload through the same URL the server handed us. If the bootstrap script in
    // index.html and the storage key ever disagree, the page comes back in the
    // default theme and this check is the one that says so.
    const href = await evaluate('location.href');
    await send('Page.navigate', { url: href });
    await waitFor(`!!document.querySelector('h1')`, 'the page to reload');
    const afterReload = await evaluate(
      `document.documentElement.classList.contains('dark')`,
    );
    t.check(
      'the theme survives a reload',
      afterReload === flipped,
      `dark after reload: ${afterReload}`,
    );

    await evaluate(`document.querySelector(${JSON.stringify(toggleSel)}).click()`);
    await sleep(250);
    const restored = await evaluate(
      `document.documentElement.classList.contains('dark')`,
    );
    t.check(
      'the toggle flips back',
      restored === startDark,
      `dark: ${restored} (started ${startDark})`,
    );
  },
};
