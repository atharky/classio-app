/* ---------- tipos de pregunta con formato de ficha ----------
   Cada tipo define: body (HTML), wire (eventos), answered, isRight, rightText, userText, lock y reset.
   Los constructores (txt, vf, sorting, labelq, crossword) devuelven la pregunta con su `type`. */
import { esc } from './data.js';

// Sin mayúsculas, tildes ni espacios de más: «  Núcleo » y «nucleo» valen lo mismo.
export const norm = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const press = (root, sel, on) => {
  root.querySelectorAll(sel).forEach((b) => b.setAttribute('aria-pressed', String(b === on)));
};

/* ----- completar una frase con una palabra ----- */
export const txt = (prompt, answer, explain, { accept = [], hint = '' } = {}) => ({ type: 'text', prompt, answer, accept, explain, hint });
const text = {
  body: (q) =>
    `<div class="numin"><input id="ans" class="txtin" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Tu respuesta" placeholder="Escribe la palabra"></div>${q.hint ? `<p class="hint">${q.hint}</p>` : ''}`,
  wire(root, q, onChange) {
    const inp = root.querySelector('#ans');
    if (q.raw !== undefined) inp.value = q.raw;
    inp.oninput = () => {
      q.raw = inp.value;
      onChange?.();
    };
  },
  answered: (q) => norm(q.raw) !== '',
  isRight: (q) => [q.answer, ...q.accept].some((a) => norm(a) === norm(q.raw)),
  rightText: (q) => q.answer,
  userText: (q) => (norm(q.raw) ? q.raw : '(sin responder)'),
  lock(root, q, ok) {
    const inp = root.querySelector('#ans');
    inp.disabled = true;
    inp.classList.add(ok ? 'right' : 'wrong');
  },
  reset() {},
};

/* ----- verdadero o falso, y si es falso, elegir la corrección ----- */
export const vf = (statement, truth, explain, fixes = []) => {
  // fixes: [corrección buena, ...malas]; se barajan al mostrarlas
  const order = fixes.map((_, i) => i);
  return { type: 'vf', prompt: `¿Verdadero o falso?<br>«${statement}»`, truth, fixes, order, explain };
};
const vfT = {
  body: (q) =>
    `<div class="opts"><button type="button" class="opt" data-v="V" aria-pressed="false">Verdadero</button><button type="button" class="opt" data-v="F" aria-pressed="false">Falso</button></div>
     <div class="fixes" hidden><p class="hint">Elige la frase que lo corrige:</p><div class="opts">${q.order.map((i) => `<button type="button" class="opt" data-c="${i}" aria-pressed="false">${q.fixes[i]}</button>`).join('')}</div></div>`,
  wire(root, q, onChange) {
    const fixes = root.querySelector('.fixes');
    const show = () => (fixes.hidden = q.v !== 'F' || !q.fixes.length);
    root.querySelectorAll('[data-v]').forEach((b) => {
      b.onclick = () => {
        if (b.disabled) return;
        press(root, '[data-v]', b);
        q.v = b.dataset.v;
        if (q.v === 'V') {
          q.c = undefined;
          press(root, '[data-c]', null);
        }
        show();
        onChange?.();
      };
    });
    root.querySelectorAll('[data-c]').forEach((b) => {
      b.onclick = () => {
        if (b.disabled) return;
        press(root, '[data-c]', b);
        q.c = +b.dataset.c;
        onChange?.();
      };
    });
    if (q.v) press(root, '[data-v]', root.querySelector(`[data-v="${q.v}"]`));
    if (q.c !== undefined) press(root, '[data-c]', root.querySelector(`[data-c="${q.c}"]`));
    show();
  },
  answered: (q) => q.v === 'V' || (q.v === 'F' && (!q.fixes.length || q.c !== undefined)),
  isRight: (q) => (q.truth ? q.v === 'V' : q.v === 'F' && (!q.fixes.length || q.c === 0)),
  rightText: (q) => (q.truth ? 'Verdadero' : `Falso: ${q.fixes[0] ?? ''}`.replace(/: $/, '')),
  userText: (q) => (q.v ? (q.v === 'V' ? 'Verdadero' : `Falso${q.c !== undefined ? ': ' + q.fixes[q.c] : ''}`) : '(sin responder)'),
  lock(root, q) {
    root.querySelectorAll('.opt').forEach((b) => {
      b.disabled = true;
      if (b.dataset.v) b.classList.add(b.dataset.v === (q.truth ? 'V' : 'F') ? 'right' : b.getAttribute('aria-pressed') === 'true' ? 'wrong' : 'x');
      else if (+b.dataset.c === 0) b.classList.add('right');
      else if (b.getAttribute('aria-pressed') === 'true') b.classList.add('wrong');
    });
    root.querySelector('.fixes').hidden = q.truth || !q.fixes.length;
  },
  reset(root, q) {
    q.v = q.c = undefined;
    press(root, '.opt', null);
    root.querySelector('.fixes').hidden = true;
  },
};

