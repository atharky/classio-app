/* Servidor de pruebas: sirve la web estática y la API de sincronización con el almacén en memoria. */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSync } from '../../api/src/sync.js';
import { memoryStore } from '../../api/src/memory-store.js';
const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const sync = createSync(memoryStore());
const CSP = JSON.parse(await readFile(join(ROOT, 'staticwebapp.config.json'), 'utf8')).globalHeaders['Content-Security-Policy'];
let build = 1; // POST /__bump simula un despliegue nuevo: cambia el sello de sw.js
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
};
http
  .createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    if (req.method === 'POST' && ['/api/sync/new', '/api/sync', '/api/sync/delete'].includes(url.pathname)) {
      let body = '';
      for await (const c of req) body += c;
      const r = await (url.pathname.endsWith('/new') ? sync.create(body) : url.pathname.endsWith('/delete') ? sync.remove(body) : sync.sync(body));
      res.writeHead(r.status, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(r.jsonBody));
    }
    if (url.pathname === '/__bump') {
      build++;
      res.writeHead(204);
      return res.end();
    }
    if (url.pathname === '/sw.js') {
      const d = (await readFile(join(ROOT, 'sw.js'), 'utf8')).replace("'cuaderno-__BUILD__'", "'cuaderno-e2e" + build + "'");
      res.writeHead(200, { 'Content-Type': 'text/javascript', 'Cache-Control': 'no-store', 'Content-Security-Policy': CSP });
      return res.end(d);
    }
    try {
      const p = normalize(url.pathname === '/' ? '/index.html' : url.pathname);
      if (p.includes('..') || p.startsWith('/api/') || p.startsWith('/tests/')) throw 0;
      const d = await readFile(join(ROOT, p));
      res.writeHead(200, { 'Content-Type': types[extname(p)] || 'application/octet-stream', 'Content-Security-Policy': CSP });
      res.end(d);
    } catch {
      res.writeHead(404);
      res.end();
    }
  })
  .listen(+process.argv[2] || 8791);
