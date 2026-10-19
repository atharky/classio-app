import { ri, pick, shuffle, P, mc, num } from './data.js';
import { at, seq, line, real, strike, sk, ln, box, circ, dot, tx, person } from './sketch.js';

/* ---------- contenido: Matemáticas · Divisibilidad ---------- */
export const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export const lcm = (a, b) => (a / gcd(a, b)) * b;
export const divisors = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
export const isPrime = (n) => n > 1 && divisors(n).length === 2;
export const factorize = (n) => {
  const out = [];
  for (let p = 2; n > 1; p++) {
    let e = 0;
    while (n % p === 0) {
      n /= p;
      e++;
    }
    if (e) out.push([p, e]);
  }
  return out;
};
const SUP = { 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶' };
// «2² · 3 · 5»: con exponentes (texto plano, para opciones) o repetidos («2 · 2 · 3 · 5»).
export const factStr = (n, pow = true) =>
  factorize(n)
    .map(([p, e]) => (pow ? (e > 1 ? `${p}${SUP[e]}` : `${p}`) : Array(e).fill(p).join(' · ')))
    .join(' · ');
const PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const COMPOSITES = [14, 15, 21, 22, 25, 26, 27, 33, 34, 35, 39, 49, 51, 55, 57, 63, 65, 69, 77, 81, 85, 87, 91, 93, 95];
const coprimePair = (lo, hi) => {
  let x, y;
  do {
    x = ri(lo, hi);
    y = ri(lo, hi);
  } while (x === y || gcd(x, y) !== 1);
  return [x, y];
};
const CRITERIA = {
  2: 'acaba en cifra par (0, 2, 4, 6 u 8)',
  3: 'la suma de sus cifras es múltiplo de 3',
  5: 'acaba en 0 o en 5',
  9: 'la suma de sus cifras es múltiplo de 9',
  10: 'acaba en 0',
  11: 'la suma de las cifras en lugar par menos la suma de las de lugar impar es 0 o múltiplo de 11',
};

const DIV_LEVELS = [
  {
    title: 'Múltiplos y divisores',
    sub: 'Qué son y cómo se encuentran',
    lesson: [
      ['Múltiplos', `<p>Los <span class="hl">múltiplos</span> de un número son los que salen al multiplicarlo por 1, 2, 3, 4…</p><div class="ex">Múltiplos de 6: 6, 12, 18, 24, 30…</div>`],
      ['Divisores', `<p>Un número es <span class="hl">divisor</span> de otro si lo divide de forma <b>exacta</b> (resto 0). Se buscan en parejas:</p><div class="ex">Divisores de 12: 1 y 12 · 2 y 6 · 3 y 4</div><p>Todos los números tienen como divisores al 1 y a sí mismos.</p>`],
      ['Dos caras de lo mismo', `<p>Si 24 = 6 · 4, entonces 24 es <b>múltiplo</b> de 6 y 6 es <b>divisor</b> de 24.</p>`],
      ['Error típico', `<div class="ex warn">«5 es múltiplo de 15»</div><p>Es al revés: <b>15 es múltiplo de 5</b>. Un divisor es siempre menor o igual que el número; un múltiplo, mayor o igual.</p>`],
    ],
    gens: [
      () => {
        const m = ri(3, 12),
          k = ri(4, 12);
        return num(`Escribe el múltiplo de ${m} que ocupa el lugar ${k}.`, m * k, `Se multiplica ${m} · ${k} = ${m * k}.`);
      },
      () => {
        const m = ri(3, 12),
          k = ri(3, 12),
          c = m * k;
        return mc(`¿Cuál de estos números es múltiplo de ${m}?`, String(c), [c + 1, c - 1, c + 2].map(String), `${c} = ${m} · ${k}, así que ${c} es múltiplo de ${m}.`);
      },
      () => {
        const n = pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 48, 60]),
          ds = divisors(n).filter((d) => d > 1 && d < n),
          d = pick(ds),
          bad = Array.from({ length: n }, (_, i) => i + 2).filter((x) => n % x !== 0 && x < n);
        return mc(`¿Cuál de estos números es divisor de ${n}?`, String(d), shuffle(bad).slice(0, 3).map(String), `${n} : ${d} = ${n / d}, división exacta: ${d} es divisor de ${n}.`);
      },
      () => {
        const n = pick([12, 16, 18, 20, 24, 28, 30, 36, 40, 42, 48, 50, 60]);
        return num(`¿Cuántos divisores tiene ${n}?`, divisors(n).length, `Los divisores de ${n} son ${divisors(n).join(', ')}: son ${divisors(n).length}.`);
      },
      () => {
        const n = ri(12, 60),
          yes = Math.random() < 0.5,
          d = yes ? pick(divisors(n).filter((x) => x > 1 && x < n).concat([2])) : pick([5, 7, 8, 9, 11].filter((x) => n % x)),
          real = n % d === 0;
        return mc(`¿Es ${d} un divisor de ${n}?`, real ? 'Sí' : 'No', ['Sí', 'No'], real ? `Sí: ${n} : ${d} = ${n / d}, sin resto.` : `No: ${n} : ${d} da ${Math.floor(n / d)} y sobra ${n % d}.`);
      },
    ],
  },
  {
    title: 'Criterios de divisibilidad',
    sub: 'Saber si un número se divide sin hacer la cuenta',
    lesson: [
      ['Los criterios', `<div class="tbl"><table><tr><th>Por</th><th>Un número es divisible si…</th></tr>${Object.entries(CRITERIA).map(([d, c]) => `<tr><td><b>${d}</b></td><td style="text-align:left">${c}</td></tr>`).join('')}</table></div>`],
      ['Ejemplos', `<div class="ex">348 → 3 + 4 + 8 = 15, múltiplo de 3 ✓ (no de 9)<br>720 → acaba en 0: divisible por 2, 5 y 10<br>2145 → (5 + 1) − (4 + 2) = 0 ✓ por 11</div>`],
      ['Error típico', `<div class="ex warn">«Un número que acaba en 3 es divisible por 3»</div><p>Para el 3 no importa la última cifra, sino la <b>suma de todas</b>: 13 acaba en 3 y no es divisible por 3.</p>`],
    ],
    gens: [
      () => {
        const d = pick([2, 3, 5, 9, 10, 11]),
          yes = Math.random() < 0.5,
          n = d * ri(12, 90) + (yes ? 0 : ri(1, d - 1)),
          ok = n % d === 0;
        return mc(`¿Es ${n} divisible por ${d}?`, ok ? 'Sí' : 'No', ['Sí', 'No'], `${ok ? 'Sí' : 'No'}: ${n} ${ok ? '' : 'no '}cumple el criterio (${CRITERIA[d]}).`);
      },
      () => {
        const d = pick([3, 9]),
          a = ri(1, 9) * 10 + ri(0, 9),
          best = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find((c) => Number(`${a}${c}`) % d === 0);
        return num(`¿Cuál es la menor cifra que puedes escribir en ${a}☐ para que el número sea divisible por ${d}?`, best, `La suma de las cifras de ${a}${best} es ${String(a).split('').reduce((s, c) => s + +c, 0) + best}, múltiplo de ${d}.`);
      },
      () => {
        const set = [2, 3, 5, 9, 10, 11];
        let n, hit;
        do {
          n = ri(100, 999);
          hit = set.filter((d) => n % d === 0);
        } while (hit.length !== 1);
        return mc(`¿Por cuál de estos números es divisible ${n}?`, String(hit[0]), shuffle(set.filter((d) => n % d)).slice(0, 3).map(String), `${n} cumple el criterio del ${hit[0]} (${CRITERIA[hit[0]]}) y de los otros no.`);
      },
      () => {
        const d = pick([2, 3, 5, 9, 10]);
        return mc(`¿Qué criterio permite saber si un número es divisible por ${d}?`, `Un número es divisible por ${d} si ${CRITERIA[d]}`, shuffle([2, 3, 5, 9, 10].filter((x) => x !== d)).slice(0, 3).map((x) => `Un número es divisible por ${d} si ${CRITERIA[x]}`), `El criterio del ${d}: ${CRITERIA[d]}.`);
      },
      () => {
        const n = ri(10, 99) * 10;
        return mc(`Un número acaba en 0, como ${n}. ¿Por cuáles de estos números es divisible seguro?`, 'Por 2, por 5 y por 10', ['Solo por 10', 'Por 3 y por 9', 'Por 2 y por 3'], 'Si acaba en 0 es par (÷ 2), acaba en 0 (÷ 5 y ÷ 10). Por 3 o por 9 depende de la suma de sus cifras.');
      },
    ],
  },
  {
    title: 'Números primos y compuestos',
    sub: 'Los que solo se dividen por 1 y por sí mismos',
    lesson: [
      ['Primos', `<p>Un número es <span class="hl">primo</span> si tiene exactamente <b>dos divisores</b>: el 1 y él mismo.</p><div class="ex">2, 3, 5, 7, 11, 13, 17, 19, 23…</div>`],
      ['Compuestos', `<p>Un número es <span class="hl">compuesto</span> si tiene <b>más de dos divisores</b>. El <b>1</b> no es primo ni compuesto: solo tiene un divisor.</p>`],
      ['Cómo saberlo', `<p>Prueba a dividir por los primos 2, 3, 5, 7… hasta que el cociente sea menor que el divisor. Si ninguna división es exacta, es primo.</p>`],
      ['Error típico', `<div class="ex warn">«Todos los números impares son primos»</div><p>El 9, el 15 o el 21 son impares y compuestos. Y el <b>2</b> es el único primo <b>par</b>.</p>`],
    ],
    gens: [
      () => mc('¿Cuál de estos números es primo?', String(pick(PRIMES)), shuffle(COMPOSITES).slice(0, 3).map(String), 'Un primo solo tiene dos divisores; los otros son compuestos.'),
      () => {
        const c = pick(COMPOSITES),
          d = divisors(c)[1];
        return mc('¿Cuál de estos números es compuesto?', String(c), shuffle(PRIMES).slice(0, 3).map(String), `${c} es compuesto porque ${c} : ${d} = ${c / d}: tiene más de dos divisores.`);
      },
      () => {
        const a = pick([10, 20, 30, 40]),
          b = a + pick([10, 20]);
        const n = Array.from({ length: b - a - 1 }, (_, i) => a + 1 + i).filter(isPrime);
        return num(`¿Cuántos números primos hay entre ${a} y ${b}? (sin contar ${a} ni ${b})`, n.length, `Son ${n.join(', ')}: ${n.length}.`);
      },
      () => {
        const n = ri(10, 90),
          p = Array.from({ length: 40 }, (_, i) => n + 1 + i).find(isPrime);
        return num(`¿Cuál es el menor número primo mayor que ${n}?`, p, `Se prueba ${n + 1}, ${n + 2}… hasta el primero que sea primo: ${p}.`);
      },
      () => {
        const n = pick([...PRIMES, ...COMPOSITES]),
          ok = isPrime(n);
        return mc(`¿Es ${n} un número primo?`, ok ? 'Sí' : 'No', ['Sí', 'No'], ok ? `Sí: solo se divide por 1 y por ${n}.` : `No: ${n} es divisible por ${divisors(n)[1]}.`);
      },
      () => mc('¿Cuál es el único número primo que es par?', '2', ['4', '1', '0'], 'Todos los demás pares se dividen por 2, así que tienen más de dos divisores.'),
    ],
  },
  {
    title: 'Descomposición en factores primos',
    sub: 'Escribir un número como producto de primos',
    lesson: [
      ['Factores primos', `<p>Todo número compuesto se puede escribir como un <span class="hl">producto de números primos</span>. Se divide una y otra vez por el primo más pequeño que pueda:</p><div class="ex">60 : 2 = 30 · 30 : 2 = 15 · 15 : 3 = 5 · 5 : 5 = 1<br>60 = 2 · 2 · 3 · 5 = ${P(2, 2)} · 3 · 5</div>`],
      ['Con potencias', `<p>Los factores repetidos se escriben con exponente. La descomposición es <b>única</b>: cada número tiene solo una.</p>`],
      ['Error típico', `<div class="ex warn">60 = 4 · 3 · 5</div><p>4 no es primo: se puede seguir (4 = 2 · 2). Todos los factores tienen que ser <b>primos</b>.</p>`],
    ],
    gens: [
      () => {
        const n = pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 60, 72, 84, 90, 100]),
          f = factorize(n);
        const wrong = [
          factStr(n, false).replace(/^2 · 2/, '4'),
          factorize(n + 6).length > 0 ? factStr(n + 6) : '',
          f.map(([p, e]) => `${p}${SUP[e + 1] ?? ''}`).join(' · '),
        ].filter((w) => w && w !== factStr(n) && w !== factStr(n, false));
        return mc(`¿Cuál es la descomposición en factores primos de ${n}?`, factStr(n), wrong.concat([`${n} · 1`]), `${n} = ${factStr(n, false)} = ${factStr(n)}.`);
      },
      () => {
        const n = pick([30, 42, 66, 70, 90, 105, 126, 150, 220, 231]);
        return num(`¿Cuál es el mayor factor primo de ${n}?`, Math.max(...factorize(n).map((f) => f[0])), `${n} = ${factStr(n)}; el mayor es ${Math.max(...factorize(n).map((f) => f[0]))}.`);
      },
      () => {
        const n = pick([24, 36, 40, 54, 56, 72, 84, 90, 100, 108]);
        return num(`Calcula el número cuya descomposición es ${factStr(n)}.`, n, `Se multiplica: ${factStr(n, false)} = ${n}.`);
      },
      () => {
        const n = pick([30, 36, 60, 72, 84, 90, 100, 120, 180]);
        return num(`¿Cuántos factores primos distintos tiene ${n}?`, factorize(n).length, `${n} = ${factStr(n)}: los primos distintos son ${factorize(n).map((f) => f[0]).join(', ')}.`);
      },
      () => {
        const n = pick([12, 18, 24, 30, 36, 48, 60, 72, 90, 100]);
        return num(`Al descomponer ${n} en factores primos, ¿cuántos factores hay en total, contando los repetidos?`, factorize(n).reduce((s, f) => s + f[1], 0), `${n} = ${factStr(n, false)}: son ${factorize(n).reduce((s, f) => s + f[1], 0)} factores.`);
      },
    ],
  },
  {
    title: 'Máximo común divisor',
    sub: 'El divisor más grande que tienen en común',
    lesson: [
      ['¿Qué es?', `<p>El <span class="hl">máximo común divisor</span> (m.c.d.) de dos números es el <b>mayor</b> número que divide a los dos.</p><div class="ex">Divisores de 12: 1, 2, 3, 4, 6, 12<br>Divisores de 18: 1, 2, 3, 6, 9, 18<br>Comunes: 1, 2, 3, 6 → m.c.d.(12, 18) = <b>6</b></div>`],
      ['Con factores primos', `<p>Se descomponen los números y se multiplican los factores primos <b>comunes</b>, con el <b>menor</b> exponente.</p><div class="ex">12 = ${P(2, 2)} · 3 · 18 = 2 · ${P(3, 2)} → m.c.d. = 2 · 3 = 6</div>`],
      ['¿Para qué sirve?', `<p>Para <b>repartir en partes iguales sin que sobre nada</b>: el m.c.d. da el mayor número de grupos posible.</p>`],
      ['Error típico', `<div class="ex warn">m.c.d.(12, 18) = 36</div><p>36 es el <b>mínimo común múltiplo</b>. El m.c.d. es siempre menor o igual que el más pequeño de los números.</p>`],
    ],
    gens: [
      () => {
        const g = ri(2, 12),
          [x, y] = coprimePair(2, 9);
        return num(`Calcula el m.c.d. de ${g * x} y ${g * y}`, g, `Los dos números son múltiplos de ${g} (${g * x} = ${g} · ${x} y ${g * y} = ${g} · ${y}) y ${x} e ${y} no tienen más divisores comunes: m.c.d. = ${g}.`);
      },
      () => {
        const g = ri(2, 9),
          [x, y] = coprimePair(2, 9);
        return num(`Tienes ${g * x} caramelos y ${g * y} chicles. Quieres hacer bolsas iguales, sin que sobre nada. ¿Cuál es el mayor número de bolsas que puedes preparar?`, g, `Es el m.c.d. de ${g * x} y ${g * y}: ${g} bolsas (con ${x} caramelos y ${y} chicles cada una).`);
      },
      () => {
        const g = ri(2, 9),
          [x, y] = coprimePair(2, 9),
          a = g * x,
          b = g * y;
        return mc(`¿Cuál es el m.c.d. de ${a} y ${b}?`, String(g), [lcm(a, b), Math.min(a, b), 1].map(String), `${a} = ${g} · ${x} y ${b} = ${g} · ${y}: el m.c.d. es ${g}. (${lcm(a, b)} es el m.c.m.)`);
      },
      () => {
        const [p, q] = shuffle(PRIMES).slice(0, 2);
        return mc(`¿Cuánto vale el m.c.d. de ${p} y ${q}?`, '1', [String(p), String(q), String(p * q)], `${p} y ${q} son primos distintos: solo comparten el 1.`);
      },
      () => {
        const g = ri(2, 8);
        let x, y, z;
        do {
          x = ri(2, 7);
          y = ri(2, 7);
          z = ri(2, 7);
        } while (gcd(gcd(x, y), z) !== 1 || x === y || y === z || x === z);
        return num(`Calcula el m.c.d. de ${g * x}, ${g * y} y ${g * z}`, g, `Los tres son múltiplos de ${g} y los cocientes (${x}, ${y} y ${z}) no tienen un divisor común mayor que 1: m.c.d. = ${g}.`);
      },
    ],
  },
  {
    title: 'Mínimo común múltiplo',
    sub: 'El menor múltiplo que tienen en común',
    lesson: [
      ['¿Qué es?', `<p>El <span class="hl">mínimo común múltiplo</span> (m.c.m.) de dos números es el <b>menor</b> número, distinto de cero, que es múltiplo de los dos.</p><div class="ex">Múltiplos de 4: 4, 8, 12, 16, 20, 24…<br>Múltiplos de 6: 6, 12, 18, 24…<br>m.c.m.(4, 6) = <b>12</b></div>`],
      ['Con factores primos', `<p>Se multiplican los factores primos <b>comunes y no comunes</b>, con el <b>mayor</b> exponente.</p><div class="ex">4 = ${P(2, 2)} · 6 = 2 · 3 → m.c.m. = ${P(2, 2)} · 3 = 12</div>`],
      ['¿Para qué sirve?', `<p>Para saber <b>cuándo coinciden</b> dos cosas que se repiten cada cierto tiempo: autobuses, luces, turnos…</p>`],
      ['Error típico', `<div class="ex warn">m.c.m.(4, 6) = 2</div><p>2 es el m.c.d. El m.c.m. es siempre mayor o igual que el más grande de los números.</p>`],
    ],
    gens: [
      () => {
        const [a, b] = shuffle([4, 6, 8, 9, 10, 12, 14, 15]).slice(0, 2);
        return num(`Calcula el m.c.m. de ${a} y ${b}`, lcm(a, b), `Múltiplos comunes más pequeños: el primero que comparten ${a} y ${b} es ${lcm(a, b)}.`);
      },
      () => {
        const [a, b] = shuffle([6, 8, 9, 10, 12, 15, 18, 20]).slice(0, 2);
        return num(`Un autobús sale cada ${a} minutos y otro cada ${b} minutos. Si acaban de salir los dos a la vez, ¿cuántos minutos pasan hasta que vuelven a salir juntos?`, lcm(a, b), `Es el m.c.m. de ${a} y ${b}: ${lcm(a, b)} minutos.`);
      },
      () => {
        const [a, b] = shuffle([4, 6, 8, 9, 10, 12, 14, 15]).slice(0, 2);
        return mc(`¿Cuál es el m.c.m. de ${a} y ${b}?`, String(lcm(a, b)), [a * b === lcm(a, b) ? a * b + a : a * b, gcd(a, b), Math.max(a, b)].map(String), `El menor múltiplo común de ${a} y ${b} es ${lcm(a, b)}.`);
      },
      () => {
        const [a, b] = shuffle([3, 4, 5, 6, 8, 9, 10]).slice(0, 2);
        return num(`Una luz parpadea cada ${a} segundos y otra cada ${b} segundos. Si parpadean juntas ahora, ¿a los cuántos segundos vuelven a coincidir?`, lcm(a, b), `Coinciden en el m.c.m. de ${a} y ${b}: a los ${lcm(a, b)} segundos.`);
      },
      () => {
        let a, b;
        do [a, b] = shuffle([4, 6, 8, 9, 10, 12]).slice(0, 2);
        while (a % b === 0 || b % a === 0);
        const m = lcm(a, b),
          good = m * ri(1, 3),
          bad = Array.from({ length: 40 }, (_, i) => a * (i + 2)).filter((x) => x % b !== 0);
        return mc(`¿Cuál de estos números es múltiplo de ${a} y de ${b} a la vez?`, String(good), shuffle(bad).slice(0, 3).map(String), `${good} está en la tabla de ${a} y en la de ${b}: es múltiplo común (el menor es ${m}).`);
      },
    ],
  },
];

