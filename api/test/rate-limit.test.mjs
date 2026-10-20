import test from 'node:test';
import assert from 'node:assert/strict';
import { createLimiter, memoryCounters, clientId, LIMITS } from '../src/rate-limit.js';

const clock = (t = 1_000_000) => ({ now: () => t, set: (v) => (t = v) });

test('deja pasar hasta el máximo de la ventana y corta después', async () => {
  const c = clock();
  const lim = createLimiter(memoryCounters(), { now: c.now });
  for (let i = 0; i < LIMITS.general.max; i++) assert.equal(await lim.allow('general', 'a'), true, `petición ${i + 1}`);
  assert.equal(await lim.allow('general', 'a'), false);
  assert.equal(await lim.allow('general', 'b'), true, 'otra IP no se ve afectada');
});

test('una ventana nueva empieza de cero y borra las viejas', async () => {
  const c = clock();
  const counters = memoryCounters();
  const lim = createLimiter(counters, { now: c.now });
  for (let i = 0; i < 70; i++) await lim.allow('general', 'a');
  c.set(c.now() + 60_000);
  assert.equal(await lim.allow('general', 'a'), true);
  c.set(c.now() + 120_000);
  assert.equal(await lim.allow('general', 'a'), true);
  await new Promise((r) => setImmediate(r));
  assert.ok([...counters.rows.keys()].every((k) => !k.startsWith(`general-${Math.floor(1_000_000 / 60_000)}|`)), 'la ventana vieja se borra');
});

test('crear códigos tiene un límite por hora más estricto', async () => {
  const lim = createLimiter(memoryCounters(), { now: clock().now });
  for (let i = 0; i < LIMITS.create.max; i++) assert.equal(await lim.allow('create', 'a'), true);
  assert.equal(await lim.allow('create', 'a'), false);
});

test('el identificador no contiene la IP y cambia con la sal', () => {
  const h = new Headers({ 'x-forwarded-for': '203.0.113.9:4711, 10.0.0.1' });
  const id = clientId(h, 'dia1');
  assert.match(id, /^[0-9a-f]{32}$/);
  assert.ok(!id.includes('203'));
  assert.equal(id, clientId({ get: (k) => h.get(k) }, 'dia1'));
  assert.notEqual(id, clientId(h, 'dia2'));
  assert.equal(clientId(new Headers(), 'x'), clientId(new Headers(), 'x'));
});