/* ----- clasificar elementos en dos (o más) columnas ----- */
// items: [[texto, índice de columna]]
export const sorting = (prompt, cols, items, explain) => ({ type: 'sort', prompt, cols, items: items.map((i) => i[0]), answer: items.map((i) => i[1]), explain });
const sort = {
  body: (q) =>
    `<div class="sortq" role="group" aria-label="Clasifica cada elemento">${q.items
      .map(
        (it, i) =>
          `<div class="srow"><span class="sname">${it}</span><span class="scols" role="radiogroup" aria-label="${esc(it.replace(/<[^>]+>/g, ''))}">${q.cols.map((c, k) => `<button type="button" class="opt sm" data-i="${i}" data-k="${k}" role="radio" aria-checked="false">${c}</button>`).join('')}</span></div>`,
      )
      .join('')}</div>`,
  wire(root, q, onChange) {
    q.pl ??= q.items.map(() => undefined);
    const paint = () =>
      root.querySelectorAll('.sortq .opt').forEach((b) => {
        const on = q.pl[+b.dataset.i] === +b.dataset.k;
        b.setAttribute('aria-checked', String(on));
      });
    root.querySelectorAll('.sortq .opt').forEach((b) => {
      b.onclick = () => {
        if (b.disabled) return;
        q.pl[+b.dataset.i] = +b.dataset.k;
        paint();
        onChange?.();
      };
    });
    paint();
  },
  answered: (q) => !!q.pl && q.pl.every((v) => v !== undefined),
  isRight: (q) => !!q.pl && q.pl.every((v, i) => v === q.answer[i]),
  rightText: (q) => q.cols.map((c, k) => `${c}: ${q.items.filter((_, i) => q.answer[i] === k).join(', ') || '—'}`).join(' · '),
  userText: (q) => (q.pl && q.pl.some((v) => v !== undefined) ? q.cols.map((c, k) => `${c}: ${q.items.filter((_, i) => q.pl[i] === k).join(', ') || '—'}`).join(' · ') : '(sin responder)'),
  lock(root, q) {
    root.querySelectorAll('.sortq .opt').forEach((b) => {
      b.disabled = true;
      const i = +b.dataset.i,
        k = +b.dataset.k;
      if (k === q.answer[i]) b.classList.add('right');
      else if (q.pl[i] === k) b.classList.add('wrong');
    });
  },
  reset(root, q) {
    q.pl = q.items.map(() => undefined);
    sort.wire(root, q);
  },
};

/* ----- etiquetar un dibujo tocando la parte ----- */
// svg: HTML de un <svg> cuyas partes llevan data-id; regions: [{id, name}]
export const labelq = (prompt, svg, regions, answer, explain) => ({ type: 'label', prompt, svg, regions, answer, explain });
const label = {
  body: (q) => `<div class="labelq">${q.svg}</div>`,
  wire(root, q, onChange) {
    const parts = root.querySelectorAll('.labelq [data-id]');
    const paint = () => parts.forEach((p) => p.classList.toggle('sel', p.dataset.id === q.sel));
    const pick = (p) => {
      if (p.classList.contains('locked')) return;
      q.sel = p.dataset.id;
      paint();
      onChange?.();
    };
    parts.forEach((p) => {
      const name = q.regions.find((r) => r.id === p.dataset.id)?.name ?? p.dataset.id;
      p.setAttribute('tabindex', '0');
      p.setAttribute('role', 'button');
      p.setAttribute('aria-label', name);
      p.onclick = () => pick(p);
      p.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pick(p);
        }
      };
    });
    paint();
  },
  answered: (q) => q.sel !== undefined,
  isRight: (q) => q.sel === q.answer,
  rightText: (q) => q.regions.find((r) => r.id === q.answer).name,
  userText: (q) => (q.sel !== undefined ? q.regions.find((r) => r.id === q.sel).name : '(sin responder)'),
  lock(root, q) {
    root.querySelectorAll('.labelq [data-id]').forEach((p) => {
      p.classList.add('locked');
      p.classList.toggle('right', p.dataset.id === q.answer);
      p.classList.toggle('wrong', p.dataset.id === q.sel && q.sel !== q.answer);
    });
  },
  reset(root, q) {
    q.sel = undefined;
    root.querySelectorAll('.labelq [data-id]').forEach((p) => p.classList.remove('sel'));
  },
};

