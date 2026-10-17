import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULES, parseNum, num, fmt, isqrt, R } from '../data.js';

const ACTIVE = MODULES.filter(m => !m.soon);
const RUNS = 200;

test('hay al menos un módulo activo con niveles y exámenes', () => {
  assert.ok(ACTIVE.length >= 1);
  for (const mod of ACTIVE) {
    assert.ok(Array.isArray(mod.levels) && mod.levels.length > 0, mod.id);
    assert.ok(Array.isArray(mod.exams) && mod.exams.length > 0, mod.id);
  }
});

for (const mod of ACTIVE) {
  test(`${mod.id}: los niveles tienen lección y generadores`, () => {
    for (const [i, level] of mod.levels.entries()) {
      const where = `${mod.id} nivel ${i + 1}`;
      assert.ok(level.title && level.sub, where);
      assert.ok(level.lesson.length > 0, where);
      for (const [title, html] of level.lesson) assert.ok(title && html && !/undefined|NaN/.test(html), `${where}: ${title}`);
      assert.ok(level.gens.length >= 4, `${where}: pocos generadores`);
    }
  });

  test(`${mod.id}: los generadores producen preguntas válidas`, () => {
    for (const [i, level] of mod.levels.entries()) for (const [g, gen] of level.gens.entries()) for (let r = 0; r < RUNS; r++) {
      const q = gen();
      const where = `${mod.id} nivel ${i + 1} gen ${g + 1}: ${q && q.prompt}`;
      assert.ok(q.prompt && typeof q.prompt === 'string', where);
      assert.ok(q.explain && typeof q.explain === 'string', where);
      assert.doesNotMatch(q.prompt + q.explain, /undefined|NaN|Infinity/, where);
      if (q.type === 'mc') {
        assert.ok(q.options.length >= 2, where);
        assert.equal(new Set(q.options).size, q.options.length, `${where}: opciones repetidas`);
        assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, where);
      } else {
        assert.equal(q.type, 'num', where);
        assert.ok(Number.isFinite(q.answer), where);
        assert.equal(parseNum(fmt(q.answer)), q.answer, `${where}: la respuesta mostrada no se acepta`);
      }
    }
  });

  test(`${mod.id}: los exámenes apuntan a niveles existentes`, () => {
    const ids = new Set();
    for (const ex of mod.exams) {
      assert.ok(!ids.has(ex.id), `${mod.id}: examen ${ex.id} repetido`);
      ids.add(ex.id);
      assert.ok(ex.levels.length > 0 && ex.n >= ex.levels.length, `${mod.id}:${ex.id}`);
      for (const li of ex.levels) assert.ok(Number.isInteger(li) && li >= 0 && li < mod.levels.length, `${mod.id}:${ex.id} nivel ${li}`);
    }
  });
}

test('los identificadores de módulo son únicos', () => {
  assert.equal(new Set(MODULES.map(m => m.id)).size, MODULES.length);
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
