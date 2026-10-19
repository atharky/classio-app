import { test, expect } from '@playwright/test';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { KEY, state, device } from './helpers.mjs';

const levels=async p=>(await p.locator('.mod.on .chip').first().textContent()).trim();
const stored=(p)=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);

test('dos dispositivos se sincronizan por código sin perder progreso',async({browser})=>{
  const A=await device(browser,state({0:5,1:4},3,{'potencias:p1':[{g:7,d:1000}]}));
  expect(await levels(A)).toBe('2 de 6 niveles');
  await A.click('#sync');
  await expect(A.getByRole('heading',{name:'Sincronizar entre dispositivos'})).toBeVisible();
  await A.click('#create');
  const code=(await A.locator('.code').textContent()).trim();
  expect(code).toMatch(/^[2-9A-Z]{5}-[2-9A-Z]{5}$/);
  await expect(A.locator('#sync')).toHaveText('Sincronización activada');

  const B=await device(browser,state({2:5},1));
  await B.click('#sync');
  await B.fill('#code-in','abc');await B.click('#link-btn');
  await expect(B.locator('#sync-msg')).toContainText('no es válido');
  await B.fill('#code-in','ZZZZZ-ZZZZZ');await B.click('#link-btn');
  await expect(B.locator('#sync-msg')).toContainText('no existe');
  await B.fill('#code-in',' '+code.toLowerCase().replace('-',' ')+' ');await B.click('#link-btn');
  await expect(B.locator('.code')).toHaveText(code);
  await B.click('#home-btn');
  expect(await levels(B)).toBe('3 de 6 niveles');

  const dir=mkdtempSync(join(tmpdir(),'e2e-')),file=join(dir,'import.json');writeFileSync(file,state({3:5},5));
  await B.setInputFiles('#import-file',file);
  await expect.poll(async()=>Object.keys((await stored(B)).mods.potencias.best).sort().join(),{timeout:8000}).toBe('0,1,2,3');

  await A.click('#home-btn');await A.reload();
  await expect(A.locator('.mod.on .chip',{hasText:'4 de 6 niveles'})).toBeVisible({timeout:8000});
  expect((await stored(A)).exams['potencias:p1']).toHaveLength(1);

  await A.click('#open-all');await A.waitForTimeout(2600);await B.reload();
  await expect.poll(async()=>(await stored(B)).open).toBe(false);

  await B.click('#sync');await B.click('#unlink');await B.click('#u-yes');
  await expect(B.locator('#create')).toBeVisible();
  await B.click('#home-btn');expect(await levels(B)).toBe('4 de 6 niveles');

  await A.click('#reset');await expect(A.locator('#foot-actions')).toContainText('dejará de sincronizarse');
  await A.click('#r-yes');await A.reload();
  await expect(A.locator('.mod.on .chip').first()).toHaveText('0 de 6 niveles');
  expect(A.errors).toEqual([]);expect(B.errors).toEqual([]);
});
