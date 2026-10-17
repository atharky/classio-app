import { ri, pick, shuffle, fmt, P, R, mc, num } from './data.js';

/* ---------- piezas de pizarra ----------
   Cada paso: {say: texto narrado y subtitulado, show: escena HTML, ask?: generador de pregunta, audio?: archivo grabado}.
   --d es el retraso (s) con el que empieza cada pieza y --t lo que tarda en escribirse o dibujarse. */
const plain=html=>html.replace(/<[^>]+>/g,'').replace(/&[a-z]+;/g,' ');
// Texto que se escribe de izquierda a derecha, más despacio cuanto más largo.
const at=(d,html,cls='')=>`<span class="a ${cls}" style="--d:${d};--t:${Math.min(1.6,Math.max(.35,plain(html).length*.06)).toFixed(2)}s">${html}</span>`;
const seq=(parts,start=0,step=.45)=>parts.map((p,k)=>at(start+k*step,p)).join(' ');
const line=(html,cls='')=>`<div class="sl ${cls}">${html}</div>`;
// up: etiqueta encima, para que no se pise con la de la pieza de al lado.
const lab=(html,label,d,up)=>at(d,`${html}<span class="slab">${label}</span>`,up?'lb up':'lb');
const strike=(html,d)=>`<span class="x" style="--d:${d}">${html}</span>`;
const factors=(b,e,start=0,step=.35)=>seq(Array(e).fill(String(b)).flatMap((x,k)=>k?['·',x]:[x]),start,step/2);
const real=(title,html)=>`<div class="real-tag">En la vida real · ${title}</div>${html}`;

// Dibujo SVG a mano alzada: J da un temblor pequeño y siempre igual para las mismas coordenadas.
const J=(a,b,k=0)=>{const v=Math.sin(a*12.9898+b*78.233+k*37.719)*43758.5453;return (v-Math.floor(v))*2-1};
const f1=n=>+n.toFixed(1);
const sk=(w,h,inner,cls='')=>`<svg class="sk ${cls}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${inner}</svg>`;
const stroke=(path,d,{c='',t=.35}={})=>`<path class="dr ${c}" pathLength="1" style="--d:${f1(d)};--t:${t}s" d="${path}"/>`;
const ln=(x1,y1,x2,y2,d,o)=>stroke(`M${x1} ${y1}Q${f1((x1+x2)/2+J(x1,y2)*1.6)} ${f1((y1+y2)/2+J(y1,x2)*1.6)} ${x2} ${y2}`,d,o);
const box=(x,y,w,h,d,o={})=>{const p=[[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]];let path=`M${x} ${y}`;
  for(let i=1;i<5;i++){const [ax,ay]=p[i-1],[bx,by]=p[i];path+=`Q${f1((ax+bx)/2+J(ax,by,i)*1.5)} ${f1((ay+by)/2+J(ay,bx,i)*1.5)} ${bx} ${by}`}
  return stroke(path,d,{t:.8,...o})};
