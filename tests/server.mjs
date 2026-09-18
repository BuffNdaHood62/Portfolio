/**
 * Minimal static file server for the built output. No dependencies.
 *
 * Exists so the test suite can serve `dist/` without depending on Python, `vite
 * preview`, or a particular shell. Binds 127.0.0.1 (never 0.0.0.0, which can hang
 * silently in sandboxed environments) and asks the OS for a free port so parallel
 * runs cannot collide on a hardcoded one.
 */
import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, sep } from 'node:path';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

/** @param {string} rootDir directory to serve @returns {Promise<{url: string, close: () => Promise<void>}>} */
export function startServer(rootDir) {
  const server = createServer((req, res) => {
    const requested = decodeURIComponent((req.url || '/').split('?')[0]);
    // Strip leading slashes, then normalise, then reject anything that escapes root.
    const relative = normalize(requested).replace(/^([/\\])+/, '');
    if (relative.startsWith('..') || relative.includes(`..${sep}`)) {
      res.writeHead(403).end('forbidden');
      return;
    }

    let filePath = join(rootDir, relative || 'index.html');
    try {
      if (statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html');
    } catch {
      // SPA fallback: unknown paths get index.html, matching a static host.
      filePath = join(rootDir, 'index.html');
    }

    try {
      statSync(filePath);
    } catch {
      res.writeHead(404).end('not found');
      return;
    }

    res.writeHead(200, {
      'content-type': MIME[extname(filePath)] || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    // Port 0 lets the OS assign a free port, so repeated runs never collide.
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({
        url: `http://127.0.0.1:${port}/`,
        close: () => new Promise((done) => server.close(() => done())),
      });
    });
  });
}
