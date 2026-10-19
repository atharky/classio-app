import { test, expect } from '@playwright/test';
import { MODULES } from '../../catalog.js';

test('recorrido de todos los niveles y exámenes de los módulos activos',async({page})=>{
  test.setTimeout(240_000);
  const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.goto('/');await page.click('#open-all');
  for(const m of MODULES.filter(x=>!x.soon)){
    for(let i=0;i<m.levels.length;i++){
      await page.click('#home-btn');await page.click(`.mod[data-id="${m.id}"]`);await page.click(`.lvl[data-i="${i}"]`);
      await expect(page.locator('#a-stage'),`${m.id} nivel ${i+1}`).toHaveCount(1);
      await page.click('#a-play');await page.click('#t-quiz');
      await expect(page.locator('.prompt')).toHaveCount(1)}
    for(const ex of m.exams){
      await page.click('#home-btn');await page.click(`.mod[data-id="${m.id}"]`);await page.click(`[data-ex="${ex.id}"]`);
      await expect(page.locator('.qhead .dots i'),`${m.id}:${ex.id}`).toHaveCount(ex.n);
      await page.click('#sub');await page.click('#sub2');await expect(page.locator('.score')).toBeVisible();
      await expect(page.locator('.review .rv')).toHaveCount(ex.n)}}
  expect(errs).toEqual([]);
});

test('la pizarra cabe en pantallas estrechas sin desplazamiento horizontal',async({page})=>{
  await page.setViewportSize({width:360,height:740});await page.goto('/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
