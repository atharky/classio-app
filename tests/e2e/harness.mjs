/* Página de pruebas: monta una pregunta de cada formato para probar su interfaz sin depender del azar. */
import { qBody, wireQ, answered, isRight, lockQ, rightText } from '/question.js';
import { txt, vf, sorting, labelq, crossword } from '/qtypes.js';
import { CRUCIGRAMA } from '/tierra.js';
import { watchStyles } from '/inline.js';

watchStyles();
const SVG = '<svg viewBox="0 0 100 100"><circle data-id="a" cx="50" cy="50" r="40"/><circle data-id="b" cx="50" cy="50" r="20"/></svg>';
const QUESTIONS = {
  text: () => txt('Completa: la roca del manto es la…', 'peridotita', 'x', { accept: [] }),
  vf: () => vf('El núcleo externo es sólido.', false, 'x', ['El núcleo externo es líquido.', 'El núcleo externo es gaseoso.']),
  sort: () =>
    sorting(
      'Clasifica',
      ['Ciencia', 'Pseudociencia'],
      [
        ['Astronomía', 0],
        ['Numerología', 1],
        ['Medicina', 0],
      ],
      'x',
    ),
  label: () =>
    labelq(
      'Toca la capa pequeña',
      SVG,
      [
        { id: 'a', name: 'Grande' },
        { id: 'b', name: 'Pequeña' },
      ],
      'b',
      'x',
    ),
  cross: () => crossword('Crucigrama', CRUCIGRAMA, 'x'),
};
let q = null;
window.mount = (type) => {
  q = QUESTIONS[type]();
  const root = document.getElementById('root');
  root.innerHTML = `<div class="prompt">${q.prompt}</div><div id="qb">${qBody(q)}</div>`;
  wireQ(root.querySelector('#qb'), q, () => (window.__changes = (window.__changes ?? 0) + 1));
};
window.state = () => ({ answered: answered(q), right: isRight(q), rightText: rightText(q) });
window.lock = () => lockQ(document.getElementById('qb'), q, isRight(q));
document.title = 'listo';
