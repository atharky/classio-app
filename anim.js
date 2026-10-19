import { ri, pick, shuffle, fmt, P, R, mc, num, POT_LEVELS, RAI_LEVELS } from './data.js';

import { at, seq, line, lab, strike, real, sk, stroke, ln, box, fill, tx, arrow, grid, dots, circ, dot, person, bubble } from './sketch.js';

const factors=(b,e,start=0,step=.35)=>seq(Array(e).fill(String(b)).flatMap((x,k)=>k?['·',x]:[x]),start,step/2);
// Montón de n trozos de papel apilados (de abajo arriba), con la esquina inferior izquierda en (x,y).
const stack=(x,y,n,d,{w=48,h=28}={})=>Array.from({length:n},(_,i)=>box(x+i*3,y-h-i*5,w,h,d+i*.12,{t:.25})).join('');
// Cubo en perspectiva con la cara frontal cuadriculada.
const cube=d=>sk(110,110,box(10,35,60,60,d)+ln(30,35,30,95,d+.7)+ln(50,35,50,95,d+.8)+ln(10,55,70,55,d+.9)+ln(10,75,70,75,d+1)+stroke('M10 35L35 12L95 12L70 35',d+1.2,{t:.5})+stroke('M70 95L95 72L95 12',d+1.6,{t:.4}),'cube');
// Sobre de cromos y bolsa de chuches.
const envelope=(x,y,d)=>box(x,y,44,34,d,{t:.3})+stroke(`M${x} ${y}L${x+22} ${y+16}L${x+44} ${y}`,d+.3,{t:.2});
const bag=(x,y,d)=>stroke(`M${x} ${y+8}L${x+26} ${y+8}L${x+30} ${y+56}L${x-4} ${y+56}Z`,d,{t:.3})+stroke(`M${x+6} ${y+8}Q${x+13} ${y-6} ${x+20} ${y+8}`,d+.2,{c:'red',t:.15});
// Árbol de divisiones: 1 → 2 → 4 → …, un nivel por segundo.
const tree=(levels,d0)=>{const W=280;let s='';
  for(let l=0;l<levels;l++){const n=2**l,y=18+l*36;
    for(let i=0;i<n;i++){const x=(i+.5)*W/n;s+=circ(+x.toFixed(1),y,l<3?9:7,d0+l*1.1+i*.05,{c:'blue'});
      if(l)s+=ln(+((Math.floor(i/2)+.5)*W/(n/2)).toFixed(1),y-36+9,+x.toFixed(1),y-(l<3?9:7),d0+l*1.1-.3,{t:.25})}}
  return sk(W,18+(levels-1)*36+14,s)};
