import { ri, pick, shuffle, mc, num } from './data.js';
import { at, line, real, strike, sk, ln, box, circ, dot, tx, arrow, person, stroke } from './sketch.js';

/* ---------- contenido: Matemáticas · Números enteros ---------- */
const m = (x) => (x < 0 ? `−${-x}` : String(x)); // con el signo menos de verdad
const s = (x) => (x < 0 ? `(−${-x})` : String(x)); // entre paréntesis si es negativo
const cmp = (a, b) => (a < b ? '<' : a > b ? '>' : '=');
const nz = (lo, hi) => {
  let x;
  do x = ri(lo, hi);
  while (x === 0);
  return x;
};
// Recta numérica de −10 a 10 con una marca opcional.
const axis = (d, mark, labels = []) =>
  ln(10, 40, 270, 40, d, { t: 0.8 }) +
  Array.from({ length: 21 }, (_, k) => ln(10 + k * 13, 34, 10 + k * 13, 46, d + 0.9 + k * 0.03, { t: 0.08 })).join('') +
  [-10, -5, 0, 5, 10].map((v, k) => tx(10 + (v + 10) * 13, 66, m(v), d + 1.2 + k * 0.1, { s: 13 })).join('') +
  labels.map(([v, c], k) => dot(10 + (v + 10) * 13, 40, 6, d + 2 + k * 0.5, c)).join('') +
  (mark === undefined ? '' : dot(10 + (mark + 10) * 13, 40, 6, d + 2, 'red'));

const SITUACIONES = [
  (n) => [`una temperatura de ${n} grados bajo cero`, -n],
  (n) => [`${n} grados sobre cero`, n],
  (n) => [`una deuda de ${n} euros`, -n],
  (n) => [`un ahorro de ${n} euros`, n],
  (n) => [`${n} metros de profundidad en el mar`, -n],
  (n) => [`${n} metros de altura sobre el nivel del mar`, n],
];

