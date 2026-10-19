import { pick, shuffle, mc } from './data.js';
import { at, line, real, strike, sk, box, tx, arrow, person, bubble } from './sketch.js';

/* ---------- contenido: Lengua · Las clases de palabras ---------- */
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const tf = (t, ok, why = '') => mc(`¿Verdadero o falso?<br>«${t}»`, ok ? 'Verdadero' : 'Falso', ['Verdadero', 'Falso'], ok ? `Es verdadero.${why ? ' ' + why : ''}` : `Es falso: ${why}`);

// [frase, sustantivo, adjetivo]
const FRASES = [
  ['La casa azul está junto al río.', 'casa', 'azul'], ['Un perro pequeño ladra en el jardín.', 'perro', 'pequeño'], ['Leí un libro interesante.', 'libro', 'interesante'],
  ['Las flores amarillas huelen bien.', 'flores', 'amarillas'], ['Mi hermana tiene una bicicleta nueva.', 'bicicleta', 'nueva'], ['Los niños cansados se durmieron pronto.', 'niños', 'cansados'],
  ['El profesor amable nos ayudó.', 'profesor', 'amable'], ['Comimos una sopa caliente.', 'sopa', 'caliente'],
];
const PROPIOS = ['Madrid', 'Lucía', 'Cervantes', 'Duero', 'España', 'Teide'], COMUNES = ['ciudad', 'niña', 'escritor', 'río', 'país', 'montaña', 'perro', 'mesa'];
// [sustantivo con artículo, adjetivo correcto, adjetivos incorrectos]
const CONCORD = [
  ['las flores', 'rojas', ['rojo', 'rojos', 'roja']], ['el coche', 'rápido', ['rápida', 'rápidos', 'rápidas']], ['la ventana', 'abierta', ['abierto', 'abiertos', 'abiertas']],
  ['los libros', 'viejos', ['viejo', 'vieja', 'viejas']], ['unas amigas', 'simpáticas', ['simpático', 'simpática', 'simpáticos']], ['un día', 'soleado', ['soleada', 'soleados', 'soleadas']],
];
// [forma verbal, infinitivo, persona y número, tiempo]
const VERBOS = [
  ['cantábamos', 'cantar', 'primera persona del plural', 'pasado'], ['comeré', 'comer', 'primera persona del singular', 'futuro'], ['viven', 'vivir', 'tercera persona del plural', 'presente'],
  ['jugaste', 'jugar', 'segunda persona del singular', 'pasado'], ['escribiremos', 'escribir', 'primera persona del plural', 'futuro'], ['corre', 'correr', 'tercera persona del singular', 'presente'],
  ['bebías', 'beber', 'segunda persona del singular', 'pasado'], ['partís', 'partir', 'segunda persona del plural', 'presente'],
];
const PERSONAS = ['primera persona del singular', 'segunda persona del singular', 'tercera persona del singular', 'primera persona del plural', 'segunda persona del plural', 'tercera persona del plural'];
// [palabra, tipo de determinante]
const DETS = [['el', 'artículo'], ['las', 'artículo'], ['este', 'demostrativo'], ['esa', 'demostrativo'], ['aquellos', 'demostrativo'], ['mi', 'posesivo'], ['tus', 'posesivo'], ['nuestra', 'posesivo'], ['tres', 'numeral'], ['segundo', 'numeral'], ['cinco', 'numeral']];
const TIPOS = ['artículo', 'demostrativo', 'posesivo', 'numeral'];

