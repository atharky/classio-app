import { pick, shuffle, mc } from './data.js';
import { at, line, real, strike, sk, ln, box, circ, dot, tx, person, ell } from './sketch.js';

/* ---------- contenido: Biología · Los seres vivos y la célula ---------- */
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const tf = (t, ok, why = '') => mc(`¿Verdadero o falso?<br>«${t}»`, ok ? 'Verdadero' : 'Falso', ['Verdadero', 'Falso'], ok ? `Es verdadero.${why ? ' ' + why : ''}` : `Es falso: ${why}`);

const VIVOS = [['un perro', true, 'nace, crece, se reproduce y muere'], ['un árbol', true, 'nace, crece, se nutre y se reproduce'], ['un champiñón', true, 'es un hongo: se nutre, crece y se reproduce'], ['una bacteria', true, 'es un ser vivo diminuto formado por una sola célula'],
  ['una roca', false, 'no se nutre, no se relaciona y no se reproduce'], ['un coche', false, 'se mueve, pero no nace, ni crece, ni se reproduce'], ['el fuego', false, 'parece que crece y se mueve, pero no tiene células ni funciones vitales'], ['una nube', false, 'cambia de tamaño, pero no es un ser vivo']];
const FUNCIONES = [['comer y respirar', 'nutrición'], ['digerir los alimentos', 'nutrición'], ['huir de un peligro', 'relación'], ['ver la luz y moverse hacia ella', 'relación'], ['tener crías', 'reproducción'], ['poner huevos', 'reproducción'], ['eliminar los desechos', 'nutrición'], ['reaccionar al frío', 'relación']];
const FUNC = ['nutrición', 'relación', 'reproducción'];
const ORGANULOS = [['membrana', 'rodea la célula y controla lo que entra y sale'], ['núcleo', 'contiene el material genético (ADN) y dirige la célula'], ['citoplasma', 'es el interior de la célula, donde ocurren muchas reacciones'],
  ['pared celular', 'da forma y protección a la célula (solo en las vegetales)'], ['cloroplastos', 'realizan la fotosíntesis (solo en las vegetales)']];
const REINOS = [['una bacteria del yogur', 'Moneras'], ['la bacteria del cólera', 'Moneras'], ['una ameba', 'Protoctistas'], ['un alga unicelular', 'Protoctistas'], ['un champiñón', 'Hongos'], ['la levadura del pan', 'Hongos'],
  ['un helecho', 'Plantas'], ['un pino', 'Plantas'], ['un musgo', 'Plantas'], ['una mosca', 'Animales'], ['una medusa', 'Animales'], ['un delfín', 'Animales']];
const NOMBRES = ['Moneras', 'Protoctistas', 'Hongos', 'Plantas', 'Animales'];

