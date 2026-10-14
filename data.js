/* ---------- utilidades ---------- */
const $=s=>document.querySelector(s);
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const fmt=n=>{const neg=n<0;let s=String(Math.abs(n));if(s.length>=5)s=s.replace(/\B(?=(\d{3})+(?!\d))/g,' ');return (neg?'−':'')+s};
const P=(b,e)=>{const bs=typeof b==='number'?(b<0?`(${fmt(b)})`:fmt(b)):b;return `<span class="pw">${bs}<sup>${e}</sup></span>`};
const expand=(b,e)=>Array(e).fill(typeof b==='number'&&b<0?`(${fmt(b)})`:b).join(' · ');
const W=['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez'];
function mc(prompt,correct,wrongs,explain){const ws=[...new Set(wrongs.filter(w=>w!==correct))].slice(0,3);const opts=shuffle([correct,...ws]);return {type:'mc',prompt,options:opts,answer:opts.indexOf(correct),explain}}
function num(prompt,answer,explain,hint){return {type:'num',prompt,answer,explain,hint}}
const parseNum=s=>{s=String(s).trim().replace(/[−–—]/g,'-').replace(/\s| |\./g,'').replace(',','.');if(!/^-?\d+(\.\d+)?$/.test(s))return null;return Number(s)};

