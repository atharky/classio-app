import { test, expect } from '@playwright/test';
import { MODULES } from '../../catalog.js';

test('recorrido de todos los niveles y exámenes de los módulos activos', async ({ page }) => {
  test.setTimeout(240_000);
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('/');
  await page.click('#open-all');
  for (const m of MODULES.filter((x) => !x.soon)) {
    for (let i = 0; i < m.levels.length; i++) {
      await page.click('#home-btn');
      await page.click(`.mod[data-id="${m.id}"]`);
      await page.click(`.lvl[data-i="${i}"]`);
      await expect(page.locator('#a-stage'), `${m.id} nivel ${i + 1}`).toHaveCount(1);
      await expect(page.locator('.realcard .real-tag'), `${m.id} nivel ${i + 1}: tarjeta «En la vida real»`).toHaveCount(1);
      await page.click('#a-play');
      await page.click('#t-quiz');
      await expect(page.locator('.prompt')).toHaveCount(1);
    }
    for (const ex of m.exams) {
      await page.click('#home-btn');
      await page.click(`.mod[data-id="${m.id}"]`);
      await page.click(`[data-ex="${ex.id}"]`);
      await expect(page.locator('.qhead .dots i'), `${m.id}:${ex.id}`).toHaveCount(ex.n);
      await page.click('#sub');
      await page.click('#sub2');
      await expect(page.locator('.score')).toBeVisible();
      await expect(page.locator('.review .rv')).toHaveCount(ex.n);
    }
  }
  expect(errs).toEqual([]);
});

test('la pizarra cabe en pantallas estrechas sin desplazamiento horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('la página de privacidad explica qué datos se guardan y cómo borrarlos', async ({ page }) => {
  await page.goto('/');
  await page.click('#privacy');
  await expect(page.getByRole('heading', { name: 'Privacidad y uso de datos' })).toBeVisible();
  await expect(page.locator('main')).toContainText('Borrar mis datos de la nube');
  await page.click('#home-btn');
  await expect(page.locator('.mod').first()).toBeVisible();
});

test('los tipos de letra se cargan desde el propio sitio, sin peticiones a terceros', async ({ page }) => {
  const external = [];
  page.on('request', (r) => {
    if (!r.url().startsWith('http://localhost')) external.push(r.url());
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('16px "Atkinson Hyperlegible"'))).toBe(true);
  expect(external).toEqual([]);
});

test('el selector de tema alterna automático, claro y oscuro y se recuerda', async ({ page }) => {
  await page.goto('/');
  const theme = () => page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(await theme()).toBeNull();
  await page.click('#theme');
  await expect(page.locator('#theme')).toHaveText('Tema: Claro');
  expect(await theme()).toBe('light');
  await page.click('#theme');
  expect(await theme()).toBe('dark');
  await page.reload();
  expect(await theme()).toBe('dark');
  await expect(page.locator('#theme')).toHaveText('Tema: Oscuro');
  await page.click('#theme');
  expect(await theme()).toBeNull();
});

test('con la CSP de producción no hay estilos bloqueados', async ({ page }) => {
  const blocked = [];
  page.on('console', (m) => {
    if (/Content Security Policy|Refused to/i.test(m.text())) blocked.push(m.text());
  });
  await page.goto('/');
  await page.click('#open-all');
  for (const [mod, lvl] of [
    ['potencias', 0],
    ['laboratorio', 2],
    ['tierra', 2],
  ]) {
    await page.click('#home-btn');
    await page.click(`.mod[data-id="${mod}"]`);
    await page.click(`.lvl[data-i="${lvl}"]`);
    await page.click('#a-play');
    await page.waitForTimeout(600);
  }
  expect(await page.evaluate(() => document.querySelectorAll('[data-s]').length)).toBe(0);
  expect(blocked).toEqual([]);
});