const circ=(cx,cy,r,d,o={})=>`<circle class="dr ${o.c||''}" pathLength="1" cx="${cx}" cy="${cy}" r="${r}" style="--d:${f1(d)};--t:${o.t||.3}s"/>`;
const fill=(x,y,w,h,d,c='soft')=>`<rect class="fi ${c}" x="${x}" y="${y}" width="${w}" height="${h}" rx="2" style="--d:${f1(d)}"/>`;
const dot=(cx,cy,r,d,c='')=>`<circle class="fi ${c}" cx="${cx}" cy="${cy}" r="${r}" style="--d:${f1(d)}"/>`;
const tx=(x,y,str,d,o={})=>`<text class="st ${o.c||''}" x="${x}" y="${y}" text-anchor="${o.a||'middle'}" font-size="${o.s||16}" style="--d:${f1(d)}">${str}</text>`;
const arrow=(x1,y,x2,d,c='')=>ln(x1,y,x2,y,d,{c})+ln(x2,y,x2-Math.sign(x2-x1)*10,y-7,d+.3,{c,t:.15})+ln(x2,y,x2-Math.sign(x2-x1)*10,y+7,d+.4,{c,t:.15});
// Cuadrícula de n×n: borde, líneas y relleno casilla a casilla para poder contarlas.
const grid=(n,d0=0,{size=150,soft=true}={})=>{const c=size/n,o=5;let s=box(o,o,size,size,d0,{t:.9});
  for(let k=1;k<n;k++)s+=ln(f1(o+k*c),o,f1(o+k*c),o+size,d0+.9+k*.08,{t:.22})+ln(o,f1(o+k*c),o+size,f1(o+k*c),d0+.9+k*.08,{t:.22});
  if(soft){const t0=d0+1.1+n*.08,step=Math.min(.05,1.2/(n*n));for(let k=0;k<n*n;k++)s+=fill(f1(o+(k%n)*c+2),f1(o+Math.floor(k/n)*c+2),f1(c-4),f1(c-4),t0+k*step)}
  return sk(size+2*o,size+2*o,s,'grid')};
// Formación de n×n puntos (alumnos, bombones…) y extra puntos sueltos en rojo.
const dots=(n,extra=0,d0=0)=>{const g=24,w=n*g+(extra?g*1.6+Math.ceil(extra/n)*g:0)+8;let s='';
  for(let k=0;k<n*n;k++)s+=dot(16+(k%n)*g,16+Math.floor(k/n)*g,8,d0+k*Math.min(.06,1.4/(n*n)),'blue');
  for(let k=0;k<extra;k++)s+=dot(16+(n+.6+Math.floor(k/n))*g,16+(k%n)*g,8,d0+1.6+k*.15,'red');
  return sk(w,n*g+8,s,'dots')};