/* ---------- contenido: módulo Potencias ---------- */
const POT_LEVELS=[
{ title:'¿Qué es una potencia?', sub:'Base, exponente y cómo se leen',
  lesson:[
    ['Una multiplicación abreviada',`<p>Cuando multiplicamos <b>el mismo número</b> varias veces, lo escribimos de forma corta con una potencia.</p>
     <div class="ex">2 · 2 · 2 · 2 · 2 = ${P(2,5)} = 32</div>
     <div class="anat" aria-label="Partes de una potencia"><span class="b">2<span class="lab">base</span></span><span class="e">5<span class="lab">exponente</span></span></div>
     <p>La <span class="hl">base</span> es el número que se multiplica. El <span class="hl">exponente</span> dice <b>cuántas veces</b> se multiplica.</p>`],
    ['Cómo se leen',`<p>${P(5,2)} se lee <b>«cinco al cuadrado»</b>. ${P(4,3)} se lee <b>«cuatro al cubo»</b>. A partir del exponente 4 decimos «elevado a»: ${P(2,6)} es <b>«dos elevado a seis»</b>.</p>`],
    ['Error típico',`<div class="ex warn">${P(3,4)} no es 3 · 4</div><p>${P(3,4)} = 3 · 3 · 3 · 3 = <b>81</b>, mientras que 3 · 4 = 12. El exponente cuenta factores, no multiplica a la base.</p>`]
  ],
  gens:[
    ()=>{let b=ri(2,9),e=ri(2,7);while(e===b)e=ri(2,7);const base=Math.random()<.5;return mc(`En ${P(b,e)}, ¿cuál es ${base?'la <b>base</b>':'el <b>exponente</b>'}?`,String(base?b:e),[String(base?e:b),String(b*e),String(b+e)],`La base es el número que se repite (${b}). El exponente dice cuántas veces se multiplica (${e}).`)},
    ()=>{const b=ri(2,9),e=ri(3,7);return num(`Escribe como potencia:<br>${expand(b,e)} = ${b}<sup>?</sup>`,e,`El ${b} aparece ${e} veces, así que el exponente es ${e}: ${P(b,e)}.`,'Escribe solo el exponente.')},
    ()=>{const [b,e]=pick([[2,3],[2,4],[2,5],[2,6],[3,2],[3,3],[3,4],[4,2],[4,3],[5,2],[5,3],[6,2],[7,2],[10,3]]);return num(`Calcula ${P(b,e)}`,b**e,`${P(b,e)} = ${expand(b,e)} = ${fmt(b**e)}`)},
    ()=>{const b=ri(2,9),e=ri(2,6);const name=e===2?'al cuadrado':e===3?'al cubo':`elevado a ${W[e]}`;const other=e===2?'al cubo':'al cuadrado';return mc(`¿Cómo se lee ${P(b,e)}?`,`${W[b]} ${name}`,[`${W[b]} por ${W[e]}`,`${W[e]} elevado a ${W[b]}`,`${W[b]} ${other}`],`La base (${b}) se dice primero. Exponente 2 es «al cuadrado», 3 es «al cubo» y desde 4 decimos «elevado a».`)},
    ()=>{let b=ri(3,7),e=ri(3,5);while(b===e)e=ri(3,5);return mc(`¿Qué significa ${P(b,e)}?`,expand(b,e),[`${b} · ${e}`,expand(e,b),Array(e).fill(b).join(' + ')],`Es ${b} multiplicado por sí mismo ${e} veces: ${expand(b,e)}.`)},
    ()=>{const b=ri(2,4),e=ri(3,4);return mc(`¿Cuánto vale ${P(b,e)}?`,fmt(b**e),[fmt(b*e),fmt(e**b),fmt(b+e)],`${expand(b,e)} = ${fmt(b**e)}. Ojo: no es ${b} · ${e}.`)}
  ]},
{ title:'Cuadrados, cubos y casos especiales', sub:'Exponente 0 y 1, base 1 y base 10',
  lesson:[
    ['Cuadrados y cubos',`<p>Un número <b>al cuadrado</b> es el área de un cuadrado con ese lado. Un número <b>al cubo</b> es el volumen de un cubo con esa arista. Conviene saberse estos de memoria:</p>
     <div class="tbl"><table><tr><th>n</th>${[1,2,3,4,5,6,7,8,9,10].map(n=>`<th>${n}</th>`).join('')}</tr>
     <tr><th>n²</th>${[1,2,3,4,5,6,7,8,9,10].map(n=>`<td>${n*n}</td>`).join('')}</tr>
     <tr><th>n³</th>${[1,2,3,4,5,6,7,8,9,10].map(n=>`<td>${fmt(n**3)}</td>`).join('')}</tr></table></div>`],
    ['Exponente 1 y exponente 0',`<p>Cualquier número elevado a 1 es él mismo: ${P(7,1)} = 7. Y cualquier número (distinto de 0) elevado a 0 vale <span class="hl">1</span>. Mira el patrón: cada vez que bajamos el exponente, dividimos entre 2.</p>
     <div class="ex">${P(2,3)} = 8 → ${P(2,2)} = 4 → ${P(2,1)} = 2 → ${P(2,0)} = <b>1</b></div>`],
    ['Base 1 y base 10',`<p>El 1 multiplicado por sí mismo siempre da 1: ${P(1,50)} = 1.</p>
     <p>Las potencias de 10 llevan <span class="hl">tantos ceros como indica el exponente</span>:</p>
     <div class="ex">${P(10,3)} = 1000 &nbsp;·&nbsp; ${P(10,6)} = 1 000 000 (un millón)</div>`],
    ['Error típico',`<div class="ex warn">${P(2,3)} ≠ ${P(3,2)}</div><p>${P(2,3)} = 8 y ${P(3,2)} = 9. Cambiar base y exponente cambia el resultado.</p>`]
  ],
  gens:[
    ()=>{const n=ri(2,15);return num(`Calcula ${P(n,2)}`,n*n,`${n} · ${n} = ${n*n}`)},
    ()=>{const n=ri(2,6);return num(`Calcula ${P(n,3)}`,n**3,`${n} · ${n} · ${n} = ${n**3}`)},
    ()=>{const a=ri(2,99),k=ri(0,2);if(k===0)return num(`Calcula ${P(a,0)}`,1,`Todo número distinto de 0 elevado a 0 vale 1.`);if(k===1)return num(`Calcula ${P(a,1)}`,a,`Elevar a 1 deja el número igual: ${P(a,1)} = ${a}.`);const e=ri(5,99);return num(`Calcula ${P(1,e)}`,1,`1 · 1 · 1 · … siempre es 1.`)},
    ()=>{const n=ri(2,7),k=ri(0,1);if(k===0)return num(`Calcula ${P(10,n)}`,10**n,`Un 1 seguido de ${n} ceros: ${fmt(10**n)}.`);return num(`${fmt(10**n)} = 10<sup>?</sup>`,n,`Tiene ${n} ceros, así que es ${P(10,n)}.`,'Escribe solo el exponente.')},
    ()=>{const [a,b]=pick([[2,3],[2,5],[3,4],[2,4],[3,5],[2,6]]);const va=a**b,vb=b**a;const correct=va===vb?'Son iguales':va>vb?P(a,b):P(b,a);return mc(`¿Qué es mayor: ${P(a,b)} o ${P(b,a)}?`,correct,[P(a,b),P(b,a),'Son iguales'],`${P(a,b)} = ${va} y ${P(b,a)} = ${vb}.`)}
  ]},
{ title:'Potencias de números negativos', sub:'El signo según el exponente sea par o impar',
  lesson:[
    ['Regla del signo',`<p>Si la base es negativa, el signo del resultado depende del exponente:</p>
     <div class="ex">${P(-2,2)} = (−2)·(−2) = <b>+4</b><br>${P(-2,3)} = (−2)·(−2)·(−2) = <b>−8</b></div>
     <p>Exponente <span class="hl">par → resultado positivo</span>. Exponente <span class="hl">impar → resultado negativo</span>. Cada pareja de signos menos se convierte en un más.</p>`],
    ['Los paréntesis importan',`<div class="ex warn">${P(-3,2)} = 9 &nbsp;pero&nbsp; −3<sup>2</sup> = −9</div>
     <p>En −3<sup>2</sup> el exponente solo afecta al 3: es −(3 · 3) = −9. Con paréntesis, el exponente afecta al −3 entero.</p>`]
  ],
  gens:[
    ()=>{const [b,e]=pick([[2,2],[2,3],[2,4],[2,5],[3,2],[3,3],[3,4],[4,2],[4,3],[5,2],[5,3],[1,7],[1,8],[10,3]]);return num(`Calcula ${P(-b,e)}`,(-b)**e,`${expand(-b,e)} = ${fmt((-b)**e)}. Exponente ${e%2?'impar → negativo':'par → positivo'}.`,'Usa el botón ± para poner el signo menos.')},
    ()=>{const b=ri(2,9),e=ri(5,14);return mc(`El resultado de ${P(-b,e)}, ¿es positivo o negativo?`,e%2?'Negativo':'Positivo',['Positivo','Negativo'],`El exponente ${e} es ${e%2?'impar, así que el resultado es negativo':'par, así que el resultado es positivo'}.`)},
    ()=>{const b=ri(2,6);return num(`Calcula −${b}<sup>2</sup> (sin paréntesis)`,-(b*b),`Sin paréntesis, el exponente solo afecta al ${b}: −(${b}·${b}) = ${fmt(-(b*b))}.`,'Usa el botón ± para poner el signo menos.')},
    ()=>{const b=ri(2,5),o=pick([3,5]);return mc(`¿Cuál de estas potencias da un resultado negativo?`,P(-b,o),[P(-b,o+1),P(b,o),P(-b,2)],`${P(-b,o)} tiene base negativa y exponente impar.`)},
    ()=>{const b=ri(2,5);return mc(`Compara ${P(-b,2)} y −${b}<sup>2</sup>`,`${P(-b,2)} es mayor`,[`Son iguales`,`−${b}<sup>2</sup> es mayor`],`${P(-b,2)} = ${b*b} y −${b}<sup>2</sup> = ${fmt(-b*b)}.`)}
  ]},
{ title:'Multiplicar y dividir con la misma base', sub:'Se suman o se restan los exponentes',
  lesson:[
    ['Producto de la misma base',`<p>Se deja la base y se <span class="hl">suman los exponentes</span>:</p>
     <div class="ex">${P(2,3)} · ${P(2,2)} = (2·2·2)·(2·2) = ${P(2,5)}</div>
     <p>En general: ${P('a','m')} · ${P('a','n')} = ${P('a','m+n')}</p>`],
    ['Cociente de la misma base',`<p>Se deja la base y se <span class="hl">restan los exponentes</span>:</p>
     <div class="ex">${P(5,6)} : ${P(5,2)} = ${P(5,4)}</div>
     <p>Los dos cincos de abajo se «tachan» con dos de arriba. En general: ${P('a','m')} : ${P('a','n')} = ${P('a','m−n')}</p>`],
    ['Exponente invisible',`<p>Si un número no lleva exponente, tiene exponente 1:</p><div class="ex">7 · ${P(7,4)} = ${P(7,1)} · ${P(7,4)} = ${P(7,5)}</div>`],
    ['Error típico',`<div class="ex warn">${P(2,3)} · ${P(3,2)} no se puede juntar</div><p>Estas reglas solo funcionan si la <b>base es la misma</b>. Si no, calcula cada potencia por separado: 8 · 9 = 72.</p>`]
  ],
  gens:[
    ()=>{const a=ri(2,9),m=ri(2,9),n=ri(2,9);return num(`${P(a,m)} · ${P(a,n)} = ${a}<sup>?</sup>`,m+n,`Misma base: se suman los exponentes. ${m} + ${n} = ${m+n}.`,'Escribe solo el exponente.')},
    ()=>{const a=ri(2,9),n=ri(2,6),m=n+ri(1,7);return num(`${P(a,m)} : ${P(a,n)} = ${a}<sup>?</sup>`,m-n,`Misma base: se restan los exponentes. ${m} − ${n} = ${m-n}.`,'Escribe solo el exponente.')},
    ()=>{const a=ri(2,9),m=ri(2,6),n=ri(2,6),p=ri(1,5);return num(`${P(a,m)} · ${P(a,n)} · ${p===1?a:P(a,p)} = ${a}<sup>?</sup>`,m+n+p,`Se suman todos los exponentes: ${m} + ${n} + ${p} = ${m+n+p}.${p===1?` Recuerda que ${a} = ${P(a,1)}.`:''}`,'Escribe solo el exponente.')},
    ()=>{const [a,d]=pick([[2,1],[2,2],[2,3],[2,4],[3,1],[3,2],[3,3],[5,2],[10,2],[10,3]]);const n=ri(3,8);return num(`Calcula ${P(a,n+d)} : ${P(a,n)}`,a**d,`${P(a,n+d)} : ${P(a,n)} = ${P(a,d)} = ${a**d}`)},
    ()=>{const a=ri(2,7),m=ri(2,5),n=ri(3,6);return mc(`${P(a,m)} · ${P(a,n)} =`,P(a,m+n),[P(a,m*n),P(a*a,m+n),P(a*a,m*n)],`Se deja la base ${a} y se suman los exponentes: ${P(a,m+n)}.`)},
    ()=>{const a=ri(2,9),m=ri(2,8);return num(`${a} · ${P(a,m)} = ${a}<sup>?</sup>`,m+1,`El ${a} solo es ${P(a,1)}. Entonces 1 + ${m} = ${m+1}.`,'Escribe solo el exponente.')}
  ]},
{ title:'Potencia de una potencia', sub:'Y potencias con el mismo exponente',
  lesson:[
    ['Potencia de una potencia',`<p>Se deja la base y se <span class="hl">multiplican los exponentes</span>:</p>
     <div class="ex">(${P(3,2)})<sup>4</sup> = ${P(3,2)}·${P(3,2)}·${P(3,2)}·${P(3,2)} = ${P(3,8)}</div>
     <p>En general: (${P('a','m')})<sup>n</sup> = ${P('a','m·n')}</p>`],
    ['Mismo exponente: producto',`<p>Si los exponentes son iguales, se <span class="hl">multiplican las bases</span>. Es un truco muy útil para calcular:</p>
     <div class="ex">${P(2,3)} · ${P(5,3)} = ${P(10,3)} = 1000</div>`],
    ['Mismo exponente: cociente',`<p>Igual con la división: se dividen las bases.</p><div class="ex">${P(15,2)} : ${P(5,2)} = ${P(3,2)} = 9</div>`],
    ['Resumen de propiedades',`<div class="tbl"><table>
     <tr><th>Operación</th><th>Regla</th></tr>
     <tr><td>${P('a','m')} · ${P('a','n')}</td><td>${P('a','m+n')}</td></tr>
     <tr><td>${P('a','m')} : ${P('a','n')}</td><td>${P('a','m−n')}</td></tr>
     <tr><td>(${P('a','m')})<sup>n</sup></td><td>${P('a','m·n')}</td></tr>
     <tr><td>${P('a','n')} · ${P('b','n')}</td><td>(a·b)<sup>n</sup></td></tr>
     <tr><td>${P('a','n')} : ${P('b','n')}</td><td>(a:b)<sup>n</sup></td></tr></table></div>`]
  ],
  gens:[
    ()=>{const a=ri(2,9),m=ri(2,6),n=ri(2,5);return num(`(${P(a,m)})<sup>${n}</sup> = ${a}<sup>?</sup>`,m*n,`Potencia de una potencia: se multiplican los exponentes. ${m} · ${n} = ${m*n}.`,'Escribe solo el exponente.')},
    ()=>{const a=ri(2,5),b=ri(2,5),n=ri(2,9);return num(`${P(a,n)} · ${P(b,n)} = (?)<sup>${n}</sup>`,a*b,`Mismo exponente: se multiplican las bases. ${a} · ${b} = ${a*b}.`,'Escribe la base.')},
    ()=>{const c=ri(2,5),b=ri(2,4),n=ri(2,8);return num(`${P(c*b,n)} : ${P(b,n)} = (?)<sup>${n}</sup>`,c,`Mismo exponente: se dividen las bases. ${c*b} : ${b} = ${c}.`,'Escribe la base.')},
    ()=>{const a=ri(2,7),m=ri(2,4),n=ri(3,5);return mc(`(${P(a,m)})<sup>${n}</sup> =`,P(a,m*n),[P(a,m+n),P(a*n,m),P(a,m**n)],`Se multiplican los exponentes: ${m} · ${n} = ${m*n}.`)},
    ()=>{const n=ri(2,5),sw=Math.random()<.5;return num(`Calcula ${sw?P(5,n)+' · '+P(2,n):P(2,n)+' · '+P(5,n)}`,10**n,`Mismo exponente: 2 · 5 = 10, así que queda ${P(10,n)} = ${fmt(10**n)}.`)}
  ]},
{ title:'Operaciones combinadas', sub:'Jerarquía y simplificación paso a paso',
  lesson:[
    ['Orden de las operaciones',`<p>Cuando hay varias operaciones, se hacen en este orden:</p>
     <div class="ex">1. Paréntesis → 2. Potencias → 3. Multiplicaciones y divisiones → 4. Sumas y restas</div>
     <p>Ejemplo: 3 + ${P(2,4)} : 8 = 3 + 16 : 8 = 3 + 2 = <b>5</b></p>`],
    ['Simplificar antes de calcular',`<p>Usa las propiedades para dejar <b>una sola potencia</b> y calcula al final:</p>
     <div class="ex">(${P(2,5)} · ${P(2,3)}) : ${P(2,6)} = ${P(2,8)} : ${P(2,6)} = ${P(2,2)} = 4</div>`],
    ['Error típico',`<div class="ex warn">(2 + 3)<sup>2</sup> ≠ ${P(2,2)} + ${P(3,2)}</div><p>(2 + 3)<sup>2</sup> = ${P(5,2)} = 25, pero ${P(2,2)} + ${P(3,2)} = 4 + 9 = 13. Primero se resuelve el paréntesis.</p>`]
  ],
  gens:[
    ()=>{const a=ri(2,9),m=ri(2,7),n=ri(2,7),p=ri(1,m+n-1);return num(`(${P(a,m)} · ${P(a,n)}) : ${P(a,p)} = ${a}<sup>?</sup>`,m+n-p,`Primero ${m} + ${n} = ${m+n}; luego ${m+n} − ${p} = ${m+n-p}.`,'Escribe solo el exponente.')},
    ()=>{const a=ri(2,9),m=ri(2,4),n=ri(2,4),p=ri(1,m*n-1);return num(`(${P(a,m)})<sup>${n}</sup> : ${P(a,p)} = ${a}<sup>?</sup>`,m*n-p,`Primero ${m} · ${n} = ${m*n}; luego ${m*n} − ${p} = ${m*n-p}.`,'Escribe solo el exponente.')},
    ()=>{const a=ri(2,9),m=ri(2,6),n=ri(2,4),p=ri(2,4);return num(`${P(a,m)} · (${P(a,n)})<sup>${p}</sup> = ${a}<sup>?</sup>`,m+n*p,`Primero ${n} · ${p} = ${n*p}; luego ${m} + ${n*p} = ${m+n*p}.`,'Escribe solo el exponente.')},
    ()=>{const t=ri(0,3);
      if(t===0){const a=ri(2,9),b=ri(2,9);return num(`Calcula ${P(a,2)} + ${P(b,2)}`,a*a+b*b,`${a*a} + ${b*b} = ${a*a+b*b}`)}
      if(t===1){const k=ri(2,5),[b,e]=pick([[2,3],[2,4],[3,2],[3,3],[2,5]]);return num(`Calcula ${k} · ${P(b,e)}`,k*b**e,`Primero la potencia: ${P(b,e)} = ${b**e}. Luego ${k} · ${b**e} = ${k*b**e}.`)}
      if(t===2){const a=ri(1,5),b=ri(1,5);return num(`Calcula (${a} + ${b})<sup>2</sup>`,(a+b)**2,`Primero el paréntesis: ${a+b}. Luego ${P(a+b,2)} = ${(a+b)**2}.`)}
      const a=ri(3,5),b=ri(2,5);return num(`Calcula ${P(a,3)} − ${P(b,2)}`,a**3-b*b,`${a**3} − ${b*b} = ${a**3-b*b}`)},
    ()=>{const m=ri(3,6),n=ri(2,5),p=ri(2,m+n-1);return num(`Calcula ${P(10,m)} · ${P(10,n)} : ${P(10,p)}`,10**(m+n-p),`${P(10,m+n)} : ${P(10,p)} = ${P(10,m+n-p)} = ${fmt(10**(m+n-p))}`)},
    ()=>{const a=ri(1,4),b=ri(2,4);return mc(`¿Cuánto vale (${a} + ${b})<sup>2</sup>?`,String((a+b)**2),[String(a*a+b*b),String(2*(a+b)),String(a+b*b)],`Primero el paréntesis: ${a+b}, y luego ${P(a+b,2)} = ${(a+b)**2}.`)}
  ]}
];

const MODULES=[
  {id:'potencias',name:'Potencias',sym:P('a','n'),desc:'Qué son, sus propiedades y cómo operar con ellas.',levels:POT_LEVELS,
   exams:[{id:'p1',name:'Examen parcial A',sub:'Niveles 1 a 3',levels:[0,1,2],n:10},{id:'p2',name:'Examen parcial B',sub:'Niveles 4 a 6',levels:[3,4,5],n:10},{id:'pf',name:'Examen final',sub:'Todo el módulo',levels:[0,1,2,3,4,5],n:12}]},
  {id:'raices',name:'Raíces cuadradas',sym:'√',desc:'Raíces exactas y aproximadas.',soon:true},
  {id:'divis',name:'Divisibilidad',sym:'m.c.m.',desc:'Múltiplos, divisores, mcm y mcd.',soon:true},
  {id:'enteros',name:'Números enteros',sym:'ℤ',desc:'Operaciones con signo y recta numérica.',soon:true}
];

export { $, ri, pick, shuffle, fmt, P, expand, W, mc, num, parseNum, POT_LEVELS, MODULES };
