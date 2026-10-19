import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const found = [];
const scan = async (page, name) => {
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const grave = violations.filter((v) => ['serious', 'critical'].includes(v.impact));
  found.push(...grave.map((v) => `${name}: ${v.id} (${v.nodes.length}) ${v.nodes[0].target} · ${v.nodes[0].any[0]?.message ?? ''}`));
};

for (const scheme of ['light', 'dark']) {
  test(`accesibilidad (axe) en las vistas principales, tema ${scheme}`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.goto('/');
    await page.click('#open-all');
    await scan(page, 'inicio');
    await page.click('.mod[data-id="potencias"]');
    await scan(page, 'módulo');
    await page.click('.lvl[data-i="0"]');
    await scan(page, 'nivel · aprende');
    await page.click('#t-quiz');
    await scan(page, 'nivel · prueba');
    await page.click('#home-btn');
    await page.click('.mod[data-id="laboratorio"]');
    await page.click('.lvl[data-i="2"]');
    await scan(page, 'microscopio');
    await page.click('#home-btn');
    await page.click('.mod[data-id="tierra"]');
    await page.click('.lvl[data-i="2"]');
    await scan(page, 'capas de la Tierra');
    await page.click('#home-btn');
    await page.click('.mod[data-id="potencias"]');
    await page.click('[data-ex="p1"]');
    await scan(page, 'examen');
    await page.click('#home-btn');
    await page.click('#sync');
    await scan(page, 'sincronizar');
    await page.click('#progress');
    await scan(page, 'mi progreso');
    await page.click('#privacy');
    await scan(page, 'privacidad');
    expect([...new Set(found)]).toEqual([]);
  });
}

test('al cambiar de vista el foco va al encabezado y las pestañas se manejan con flechas', async ({ page }) => {
  await page.goto('/');
  await page.click('.mod[data-id="potencias"]');
  await expect(page.locator('h1')).toBeFocused();
  await page.click('.lvl[data-i="0"]');
  await expect(page.locator('h1')).toBeFocused();
  await expect(page.locator('#t-learn')).toHaveAttribute('aria-controls', 'pane');
  await expect(page.locator('#pane')).toHaveAttribute('role', 'tabpanel');
  await page.focus('#t-learn');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#t-quiz')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#t-quiz')).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.locator('#t-learn')).toHaveAttribute('aria-selected', 'true');
  await page.click('#t-quiz');
  await expect(page.locator('#fb')).toHaveAttribute('aria-live', 'polite');
});

for (const type of ['text', 'vf', 'sort', 'label', 'cross']) {
  test(`accesibilidad (axe) del formato de pregunta «${type}»`, async ({ page }) => {
    await page.goto('/__harness.html');
    await page.waitForFunction(() => document.title === 'listo');
    await page.evaluate((t) => window.mount(t), type);
    if (type === 'vf') await page.click('[data-v="F"]');
    await scan(page, type);
    expect([...new Set(found)]).toEqual([]);
  });
}
