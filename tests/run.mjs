/**
 * End-to-end suite runner.
 *
 * Serves the built output and drives it in real Chrome over the DevTools Protocol.
 * No test framework and no dependencies — Node 22's global WebSocket is enough.
 *
 * Each suite gets a fresh browser so state cannot leak between them (the nav suite
 * deliberately resizes the viewport, for instance).
 *
 * Usage:
 *   npm run build && npm run test:e2e
 *   node tests/run.mjs nav            # run one suite
 *   node tests/run.mjs --list         # list suites
 *
 * Set CHROME_PATH if Chrome is somewhere unusual.
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { launch } from './harness.mjs';
import { startServer } from './server.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(here, '..');
const distDir = join(projectRoot, 'dist');

const SUITES = [
  (await import('./suites/scroll.mjs')).default,
  (await import('./suites/nav.mjs')).default,
  (await import('./suites/booking.mjs')).default,
  (await import('./suites/a11y.mjs')).default,
];

const args = process.argv.slice(2);
if (args.includes('--list')) {
  for (const suite of SUITES) console.log(suite.name);
  process.exit(0);
}

const only = args.filter((a) => !a.startsWith('-'));
const selected = only.length ? SUITES.filter((s) => only.includes(s.name)) : SUITES;
if (selected.length === 0) {
  console.error(`No suite matched ${only.join(', ')}. Known: ${SUITES.map((s) => s.name).join(', ')}`);
  process.exit(2);
}

if (!existsSync(join(distDir, 'index.html'))) {
  console.error('dist/index.html is missing — run `npm run build` first.');
  process.exit(2);
}

const server = await startServer(distDir);
console.log(`serving ${distDir} at ${server.url}`);

let passed = 0;
let failed = 0;
const failedChecks = [];

for (const suite of selected) {
  console.log(`\n── ${suite.name} ${'─'.repeat(Math.max(0, 58 - suite.name.length))}`);
  let browser;
  try {
    browser = await launch({ url: server.url, reducedMotion: suite.reducedMotion });
    const context = {
      reducedMotion: browser.reducedMotion,
      check(name, ok, detail) {
        if (ok) {
          passed += 1;
          console.log(`  PASS  ${name}`);
        } else {
          failed += 1;
          failedChecks.push(`${suite.name}: ${name}`);
          console.log(`  FAIL  ${name}`);
        }
        if (detail) console.log(`        ${detail}`);
      },
      log(message) {
        console.log(`        ${message}`);
      },
    };
    await suite.run(browser, context);
  } catch (error) {
    failed += 1;
    failedChecks.push(`${suite.name}: threw`);
    console.error(`  ERROR ${error.message}`);
  } finally {
    await browser?.close();
  }
}

await server.close();

console.log(`\n${'─'.repeat(62)}`);
console.log(`${passed} passed, ${failed} failed`);
if (failedChecks.length) {
  console.log('\nfailures:');
  for (const name of failedChecks) console.log(`  - ${name}`);
}

process.exit(failed === 0 ? 0 : 1);
