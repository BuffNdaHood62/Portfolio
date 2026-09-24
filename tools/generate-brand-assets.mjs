/**
 * Regenerates the raster brand assets from their sources.
 *
 *   node tools/generate-brand-assets.mjs      (also: npm run assets)
 *
 * Why this is a committed script and not a one-off: the outputs are PNGs, and a PNG
 * cannot be reviewed in a diff. An unreproducible binary is the same "two sources of
 * truth" failure this project has hit repeatedly — the file and the thing that made it
 * drift apart silently. Here the source of truth is `public/favicon.svg` plus the card
 * markup below, and every output can be rebuilt from them at any time.
 *
 * Rendering goes through a real Chrome over the CDP harness the e2e suite already
 * uses, so there is no image toolchain and no extra dependency.
 *
 * Outputs (all in `public/`, which Vite copies to `dist/` verbatim):
 *   og-image.png        1200x630  social share card (LinkedIn / X / WhatsApp)
 *   favicon-32.png         32x32  raster fallback for browsers without SVG icons
 *   apple-touch-icon.png  180x180  iOS home-screen icon
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { launch, sleep } from '../tests/harness.mjs';
import { startServer } from '../tests/server.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = join(ROOT, 'public');
// Card markup is served rather than loaded over file://, because a file:// page is
// treated as a unique origin and its relative font URLs are refused.
const CACHE_DIR = join(ROOT, 'node_modules', '.cache');

const MARK = readFileSync(join(PUBLIC_DIR, 'favicon.svg'), 'utf8');

/** The mark at a given pixel size. */
function markSvg(size, { rounded = true } = {}) {
  let svg = MARK.replace('<svg ', `<svg width="${size}" height="${size}" `);
  // iOS masks the icon itself and composites transparency onto black, so the
  // home-screen variant must be an opaque full-bleed square rather than a rounded tile.
  if (!rounded) svg = svg.replace('rx="15"', 'rx="0"');
  return svg;
}

/**
 * The share card. Deliberately mirrors the hero: same eyebrow treatment, same accent
 * full stop, same hook line — so a link preview looks like the top of the site rather
 * than a generic link card.
 */