const ENT_LEVELS = [
  {
    title: 'Los números enteros y la recta',
    sub: 'Positivos, negativos y cero',
    lesson: [
      ['Los enteros', `<p>Los <span class="hl">números enteros</span> son los naturales (1, 2, 3…), sus <b>opuestos negativos</b> (−1, −2, −3…) y el <b>cero</b>. Sirven para contar «a un lado y a otro»: temperaturas sobre y bajo cero, plantas sobre y bajo la calle, dinero que tienes y que debes.</p>`],
      ['La recta numérica', `<p>Se colocan sobre una recta con el cero en medio: los positivos a la <b>derecha</b> y los negativos a la <b>izquierda</b>. Cuanto más a la derecha, <span class="hl">mayor</span> es el número.</p><div class="ex">−5 &lt; −2 &lt; 0 &lt; 3</div>`],
      ['Error típico', `<div class="ex warn">«−9 es mayor que −2 porque 9 es mayor que 2»</div><p>Con los negativos es al revés: −9 está más a la izquierda, así que <b>−9 &lt; −2</b>. Cuanto mayor es el número sin signo, más pequeño es el negativo.</p>`],
    ],
    gens: [
      () => {
        const [t, v] = pick(SITUACIONES)(ri(2, 30));
        return num(`¿Qué número entero representa ${t}?`, v, `${t[0].toUpperCase() + t.slice(1)} se escribe ${m(v)}: ${v < 0 ? 'va con signo menos porque está por debajo de cero o es algo que se debe' : 'es positivo'}.`, 'Si es negativo, usa el botón ±.');
      },
      () => {
        const xs = shuffle(Array.from({ length: 19 }, (_, i) => i - 9)).slice(0, 4),
          big = Math.max(...xs);
        return mc('¿Cuál de estos números es el mayor?', m(big), xs.filter((x) => x !== big).map(m), `En la recta, ${m(big)} es el que está más a la derecha.`);
      },
      () => {
        const xs = shuffle(Array.from({ length: 19 }, (_, i) => i - 9)).slice(0, 4),
          small = Math.min(...xs);
        return mc('¿Cuál de estos números es el menor?', m(small), xs.filter((x) => x !== small).map(m), `En la recta, ${m(small)} es el que está más a la izquierda.`);
      },
      () => mc('¿Cuál de estos números es un número entero?', m(-nz(1, 20)), ['2,5', '3/4', '0,75'], 'Un entero no tiene parte decimal ni es una fracción.'),
      () => {
        const a = ri(-8, 4),
          k = ri(2, 6),
          right = Math.random() < 0.5;
        return num(`En la recta numérica, ¿qué número está a ${k} unidades a la ${right ? 'derecha' : 'izquierda'} de ${s(a)}?`, right ? a + k : a - k, `Desde ${m(a)}, ${k} pasos a la ${right ? 'derecha suman' : 'izquierda restan'}: ${m(right ? a + k : a - k)}.`, 'Si es negativo, usa el botón ±.');
      },
    ],
  },
  {
    title: 'Valor absoluto, opuesto y orden',
    sub: 'Comparar y ordenar enteros',
    lesson: [
      ['Valor absoluto', `<p>El <span class="hl">valor absoluto</span> de un número es su <b>distancia al cero</b>, sin signo. Se escribe con barras:</p><div class="ex">|−7| = 7 &nbsp;·&nbsp; |4| = 4 &nbsp;·&nbsp; |0| = 0</div>`],
      ['Opuesto', `<p>El <span class="hl">opuesto</span> de un número es el que está a la misma distancia del cero, pero al otro lado: tiene distinto signo.</p><div class="ex">opuesto de 5 = −5 &nbsp;·&nbsp; opuesto de −3 = 3</div>`],
      ['Ordenar', `<p>Para ordenar de menor a mayor: primero los negativos (el que tiene mayor valor absoluto es el menor), luego el cero y después los positivos.</p><div class="ex">−8 &lt; −3 &lt; 0 &lt; 2 &lt; 6</div>`],
      ['Error típico', `<div class="ex warn">|−7| = −7</div><p>El valor absoluto <b>nunca es negativo</b>: |−7| = 7.</p>`],
    ],
    gens: [
      () => {
        const n = nz(-20, 20);
        return num(`Escribe el valor absoluto de ${s(n)}`, Math.abs(n), `|${m(n)}| = ${Math.abs(n)}: es la distancia de ${m(n)} al cero.`);
      },
      () => {
        const n = nz(-20, 20);
        return num(`Escribe el opuesto de ${s(n)}`, -n, `El opuesto de ${m(n)} es ${m(-n)}: misma distancia al cero, lado contrario.`, 'Si es negativo, usa el botón ±.');
      },
      () => {
        const xs = shuffle(Array.from({ length: 17 }, (_, i) => i - 8)).slice(0, 4),
          sorted = [...xs].sort((a, b) => a - b),
          text = (l) => l.map(m).join(' < ');
        const wrongs = [text([...sorted].reverse()), text([...sorted].sort((a, b) => Math.abs(a) - Math.abs(b)))];
        let tries = 0;
        while (wrongs.length < 4 && tries++ < 20) wrongs.push(text(shuffle(sorted)));
        return mc('¿Cuál de estas listas está ordenada de menor a mayor?', text(sorted), wrongs, `De menor a mayor, empezando por los negativos: ${text(sorted)}.`);
      },
      () => {
        const [a, b] = [ri(-9, 9), ri(-9, 9)];
        return mc(`¿Qué signo va entre ${s(a)} y ${s(b)}?`, cmp(a, b), ['<', '>', '='], `${m(a)} ${cmp(a, b)} ${m(b)}: se mira cuál está más a la derecha en la recta.`);
      },
      () => {
        const a = ri(-9, -2),
          b = ri(2, 9);
        return num(`¿Cuántos números enteros hay entre ${s(a)} y ${b}? (sin contar ${s(a)} ni ${b})`, b - a - 1, `Desde ${m(a + 1)} hasta ${b - 1} hay ${b - a - 1} números (el cero incluido).`);
      },
    ],
  },
  {
    title: 'Suma y resta de enteros',
    sub: 'Avanzar y retroceder en la recta',
    lesson: [
      ['Mismo signo', `<p>Si los dos números tienen el <b>mismo signo</b>, se <b>suman</b> sus valores absolutos y se deja el signo:</p><div class="ex">(−4) + (−3) = −7 &nbsp;·&nbsp; 4 + 3 = 7</div>`],
      ['Distinto signo', `<p>Si tienen <b>distinto signo</b>, se <b>restan</b> los valores absolutos y se pone el signo del que tiene <b>mayor</b> valor absoluto:</p><div class="ex">(−9) + 5 = −4 &nbsp;·&nbsp; (−3) + 8 = 5</div>`],
      ['Restar es sumar el opuesto', `<p>Restar un número es sumar su <b>opuesto</b>:</p><div class="ex">5 − (−3) = 5 + 3 = 8 &nbsp;·&nbsp; (−2) − 4 = (−2) + (−4) = −6</div>`],
      ['Error típico', `<div class="ex warn">5 − (−3) = 2</div><p>Restar un negativo es <b>sumar</b>: 5 − (−3) = 5 + 3 = 8. El «menos por menos» se convierte en «más».</p>`],
    ],
    gens: [
      () => {
        const a = nz(-12, 12),
          b = nz(-12, 12);
        return num(`Calcula ${s(a)} + ${s(b)}`, a + b, `${s(a)} + ${s(b)} = ${m(a + b)}.`, 'Si es negativo, usa el botón ±.');
      },
      () => {
        const a = nz(-12, 12),
          b = nz(-12, 12);
        return num(`Calcula ${s(a)} − ${s(b)}`, a - b, `Restar ${m(b)} es sumar su opuesto ${m(-b)}: ${s(a)} + ${s(-b)} = ${m(a - b)}.`, 'Si es negativo, usa el botón ±.');
      },
      () => {
        const [a, b, c, d] = [ri(2, 15), ri(2, 15), ri(2, 15), ri(2, 15)];
        return num(`Calcula ${a} − ${b} + ${c} − ${d}`, a - b + c - d, `De izquierda a derecha: ${a} − ${b} = ${a - b}; ${m(a - b)} + ${c} = ${m(a - b + c)}; ${m(a - b + c)} − ${d} = ${m(a - b + c - d)}.`, 'Si es negativo, usa el botón ±.');
      },
      () => {
        const a = nz(-10, 10),
          b = nz(-10, 10),
          r = a - b;
        return mc(`¿Cuánto vale ${s(a)} − ${s(b)}?`, m(r), [m(a + b), m(-r), m(b - a === r ? r + 2 : b - a)], `${s(a)} − ${s(b)} = ${s(a)} + ${s(-b)} = ${m(r)}.`);
      },
      () => {
        const a = ri(-9, 5),
          b = ri(2, 9),
          up = Math.random() < 0.5;
        return num(`La temperatura era de ${s(a)} °C y ha ${up ? 'subido' : 'bajado'} ${b} grados. ¿Cuál es la temperatura ahora?`, up ? a + b : a - b, `${s(a)} ${up ? '+' : '−'} ${b} = ${m(up ? a + b : a - b)} °C.`, 'Si es negativo, usa el botón ±.');
      },
    ],
  },
  {
    title: 'Multiplicación y división de enteros',
    sub: 'La regla de los signos',
    lesson: [
      ['La regla de los signos', `<div class="tbl"><table><tr><th>·  o  :</th><th>+</th><th>−</th></tr><tr><th>+</th><td>+</td><td>−</td></tr><tr><th>−</th><td>−</td><td>+</td></tr></table></div><p>Signos <b>iguales</b>, resultado <b>positivo</b>. Signos <b>distintos</b>, resultado <b>negativo</b>. Después se multiplican o dividen los valores absolutos.</p>`],
      ['Ejemplos', `<div class="ex">(−4) · 3 = −12 &nbsp;·&nbsp; (−4) · (−3) = 12<br>(−20) : 5 = −4 &nbsp;·&nbsp; (−20) : (−5) = 4</div>`],
      ['Varios factores', `<p>Con varios factores, mira cuántos son <b>negativos</b>: si son un número <b>par</b>, el resultado es positivo; si es <b>impar</b>, negativo.</p>`],
      ['Error típico', `<div class="ex warn">(−3) · (−5) = −15</div><p>Menos por menos da <b>más</b>: (−3) · (−5) = 15.</p>`],
    ],
    gens: [
      () => {
        const a = nz(-9, 9),
          b = nz(-9, 9);
        return num(`Calcula ${s(a)} · ${s(b)}`, a * b, `${a < 0 === b < 0 ? 'Signos iguales: positivo' : 'Signos distintos: negativo'}. ${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(a * b)}, así que ${m(a * b)}.`, 'Si es negativo, usa el botón ±.');
      },
      () => {
        const d = nz(-9, 9),
          q = nz(-9, 9);
        return num(`Calcula ${s(d * q)} : ${s(d)}`, q, `${Math.abs(d * q)} : ${Math.abs(d)} = ${Math.abs(q)}, y ${(d * q < 0) === (d < 0) ? 'signos iguales dan positivo' : 'signos distintos dan negativo'}: ${m(q)}.`, 'Si es negativo, usa el botón ±.');
      },
      () => {
        const [a, b, c] = [nz(-5, 5), nz(-5, 5), nz(-5, 5)];
        return num(`Calcula ${s(a)} · ${s(b)} · ${s(c)}`, a * b * c, `${s(a)} · ${s(b)} = ${m(a * b)} y ${s(a * b)} · ${s(c)} = ${m(a * b * c)}.`, 'Si es negativo, usa el botón ±.');
      },
      () => {
        const [a, b] = [nz(-9, 9), nz(-9, 9)],
          r = a * b;
        return mc(`¿Cuál es el signo de ${s(a)} · ${s(b)}?`, r > 0 ? 'Positivo' : 'Negativo', ['Positivo', 'Negativo'], r > 0 ? 'Signos iguales dan positivo.' : 'Signos distintos dan negativo.');
      },
      () => {
        const n = ri(2, 5),
          list = Array.from({ length: n }, () => nz(-4, 4)),
          neg = list.filter((x) => x < 0).length;
        return mc(`Multiplicamos ${list.map(s).join(' · ')}. ¿El resultado es positivo o negativo?`, neg % 2 ? 'Negativo' : 'Positivo', ['Positivo', 'Negativo'], `Hay ${neg} factores negativos: ${neg % 2 ? 'impar, el resultado es negativo' : 'par, el resultado es positivo'}.`);
      },
    ],
  },
  {
    title: 'Operaciones combinadas con enteros',
    sub: 'Paréntesis, jerarquía y signos',
    lesson: [
      ['El orden de siempre', `<p>Se mantiene la jerarquía: <b>1.</b> paréntesis, <b>2.</b> multiplicaciones y divisiones, <b>3.</b> sumas y restas. Las operaciones del mismo nivel, de izquierda a derecha.</p><div class="ex">3 + (−2) · 4 = 3 + (−8) = −5</div>`],
      ['Paréntesis con signo', `<p>Primero se resuelve lo de dentro del paréntesis y después se aplica la operación de fuera:</p><div class="ex">(−3) · (5 − 8) = (−3) · (−3) = 9</div>`],
      ['Error típico', `<div class="ex warn">3 + (−2) · 4 = 1 · 4 = 4</div><p>Primero se multiplica: (−2) · 4 = −8. Después, 3 + (−8) = −5.</p>`],
    ],
    gens: [
      () => {
        const a = ri(2, 9),
          b = nz(-6, 6),
          c = nz(-6, 6);
        return num(`Calcula ${a} + ${s(b)} · ${s(c)}`, a + b * c, `Primero la multiplicación: ${s(b)} · ${s(c)} = ${m(b * c)}. Después: ${a} + ${s(b * c)} = ${m(a + b * c)}.`, 'Si es negativo, usa el botón ±.');
      },
      () => {
        const a = nz(-6, 6),
          b = ri(2, 9),
          c = ri(2, 9),
          d = nz(-6, 6);
        return num(`Calcula ${s(a)} · (${b} − ${c}) + ${s(d)}`, a * (b - c) + d, `Dentro del paréntesis: ${b} − ${c} = ${m(b - c)}. Luego ${s(a)} · ${s(b - c)} = ${m(a * (b - c))} y ${m(a * (b - c))} + ${s(d)} = ${m(a * (b - c) + d)}.`, 'Si es negativo, usa el botón ±.');
      },
      () => {
        const q = nz(-6, 6),
          d = nz(-6, 6),
          e = nz(-9, 9);
        return num(`Calcula ${s(q * d)} : ${s(d)} + ${s(e)}`, q + e, `Primero la división: ${s(q * d)} : ${s(d)} = ${m(q)}. Después: ${s(q)} + ${s(e)} = ${m(q + e)}.`, 'Si es negativo, usa el botón ±.');
      },
      () => {
        const [a, b, c] = [ri(2, 9), nz(-5, 5), nz(-5, 5)],
          good = a + b * c,
          bad = (a + b) * c;
        return mc(`¿Cuánto vale ${a} + ${s(b)} · ${s(c)}?`, m(good), [m(bad === good ? bad + 1 : bad), m(-good === good ? 1 : -good), m(a - b * c === good ? good + 2 : a - b * c)], `Se multiplica antes de sumar: ${s(b)} · ${s(c)} = ${m(b * c)} y ${a} + ${s(b * c)} = ${m(good)}.`);
      },
      () => {
        const a = nz(-6, 6),
          b = nz(-6, 6),
          c = ri(2, 9);
        return num(`Calcula (${s(a)} + ${s(b)}) · ${c}`, (a + b) * c, `Primero el paréntesis: ${s(a)} + ${s(b)} = ${m(a + b)}. Después: ${s(a + b)} · ${c} = ${m((a + b) * c)}.`, 'Si es negativo, usa el botón ±.');
      },
    ],
  },
  {
    title: 'Problemas con enteros',
    sub: 'Temperaturas, alturas, dinero y plantas',
    lesson: [
      ['Traducir al lenguaje de los enteros', `<p>Los enteros aparecen cuando algo puede estar «por encima» o «por debajo» de un punto de referencia: el cero. Primero decide qué es positivo y qué es negativo, y después opera.</p><div class="tbl"><table><tr><th>Situación</th><th>Número</th></tr><tr><td>5 °C bajo cero</td><td>−5</td></tr><tr><td>Planta 3 del sótano</td><td>−3</td></tr><tr><td>Debo 12 €</td><td>−12</td></tr><tr><td>Altitud 800 m</td><td>+800</td></tr></table></div>`],
      ['Diferencia entre dos valores', `<p>Para saber <b>cuánto hay entre</b> dos valores, se resta el mayor menos el menor:</p><div class="ex">Mínima −4 °C, máxima 9 °C → 9 − (−4) = 13 grados de diferencia</div>`],
      ['Error típico', `<div class="ex warn">De −4 °C a 9 °C hay 5 grados</div><p>Esa cuenta olvida el cero: de −4 a 0 hay 4 grados y de 0 a 9 hay 9, en total <b>13</b>.</p>`],
    ],
    gens: [
      () => {
        const a = ri(2, 12),
          b = ri(3, 25);
        return num(`La temperatura mínima fue de ${s(-a)} °C y la máxima de ${b} °C. ¿Cuántos grados de diferencia hubo?`, a + b, `Se resta el mayor menos el menor: ${b} − ${s(-a)} = ${a + b} grados.`);
      },
      () => {
        const d = ri(15, 60),
          u = ri(5, 14);
        return num(`Un submarino está a ${s(-d)} m. Sube ${u} metros. ¿A qué altura queda respecto al nivel del mar?`, -d + u, `${s(-d)} + ${u} = ${m(-d + u)} m.`, 'Si es negativo, usa el botón ±.');
      },
      () => {
        const p = ri(-3, 4),
          k = ri(2, 6),
          j = ri(2, 6);
        return num(`Un ascensor está en la planta ${s(p)}, sube ${k} plantas y después baja ${j}. ¿En qué planta está ahora?`, p + k - j, `${s(p)} + ${k} − ${j} = ${m(p + k - j)}.`, 'Si es negativo, usa el botón ±.');
      },
      () => {
        const t = ri(-3, 6),
          a = ri(2, 4),
          h = ri(2, 5);
        return num(`La temperatura baja ${a} grados cada hora. Si ahora son ${s(t)} °C, ¿cuántos grados habrá dentro de ${h} horas?`, t - a * h, `Bajan ${a} · ${h} = ${a * h} grados: ${s(t)} − ${a * h} = ${m(t - a * h)} °C.`, 'Si es negativo, usa el botón ±.');
      },
      () => {
        const a = ri(10, 60),
          b = ri(10, 60),
          c = a === b ? b + 7 : b;
        return num(`Marta tiene ${a} euros y debe ${c} euros a una amiga. Si le paga, ¿con cuánto dinero se queda? (un resultado negativo significa que aún debe)`, a - c, `${a} − ${c} = ${m(a - c)} euros.`, 'Si es negativo, usa el botón ±.');
      },
    ],
  },
];