/* ---------- relatos ---------- */
const boxes = (n, x0, y0, d0, w = 26) => Array.from({ length: n }, (_, k) => box(x0 + (k % 6) * (w + 4), y0 + Math.floor(k / 6) * (w + 4), w, w, d0 + k * 0.1, { t: 0.2 })).join('');
const DIV_ANIMS = [
  [ // 1 · Múltiplos y divisores — «Las cajas de lápices de Nora»
    { say: 'Nora tiene doce lápices y quiere guardarlos en cajas, todas con los mismos lápices y sin que sobre ninguno.',
      show: sk(300, 110, person(34, 18, 0, 'Nora') + boxes(12, 90, 22, 0.8, 22)) },
    { say: 'Puede hacer una caja de doce, dos de seis, tres de cuatro, cuatro de tres, seis de dos o doce de uno. Esos números son los divisores de doce.',
      show: line(at(0, '12 = 1 · 12 = 2 · 6 = 3 · 4')) + line(at(1.6, 'divisores: <b>1, 2, 3, 4, 6, 12</b>'), 'big') },
    { say: '¿Cuál de estos números es divisor?', ask: () => DIV_LEVELS[0].gens[2]() },
    { say: 'Si Nora compra cajas de seis lápices, tendrá seis, doce, dieciocho, veinticuatro… Esos números son los múltiplos de seis.',
      show: line(seq(['6', '12', '18', '24', '30', '…'].map((x) => `<b>${x}</b>`), 0, 0.4)) + line(at(2.8, 'múltiplos de 6', 'good')) },
    { say: 'Calcula un múltiplo.', ask: () => DIV_LEVELS[0].gens[0]() },
    { say: 'Cuidado: veinticuatro es múltiplo de seis, y seis es divisor de veinticuatro. Nunca al revés: seis no es múltiplo de veinticuatro.',
      show: line(at(0, '24 = 6 · 4')) + line(at(1, '24 es múltiplo de 6', 'good')) + line(strike(at(2, '6 es múltiplo de 24', 'bad'), 3)) },
    { say: 'En la vida real: una tableta de chocolate de doce onzas se puede repartir exactamente entre dos, tres, cuatro, seis o doce amigos.',
      show: real('repartir chocolate', sk(260, 100, boxes(12, 30, 12, 0, 30)) + line(at(1.6, '12 onzas · divisores: 1, 2, 3, 4, 6, 12'))) },
    { say: '¿Cuántos divisores tiene?', ask: () => DIV_LEVELS[0].gens[3]() },
  ],
  [ // 2 · Criterios — «El detective de los números»
    { say: 'La detective Eva investiga números sin hacer divisiones. Tiene una lupa y seis criterios para descubrir sus secretos.',
      show: sk(280, 110, person(36, 18, 0, 'Eva') + circ(150, 52, 22, 0.8, { c: 'blue' }) + ln(166, 68, 190, 92, 1.3, { c: 'blue' }) + tx(200, 56, '348', 1.8, { s: 24 })) },
    { say: 'Primero, el dos: si un número acaba en cifra par, se divide entre dos. Y el cinco: si acaba en cero o en cinco. Con el diez, solo si acaba en cero.',
      show: line(at(0, '÷ 2 → acaba en 0, 2, 4, 6 u 8')) + line(at(1.2, '÷ 5 → acaba en 0 o 5')) + line(at(2.4, '÷ 10 → acaba en 0')) },
    { say: '¿Es divisible?', ask: () => DIV_LEVELS[1].gens[0]() },
    { say: 'El tres y el nueve miran las cifras: se suman. Trescientos cuarenta y ocho suma quince, que es múltiplo de tres pero no de nueve.',
      show: line(at(0, '3 + 4 + 8 = <b>15</b>')) + line(at(1.2, '15 es múltiplo de 3 ✓', 'good')) + line(at(2.2, '15 no es múltiplo de 9 ✗', 'bad')) },
    { say: 'Completa la cifra que falta.', ask: () => DIV_LEVELS[1].gens[1]() },
    { say: 'Un sospechoso dice: acabo en tres, así que me divido entre tres. ¡Falso! Con el tres no importa la última cifra, sino la suma de todas.',
      show: line(strike(at(0, '13 acaba en 3 → ÷ 3', 'bad'), 1.4)) + line(at(2.2, '1 + 3 = 4, no es múltiplo de 3', 'good')) },
    { say: 'En la vida real: para repartir ciento veinte caramelos entre tres amigos, la suma de las cifras de ciento veinte es tres, así que sale exacto sin calcular.',
      show: real('repartir caramelos', line(at(0, '120 → 1 + 2 + 0 = 3 ✓')) + line(at(1.4, '120 : 3 = <b>40</b> cada uno'))) },
    { say: '¿Por cuál se divide?', ask: () => DIV_LEVELS[1].gens[2]() },
  ],
  [ // 3 · Primos — «El baile de los números»
    { say: 'En el baile de los números, cada número solo puede bailar en grupos iguales. Algunos números solo consiguen hacer una fila o una columna.',
      show: sk(290, 100, dot(40, 50, 8, 0.4, 'blue') + dot(100, 30, 8, 0.8, 'red') + dot(100, 60, 8, 1, 'red') + dot(110, 30, 8, 1.1, 'red') ) + line(at(1.6, 'algunos tienen pocas formas de agruparse')) },
    { say: 'Los primos solo se pueden dividir entre uno y entre ellos mismos: dos, tres, cinco, siete, once… Tienen exactamente dos divisores.',
      show: line(seq(['2', '3', '5', '7', '11', '13'].map((x) => `<b>${x}</b>`), 0, 0.4)) + line(at(2.8, 'solo 2 divisores: 1 y él mismo', 'good')) },
    { say: '¿Cuál es primo?', ask: () => DIV_LEVELS[2].gens[0]() },
    { say: 'Los demás son compuestos: tienen más de dos divisores. El nueve baila en tres filas de tres, así que no es primo. El uno no es primo ni compuesto.',
      show: line(at(0, '9 = 3 · 3 → compuesto', 'bad')) + line(at(1.4, '1 → ni primo ni compuesto')) },
    { say: 'Y atención: el dos es el único primo par. Todos los demás números pares se dividen entre dos, y por eso tienen más divisores.',
      show: line(at(0, 'el único primo par: <b>2</b>', 'good')) + line(strike(at(1.2, '4, 6, 8… no son primos', 'bad'), 2.2)) },
    { say: '¿Es un número primo?', ask: () => DIV_LEVELS[2].gens[4]() },
    { say: 'En la vida real: las claves de seguridad de internet usan números primos enormes. Multiplicarlos es fácil, pero descubrir cuáles eran es muy difícil.',
      show: real('claves de seguridad', sk(240, 90, box(30, 20, 60, 40, 0, { t: 0.5 }) + tx(60, 46, 'p', 0.6, { s: 20 }) + tx(110, 46, '×', 1, { s: 22 }) + box(130, 20, 60, 40, 1.2, { t: 0.5 }) + tx(160, 46, 'q', 1.7, { s: 20 })) + line(at(2.4, 'fácil multiplicar, difícil volver atrás'))) },
    { say: '¿Cuál es compuesto?', ask: () => DIV_LEVELS[2].gens[1]() },
  ],
  [ // 4 · Factores primos — «El árbol de factores de Teo»
    { say: 'Teo quiere romper el número sesenta en trozos primos. Dibuja un árbol: arriba el sesenta y de cada rama van saliendo factores.',
      show: sk(260, 130, person(30, 14, 0, 'Teo') + tx(150, 24, '60', 0.8, { s: 22 }) + ln(150, 30, 110, 60, 1.4, { t: 0.3 }) + ln(150, 30, 190, 60, 1.6, { t: 0.3 }) + tx(110, 78, '2', 2, { s: 20, c: 'blue' }) + tx(190, 78, '30', 2.2, { s: 20 })) },
    { say: 'Treinta se rompe en dos por quince, y quince en tres por cinco. Cuando todas las hojas son primos, el árbol está terminado.',
      show: line(at(0, '60 = 2 · 30 = 2 · 2 · 15')) + line(at(1.4, '= 2 · 2 · 3 · 5'), 'big') + line(at(2.6, 'todos primos ✓', 'good')) },
    { say: '¿Cuál es el mayor factor primo?', ask: () => DIV_LEVELS[3].gens[1]() },
    { say: 'Los factores repetidos se escriben con exponente: dos por dos es dos al cuadrado. Sesenta es dos al cuadrado por tres por cinco.',
      show: line(at(0, `60 = ${P(2, 2)} · 3 · 5`), 'big') + line(at(1.4, 'esta descomposición es única')) },
    { say: 'Calcula el número.', ask: () => DIV_LEVELS[3].gens[2]() },
    { say: 'Su amiga propone: sesenta es cuatro por tres por cinco. Pero cuatro no es primo: todavía se puede romper en dos por dos.',
      show: line(strike(at(0, '60 = 4 · 3 · 5', 'bad'), 1.2)) + line(at(2, '4 = 2 · 2 → sigue', 'good')) },
    { say: 'En la vida real: para saber con qué ruedas de engranaje se pueden combinar dientes iguales, los ingenieros usan la descomposición en factores primos.',
      show: real('engranajes', sk(240, 100, circ(80, 50, 30, 0, { t: 0.5 }) + circ(150, 50, 22, 0.6, { t: 0.4, c: 'blue' })) + line(at(1.6, 'dientes: 60 = 2² · 3 · 5'))) },
    { say: '¿Cuántos factores primos distintos hay?', ask: () => DIV_LEVELS[3].gens[3]() },
  ],
  [ // 5 · m.c.d. — «Las bolsas de Iván»
    { say: 'Iván tiene dieciocho caramelos y doce chicles. Quiere hacer bolsas iguales, con el mismo número de caramelos y de chicles, sin que sobre nada.',
      show: sk(290, 100, person(30, 14, 0, 'Iván') + boxes(18, 80, 8, 0.8, 18) + tx(160, 96, '18 caramelos · 12 chicles', 2.6, { s: 13 })) },
    { say: 'Busca los divisores comunes de dieciocho y doce: uno, dos, tres y seis. El mayor es seis: podrá hacer seis bolsas.',
      show: line(at(0, 'divisores de 18: 1, 2, 3, 6, 9, 18')) + line(at(1.2, 'divisores de 12: 1, 2, 3, 4, 6, 12')) + line(at(2.4, 'm.c.d. = <b>6</b>'), 'big') },
    { say: 'Calcula el máximo común divisor.', ask: () => DIV_LEVELS[4].gens[0]() },
    { say: 'En cada bolsa habrá tres caramelos y dos chicles. Con seis bolsas no sobra nada: ese es el reparto más grande posible.',
      show: line(at(0, '18 : 6 = 3 caramelos')) + line(at(1.2, '12 : 6 = 2 chicles')) + line(at(2.4, '6 bolsas iguales', 'good')) },
    { say: 'Con factores primos es más rápido: dieciocho es dos por tres al cuadrado, doce es dos al cuadrado por tres. Se cogen los comunes con el menor exponente.',
      show: line(at(0, `18 = 2 · ${P(3, 2)}`)) + line(at(1, `12 = ${P(2, 2)} · 3`)) + line(at(2.2, 'm.c.d. = 2 · 3 = <b>6</b>'), 'big') },
    { say: '¿Cuántas bolsas puede hacer?', ask: () => DIV_LEVELS[4].gens[1]() },
    { say: 'En la vida real: para cortar dos cintas de distinta longitud en trozos iguales y lo más largos posible, hay que usar el máximo común divisor.',
      show: real('cortar cintas', sk(260, 100, box(20, 20, 160, 14, 0, { t: 0.6 }) + box(20, 52, 100, 14, 0.8, { t: 0.6 })) + line(at(2, 'trozos de longitud = m.c.d.'))) },
    { say: 'Elige el valor correcto.', ask: () => DIV_LEVELS[4].gens[2]() },
  ],
  [ // 6 · m.c.m. — «Los autobuses de la plaza»
    { say: 'En la plaza, un autobús sale cada seis minutos y otro cada ocho. Ahora acaban de salir los dos a la vez. ¿Cuándo volverán a coincidir?',
      show: sk(290, 110, box(10, 20, 120, 34, 0, { t: 0.6 }) + tx(70, 42, 'cada 6 min', 0.6, { s: 14, c: 'blue' }) + box(150, 20, 120, 34, 1, { t: 0.6 }) + tx(210, 42, 'cada 8 min', 1.6, { s: 14, c: 'red' })) },
    { say: 'Escribe los minutos del primero: seis, doce, dieciocho, veinticuatro. Los del segundo: ocho, dieciséis, veinticuatro. Coinciden a los veinticuatro.',
      show: line(at(0, '6, 12, 18, <b>24</b>, 30…')) + line(at(1.4, '8, 16, <b>24</b>, 32…')) + line(at(2.8, 'm.c.m. = <b>24</b>'), 'big') },
    { say: 'Calcula el mínimo común múltiplo.', ask: () => DIV_LEVELS[5].gens[0]() },
    { say: 'Con factores primos: seis es dos por tres, ocho es dos al cubo. Se cogen todos, con el mayor exponente: dos al cubo por tres, veinticuatro.',
      show: line(at(0, '6 = 2 · 3')) + line(at(1, `8 = ${P(2, 3)}`)) + line(at(2.2, `m.c.m. = ${P(2, 3)} · 3 = <b>24</b>`), 'big') },
    { say: '¿Cuántos minutos pasan hasta que coinciden?', ask: () => DIV_LEVELS[5].gens[1]() },
    { say: 'Atención: el mínimo común múltiplo es mayor o igual que los dos números. Si alguien dice que es dos, se ha confundido con el máximo común divisor.',
      show: line(strike(at(0, 'm.c.m.(6, 8) = 2', 'bad'), 1.2)) + line(at(2, '2 es el m.c.d.', 'good')) },
    { say: 'En la vida real: los semáforos de una avenida se coordinan con el mínimo común múltiplo de sus ciclos para que la «ola verde» se repita cada cierto tiempo.',
      show: real('semáforos', sk(240, 110, circ(70, 30, 12, 0, { c: 'red', t: 0.3 }) + circ(70, 60, 12, 0.3, { t: 0.3 }) + circ(70, 90, 12, 0.6, { c: 'green', t: 0.3 }) + tx(150, 60, 'ola verde', 1.2, { s: 16, c: 'green' }))) },
    { say: '¿Cuándo vuelven a coincidir?', ask: () => DIV_LEVELS[5].gens[3]() },
  ],
];
export { DIV_LEVELS, DIV_ANIMS };
