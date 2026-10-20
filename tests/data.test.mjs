import test from 'node:test';
import assert from 'node:assert/strict';
import { RAI_LEVELS, parseNum, num, fmt, isqrt, R, esc } from '../data.js';
import { SUBJECTS, MODULES, ANIMS } from '../catalog.js';

const ACTIVE = MODULES.filter(m => !m.soon);

function checkQuestion(q, label) {
  const where = `${label}: ${q && q.prompt}`;
  assert.ok(q.prompt && typeof q.prompt === 'string', where);
  assert.ok(q.explain && typeof q.explain === 'string', where);
  assert.doesNotMatch(q.prompt + q.explain, /undefined|NaN|Infinity/, where);
  if (q.type === 'mc') {
    assert.ok(q.options.length >= 2, where);
    assert.equal(new Set(q.options).size, q.options.length, `${where}: opciones repetidas`);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, where);
  } else if (['text', 'vf', 'sort', 'label', 'cross'].includes(q.type)) {
    // Formatos de ficha: cada uno comprueba su propia estructura.
    const check = {
      text: () => assert.ok(q.answer && Array.isArray(q.accept), where),
      vf: () => assert.ok(typeof q.truth === 'boolean' && Array.isArray(q.fixes) && (q.truth || q.fixes.length >= 2), where),
      sort: () => assert.ok(q.items.length >= 2 && q.items.length === q.answer.length && q.answer.every((k) => k >= 0 && k < q.cols.length), where),
      label: () => assert.ok(q.regions.some((r) => r.id === q.answer) && q.svg.includes(`data-id="${q.answer}"`), where),
      cross: () => assert.ok(q.words.length >= 2, where),
    };
    check[q.type]();
  } else {
    assert.equal(q.type, 'num', where);
    assert.ok(Number.isFinite(q.answer), where);
    assert.equal(parseNum(fmt(q.answer)), q.answer, `${where}: la respuesta mostrada no se acepta`);
  }
}
// También se prueban los módulos aún ocultos que ya tienen niveles.
const WITH_CONTENT = MODULES.filter(m => m.levels);
const RUNS = 200;

test('hay al menos un módulo activo con niveles y exámenes', () => {
  assert.ok(ACTIVE.length >= 1);
  for (const mod of ACTIVE) {
    assert.ok(Array.isArray(mod.levels) && mod.levels.length > 0, mod.id);
    assert.ok(Array.isArray(mod.exams) && mod.exams.length > 0, mod.id);
  }
});

for (const mod of WITH_CONTENT) {
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
    for (const [i, level] of mod.levels.entries()) for (const [g, gen] of level.gens.entries()) for (let r = 0; r < RUNS; r++)
      checkQuestion(gen(), `${mod.id} nivel ${i + 1} gen ${g + 1}`);
  });

  test(`${mod.id}: cada nivel tiene explicación animada con preguntas`, () => {
    const anims = ANIMS[mod.id];
    assert.ok(Array.isArray(anims), `${mod.id}: sin animaciones`);
    assert.equal(anims.length, mod.levels.length, `${mod.id}: una animación por nivel`);
    for (const [i, steps] of anims.entries()) {
      const where = `${mod.id} animación ${i + 1}`;
      assert.ok(steps.length >= 4, `${where}: pocos pasos`);
      assert.ok(!steps[0].ask, `${where}: debe empezar explicando, no preguntando`);
      assert.ok(steps.filter(s => s.ask).length >= 2, `${where}: al menos 2 preguntas`);
      assert.ok(steps.some(s => /class="real-tag"/.test(s.show || '')), `${where}: falta un ejemplo «En la vida real»`);
      for (const [k, step] of steps.entries()) {
        const at = `${where} paso ${k + 1}`;
        assert.ok(typeof step.say === 'string' && step.say.trim(), `${at}: sin narración`);
        // Frases cortas: algunas voces del navegador cortan textos largos.
        assert.ok(step.say.length <= 220, `${at}: narración demasiado larga (${step.say.length})`);
        assert.doesNotMatch(step.say, /<|\d/, `${at}: la narración se lee en voz alta, sin HTML ni cifras`);
        if (step.ask) for (let r = 0; r < RUNS; r++) checkQuestion(step.ask(), at);
        else assert.ok(typeof step.show === 'string' && step.show.trim() && !/undefined|NaN/.test(step.show), `${at}: sin escena`);
        // Un retraso enorme suele ser un argumento cambiado de sitio: el trazo no llegaría a verse.
        for (const m of (step.show || '').matchAll(/--d:\s*([\d.]+)/g)) assert.ok(+m[1] <= 12, `${at}: un trazo empieza a los ${m[1]} s`);
      }
    }
  });

  test(`${mod.id}: los exámenes apuntan a niveles existentes`, () => {
    const ids = new Set();
    for (const ex of mod.exams || []) {
      assert.ok(!ids.has(ex.id), `${mod.id}: examen ${ex.id} repetido`);
      ids.add(ex.id);
      assert.ok(ex.levels.length > 0 && ex.n >= ex.levels.length, `${mod.id}:${ex.id}`);
      for (const r of ex.levels) {
        // Un número es un nivel del propio módulo; «módulo:nivel» toma un nivel de otro módulo.
        const [m, li] = typeof r === 'number' ? [mod, r] : [MODULES.find(x => x.id === r.split(':')[0]), +r.split(':')[1]];
        assert.ok(m && m.levels && !m.soon, `${mod.id}:${ex.id} módulo de «${r}»`);
        assert.ok(Number.isInteger(li) && li >= 0 && li < m.levels.length, `${mod.id}:${ex.id} nivel ${r}`);
      }
    }
  });
}