const CEL_LEVELS = [
  {
    title: 'Los seres vivos', sub: 'Qué los distingue y qué funciones realizan',
    lesson: [
      ['¿Qué es un ser vivo?', `<p>Los <span class="hl">seres vivos</span> nacen, crecen, se reproducen y mueren. Están formados por <b>células</b> y realizan tres <b>funciones vitales</b>.</p>`],
      ['Las tres funciones vitales', `<div class="tbl"><table><tr><th>Función</th><th>En qué consiste</th></tr><tr><td><b>Nutrición</b></td><td style="text-align:left">Obtener materia y energía (comer, respirar, eliminar desechos)</td></tr><tr><td><b>Relación</b></td><td style="text-align:left">Percibir el entorno y reaccionar a él</td></tr><tr><td><b>Reproducción</b></td><td style="text-align:left">Producir nuevos seres vivos</td></tr></table></div>`],
      ['Error típico', `<div class="ex warn">«Si algo se mueve, está vivo»</div><p>Un coche o el fuego se mueven o parecen crecer, pero no están formados por células ni realizan las tres funciones vitales.</p>`],
    ],
    gens: [
      () => { const [x, ok, why] = pick(VIVOS); return mc(`¿${cap(x)} es un ser vivo?`, ok ? 'Sí' : 'No', ['Sí', 'No'], `${ok ? 'Sí' : 'No'}: ${x} ${ok ? '' : 'no '}cumple las características de los seres vivos (${why}).`); },
      () => { const [s, f] = pick(FUNCIONES); return mc(`«${cap(s)}»: ¿a qué función vital corresponde?`, cap(f), FUNC.filter((x) => x !== f).map(cap), `${cap(s)} es parte de la función de ${f}.`); },
      () => mc('¿Cuántas funciones vitales realizan los seres vivos?', 'Tres: nutrición, relación y reproducción', ['Dos: nutrición y movimiento', 'Cuatro: nutrición, relación, reproducción y color', 'Una: la nutrición'], 'Las tres funciones vitales son nutrición, relación y reproducción.'),
      () => mc('¿De qué están formados todos los seres vivos?', 'De células', ['De metal', 'De agua únicamente', 'De rocas'], 'Todos los seres vivos están formados por una o más células.'),
      () => tf(...pick([['Todos los seres vivos realizan las tres funciones vitales.', true], ['Un coche es un ser vivo porque se mueve.', false, 'no tiene células ni realiza las funciones vitales.'], ['La reproducción consiste en obtener materia y energía.', false, 'eso es la nutrición; la reproducción produce nuevos seres vivos.'], ['Reaccionar al frío es parte de la función de relación.', true]])),
    ],
  },
  {
    title: 'La célula', sub: 'Partes y tipos de célula',
    lesson: [
      ['La unidad de la vida', `<p>La <span class="hl">célula</span> es la unidad básica de los seres vivos. Algunos, como las bacterias, tienen una sola (<b>unicelulares</b>); otros, como los animales y las plantas, tienen muchas (<b>pluricelulares</b>).</p>`],
      ['Partes de la célula', `<div class="tbl"><table><tr><th>Parte</th><th>Función</th></tr>${ORGANULOS.map(([a, b]) => `<tr><td><b>${cap(a)}</b></td><td style="text-align:left">${cap(b)}</td></tr>`).join('')}</table></div>`],
      ['Dos clases de células', `<p>La célula <b>procariota</b> (las bacterias) <b>no tiene núcleo</b> definido. La <b>eucariota</b> (animales, plantas, hongos…) sí lo tiene. La célula <b>vegetal</b> tiene, además de lo que tiene la animal, <b>pared celular</b> y <b>cloroplastos</b>.</p>`],
      ['Error típico', `<div class="ex warn">«Las células animales tienen pared celular»</div><p>La pared celular y los cloroplastos son propios de las células <b>vegetales</b>.</p>`],
    ],
    gens: [
      () => { const [o, f] = pick(ORGANULOS); return mc(`¿Qué ${o === 'cloroplastos' ? 'partes' : 'parte'} de la célula ${f}?`, cap(o), shuffle(ORGANULOS.map((x) => x[0]).filter((x) => x !== o)).slice(0, 3).map(cap), `${cap(o)}: ${f}.`); },
      () => mc('¿Qué tiene la célula vegetal que no tiene la animal?', 'Pared celular y cloroplastos', ['Núcleo y membrana', 'Solo citoplasma', 'Ribosomas y mitocondrias'], 'La célula vegetal tiene pared celular y cloroplastos; ambas tienen membrana, citoplasma y núcleo.'),
      () => mc('¿Qué tipo de célula tiene una bacteria?', 'Procariota', ['Eucariota animal', 'Eucariota vegetal', 'Ninguna: no tiene células'], 'Las bacterias son seres unicelulares con célula procariota, sin núcleo definido.'),
      () => { const [o, f] = pick(ORGANULOS.filter((x) => ['membrana', 'núcleo', 'citoplasma'].includes(x[0]))); return mc(`¿Para qué sirve ${o === 'membrana' ? 'la' : 'el'} ${o}?`, cap(f), ORGANULOS.filter((x) => x[0] !== o).map((x) => cap(x[1])), `${cap(o)}: ${f}.`); },
      () => tf(...pick([['La célula es la unidad básica de los seres vivos.', true], ['Las células animales tienen cloroplastos.', false, 'los cloroplastos son propios de las células vegetales.'], ['Las bacterias son seres unicelulares.', true], ['La célula procariota tiene un núcleo bien definido.', false, 'la procariota no lo tiene; la eucariota sí.']])),
    ],
  },
  {
    title: 'Los cinco reinos', sub: 'Moneras, protoctistas, hongos, plantas y animales',
    lesson: [
      ['Clasificar la vida', `<p>Para estudiar a los seres vivos se agrupan en <span class="hl">cinco reinos</span>:</p><div class="tbl"><table><tr><th>Reino</th><th>Características</th><th>Ejemplos</th></tr><tr><td><b>Moneras</b></td><td style="text-align:left">Unicelulares sin núcleo</td><td>Bacterias</td></tr><tr><td><b>Protoctistas</b></td><td style="text-align:left">Unicelulares (y algunos pluricelulares sencillos) con núcleo</td><td>Amebas, algas</td></tr><tr><td><b>Hongos</b></td><td style="text-align:left">No hacen la fotosíntesis; absorben sustancias de otros seres</td><td>Setas, levaduras</td></tr><tr><td><b>Plantas</b></td><td style="text-align:left">Pluricelulares; fabrican su alimento con la fotosíntesis</td><td>Musgos, helechos, pinos</td></tr><tr><td><b>Animales</b></td><td style="text-align:left">Pluricelulares; se alimentan de otros seres vivos y se mueven</td><td>Moscas, medusas, delfines</td></tr></table></div>`],
      ['Error típico', `<div class="ex warn">«Los hongos son plantas»</div><p>Los hongos forman un reino aparte: <b>no hacen la fotosíntesis</b> y no tienen cloroplastos.</p>`],
    ],
    gens: [
      () => { const [o, r] = pick(REINOS); return mc(`¿A qué reino pertenece ${o}?`, r, NOMBRES.filter((x) => x !== r), `${cap(o)} pertenece al reino ${r}.`); },
      () => mc('¿Qué reino reúne a seres unicelulares sin núcleo?', 'Moneras', ['Protoctistas', 'Hongos', 'Plantas'], 'Las moneras (bacterias) tienen células procariotas, sin núcleo.'),
      () => mc('¿Qué seres vivos fabrican su alimento mediante la fotosíntesis?', 'Las plantas', ['Los hongos', 'Los animales', 'Las bacterias del yogur'], 'Las plantas hacen la fotosíntesis con sus cloroplastos.'),
      () => { const [c, r] = pick([['Seres pluricelulares que se alimentan de otros seres vivos y se mueven', 'Animales'], ['Seres que absorben sustancias de otros seres y no hacen la fotosíntesis', 'Hongos'], ['Seres unicelulares con núcleo, como las amebas', 'Protoctistas'], ['Seres pluricelulares que hacen la fotosíntesis', 'Plantas']]); return mc(`¿A qué reino corresponde esta descripción?<br><b>${c}</b>`, r, NOMBRES.filter((x) => x !== r), `Es el reino ${r}.`); },
      () => tf(...pick([['Existen cinco reinos de seres vivos.', true], ['Los hongos son plantas.', false, 'forman un reino aparte, porque no hacen la fotosíntesis.'], ['Los animales son pluricelulares.', true], ['Las bacterias pertenecen al reino de los animales.', false, 'pertenecen al reino Moneras.']])),
    ],
  },
];

