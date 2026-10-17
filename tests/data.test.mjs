import test from 'node:test';
import assert from 'node:assert/strict';
import { POT_LEVELS, parseNum, num, fmt, isqrt, R } from '../data.js';

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

test('fmt usa coma decimal y agrupa miles solo en la parte entera', () => {
  assert.equal(fmt(5.4), '5,4');
  assert.equal(fmt(-2.5), '−2,5');
  assert.equal(fmt(12345), '12\u202f345');
  assert.equal(fmt(12345.6), '12\u202f345,6');
  for (const n of [5.4, -2.5, 81, -8, 1000000]) assert.equal(parseNum(fmt(n)), n);
});

test('isqrt calcula la raíz entera por defecto', () => {
  for (let n = 0; n <= 10000; n++) {
    const r = isqrt(n);
    assert.ok(r * r <= n && n < (r + 1) * (r + 1), `isqrt(${n}) = ${r}`);
  }
});

test('R muestra el radicando con texto accesible', () => {
  const html = R(49);
  assert.match(html, /class="rc">49</);
  assert.match(html, /raíz de /);
  assert.match(R(10000), /10\u202f000/);
  assert.match(R('x'), />x</);
});