test('cada módulo pertenece a una materia y cada materia tiene módulos', () => {
  const ids = new Set(SUBJECTS.map(x => x.id));
  assert.equal(ids.size, SUBJECTS.length);
  for (const m of MODULES) assert.ok(ids.has(m.subject), `${m.id}: materia «${m.subject}» desconocida`);
  for (const x of SUBJECTS) assert.ok(MODULES.some(m => m.subject === x.id && !m.soon), `${x.id}: sin módulos activos`);
});

test('biología y lengua: las respuestas numéricas son correctas', () => {
  const byId = id => MODULES.find(m => m.id === id);
  const numGens = id => byId(id).levels.flatMap(l => l.gens);
  let checked = 0;
  for (const gen of [...numGens('laboratorio'), ...numGens('resumen')]) for (let r = 0; r < RUNS; r++) {
    const q = gen();
    if (q.type !== 'num') continue;
    const n = ints(q);
    if (/aumentos totales/.test(q.prompt)) assert.equal(q.answer, n[0] * n[1], q.prompt);
    else if (/De cuántos aumentos es el objetivo/.test(q.prompt)) assert.equal(q.answer * n[1], n[0], q.prompt);
    else if (/balanza marca/.test(q.prompt)) assert.equal(q.answer, n[1] - n[0], q.prompt);
    else if (/cuarta parte/.test(q.prompt)) assert.equal(q.answer * 4, n[0], q.prompt);
    else assert.fail(`sin comprobación: ${q.prompt}`);
    checked++;
  }
  assert.ok(checked > 0);
});

test('los identificadores de módulo son únicos', () => {
  assert.equal(new Set(MODULES.map(m => m.id)).size, MODULES.length);
});

// Recalcula la respuesta de cada pregunta de raíces a partir del enunciado.
const radicand = q => Number(q.prompt.match(/class="rc">([\d\u202f]+)</)[1].replace(/\u202f/g, ''));
const ints = q => q.prompt.replace(/<[^>]+>/g, ' ').match(/\d+/g).map(Number);
const isSquare = n => isqrt(n) ** 2 === n;

