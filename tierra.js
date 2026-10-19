import { pick, shuffle, mc, num } from './data.js';
import { at, line, real, strike, sk, stroke, ln, box, circ, dot, tx, arrow, person, ell, pointer } from './sketch.js';

/* ---------- contenido: Biología · La Tierra y la geosfera ---------- */
const tf=(t,ok,why='')=>mc(`¿Verdadero o falso?<br>«${t}»`,ok?'Verdadero':'Falso',['Verdadero','Falso'],ok?`Es verdadero.${why?' '+why:''}`:`Es falso: ${why}`);
const cap=s=>s[0].toUpperCase()+s.slice(1);

/* ---------- la Tierra en corte (dibujo de 340 × 200 con las etiquetas a la derecha) ---------- */
const PARTS={
  'corteza continental':{at:[142,26],from:[222,14],fn:'es la corteza de los continentes: la más gruesa (hasta unos 70 km) y de granito.'},
  'manto superior':{at:[172,81],from:[222,44],fn:'es la parte del manto más cercana a la corteza; con ella forma la litosfera.'},
  'núcleo externo':{at:[129,89],from:[222,76],fn:'es líquido (fluido) y está formado sobre todo por hierro y níquel.'},
  'núcleo interno':{at:[103,102],from:[222,108],fn:'es la parte más interna y es sólido, de hierro y níquel.'},
  'manto inferior':{at:[150,118],from:[222,140],fn:'es la parte más profunda del manto, que llega hasta unos 2900 km.'},
  'corteza oceánica':{at:[180,137],from:[222,172],fn:'es la corteza de los fondos oceánicos: más delgada (hasta unos 10 km), más densa y de basalto.'}};
const PART_NAMES=Object.keys(PARTS);
const earthRings=d=>circ(100,100,92,d,{t:.7})+circ(100,100,84,d+.4,{t:.6})+circ(100,100,64,d+.8,{t:.6})+circ(100,100,42,d+1.2,{t:.5})+circ(100,100,20,d+1.6,{t:.4})
  +stroke('M40.2 49.9A78 78 0 0 1 159.8 49.9',d+2,{c:'red',t:.5})+ln(40.2,49.9,29.5,40.9,d+2.4,{c:'red',t:.12})+ln(159.8,49.9,170.5,40.9,d+2.5,{c:'red',t:.12});
const earthInner=(d=0,mark,labels=[])=>earthRings(d)
  +(mark?pointer(...PARTS[mark].from,...PARTS[mark].at,d+2.8):'')
  +labels.map((p,k)=>pointer(...PARTS[p].from,...PARTS[p].at,d+2.8+k*.9)+tx(PARTS[p].from[0]+4,PARTS[p].from[1]+4,p,d+3.1+k*.9,{s:12,a:'start',c:'red'})).join('');
// Con marca: solo la flecha (para preguntar «¿qué capa es?»); con etiquetas: el dibujo explicado.
const earth=(d,mark,labels)=>sk(labels&&labels.length?340:262,200,earthInner(d,mark,labels),'earth');

/* ---------- nivel 1 · un planeta excepcional ---------- */
const COND=[['distancia adecuada del Sol','No hace ni demasiado calor ni demasiado frío para la vida.'],['tamaño adecuado','Su gravedad retiene la atmósfera y el agua.'],['agua en estado líquido','El agua líquida es imprescindible para los seres vivos.'],['presencia de atmósfera','Da el aire que respiramos y protege de la radiación y de los meteoritos.'],['campo magnético','Desvía las partículas peligrosas que llegan del Sol.']];
const SITUACIONES=[
  ['Un planeta está tan cerca de su estrella que el agua se evapora al instante.',0],['Un planeta está tan lejos de su estrella que toda el agua es hielo.',0],
  ['Un planeta es tan pequeño que el aire se escapa al espacio.',1],['Un planeta tiene rocas y aire, pero toda su agua es vapor o hielo, nunca líquida.',2],
  ['En un planeta sin atmósfera, los meteoritos llegan al suelo sin frenarse.',3],['Las partículas del Sol llegan sin freno a un planeta que no tiene escudo magnético.',4]];