function cardHtml() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>share card</title>
<style>
  @font-face{font-family:'Fraunces';src:url('../@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2') format('woff2');font-weight:100 900;font-style:normal;font-display:block}
  @font-face{font-family:'Inter';src:url('../@fontsource-variable/inter/files/inter-latin-wght-normal.woff2') format('woff2');font-weight:100 900;font-style:normal;font-display:block}
  @font-face{font-family:'JetBrains Mono';src:url('../@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2') format('woff2');font-weight:500;font-style:normal;font-display:block}
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1200px;height:630px;overflow:hidden}
  body{background:#faf7f2;color:#1c1915;font-family:'Inter',system-ui,sans-serif;
       padding:72px 78px;display:flex;flex-direction:column;justify-content:space-between}
  .top{display:flex;align-items:center;justify-content:space-between}
  .eyebrow{display:flex;align-items:center;gap:15px;
           font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:500;
           letter-spacing:.22em;text-transform:uppercase;color:#6e675c}
  .eyebrow i{display:block;width:10px;height:10px;border-radius:999px;background:#b0521d}
  .mark{line-height:0}
  .name{font-family:'Fraunces',Georgia,serif;font-size:110px;font-weight:500;
        line-height:.98;letter-spacing:-.022em}
  .name .stop{color:#b0521d}
  .hook{font-family:'Fraunces',Georgia,serif;font-size:38px;font-weight:400;
        line-height:1.18;letter-spacing:-.01em;color:#6e675c;margin-top:24px}
  .hook em{font-style:italic;font-weight:300}
  .foot{border-top:1px solid #e2dcd0;padding-top:26px;display:flex;
        align-items:center;justify-content:space-between;
        font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:500;
        letter-spacing:.2em;text-transform:uppercase;color:#6e675c}
</style>
</head>
<body>
  <div class="top">
    <div class="eyebrow"><i></i>Frontend Developer</div>
    <div class="mark">${markSvg(64)}</div>
  </div>
  <div>
    <h1 class="name">Michael Nnamdi<span class="stop">.</span></h1>
    <p class="hook">I build things with React. <em>And ship them.</em></p>
  </div>
  <div class="foot">
    <span>Open to opportunities</span>
    <span>Nigeria &middot; working worldwide</span>
  </div>
</body>
</html>`;
}

/** A bare document holding nothing but the mark, for rasterising the favicon. */
function iconHtml(size, options) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;width:${size}px;height:${size}px;overflow:hidden;background:transparent}
  svg{display:block}
</style></head>
<body>${markSvg(size, options)}</body></html>`;
}

/** Read width/height straight out of a PNG's IHDR chunk. */
function pngSize(buffer) {
  const isPng = buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (!isPng) throw new Error('not a PNG');
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

const JOBS = [
  { file: 'og-image.png', width: 1200, height: 630, html: cardHtml(), needsFonts: true },
  { file: 'favicon-32.png', width: 32, height: 32, html: iconHtml(32, {}) },
  {
    file: 'apple-touch-icon.png',
    width: 180,
    height: 180,
    html: iconHtml(180, { rounded: false }),
  },
];

async function main() {
  mkdirSync(PUBLIC_DIR, { recursive: true });
  mkdirSync(CACHE_DIR, { recursive: true });

  // Serve from the project root so the card can reach the woff2 files in node_modules.
  const server = await startServer(ROOT);
  const failures = [];

  try {
    for (const job of JOBS) {
      const pagePath = join(CACHE_DIR, `${job.file}.html`);
      writeFileSync(pagePath, job.html, 'utf8');
      const url = `${server.url}node_modules/.cache/${job.file}.html`;

      // Launch at a comfortable window size and set the real viewport afterwards.
      // Windows headless Chrome clamps window width to roughly 500px, so a 32px
      // window would silently render at ~500px — Emulation.setDeviceMetricsOverride
      // is what makes the small sizes exact.
      const browser = await launch({ url, width: 1280, height: 900 });
      try {
        // The card is almost entirely text, and `font-display: block` hides glyphs
        // until their font arrives. A silent font failure therefore produces a card
        // that looks like a deliberate minimal design — every element present, every
        // word missing. That is precisely how the first run shipped a blank card, so
        // assert the fonts resolved instead of trusting the screenshot to be right.
        if (job.needsFonts) {
          await browser.waitFor(
            `document.fonts.check('110px Fraunces') && document.fonts.check('16px "JetBrains Mono"')`,
            'the card webfonts',
            15000,
          );
        }

        await browser.send('Emulation.setDeviceMetricsOverride', {
          width: job.width,
          height: job.height,
          deviceScaleFactor: 1,
          mobile: false,
        });
        // Let the reflow settle before capturing.
        await sleep(200);

        const shot = await browser.send('Page.captureScreenshot', {
          format: 'png',
          captureBeyondViewport: false,
          fromSurface: true,
        });
        const png = Buffer.from(shot.data, 'base64');

        // Verify rather than assume: a silently wrong size is exactly the kind of
        // failure that survives to production because nothing checks it.
        const { width, height } = pngSize(png);
        if (width !== job.width || height !== job.height) {
          failures.push(
            `${job.file}: expected ${job.width}x${job.height}, got ${width}x${height}`,
          );
          continue;
        }

        writeFileSync(join(PUBLIC_DIR, job.file), png);
        console.log(`  ${job.file.padEnd(22)} ${width}x${height}  ${png.length} bytes`);
      } finally {
        await browser.close();
      }
    }
  } finally {
    await server.close();
  }

  if (failures.length) {
    console.error('\nFailed:');
    for (const failure of failures) console.error('  - ' + failure);
    process.exit(1);
  }
  console.log('\nBrand assets written to public/.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