const POT_ANIMS=[
[ // 1 · ¿Qué es una potencia? — relato piloto: «Lucía y el folio»
  {say:'Esta es Lucía. Tiene un folio y unas tijeras. Corta el folio por la mitad y pone un trozo encima del otro: ahora tiene dos trozos.',
   show:sk(290,150,person(36,38,0,'Lucía')+box(82,30,62,86,.9,{t:.6})+ln(82,73,144,73,1.8,{c:'red',t:.5})+arrow(154,73,184,73,2.5,'blue')+stack(200,96,2,3.1)+tx(232,140,'2 trozos',3.8,{s:15}))},
  {say:'Corta el montón otra vez por la mitad: cuatro trozos. Y otra vez: ocho. ¡En cada corte los trozos se duplican!',
   show:sk(300,150,stack(12,104,2,0)+tx(36,140,'1 corte',.5,{s:13})+arrow(70,82,100,82,.9,'blue')+tx(85,70,'×2',1.1,{s:14,c:'red'})
     +stack(110,104,4,1.4)+tx(134,140,'2 cortes',2,{s:13})+arrow(168,82,198,82,2.4,'blue')+tx(183,70,'×2',2.6,{s:14,c:'red'})
     +stack(208,104,8,2.9)+tx(232,140,'3 cortes',3.8,{s:13}))
     +line(`${at(4.2,'2')} ${at(4.6,'→ 2 · 2 = 4')} ${at(5.4,'→ 2 · 2 · 2 = <b>8</b>')}`)},
  {say:'Lucía sigue cortando. Calcula cuántos trozos tendrá.',ask:()=>{const n=ri(4,6);return num(`Lucía corta el montón por la mitad ${n} veces seguidas. ¿Cuántos trozos tiene al final?`,2**n,`Cada corte duplica los trozos: ${Array(n).fill(2).join(' · ')} = ${2**n}.`)}},
  {say:'Contarlo así es largo: después de cinco cortes serían dos por dos por dos por dos por dos. Los matemáticos lo escriben más corto: dos elevado a cinco.',
   show:line(strike(factors(2,5,0,.5),2.6))+line(at(3.4,`= ${P(2,5)}`),'big')+line(at(4.6,'¡mucho más corto!','good'))},
  {say:'El dos es la base: el número que se multiplica. El cinco es el exponente: cuántas veces se multiplica. En la historia de Lucía, el exponente es el número de cortes.',
   show:line(`${lab('2','base',0)}${lab('<sup>5</sup>','exponente',1.2,true)}`,'big')+line(at(2.4,'base → lo que se multiplica: <b>×2</b>'))+line(at(3.8,'exponente → el número de <b>cortes</b>'))},
  {say:'Ahora escríbelo tú como potencia.',ask:POT_LEVELS[0].gens[1]},
  {say:'Se lee así: cinco al cuadrado, porque cinco por cinco forma un cuadrado. Cuatro al cubo, porque forma un cubo. Desde el exponente cuatro decimos elevado a.',
   show:`<div class="row instrow">${grid(5,0,{size:76})}${cube(1.8)}</div>`+line(at(3,`${P(5,2)} → cinco <b>al cuadrado</b>`))+line(at(4.2,`${P(4,3)} → cuatro <b>al cubo</b>`))+line(at(5.4,`${P(2,6)} → dos <b>elevado a</b> seis`))},
  {say:'Marcos, el amigo de Lucía, dice que dos elevado a cinco es diez, porque dos por cinco es diez. Lucía cuenta su montón: ¡treinta y dos trozos!',
   show:sk(300,150,person(46,52,0,'Marcos')+bubble(66,6,70,32,'¡10!',.7,{s:18,c:'red'})+person(254,52,1.6,'Lucía')+bubble(170,6,70,32,'¡32!',2.3,{s:18})+stack(140,128,8,3,{w:34,h:20}))
     +line(`${at(3.8,`${P(2,5)} ≠ 2 · 5`,'bad')} &nbsp; ${at(4.8,`${P(2,5)} = <b>32</b>`,'good')}`)},
  {say:'El exponente no multiplica a la base: cuenta cuántas veces se repite. Compruébalo.',ask:POT_LEVELS[0].gens[5]},
  {say:'En la vida real: una bacteria se divide en dos cada veinte minutos. Tras cinco divisiones hay dos elevado a cinco: treinta y dos bacterias. ¡Igual que los cortes de Lucía!',
   show:real('las bacterias',tree(4,0))+line(at(4.4,`1 → 2 → 4 → 8 → … → ${P(2,5)} = <b>32</b>`))},
  {say:'¿Cuántas bacterias habrá?',ask:()=>{const n=ri(3,7);return num(`Una bacteria se divide en dos cada veinte minutos. Si empiezas con una, ¿cuántas bacterias hay después de ${n} divisiones?`,2**n,`Cada división duplica las bacterias: ${P(2,n)} = ${2**n} bacterias.`)}}
],
[ // 2 · Cuadrados, cubos y casos especiales — relato: «Carla y las baldosas»
  {say:'Carla va a poner baldosas en un patio cuadrado de cuatro baldosas de lado. Necesita cuatro filas de cuatro: cuatro al cuadrado, dieciséis baldosas.',
   show:`<div class="row instrow">${sk(110,140,person(30,30,0,'Carla'),'inst')}${grid(4,.6,{size:110})}</div>`+line(at(2.6,`${P(4,2)} = 4 · 4 = <b>16</b> baldosas`))},
  {say:'Ahora tú: ¿cuántas baldosas hacen falta?',ask:POT_LEVELS[1].gens[0]},
  {say:'Mientras tanto, su hermano monta con cubitos de madera un cubo de tres por tres por tres. Tres al cubo: veintisiete cubitos.',
   show:`<div class="row instrow">${cube(0)}</div>`+line(at(2,`${P(3,3)} = 3 · 3 · 3 = <b>27</b>`))},
  {say:'Carla apila baldosas: ocho, luego la mitad, cuatro, luego dos y luego una. Cada paso divide entre la base. Por eso dos elevado a cero vale uno.',
   show:sk(300,110,stack(8,92,8,0,{w:36,h:18})+tx(28,108,'2³ = 8',1,{s:13})
     +stack(88,92,4,1.2,{w:36,h:18})+tx(106,108,'2² = 4',1.8,{s:13})+stack(164,92,2,2.2,{w:36,h:18})+tx(184,108,'2¹ = 2',2.6,{s:13})
     +stack(238,92,1,3,{w:36,h:18})+tx(256,108,'2⁰ = 1',3.4,{s:13,c:'red'}))+line(at(3.8,'cada paso: <b>dividir entre la base</b>'))},
  {say:'Cualquier número distinto de cero elevado a cero vale uno, y elevado a uno se queda igual.',ask:POT_LEVELS[1].gens[2]},
  {say:'Su hermano dice que dos al cubo y tres al cuadrado son lo mismo. Carla lo comprueba con baldosas: ocho contra nueve. Cambiar base y exponente cambia el resultado.',
   show:`<div class="row instrow">${sk(110,110,stack(30,96,8,0,{w:44,h:24}),'inst')}${grid(3,1.2,{size:80})}</div>`+line(`${at(2.4,`${P(2,3)} = 8`)} &nbsp; ${at(3,'≠','bad')} &nbsp; ${at(3.4,`${P(3,2)} = 9`)}`)},
  {say:'En la vida real: en el almacén guardan las baldosas en cajas de diez, palés de cien y camiones de mil. Las potencias de diez llevan tantos ceros como dice el exponente.',
   show:real('el almacén',sk(300,90,box(10,40,30,30,0,{t:.4})+tx(25,86,'10',.4,{s:13})+box(80,20,60,50,.8,{t:.5})+tx(110,86,'100',1.2,{s:13})+stroke('M180 70L180 30L250 30L250 70Z M250 45L280 45L290 60L290 70L250 70',1.6,{t:.7})+circ(200,74,6,2.2)+circ(270,74,6,2.3)+tx(235,86,'1000',2.6,{s:13}))
     +line(`${at(3,`${P(10,1)} = 10`)} · ${at(3.6,`${P(10,2)} = 100`)} · ${at(4.2,`${P(10,3)} = 1000`)}`))},
  {say:'¿Cuántos ceros tiene?',ask:POT_LEVELS[1].gens[3]}
],
[ // 3 · Potencias de números negativos — relato: «El baile de Nico»
  {say:'Nico juega a un baile: cada signo menos le obliga a dar media vuelta. Empieza mirando hacia delante, hacia los números positivos.',
   show:sk(280,120,person(50,24,0,'Nico')+arrow(90,50,170,50,1,'blue')+tx(200,56,'+',1.5,{s:26,c:'green'}))},
  {say:'Menos dos por menos dos: dos signos menos, dos medias vueltas. Nico vuelve a mirar hacia delante. El resultado es positivo: más cuatro.',
   show:sk(280,70,arrow(20,35,70,35,0,'blue')+arrow(150,35,100,35,.8,'red')+arrow(180,35,230,35,1.6,'blue')+tx(255,41,'+',2.2,{s:24,c:'green'}))+line(at(2.6,'(−2) · (−2) = <b class="good">+4</b>'),'big')},
  {say:'Con tres signos menos da tres medias vueltas y acaba mirando hacia atrás: menos ocho. Exponente par, positivo. Exponente impar, negativo.',
   show:line(at(0,'(−2) · (−2) · (−2) = <b class="bad">−8</b>'),'big')+line(at(1.6,'exponente <b>par</b> → +','good'))+line(at(2.6,'exponente <b>impar</b> → −','bad'))},
  {say:'Ahora tú: ¿positivo o negativo?',ask:POT_LEVELS[2].gens[1]},
  {say:'Su amiga Eva escribe menos tres al cuadrado, sin paréntesis, y le sale nueve. ¡Error! Sin paréntesis, el exponente solo afecta al tres: menos nueve.',
   show:sk(280,110,person(40,30,0,'Eva')+bubble(64,4,120,32,'−3² = 9',.7,{s:16,c:'red'})+ln(80,10,170,32,1.6,{c:'red',t:.3}))
     +line(at(2,`${P(-3,2)} = 9`,'good'))+line(at(3,'−3<sup>2</sup> = −(3 · 3) = −9','bad'))},
  {say:'Calcula esta, sin paréntesis.',ask:POT_LEVELS[2].gens[2]},
  {say:'En la vida real: las calculadoras científicas siguen la misma regla. Si tecleas menos tres al cuadrado sin paréntesis, te da menos nueve. Con paréntesis, nueve.',
   show:real('la calculadora',sk(260,130,box(70,6,120,120,0,{t:.7})+box(84,16,92,30,.6,{t:.4})+tx(130,38,'−3² = −9',1.2,{s:14,c:'red'})
     +[0,1,2].map(r=>[0,1,2].map(c=>box(88+c*30,56+r*22,22,16,1.6+r*.2+c*.06,{t:.15})).join('')).join(''))+line(at(2.8,'(−3)² = 9 · −3² = −9')))},
  {say:'Calcula la potencia.',ask:POT_LEVELS[2].gens[0]}
],
[ // 4 · Multiplicar y dividir con la misma base — relato: «Los cromos de Hugo»
  {say:'Hugo colecciona cromos. Tiene dos al cuadrado sobres, cuatro, y cada sobre trae dos al cubo cromos, ocho.',
   show:sk(300,110,person(30,24,0,'Hugo')+[0,1,2,3].map(k=>envelope(76+k*56,26,.8+k*.4)+tx(98+k*56,80,'8',1.2+k*.4,{s:15,c:'blue'})).join('')+tx(186,104,'4 sobres de 8 cromos',2.8,{s:13}))
     +line(at(3.2,`${P(2,2)} sobres · ${P(2,3)} cromos`))},
  {say:'En total: dos por dos, por dos por dos por dos. Cinco doses: dos elevado a cinco, treinta y dos cromos. Con la misma base, los exponentes se suman.',
   show:line(at(0,'(2 · 2) · (2 · 2 · 2)'))+line(at(1.4,`${P(2,'2+3')} = ${P(2,5)} = <b>32</b>`),'big')+line(at(3,`${P('a','m')} · ${P('a','n')} = ${P('a','m+n')}`))},
  {say:'Ahora tú: suma los exponentes.',ask:POT_LEVELS[3].gens[0]},
  {say:'Y si un número no lleva exponente, tiene exponente uno. Por eso dos por dos a la cuarta es dos a la quinta.',
   show:line(at(0,`2 · ${P(2,4)} = ${P(2,1)} · ${P(2,4)}`))+line(at(1.6,`= <b>${P(2,5)}</b>`),'big')},
  {say:'Hugo reparte dos elevado a seis cromos entre dos al cuadrado amigos. A cada uno le tocan dos elevado a cuatro: al dividir, se restan los exponentes.',
   show:sk(300,90,tx(40,50,'64',0,{s:26})+arrow(70,44,110,44,.6,'blue')+[0,1,2,3].map(k=>person(135+k*40,14,1+k*.3)).join('')+tx(195,88,'16 cada uno',2.6,{s:13}))
     +line(at(3,`${P(2,6)} : ${P(2,2)} = ${P(2,'6−2')} = <b>${P(2,4)}</b>`))},
  {say:'Reparte tú: resta los exponentes.',ask:POT_LEVELS[3].gens[1]},
  {say:'Su primo intenta juntar dos al cubo por tres al cuadrado en una sola potencia. ¡No se puede! Solo vale con la misma base. Se calcula cada una: ocho por nueve.',
   show:line(strike(at(0,`${P(2,3)} · ${P(3,2)} = ${P(6,5)}`,'bad'),1.4))+line(at(2.2,`${P(2,3)} · ${P(3,2)} = 8 · 9 = <b>72</b>`,'good'))},
  {say:'En la vida real: la memoria de los ordenadores se mide en potencias de dos. Dos elevado a diez bytes son unos mil: un kilobyte. Al multiplicar, los exponentes se suman.',
   show:real('la memoria del ordenador',sk(260,90,box(60,10,140,60,0,{t:.6})+[0,1,2,3,4,5].map(k=>ln(76+k*22,70,76+k*22,82,.6+k*.06,{t:.1})).join('')+tx(130,46,'2¹⁰ B ≈ 1 KB',1.2,{s:16})))
     +line(at(2.4,`${P(2,10)} · ${P(2,10)} = ${P(2,20)} ≈ 1 MB`))},
  {say:'¿Qué potencia sale?',ask:POT_LEVELS[3].gens[4]}
],
[ // 5 · Potencia de una potencia — relato: «El tablero de Mateo»
  {say:'Mateo dibuja un tablero de ajedrez. Tiene ocho casillas de lado, y ocho es dos al cubo.',
   show:`<div class="row instrow">${grid(8,0,{size:120,soft:false})}</div>`+line(at(2.2,`8 = ${P(2,3)} casillas de lado`))},
  {say:'Las casillas son ocho al cuadrado: dos al cubo, elevado al cuadrado. Se multiplican los exponentes: dos elevado a seis, sesenta y cuatro casillas.',
   show:line(at(0,`(${P(2,3)})<sup>2</sup> = ${P(2,3)} · ${P(2,3)}`))+line(at(1.6,`= ${P(2,'3·2')} = <b>${P(2,6)}</b> = 64`),'big')},
  {say:'Ahora tú: multiplica los exponentes.',ask:POT_LEVELS[4].gens[0]},
  {say:'Su amigo dice que tres al cuadrado, elevado a cuatro, es tres a la sexta. ¡No! Los exponentes se multiplican, no se suman: tres a la octava.',
   show:sk(260,70,person(36,6,0)+bubble(62,4,90,30,'¡3⁶!',.7,{s:16,c:'red'})+ln(70,8,146,32,1.4,{c:'red',t:.3}))+line(at(1.8,`(${P(3,2)})<sup>4</sup> = ${P(3,'2·4')} = <b>${P(3,8)}</b>`,'good'))},
  {say:'Para un torneo compra dos al cubo cajas, y cada caja trae cinco al cubo lápices. Con el mismo exponente se multiplican las bases: diez al cubo, mil lápices.',
   show:sk(300,70,Array.from({length:8},(_,k)=>box(8+k*36,14,28,28,k*.18,{t:.2})+tx(22+k*36,32,'125',.3+k*.18,{s:9})).join(''))
     +line(at(2,`${P(2,3)} · ${P(5,3)} = (2 · 5)<sup>3</sup> = ${P(10,3)} = <b>1000</b>`))},
  {say:'Usa el truco del diez.',ask:POT_LEVELS[4].gens[4]},
  {say:'Su hermana corta un mosaico de quince por quince baldosas en piezas de cinco por cinco. Salen tres por tres piezas: con el mismo exponente, se dividen las bases.',
   show:`<div class="row instrow">${grid(3,0,{size:100})}</div>`+line(at(2.2,`${P(15,2)} : ${P(5,2)} = (15 : 5)<sup>2</sup> = <b>${P(3,2)}</b> = 9`))},
  {say:'En la vida real: una foto de mil por mil píxeles tiene diez al cubo, elevado al cuadrado: diez elevado a seis, un millón de píxeles. Un megapíxel.',
   show:real('las fotos digitales',sk(260,100,box(70,10,120,80,0,{t:.6})+stroke('M80 80L110 46L130 66L150 40L180 80',.8,{c:'blue',t:.5})+circ(165,28,7,1.2,{c:'red'})))+line(at(2,`(${P(10,3)})<sup>2</sup> = ${P(10,6)} = 1 000 000`))},
  {say:'¿Qué potencia sale?',ask:POT_LEVELS[4].gens[3]}
],
[ // 6 · Operaciones combinadas — relato: «Las bolsas de Sofía»
  {say:'Sofía prepara bolsas de chuches para su cumpleaños. En cada una pone tres caramelos y reparte dos a la cuarta gominolas entre ocho bolsas.',
   show:sk(300,90,Array.from({length:8},(_,k)=>bag(10+k*36,24,k*.2)).join(''))+line(at(2,'3 + 2<sup>4</sup> : 8 = ?'),'big')},
  {say:'Para saber cuántas chuches lleva cada bolsa hay un orden: paréntesis, potencias, multiplicaciones y divisiones, y al final sumas y restas.',
   show:line(seq(['<span class="chip">1 · ( )</span>','<span class="chip">2 · potencias</span>','<span class="chip">3 · × :</span>','<span class="chip">4 · + −</span>'],0,.8))},
  {say:'Primero la potencia: dos a la cuarta, dieciséis. Luego la división: dieciséis entre ocho, dos. Y al final la suma: tres más dos, cinco chuches por bolsa.',
   show:line(at(0,`3 + ${P(2,4)} : 8`))+line(at(1.2,'= 3 + <b>16</b> : 8'))+line(at(2.4,'= 3 + <b>2</b>'))+line(at(3.4,'= <b>5</b> chuches'),'big')},
  {say:'Ahora tú: sigue el orden.',ask:POT_LEVELS[5].gens[3]},
  {say:'Su primo calcula dos más tres, al cuadrado, como cuatro más nueve. ¡Error! Primero el paréntesis: cinco al cuadrado, veinticinco.',
   show:line(strike(at(0,`(2 + 3)<sup>2</sup> = ${P(2,2)} + ${P(3,2)} = 13`,'bad'),1.4))+line(at(2,`(2 + 3)<sup>2</sup> = ${P(5,2)} = <b>25</b>`,'good'))},
  {say:'¿Cuánto vale?',ask:POT_LEVELS[5].gens[5]},
  {say:'Para las sorpresas, Sofía simplifica antes de calcular: dos a la quinta por dos al cubo, entre dos a la sexta, deja una sola potencia: dos al cuadrado, cuatro.',
   show:line(at(0,`(${P(2,5)} · ${P(2,3)}) : ${P(2,6)}`))+line(at(1.4,`= ${P(2,8)} : ${P(2,6)}`))+line(at(2.6,`= ${P(2,2)} = <b>4</b>`),'big')},
  {say:'En la vida real: las calculadoras científicas respetan este orden. Si tecleas tres más dos a la cuarta entre ocho, te da cinco.',
   show:real('la calculadora',sk(260,130,box(70,6,120,120,0,{t:.7})+box(84,16,92,30,.6,{t:.4})+tx(130,38,'3+2^4÷8 = 5',1.2,{s:12})
     +[0,1,2].map(r=>[0,1,2].map(c=>box(88+c*30,56+r*22,22,16,1.6+r*.2+c*.06,{t:.15})).join('')).join('')))},
  {say:'Simplifica tú.',ask:POT_LEVELS[5].gens[0]}
]];

