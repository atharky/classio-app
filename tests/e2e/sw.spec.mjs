import { test, expect } from '@playwright/test';

test('una versión nueva avisa y se aplica al recargar', async ({ browser }) => {
  const ctx = await browser.newContext({ serviceWorkers: 'allow', baseURL: 'http://localhost:8791/' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload(); // ya controlado por el service worker
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await expect(page.locator('#update')).toHaveCount(0);
  const before = await page.evaluate(() => caches.keys());
  expect(before).toEqual(['cuaderno-e2e1']);

  await page.request.post('/__bump');
  await page.evaluate(async () => {
    const r = await navigator.serviceWorker.getRegistration();
    await r.update();
  });
  await expect(page.locator('#update')).toBeVisible({ timeout: 10000 });

  await Promise.all([page.waitForNavigation(), page.click('#update-btn')]);
  await expect.poll(() => page.evaluate(() => caches.keys())).toEqual(['cuaderno-e2e2']);
  await expect(page.locator('#update')).toHaveCount(0);
  expect(errs).toEqual([]);
  await ctx.close();
});

test('sirve sin conexión desde la caché', async ({ browser }) => {
  const ctx = await browser.newContext({ serviceWorkers: 'allow', baseURL: 'http://localhost:8791/' });
  const page = await ctx.newPage();
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await ctx.setOffline(true);
  await page.reload();
  await expect(page.locator('.mod').first()).toBeVisible();
  await ctx.close();
});
