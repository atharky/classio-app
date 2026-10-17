import { ri, pick, shuffle, fmt, P, R, mc, num } from './data.js';

/* ---------- piezas de escena ----------
   Cada paso: {say: texto narrado y subtitulado, show: escena HTML, ask?: generador de pregunta, audio?: archivo grabado}.
   --d es el retraso en segundos con el que aparece cada pieza. */
const at=(d,html,cls='')=>`<span class="a ${cls}" style="--d:${d}">${html}</span>`;
const seq=(parts,start=0,step=.45)=>parts.map((p,k)=>at(start+k*step,p)).join(' ');
const line=(html,cls='')=>`<div class="sl ${cls}">${html}</div>`;
// up: etiqueta encima, para que no se pise con la de la pieza de al lado.
const lab=(html,label,d,up)=>at(d,`${html}<span class="slab">${label}</span>`,up?'lb up':'lb');
const grid=(n,d0=0)=>{const step=Math.min(.06,1.4/(n*n));return `<div class="sgrid" style="--n:${n}" aria-hidden="true">${Array.from({length:n*n},(_,k)=>`<i class="a" style="--d:${(d0+k*step).toFixed(2)}"></i>`).join('')}</div>`};
const strike=(html,d)=>`<span class="x" style="--d:${d}">${html}</span>`;
const factors=(b,e,start=0,step=.35)=>seq(Array(e).fill(String(b)).flatMap((x,k)=>k?['·',x]:[x]),start,step/2);