const RAI_ANIMS=[
[ // 1 · ¿Qué es una raíz cuadrada? — relato: «El huerto de la abuela Rosa»
  {say:'La abuela Rosa quiere un huerto cuadrado de veinticinco metros cuadrados. ¿Cuánto debe medir cada lado?',
   show:sk(280,140,person(40,34,0,'Rosa')+box(110,20,110,110,.9,{t:.8})+tx(165,82,'25 m²',1.8,{s:20})+tx(165,138,'? m',2.4,{s:15,c:'red'}))},
  {say:'Prueba lados: con cuatro, cuatro por cuatro es dieciséis, se queda corto. Con cinco, cinco por cinco es veinticinco. ¡Justo! El lado mide cinco.',
   show:`<div class="row instrow">${grid(5,0,{size:100})}</div>`+line(`${at(1.8,'4 · 4 = 16 ✗','bad')} &nbsp; ${at(2.6,'5 · 5 = 25 ✓','good')}`)},
  {say:'Buscar el número que multiplicado por sí mismo da veinticinco es hacer la raíz cuadrada: raíz de veinticinco es cinco. Es lo contrario de elevar al cuadrado.',
   show:line(`${lab('√','radical',0,true)}${lab('25','radicando',.8)} ${lab('= 5','raíz',1.6,true)}`,'big')+line(at(2.6,`porque ${P(5,2)} = 25`))},
  {say:'Ahora tú: ¿cuánto mide el lado?',ask:RAI_LEVELS[0].gens[3]},
  {say:'Su nieto dice que raíz de dieciséis es ocho, la mitad. La abuela lo comprueba: ocho por ocho es sesenta y cuatro. Raíz de dieciséis es cuatro.',
   show:sk(280,100,person(40,20,0)+bubble(64,4,100,30,`√16 = 8`,.7,{s:15,c:'red'})+ln(72,8,160,32,1.4,{c:'red',t:.3}))+line(at(2,'8 · 8 = 64','bad'))+line(at(2.8,`${R(16)} = <b>4</b>`,'good'))},
  {say:'Calcula esta raíz.',ask:RAI_LEVELS[0].gens[0]},
  {say:'En la vida real: para comprar la valla, la abuela necesita el lado. Un huerto de treinta y seis metros cuadrados tiene seis metros de lado: veinticuatro de valla.',
   show:real('la valla del huerto',sk(260,130,box(70,14,100,100,0,{t:.8})+Array.from({length:6},(_,k)=>ln(70+k*20,8,70+k*20,20,.9+k*.06,{t:.1})).join('')+tx(120,70,'36 m²',1.4,{s:18})+tx(120,130,'6 m',1.8,{s:14,c:'red'})))
     +line(at(2.4,`${R(36)} = 6 · valla: 4 · 6 = <b>24</b> m`))},
  {say:'¿Cuánto vale?',ask:RAI_LEVELS[0].gens[4]}
],
[ // 2 · Cuadrados perfectos — relato: «La foto de clase»
  {say:'La profesora Inés quiere hacer la foto de clase con los alumnos formando un cuadrado. Con dieciséis alumnos salen cuatro filas de cuatro.',
   show:sk(260,120,person(40,24,0,'Inés')+Array.from({length:16},(_,k)=>dot(120+(k%4)*28,18+Math.floor(k/4)*28,9,.8+k*.08,'blue')).join(''))+line(at(2.4,`${R(16)} = <b>4</b> filas de 4`))},
  {say:'Los números que forman un cuadrado así se llaman cuadrados perfectos: uno, cuatro, nueve, dieciséis, veinticinco… Su raíz es exacta.',
   show:line(seq([1,4,9,16,25,36,49,64,81,100].map(n=>`<b>${n}</b>`),0,.3))+line(at(3.4,'raíz exacta','good'))},
  {say:'¿Cuál es un cuadrado perfecto?',ask:RAI_LEVELS[1].gens[1]},
  {say:'Para la foto del colegio entero hay novecientos alumnos. Novecientos acaba en una pareja de ceros: la raíz lleva un cero. Salen treinta filas de treinta.',
   show:line(at(0,`${R(9)} = 3`))+line(at(1.2,'00 → 0'))+line(at(2.2,`${R(900)} = <b>30</b>`),'big')},
  {say:'Quita la mitad de los ceros.',ask:RAI_LEVELS[1].gens[2]},
  {say:'Un compañero dice que con noventa alumnos salen filas de treinta. ¡No! Treinta por treinta es novecientos. Noventa tiene un solo cero: no van por parejas.',
   show:line(strike(at(0,`${R(90)} = 30`,'bad'),1.2))+line(at(2,'30 · 30 = 900, no 90','good'))},
  {say:'Un truco: un cuadrado perfecto nunca acaba en dos, tres, siete u ocho. Con setenta y siete alumnos, la profesora sabe al instante que no habrá cuadrado.',
   show:line(seq(['…2','…3','…7','…8'].map(t=>strike(t,1.6)),0,.3),'big')+line(at(2.6,'77 alumnos → no hay cuadrado','bad'))},
  {say:'En la vida real: en los desfiles y las coreografías los grupos forman cuadrados perfectos. Treinta y seis bailarines hacen seis filas de seis.',
   show:real('una coreografía',dots(6,0,0))+line(at(2.4,`${R(36)} = 6`))},
  {say:'¿Cuál no es un cuadrado perfecto?',ask:RAI_LEVELS[1].gens[5]}
],
[ // 3 · Raíces enteras y aproximadas — relato: «Las baldosas de Lucas»
  {say:'Lucas tiene treinta baldosas y quiere hacer con ellas el cuadrado más grande posible.',
   show:sk(280,110,person(36,24,0,'Lucas')+Array.from({length:30},(_,k)=>box(90+(k%10)*18,24+Math.floor(k/10)*20,14,14,.6+k*.04,{t:.08})).join('')+tx(180,104,'30 baldosas',2,{s:14}))},
  {say:'Con seis de lado necesitaría treinta y seis: le faltan. Con cinco de lado usa veinticinco y le sobran cinco. La raíz entera de treinta es cinco, y el resto, cinco.',
   show:`<div class="row instrow">${dots(5,5,0)}</div>`+line(at(2.4,'raíz entera <b>5</b> · resto <b>5</b>'))},
  {say:'Lo comprueba así: el radicando es la raíz al cuadrado más el resto. Treinta es cinco al cuadrado más cinco. Raíz de treinta está entre cinco y seis.',
   show:line(at(0,`30 = ${P(5,2)} + 5`),'big')+line(at(1.6,'25 &lt; 30 &lt; 36'))+line(at(2.6,`5 &lt; ${R(30)} &lt; 6`))},
  {say:'¿Cuál es la raíz entera?',ask:RAI_LEVELS[2].gens[0]},
  {say:'Su hermana dice que el resto podría ser doce. ¡Imposible! Con once ya serían treinta y seis y el cuadrado crecería a seis. El resto nunca pasa del doble de la raíz.',
   show:line(strike(at(0,'resto = 12','bad'),1))+line(at(1.8,'resto ≤ 2 · 5 = <b>10</b>','good'))},
  {say:'Calcula el resto.',ask:RAI_LEVELS[2].gens[1]},
  {say:'Para afinar, Lucas prueba con décimas: cinco con cuatro al cuadrado da veintinueve con dieciséis, y cinco con cinco, treinta con veinticinco. Raíz de treinta es algo más de cinco con cuatro.',
   show:line(at(0,'5,4 · 5,4 = 29,16'))+line(at(1.4,'5,5 · 5,5 = 30,25'))+line(at(2.8,`${R(30)} ≈ <b>5,4</b>`),'big')},
  {say:'En la vida real: un jardinero tiene semillas para cincuenta metros cuadrados de césped en forma de cuadrado. El lado será raíz de cincuenta: algo más de siete metros.',
   show:real('el césped',sk(240,120,box(70,10,100,100,0,{t:.8})+tx(120,66,'50 m²',1.2,{s:18})+tx(200,64,'≈ 7 m',1.8,{s:15,c:'red'})))+line(at(2.4,`7 &lt; ${R(50)} &lt; 8`))},
  {say:'¿Entre qué números está?',ask:RAI_LEVELS[2].gens[2]}
],
[ // 4 · Raíces, potencias y signos — relato: «El truco del mago Nico»
  {say:'El mago Nico piensa un número, lo eleva al cuadrado y anuncia: me ha salido veinticinco. ¿Qué número pensó?',
   show:sk(280,120,person(40,24,0,'Nico')+bubble(80,6,150,34,'?² = 25',.8,{s:18})+tx(150,100,'¿cuál era?',1.8,{s:15,c:'red'}))},
  {say:'Pudo pensar cinco, porque cinco por cinco es veinticinco. Pero también menos cinco, porque menos por menos da más. ¡Hay dos respuestas!',
   show:line(at(0,`${P(5,2)} = 25 ✓`,'good'))+line(at(1.2,`${P(-5,2)} = 25 ✓`,'good'))+line(at(2.4,'dos números: 5 y −5'),'big')},
  {say:'Ahora tú: ¿qué números pudo pensar Nico?',ask:RAI_LEVELS[3].gens[0]},
  {say:'Cuando Nico usa el símbolo de la raíz, solo da la respuesta positiva. Raíz de veinticinco es cinco. Si quiere la negativa, escribe un menos delante.',
   show:line(at(0,`${R(25)} = <b>5</b>`),'big')+line(at(1.4,`−${R(25)} = −5`))},
  {say:'Para su segundo truco, Nico eleva al cuadrado una raíz y el resultado es el número de dentro. El cuadrado y la raíz se deshacen.',
   show:line(at(0,`${P(`(${R(49)})`,2)} = <b>49</b>`),'big')+line(at(1.4,`${R(P(7,2))} = 7`))},
  {say:'Calcula esta potencia de una raíz.',ask:RAI_LEVELS[3].gens[2]},
  {say:'Nico reta al público: raíz de menos nueve. Alguien dice que es menos tres. ¡No! Menos tres al cuadrado es nueve, nunca menos nueve. No hay ningún número que sirva.',
   show:line(strike(at(0,`${R('−9')} = −3`,'bad'),1.2))+line(at(2,`${P(-3,2)} = 9, no −9`))+line(at(3,`${R('−9')}: no existe`,'good'))},
  {say:'¿Cuánto vale esta raíz?',ask:RAI_LEVELS[3].gens[1]},
  {say:'En la vida real: el área de un cuadrado nunca es negativa. Si un huerto cuadrado tuviera menos nueve metros cuadrados, no habría ninguna medida de lado posible.',
   show:real('el área nunca es negativa',sk(240,120,box(70,10,100,100,0,{t:.8})+tx(120,66,'−9 m²',1.2,{s:18})+tx(120,126,'¿lado? ✗',1.8,{s:15,c:'red'})))},
  {say:'Para terminar, deshaz el cuadrado.',ask:RAI_LEVELS[3].gens[3]}
],
[ // 5 · Operaciones combinadas con raíces — relato: «Las parcelas de Eva»
  {say:'Eva tiene dos parcelas cuadradas: una de nueve metros cuadrados, con lado tres, y otra de dieciséis, con lado cuatro.',
   show:sk(290,130,person(26,30,0,'Eva')+box(70,40,60,60,.9,{t:.6})+tx(100,76,'9 m²',1.8,{s:15})+box(150,20,80,80,1.6,{t:.7})+tx(190,64,'16 m²',2.2,{s:15}))},
  {say:'Quiere unirlas en una sola parcela cuadrada. El área total es veinticinco, así que el lado nuevo es cinco, y no siete como podría parecer.',
   show:line(at(0,`${R('9 + 16')} = ${R(25)} = <b>5</b>`),'big')+line(strike(at(1.4,`${R(9)} + ${R(16)} = 7`,'bad'),2.6))},
  {say:'Calcula el lado de la parcela unida.',ask:RAI_LEVELS[4].gens[1]},
  {say:'La barra de la raíz funciona como un paréntesis: primero se suma lo de dentro y después se hace la raíz. Con sumas y restas, la raíz no se puede separar.',
   show:line(at(0,`${R('9 + 16')} ≠ ${R(9)} + ${R(16)}`),'big')+line(at(1.6,'5 ≠ 7','bad'))},
  {say:'Con productos sí se puede separar. Raíz de cuatro por veinticinco es raíz de cuatro por raíz de veinticinco: dos por cinco, diez.',
   show:line(at(0,`${R('4 · 25')} = ${R(4)} · ${R(25)}`))+line(at(1.4,'= 2 · 5 = <b>10</b>','good'))},
  {say:'Calcula esta raíz de un producto.',ask:RAI_LEVELS[4].gens[2]},
  {say:'En una operación combinada, la raíz se hace igual que las potencias: primero los paréntesis, luego raíces y potencias, y después multiplicar y dividir.',
   show:line(at(0,`3 + ${R(49)} : 7 − ${P(2,2)}`),'big')+line(at(1.4,'3 + 7 : 7 − 4'))+line(at(2.4,'3 + 1 − 4 = <b>0</b>'))},
  {say:'Ahora, una operación combinada.',ask:RAI_LEVELS[4].gens[3]},
  {say:'En la vida real: un carpintero apoya una escalera en la pared. Si el pie de la escalera está a tres metros de la pared y llega a cuatro metros de altura, mide raíz de nueve más dieciséis: cinco metros.',
   show:real('la escalera del carpintero',sk(240,130,stroke('M60 110L60 14L180 110Z',0,{t:.8})+tx(30,66,'4 m',1.2,{s:14})+tx(120,126,'3 m',1.6,{s:14})+tx(140,50,'? m',2.2,{s:16,c:'red'})))+line(at(2.6,`${R('9 + 16')} = 5`))},
  {say:'Elige el valor correcto.',ask:RAI_LEVELS[4].gens[5]}
]];

export { POT_ANIMS, RAI_ANIMS };
