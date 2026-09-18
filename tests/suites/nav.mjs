/**
 * Mobile menu lifecycle.
 *
 * The menu must be closable three ways — the toggle, picking a link, and Escape —
 * and must clear itself when the viewport crosses to desktop. That last one is the
 * subtle one: the toggle is `md:hidden`, so past the breakpoint a stale `open` can
 * never be reset by hand, leaving the mobile nav in the DOM and the header stuck
 * with its blurred background at scroll top.
 *
 * Every check drives from the *observed* state rather than assuming the previous
 * step left things where it intended. An earlier version assumed, and a failing
 * Escape check cascaded into a resize assertion that passed against an
 * already-closed menu — a green check that proved nothing.
 */
export default {
  name: 'nav',
  reducedMotion: true,

  async run({ evaluate, waitFor, send, sleep }, t) {
    await waitFor(`!!document.querySelector('header')`, 'the header');

    const toggle = `header button[aria-label="Open menu"], header button[aria-label="Close menu"]`;
    // The mobile nav is `md:hidden`, so at desktop width it is CSS-hidden but still
    // present in the DOM whenever `open` is true. Its presence is therefore a probe
    // for the React state, independent of what is visible.
    const isOpen = () => evaluate(`!!document.querySelector('nav[aria-label="Mobile"]')`);
    const blur = `getComputedStyle(document.querySelector('header')).backdropFilter`;

    const clickToggle = async () => {
      await evaluate(`document.querySelector(${JSON.stringify(toggle)}).click()`);
      await sleep(250);
    };
    const ensureOpen = async () => {
      if (!(await isOpen())) await clickToggle();
    };
    const ensureClosed = async () => {
      if (await isOpen()) await clickToggle();
    };

    const setWidth = (width) =>
      send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      });

    await setWidth(520);
    await sleep(300);

    await ensureClosed();
    await clickToggle();
    t.check('toggle click opens the mobile menu', await isOpen(), 'mobile nav present in the DOM');

    await evaluate(
      `document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`,
    );
    await sleep(250);
    t.check('Escape closes the open menu', !(await isOpen()), 'mobile nav removed from the DOM');

    await ensureOpen();
    t.check('menu is open before the resize check', await isOpen(), 'precondition for the next check');

    await setWidth(1280);
    await sleep(400);
    t.check(
      'resizing to desktop clears the open state',
      !(await isOpen()),
      'no stale mobile nav left in the DOM',
    );
    t.check(
      'header has no blurred background at scroll top after resizing',
      !(await evaluate(blur)).includes('blur'),
      `backdropFilter = ${await evaluate(blur)}`,
    );

    await setWidth(520);
    await sleep(300);
    await ensureClosed();
    t.check('menu can still be closed on mobile afterwards', !(await isOpen()), 'state is recoverable');
  },
};