const POT_ANIMS=[
[ // 1 · ¿Qué es una potencia?
  {say:'Mira esta multiplicación: el dos se repite cinco veces.',show:line(factors(2,5))},
  {say:'Para escribirlo más corto usamos una potencia: dos elevado a cinco. El dos es la base y el cinco, el exponente.',
   show:line(`${factors(2,5)} ${at(1.6,'=')}`)+line(`${lab('2','base',2)}${lab('<sup>5</sup>','exponente',2.8,true)}`,'big')},
  {say:'Ahora tú. Fíjate bien en la potencia.',ask:()=>{const b=ri(2,9),e=ri(3,7);return num(`En ${P(b,e)}, ¿cuántas veces se multiplica el ${b}?`,e,`El exponente (${e}) dice cuántas veces se multiplica la base: ${Array(e).fill(b).join(' · ')}.`)}},
  {say:'Dos elevado a cinco vale treinta y dos. ¡Ojo! No es dos por cinco, que daría diez.',
   show:line(`${at(0,P(2,5))} ${at(.5,'= 32')}`,'big')+line(at(1.8,`${P(2,5)} ≠ 2 · 5`,'bad'))},
  {say:'Una más.',ask:()=>{const [b,e]=pick([[2,3],[2,4],[3,2],[3,3],[4,2],[5,2]]);return mc(`¿Cuánto vale ${P(b,e)}?`,String(b**e),[String(b*e),String(b+e),String(e**b)],`${Array(e).fill(b).join(' · ')} = ${b**e}.`)}}
],
[ // 2 · Cuadrados, cubos y casos especiales
  {say:'Un número al cuadrado es el área de un cuadrado. Cuatro al cuadrado son dieciséis cuadraditos.',show:grid(4)+line(at(1.6,`${P(4,2)} = 16`),'big')},
  {say:'Cuenta los cuadraditos sin dibujarlos.',ask:()=>{const n=ri(3,9);return num(`Un cuadrado mide ${n} cuadraditos de lado. ¿Cuántos cuadraditos tiene en total?`,n*n,`${P(n,2)} = ${n} · ${n} = ${n*n}.`)}},
  {say:'Mira qué pasa al bajar el exponente: cada vez dividimos entre la base. Por eso dos elevado a cero vale uno.',
   show:line(seq([`${P(2,3)} = 8`,'→',`${P(2,2)} = 4`,'→',`${P(2,1)} = 2`,'→',`<b>${P(2,0)} = 1</b>`],0,.7))+line(at(3.6,'cada paso: dividir entre la base (2)','hint'))},
  {say:'Cualquier número distinto de cero elevado a cero vale uno.',ask:()=>{const a=ri(2,99);return num(`Calcula ${P(a,0)}`,1,`Todo número distinto de 0 elevado a 0 vale 1.`)}},
  {say:'Las potencias de diez llevan tantos ceros como indica el exponente.',show:line(`${at(0,`${P(10,3)} = 1000`)}`,'big')+line(at(1.2,`${P(10,6)} = 1${' '}000${' '}000`))},
  {say:'¿Cuántos ceros?',ask:()=>{const n=ri(2,9);return num(`¿Cuántos ceros tiene ${P(10,n)} cuando lo escribes entero?`,n,`${P(10,n)} = ${fmt(10**n)}: un 1 seguido de ${n} ceros.`)}}
],
[ // 3 · Potencias de números negativos
  {say:'Con base negativa, cada pareja de signos menos se convierte en un más.',show:line(`${at(0,'(−2) · (−2)')} ${at(1,'= <b>+4</b>','good')}`,'big')},
  {say:'Si añadimos otro factor negativo, el resultado vuelve a ser negativo.',show:line(`${at(0,'(−2) · (−2) · (−2)')} ${at(1,'= <b>−8</b>','bad')}`,'big')},
  {say:'La regla: exponente par, resultado positivo. Exponente impar, resultado negativo.',show:line(at(0,'exponente <b>par</b> → <b>+</b>','good'))+line(at(1.2,'exponente <b>impar</b> → <b>−</b>','bad'))},
  {say:'¿Positivo o negativo?',ask:()=>{const b=ri(2,9),e=ri(5,12);return mc(`El resultado de ${P(-b,e)}, ¿es positivo o negativo?`,e%2?'Negativo':'Positivo',['Positivo','Negativo'],`El exponente ${e} es ${e%2?'impar → negativo':'par → positivo'}.`)}},
  {say:'Cuidado con los paréntesis. Menos tres, entre paréntesis, al cuadrado, es nueve. Pero menos tres al cuadrado, sin paréntesis, es menos nueve.',
   show:line(at(0,`${P(-3,2)} = 9`,'good'))+line(at(2.4,'−3<sup>2</sup> = −(3 · 3) = −9','bad'))},
  {say:'Sin paréntesis, el exponente solo afecta al número.',ask:()=>{const b=ri(2,6);return num(`Calcula −${b}<sup>2</sup> (sin paréntesis)`,-(b*b),`El exponente solo afecta al ${b}: −(${b} · ${b}) = −${b*b}.`,'Usa el botón ± para poner el signo menos.')}}
],
[ // 4 · Multiplicar y dividir con la misma base
  {say:'Al multiplicar potencias de la misma base, juntamos todos los factores.',show:line(`${at(0,`${P(2,3)} · ${P(2,2)}`)} ${at(.8,'= (2 · 2 · 2) · (2 · 2)')}`)},
  {say:'Tres factores más dos factores son cinco. Se suman los exponentes.',show:line(`${P(2,3)} · ${P(2,2)} ${at(0,'=')} ${at(.6,P(2,'3+2'))} ${at(1.4,`= <b>${P(2,5)}</b>`)}`,'big')},
  {say:'Te toca.',ask:()=>{const a=ri(2,9),m=ri(2,9),n=ri(2,9);return num(`${P(a,m)} · ${P(a,n)} = ${a}<sup>?</sup>`,m+n,`Misma base: se suman los exponentes. ${m} + ${n} = ${m+n}.`,'Escribe solo el exponente.')}},
  {say:'Al dividir, los factores de abajo se tachan con los de arriba. Se restan los exponentes: seis menos dos, cuatro.',
   show:line(`<span class="frac"><span>${strike('5 · 5',1)} · 5 · 5 · 5 · 5</span><span>${strike('5 · 5',1)}</span></span> ${at(2,`= <b>${P(5,4)}</b>`)}`,'big')},
  {say:'Y ahora una división.',ask:()=>{const a=ri(2,9),n=ri(2,6),m=n+ri(1,7);return num(`${P(a,m)} : ${P(a,n)} = ${a}<sup>?</sup>`,m-n,`Misma base: se restan los exponentes. ${m} − ${n} = ${m-n}.`,'Escribe solo el exponente.')}}
],
[ // 5 · Potencia de una potencia
  {say:'Tres al cuadrado, elevado a cuatro: el tres al cuadrado se repite cuatro veces.',show:line(`${at(0,`(${P(3,2)})<sup>4</sup>`)} ${at(.8,`= ${seq(Array(4).fill(P(3,2)).flatMap((x,k)=>k?['·',x]:[x]),1,.2)}`)}`)},
  {say:'Dos más dos más dos más dos son ocho. Se multiplican los exponentes.',show:line(`(${P(3,2)})<sup>4</sup> ${at(0,`= ${P(3,'2·4')}`)} ${at(1,`= <b>${P(3,8)}</b>`)}`,'big')},
  {say:'Prueba tú.',ask:()=>{const a=ri(2,9),m=ri(2,6),n=ri(2,5);return num(`(${P(a,m)})<sup>${n}</sup> = ${a}<sup>?</sup>`,m*n,`Se multiplican los exponentes: ${m} · ${n} = ${m*n}.`,'Escribe solo el exponente.')}},
  {say:'Si el exponente es el mismo, se multiplican las bases. Dos al cubo por cinco al cubo es diez al cubo: mil.',show:line(`${at(0,`${P(2,3)} · ${P(5,3)}`)} ${at(1,`= ${P('(2·5)',3)}`)} ${at(2,`= ${P(10,3)} = <b>1000</b>`)}`,'big')},
  {say:'Usa el truco del diez.',ask:()=>{const n=ri(2,5);return num(`Calcula ${P(2,n)} · ${P(5,n)}`,10**n,`2 · 5 = 10, así que queda ${P(10,n)} = ${fmt(10**n)}.`)}}
],
[ // 6 · Operaciones combinadas
  {say:'En las operaciones combinadas hay un orden: paréntesis, potencias, multiplicaciones y divisiones, y por último sumas y restas.',
   show:line(seq(['<span class="chip">1 · ( )</span>','<span class="chip">2 · potencias</span>','<span class="chip">3 · × :</span>','<span class="chip">4 · + −</span>'],0,.9))},
  {say:'Por ejemplo: tres más dos a la cuarta, entre ocho. Primero la potencia: dos a la cuarta es dieciséis.',show:line(`3 + ${P(2,4)} : 8 ${at(1.5,'→ 3 + <b>16</b> : 8')}`,'big')},
  {say:'Después la división: dieciséis entre ocho, dos. Y al final la suma: cinco.',show:line(`3 + 16 : 8 ${at(.6,'→ 3 + <b>2</b>')} ${at(2,'→ <b>5</b>')}`,'big')},
  {say:'Resuélvelo siguiendo el orden.',ask:()=>{const k=ri(2,5),[b,e]=pick([[2,3],[2,4],[3,2],[3,3]]);return num(`Calcula ${k} + ${P(b,e)}`,k+b**e,`Primero la potencia: ${P(b,e)} = ${b**e}. Luego ${k} + ${b**e} = ${k+b**e}.`)}},
  {say:'Ojo: dos más tres, al cuadrado, no es lo mismo que dos al cuadrado más tres al cuadrado.',show:line(at(0,`(2 + 3)<sup>2</sup> = ${P(5,2)} = 25`,'good'))+line(at(1.6,`${P(2,2)} + ${P(3,2)} = 13`,'bad'))},
  {say:'Primero el paréntesis.',ask:()=>{const a=ri(1,4),b=ri(2,4);return mc(`¿Cuánto vale (${a} + ${b})<sup>2</sup>?`,String((a+b)**2),[String(a*a+b*b),String(2*(a+b)),String(a+b*b)],`Primero el paréntesis: ${a+b}. Luego ${P(a+b,2)} = ${(a+b)**2}.`)}}
]];

