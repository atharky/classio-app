import { test, expect } from '@playwright/test';
import { KEY } from './helpers.mjs';

// Números «al azar» repetibles: con el mismo estado, cada carga genera las mismas preguntas.
const seeded=()=>{let a=12345;Math.random=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};

test('el repaso de fallos cura un tipo de pregunta con dos aciertos seguidos',async({browser})=>{
  const ctx=await browser.newContext({serviceWorkers:'block',baseURL:'http://localhost:8791/'});
  await ctx.addInitScript(seeded);
  await ctx.addInitScript(([k])=>{if(!localStorage.getItem(k))localStorage.setItem(k,JSON.stringify({v:3,mods:{potencias:{unlocked:2,best:{0:5}}},exams:{},misses:{'potencias:1:0':{d:1,ok:0}},open:false}))},[KEY]);
  const page=await ctx.newPage();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const misses=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)).misses,KEY);
  const open=async()=>{await page.goto('/');await page.click('.mod[data-id="potencias"]');await page.click('#review')};
  const answer=async(text)=>{
    if(await page.locator('#ans').count())await page.fill('#ans',text);
    else await page.locator('.opt',{hasText:text}).first().click();
    await page.click('#check')};

  await open();await expect(page.locator('.qhead')).toContainText('Pregunta 1 de 1');
  // Primera vuelta: fallo a propósito para conocer la respuesta correcta
  await page.locator('#ans').count()?await page.fill('#ans','12345678'):await page.locator('.opt').last().click();
  await page.click('#check');
  const right=(await page.locator('#fb .v').textContent()).match(/La respuesta es (.*)\.$/)?.[1];
  if(!right){
    // la última opción era la correcta: no se puede aprender nada; la prueba sigue con el tipo mc de otra forma
    test.skip(true,'sin respuesta que leer');
  }
  expect((await misses())['potencias:1:0'].ok).toBe(0);

  for(const n of [1,2]){
    await open();await answer(right);
    await expect(page.locator('#fb .fb.ok')).toBeVisible();
    await page.click('#check');   // Ver resultado
    expect((await misses())['potencias:1:0'].ok).toBe(n);
  }
  await expect(page.locator('main')).toContainText('Has repasado todo');
  await page.click('#back');
  await expect(page.locator('#review')).toHaveCount(0);
  expect(errs).toEqual([]);await ctx.close();
});

test('fallar una prueba de nivel apunta el tipo de pregunta para repasar',async({browser})=>{
  const ctx=await browser.newContext({serviceWorkers:'block',baseURL:'http://localhost:8791/'});
  const page=await ctx.newPage();await page.goto('/');
  await page.click('.mod[data-id="potencias"]');await page.click('.lvl[data-i="0"]');await page.click('#t-quiz');
  for(let k=0;k<5;k++){
    if(await page.locator('#ans').count())await page.fill('#ans','12345678');else await page.locator('.opt').last().click();
    await page.click('#check');await page.click('#check');}
  const m=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).misses,KEY);
  expect(Object.keys(m).length).toBeGreaterThan(0);
  for(const key of Object.keys(m))expect(key).toMatch(/^potencias:0:\d+$/);
  await page.click('#back').catch(()=>{});await page.click('#home-btn');await page.click('.mod[data-id="potencias"]');
  await expect(page.locator('#review')).toBeVisible();
  await ctx.close();
});