/* ---------- nivel 2 · los subsistemas ---------- */
const SUBS=[['Geosfera','la parte sólida: los minerales y las rocas'],['Atmósfera','la parte gaseosa: el aire'],['Hidrosfera','toda el agua del planeta'],['Biosfera','el conjunto de los seres vivos']];
const ELEMENTOS=[['una roca de granito',0],['un mineral',0],['la arena de la playa',0],['la lava de un volcán',0],['el aire',1],['el viento',1],['el oxígeno del aire',1],['un río',2],['el mar',2],['un glaciar',2],['un lago',2],['un árbol',3],['un pez',3],['una persona',3],['un hongo',3]];
const INTERACCIONES=[['Las raíces de un árbol se agarran al suelo.','Biosfera y geosfera'],['Un pez respira el oxígeno que lleva el agua.','Biosfera e hidrosfera'],['Un ave vuela por el aire.','Biosfera y atmósfera'],['Un río arrastra y desgasta las rocas.','Hidrosfera y geosfera'],['El viento levanta polvo del suelo.','Atmósfera y geosfera']];
const INT_OPTS=['Biosfera y geosfera','Biosfera e hidrosfera','Biosfera y atmósfera','Hidrosfera y geosfera','Atmósfera y geosfera'];

/* ---------- nivel 3 y 4 · las capas ---------- */
const CAPAS=[['La capa más externa y más delgada','Corteza'],['La capa que está justo debajo de la corteza','Manto'],['La capa más interna','Núcleo'],['La capa que se fragmenta en placas tectónicas','Corteza'],['La capa que llega hasta unos 2900 km de profundidad','Manto'],['La capa formada sobre todo por hierro y níquel','Núcleo']];
const CAPA_NOMBRES=['Corteza','Manto','Núcleo'];
const COMPLETAR=[['La roca más abundante de la corteza continental es el','granito',['basalto','peridotita','hierro']],['La roca más abundante de la corteza oceánica es el','basalto',['granito','peridotita','níquel']],
  ['La roca más abundante del manto es la','peridotita',['granito','basalto','arena']],['Los principales componentes del núcleo son','hierro y níquel',['granito y basalto','peridotita y arena','oro y plata']]];
const VF=[['El núcleo externo es sólido.',false,'es líquido; el sólido es el núcleo interno.'],['El manto puede llegar a los 2900 km de profundidad.',true,''],['La roca principal de la corteza oceánica es el granito.',false,'es el basalto; el granito es de la corteza continental.'],
  ['La corteza oceánica es más gruesa que la continental.',false,'es más delgada (hasta unos 10 km) y más densa.'],['La litosfera está formada por la corteza y la parte más superficial del manto.',true,''],['El núcleo interno es sólido.',true,''],
  ['La geosfera es la parte gaseosa de la Tierra.',false,'es la parte sólida; la gaseosa es la atmósfera.']];
const CRUCI=[['Capa más interna de la geosfera','Núcleo'],['La que tiene más espesor de las dos litosferas','Continental'],['Parte del núcleo que es fluida','Externo'],['Capa con un espesor de unos 2900 km','Manto'],
  ['Capa formada por la corteza terrestre y la parte más superficial del manto','Litosfera'],['La más densa de las dos litosferas','Oceánica'],['Parte sólida de nuestro planeta','Geosfera'],['Uno de los dos elementos que forman mayoritariamente el núcleo','Hierro']];
const CRUCI_RESP=['Núcleo','Continental','Externo','Manto','Litosfera','Oceánica','Geosfera','Hierro','Corteza','Atmósfera','Hidrosfera','Basalto'];