// Evalúa una expresión del enunciado (raíces, potencias y operaciones) para recalcular la respuesta.
const RT = /<span class="rt"><span class="rad"[^>]*>√<\/span><span class="sr">raíz de <\/span><span class="rc">((?:(?!<span class="rt">).)*?)<\/span><\/span>/;
const evalExpr = html => {
  let h = html;
  while (RT.test(h)) h = h.replace(RT, (_, x) => `Math.sqrt(${x})`);
  const js = h.replace(/<sup>(\d+)<\/sup>/g, '**$1').replace(/<[^>]+>/g, '').replace(/ /g, '').replace(/·/g, '*').replace(/:/g, '/').replace(/−/g, '-');
  return Function(`return (${js})`)();
};
const expr = q => evalExpr(q.prompt.replace(/^(Calcula|¿Cuánto vale) /, '').replace(/\?$/, ''));
const near = (a, b) => Math.abs(a - b) < 1e-9;
const TRUE_EQ = s => { // «√49 = 7», «(−7)² = 49», «√(−49) = 7»
  let m;
  if ((m = s.match(/^√(\d+) = (−?)(\d+)$/))) return m[2] === '' && Number(m[3]) ** 2 === Number(m[1]);
  if ((m = s.match(/^\(−(\d+)\)² = (−?)(\d+)$/))) return m[2] === '' && Number(m[1]) ** 2 === Number(m[3]);
  if (/^√\(−\d+\)/.test(s)) return false;
  throw new Error(`igualdad desconocida: ${s}`);
};
const NUM_CHECKS = [
  [/cifra decimal/, q => { const n = radicand(q), d = Math.round(q.answer * 10); return d * d <= 100 * n && 100 * n < (d + 1) ** 2; }],
  [/^¿Cuál es la raíz entera/, q => q.answer === isqrt(ints(q)[0])],
  [/^Calcula el resto/, q => q.answer === ints(q)[0] - isqrt(ints(q)[0]) ** 2],
  [/^La raíz entera de un número es/, q => { const [r, s] = ints(q); return q.answer === r * r + s && s <= 2 * r; }],
  [/cm²/, q => q.answer ** 2 === ints(q)[0]],
  [/^¿Qué número natural/, q => q.answer ** 2 === ints(q)[0]],
  [/^Calcula (?!.*cifra).*(<sup>|[+·:−])/, q => near(q.answer, expr(q))],
  [/^Calcula /, q => q.answer ** 2 === radicand(q)],
];
const MC_CHECKS = [
  [/^¿Qué números elevados al cuadrado dan/, q => { const k = Math.sqrt(ints(q)[0]); return q.options[q.answer] === `${k} y −${k}`; }],
  [/^¿Cuánto vale .*class="rc">−\d+</, q => q.options[q.answer] === 'No existe'],
  [/^¿Cuánto vale .*class="rc">[^<]*[+·:−]/, q => Number(q.options[q.answer]) === expr(q)],
  [/^¿Cuál de estas igualdades es verdadera/, q => q.options.every((o, k) => TRUE_EQ(o) === (k === q.answer))],
  [/^¿Cuánto vale/, q => Number(q.options[q.answer]) ** 2 === radicand(q)],
  [/está entre/, q => { const r = isqrt(radicand(q)); return q.options[q.answer] === `${r} y ${r + 1}`; }],
  [/^¿Es \d+ un cuadrado perfecto/, q => (q.options[q.answer] === 'Sí') === isSquare(ints(q)[0])],
  [/no<\/b> es un cuadrado perfecto/, q => q.options.every((o, k) => isSquare(Number(o)) === (k !== q.answer))],
  [/es un cuadrado perfecto\?$/, q => q.options.every((o, k) => isSquare(Number(o)) === (k === q.answer))],
  [/^¿Por qué|¿cuál es (el|la) <b>/, () => true],
];

