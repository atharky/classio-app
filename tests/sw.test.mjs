import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { buildHash } from '../scripts/stamp-sw.mjs';

const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const assets = JSON.parse(sw.match(/const ASSETS = (\[.*\]);/)[1].replace(/'/g, '"'));
const root = new URL('../', import.meta.url);

test('sw.js lleva el marcador __BUILD__ (lo sella el despliegue)', () => {
  assert.match(sw, /const CACHE = 'cuaderno-__BUILD__'/);
});

test('todos los ficheros de la caché existen y no falta ninguno de la web', () => {
  for (const a of assets) if (a !== './') assert.ok(existsSync(new URL(a, root)), `${a} no existe`);
  const web = readdirSync(root).filter(f => /\.(js|css|html|svg|webmanifest)$/.test(f) && !['sw.js', 'playwright.config.mjs'].includes(f));
  for (const f of web) assert.ok(assets.includes('./' + f), `${f} no está en la caché del service worker`);
});

test('el hash es estable y cambia al tocar un fichero', () => {
  assert.equal(buildHash(), buildHash());
  assert.match(buildHash(), /^[0-9a-f]{12}$/);
});
