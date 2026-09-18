/**
 * Sharing metadata and brand assets.
 *
 * This is the one part of the site no gate could see. `tsc`, ESLint and `vite build`
 * all pass whether or not the document has a favicon or a social preview image —
 * they only ever look at source, and the `<head>` was never in front of a browser.
 * That is how the site shipped with no favicon, no `og:image`, and an `og:image` path
 * that nothing checked actually resolved.
 *
 * A share card is also the one asset where being wrong is invisible: a crawler that
 * cannot fetch the image silently falls back to a bare text link, and nobody sees an
 * error. So the checks below fetch every declared asset and verify the bytes, rather
 * than trusting the markup to describe files that exist.
 */
export default {
  name: 'meta',
  reducedMotion: true,

  async run({ evaluate, waitFor }, t) {
    await waitFor(`!!document.querySelector('h1')`, 'the h1');

    const head = await evaluate(`(() => {
      const content = (sel) => document.querySelector(sel)?.getAttribute('content') ?? null;
      const href = (sel) => document.querySelector(sel)?.getAttribute('href') ?? null;
      return {
        title: document.title,
        description: content('meta[name="description"]'),
        ogType: content('meta[property="og:type"]'),
        ogTitle: content('meta[property="og:title"]'),
        ogDescription: content('meta[property="og:description"]'),
        ogImage: content('meta[property="og:image"]'),
        ogImageWidth: content('meta[property="og:image:width"]'),
        ogImageHeight: content('meta[property="og:image:height"]'),
        twitterCard: content('meta[name="twitter:card"]'),
        twitterImage: content('meta[name="twitter:image"]'),
        themeColor: content('meta[name="theme-color"]'),
        paperToken: getComputedStyle(document.documentElement)
          .getPropertyValue('--color-paper').trim(),
        iconSvg: href('link[rel="icon"][type="image/svg+xml"]'),
        iconPng: href('link[rel="icon"][type="image/png"]'),
        appleIcon: href('link[rel="apple-touch-icon"]'),
      };
    })()`);

    t.check('the document has a title', Boolean(head.title), head.title);
    t.check(
      'the document has a description',
      Boolean(head.description),
      `${(head.description || '').slice(0, 60)}…`,
    );
    t.check('og:type is website', head.ogType === 'website', String(head.ogType));
    t.check('og:title is set', Boolean(head.ogTitle), head.ogTitle);
    t.check('og:description is set', Boolean(head.ogDescription), head.ogDescription);

    // Cross-check the head against the live token rather than a hardcoded hex, so
    // editing --color-paper in index.css without updating theme-color fails here.
    t.check(
      'theme-color matches the paper token',
      head.themeColor?.toLowerCase() === head.paperToken?.toLowerCase(),
      `head ${head.themeColor}, --color-paper ${head.paperToken}`,
    );

    // --- assets actually resolve -------------------------------------------------
    // Fetch in the page so the paths are exercised exactly as a crawler would.
    const probe = (path) =>
      evaluate(`(async () => {
        const res = await fetch(${JSON.stringify(path)});
        if (!res.ok) return { status: res.status, type: null };
        const blob = await res.blob();
        if (blob.type !== 'image/png') return { status: res.status, type: blob.type, bytes: blob.size };
        const bitmap = await createImageBitmap(blob);
        return { status: res.status, type: blob.type, bytes: blob.size,
                 width: bitmap.width, height: bitmap.height };
      })()`);

    for (const [label, path, expectedType] of [
      ['favicon.svg', head.iconSvg, 'image/svg+xml'],
      ['favicon-32.png', head.iconPng, 'image/png'],
      ['apple-touch-icon.png', head.appleIcon, 'image/png'],
      ['og-image.png', head.ogImage, 'image/png'],
    ]) {
      t.check(`the head declares ${label}`, Boolean(path), String(path));
      if (!path) continue;
      const info = await probe(path);
      // The static host answers unknown paths with index.html, so a *missing* asset
      // returns 200 and an HTML body. Asserting the status alone reported success for
      // a file that was not there — verified by deleting og-image.png and watching
      // this check pass. The content type is what proves the bytes are the asset.
      t.check(
        `${label} resolves as ${expectedType}`,
        info.status === 200 && info.type === expectedType,
        `HTTP ${info.status}, ${info.type ?? 'no type'}${info.bytes ? `, ${info.bytes} bytes` : ''}`,
      );
    }

    // --- the card matches what the markup promises --------------------------------
    const card = await probe(head.ogImage);
    const declaredWidth = Number(head.ogImageWidth);
    const declaredHeight = Number(head.ogImageHeight);
    t.check(
      'og:image declares its dimensions',
      declaredWidth > 0 && declaredHeight > 0,
      `${declaredWidth}x${declaredHeight}`,
    );
    t.check(
      'og-image.png matches the declared dimensions',
      card.width === declaredWidth && card.height === declaredHeight,
      `file ${card.width}x${card.height}, declared ${declaredWidth}x${declaredHeight}`,
    );
    // Platforms crop to roughly 1.91:1. A card that is not already that ratio gets
    // trimmed, which is how the name ends up half cut off in a feed.
    t.check(
      'og-image.png is close to the 1.91:1 platforms crop to',
      card.width / card.height > 1.85 && card.width / card.height < 1.95,
      `ratio ${(card.width / card.height).toFixed(3)}`,
    );
    t.check(
      'twitter:card matches having a large image',
      head.twitterCard === 'summary_large_image',
      `${head.twitterCard}, twitter:image ${head.twitterImage}`,
    );

    // --- icon sizes iOS and browsers actually require -----------------------------
    const favicon = await probe(head.iconPng);
    t.check(
      'favicon-32.png is exactly 32x32',
      favicon.type === 'image/png' && favicon.width === 32 && favicon.height === 32,
      `${favicon.width}x${favicon.height}`,
    );
    const apple = await probe(head.appleIcon);
    t.check(
      'apple-touch-icon.png is a 180x180 square',
      apple.type === 'image/png' && apple.width === 180 && apple.height === 180,
      `${apple.width}x${apple.height}`,
    );
  },
};
