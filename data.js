/* ---------- utilidades ---------- */
const $=s=>document.querySelector(s);
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const fmt=n=>{const neg=n<0;let [s,d]=String(Math.abs(n)).split('.');if(s.length>=5)s=s.replace(/\B(?=(\d{3})+(?!\d))/g,' ');return (neg?'−':'')+s+(d?','+d:'')};
const P=(b,e)=>{const bs=typeof b==='number'?(b<0?`(${fmt(b)})`:fmt(b)):b;return `<span class="pw">${bs}<sup>${e}</sup></span>`};
const R=x=>`<span class="rt"><span class="rad" aria-hidden="true">√</span><span class="sr">raíz de </span><span class="rc">${typeof x==='number'?fmt(x):x}</span></span>`;
const isqrt=n=>{let r=Math.floor(Math.sqrt(n));while(r*r>n)r--;while((r+1)*(r+1)<=n)r++;return r};
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

/* ---------- contenido: módulo Raíces cuadradas ---------- */
const nonSquare=(a,b)=>{let n;do n=ri(a,b);while(isqrt(n)**2===n);return n};
const squaresRow=(from,to)=>{const ns=Array.from({length:to-from+1},(_,i)=>from+i);return `<tr><th>n</th>${ns.map(n=>`<th>${n}</th>`).join('')}</tr><tr><th>n²</th>${ns.map(n=>`<td>${n*n}</td>`).join('')}</tr>`};
const RAI_LEVELS=[
{ title:'¿Qué es una raíz cuadrada?', sub:'La operación inversa de elevar al cuadrado',
  lesson:[
    ['Deshacer un cuadrado',`<p>Elevar al cuadrado es multiplicar un número por sí mismo: ${P(7,2)} = 7 · 7 = 49. La <span class="hl">raíz cuadrada</span> hace el camino contrario: busca el número que, multiplicado por sí mismo, da 49.</p>
     <div class="ex">${R(49)} = 7 &nbsp;porque&nbsp; ${P(7,2)} = 49</div>
     <p>El símbolo √ se llama <b>radical</b>, el número de dentro es el <span class="hl">radicando</span> y el resultado es la <span class="hl">raíz</span>.</p>`],
    ['El lado de un cuadrado',`<p>Si un cuadrado tiene un área de 36 cm², su lado mide ${R(36)} = <b>6 cm</b>, porque 6 · 6 = 36. Por eso se llama raíz <i>cuadrada</i>.</p>`],
    ['Cómo se lee',`<p>${R(25)} se lee <b>«raíz cuadrada de veinticinco»</b> o, más corto, <b>«raíz de veinticinco»</b>.</p>`],
    ['Error típico',`<div class="ex warn">${R(16)} no es 8</div><p>La raíz no es la mitad del número. ${R(16)} = 4 porque 4 · 4 = 16. En cambio, 8 · 8 = 64, así que ${R(64)} = 8.</p>`]
  ],
  gens:[
    ()=>{const n=ri(1,12);return num(`Calcula ${R(n*n)}`,n,`${n} · ${n} = ${n*n}, así que ${R(n*n)} = ${n}.`)},
    ()=>{const n=ri(3,10);return mc(`¿Por qué ${R(n*n)} = ${n}?`,`Porque ${n} · ${n} = ${n*n}`,[`Porque ${n} · 2 = ${2*n}`,`Porque ${n} + ${n} = ${2*n}`,`Porque ${n*n} es la mitad de ${2*n*n}`],`La raíz cuadrada busca el número que multiplicado por sí mismo da el radicando: ${P(n,2)} = ${n*n}.`)},
    ()=>{const n=ri(3,12),q=Math.random()<.5;return mc(`En ${R(n*n)} = ${n}, ¿cuál es ${q?'el <b>radicando</b>':'la <b>raíz</b>'}?`,String(q?n*n:n),[String(q?n:n*n),'√',String(2*n)],`El radicando es el número de dentro del radical (${n*n}). La raíz es el resultado (${n}).`)},
    ()=>{const n=ri(2,12);return num(`Un cuadrado tiene un área de ${n*n} cm². ¿Cuánto mide su lado?`,n,`El lado mide ${R(n*n)} = ${n} cm, porque ${n} · ${n} = ${n*n}.`,'Escribe solo el número de centímetros.')},
    ()=>{const n=pick([4,6,8,10,12,14,16]);return mc(`¿Cuánto vale ${R(n*n)}?`,String(n),[String(n*n/2),String(n*n),String(n-1)],`${n} · ${n} = ${n*n}. Ojo: no es la mitad de ${n*n}.`)}
  ]},
{ title:'Cuadrados perfectos y raíces exactas', sub:'Reconocer cuadrados perfectos y calcular su raíz',
  lesson:[
    ['Cuadrados perfectos',`<p>Un número es un <span class="hl">cuadrado perfecto</span> si es el cuadrado de un número natural. Su raíz cuadrada es <b>exacta</b>. Conviene saberse estos:</p>
     <div class="tbl"><table>${squaresRow(1,10)}${squaresRow(11,20)}</table></div>`],
    ['Con ceros detrás',`<p>Si el radicando acaba en un número <b>par</b> de ceros, la raíz lleva <span class="hl">la mitad de ceros</span>:</p>
     <div class="ex">${R(900)} = 30 &nbsp;·&nbsp; ${R(10000)} = 100 &nbsp;·&nbsp; ${R(250000)} = 500</div>
     <p>Compruébalo: 30 · 30 = 900.</p>`],
    ['¿Es cuadrado perfecto?',`<p>Un cuadrado perfecto <b>nunca acaba en 2, 3, 7 u 8</b>. Si acaba en otra cifra, busca entre qué cuadrados de la tabla está: si no coincide con ninguno, no es cuadrado perfecto.</p>`],
    ['Error típico',`<div class="ex warn">${R(90)} no es 30</div><p>30 · 30 = 900, no 90. Los ceros tienen que ir <b>por parejas</b>: 90 tiene un solo cero y no es cuadrado perfecto.</p>`]
  ],
  gens:[
    ()=>{const n=ri(11,20);return num(`Calcula ${R(n*n)}`,n,`${n} · ${n} = ${n*n}, así que ${R(n*n)} = ${n}.`)},
    ()=>{const k=ri(4,15);return mc(`¿Cuál de estos números es un cuadrado perfecto?`,String(k*k),[String(k*k+1),String(k*k-1),String(k*k+k)],`${k*k} = ${k} · ${k}. Los otros quedan entre dos cuadrados seguidos de la tabla, así que no son cuadrados perfectos.`)},
    ()=>{const k=ri(2,9),z=pick([2,4]);const n=k*k*10**z;return num(`Calcula ${R(n)}`,k*10**(z/2),`${R(n)} = ${fmt(k*10**(z/2))}: la raíz de ${k*k} es ${k} y de ${z} ceros pasamos a ${z/2}. Compruébalo: ${fmt(k*10**(z/2))} · ${fmt(k*10**(z/2))} = ${fmt(n)}.`)},
    ()=>{const k=ri(5,20),yes=Math.random()<.5,n=yes?k*k:k*k+ri(1,2*k);const r=isqrt(n);return mc(`¿Es ${n} un cuadrado perfecto?`,yes?'Sí':'No',['Sí','No'],yes?`Sí: ${n} = ${k} · ${k}.`:`No: ${P(r,2)} = ${r*r} y ${P(r+1,2)} = ${(r+1)**2}, y ${n} está entre los dos.`)},
    ()=>{const n=ri(6,20);return num(`¿Qué número natural elevado al cuadrado da ${n*n}?`,n,`${P(n,2)} = ${n*n}, así que es ${R(n*n)} = ${n}.`)},
    ()=>{const d=pick([2,3,7,8]),bad=ri(10,99)*10+d;const sq=shuffle([11,12,13,14,15,16,17,18,19,21,22,23,24,25]).slice(0,3);return mc(`¿Cuál de estos números <b>no</b> es un cuadrado perfecto?`,String(bad),sq.map(k=>String(k*k)),`${bad} acaba en ${d}, y ningún cuadrado perfecto acaba en 2, 3, 7 u 8. Los otros sí lo son: ${sq.map(k=>`${k*k} = ${P(k,2)}`).join(', ')}.`)}
  ]},
{ title:'Raíces enteras y aproximadas', sub:'Raíz entera, resto y estimación',
  lesson:[
    ['Entre dos cuadrados',`<p>30 no es un cuadrado perfecto, pero está entre dos: ${P(5,2)} = 25 &lt; 30 &lt; 36 = ${P(6,2)}. Por eso ${R(30)} está <b>entre 5 y 6</b>.</p>`],
    ['Raíz entera y resto',`<p>La <span class="hl">raíz entera</span> (por defecto) es el mayor número cuyo cuadrado no pasa del radicando. El <span class="hl">resto</span> es lo que sobra:</p>
     <div class="ex">${R(30)}: raíz entera 5 y resto 30 − 25 = 5</div>
     <p>Se comprueba así: radicando = raíz² + resto → 30 = ${P(5,2)} + 5.</p>`],
    ['Aproximar a las décimas',`<p>Para afinar se prueba con décimas: 5,4 · 5,4 = 29,16 y 5,5 · 5,5 = 30,25. Como 30 está entre los dos, ${R(30)} ≈ <b>5,4</b> por defecto.</p>`],
    ['Error típico',`<div class="ex warn">El resto nunca pasa del doble de la raíz</div><p>Si la raíz entera es 5, el resto puede ser como mucho 10: con 25 + 11 = 36 = ${P(6,2)} ya llegamos al siguiente cuadrado y la raíz entera sería 6.</p>`]
  ],
  gens:[
    ()=>{const n=nonSquare(10,400),r=isqrt(n);return num(`¿Cuál es la raíz entera de ${n}?`,r,`${P(r,2)} = ${r*r} ≤ ${n} &lt; ${(r+1)**2} = ${P(r+1,2)}, así que la raíz entera es ${r}.`)},
    ()=>{const n=nonSquare(10,400),r=isqrt(n);return num(`Calcula el resto de la raíz entera de ${n}`,n-r*r,`La raíz entera es ${r} porque ${P(r,2)} = ${r*r}. El resto es ${n} − ${r*r} = ${n-r*r}.`)},
    ()=>{const n=nonSquare(10,150),r=isqrt(n),h=Math.floor(n/2);return mc(`${R(n)} está entre…`,`${r} y ${r+1}`,[`${r-1} y ${r}`,`${r+1} y ${r+2}`,`${h} y ${h+1}`],`${P(r,2)} = ${r*r} &lt; ${n} &lt; ${(r+1)**2} = ${P(r+1,2)}.`)},
    ()=>{const r=ri(3,15),s=ri(1,2*r);return num(`La raíz entera de un número es ${r} y el resto es ${s}. ¿Cuál es el número?`,r*r+s,`Radicando = raíz² + resto = ${P(r,2)} + ${s} = ${r*r} + ${s} = ${r*r+s}.`)},
    ()=>{const n=nonSquare(2,99),d=isqrt(n*100);return num(`Calcula ${R(n)} con una cifra decimal (por defecto)`,d/10,`${fmt(d/10)} · ${fmt(d/10)} = ${fmt(d*d/100)} y ${fmt((d+1)/10)} · ${fmt((d+1)/10)} = ${fmt((d+1)**2/100)}. Como ${n} está entre los dos, ${R(n)} ≈ ${fmt(d/10)}.`,'Usa la coma decimal: por ejemplo, 5,4.')}
  ]}
];

const MODULES=[
  {id:'potencias',name:'Potencias',sym:P('a','n'),desc:'Qué son, sus propiedades y cómo operar con ellas.',levels:POT_LEVELS,
   exams:[{id:'p1',name:'Examen parcial A',sub:'Niveles 1 a 3',levels:[0,1,2],n:10},{id:'p2',name:'Examen parcial B',sub:'Niveles 4 a 6',levels:[3,4,5],n:10},{id:'pf',name:'Examen final',sub:'Todo el módulo',levels:[0,1,2,3,4,5],n:12}]},
  {id:'raices',name:'Raíces cuadradas',sym:'√',desc:'Raíces exactas y aproximadas.',levels:RAI_LEVELS,soon:true},
  {id:'divis',name:'Divisibilidad',sym:'m.c.m.',desc:'Múltiplos, divisores, mcm y mcd.',soon:true},
  {id:'enteros',name:'Números enteros',sym:'ℤ',desc:'Operaciones con signo y recta numérica.',soon:true}
];

export { $, ri, pick, shuffle, fmt, P, R, isqrt, expand, W, mc, num, parseNum, POT_LEVELS, RAI_LEVELS, MODULES };
