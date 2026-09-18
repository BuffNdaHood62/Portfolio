/**
 * Chrome DevTools Protocol harness. No dependencies — Node 22 ships a global
 * WebSocket, so this drives a real browser without Playwright or Puppeteer.
 *
 * Two deliberate design choices, both learned from failures:
 *
 * 1. Chrome gets `--remote-debugging-port=0` and we read the chosen port from the
 *    `DevToolsActivePort` file it writes into the profile. Hardcoding a port meant
 *    a previous run's browser could hold it, and the new instance would silently
 *    land somewhere else while the harness talked to the old one.
 * 2. Nothing here ever waits a fixed number of milliseconds for the app to be ready.
 *    Callers poll with `waitFor`. A fixed sleep races module loading and produces
 *    phantom "element not found" failures that look like application bugs.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA
    ? join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe')
    : null,
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

export function findChrome() {
  for (const candidate of CANDIDATES) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(
    'No Chrome found. Set CHROME_PATH to the browser executable.\nTried:\n  ' +
      CANDIDATES.join('\n  '),
  );
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Launch Chrome and connect. Returns the helper set passed to every suite.
 * @param {{ url: string, reducedMotion?: boolean, width?: number, height?: number }} options
 */
export async function launch({ url, reducedMotion = false, width = 1280, height = 1200 }) {
  const profile = mkdtempSync(join(tmpdir(), 'cdp-'));
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--hide-scrollbars',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    `--window-size=${width},${height}`,
  ];
  // Entrance animations must be resolved before measuring positions, or the target
  // moves under you. Suites that test the animations themselves leave this off.
  if (reducedMotion) args.push('--force-prefers-reduced-motion');
  // CI containers frequently cannot use the Chrome sandbox.
  if (process.platform === 'linux') args.push('--no-sandbox');
  args.push(url);

  const chrome = spawn(findChrome(), args, { stdio: 'ignore' });

  const portFile = join(profile, 'DevToolsActivePort');
  let port = null;
  for (let i = 0; i < 120; i++) {
    if (existsSync(portFile)) {
      const line = readFileSync(portFile, 'utf8').split('\n')[0].trim();
      if (line) {
        port = Number(line);
        break;
      }
    }
    await sleep(100);
  }
  if (!port) {
    chrome.kill();
    throw new Error('Chrome never reported a DevTools port');
  }

  let target = null;
  for (let i = 0; i < 80 && !target; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      target = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
    } catch {
      /* endpoint not up yet */
    }
    if (!target) await sleep(150);
  }
  if (!target) {
    chrome.kill();
    throw new Error('No debuggable page target appeared');
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  let nextId = 1;
  const pending = new Map();
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
  });

  /** Raw CDP escape hatch — needed for Emulation.setDeviceMetricsOverride etc. */
  function send(method, params = {}) {
    const id = nextId++;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expression) {
    const result = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) {
      throw new Error('page threw: ' + JSON.stringify(result.exceptionDetails));
    }
    return result.result.value;
  }

  async function waitFor(expression, label, timeoutMs = 30000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      try {
        if (await evaluate(expression)) return true;
      } catch {
        /* mid-navigation */
      }
      await sleep(150);
    }
    throw new Error(`timed out waiting for ${label}`);
  }

  function click(selector, index = 0) {
    return evaluate(
      `(() => { const els = document.querySelectorAll(${JSON.stringify(selector)});
        if (!els[${index}]) throw new Error('no element at ' + ${JSON.stringify(selector)} + '[' + ${index} + ']');
        els[${index}].click(); return true; })()`,
    );
  }

  async function close() {
    try {
      ws.close();
    } catch {
      /* already closed */
    }
    chrome.kill();
  }

  await send('Runtime.enable');
  await send('Page.enable');
  // Wait for something the app itself renders — never for a bare readyState, which
  // is satisfied long before the framework mounts.
  await waitFor('document.readyState === "complete"', 'the document');
  // Webfonts change text metrics; measuring before the swap drifts by ~20px.
  await evaluate('document.fonts.ready.then(() => true)');
  await sleep(250);

  const prefersReduced = await evaluate(
    `window.matchMedia('(prefers-reduced-motion: reduce)').matches`,
  );

  return { evaluate, waitFor, click, send, sleep, close, reducedMotion: prefersReduced };
}
