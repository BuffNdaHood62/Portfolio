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
import { spawn, spawnSync } from 'node:child_process';
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
 * Kill Chrome *and its children*.
 *
 * `child.kill()` only signals the launcher. Chrome spawns a tree — renderers, GPU,
 * crashpad — and on Windows those survive their parent, so every failed or closed run
 * leaks processes. Observed: 9 orphans from a single launch that hung, and 20 live
 * chrome.exe at one point. They hold memory and can interfere with the next run.
 */
function killChrome(proc) {
  if (proc.exitCode !== null || proc.signalCode !== null) return;
  if (process.platform === 'win32') {
    // /T walks the tree, /F skips the graceful-shutdown handshake.
    spawnSync('taskkill', ['/F', '/T', '/PID', String(proc.pid)], { stdio: 'ignore' });
    return;
  }
  proc.kill();
}

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

  const chrome = spawn(findChrome(), args, { stdio: ['ignore', 'ignore', 'pipe'] });

  // Keep Chrome's stderr. Discarding it made every launch failure look identical —
  // "port never appeared" — when the actual cause (a locked profile, a bad flag, a
  // missing shared library) was sitting in the output we were throwing away.
  let chromeStderr = '';
  chrome.stderr?.on('data', (chunk) => {
    chromeStderr += chunk.toString();
  });

  const portFile = join(profile, 'DevToolsActivePort');
  let port = null;
  for (let i = 0; i < 300; i++) {
    // Chrome creates this file and writes it in place. On Windows the read can land
    // mid-write and fail with EBUSY/EPERM, which is not the same as the file being
    // absent — an unguarded readFileSync here threw straight out of launch() and
    // surfaced as a bogus "Chrome never reported a port". Retry either way.
    try {
      const line = readFileSync(portFile, 'utf8').split('\n')[0].trim();
      if (line) {
        port = Number(line);
        break;
      }
    } catch {
      /* not written yet, or locked mid-write */
    }
    await sleep(100);
  }
  if (!port) {
    killChrome(chrome);
    throw new Error(
      'Chrome never reported a DevTools port.' +
        '\n  A Chrome auto-update in progress is a known cause: launches hang and never' +
        '\n  publish the port. Retry once the update finishes.' +
        (chromeStderr ? `\nChrome said:\n${chromeStderr.trim()}` : ''),
    );
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
    killChrome(chrome);
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
    killChrome(chrome);
  }

  await send('Runtime.enable');
  await send('Page.enable');
  // Attach, then navigate explicitly. Chrome is handed the URL on its command line
  // too, but *which* target it creates first is a race: the harness could attach to a
  // pre-navigation target that is already `readyState === "complete"`, then measure a
  // blank document and report success. That is how a share card rendered with no text
  // in it — every element present, every glyph missing, and nothing complained.
  // Comparing `location.href` is what proves the navigation actually committed;
  // readyState alone cannot distinguish the new document from the old one.
  const targetUrl = new URL(url).href;
  await send('Page.navigate', { url: targetUrl });
  await waitFor(
    `location.href === ${JSON.stringify(targetUrl)} && document.readyState === 'complete'`,
    `navigation to ${targetUrl}`,
  );
  // Webfonts change text metrics; measuring before the swap drifts by ~20px.
  await evaluate('document.fonts.ready.then(() => true)');
  await sleep(250);

  const prefersReduced = await evaluate(
    `window.matchMedia('(prefers-reduced-motion: reduce)').matches`,
  );

  return { evaluate, waitFor, click, send, sleep, close, reducedMotion: prefersReduced };
}
