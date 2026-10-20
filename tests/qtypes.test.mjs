import test from 'node:test';
import assert from 'node:assert/strict';
import { norm, txt, vf, sorting, labelq, crossword, crossCells, TYPES } from '../qtypes.js';
import { CRUCIGRAMA } from '../tierra.js';
import { answered, isRight } from '../question.js';

test('norm ignora mayúsculas, tildes, signos y espacios de más', () => {
  assert.equal(norm('  NÚCLEO  Interno! '), 'nucleo interno');
  assert.equal(norm('Hierro,  níquel'), 'hierro niquel');
  assert.equal(norm(null), '');
});

test('completar: acepta tildes y mayúsculas, y alternativas', () => {
  const q = txt('…', 'núcleo', 'x', { accept: ['el nucleo'] });
  for (const [raw, ok] of [['Nucleo', true], [' NÚCLEO ', true], ['el núcleo', true], ['manto', false], ['', false]]) {
    q.raw = raw;
    assert.equal(isRight(q), ok, raw);
  }
  q.raw = '';
  assert.equal(answered(q), false);
});

test('verdadero o falso con corrección', () => {
  const falso = vf('El núcleo externo es sólido.', false, 'x', ['es líquido', 'es gaseoso', 'es de oro']);
  assert.equal(answered(falso), false);
  falso.v = 'F';
  assert.equal(answered(falso), false, 'falta elegir la corrección');
  falso.c = 1;
  assert.ok(answered(falso) && !isRight(falso));
  falso.c = 0;
  assert.ok(isRight(falso));
  falso.v = 'V';
  assert.ok(answered(falso) && !isRight(falso));
  const cierto = vf('El núcleo interno es sólido.', true, 'x');
  cierto.v = 'V';
  assert.ok(answered(cierto) && isRight(cierto));
  cierto.v = 'F';
  assert.equal(isRight(cierto), false);
});

test('clasificar: hay que colocar todos y acertar todos', () => {
  const q = sorting('…', ['Ciencia', 'Pseudo'], [['A', 0], ['B', 1], ['C', 1]], 'x');
  q.pl = [0, undefined, 1];
  assert.equal(answered(q), false);
  q.pl = [0, 0, 1];
  assert.ok(answered(q) && !isRight(q));
  q.pl = [0, 1, 1];
  assert.ok(isRight(q));
  assert.match(TYPES.sort.rightText(q), /Ciencia: A · Pseudo: B, C/);
});

test('etiquetar el dibujo', () => {
  const q = labelq('…', '<svg><circle data-id="a"/><circle data-id="b"/></svg>', [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }], 'b', 'x');
  assert.equal(answered(q), false);
  q.sel = 'a';
  assert.ok(answered(q) && !isRight(q));
  q.sel = 'b';
  assert.ok(isRight(q));
});

test('crucigrama: se acierta con todas las letras', () => {
  const q = crossword('…', [{ n: 1, dir: 'h', r: 0, c: 0, answer: 'SOL', clue: '' }, { n: 2, dir: 'v', r: 0, c: 2, answer: 'LUNA', clue: '' }], 'x');
  q.cells = { '0,0': 'S', '0,1': 'O', '0,2': 'L' };
  assert.ok(answered(q) && !isRight(q));
  q.cells = { '0,0': 'S', '0,1': 'O', '0,2': 'L', '1,2': 'U', '2,2': 'N', '3,2': 'A' };
  assert.ok(isRight(q));
});

test('el crucigrama de la geosfera está bien colocado', () => {
  assert.equal(CRUCIGRAMA.length, 8);
  // Las intersecciones coinciden y ninguna palabra queda pegada a otra sin cruzarse con ella.
  const owner = new Map();
  for (const w of CRUCIGRAMA)
    [...w.answer].forEach((ch, i) => {
      const k = `${w.r + (w.dir === 'v' ? i : 0)},${w.c + (w.dir === 'h' ? i : 0)}`;
      if (owner.has(k)) assert.equal(owner.get(k).ch, ch, `conflicto en ${k}`);
      owner.set(k, { ch, dir: w.dir });
    });
  const cells = crossCells(CRUCIGRAMA);
  for (const [k, x] of cells) {
    const horiz = cells.has(`${x.r},${x.c - 1}`) || cells.has(`${x.r},${x.c + 1}`);
    const vert = cells.has(`${x.r - 1},${x.c}`) || cells.has(`${x.r + 1},${x.c}`);
    const ws = CRUCIGRAMA.filter((w) => crossCells([w]).has(k));
    if (horiz) assert.ok(ws.some((w) => w.dir === 'h'), `letras sueltas en horizontal en ${k}`);
    if (vert) assert.ok(ws.some((w) => w.dir === 'v'), `letras sueltas en vertical en ${k}`);
  }
  const answers = CRUCIGRAMA.map((w) => w.answer).sort();
  assert.deepEqual(answers, ['CONTINENTAL', 'EXTERNO', 'GEOSFERA', 'HIERRO', 'LITOSFERA', 'MANTO', 'NUCLEO', 'OCEANICA']);
  assert.equal(new Set(CRUCIGRAMA.map((w) => w.n)).size, 8);
});
