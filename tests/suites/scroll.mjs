/**
 * Navigation and scroll behaviour: the router is gone, every nav action is an
 * in-page scroll, and each section carries `scroll-mt-24` (96px) to clear the
 * fixed header. A screenshot cannot prove a click scrolls anywhere, so this clicks
 * real elements and asserts where the page actually ended up.
 *
 * Runs with reduced motion: Lenis disables itself and
 * `scrollIntoView({ behavior: 'smooth' })` resolves instantly, making the
 * assertions deterministic instead of timing-dependent.
 */
const HEADER_OFFSET = 96;

const settledExpr = (id) => `(() => {
  const el = document.getElementById(${JSON.stringify(id)});
  return !!el && Math.abs(Math.round(el.getBoundingClientRect().top) - ${HEADER_OFFSET}) <= 10;
})()`;

const sectionTopExpr = (id) => `(() => {
  const el = document.getElementById(${JSON.stringify(id)});
  if (!el) return null;
  return { top: Math.round(el.getBoundingClientRect().top), scrollY: Math.round(window.scrollY) };
})()`;

/** Click the first element matching `sel` whose normalised text equals `text`. */
const clickTextExpr = (sel, text) => `(() => {
  const norm = (s) => s.replace(/\\s+/g, ' ').trim().toLowerCase();
  const el = [...document.querySelectorAll(${JSON.stringify(sel)})]
    .find((e) => norm(e.textContent) === ${JSON.stringify(text.toLowerCase())});
  if (!el) return 'NOT_FOUND';
  el.click();
  return 'CLICKED';
})()`;