const POT_ANIMS=[
[ // 1 · ¿Qué es una potencia?
  {say:'Mira esta multiplicación: el dos se repite cinco veces.',show:line(factors(2,5))},
  {say:'Para escribirlo más corto usamos una potencia: dos elevado a cinco. El dos es la base y el cinco, el exponente.',
   show:line(`${factors(2,5)} ${at(1.6,'=')}`)+line(`${lab('2','base',2)}${lab('<sup>5</sup>','exponente',2.8,true)}`,'big')},
  {say:'Ahora tú. Fíjate bien en la potencia.',ask:()=>{const b=ri(2,9),e=ri(3,7);return num(`En ${P(b,e)}, ¿cuántas veces se multiplica el ${b}?`,e,`El exponente (${e}) dice cuántas veces se multiplica la base: ${Array(e).fill(b).join(' · ')}.`)}},
  {say:'Dos elevado a cinco vale treinta y dos. ¡Ojo! No es dos por cinco, que daría diez.',
   show:line(`${at(0,P(2,5))} ${at(.5,'= 32')}`,'big')+line(at(1.8,`${P(2,5)} ≠ 2 · 5`,'bad'))},
  {say:'Una más.',ask:()=>{const [b,e]=pick([[2,3],[2,4],[3,2],[3,3],[4,2],[5,2]]);return mc(`¿Cuánto vale ${P(b,e)}?`,String(b**e),[String(b*e),String(b+e),String(e**b)],`${Array(e).fill(b).join(' · ')} = ${b**e}.`)}},
  {say:'En la vida real: si doblas un folio por la mitad tienes dos capas. Cada doblez las duplica. Con cinco dobleces, dos elevado a cinco: treinta y dos capas.',
   show:real('doblar un folio',sk(250,150,[0,1,2,3].map(k=>Array.from({length:2**k},(_,i)=>ln(18+k*60,112-i*7,58+k*60,112-i*7,k*.9+i*.06,{c:i?'':'blue'})).join('')+tx(38+k*60,138,`${2**k}`,k*.9+.3)).join('')+tx(125,24,'capas de papel',3.4,{s:15}))+line(at(3.8,`5 dobleces → ${P(2,5)} = 32 capas`)))},
  {say:'¿Cuántas capas tendrás?',ask:()=>{const n=ri(3,6);return num(`Doblas un folio por la mitad ${n} veces seguidas. ¿Cuántas capas de papel tienes?`,2**n,`Cada doblez duplica las capas: ${Array(n).fill(2).join(' · ')} = ${P(2,n)} = ${2**n}.`)}}
],
[ // 2 · Cuadrados, cubos y casos especiales
  {say:'Un número al cuadrado es el área de un cuadrado. Cuatro al cuadrado son dieciséis cuadraditos.',show:grid(4)+line(at(1.6,`${P(4,2)} = 16`),'big')},
  {say:'Cuenta los cuadraditos sin dibujarlos.',ask:()=>{const n=ri(3,9);return num(`Un cuadrado mide ${n} cuadraditos de lado. ¿Cuántos cuadraditos tiene en total?`,n*n,`${P(n,2)} = ${n} · ${n} = ${n*n}.`)}},
  {say:'Mira qué pasa al bajar el exponente: cada vez dividimos entre la base. Por eso dos elevado a cero vale uno.',
   show:line(seq([`${P(2,3)} = 8`,'→',`${P(2,2)} = 4`,'→',`${P(2,1)} = 2`,'→',`<b>${P(2,0)} = 1</b>`],0,.7))+line(at(3.6,'cada paso: dividir entre la base (2)','hint'))},
  {say:'Cualquier número distinto de cero elevado a cero vale uno.',ask:()=>{const a=ri(2,99);return num(`Calcula ${P(a,0)}`,1,`Todo número distinto de 0 elevado a 0 vale 1.`)}},
  {say:'Las potencias de diez llevan tantos ceros como indica el exponente.',show:line(`${at(0,`${P(10,3)} = 1000`)}`,'big')+line(at(1.2,`${P(10,6)} = 1${' '}000${' '}000`))},
  {say:'¿Cuántos ceros?',ask:()=>{const n=ri(2,9);return num(`¿Cuántos ceros tiene ${P(10,n)} cuando lo escribes entero?`,n,`${P(10,n)} = ${fmt(10**n)}: un 1 seguido de ${n} ceros.`)}},
  {say:'En la vida real: un patio cuadrado de seis baldosas de lado necesita seis al cuadrado, treinta y seis baldosas. Y un cubo de Rubik tiene tres al cubo: veintisiete cubitos.',
   show:real('baldosas y cubo de Rubik',`<div class="row" style="justify-content:center">${grid(6,0,{size:120})}${sk(110,110,box(10,35,60,60,2.4)+ln(30,35,30,95,3.1)+ln(50,35,50,95,3.2)+ln(10,55,70,55,3.3)+ln(10,75,70,75,3.4)+stroke('M10 35L35 12L95 12L70 35',3.6,{t:.5})+stroke('M70 95L95 72L95 12',4,{t:.4}),'cube')}</div>`+line(`${at(2,`${P(6,2)} = 36 baldosas`)} &nbsp; ${at(4.4,`${P(3,3)} = 27 cubitos`)}`))},
  {say:'Calcula las baldosas.',ask:()=>{const n=ri(4,12);return num(`Un patio cuadrado mide ${n} baldosas de lado. ¿Cuántas baldosas hacen falta para cubrirlo?`,n*n,`${P(n,2)} = ${n} · ${n} = ${n*n} baldosas.`)}}
],
[ // 3 · Potencias de números negativos
  {say:'Con base negativa, cada pareja de signos menos se convierte en un más.',show:line(`${at(0,'(−2) · (−2)')} ${at(1,'= <b>+4</b>','good')}`,'big')},
  {say:'Si añadimos otro factor negativo, el resultado vuelve a ser negativo.',show:line(`${at(0,'(−2) · (−2) · (−2)')} ${at(1,'= <b>−8</b>','bad')}`,'big')},
  {say:'La regla: exponente par, resultado positivo. Exponente impar, resultado negativo.',show:line(at(0,'exponente <b>par</b> → <b>+</b>','good'))+line(at(1.2,'exponente <b>impar</b> → <b>−</b>','bad'))},
  {say:'¿Positivo o negativo?',ask:()=>{const b=ri(2,9),e=ri(5,12);return mc(`El resultado de ${P(-b,e)}, ¿es positivo o negativo?`,e%2?'Negativo':'Positivo',['Positivo','Negativo'],`El exponente ${e} es ${e%2?'impar → negativo':'par → positivo'}.`)}},
  {say:'Cuidado con los paréntesis. Menos tres, entre paréntesis, al cuadrado, es nueve. Pero menos tres al cuadrado, sin paréntesis, es menos nueve.',
   show:line(at(0,`${P(-3,2)} = 9`,'good'))+line(at(2.4,'−3<sup>2</sup> = −(3 · 3) = −9','bad'))},
  {say:'Sin paréntesis, el exponente solo afecta al número.',ask:()=>{const b=ri(2,6);return num(`Calcula −${b}<sup>2</sup> (sin paréntesis)`,-(b*b),`El exponente solo afecta al ${b}: −(${b} · ${b}) = −${b*b}.`,'Usa el botón ± para poner el signo menos.')}},
  {say:'En la vida real: piensa en cada signo menos como dar media vuelta. Con una media vuelta miras hacia atrás; con dos, vuelves a mirar hacia delante.',
   show:real('dar media vuelta',sk(260,130,tx(130,16,'medias vueltas',0,{s:14})+arrow(20,50,70,50,.3,'blue')+tx(45,80,'ninguna',.7,{s:14})+arrow(155,50,105,50,1.2,'red')+tx(130,80,'una',1.6,{s:14})+arrow(190,50,240,50,2.2,'blue')+tx(215,80,'dos',2.6,{s:14})+tx(130,115,'(−1) · (−1) = +1',3.2,{s:17,c:'green'})))},
  {say:'¿Hacia dónde miras?',ask:()=>{const n=ri(3,12),odd=n%2===1;return mc(`Das media vuelta ${n} veces seguidas. ¿Hacia dónde miras?`,odd?'Hacia atrás':'Hacia delante',['Hacia delante','Hacia atrás'],`Es como ${P(-1,n)} = ${odd?'−1':'1'}: con un número ${odd?'impar':'par'} de medias vueltas miras hacia ${odd?'atrás':'delante'}.`)}}
],
[ // 4 · Multiplicar y dividir con la misma base
  {say:'Al multiplicar potencias de la misma base, juntamos todos los factores.',show:line(`${at(0,`${P(2,3)} · ${P(2,2)}`)} ${at(.8,'= (2 · 2 · 2) · (2 · 2)')}`)},
  {say:'Tres factores más dos factores son cinco. Se suman los exponentes.',show:line(`${P(2,3)} · ${P(2,2)} ${at(0,'=')} ${at(.6,P(2,'3+2'))} ${at(1.4,`= <b>${P(2,5)}</b>`)}`,'big')},
  {say:'Te toca.',ask:()=>{const a=ri(2,9),m=ri(2,9),n=ri(2,9);return num(`${P(a,m)} · ${P(a,n)} = ${a}<sup>?</sup>`,m+n,`Misma base: se suman los exponentes. ${m} + ${n} = ${m+n}.`,'Escribe solo el exponente.')}},
  {say:'Al dividir, los factores de abajo se tachan con los de arriba. Se restan los exponentes: seis menos dos, cuatro.',
   show:line(`<span class="frac"><span>${strike('5 · 5',1)} · 5 · 5 · 5 · 5</span><span>${strike('5 · 5',1)}</span></span> ${at(2,`= <b>${P(5,4)}</b>`)}`,'big')},
  {say:'Y ahora una división.',ask:()=>{const a=ri(2,9),n=ri(2,6),m=n+ri(1,7);return num(`${P(a,m)} : ${P(a,n)} = ${a}<sup>?</sup>`,m-n,`Misma base: se restan los exponentes. ${m} − ${n} = ${m-n}.`,'Escribe solo el exponente.')}},
  {say:'En la vida real: un almacén tiene diez al cuadrado cajas, y en cada caja hay diez al cubo clips. En total, diez elevado a cinco: cien mil clips.',
   show:real('un almacén',sk(260,90,[0,1,2,3].map(k=>box(8+k*58,15,48,48,k*.5,{t:.5})+tx(32+k*58,45,'1000',k*.5+.4,{s:13})).join('')+tx(130,85,'… y así hasta 100 cajas',2.4,{s:14}))+line(at(3.2,`${P(10,2)} · ${P(10,3)} = ${P(10,5)} = 100${' '}000 clips`)))},
  {say:'Cuenta los libros con potencias.',ask:()=>{const m=ri(2,4),n=ri(2,5);return num(`Una biblioteca tiene ${P(10,m)} estanterías y en cada una hay ${P(10,n)} libros. ¿Cuántos libros hay en total? ${P(10,m)} · ${P(10,n)} = 10<sup>?</sup>`,m+n,`Misma base: se suman los exponentes. ${m} + ${n} = ${m+n}, así que hay ${P(10,m+n)} libros.`,'Escribe solo el exponente.')}}
],
[ // 5 · Potencia de una potencia
  {say:'Tres al cuadrado, elevado a cuatro: el tres al cuadrado se repite cuatro veces.',show:line(`${at(0,`(${P(3,2)})<sup>4</sup>`)} ${at(.8,`= ${seq(Array(4).fill(P(3,2)).flatMap((x,k)=>k?['·',x]:[x]),1,.2)}`)}`)},
  {say:'Dos más dos más dos más dos son ocho. Se multiplican los exponentes.',show:line(`(${P(3,2)})<sup>4</sup> ${at(0,`= ${P(3,'2·4')}`)} ${at(1,`= <b>${P(3,8)}</b>`)}`,'big')},
  {say:'Prueba tú.',ask:()=>{const a=ri(2,9),m=ri(2,6),n=ri(2,5);return num(`(${P(a,m)})<sup>${n}</sup> = ${a}<sup>?</sup>`,m*n,`Se multiplican los exponentes: ${m} · ${n} = ${m*n}.`,'Escribe solo el exponente.')}},
  {say:'Si el exponente es el mismo, se multiplican las bases. Dos al cubo por cinco al cubo es diez al cubo: mil.',show:line(`${at(0,`${P(2,3)} · ${P(5,3)}`)} ${at(1,`= ${P('(2·5)',3)}`)} ${at(2,`= ${P(10,3)} = <b>1000</b>`)}`,'big')},
  {say:'Usa el truco del diez.',ask:()=>{const n=ri(2,5);return num(`Calcula ${P(2,n)} · ${P(5,n)}`,10**n,`2 · 5 = 10, así que queda ${P(10,n)} = ${fmt(10**n)}.`)}},
  {say:'En la vida real: un tablero de ajedrez tiene ocho por ocho casillas. Como ocho es dos al cubo, son dos al cubo, al cuadrado: dos elevado a seis, sesenta y cuatro.',
   show:real('el tablero de ajedrez',sk(140,140,box(6,6,128,128,0,{t:.9})+Array.from({length:7},(_,k)=>ln(6+(k+1)*16,6,6+(k+1)*16,134,.9+k*.07,{t:.2})+ln(6,6+(k+1)*16,134,6+(k+1)*16,.9+k*.07,{t:.2})).join('')+Array.from({length:64},(_,k)=>(k%8+Math.floor(k/8))%2?fill(6+(k%8)*16,6+Math.floor(k/8)*16,16,16,1.6+k*.02,'ink'):'').join(''),'board')+line(at(3,`8 · 8 = (${P(2,3)})<sup>2</sup> = ${P(2,6)} = 64`)))},
  {say:'Escríbelo como potencia de dos.',ask:()=>{const m=ri(2,5);return num(`Un tablero cuadrado tiene ${P(2,m)} casillas de lado. ¿Cuántas casillas tiene en total? (${P(2,m)})<sup>2</sup> = 2<sup>?</sup>`,2*m,`Potencia de una potencia: se multiplican los exponentes. ${m} · 2 = ${2*m}, así que son ${P(2,2*m)} = ${fmt(2**(2*m))} casillas.`,'Escribe solo el exponente.')}}
],
[ // 6 · Operaciones combinadas
  {say:'En las operaciones combinadas hay un orden: paréntesis, potencias, multiplicaciones y divisiones, y por último sumas y restas.',
   show:line(seq(['<span class="chip">1 · ( )</span>','<span class="chip">2 · potencias</span>','<span class="chip">3 · × :</span>','<span class="chip">4 · + −</span>'],0,.9))},
  {say:'Por ejemplo: tres más dos a la cuarta, entre ocho. Primero la potencia: dos a la cuarta es dieciséis.',show:line(`3 + ${P(2,4)} : 8 ${at(1.5,'→ 3 + <b>16</b> : 8')}`,'big')},
  {say:'Después la división: dieciséis entre ocho, dos. Y al final la suma: cinco.',show:line(`3 + 16 : 8 ${at(.6,'→ 3 + <b>2</b>')} ${at(2,'→ <b>5</b>')}`,'big')},
  {say:'Resuélvelo siguiendo el orden.',ask:()=>{const k=ri(2,5),[b,e]=pick([[2,3],[2,4],[3,2],[3,3]]);return num(`Calcula ${k} + ${P(b,e)}`,k+b**e,`Primero la potencia: ${P(b,e)} = ${b**e}. Luego ${k} + ${b**e} = ${k+b**e}.`)}},
  {say:'Ojo: dos más tres, al cuadrado, no es lo mismo que dos al cuadrado más tres al cuadrado.',show:line(at(0,`(2 + 3)<sup>2</sup> = ${P(5,2)} = 25`,'good'))+line(at(1.6,`${P(2,2)} + ${P(3,2)} = 13`,'bad'))},
  {say:'Primero el paréntesis.',ask:()=>{const a=ri(1,4),b=ri(2,4);return mc(`¿Cuánto vale (${a} + ${b})<sup>2</sup>?`,String((a+b)**2),[String(a*a+b*b),String(2*(a+b)),String(a+b*b)],`Primero el paréntesis: ${a+b}. Luego ${P(a+b,2)} = ${(a+b)**2}.`)}},
  {say:'En la vida real: una caja tiene cuatro filas de cuatro bombones y te comes tres. Quedan cuatro al cuadrado menos tres: trece. Primero la potencia y después la resta.',
   show:real('una caja de bombones',dots(4,0,0).replace('</svg>',[0,1,2].map(k=>ln(8+k*24,8,24+k*24,24,1.8+k*.3,{c:'red',t:.2})+ln(24+k*24,8,8+k*24,24,1.9+k*.3,{c:'red',t:.2})).join('')+'</svg>')+line(at(2.8,`${P(4,2)} − 3 = 16 − 3 = <b>13</b>`)))},
  {say:'¿Cuántos bombones quedan?',ask:()=>{const n=ri(4,7),k=ri(2,9);return num(`Una caja tiene ${n} filas de ${n} bombones y ya te has comido ${k}. ¿Cuántos quedan?`,n*n-k,`Primero la potencia: ${P(n,2)} = ${n*n}. Luego la resta: ${n*n} − ${k} = ${n*n-k}.`)}}
]];

