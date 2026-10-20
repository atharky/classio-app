import { test, expect } from '@playwright/test';

const open = async (page, type) => {
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('/__harness.html');
  await page.waitForFunction(() => document.title === 'listo');
  await page.evaluate((t) => window.mount(t), type);
  return errs;
};
const state = (page) => page.evaluate(() => window.state());

test('completar: tolera mayúsculas y tildes', async ({ page }) => {
  const errs = await open(page, 'text');
  expect((await state(page)).answered).toBe(false);
  await page.fill('#ans', '  PERIDOTITA ');
  expect(await state(page)).toMatchObject({ answered: true, right: true });
  await page.fill('#ans', 'granito');
  expect((await state(page)).right).toBe(false);
  await page.evaluate(() => window.lock());
  await expect(page.locator('#ans')).toHaveClass(/wrong/);
  expect(errs).toEqual([]);
});

test('verdadero o falso: al elegir falso aparece la corrección', async ({ page }) => {
  const errs = await open(page, 'vf');
  await expect(page.locator('.fixes')).toBeHidden();
  await page.click('[data-v="F"]');
  await expect(page.locator('.fixes')).toBeVisible();
  expect((await state(page)).answered).toBe(false);
  await page.locator('[data-c]', { hasText: 'gaseoso' }).click();
  expect(await state(page)).toMatchObject({ answered: true, right: false });
  await page.locator('[data-c]', { hasText: 'líquido' }).click();
  expect(await state(page)).toMatchObject({ answered: true, right: true });
  await page.click('[data-v="V"]');
  await expect(page.locator('.fixes')).toBeHidden();
  expect((await state(page)).right).toBe(false);
  expect(errs).toEqual([]);
});

test('clasificar: se maneja con el ratón y con el teclado', async ({ page }) => {
  const errs = await open(page, 'sort');
  const row = (name, col) => page.locator('.srow', { hasText: name }).getByRole('radio', { name: col, exact: true });
  await row('Astronomía', 'Ciencia').click();
  await row('Numerología', 'Pseudociencia').click();
  expect((await state(page)).answered).toBe(false);
  await row('Medicina', 'Pseudociencia').focus();
  await page.keyboard.press('Enter');
  expect(await state(page)).toMatchObject({ answered: true, right: false });
  await row('Medicina', 'Ciencia').click();
  expect(await state(page)).toMatchObject({ answered: true, right: true });
  expect((await state(page)).rightText).toContain('Ciencia: Astronomía, Medicina');
  expect(errs).toEqual([]);
});

test('etiquetar: se toca la parte del dibujo o se elige con el teclado', async ({ page }) => {
  const errs = await open(page, 'label');
  await page.locator('[data-id="a"]').click({ position: { x: 100, y: 12 } });
  expect(await state(page)).toMatchObject({ answered: true, right: false });
  await page.locator('[data-id="b"]').focus();
  await expect(page.locator('[data-id="b"]')).toHaveAttribute('aria-label', 'Pequeña');
  await page.keyboard.press('Enter');
  expect(await state(page)).toMatchObject({ answered: true, right: true });
  await page.evaluate(() => window.lock());
  await expect(page.locator('[data-id="b"]')).toHaveClass(/right/);
  expect(errs).toEqual([]);
});

test('crucigrama: se escribe letra a letra y se corrige', async ({ page }) => {
  const errs = await open(page, 'cross');
  expect((await state(page)).answered).toBe(false);
  // GEOSFERA empieza en la fila 5, columna 3
  await page.locator('input[data-r="5"][data-c="3"]').fill('g');
  await expect(page.locator('input[data-r="5"][data-c="4"]')).toBeFocused();
  await page.keyboard.type('eosfera');
  expect(await page.locator('input[data-r="5"][data-c="10"]').inputValue()).toBe('A');
  expect(await state(page)).toMatchObject({ answered: true, right: false });
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('input[data-r="5"][data-c="9"]')).toBeFocused();
  // Rellena todo con la solución
  const cells = await page.evaluate(() => [...document.querySelectorAll('.cgrid input')].map((i) => [i.dataset.r, i.dataset.c]));
  await page.evaluate(() => window.lock());
  expect((await state(page)).rightText).toContain('GEOSFERA');
  expect(cells.length).toBeGreaterThan(40);
  expect(errs).toEqual([]);
});
