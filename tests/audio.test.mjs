import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { audioSteps, audioPath } from '../scripts/audio-report.mjs';

test('cada audio declarado en un paso existe y sigue el nombre módulo-nivel-paso', () => {
  for (const s of audioSteps().filter((x) => x.declared)) {
    assert.equal(s.declared, s.path, `${s.moduleId} nivel ${s.level + 1} paso ${s.step + 1}: nombre esperado ${s.path}`);
    assert.ok(existsSync(new URL('../' + s.declared, import.meta.url)), `${s.declared} no existe`);
  }
});

test('el informe cubre todos los pasos de todos los relatos', () => {
  const steps = audioSteps();
  assert.ok(steps.length > 300);
  assert.equal(new Set(steps.map((s) => s.path)).size, steps.length, 'rutas repetidas');
  assert.equal(audioPath('potencias', 0, 0), 'audio/potencias-1-1.mp3');
});