const RAI_ANIMS=[
[ // 1 · ¿Qué es una raíz cuadrada?
  {say:'Este cuadrado tiene un área de veinticinco cuadraditos. ¿Cuánto mide su lado?',show:grid(5)+line(at(1.6,'Área = 25'))},
  {say:'Mide cinco, porque cinco por cinco es veinticinco. Eso es la raíz cuadrada: raíz de veinticinco es cinco.',show:grid(5)+line(`${at(0,'5 · 5 = 25')} ${at(1.4,`→ <b>${R(25)} = 5</b>`)}`,'big')},
  {say:'Ahora tú.',ask:()=>{const n=ri(3,10);return num(`Un cuadrado tiene un área de ${n*n} cuadraditos. ¿Cuántos cuadraditos mide su lado?`,n,`${n} · ${n} = ${n*n}, así que el lado mide ${R(n*n)} = ${n}.`)}},
  {say:'El símbolo se llama radical, el número de dentro es el radicando y el resultado es la raíz.',show:line(`${lab('√','radical',0,true)}${lab('49','radicando',1)} ${lab('= 7','raíz',2,true)}`,'big')},
  {say:'¡Cuidado! La raíz no es la mitad. Raíz de dieciséis es cuatro, no ocho, porque ocho por ocho es sesenta y cuatro.',show:line(at(0,`${R(16)} = 4`,'good'))+line(at(1.6,`${R(16)} ≠ 8 &nbsp;(8 · 8 = 64)`,'bad'))},
  {say:'Calcula esta raíz.',ask:()=>{const n=ri(2,12);return num(`Calcula ${R(n*n)}`,n,`${n} · ${n} = ${n*n}, así que ${R(n*n)} = ${n}.`)}}
],
[ // 2 · Cuadrados perfectos y raíces exactas
  {say:'Los números que son el cuadrado de otro número natural se llaman cuadrados perfectos.',show:line(seq([1,2,3,4,5,6,7,8,9,10].map(n=>`<b>${n*n}</b>`),0,.3))},
  {say:'Busca el cuadrado perfecto.',ask:()=>{const k=ri(4,15);return mc(`¿Cuál de estos números es un cuadrado perfecto?`,String(k*k),[String(k*k+1),String(k*k-1),String(k*k+k)],`${k*k} = ${k} · ${k}. Los otros quedan entre dos cuadrados seguidos.`)}},
  {say:'Si el número acaba en ceros por parejas, la raíz lleva la mitad de ceros. Raíz de novecientos es treinta.',show:line(`${at(0,`${R(900)} = 30`)}`,'big')+line(at(1.4,`${R(10000)} = 100`))},
  {say:'Quita la mitad de los ceros.',ask:()=>{const k=ri(2,9);return num(`Calcula ${R(k*k*100)}`,k*10,`La raíz de ${k*k} es ${k} y de dos ceros pasamos a uno: ${k*10}.`)}},
  {say:'Un truco: un cuadrado perfecto nunca acaba en dos, tres, siete u ocho.',show:line(seq(['…2','…3','…7','…8'].map(t=>strike(t,1.6)),0,.3),'big')},
  {say:'Usa el truco.',ask:()=>{const d=pick([2,3,7,8]),bad=ri(10,99)*10+d,sq=shuffle([11,12,13,14,15,16,17,18,19]).slice(0,3);return mc(`¿Cuál de estos números <b>no</b> es un cuadrado perfecto?`,String(bad),sq.map(k=>String(k*k)),`${bad} acaba en ${d}: ningún cuadrado perfecto acaba en 2, 3, 7 u 8.`)}}
],
[ // 3 · Raíces enteras y aproximadas
  {say:'Treinta no es un cuadrado perfecto. Está entre veinticinco, que es cinco al cuadrado, y treinta y seis, que es seis al cuadrado.',
   show:`<div class="nline"><span>${at(0,`25<small>${P(5,2)}</small>`)}</span><span class="mark">${at(1,'30')}</span><span>${at(.5,`36<small>${P(6,2)}</small>`)}</span></div>`},
  {say:'Por eso raíz de treinta está entre cinco y seis. La raíz entera es cinco.',show:line(`${at(0,`5 &lt; ${R(30)} &lt; 6`)}`,'big')+line(at(1.4,'raíz entera: <b>5</b>'))},
  {say:'¿Entre qué dos números está?',ask:()=>{const r=ri(3,11),n=r*r+ri(1,2*r);return mc(`${R(n)} está entre…`,`${r} y ${r+1}`,[`${r-1} y ${r}`,`${r+1} y ${r+2}`,`${Math.floor(n/2)} y ${Math.floor(n/2)+1}`],`${P(r,2)} = ${r*r} &lt; ${n} &lt; ${(r+1)**2} = ${P(r+1,2)}.`)}},
  {say:'Lo que sobra es el resto: treinta menos veinticinco, cinco. Se comprueba así: treinta es cinco al cuadrado más cinco.',show:line(`${at(0,'30 − 25 = <b>5</b>')}`,'big')+line(at(1.6,`30 = ${P(5,2)} + 5`))},
  {say:'Calcula el resto.',ask:()=>{const r=ri(3,12),n=r*r+ri(1,2*r);return num(`La raíz entera de ${n} es ${r}. ¿Cuál es el resto?`,n-r*r,`${n} − ${P(r,2)} = ${n} − ${r*r} = ${n-r*r}.`)}}
]];

const ANIMS={potencias:POT_ANIMS,raices:RAI_ANIMS};
export { ANIMS };