/* ---------- relatos ---------- */
const lift = (x, f, d, label) => box(x, f, 46, 16, d, { t: 0.3 }) + tx(x + 23, f + 12, label, d + 0.3, { s: 12 });
const ENT_ANIMS = [
  [ // 1 · Los enteros y la recta — «El ascensor del edificio de Leo»
    { say: 'Leo vive en un edificio con ascensor. Hay plantas sobre la calle y plantas bajo la calle, en el sótano. La calle es la planta cero.',
      show: sk(280, 130, person(30, 20, 0, 'Leo') + lift(120, 10, 0.8, '2') + lift(120, 30, 1, '1') + lift(120, 50, 1.2, '0') + lift(120, 70, 1.4, '−1') + lift(120, 90, 1.6, '−2')) },
    { say: 'Las plantas sobre la calle son números positivos. Las del sótano son negativos, con un signo menos. El cero separa los dos lados.',
      show: line(at(0, '… −3, −2, −1, <b>0</b>, 1, 2, 3 …'), 'big') + line(at(1.6, 'bajo cero ← → sobre cero')) },
    { say: '¿Qué número entero representa esta situación?', ask: () => ENT_LEVELS[0].gens[0]() },
    { say: 'En la recta numérica, cuanto más a la derecha, mayor. Menos dos está a la derecha de menos nueve, así que menos dos es mayor.',
      show: sk(290, 80, axis(0, undefined, [[-9, 'blue'], [-2, 'red']])) + line(at(3.2, '−9 &lt; −2', 'good')) },
    { say: '¿Cuál es el mayor?', ask: () => ENT_LEVELS[0].gens[1]() },
    { say: 'Un vecino dice que menos nueve es mayor que menos dos, porque nueve es mayor que dos. ¡No! Con los negativos pasa al revés.',
      show: line(strike(at(0, '−9 &gt; −2', 'bad'), 1.2)) + line(at(2, '−9 está más a la izquierda', 'good')) },
    { say: 'En la vida real: el termómetro marca temperaturas sobre cero y bajo cero. Menos cinco grados es más frío que menos dos.',
      show: real('el termómetro', sk(240, 110, box(100, 6, 24, 90, 0, { t: 0.6 }) + circ(112, 100, 12, 0.8, { c: 'red' }) + tx(60, 40, '0°', 1.2, { s: 14 }) + tx(60, 76, '−5°', 1.6, { s: 14 }) + tx(170, 76, 'más frío', 2, { s: 13, c: 'blue' }))) },
    { say: 'Elige el menor.', ask: () => ENT_LEVELS[0].gens[2]() },
  ],
  [ // 2 · Valor absoluto, opuesto y orden — «El espejo del cero»
    { say: 'Imagina un espejo colocado en el cero de la recta. Cada número se ve reflejado al otro lado, a la misma distancia.',
      show: sk(290, 80, axis(0, undefined, [[-4, 'blue'], [4, 'red']]) + ln(140, 10, 140, 70, 3, { c: 'red', t: 0.3 })) },
    { say: 'El reflejo de un número es su opuesto. El opuesto de cinco es menos cinco, y el opuesto de menos tres es tres.',
      show: line(at(0, 'opuesto de 5 → <b>−5</b>')) + line(at(1.2, 'opuesto de −3 → <b>3</b>')) },
    { say: 'Escribe el opuesto.', ask: () => ENT_LEVELS[1].gens[1]() },
    { say: 'La distancia al cero es el valor absoluto, y nunca es negativa. El valor absoluto de menos siete es siete.',
      show: line(at(0, '|−7| = <b>7</b>'), 'big') + line(strike(at(1.4, '|−7| = −7', 'bad'), 2.4)) },
    { say: 'Calcula el valor absoluto.', ask: () => ENT_LEVELS[1].gens[0]() },
    { say: 'Para ordenar de menor a mayor, primero van los negativos, empezando por el que está más lejos del cero, después el cero y al final los positivos.',
      show: line(at(0, '−8 &lt; −3 &lt; 0 &lt; 2 &lt; 6'), 'big') },
    { say: 'En la vida real: en un juego de cartas, la puntuación de menos diez es peor que la de menos dos, aunque diez sea mayor que dos.',
      show: real('las puntuaciones', sk(240, 90, box(30, 20, 70, 50, 0, { t: 0.5 }) + tx(65, 52, '−10', 0.6, { s: 18 }) + box(130, 20, 70, 50, 1, { t: 0.5 }) + tx(165, 52, '−2', 1.6, { s: 18 }) + tx(165, 86, 'gana', 2.2, { s: 13, c: 'green' }))) },
    { say: '¿Qué lista está bien ordenada?', ask: () => ENT_LEVELS[1].gens[2]() },
  ],
  [ // 3 · Suma y resta — «Las fichas de Ana»
    { say: 'Ana juega con fichas: las azules valen más uno y las rojas valen menos uno. Una ficha azul y una roja se anulan: suman cero.',
      show: sk(280, 100, person(26, 16, 0, 'Ana') + dot(110, 40, 12, 0.8, 'blue') + dot(150, 40, 12, 1, 'red') + tx(130, 90, '+1 y −1 = 0', 1.8, { s: 15 })) },
    { say: 'Con cinco fichas azules y tres rojas, las tres parejas se anulan y quedan dos azules. Cinco más menos tres es dos.',
      show: line(at(0, '5 + (−3) = <b>2</b>'), 'big') + line(at(1.4, 'se anulan 3 parejas', 'good')) },
    { say: 'Calcula esta suma.', ask: () => ENT_LEVELS[2].gens[0]() },
    { say: 'Quitar fichas rojas es lo mismo que añadir azules. Restar un negativo es sumar: cinco menos menos tres es ocho.',
      show: line(at(0, '5 − (−3) = 5 + 3 = <b>8</b>'), 'big') + line(strike(at(1.4, '5 − (−3) = 2', 'bad'), 2.4)) },
    { say: 'Calcula esta resta.', ask: () => ENT_LEVELS[2].gens[1]() },
    { say: 'Con varias operaciones seguidas, se hacen de izquierda a derecha. Siete menos doce da menos cinco; más cinco da cero.',
      show: line(at(0, '7 − 12 + 5')) + line(at(1.2, '= −5 + 5 = <b>0</b>'), 'big') },
    { say: 'En la vida real: si la temperatura es de menos cuatro grados y sube seis, el termómetro marca dos grados sobre cero.',
      show: real('la temperatura', sk(240, 100, tx(60, 50, '−4°', 0, { s: 22 }) + arrow(100, 46, 150, 46, 0.8, 'red') + tx(125, 36, '+6', 1.2, { s: 15, c: 'red' }) + tx(190, 50, '2°', 1.6, { s: 22, c: 'green' }))) },
    { say: '¿Cuál es la temperatura?', ask: () => ENT_LEVELS[2].gens[4]() },
  ],
  [ // 4 · Producto y cociente — «El buzo Marco»
    { say: 'El buzo Marco baja tres metros cada minuto. Bajar es negativo. Después de cuatro minutos habrá bajado cuatro veces menos tres.',
      show: sk(280, 120, person(30, 12, 0, 'Marco') + ln(120, 10, 120, 110, 0.8, { c: 'blue', t: 0.4 }) + arrow(150, 20, 150, 100, 1.4, 'red') + tx(200, 64, '4 · (−3)', 2, { s: 16 })) },
    { say: 'Signos distintos dan resultado negativo: cuatro por menos tres es menos doce. Marco está doce metros por debajo de donde empezó.',
      show: line(at(0, '4 · (−3) = <b>−12</b>'), 'big') + line(at(1.4, 'signos distintos → negativo', 'good')) },
    { say: 'Calcula este producto.', ask: () => ENT_LEVELS[3].gens[0]() },
    { say: 'Si el vídeo se pone al revés, es como multiplicar por menos uno: bajar tres metros, rebobinado, es subir tres. Menos por menos da más.',
      show: line(at(0, '(−4) · (−3) = <b>12</b>'), 'big') + line(at(1.4, 'signos iguales → positivo', 'good')) },
    { say: '¿Qué signo tiene el resultado?', ask: () => ENT_LEVELS[3].gens[3]() },
    { say: 'Con la división es igual: signos iguales dan positivo y signos distintos, negativo. Menos veinte entre cinco es menos cuatro.',
      show: line(at(0, '(−20) : 5 = <b>−4</b>'), 'big') + line(at(1.4, '(−20) : (−5) = <b>4</b>')) },
    { say: 'En la vida real: si debes tres euros a cada uno de cuatro amigos, debes doce euros en total: cuatro por menos tres.',
      show: real('las deudas', sk(240, 100, person(30, 12, 0, 'Tú') + Array.from({ length: 4 }, (_, k) => dot(120 + k * 28, 30, 9, 0.8 + k * 0.3, 'red')).join('') + tx(170, 84, '4 · (−3) = −12 €', 2, { s: 15 }))) },
    { say: 'Calcula este cociente.', ask: () => ENT_LEVELS[3].gens[1]() },
  ],
  [ // 5 · Combinadas — «La tienda de Rosa»
    { say: 'Rosa lleva una tienda. Un día tiene tres euros en caja y dos clientes le dejan a deber, cada uno, cuatro euros. ¿Cómo quedan las cuentas?',
      show: sk(280, 110, person(30, 16, 0, 'Rosa') + box(100, 30, 150, 50, 0.8, { t: 0.6 }) + tx(175, 62, '3 + 2 · (−4)', 1.8, { s: 18 })) },
    { say: 'Primero se hace la multiplicación: dos por menos cuatro es menos ocho. Después se suma: tres más menos ocho da menos cinco.',
      show: line(at(0, '3 + 2 · (−4)')) + line(at(1, '= 3 + (−8)')) + line(at(2, '= <b>−5</b>'), 'big') },
    { say: 'Calcula una operación así.', ask: () => ENT_LEVELS[4].gens[0]() },
    { say: 'Un compañero hace la suma primero y se equivoca. La jerarquía manda: primero los paréntesis, luego multiplicar y dividir, y al final sumar y restar.',
      show: line(strike(at(0, '(3 + 2) · (−4) = −20', 'bad'), 1.4)) + line(at(2.4, '3 + 2 · (−4) = −5', 'good')) },
    { say: '¿Cuánto vale?', ask: () => ENT_LEVELS[4].gens[3]() },
    { say: 'Si hay un paréntesis, se resuelve primero. Menos tres más cinco, entre paréntesis, es dos; y dos por cuatro es ocho.',
      show: line(at(0, '((−3) + 5) · 4')) + line(at(1.2, '= 2 · 4 = <b>8</b>'), 'big') },
    { say: 'Calcula con el paréntesis.', ask: () => ENT_LEVELS[4].gens[4]() },
    { say: 'En la vida real: la calculadora del móvil también respeta la jerarquía. Si escribes tres más dos por cuatro, te da once, no veinte.',
      show: real('la calculadora', sk(240, 100, box(70, 6, 90, 88, 0, { t: 0.6 }) + tx(115, 34, '3+2×4', 0.8, { s: 15 }) + tx(115, 66, '= 11', 1.4, { s: 20, c: 'green' }))) },
    { say: 'Una última operación.', ask: () => ENT_LEVELS[4].gens[1]() },
  ],
  [ // 6 · Problemas — «Un día de montaña»
    { say: 'Un grupo de amigos sube a la montaña. Por la mañana, en el valle, el termómetro marca bajo cero. En la cima, hace menos frío de lo que esperaban.',
      show: sk(290, 120, stroke('M10 100L100 30L140 60L200 20L280 100Z', 0, { t: 0.8 }) + tx(60, 112, '−4 °C', 1, { s: 13, c: 'blue' }) + tx(200, 14, '9 °C', 1.6, { s: 13, c: 'red' })) },
    { say: 'Para saber la diferencia, se resta el mayor menos el menor: nueve menos menos cuatro. Restar un negativo es sumar, así que hay trece grados.',
      show: line(at(0, '9 − (−4) = 9 + 4 = <b>13</b>'), 'big') + line(strike(at(1.4, 'no son 5 grados', 'bad'), 2.4)) },
    { say: '¿Cuántos grados de diferencia hubo?', ask: () => ENT_LEVELS[5].gens[0]() },
    { say: 'Al bajar, la temperatura cae unos grados cada hora. Con el número de horas se multiplica: bajar es negativo.',
      show: line(at(0, 'baja 2 °C cada hora')) + line(at(1.2, '3 horas → 3 · (−2) = −6'), 'big') },
    { say: 'Calcula la temperatura.', ask: () => ENT_LEVELS[5].gens[3]() },
    { say: 'Después visitan una cueva en el valle. El ascensor del refugio está en una planta, sube unas plantas y baja otras. Se suman y se restan.',
      show: line(at(0, 'planta −2, sube 5, baja 3')) + line(at(1.2, '−2 + 5 − 3 = <b>0</b>'), 'big') },
    { say: 'En la vida real: los montañeros miran la altitud y la temperatura antes de salir. Cada cien metros que se sube, la temperatura baja unos grados.',
      show: real('la montaña', sk(240, 110, stroke('M20 100L110 20L200 100Z', 0, { t: 0.8 }) + tx(120, 14, '+100 m → −1 °C', 1.2, { s: 13, c: 'red' }))) },
    { say: '¿En qué planta está?', ask: () => ENT_LEVELS[5].gens[2]() },
  ],
];
export { ENT_LEVELS, ENT_ANIMS };
