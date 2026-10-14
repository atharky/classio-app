import test from 'node:test';
import assert from 'node:assert/strict';
import { POT_LEVELS, parseNum, num } from '../data.js';

test('los niveles de potencias generan preguntas válidas', () => {
  for (const level of POT_LEVELS) for (const question of level.gens.map(fn => fn())) {
    assert.equal(typeof question.prompt, 'string');
    if (question.type === 'mc') {
      assert.ok(question.options.length >= 2);
      assert.ok(Number.isInteger(question.answer));
      assert.ok(question.answer >= 0 && question.answer < question.options.length);
    }
  }
});

test('parseNum acepta respuestas numéricas y rechaza texto', () => {
  assert.equal(parseNum('  -12,5 '), -12.5);
  assert.equal(parseNum('abc'), null);
});

test('num crea una pregunta numérica', () => {
  const question = num('¿Cuánto es?', 4, 'Porque sí');
  assert.equal(question.answer, 4);
  assert.equal(question.type, 'num');
});