const TIERRA_LEVELS=[
{ title:'Un planeta excepcional', sub:'Las condiciones que hacen posible la vida',
  lesson:[
    ['El único con vida',`<p>La Tierra es el <span class="hl">único planeta del Sistema Solar en el que hay vida</span>, porque reúne las condiciones adecuadas para ella.</p>`],
    ['Cinco condiciones',`<div class="tbl"><table><tr><th>Condición</th><th>¿Para qué sirve?</th></tr>${COND.map(([a,b])=>`<tr><td data-s="text-align:left"><b>${cap(a)}</b></td><td data-s="text-align:left">${b}</td></tr>`).join('')}</table></div>`],
    ['Error típico',`<div class="ex warn">«La vida existe porque hay mucha luz del Sol»</div><p>La luz ayuda, pero lo que cuenta es el conjunto: si falla <b>una</b> de las cinco condiciones (por ejemplo, el agua líquida), la vida tal como la conocemos no es posible.</p>`]
  ],
  gens:[
    ()=>{const [c]=pick(COND);return mc('¿Cuál de estas es una condición que hace posible la vida en la Tierra?',cap(c),['Tener anillos como Saturno','Tener muchas lunas','Estar sin atmósfera'],`${cap(c)}: ${COND.find(x=>x[0]===c)[1]}`)},
    ()=>{const [s,i]=pick(SITUACIONES);return mc(`${s}<br>¿Qué condición para la vida falla?`,cap(COND[i][0]),COND.filter((_,j)=>j!==i).map(x=>cap(x[0])).slice(0,3),`Falla la condición «${COND[i][0]}». ${COND[i][1]}`)},
    ()=>mc('¿Por qué decimos que la Tierra es un planeta excepcional?','Es el único planeta del Sistema Solar en el que hay vida',['Es el planeta más grande','Es el planeta más cercano al Sol','Es el único planeta con luna'],'Reúne las condiciones adecuadas para la vida: distancia, tamaño, agua líquida, atmósfera y campo magnético.'),
    ()=>mc('¿Qué hace el campo magnético de la Tierra?','Desvía las partículas peligrosas que llegan del Sol',['Produce la lluvia','Calienta el interior del planeta','Hace que haya mareas'],'El campo magnético funciona como un escudo frente a las partículas del Sol.'),
    ()=>tf(...pick([['La Tierra es el único planeta del Sistema Solar con vida.',true],['Para la vida basta con que el planeta esté a la distancia adecuada del Sol.',false,'hacen falta las cinco condiciones a la vez.'],['La atmósfera forma parte de las condiciones para la vida.',true],['El agua de la Tierra se encuentra solo en estado sólido.',false,'la vida necesita agua en estado líquido.']])),
    ()=>num('Distancia adecuada, tamaño adecuado, agua líquida, atmósfera y campo magnético: ¿cuántas condiciones hacen falta para la vida?',5,'Son cinco condiciones y deben darse todas a la vez.')
  ]},
{ title:'Los subsistemas terrestres', sub:'Geosfera, atmósfera, hidrosfera y biosfera',
  lesson:[
    ['Cuatro partes',`<p>En la Tierra se distinguen cuatro partes o <b>subsistemas</b> que se relacionan entre sí:</p>
     <div class="tbl"><table>${SUBS.map(([a,b])=>`<tr><td data-s="text-align:left"><b>${a}</b></td><td data-s="text-align:left">${cap(b)}</td></tr>`).join('')}</table></div>`],
    ['La geosfera, el soporte',`<p>La <b>geosfera</b> es la parte sólida y actúa como <span class="hl">soporte</span> del resto de componentes: sobre ella se asienta el agua, el aire y los seres vivos.</p>`],
    ['Todo se relaciona',`<p>Los subsistemas interactúan: un árbol (<b>biosfera</b>) agarra sus raíces al suelo (<b>geosfera</b>), toma agua (<b>hidrosfera</b>) y aire (<b>atmósfera</b>).</p>`],
    ['Error típico',`<div class="ex warn">«La biosfera son solo los animales»</div><p>La <b>biosfera</b> es <b>todos</b> los seres vivos: animales, plantas, hongos y microorganismos, también las personas.</p>`]
  ],
  gens:[
    ()=>{const [e,i]=pick(ELEMENTOS);return mc(`¿A qué subsistema terrestre pertenece <b>${e}</b>?`,SUBS[i][0],SUBS.filter((_,j)=>j!==i).map(x=>x[0]),`${cap(e)} pertenece a la ${SUBS[i][0].toLowerCase()}: ${SUBS[i][1]}.`)},
    ()=>{const i=Math.floor(Math.random()*4);return mc(`¿Qué subsistema terrestre es <b>${SUBS[i][1]}</b>?`,SUBS[i][0],SUBS.filter((_,j)=>j!==i).map(x=>x[0]),`La ${SUBS[i][0].toLowerCase()} es ${SUBS[i][1]}.`)},
    ()=>{const [t,r]=pick(INTERACCIONES);return mc(`${t}<br>¿Qué dos subsistemas se relacionan?`,r,INT_OPTS.filter(x=>x!==r).slice(0,3),`Se relacionan: ${r.toLowerCase()}.`)},
    ()=>mc('¿Qué subsistema actúa como soporte del resto de componentes?','Geosfera',['Atmósfera','Hidrosfera','Biosfera'],'La geosfera, la parte sólida, es el soporte de todo lo demás.'),
    ()=>tf(...pick([['La atmósfera es la parte gaseosa de la Tierra.',true],['La hidrosfera incluye toda el agua del planeta.',true],['La biosfera es la parte sólida de la Tierra.',false,'es el conjunto de seres vivos; la parte sólida es la geosfera.'],['Las personas pertenecemos a la biosfera.',true],['Los minerales y las rocas forman la hidrosfera.',false,'forman la geosfera.']])),
    ()=>mc('¿Cuántos subsistemas terrestres se distinguen?','Cuatro',['Dos','Tres','Cinco'],'Geosfera, atmósfera, hidrosfera y biosfera: cuatro.')
  ]},
{ title:'Las capas de la geosfera', sub:'Corteza, manto y núcleo, ordenadas por densidad',
  lesson:[
    ['¿Qué hay bajo nuestros pies?',`<p>El interior de la Tierra se divide en <span class="hl">tres capas, ordenadas según su densidad</span>: <b>corteza</b>, <b>manto</b> y <b>núcleo</b>.</p>`],
    ['La Tierra en corte',`<div class="row" data-s="justify-content:center">${earth(0,null,PART_NAMES)}</div>
     <p>La <b>corteza</b> se divide en continental y oceánica; el <b>manto</b>, en superior e inferior; y el <b>núcleo</b>, en externo e interno.</p>`],
    ['La corteza',`<p>Es la capa <b>más externa y más delgada</b>. Está formada por rocas sólidas y rígidas y se fragmenta en <span class="hl">placas tectónicas</span>.</p>`],
    ['Error típico',`<div class="ex warn">«El interior de la Tierra es todo de lava»</div><p>No: la corteza y casi todo el manto son <b>sólidos</b>. Solo el <b>núcleo externo</b> es líquido.</p>`]
  ],
  gens:[
    ()=>{const p=pick(PART_NAMES);return mc(`¿Qué parte de la geosfera señala la flecha?${earth(0,p)}`,cap(p),shuffle(PART_NAMES.filter(x=>x!==p)).slice(0,3).map(cap),`${cap(p)}: ${PARTS[p].fn}`)},
    ()=>{const [d,c]=pick(CAPAS);return mc(`¿Qué capa de la geosfera es esta?<br><b>${d}</b>`,c,CAPA_NOMBRES.filter(x=>x!==c),`${d}: ${c.toLowerCase()}.`)},
    ()=>{const p=pick(PART_NAMES);return mc(`¿Qué parte de la geosfera es esta?<br><b>${cap(PARTS[p].fn.replace(/^es /,''))}</b>`,cap(p),shuffle(PART_NAMES.filter(x=>x!==p)).slice(0,3).map(cap),`Es ${p.startsWith('corteza')?'la':'el'} ${p}.`)},
    ()=>mc('¿En qué se fragmenta la corteza terrestre?','En placas tectónicas',['En manto superior e inferior','En capas de agua','En núcleos'],'La corteza está rota en grandes trozos llamados placas tectónicas.'),
    ()=>mc('¿Cuántas capas principales tiene la geosfera?','Tres: corteza, manto y núcleo',['Dos: corteza y núcleo','Cuatro: corteza, manto, núcleo y atmósfera','Seis: corteza, manto, núcleo, hidrosfera, biosfera y atmósfera'],'Las tres capas se ordenan según su densidad: corteza, manto y núcleo. Las seis partes del dibujo son subdivisiones de esas tres.'),
    ()=>tf(...pick([['La corteza es la capa más externa y más delgada.',true],['El núcleo es la capa más externa de la geosfera.',false,'es la más interna.'],['El manto está entre la corteza y el núcleo.',true],['Todo el interior de la Tierra es líquido.',false,'solo el núcleo externo es líquido.']]))
  ]},
{ title:'Corteza, manto y núcleo en detalle', sub:'Rocas, espesores, estados y litosfera',
  lesson:[
    ['Las rocas y los espesores',`<div class="tbl"><table><tr><th>Capa</th><th>Roca o material</th><th>Espesor / profundidad</th><th>Estado</th></tr>
      <tr><td>Corteza continental</td><td>Granito</td><td>hasta unos 70 km</td><td>Sólida</td></tr>
      <tr><td>Corteza oceánica</td><td>Basalto</td><td>hasta unos 10 km (más densa)</td><td>Sólida</td></tr>
      <tr><td>Manto</td><td>Peridotita</td><td>hasta unos 2900 km</td><td>Sólido</td></tr>
      <tr><td>Núcleo</td><td>Hierro y níquel</td><td>—</td><td>Externo líquido · interno sólido</td></tr></table></div>`],
    ['La litosfera',`<p>La <span class="hl">litosfera</span> es la capa formada por la <b>corteza terrestre y la parte más superficial del manto</b>. Hay dos: la <b>continental</b> (la de más espesor) y la <b>oceánica</b> (la más densa).</p>`],
    ['El núcleo',`<p>Está formado sobre todo por <b>hierro y níquel</b>. El <b>núcleo externo es líquido</b> (fluido) y el <b>núcleo interno es sólido</b>.</p>`],
    ['Error típico',`<div class="ex warn">«El núcleo externo es sólido»</div><p>Es al revés: el externo es <b>líquido</b>. El sólido es el <b>interno</b>.</p>`]
  ],
  gens:[
    ()=>{const [f,r,ws]=pick(COMPLETAR);return mc(`Completa: «${f} …»`,r,ws,`${f} ${r}.`)},
    ()=>tf(...pick(VF)),
    ()=>{const [p,r]=pick(CRUCI);const ws=shuffle(CRUCI_RESP.filter(x=>x!==r)).slice(0,3);return mc(`Pista de crucigrama:<br><b>${p}</b>`,r,ws,`${r}: ${p.toLowerCase()}.`)},
    ()=>{const [t,v]=pick([['continental',70],['oceánica',10]]);return num(`Bajas por la corteza ${t} (hasta unos ${v} km) y llegas al manto. Si el manto llega hasta unos 2900 km de profundidad, ¿cuántos kilómetros más tendrías que bajar para llegar al final del manto?`,2900-v,`Se resta: 2900 − ${v} = ${2900-v} km.`,'Escribe solo el número de kilómetros.')},
    ()=>mc('¿Cuál de las dos litosferas tiene más espesor?','La continental',['La oceánica','Las dos tienen el mismo','Ninguna'],'La litosfera continental es la de más espesor; la oceánica es la más densa.'),
    ()=>{const [n,e,o]=pick([['externo','líquido (fluido)',['Sólido','Gaseoso','Pastoso']],['interno','sólido',['Líquido (fluido)','Gaseoso','Pastoso']]]);return mc(`¿En qué estado está el núcleo ${n}?`,cap(e),o,`El núcleo ${n} es ${e}.`)}
  ]}
];