export default {
  name: 'scroll',
  reducedMotion: true,

  async run({ evaluate, waitFor, send, sleep }, t) {
    await waitFor(
      `!!document.getElementById('skills') && !!document.querySelector('nav[aria-label="Primary"] button')`,
      'the app to mount',
    );

    // --- 1. The router is really gone ---------------------------------------
    const hash = await evaluate('location.hash');
    t.check('URL carries no router hash', hash === '', `location.hash = ${JSON.stringify(hash)}`);

    // --- 2. Desktop nav is visible at 1280 (md: breakpoint intact) ----------
    const navVisible = await evaluate(`(() => {
      const nav = document.querySelector('nav[aria-label="Primary"]');
      return !!nav && getComputedStyle(nav).display !== 'none';
    })()`);
    t.check('desktop nav visible at 1280px', navVisible === true, `display !== none -> ${navVisible}`);

    // --- 3. Desktop nav click reaches the section, clear of the header ------
    const navClick = await evaluate(clickTextExpr('nav[aria-label="Primary"] button', 'Skills'));
    const navSettled = await waitFor(settledExpr('skills'), '#skills to settle');
    const svc = await evaluate(sectionTopExpr('skills'));
    t.check(
      'nav "Skills" click scrolls to #skills',
      navClick === 'CLICKED' && navSettled && !!svc && svc.scrollY > 100 && Math.abs(svc.top - HEADER_OFFSET) <= 10,
      `${navClick}; scrollY=${svc?.scrollY}, top=${svc?.top} (want ~${HEADER_OFFSET})`,
    );

    // --- 4. Logo returns to top ---------------------------------------------
    const logoClick = await evaluate(`(() => {
      const b = [...document.querySelectorAll('header button')].find((x) => x.textContent.includes('Nnamdi'));
      if (!b) return 'NOT_FOUND';
      b.click();
      return 'CLICKED';
    })()`);
    await waitFor('Math.round(window.scrollY) === 0', 'scroll to return to top');
    const afterLogo = await evaluate('Math.round(window.scrollY)');
    t.check(
      'logo click returns to top',
      logoClick === 'CLICKED' && afterLogo === 0,
      `${logoClick}; scrollY=${afterLogo}`,
    );

    // --- 5. Back to top ------------------------------------------------------
    // The button is permanently mounted and toggles between inert/hidden and
    // live/visible, so the checks read the same two signals: computed opacity
    // and the presence of `inert`.
    const topBtn = `'button[aria-label="Back to top"]'`;
    const probeTopBtn = () =>
      evaluate(`(() => {
        const b = document.querySelector(${topBtn});
        if (!b) return null;
        return { opacity: parseFloat(getComputedStyle(b).opacity), inert: b.hasAttribute('inert') };
      })()`);

    // The logo click above left us at scrollY 0 — it must be tucked away here.
    // Short settle first: the hide is driven by a scroll event into React state.
    await sleep(200);
    const atTop = await probeTopBtn();
    t.check(
      'back-to-top is hidden at the top of the page',
      !!atTop && atTop.opacity < 0.05 && atTop.inert,
      JSON.stringify(atTop),
    );

    await evaluate('window.scrollTo(0, document.documentElement.scrollHeight)');
    await sleep(300);
    const atBottom = await probeTopBtn();
    t.check(
      'back-to-top appears once the hero is left behind, through to the end',
      !!atBottom && atBottom.opacity > 0.95 && !atBottom.inert,
      JSON.stringify(atBottom),
    );

    await evaluate(`document.querySelector(${topBtn}).click()`);
    await waitFor('Math.round(window.scrollY) === 0', 'back-to-top to return to the top');
    await sleep(200);
    const afterTopBtn = await probeTopBtn();
    t.check(
      'back-to-top click returns to the top and hides again',
      (await evaluate('Math.round(window.scrollY)')) === 0 &&
        !!afterTopBtn &&
        afterTopBtn.opacity < 0.05 &&
        afterTopBtn.inert,
      JSON.stringify(afterTopBtn),
    );

    // --- 6. Footer link ------------------------------------------------------
    const footerClick = await evaluate(clickTextExpr('nav[aria-label="Footer"] button', 'contact'));
    const footerSettled = await waitFor(settledExpr('contact'), '#contact to settle');
    const con = await evaluate(sectionTopExpr('contact'));
    t.check(
      'footer "contact" click scrolls to #contact',
      footerClick === 'CLICKED' && footerSettled && !!con && con.scrollY > 100 && Math.abs(con.top - HEADER_OFFSET) <= 10,
      `${footerClick}; scrollY=${con?.scrollY}, top=${con?.top} (want ~${HEADER_OFFSET})`,
    );

    // --- 7. Mobile menu ------------------------------------------------------
    // 500 rather than 390: Windows headless clamps to a ~500px minimum width, so a
    // narrower request is silently letterboxed and the test would be measuring a
    // viewport it never got.
    await send('Emulation.setDeviceMetricsOverride', {
      width: 500,
      height: 900,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await waitFor(
      `getComputedStyle(document.querySelector('nav[aria-label="Primary"]')).display === 'none'`,
      'desktop nav to hide at 500px',
    );
    await evaluate('window.scrollTo(0, 0)');
    await sleep(300);

    // Target the hamburger by name: the header now also holds a theme toggle with
    // its own aria-label, and a bare `[aria-label]` would click whichever comes first.
    const burgerSel = `'header button[aria-label="Open menu"], header button[aria-label="Close menu"]'`;
    await evaluate(`document.querySelector(${burgerSel}).click()`);
    await waitFor(`!!document.querySelector('nav[aria-label="Mobile"]')`, 'mobile menu to open');
    const menu = await evaluate(`(() => {
      const nav = document.querySelector('nav[aria-label="Mobile"]');
      const burger = document.querySelector(${burgerSel});
      return { menuOpen: !!nav, expanded: burger?.getAttribute('aria-expanded') };
    })()`);
    t.check(
      'mobile hamburger opens the menu',
      menu.menuOpen && menu.expanded === 'true',
      JSON.stringify(menu),
    );

    const mobileClick = await evaluate(clickTextExpr('nav[aria-label="Mobile"] button', 'About'));
    const mobileSettled = await waitFor(settledExpr('about'), '#about to settle');
    const mobileAfter = await evaluate(`(() => {
      const nav = document.querySelector('nav[aria-label="Mobile"]');
      const el = document.getElementById('about');
      return { menuClosed: !nav, top: Math.round(el.getBoundingClientRect().top) };
    })()`);
    t.check(
      'mobile link scrolls to #about and closes the menu',
      mobileClick === 'CLICKED' && mobileSettled && mobileAfter.menuClosed && Math.abs(mobileAfter.top - HEADER_OFFSET) <= 10,
      `${mobileClick}; menuClosed=${mobileAfter.menuClosed}, top=${mobileAfter.top} (want ~${HEADER_OFFSET})`,
    );
  },
};