const PAL_LEVELS = [
  {
    title: 'Sustantivos y adjetivos', sub: 'Nombrar y describir',
    lesson: [
      ['El sustantivo', `<p>El <span class="hl">sustantivo</span> es la palabra que <b>nombra</b> personas, animales, cosas o ideas: <i>niña, perro, mesa, alegría</i>. Los <b>propios</b> nombran algo único y se escriben con mayúscula (<i>Madrid, Lucía</i>); los <b>comunes</b> nombran cualquiera de su clase (<i>ciudad, niña</i>). Tienen <b>género</b> (masculino o femenino) y <b>número</b> (singular o plural).</p>`],
      ['El adjetivo', `<p>El <span class="hl">adjetivo</span> <b>acompaña al sustantivo</b> y dice <b>cómo es</b>: <i>casa <b>azul</b></i>, <i>perro <b>pequeño</b></i>. Concuerda con él en género y número: <i>las flores rojas</i>, no <i>las flores rojo</i>.</p>`],
      ['Error típico', `<div class="ex warn">«Azul es un sustantivo porque es un color»</div><p>En <i>la casa azul</i>, <b>azul</b> dice cómo es la casa: es adjetivo. Solo es sustantivo si nombra el color: <i>El azul me gusta</i>.</p>`],
    ],
    gens: [
      () => { const [f, , a] = pick(FRASES); return mc(`En «${f}», ¿qué palabra es un <b>adjetivo</b>?`, a, shuffle(f.replace(/[.,]/g, '').split(' ').filter((w) => w.toLowerCase() !== a)).slice(0, 3), `<b>${cap(a)}</b> dice cómo es: es el adjetivo.`); },
      () => { const [f, n, a] = pick(FRASES); return mc(`En «${f}», ¿a qué sustantivo acompaña el adjetivo «${a}»?`, n, shuffle(f.replace(/[.,]/g, '').split(' ').filter((w) => w.toLowerCase() !== n && w.toLowerCase() !== a)).slice(0, 3), `<b>${cap(a)}</b> dice cómo es <b>${n}</b>: el adjetivo acompaña a ese sustantivo.`); },
      () => { const p = Math.random() < 0.5, w = pick(p ? PROPIOS : COMUNES); return mc(`¿Es <b>${w}</b> un sustantivo común o propio?`, p ? 'Propio' : 'Común', ['Propio', 'Común'], p ? `${w} nombra algo único y se escribe con mayúscula: es propio.` : `${w} nombra cualquiera de su clase: es común.`); },
      () => { const [n, ok, bad] = pick(CONCORD); return mc(`¿Qué adjetivo concuerda con «${n}»?`, ok, bad, `«${cap(n)} ${ok}»: el adjetivo coincide en género y número con el sustantivo.`); },
      () => tf(...pick([['El adjetivo dice cómo es el sustantivo.', true], ['Los sustantivos propios se escriben con minúscula.', false, 'se escriben con mayúscula inicial.'], ['El adjetivo concuerda con el sustantivo en género y número.', true], ['Todas las palabras que indican un color son adjetivos.', false, 'si nombran el color solo, como «El azul me gusta», son sustantivos.']])),
    ],
  },
  {
    title: 'El verbo', sub: 'Persona, número y tiempo',
    lesson: [
      ['¿Qué es?', `<p>El <span class="hl">verbo</span> expresa <b>acciones, estados o procesos</b>: <i>cantar, ser, llover</i>. Su forma cambia según la <b>persona</b> (yo, tú, él…), el <b>número</b> (singular o plural) y el <b>tiempo</b> (pasado, presente o futuro).</p>`],
      ['El infinitivo', `<p>El nombre del verbo es el <b>infinitivo</b> y acaba en <b>-ar, -er o -ir</b>: <i>cantar, comer, vivir</i>. De él salen todas las formas: <i>cantábamos</i> viene de <i>cantar</i>.</p>`],
      ['Persona, número y tiempo', `<div class="tbl"><table><tr><th></th><th>Singular</th><th>Plural</th></tr><tr><th>1.ª</th><td>yo canto</td><td>nosotros cantamos</td></tr><tr><th>2.ª</th><td>tú cantas</td><td>vosotros cantáis</td></tr><tr><th>3.ª</th><td>él canta</td><td>ellos cantan</td></tr></table></div><p><i>Canté</i> es pasado, <i>canto</i> es presente y <i>cantaré</i> es futuro.</p>`],
      ['Error típico', `<div class="ex warn">«El infinitivo de <i>comeré</i> es <i>comeré</i>»</div><p>El infinitivo es la forma sin conjugar: <b>comer</b>.</p>`],
    ],
    gens: [
      () => { const [f, i] = pick(VERBOS); return mc(`¿Cuál es el infinitivo de «${f}»?`, i, shuffle(VERBOS.map((v) => v[1]).filter((x) => x !== i)).slice(0, 3), `El infinitivo de ${f} es ${i}.`); },
      () => { const [f, , , t] = pick(VERBOS); return mc(`¿En qué tiempo está «${f}»?`, cap(t), ['Pasado', 'Presente', 'Futuro'].filter((x) => x !== cap(t)), `${cap(f)} está en ${t}.`); },
      () => { const [f, , p] = pick(VERBOS); return mc(`¿Qué persona y número es «${f}»?`, cap(p), shuffle(PERSONAS.filter((x) => x !== p)).slice(0, 3).map(cap), `${cap(f)} es ${p}.`); },
      () => { const [, i] = pick(VERBOS), c = i.slice(-2); return mc(`¿De qué conjugación es el verbo «${i}»?`, c === 'ar' ? 'Primera (-ar)' : c === 'er' ? 'Segunda (-er)' : 'Tercera (-ir)', ['Primera (-ar)', 'Segunda (-er)', 'Tercera (-ir)'], `Su infinitivo acaba en -${c}.`); },
      () => tf(...pick([['El infinitivo acaba en -ar, -er o -ir.', true], ['«Cantaré» está en pasado.', false, 'está en futuro.'], ['El verbo cambia según la persona, el número y el tiempo.', true], ['«Nosotros jugamos» es tercera persona.', false, 'es primera persona del plural.']])),
    ],
  },
  {
    title: 'Los determinantes', sub: 'Artículos, demostrativos, posesivos y numerales',
    lesson: [
      ['¿Qué son?', `<p>Los <span class="hl">determinantes</span> van <b>delante del sustantivo</b> y concretan de qué estamos hablando: <i><b>el</b> perro, <b>este</b> libro, <b>mi</b> casa, <b>tres</b> niñas</i>. Concuerdan con él en género y número.</p>`],
      ['Clases', `<div class="tbl"><table><tr><th>Clase</th><th>Ejemplos</th></tr><tr><td>Artículos</td><td>el, la, los, las, un, una</td></tr><tr><td>Demostrativos</td><td>este, ese, aquel (y sus formas)</td></tr><tr><td>Posesivos</td><td>mi, tu, su, nuestro, vuestro</td></tr><tr><td>Numerales</td><td>dos, tres, cuatro… primero, segundo…</td></tr></table></div>`],
      ['Error típico', `<div class="ex warn">«Mi» y «mí» son lo mismo</div><p><b>Mi</b> (sin tilde) es el determinante posesivo: <i>mi casa</i>. <b>Mí</b> (con tilde) es un pronombre: <i>Es para mí</i>.</p>`],
    ],
    gens: [
      () => { const [w, t] = pick(DETS); return mc(`¿Qué clase de determinante es «${w}»?`, cap(t), TIPOS.filter((x) => x !== t).map(cap), `${cap(w)} es un determinante ${t}.`); },
      () => { const t = pick(TIPOS); const w = pick(DETS.filter((d) => d[1] === t))[0]; return mc(`¿Cuál de estas palabras es un determinante ${t}?`, w, shuffle(DETS.filter((d) => d[1] !== t)).slice(0, 3).map((d) => d[0]), `${cap(w)} es un determinante ${t}.`); },
      () => mc('¿Dónde se coloca el determinante?', 'Delante del sustantivo', ['Detrás del verbo', 'Al final de la oración', 'Entre dos adjetivos'], 'El determinante va delante del sustantivo y concuerda con él.'),
      () => { const w = pick(['mi', 'tu', 'su']); return mc(`En «${w} casa», ¿qué clase de palabra es «${w}»?`, 'Determinante posesivo', ['Adjetivo', 'Sustantivo', 'Verbo'], `${cap(w)} indica a quién pertenece la casa: es un determinante posesivo.`); },
      () => tf(...pick([['Los artículos son determinantes.', true], ['«Este» es un determinante posesivo.', false, 'es demostrativo.'], ['Los determinantes concuerdan con el sustantivo en género y número.', true], ['«Mí» con tilde es un determinante.', false, 'con tilde es un pronombre; el determinante es «mi».']])),
    ],
  },
];