/* ----- crucigrama ----- */
// words: [{n, dir:'h'|'v', r, c, answer, clue}] (sin tildes en answer)
export const crossword = (prompt, words, explain) => ({ type: 'cross', prompt, words, explain });
export const crossCells = (words) => {
  const cells = new Map();
  for (const w of words)
    [...w.answer].forEach((ch, i) => {
      const r = w.r + (w.dir === 'v' ? i : 0),
        c = w.c + (w.dir === 'h' ? i : 0);
      cells.set(`${r},${c}`, { r, c, ch, n: i === 0 ? w.n : undefined });
    });
  return cells;
};
const cross = {
  body(q) {
    const cells = crossCells(q.words);
    const rows = Math.max(...[...cells.values()].map((x) => x.r)) + 1,
      cols = Math.max(...[...cells.values()].map((x) => x.c)) + 1;
    let grid = '';
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const x = cells.get(`${r},${c}`);
        grid += x
          ? `<span class="cx">${x.n ? `<i>${x.n}</i>` : ''}<input type="text" maxlength="1" autocomplete="off" autocapitalize="characters" data-r="${r}" data-c="${c}" aria-label="Fila ${r + 1}, columna ${c + 1}${x.n ? ', empieza la palabra ' + x.n : ''}"></span>`
          : '<span class="cx off"></span>';
      }
    const clues = (d) => q.words.filter((w) => w.dir === d).map((w) => `<li value="${w.n}">${w.clue} <span class="muted">(${w.answer.length} letras)</span></li>`).join('');
    return `<div class="crossq"><div class="cgrid" data-s="grid-template-columns:repeat(${cols},2.1rem)">${grid}</div>
      <div class="cclues"><h4>Horizontales</h4><ol>${clues('h')}</ol><h4>Verticales</h4><ol>${clues('v')}</ol></div></div>`;
  },
  wire(root, q, onChange) {
    q.cells ??= {};
    const inputs = [...root.querySelectorAll('.cgrid input')];
    const at = (r, c) => inputs.find((i) => +i.dataset.r === r && +i.dataset.c === c);
    const wordAt = (r, c) => q.words.filter((w) => crossCells([w]).has(`${r},${c}`));
    inputs.forEach((inp) => {
      const key = `${inp.dataset.r},${inp.dataset.c}`;
      if (q.cells[key]) inp.value = q.cells[key];
      inp.oninput = () => {
        const v = norm(inp.value).slice(-1).toUpperCase();
        inp.value = v;
        q.cells[key] = v;
        if (v) {
          // salta a la siguiente casilla de la palabra
          const r = +inp.dataset.r,
            c = +inp.dataset.c,
            w = wordAt(r, c)[0];
          const next = w && (w.dir === 'h' ? at(r, c + 1) : at(r + 1, c));
          if (next && wordAt(+next.dataset.r, +next.dataset.c).includes(w)) next.focus();
        }
        onChange?.();
      };
      inp.onkeydown = (e) => {
        const d = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[e.key];
        if (!d) return;
        const n = at(+inp.dataset.r + d[0], +inp.dataset.c + d[1]);
        if (n) {
          e.preventDefault();
          n.focus();
        }
      };
    });
  },
  answered: (q) => Object.values(q.cells ?? {}).some(Boolean),
  isRight: (q) => [...crossCells(q.words)].every(([k, x]) => (q.cells?.[k] ?? '') === x.ch),
  rightText: (q) => q.words.map((w) => `${w.n} ${w.dir === 'h' ? 'horizontal' : 'vertical'}: ${w.answer}`).join(' · '),
  userText: (q) => (Object.values(q.cells ?? {}).some(Boolean) ? 'Tu crucigrama' : '(sin responder)'),
  lock(root, q) {
    const cells = crossCells(q.words);
    root.querySelectorAll('.cgrid input').forEach((inp) => {
      const x = cells.get(`${inp.dataset.r},${inp.dataset.c}`);
      inp.disabled = true;
      const ok = (q.cells[`${inp.dataset.r},${inp.dataset.c}`] ?? '') === x.ch;
      inp.classList.add(ok ? 'right' : 'wrong');
      if (!ok) inp.value = x.ch;
    });
  },
  reset() {},
};

export const TYPES = { text, vf: vfT, sort, label, cross };