const RAI_ANIMS=[
[ // 1 · ¿Qué es una raíz cuadrada?
  {say:'Este cuadrado tiene un área de veinticinco cuadraditos. ¿Cuánto mide su lado?',show:grid(5)+line(at(1.6,'Área = 25'))},
  {say:'Mide cinco, porque cinco por cinco es veinticinco. Eso es la raíz cuadrada: raíz de veinticinco es cinco.',show:grid(5)+line(`${at(0,'5 · 5 = 25')} ${at(1.4,`→ <b>${R(25)} = 5</b>`)}`,'big')},
  {say:'Ahora tú.',ask:()=>{const n=ri(3,10);return num(`Un cuadrado tiene un área de ${n*n} cuadraditos. ¿Cuántos cuadraditos mide su lado?`,n,`${n} · ${n} = ${n*n}, así que el lado mide ${R(n*n)} = ${n}.`)}},
  {say:'El símbolo se llama radical, el número de dentro es el radicando y el resultado es la raíz.',show:line(`${lab('√','radical',0,true)}${lab('49','radicando',1)} ${lab('= 7','raíz',2,true)}`,'big')},
  {say:'¡Cuidado! La raíz no es la mitad. Raíz de dieciséis es cuatro, no ocho, porque ocho por ocho es sesenta y cuatro.',show:line(at(0,`${R(16)} = 4`,'good'))+line(at(1.6,`${R(16)} ≠ 8 &nbsp;(8 · 8 = 64)`,'bad'))},
  {say:'Calcula esta raíz.',ask:()=>{const n=ri(2,12);return num(`Calcula ${R(n*n)}`,n,`${n} · ${n} = ${n*n}, así que ${R(n*n)} = ${n}.`)}},
  {say:'En la vida real: un huerto cuadrado mide cuarenta y nueve metros cuadrados. Cada lado mide raíz de cuarenta y nueve: siete metros. Así sabemos cuánta valla comprar.',
   show:real('un huerto cuadrado',sk(220,165,box(50,15,120,120,0,{t:1})+Array.from({length:7},(_,k)=>ln(50+k*20,9,50+k*20,21,1+k*.08,{t:.12})).join('')+tx(110,82,'49 m²',1.6,{s:20})+tx(110,158,'? m',2.2,{s:15,c:'red'})+tx(30,80,'? m',2.4,{s:15,c:'red'}))+line(at(3,`lado = ${R(49)} = 7 m`)))},
  {say:'Calcula el lado.',ask:()=>{const n=ri(2,9);return num(`Una alfombra cuadrada tiene ${n*n} m². ¿Cuántos metros mide cada lado?`,n,`${R(n*n)} = ${n}, porque ${n} · ${n} = ${n*n}.`,'Escribe solo el número de metros.')}}
],
[ // 2 · Cuadrados perfectos y raíces exactas
  {say:'Los números que son el cuadrado de otro número natural se llaman cuadrados perfectos.',show:line(seq([1,2,3,4,5,6,7,8,9,10].map(n=>`<b>${n*n}</b>`),0,.3))},
  {say:'Busca el cuadrado perfecto.',ask:()=>{const k=ri(4,15);return mc(`¿Cuál de estos números es un cuadrado perfecto?`,String(k*k),[String(k*k+1),String(k*k-1),String(k*k+k)],`${k*k} = ${k} · ${k}. Los otros quedan entre dos cuadrados seguidos.`)}},
  {say:'Si el número acaba en ceros por parejas, la raíz lleva la mitad de ceros. Raíz de novecientos es treinta.',show:line(`${at(0,`${R(900)} = 30`)}`,'big')+line(at(1.4,`${R(10000)} = 100`))},
  {say:'Quita la mitad de los ceros.',ask:()=>{const k=ri(2,9);return num(`Calcula ${R(k*k*100)}`,k*10,`La raíz de ${k*k} es ${k} y de dos ceros pasamos a uno: ${k*10}.`)}},
  {say:'Un truco: un cuadrado perfecto nunca acaba en dos, tres, siete u ocho.',show:line(seq(['…2','…3','…7','…8'].map(t=>strike(t,1.6)),0,.3),'big')},
  {say:'Usa el truco.',ask:()=>{const d=pick([2,3,7,8]),bad=ri(10,99)*10+d,sq=shuffle([11,12,13,14,15,16,17,18,19]).slice(0,3);return mc(`¿Cuál de estos números <b>no</b> es un cuadrado perfecto?`,String(bad),sq.map(k=>String(k*k)),`${bad} acaba en ${d}: ningún cuadrado perfecto acaba en 2, 3, 7 u 8.`)}},
  {say:'En la vida real: treinta y seis alumnos pueden formar un cuadrado de seis filas de seis. Con cuarenta no se puede: cuarenta no es un cuadrado perfecto.',
   show:real('formar un cuadrado',dots(6,0,0))+line(`${at(1.8,'36 alumnos → 6 filas de 6')}`)+line(at(3,'40 alumnos → no se puede','bad'))},
  {say:'¿Con cuántos alumnos se puede?',ask:()=>{const k=ri(5,12);return mc(`¿Con cuántos alumnos se puede formar un cuadrado (las mismas filas que columnas) sin que sobre nadie?`,String(k*k),[String(k*k+1),String(k*k-2),String(k*k+k)],`${k*k} = ${k} · ${k}: ${k} filas de ${k}. Los otros números no son cuadrados perfectos.`)}}
],
[ // 3 · Raíces enteras y aproximadas
  {say:'Treinta no es un cuadrado perfecto. Está entre veinticinco, que es cinco al cuadrado, y treinta y seis, que es seis al cuadrado.',
   show:`<div class="nline"><span>${at(0,`25<small>${P(5,2)}</small>`)}</span><span class="mark">${at(1,'30')}</span><span>${at(.5,`36<small>${P(6,2)}</small>`)}</span></div>`},
  {say:'Por eso raíz de treinta está entre cinco y seis. La raíz entera es cinco.',show:line(`${at(0,`5 &lt; ${R(30)} &lt; 6`)}`,'big')+line(at(1.4,'raíz entera: <b>5</b>'))},
  {say:'¿Entre qué dos números está?',ask:()=>{const r=ri(3,11),n=r*r+ri(1,2*r);return mc(`${R(n)} está entre…`,`${r} y ${r+1}`,[`${r-1} y ${r}`,`${r+1} y ${r+2}`,`${Math.floor(n/2)} y ${Math.floor(n/2)+1}`],`${P(r,2)} = ${r*r} &lt; ${n} &lt; ${(r+1)**2} = ${P(r+1,2)}.`)}},
  {say:'Lo que sobra es el resto: treinta menos veinticinco, cinco. Se comprueba así: treinta es cinco al cuadrado más cinco.',show:line(`${at(0,'30 − 25 = <b>5</b>')}`,'big')+line(at(1.6,`30 = ${P(5,2)} + 5`))},
  {say:'Calcula el resto.',ask:()=>{const r=ri(3,12),n=r*r+ri(1,2*r);return num(`La raíz entera de ${n} es ${r}. ¿Cuál es el resto?`,n-r*r,`${n} − ${P(r,2)} = ${n} − ${r*r} = ${n-r*r}.`)}},
  {say:'En la vida real: con treinta alumnos, el cuadrado más grande es de cinco filas de cinco, y sobran cinco. La raíz entera es cinco y el resto también es cinco.',
   show:real('formar un cuadrado',dots(5,5,0))+line(at(2.6,`30 = ${P(5,2)} + <b class="bad">5</b> → sobran 5`))},
  {say:'¿Cuántas sobran?',ask:()=>{const r=ri(4,9),n=r*r+ri(1,2*r);return num(`Tienes ${n} baldosas y quieres formar el cuadrado más grande posible. ¿Cuántas baldosas te sobran?`,n-r*r,`El cuadrado más grande es de ${r} × ${r} = ${r*r} baldosas (raíz entera ${r}). Sobran ${n} − ${r*r} = ${n-r*r}.`)}}
]];

const ANIMS={potencias:POT_ANIMS,raices:RAI_ANIMS};
export { ANIMS };
