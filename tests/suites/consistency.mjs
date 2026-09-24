/**
 * Facts that must not disagree with themselves.
 *
 * Every check here compares one rendered string against another rendered string (or a
 * rendered count) that is supposed to be derived from the same source. Nothing is
 * hardcoded, so the suite cannot pass by accident and cannot rot when the copy changes
 * — it only fails when two places that should agree stop agreeing.
 *
 * The bugs this exists to catch, all real and all found in this codebase:
 *
 *   - About.tsx hardcoded "For 3+ years" beside a stat that said 3+. It had already
 *     drifted once: the notes record "8+ years" surviving the stat changing to 3+.
 *   - Nav and Footer each held their own copy of the section list, and had already
 *     diverged. `text-transform: uppercase` made them look identical, so only the DOM
 *     text disagreed. Hence `textContent` below, never `innerText`.
 *   - Social links once pointed at bare homepages (github.com, dribbble.com) while the
 *     copy implied real profiles. The repository check below is the guard.
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

      // The hero's availability pill is the first paragraph in main.
      const availabilityLine = text('main p');
      // Hero stats are the dd values of the first dl in main.
      const heroStats = [...(document.querySelector('main dl')?.querySelectorAll('dd') ?? [])]
        .map((dd) => dd.textContent.trim());
      const shippedLinks = [...document.querySelectorAll('#work [data-group="shipped"] a[href]')]
        .map((a) => a.getAttribute('href'));

      return {
        navNames: raw('nav[aria-label="Primary"] button'),
        footerNames: raw('footer nav button'),
        availabilityLine,
        contactIntro: text('#contact .max-w-xl') || '',
        aboutProse,
        heroStats,
        shippedLinks,
        shippedCount: document.querySelectorAll('#work [data-group="shipped"] article').length,
        queueCount: document.querySelectorAll('#work [data-group="queue"] article').length,
        skillCount: [...document.querySelectorAll('#skills article')].filter(
          (a) => a.querySelector('span[aria-hidden] + span')?.textContent.trim() !== 'Learning',
        ).length,
        inProgressBadges: [...document.querySelectorAll('#roadmap ol > li')].filter(
          (li) => li.querySelector('span:last-child')?.textContent.trim() === 'In progress',
        ).length,
        roadmapRows: [...document.querySelectorAll('#roadmap ol > li')]
          .map((li) => li.querySelector('span')?.textContent.trim() ?? ''),
        // The location line is the paragraph directly after the stats list in About.
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
    t.check(
      'the Contact intro quotes the hero availability line verbatim',
      Boolean(dom.availabilityLine) && dom.contactIntro.includes(dom.availabilityLine),
      `pill "${dom.availabilityLine}"; intro "${dom.contactIntro.slice(0, 70)}…"`,
    );

    // --- hero stats must equal the counts they claim to summarise -------------------
    t.check(
      'the "projects shipped" stat equals the shipped cards in Work',
      dom.heroStats[0] === String(dom.shippedCount),
      `stat "${dom.heroStats[0]}", cards ${dom.shippedCount}`,
    );
    t.check(
      'the "technologies" stat equals the rendered skill cards',
      dom.heroStats[1] === String(dom.skillCount),
      `stat "${dom.heroStats[1]}", cards ${dom.skillCount}`,
    );
    t.check(
      'the "skills in progress" stat equals the roadmap In-progress rows',
      dom.heroStats[2] === String(dom.inProgressBadges),
      `stat "${dom.heroStats[2]}", rows ${dom.inProgressBadges}`,
    );

    // --- shipped work must link somewhere real --------------------------------------
    const profile = 'github.com/BuffNdaHood62';
    const bareLinks = dom.shippedLinks.filter(
      (h) => !h.includes(profile) || new URL(h).pathname.split('/').filter(Boolean).length < 2,
    );
    t.check(
      'every shipped project links to a real repository, not a bare profile',
      dom.shippedCount > 0 && bareLinks.length === 0,
      bareLinks.length ? `suspicious: ${bareLinks.join(', ')}` : `${dom.shippedLinks.length} repo link(s)`,
    );
    t.check('the upcoming queue renders cards', dom.queueCount > 0, `${dom.queueCount} queued`);

    // --- the country must be named the same wherever it appears ---------------------
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

    // --- roadmap numbering must follow position, not a stored index ------------------
    const expectedNumbers = dom.roadmapRows.map((_, i) => String(i + 1).padStart(2, '0'));
    t.check(
      'the roadmap rows are numbered by position',
      dom.roadmapRows.length > 0 &&
        JSON.stringify(dom.roadmapRows) === JSON.stringify(expectedNumbers),
      dom.roadmapRows.join(','),
    );
  },
};
