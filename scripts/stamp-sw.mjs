/* Escribe en sw.js un hash de los ficheros publicados: cualquier cambio invalida la caché sin tocar sw.js a mano. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const PUBLISHED = /\.(html|js|css|svg|webmanifest|woff2|mp3)$/;
export function buildHash(root = ROOT) {
  const h = createHash('sha256');
  const walk = dir => readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).forEach(e => {
    const p = dir + e.name;
    if (e.isDirectory()) { if (['fonts/', 'audio/'].includes(e.name + '/')) walk(p + '/'); }
    else if (PUBLISHED.test(e.name) && e.name !== 'sw.js' && !e.name.startsWith('playwright.config')) { h.update(p.slice(root.length)); h.update(readFileSync(p)); }
  });
  walk(root);
  const sw = readFileSync(root + 'sw.js', 'utf8');
  h.update(sw.replace(/cuaderno-[\w-]+/, ''));
  return h.digest('hex').slice(0, 12);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const sw = ROOT + 'sw.js', src = readFileSync(sw, 'utf8');
  if (!src.includes('__BUILD__')) throw new Error('sw.js ya está sellado o no tiene el marcador __BUILD__');
  const hash = buildHash();
  writeFileSync(sw, src.replace("'cuaderno-__BUILD__'", `'cuaderno-${hash}'`));
  console.log('sw.js sellado con', hash);
}
