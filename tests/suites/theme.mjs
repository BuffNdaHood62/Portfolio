/**
 * Theme toggle and persistence.
 *
 * The dark palette is a runtime class flip, and three separate pieces must agree:
 * the bootstrap script in index.html, the `dark` class, and the 'theme' storage key
 * lib/theme.ts writes. A mismatch is invisible in a screenshot — the page just
 * quietly ignores the user's choice on the next visit — so the reload half of this
 * suite is the part that matters.
 */
export default {
  name: 'theme',
  reducedMotion: true,

  async run({ evaluate, waitFor, send, sleep }, t) {
    await waitFor(`!!document.querySelector('header')`, 'the header');

    const toggleSel = `header button[aria-label^="Switch to"]`;
    const toggle = await evaluate(`(() => {
      const b = document.querySelector(${JSON.stringify(toggleSel)});
      return b ? b.getAttribute('aria-label') : null;
    })()`);
    t.check('the header offers a named theme toggle', Boolean(toggle), String(toggle));

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