/* ---------- relatos ---------- */
const PAL_ANIMS = [
  [ // 1 · Sustantivos y adjetivos — «El zoo de Paula»
    { say: 'Paula visita el zoo con su libreta. Quiere apuntar todo lo que ve: animales, cosas y cómo son.', show: sk(280, 100, person(30, 14, 0, 'Paula') + box(100, 22, 130, 50, 0.8, { t: 0.6 }) + tx(165, 54, 'libreta', 1.6, { s: 17 })) },
    { say: 'Las palabras que nombran a los animales y las cosas son sustantivos: elefante, jaula, mono. Las que dicen cómo son son adjetivos: grande, gris, ruidoso.', show: line(at(0, '<b>elefante</b> · jaula · mono → sustantivos')) + line(at(1.4, 'grande · gris · ruidoso → adjetivos', 'good')) },
    { say: 'Busca el adjetivo.', ask: () => PAL_LEVELS[0].gens[0]() },
    { say: 'Los nombres propios, como Dumbo o Madrid, nombran algo único y llevan mayúscula. Elefante, en general, es un nombre común.', show: line(at(0, '<b>D</b>umbo, <b>M</b>adrid → propios')) + line(at(1.2, 'elefante, ciudad → comunes')) },
    { say: '¿Común o propio?', ask: () => PAL_LEVELS[0].gens[2]() },
    { say: 'El adjetivo concuerda con el sustantivo. Se dice los elefantes grandes, no los elefantes grande.', show: line(at(0, 'los elefantes <b>grandes</b> ✓', 'good')) + line(strike(at(1, 'los elefantes grande', 'bad'), 2)) },
    { say: 'En la vida real: en una receta, los sustantivos son los ingredientes, y los adjetivos te cuentan cómo deben estar: tomate maduro, agua fría.', show: real('la receta', sk(260, 90, bubble(30, 14, 200, 40, 'tomate maduro · agua fría', 0.4, { s: 16 }))) },
    { say: '¿Qué adjetivo concuerda?', ask: () => PAL_LEVELS[0].gens[3]() },
  ],
  [ // 2 · El verbo — «El cuaderno de acciones de Hugo»
    { say: 'Hugo tiene un cuaderno donde apunta acciones: cantar, comer, vivir. Son los infinitivos, y acaban en ar, er o ir.', show: sk(280, 100, person(30, 14, 0, 'Hugo') + tx(150, 34, 'cantar', 0.8, { s: 18 }) + tx(150, 62, 'comer', 1.4, { s: 18 }) + tx(150, 90, 'vivir', 2, { s: 18 })) },
    { say: 'Pero en la vida las acciones cambian: nosotros cantábamos, yo comeré, ellos viven. El verbo cambia según quién, cuántos y cuándo.', show: line(at(0, 'cantábamos · comeré · viven')) + line(at(1.4, 'persona · número · tiempo', 'good')) },
    { say: '¿Cuál es el infinitivo?', ask: () => PAL_LEVELS[1].gens[0]() },
    { say: 'Comeré está en futuro, porque la acción aún no ha pasado. Comí estaría en pasado, y como, en presente.', show: line(at(0, 'comí → pasado')) + line(at(1, 'como → presente')) + line(at(2, 'comeré → futuro', 'good')) },
    { say: '¿En qué tiempo está?', ask: () => PAL_LEVELS[1].gens[1]() },
    { say: 'La persona dice quién hace la acción. Cantábamos es primera persona del plural: nosotros.', show: line(at(0, 'cantábamos = nosotros')) + line(at(1.2, '1.ª persona · plural', 'good')) },
    { say: 'En la vida real: en un mensaje de móvil, no es lo mismo llego, llegué o llegaré. El tiempo del verbo cambia cuándo ocurre.', show: real('el mensaje', sk(240, 90, bubble(20, 14, 200, 40, 'llego · llegué · llegaré', 0.4, { s: 16 }) + arrow(120, 62, 120, 84, 1.4, 'red'))) },
    { say: '¿Qué persona y número es?', ask: () => PAL_LEVELS[1].gens[2]() },
  ],
  [ // 3 · Determinantes — «Las tarjetas de Marta»
    { say: 'Marta escribe tarjetas con un sustantivo cada una: casa, libro, amigas. Para concretar, les pone una palabra delante.', show: sk(280, 100, person(30, 14, 0, 'Marta') + box(100, 22, 70, 40, 0.8, { t: 0.5 }) + tx(135, 48, 'casa', 1.4, { s: 16 }) + box(190, 22, 70, 40, 1.8, { t: 0.5 }) + tx(225, 48, 'libro', 2.4, { s: 16 })) },
    { say: 'Esas palabras son los determinantes. El libro, este libro, mi libro, tres libros: cada uno concreta el libro de una manera.', show: line(at(0, '<b>el</b> libro · <b>este</b> libro')) + line(at(1.4, '<b>mi</b> libro · <b>tres</b> libros')) },
    { say: '¿Qué clase de determinante es?', ask: () => PAL_LEVELS[2].gens[0]() },
    { say: 'Los artículos son el, la, los y las. Los demostrativos señalan: este, ese y aquel. Los posesivos dicen de quién es: mi, tu y su.', show: line(at(0, 'artículos: el, la, los…')) + line(at(1, 'demostrativos: este, ese, aquel')) + line(at(2, 'posesivos: mi, tu, su')) },
    { say: 'Elige el determinante.', ask: () => PAL_LEVELS[2].gens[1]() },
    { say: 'Mi sin tilde es el posesivo de mi casa. Mí con tilde es otra clase de palabra: es para mí. No se confunden.', show: line(at(0, '<b>mi</b> casa → determinante', 'good')) + line(at(1.4, 'para <b>mí</b> → pronombre')) },
    { say: 'En la vida real: en una tienda, dices dame este bollo, no ese. El determinante demostrativo señala cuál quieres.', show: real('la panadería', sk(240, 90, bubble(20, 14, 200, 40, 'dame este bollo', 0.4, { s: 17 }))) },
    { say: '¿Qué clase de palabra es?', ask: () => PAL_LEVELS[2].gens[3]() },
  ],
];
export { PAL_LEVELS, PAL_ANIMS };