/* ---------- relatos: «Un viaje al centro de la Tierra» ---------- */
const planet=(cx,cy,r,d)=>circ(cx,cy,r,d,{c:'blue',t:.6});
const TIERRA_ANIMS=[
[ // 1 · Un planeta excepcional
  {say:'Ana y Leo viajan en una cápsula imaginaria. Desde el espacio miran la Tierra y apuntan en una lista todo lo que la hace especial.',
   show:sk(280,140,person(36,30,0,'Ana')+person(96,30,.4,'Leo')+planet(200,70,46,1)+ln(172,56,226,44,1.8,{c:'green',t:.3})+ln(170,84,230,92,2,{c:'green',t:.3}))},
  {say:'La Tierra está a la distancia justa del Sol: ni tan cerca que todo se queme, ni tan lejos que todo se congele. Por eso tiene agua en estado líquido.',
   show:sk(300,120,dot(36,60,24,0,'red')+tx(36,106,'Sol',.6,{s:13})+arrow(66,60,130,60,.9,'blue')+planet(170,60,22,1.6)+tx(170,106,'Tierra',2.2,{s:13})+tx(250,56,'agua',2.6,{s:15,c:'blue'})+tx(250,78,'líquida ✓',3,{s:15,c:'green'}))},
  {say:'¿Qué condición para la vida falla en este planeta?',ask:()=>TIERRA_LEVELS[0].gens[1]()},
  {say:'Además, la Tierra tiene el tamaño adecuado, una atmósfera que da aire y protege, y un campo magnético que desvía las partículas peligrosas del Sol. Son cinco condiciones.',
   show:line(at(0,'<b>1</b> distancia · <b>2</b> tamaño · <b>3</b> agua líquida'))+line(at(1.4,'<b>4</b> atmósfera · <b>5</b> campo magnético'))+line(at(2.6,'las cinco a la vez','good'))},
  {say:'¿Cuál es una de esas condiciones?',ask:()=>TIERRA_LEVELS[0].gens[0]()},
  {say:'En la vida real: la brújula funciona gracias al campo magnético de la Tierra. Su aguja se orienta siempre hacia el norte, sin necesidad de pilas.',
   show:real('la brújula',sk(240,130,circ(120,66,48,0,{t:.6})+ln(120,66,120,30,.8,{c:'red',t:.3})+ln(120,66,120,102,1.2,{c:'blue',t:.3})+tx(120,22,'N',1.6,{s:16,c:'red'})+tx(120,124,'S',1.8,{s:16,c:'blue'})))},
  {say:'¿Por qué es la Tierra un planeta excepcional?',ask:()=>TIERRA_LEVELS[0].gens[2]()}
],
[ // 2 · Los subsistemas
  {say:'La cápsula aterriza. Ana y Leo miran el paisaje y descubren que la Tierra se compone de cuatro partes que se relacionan.',
   show:sk(300,140,stroke('M10 110L60 50L95 90L130 40L180 110Z',0,{t:.8})+stroke('M180 110Q200 100 220 110T260 110T300 110',1.2,{c:'blue',t:.6})+tx(150,132,'~~~',1.6,{s:14,c:'blue'})+circ(230,40,14,1.8,{c:'red'})+stroke('M30 28Q40 14 60 22Q80 12 90 30Q70 36 30 28',2.2,{c:'blue',t:.5}))},
  {say:'La geosfera es la parte sólida, con rocas y minerales. La atmósfera es la parte gaseosa. La hidrosfera es toda el agua. La biosfera son los seres vivos.',
   show:line(at(0,'<b>Geosfera</b> · sólida'))+line(at(1,'<b>Atmósfera</b> · gaseosa'))+line(at(2,'<b>Hidrosfera</b> · agua'))+line(at(3,'<b>Biosfera</b> · seres vivos'))},
  {say:'¿A qué subsistema pertenece este elemento?',ask:()=>TIERRA_LEVELS[1].gens[0]()},
  {say:'Los subsistemas se relacionan. Un árbol vive en la biosfera, agarra sus raíces al suelo de la geosfera, toma agua de la hidrosfera y aire de la atmósfera.',
   show:sk(280,140,ln(100,60,100,110,0,{t:.4})+stroke('M100 60Q70 40 60 20Q90 20 100 50Q112 24 140 24Q130 50 100 62',.6,{c:'green',t:.8})+ln(100,110,80,128,1.6,{t:.25})+ln(100,110,120,128,1.8,{t:.25})+tx(210,50,'aire',2.2,{s:14,c:'blue'})+tx(210,90,'agua',2.6,{s:14,c:'blue'})+tx(210,128,'suelo',3,{s:14}))},
  {say:'¿Qué subsistemas se relacionan aquí?',ask:()=>TIERRA_LEVELS[1].gens[2]()},
  {say:'En la vida real: un acuario con peces, agua, piedras y aire lleva los cuatro subsistemas en pequeño. Es una Tierra en miniatura.',
   show:real('un acuario',sk(260,120,box(40,20,180,86,0,{t:.8})+ln(40,40,220,40,.9,{c:'blue',t:.5})+ell(110,68,14,7,1.4,{c:'red'})+ln(124,68,134,62,1.8,{t:.12})+ln(124,68,134,74,1.9,{t:.12})+dot(70,98,5,2.2)+dot(88,98,4,2.3)+tx(130,16,'aire',2.6,{s:12})))},
  {say:'¿Qué subsistema es este?',ask:()=>TIERRA_LEVELS[1].gens[1]()}
],
[ // 3 · Las capas
  {say:'Ana y Leo empiezan a bajar con la cápsula. Bajo sus pies hay tres capas, ordenadas por densidad: la corteza, el manto y el núcleo.',
   show:sk(280,130,person(30,16,0,'Ana')+ln(70,60,70,110,.6,{c:'red',t:.4})+arrow(70,68,70,112,.8,'red')+tx(150,46,'corteza',1.4,{s:16})+tx(150,76,'manto',2.2,{s:16})+tx(150,106,'núcleo',3,{s:16}))},
  {say:'Primero cruzan la corteza: la capa más externa y más delgada. Es de roca sólida y rígida, y está rota en grandes trozos llamados placas tectónicas.',
   show:sk(300,110,stroke('M10 40L90 40L90 60L10 60Z',0,{t:.7})+stroke('M100 40L200 40L200 60L100 60Z',.5,{t:.7})+stroke('M210 40L290 40L290 60L210 60Z',1,{t:.7})+tx(150,96,'placas tectónicas',1.8,{s:15,c:'red'}))},
  {say:'¿Qué capa es esta?',ask:()=>TIERRA_LEVELS[2].gens[1]()},
  {say:'Más abajo está el manto y, en el centro, el núcleo. En el dibujo, la corteza se divide en continental y oceánica; el manto, en superior e inferior; y el núcleo, en externo e interno.',
   show:`<div class="row instrow">${earth(0,null,PART_NAMES)}</div>`},
  {say:'Señala la capa del dibujo.',ask:()=>TIERRA_LEVELS[2].gens[0]()},
  {say:'En la vida real: un huevo cocido se parece a la Tierra. La cáscara es la corteza, la clara es el manto y la yema es el núcleo.',
   show:real('un huevo',sk(240,140,ell(120,66,70,52,0,{t:.8})+ell(120,66,56,40,.8,{c:'blue',t:.7})+circ(120,66,22,1.6,{c:'red',t:.5})+tx(120,70,'yema',2.2,{s:13})+tx(120,41,'clara',2.4,{s:12,c:'blue'})+tx(120,134,'cáscara',2.6,{s:13})))},
  {say:'¿Cuántas capas principales tiene la geosfera?',ask:()=>TIERRA_LEVELS[2].gens[4]()}
],
[ // 4 · Corteza, manto y núcleo en detalle
  {say:'En cada parada del viaje, Ana y Leo anotan la roca, el grosor y el estado. En los continentes la corteza llega a unos setenta kilómetros y su roca es el granito.',
   show:line(at(0,'<b>Corteza continental</b>'))+line(at(1,'granito · hasta unos 70 km · sólida'))},
  {say:'Bajo los océanos la corteza es más delgada, unos diez kilómetros, y más densa. Su roca es el basalto. Después empieza el manto, hasta unos dos mil novecientos kilómetros, de peridotita.',
   show:line(at(0,'<b>Corteza oceánica</b>'))+line(at(1,'basalto · hasta unos 10 km · más densa'))+line(at(2.4,'<b>Manto</b>: peridotita · hasta unos 2900 km'))},
  {say:'Completa la frase.',ask:()=>TIERRA_LEVELS[3].gens[0]()},
  {say:'El núcleo es de hierro y níquel. Leo dice que el núcleo externo es sólido. ¡No! El externo es líquido, y solo el núcleo interno es sólido.',
   show:line(strike(at(0,'núcleo externo: sólido','bad'),1.4))+line(at(2,'externo: <b>líquido</b> · interno: <b>sólido</b>','good'))},
  {say:'¿Verdadero o falso?',ask:()=>TIERRA_LEVELS[3].gens[1]()},
  {say:'La litosfera es la capa formada por la corteza y la parte más superficial del manto. Hay dos: la continental, con más espesor, y la oceánica, más densa.',
   show:line(at(0,'<b>Litosfera</b> = corteza + parte superficial del manto'))+line(at(1.8,'continental: más espesor'))+line(at(2.8,'oceánica: más densa'))},
  {say:'¿Qué litosfera tiene más espesor?',ask:()=>TIERRA_LEVELS[3].gens[4]()},
  {say:'En la vida real: una erupción volcánica es una señal de lo que hay bajo la corteza. La roca del interior, muy caliente, sale a la superficie como lava.',
   show:real('un volcán',sk(240,130,stroke('M20 118L90 40L150 40L220 118Z',0,{t:.8})+ln(110,40,100,14,.9,{c:'red',t:.3})+ln(130,40,142,10,1,{c:'red',t:.3})+ln(120,40,120,6,1.1,{c:'red',t:.3})+tx(120,100,'lava',1.8,{s:15,c:'red'})))},
  {say:'Para terminar, calcula una profundidad.',ask:()=>TIERRA_LEVELS[3].gens[3]()}
]];

export { TIERRA_LEVELS, TIERRA_ANIMS };
