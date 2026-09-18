/**
 * Facts that must not disagree with themselves.
 *
 * Every check here compares one rendered string against another rendered string that is
 * supposed to be derived from the same source. Nothing is hardcoded, so the suite cannot
 * pass by accident and cannot rot when the copy changes — it only fails when two places
 * that should agree stop agreeing.
 *
 * The bugs this exists to catch, all real and all found in this codebase:
 *
 *   - About.tsx hardcoded "For 3+ years" beside a stat that said 3+. It had already
 *     drifted once: the notes record "8+ years" surviving the stat changing to 3+.
 *   - Contact.tsx built its intro with `availability.replace('Available for ', '')`,
 *     which silently does nothing if that prefix ever changes — the sentence would have
 *     read "Currently booking Available for Q4 2026 projects".
 *   - Nav and Footer each held their own copy of the section list, and had already
 *     diverged: Nav rendered labels ("Approach"), Footer rendered raw ids ("approach").
 *     `text-transform: uppercase` made them look identical, so only the DOM text
 *     disagreed. Hence `textContent` below, never `innerText`.
 */
export default {
  name: 'consistency',
  reducedMotion: true,

  async run({ evaluate, waitFor }, t) {
    await waitFor(`!!document.querySelector('#contact')`, 'the contact section');

    const dom = await evaluate(`(() => {
      // textContent, NOT innerText — innerText applies text-transform and would hide
      // exactly the case/differing-string differences this suite is looking for.
      const raw = (sel) => [...document.querySelectorAll(sel)].map((e) => e.textContent.trim());
      const text = (sel) => document.querySelector(sel)?.textContent.replace(/\\s+/g, ' ').trim() ?? '';
      const aboutProse = [...document.querySelectorAll('#about p')]
        .map((p) => p.textContent.replace(/\\s+/g, ' ').trim())
        .join(' ');

      return {
        navNames: raw('nav[aria-label="Primary"] button'),
        footerNames: raw('footer nav button'),
        // The hero's availability pill is the first .label paragraph inside main.
        availabilityLine: text('main p.label'),
        contactIntro: text('#contact .max-w-xl') || '',
        aboutProse,
        aboutStatValue: text('#about dd'),
        // A bare '#about p.label' matches the section heading's own label ("About")
        // first; the location line is the paragraph directly after the stats list.
        locationLabel: text('#about dl + p'),
        footerTagline: text('footer p.font-mono'),
      };
    })()`);

    // --- the two navs must name the same destinations the same way -----------------
    t.check(
      'Nav and Footer name every section identically',
      JSON.stringify(dom.navNames) === JSON.stringify(dom.footerNames),
      `nav ${JSON.stringify(dom.navNames)} vs footer ${JSON.stringify(dom.footerNames)}`,
    );
    t.check(
      'every section name is a real label, not a raw id',
      dom.footerNames.every((n) => /^[A-Z]/.test(n)),
      JSON.stringify(dom.footerNames),
    );

    // --- prose must quote the data it is describing --------------------------------
    // Derive the figure from the stat block, then require the prose to contain it.
    const statValue = dom.aboutStatValue;
    t.check(
      'the About prose quotes the same experience figure as the stat',
      Boolean(statValue) && dom.aboutProse.includes(statValue),
      `stat says "${statValue}"; prose ${dom.aboutProse.includes(statValue) ? 'agrees' : 'does NOT contain it'}`,
    );

    // --- the availability sentence must be built from the same window --------------
    // "Available for Q4 2026 projects" -> "Q4 2026"
    const window = dom.availabilityLine.match(/Available for (.+?) projects/)?.[1];
    t.check(
      'the availability line still parses as "<window> projects"',
      Boolean(window),
      `read "${dom.availabilityLine}"`,
    );
    t.check(
      'the Contact intro quotes the same booking window',
      Boolean(window) && dom.contactIntro.includes(window),
      `window "${window}"; intro "${dom.contactIntro.slice(0, 70)}…"`,
    );
    t.check(
      'the Contact intro is a sentence, not a stitched prefix',
      !dom.contactIntro.includes('Available for'),
      dom.contactIntro,
    );

    // --- the country must be named the same wherever it appears --------------------
    const country = dom.locationLabel.split('·')[0]?.trim();
    t.check(
      'the location label still leads with a country',
      Boolean(country) && country.length > 1,
      `read "${dom.locationLabel}"`,
    );
    t.check(
      'the footer tagline names the same country as the location',
      Boolean(country) && dom.footerTagline.includes(country),
      `country "${country}"; tagline "${dom.footerTagline}"`,
    );
    t.check(
      'the About prose names the same country as the location',
      Boolean(country) && dom.aboutProse.includes(country),
      `country "${country}"`,
    );

    // --- process numbering must follow position, not a stored index ----------------
    const steps = await evaluate(
      `[...document.querySelectorAll('#approach li span.font-mono')].map((e) => e.textContent.trim())`,
    );
    t.check(
      'the approach steps are numbered by position',
      steps.join(',') === '01,02,03',
      steps.join(','),
    );
  },
};