/* ---------- relatos ---------- */
const CEL_ANIMS = [
  [ // 1 · Los seres vivos — «El jardín de Sofía»
    { say: 'Sofía explora el jardín con una lupa. Quiere saber qué cosas son seres vivos y cuáles no.', show: sk(280, 100, person(30, 14, 0, 'Sofía') + circ(150, 46, 22, 0.8, { c: 'blue' }) + ln(166, 62, 190, 86, 1.3, { c: 'blue' })) },
    { say: 'Un ser vivo nace, crece, se reproduce y muere. El gato, el rosal y el hongo del tronco cumplen todo. La piedra y el columpio, no.', show: line(at(0, 'gato · rosal · hongo → vivos', 'good')) + line(at(1.4, 'piedra · columpio → no vivos', 'bad')) },
    { say: '¿Es un ser vivo?', ask: () => CEL_LEVELS[0].gens[0]() },
    { say: 'Los seres vivos hacen tres funciones: nutrirse, relacionarse con el entorno y reproducirse. El rosal se nutre con sus raíces y gira sus hojas hacia la luz.', show: line(at(0, '<b>nutrición</b> · <b>relación</b> · <b>reproducción</b>'), 'big') },
    { say: '¿Qué función es?', ask: () => CEL_LEVELS[0].gens[1]() },
    { say: 'Un amigo dice que el columpio está vivo porque se mueve. Pero moverse no basta: no se nutre, ni nace, ni se reproduce.', show: line(strike(at(0, 'se mueve → está vivo', 'bad'), 1.2)) + line(at(2, 'tiene que cumplir las tres funciones', 'good')) },
    { say: 'En la vida real: una planta de interior que riegas y pones al sol se nutre y crece, y un día echa un brote nuevo: así se reproduce.', show: real('la planta de casa', sk(240, 100, ln(120, 90, 120, 30, 0, { c: 'green' }) + ell(100, 50, 18, 8, 0.6, { c: 'green' }) + ell(140, 60, 18, 8, 1, { c: 'green' }))) },
    { say: '¿Cuántas funciones vitales son?', ask: () => CEL_LEVELS[0].gens[2]() },
  ],
  [ // 2 · La célula — «El microscopio de Álex»
    { say: 'Álex mira al microscopio una gota de agua de un charco. Descubre un mundo de seres diminutos, cada uno formado por una célula.', show: sk(280, 100, person(30, 14, 0, 'Álex') + circ(190, 50, 40, 0.8, { t: 0.7 }) + circ(180, 44, 8, 1.8, { c: 'red', t: 0.3 }) + dot(205, 62, 3, 2.2, 'blue') + dot(170, 66, 3, 2.3, 'blue')) },
    { say: 'La célula tiene una membrana que la rodea, un citoplasma por dentro y un núcleo que dirige todo y guarda el material genético.', show: sk(260, 120, ell(130, 66, 100, 40, 0, { t: 0.8 }) + circ(130, 62, 16, 1, { c: 'red' }) + tx(130, 66, 'núcleo', 1.6, { s: 11 }) + tx(60, 16, 'membrana', 2, { s: 12, c: 'blue' }) + tx(130, 100, 'citoplasma', 2.4, { s: 12 })) },
    { say: '¿Qué parte es?', ask: () => CEL_LEVELS[1].gens[0]() },
    { say: 'Las células vegetales tienen además una pared celular que las protege y cloroplastos verdes que hacen la fotosíntesis. Las animales no.', show: line(at(0, 'célula vegetal = animal + <b>pared celular</b> + <b>cloroplastos</b>')) + line(at(1.6, 'la célula animal no los tiene', 'bad')) },
    { say: '¿Qué tiene la célula vegetal?', ask: () => CEL_LEVELS[1].gens[1]() },
    { say: 'Las bacterias son especiales: su célula es procariota y no tiene un núcleo bien definido. Las demás células tienen núcleo y se llaman eucariotas.', show: line(at(0, 'bacteria → <b>procariota</b> (sin núcleo)')) + line(at(1.4, 'animales, plantas, hongos → eucariotas')) },
    { say: 'En la vida real: el yogur se hace con bacterias vivas. Cada una es una célula procariota; juntas transforman la leche.', show: real('el yogur', sk(240, 100, box(80, 20, 70, 60, 0, { t: 0.6 }) + dot(100, 60, 4, 1, 'red') + dot(118, 50, 4, 1.2, 'red') + dot(130, 66, 4, 1.4, 'red'))) },
    { say: '¿Qué tipo de célula es?', ask: () => CEL_LEVELS[1].gens[2]() },
  ],
  [ // 3 · Los cinco reinos — «La excursión de la clase»
    { say: 'La clase sale de excursión al bosque con una misión: clasificar todos los seres vivos que encuentren en cinco grupos llamados reinos.', show: sk(280, 100, person(30, 14, 0, 'Clase') + tx(170, 30, 'moneras · protoctistas', 0.8, { s: 14 }) + tx(170, 54, 'hongos · plantas', 1.4, { s: 14 }) + tx(170, 78, 'animales', 2, { s: 14 })) },
    { say: 'En el tronco hay setas: son hongos, porque no hacen la fotosíntesis y absorben sustancias. Alrededor crecen helechos y pinos: son plantas.', show: line(at(0, 'seta → <b>Hongos</b>')) + line(at(1.2, 'helecho, pino → <b>Plantas</b>', 'good')) },
    { say: '¿A qué reino pertenece?', ask: () => CEL_LEVELS[2].gens[0]() },
    { say: 'En un charco hay amebas y algas unicelulares con núcleo: son protoctistas. Y las bacterias, sin núcleo, forman el reino de las moneras.', show: line(at(0, 'ameba, alga unicelular → <b>Protoctistas</b>')) + line(at(1.4, 'bacterias → <b>Moneras</b>')) },
    { say: '¿Qué reino corresponde a esta descripción?', ask: () => CEL_LEVELS[2].gens[3]() },
    { say: 'Un compañero dice que las setas son plantas. ¡No! Los hongos forman un reino aparte, porque no tienen cloroplastos.', show: line(strike(at(0, 'setas = plantas', 'bad'), 1.2)) + line(at(2, 'setas = hongos', 'good')) },
    { say: 'En la vida real: el pan crece gracias a la levadura, un hongo microscópico. Sus células comen azúcar y sueltan gas, y la masa se hincha.', show: real('el pan', sk(240, 100, ell(120, 60, 70, 30, 0, { t: 0.8 }) + dot(90, 60, 5, 1, '') + dot(130, 52, 6, 1.2, '') + dot(150, 68, 4, 1.4, ''))) },
    { say: '¿Qué reino tiene seres sin núcleo?', ask: () => CEL_LEVELS[2].gens[1]() },
  ],
];
export { CEL_LEVELS, CEL_ANIMS };