test('raíces: las respuestas son matemáticamente correctas', () => {
  for (const [i, level] of RAI_LEVELS.entries()) for (const [g, gen] of level.gens.entries()) for (let r = 0; r < RUNS; r++) {
    const q = gen();
    const checks = q.type === 'num' ? NUM_CHECKS : MC_CHECKS;
    const found = checks.find(([re]) => re.test(q.prompt));
    const where = `nivel ${i + 1} gen ${g + 1}: ${q.prompt}`;
    assert.ok(found, `${where}: no hay comprobación para este enunciado`);
    assert.ok(found[1](q), `${where} → ${q.type === 'num' ? q.answer : q.options[q.answer]}`);
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

test('esc() neutraliza el HTML del texto del alumno',()=>{
  assert.equal(esc('<img src=x onerror="a()">'),'&lt;img src=x onerror=&quot;a()&quot;&gt;');
  assert.equal(esc("a&b'c"),'a&amp;b&#39;c');
  assert.equal(esc(5),'5');
});

test('ciencia y pseudociencia: las 11 disciplinas de la ficha tienen la clasificación correcta', async () => {
  const { DISC } = await import('../ciencia.js');
  const expected = { Astronomía: true, Matemáticas: true, Medicina: true, Arqueología: true, Psicología: true,
    Ufología: false, Grafología: false, Homeopatía: false, Cienciología: false, Numerología: false, Reflexología: false };
  assert.deepEqual(Object.fromEntries(DISC.map(([n, sci]) => [n, sci])), expected);
});

// ---- Divisibilidad: se recalcula cada respuesta con cuentas de fuerza bruta, sin usar las funciones del módulo.
const bDivs = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
const bPrime = (n) => n > 1 && bDivs(n).length === 2;
const bGcd = (...xs) => { for (let g = Math.min(...xs); g >= 1; g--) if (xs.every((x) => x % g === 0)) return g; };
const bLcm = (...xs) => { for (let m = Math.max(...xs); ; m++) if (xs.every((x) => m % x === 0)) return m; };
const SUP = { '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6 };
const factorsOf = (s) => s.split(' · ').flatMap((t) => { const m = t.match(/^(\d+)([²³⁴⁵⁶])?$/); return Array(m[2] ? SUP[m[2]] : 1).fill(Number(m[1])); });
const textOf = (q) => q.prompt.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const mcAns = (q) => q.options[q.answer];
const only = (q, pred) => q.options.every((o, k) => pred(Number(o)) === (k === q.answer));
const DIV_NUM = [
  [/^Escribe el múltiplo de/, (q) => { const [m, k] = ints(q); return q.answer === m * k; }],
  [/^¿Cuántos divisores tiene/, (q) => q.answer === bDivs(ints(q)[0]).length],
  [/^¿Cuál es la menor cifra/, (q) => { const [a, d] = ints(q); const c = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find((x) => (a * 10 + x) % d === 0); return q.answer === c; }],
  [/^¿Cuántos números primos hay entre/, (q) => { const [a, b] = ints(q); return q.answer === Array.from({ length: b - a - 1 }, (_, i) => a + 1 + i).filter(bPrime).length; }],
  [/^¿Cuál es el menor número primo mayor que/, (q) => { const n = ints(q)[0]; let p = n + 1; while (!bPrime(p)) p++; return q.answer === p; }],
  [/^¿Cuál es el mayor factor primo de/, (q) => q.answer === Math.max(...bDivs(ints(q)[0]).filter(bPrime))],
  [/^Calcula el número cuya descomposición es/, (q) => q.answer === factorsOf(textOf(q).match(/es ([\d²³⁴⁵⁶ ·]+)\./)[1].trim()).reduce((a, b) => a * b, 1)],
  [/^¿Cuántos factores primos distintos/, (q) => q.answer === bDivs(ints(q)[0]).filter(bPrime).length],
  [/contando los repetidos/, (q) => { let n = ints(q)[0], c = 0; for (let p = 2; n > 1; p++) while (n % p === 0) { n /= p; c++; } return q.answer === c; }],
  [/^Calcula el m\.c\.d\. de/, (q) => q.answer === bGcd(...ints(q))],
  [/^Tienes \d+ caramelos/, (q) => q.answer === bGcd(...ints(q))],
  [/^Calcula el m\.c\.m\. de/, (q) => q.answer === bLcm(...ints(q))],
  [/vuelven a salir juntos|vuelven a coincidir/, (q) => q.answer === bLcm(...ints(q))],
];
const DIV_MC = [
  [/^¿Cuál de estos números es múltiplo de \d+\?/, (q) => only(q, (x) => x % ints(q)[0] === 0)],
  [/^¿Cuál de estos números es divisor de/, (q) => only(q, (x) => ints(q)[0] % x === 0)],
  [/^¿Es \d+ un divisor de/, (q) => { const [d, n] = ints(q); return (mcAns(q) === 'Sí') === (n % d === 0); }],
  [/^¿Es \d+ divisible por/, (q) => { const [n, d] = ints(q); return (mcAns(q) === 'Sí') === (n % d === 0); }],
  [/^¿Por cuál de estos números es divisible/, (q) => only(q, (x) => ints(q)[0] % x === 0)],
  [/^¿Qué criterio permite|^Un número acaba en 0|único número primo que es par/, () => true],
  [/^¿Cuál de estos números es primo\?/, (q) => only(q, bPrime)],
  [/^¿Cuál de estos números es compuesto\?/, (q) => only(q, (x) => x > 1 && !bPrime(x))],
  [/^¿Es \d+ un número primo/, (q) => (mcAns(q) === 'Sí') === bPrime(ints(q)[0])],
  [/^¿Cuál es la descomposición en factores primos de/, (q) => { const n = ints(q)[0]; return q.options.every((o, k) => { const f = factorsOf(o); return (f.every(bPrime) && f.reduce((a, b) => a * b, 1) === n) === (k === q.answer); }); }],
  [/^¿Cuál es el m\.c\.d\. de|^¿Cuánto vale el m\.c\.d\. de/, (q) => Number(mcAns(q)) === bGcd(...ints(q))],
  [/^¿Cuál es el m\.c\.m\. de/, (q) => Number(mcAns(q)) === bLcm(...ints(q))],
  [/múltiplo de \d+ y de \d+ a la vez/, (q) => { const [a, b] = ints(q); return only(q, (x) => x % a === 0 && x % b === 0); }],
];
test('divisibilidad: las respuestas son matemáticamente correctas', () => {
  const mod = MODULES.find((m) => m.id === 'divis');
  for (const [i, level] of mod.levels.entries()) for (const [g, gen] of level.gens.entries()) for (let r = 0; r < RUNS; r++) {
    const q = gen();
    const found = (q.type === 'num' ? DIV_NUM : DIV_MC).find(([re]) => re.test(textOf(q)));
    const where = `nivel ${i + 1} gen ${g + 1}: ${textOf(q)}`;
    assert.ok(found, `${where}: no hay comprobación para este enunciado`);
    assert.ok(found[1](q), `${where} → ${q.type === 'num' ? q.answer : mcAns(q)} (${q.options ?? ''})`);
  }
});

// ---- Números enteros: cada respuesta se recalcula leyendo los números (con su signo) del enunciado.
const sInts = (q) => (textOf(q).match(/−?\d+/g) ?? []).map((x) => Number(x.replace('−', '-')));
const evalInts = (q) => Function(`return (${textOf(q).replace(/^.*?(Calcula|Cuánto vale) /, '').replace(/\?$/, '').replace(/−/g, '-').replace(/·/g, '*').replace(/:/g, '/')})`)();
const toN = (o) => Number(String(o).replace('−', '-'));
const ENT_NUM = [
  [/^¿Qué número entero representa/, (q) => q.answer === (/bajo cero|deuda|profundidad/.test(textOf(q)) ? -1 : 1) * Math.abs(sInts(q)[0])],
  [/^En la recta numérica, ¿qué número está a/, (q) => { const [k, a] = sInts(q); return q.answer === (/derecha/.test(textOf(q)) ? a + k : a - k); }],
  [/^Escribe el valor absoluto de/, (q) => q.answer === Math.abs(sInts(q)[0])],
  [/^Escribe el opuesto de/, (q) => q.answer === -sInts(q)[0]],
  [/^¿Cuántos números enteros hay entre/, (q) => { const [a, b] = sInts(q); return q.answer === b - a - 1; }],
  [/^Calcula /, (q) => q.answer === evalInts(q)],
  [/^La temperatura era de/, (q) => { const [a, b] = sInts(q); return q.answer === (/subido/.test(textOf(q)) ? a + b : a - b); }],
  [/diferencia/, (q) => { const [lo, hi] = sInts(q); return q.answer === hi - lo; }],
  [/^Un submarino/, (q) => { const [d, u] = sInts(q); return q.answer === d + u; }],
  [/^Un ascensor/, (q) => { const [p, k, j] = sInts(q); return q.answer === p + k - j; }],
  [/cada hora/, (q) => { const [a, t, h] = sInts(q); return q.answer === t - a * h; }],
  [/^Marta tiene/, (q) => { const [a, c] = sInts(q); return q.answer === a - c; }],
];
const ENT_MC = [
  [/^¿Cuál de estos números es el mayor/, (q) => toN(mcAns(q)) === Math.max(...q.options.map(toN))],
  [/^¿Cuál de estos números es el menor/, (q) => toN(mcAns(q)) === Math.min(...q.options.map(toN))],
  [/es un número entero/, (q) => q.options.every((o, k) => /^−?\d+$/.test(o) === (k === q.answer))],
  [/ordenada de menor a mayor/, (q) => q.options.every((o, k) => { const v = o.split(' < ').map(toN); return v.every((x, i) => i === 0 || v[i - 1] < x) === (k === q.answer); })],
  [/^¿Qué signo va entre/, (q) => { const [a, b] = sInts(q); return mcAns(q) === (a < b ? '<' : a > b ? '>' : '='); }],
  [/^¿Cuánto vale/, (q) => toN(mcAns(q)) === evalInts(q) && q.options.filter((o) => toN(o) === evalInts(q)).length === 1],
  [/^¿Cuál es el signo de/, (q) => { const [a, b] = sInts(q); return mcAns(q) === (a * b > 0 ? 'Positivo' : 'Negativo'); }],
  [/^Multiplicamos/, (q) => { const v = sInts(q); return mcAns(q) === (v.reduce((a, b) => a * b, 1) > 0 ? 'Positivo' : 'Negativo'); }],
];
test('enteros: las respuestas son matemáticamente correctas', () => {
  const mod = MODULES.find((x) => x.id === 'enteros');
  for (const [i, level] of mod.levels.entries()) for (const [g, gen] of level.gens.entries()) for (let r = 0; r < RUNS; r++) {
    const q = gen();
    const found = (q.type === 'num' ? ENT_NUM : ENT_MC).find(([re]) => re.test(textOf(q)));
    const where = `nivel ${i + 1} gen ${g + 1}: ${textOf(q)}`;
    assert.ok(found, `${where}: no hay comprobación para este enunciado`);
    assert.ok(found[1](q), `${where} → ${q.type === 'num' ? q.answer : mcAns(q)}`);
  }
});
