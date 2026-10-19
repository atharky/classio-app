import { test, expect } from '@playwright/test';
import { ANIMS } from '../../catalog.js';
import { fakeSpeech } from './helpers.mjs';

const steps=ANIMS.potencias[0];

test('reproductor de relatos: voz, preguntas, pizarra acumulada, pausa y sonido',async({page})=>{
  test.setTimeout(120_000);
  await page.addInitScript(fakeSpeech);
  const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const spoken=()=>page.evaluate(()=>window.__spoken.slice());
  await page.goto('/');
  await page.click('.mod[data-id="potencias"]');await page.click('.lvl[data-i="0"]');
  await expect(page.locator('#a-cap')).toHaveText(steps[0].say);
  await expect(page.locator('#a-play')).toHaveText('▶ Empezar');
  expect(await spoken()).toEqual([]);

  await page.click('#a-play');
  await expect(page.locator('.aq')).toBeVisible();
  expect((await spoken()).slice(0,3)).toEqual([steps[0].say,steps[1].say,steps[2].say]);
  await expect(page.locator('#a-next')).toBeDisabled();

  await page.fill('#a-q #ans','999');await page.click('#a-check');
  await expect(page.locator('#a-fb .fb.ko',{hasText:'Inténtalo otra vez'})).toBeVisible();
  await expect(page.locator('#a-next')).toBeDisabled();
  await page.fill('#a-q #ans','998');await page.click('#a-check');
  await expect(page.locator('#a-fb .fb.ko',{hasText:'La respuesta es'})).toBeVisible();
  await expect(page.locator('#a-next')).toBeEnabled();
  await expect(page.locator('#a-check')).toHaveText('Continuar');

  await page.click('#a-check');
  await expect(page.locator('.aq')).toBeVisible();
  expect(await spoken()).toContain(steps[3].say);
  for(let g=0;g<30&&!(await page.locator('#a-check',{hasText:'Terminar'}).count());g++){
    if(await page.locator('#a-check',{hasText:'Continuar'}).count()){await page.click('#a-check');continue}
    if(await page.locator('#a-check').count()){
      if(await page.locator('#a-q #ans').count())await page.fill('#a-q #ans','99999');
      else await page.locator('#a-q .opt:not([disabled])').first().click();
      await page.click('#a-check');continue}
    if(await page.locator('#a-next').isEnabled())await page.click('#a-next');else await page.waitForTimeout(150)}
  expect((await spoken()).some(t=>t.startsWith('En la vida real'))).toBe(true);
  await page.click('#a-check');
  await expect(page.locator('#a-cap',{hasText:'¡Fin!'})).toBeVisible();
  await expect(page.locator('#a-board .frame')).toHaveCount(steps.length);
  await expect(page.locator('#a-links path')).toHaveCount((steps.length-1)*2);
  await expect(page.locator('#a-board')).toHaveClass(/overview/);
  expect(await page.locator('#a-board .stamp').count()).toBeGreaterThanOrEqual(2);
  await page.waitForTimeout(1200);
  const sc=await page.locator('#a-board').evaluate(b=>new DOMMatrix(getComputedStyle(b).transform).a);
  expect(sc).toBeLessThan(.6);
  await expect(page.locator('#a-play')).toHaveText('↺ Ver otra vez');
  await expect(page.locator('#a-dots i.ok')).toHaveCount(steps.length);

  await page.locator('#a-board .frame').nth(2).click();
  await expect(page.locator('#a-cap')).toHaveText(steps[2].say);
  await expect(page.locator('#a-board')).not.toHaveClass(/overview/);

  await page.click('#a-play');await page.click('#a-play');
  await expect(page.locator('#a-board')).toHaveClass(/paused/);
  const n=(await spoken()).length;await page.waitForTimeout(600);
  expect((await spoken()).length).toBe(n);
  await expect(page.locator('#a-play')).toHaveText('▶ Continuar');

  await page.click('#a-sound');
  await expect(page.locator('#a-sound')).toHaveText('🔇 Sonido desactivado');
  await page.click('#a-play');await page.waitForTimeout(400);
  expect((await spoken()).length).toBe(n);
  expect(await page.evaluate(()=>localStorage.getItem('mates1eso.sound'))).toBe('off');
  await page.click('#a-sound');

  await page.click('#a-play');await page.click('#a-play');
  const c0=await page.evaluate(()=>window.__cancels);
  await page.click('#t-quiz');
  expect(await page.evaluate(()=>window.__cancels)).toBeGreaterThan(c0);
  await expect(page.locator('#anim')).toHaveCount(0);
  await page.click('#t-learn');await page.click('#go-quiz');await expect(page.locator('.prompt')).toBeVisible();
  expect(errs).toEqual([]);
});
