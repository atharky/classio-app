import { ri, pick, shuffle, mc, num } from './data.js';
import { at, seq, line, real, sk, stroke, ln, box, circ, fill, dot, tx, arrow, person, ell, pointer } from './sketch.js';

/* ---------- dibujos del material (viewBox 120 × 140) ---------- */
const marks=(x,ys,d,w=8)=>ys.map((y,k)=>ln(x,y,x+w,y,d+k*.06,{t:.08})).join('');
const DRAW={
  vaso:d=>stroke('M30 22L30 118Q30 128 40 128L80 128Q90 128 90 118L90 22',d,{t:.8})+ln(24,17,31,23,d+.8,{t:.15})+marks(34,[50,70,90],d+.9)+fill(33,82,54,43,d+1.2),
  erlen:d=>stroke('M50 15L50 50L20 118Q16 128 28 128L92 128Q104 128 100 118L70 50L70 15',d,{t:.9})+ln(45,15,75,15,d+.9,{t:.15})+fill(30,96,60,29,d+1.2),
  probeta:d=>stroke('M50 8L50 118L70 118L70 8',d,{t:.7})+ln(34,124,86,124,d+.7,{t:.2})+marks(52,[28,48,68,88,108],d+.9,7)+fill(52,70,16,46,d+1.3),
  tubo:d=>stroke('M50 10L50 106Q60 128 70 106L70 10',d,{t:.7})+ln(45,10,75,10,d+.7,{t:.15})+fill(52,80,16,28,d+1),
  pipeta:d=>stroke('M56 4L56 110L60 132L64 110L64 4',d,{t:.8})+marks(57,[20,40,60,80,100],d+.9,4),
  embudo:d=>stroke('M16 22L104 22L66 74L66 128L54 128L54 74Z',d,{t:.9}),
  petri:d=>ell(60,84,46,14,d)+ell(60,72,46,14,d+.5)+ln(14,72,14,84,d+.9,{t:.1})+ln(106,72,106,84,d+1,{t:.1}),
  reloj:d=>stroke('M12 62Q60 100 108 62',d,{t:.6})+stroke('M12 62Q60 92 108 62',d+.5,{t:.5}),
  mechero:d=>box(28,118,64,10,d,{t:.5})+stroke('M52 118L52 52L68 52L68 118',d+.5,{t:.5})+circ(76,104,5,d+1)+stroke('M60 48Q44 30 57 10Q60 26 66 20Q74 36 60 48',d+1.2,{c:'blue',t:.6}),
  gradilla:d=>box(12,62,96,10,d,{t:.5})+ln(14,72,14,122,d+.5)+ln(106,72,106,122,d+.6)+ln(8,122,112,122,d+.7)+[32,52,72,92].map((x,k)=>stroke(`M${x-5} 40L${x-5} 100Q${x} 112 ${x+5} 100L${x+5} 40`,d+1+k*.2,{t:.3})).join(''),
  balanza:d=>box(12,88,96,34,d,{t:.6})+box(26,98,46,16,d+.6,{t:.3})+tx(49,110,'0,0 g',d+1,{s:11})+ell(60,80,40,6,d+.9)+circ(90,106,5,d+1.2),
  termometro:d=>stroke('M54 10L54 104A12 12 0 1 0 66 104L66 10Q60 2 54 10',d,{t:.8})+dot(60,113,7,d+.9,'red')+fill(58,50,4,58,d+1,'red')+marks(67,[30,50,70,90],d+1.1,6),
  pinzas:d=>stroke('M12 64L108 56M12 76L108 84',d,{t:.5})+box(12,62,34,16,d+.6,{t:.4})+ln(60,60,60,80,d+1,{t:.15}),
  mortero:d=>stroke('M18 70Q60 140 102 70Z',d,{t:.8})+stroke('M70 24L88 78',d+.8,{t:.3})+stroke('M64 26L82 80',d+.9,{t:.3}),
  jarra:d=>stroke('M28 30L34 124L86 124L92 30',d,{t:.8})+stroke('M92 46Q112 52 108 80Q104 98 89 98',d+.8,{t:.4})+marks(36,[60,80,100],d+1.1)+fill(36,86,48,36,d+1.3)
};
const NAME={vaso:'vaso de precipitados',erlen:'matraz Erlenmeyer',probeta:'probeta',tubo:'tubo de ensayo',pipeta:'pipeta',embudo:'embudo',petri:'placa de Petri',reloj:'vidrio de reloj',
  mechero:'mechero Bunsen',gradilla:'gradilla',balanza:'balanza',termometro:'termómetro',pinzas:'pinzas de madera',mortero:'mortero'};
const cap=s=>s[0].toUpperCase()+s.slice(1);
// Nombre con su artículo: «la probeta», «las pinzas de madera»…
const FEM=new Set(['probeta','pipeta','petri','balanza','gradilla','rejilla']);
const the=k=>({pinzas:'las',portas:'los'}[k]||(FEM.has(k)?'la':'el'))+' '+NAME[k];
const pic=(k,d=0,cls='inst')=>sk(120,140,DRAW[k](d),cls);
const labeled=(ks,d0=0,step=1.6)=>`<div class="row instrow">${ks.map((k,i)=>`<figure class="instfig">${pic(k,d0+i*step)}<figcaption>${at(d0+i*step+1.2,NAME[k])}</figcaption></figure>`).join('')}</div>`;

/* ---------- el microscopio (dibujo de 160 × 200, con margen a la derecha para las etiquetas) ---------- */
const MICRO=d=>box(30,175,100,18,d)+stroke('M100 175Q128 120 100 60',d+.4,{t:.5})+ln(77,60,100,60,d+.6)+box(55,35,22,50,d+.8)+box(58,14,16,21,d+1.1)+box(50,85,32,9,d+1.4)
  +box(55,94,8,16,d+1.6,{t:.3})+box(69,94,8,20,d+1.7,{t:.3})+box(32,118,74,6,d+1.9,{t:.5})+circ(66,150,8,d+2.1)+ln(66,158,66,175,d+2.2)+circ(110,128,9,d+2.3)+circ(110,150,5,d+2.5);
const PARTS={
  ocular:{at:[74,24],from:[206,24],fn:'Es la lente por la que miras.',kind:'óptica'},
  objetivos:{at:[55,102],from:[4,88],fn:'Son las lentes que están cerca de la muestra; cada una tiene distintos aumentos.',kind:'óptica'},
  'revólver':{at:[82,89],from:[206,80],fn:'Es la pieza que gira para cambiar de objetivo.',kind:'mecánica'},
  platina:{at:[32,122],from:[4,132],fn:'Es la superficie donde se coloca la preparación.',kind:'mecánica'},
  'tornillo macrométrico':{at:[119,130],from:[206,152],fn:'Sirve para el enfoque rápido: sube o baja mucho la platina.',kind:'mecánica'},
  'tornillo micrométrico':{at:[115,152],from:[206,178],fn:'Sirve para el enfoque fino: ajusta la imagen con precisión.',kind:'mecánica'},
  foco:{at:[58,152],from:[4,162],fn:'Es la lámpara que ilumina la muestra desde abajo.',kind:'óptica'},
  brazo:{at:[114,112],from:[206,118],fn:'Une la base con el tubo; por él se coge el microscopio para llevarlo.',kind:'mecánica'},
  base:{at:[30,186],from:[4,198],fn:'Es el pie que da estabilidad al microscopio.',kind:'mecánica'}};
// La etiqueta va encima del origen de la flecha, o debajo si la flecha sube, para no cruzarse con ella.
const microInner=(d=0,mark,labels=[])=>MICRO(d)+(mark?pointer(...PARTS[mark].from,...PARTS[mark].at,d+2.8):'')
  +labels.map(([p,t],k)=>pointer(...PARTS[p].from,...PARTS[p].at,d+2.8+k*1.2)+tx(PARTS[p].from[0],PARTS[p].from[1]+(PARTS[p].at[1]<PARTS[p].from[1]?16:-6),p.replace('tornillo ',''),d+3.1+k*1.2,{s:12,c:'red',a:PARTS[p].from[0]<60?'start':'end'})).join('')
const micro=(d,mark,labels)=>sk(210,202,microInner(d,mark,labels),'micro');
// Microscopio con algo dibujado a su izquierda (una persona, la preparación…), todo en un mismo dibujo.
const microScene=(left,d,mark,labels)=>sk(330,202,left+`<g transform="translate(120,0)">${microInner(d,mark,labels)}</g>`,'micro');

/* ---------- pictogramas de peligro (viewBox 120 × 120) ---------- */
const DIAMOND=d=>stroke('M60 6L114 60L60 114L6 60Z',d,{c:'red',t:.7});
const PICTO={
  inflamable:{name:'Inflamable',fn:'arde con facilidad',ex:'el alcohol o la gasolina',draw:d=>stroke('M60 86Q36 70 50 46Q53 60 60 54Q57 38 66 28Q84 54 74 72Q71 62 65 66Q71 80 60 86',d,{t:.7})+ln(40,90,80,90,d+.6,{t:.2})},
  'tóxico':{name:'Tóxico',fn:'puede causar daños graves o la muerte si se traga, se respira o se toca',ex:'algunos pesticidas',draw:d=>circ(60,50,14,d)+dot(55,48,3,d+.4)+dot(65,48,3,d+.4)+ln(42,74,78,92,d+.6,{t:.2})+ln(42,92,78,74,d+.8,{t:.2})},
  corrosivo:{name:'Corrosivo',fn:'destruye la piel y algunos materiales',ex:'la lejía o los ácidos',draw:d=>ln(36,36,52,50,d,{t:.2})+dot(55,58,2.5,d+.4)+dot(57,68,2.5,d+.6)+stroke('M30 88L42 80L50 90L60 80L70 90L80 80L90 88',d+.8,{t:.4})},
  nocivo:{name:'Nocivo o irritante',fn:'puede irritar la piel, los ojos o las vías respiratorias',ex:'algunos detergentes',draw:d=>ln(60,32,60,70,d,{t:.3})+dot(60,82,4,d+.4)},
  explosivo:{name:'Explosivo',fn:'puede explotar con un golpe, una chispa o el calor',ex:'los fuegos artificiales',draw:d=>circ(60,62,8,d)+[0,1,2,3,4,5,6,7].map(k=>{const a=k*Math.PI/4;return ln(+(60+12*Math.cos(a)).toFixed(1),+(62+12*Math.sin(a)).toFixed(1),+(60+26*Math.cos(a)).toFixed(1),+(62+26*Math.sin(a)).toFixed(1),d+.3+k*.06,{t:.12})}).join('')},
  ambiente:{name:'Peligroso para el medio ambiente',fn:'es dañino para las plantas y los animales, sobre todo los acuáticos',ex:'algunos insecticidas',draw:d=>ln(42,40,42,86,d,{t:.2})+stroke('M42 44Q28 52 42 62Q56 52 42 44',d+.3,{t:.3})+stroke('M58 78Q72 66 86 78Q72 90 58 78L50 70L50 86Z',d+.6,{t:.4})}};
const picto=(k,d=0)=>sk(120,120,DIAMOND(d)+PICTO[k].draw(d+.7),'picto');

/* ---------- contenido: Biología · Material de laboratorio ---------- */
const GLASS=['vaso','erlen','probeta','tubo','pipeta','embudo','petri','reloj'];
const USE={vaso:'contener, mezclar y calentar líquidos (sus marcas son solo aproximadas)',erlen:'mezclar o calentar líquidos agitándolos sin que salpiquen',
  probeta:'medir volúmenes de líquido con bastante precisión',tubo:'hacer reacciones o calentar pequeñas cantidades de sustancias',pipeta:'medir y trasladar volúmenes pequeños de líquido con mucha precisión',
  embudo:'pasar líquidos a recipientes de boca estrecha o filtrar con papel de filtro',petri:'cultivar microorganismos o colocar muestras pequeñas',reloj:'pesar sólidos o evaporar pequeñas cantidades de líquido',
  mechero:'calentar con una llama',gradilla:'sostener los tubos de ensayo en posición vertical',pinzas:'sujetar un tubo de ensayo mientras se calienta',mortero:'triturar o moler sustancias sólidas',
  balanza:'medir la masa de una sustancia',termometro:'medir la temperatura',soporte:'sujetar otros materiales con nueces y pinzas',rejilla:'repartir el calor de la llama bajo un recipiente',
  escobillon:'limpiar el interior de los tubos de ensayo',lavador:'echar agua destilada en pequeñas cantidades',portas:'preparar las muestras que se observan al microscopio'};
const OTHER=['mechero','gradilla','pinzas','mortero','balanza','termometro','soporte','rejilla','escobillon','lavador','portas'];
Object.assign(NAME,{soporte:'soporte universal',rejilla:'rejilla',escobillon:'escobillón',lavador:'frasco lavador',portas:'portaobjetos y cubreobjetos'});
const SITUATIONS=[['Quieres medir exactamente 25 mL de agua.','probeta',['vaso','embudo','petri']],['Quieres cultivar bacterias para observarlas.','petri',['tubo','probeta','embudo']],
  ['Tienes que pasar un líquido a una botella de cuello estrecho.','embudo',['reloj','petri','pipeta']],['Quieres evaporar unas gotas de agua salada para ver los cristales de sal.','reloj',['probeta','embudo','pipeta']],
  ['Necesitas agitar una mezcla sin que salpique.','erlen',['reloj','petri','pipeta']],['Tienes que tomar 2 mL exactos de un líquido.','pipeta',['vaso','erlen','embudo']],
  ['Quieres calentar un poco de sustancia sobre la llama.','tubo',['probeta','pipeta','reloj']]];
const fromKeys=ks=>ks.map(k=>cap(NAME[k]));

const LAB_LEVELS=[
{ title:'Material de vidrio', sub:'Para qué sirve cada recipiente',
  lesson:[
    ['¿Por qué de vidrio?',`<p>Casi todo el material de laboratorio es de <b>vidrio</b> porque es <span class="hl">transparente</span> (se ve lo que hay dentro), <span class="hl">resiste el calor</span> y no reacciona con la mayoría de las sustancias.</p>`],
    ['Para contener, mezclar y calentar',`${labeled(['vaso','erlen','tubo'],0,.6)}<p>El <b>vaso de precipitados</b> y el <b>matraz Erlenmeyer</b> contienen, mezclan y calientan líquidos; el cuello estrecho del Erlenmeyer evita salpicaduras. El <b>tubo de ensayo</b> sirve para pequeñas cantidades.</p>`],
    ['Para medir volúmenes',`${labeled(['probeta','pipeta'],0,.6)}<p>La <b>probeta</b> mide volúmenes con bastante precisión, y la <b>pipeta</b>, volúmenes pequeños con mucha precisión. El volumen se mide en <b>mililitros (mL)</b>.</p>`],
    ['Otros',`${labeled(['embudo','petri','reloj'],0,.6)}<p>El <b>embudo</b> pasa líquidos o filtra; la <b>placa de Petri</b> sirve para cultivar microorganismos; el <b>vidrio de reloj</b>, para pesar sólidos o evaporar líquidos.</p>`],
    ['Error típico',`<div class="ex warn">Medir con el vaso de precipitados</div><p>Sus marcas solo dan un volumen <b>aproximado</b>. Si necesitas una cantidad exacta, usa la <b>probeta</b> o la <b>pipeta</b>.</p>`]
  ],
  gens:[
    ()=>{const k=pick(GLASS);return mc(`¿Cómo se llama este material?${pic(k)}`,cap(NAME[k]),fromKeys(shuffle(GLASS.filter(x=>x!==k&&!(['vaso','erlen'].includes(k)&&['vaso','erlen'].includes(x)))).slice(0,3)),`Es ${the(k)}: sirve para ${USE[k]}.`)},
    ()=>{const k=pick(GLASS);return mc(`¿Qué material sirve para <b>${USE[k]}</b>?`,cap(NAME[k]),fromKeys(shuffle(GLASS.filter(x=>x!==k&&!(['vaso','erlen'].includes(k)&&['vaso','erlen'].includes(x)))).slice(0,3)),`${cap(NAME[k])}: sirve para ${USE[k]}.`)},
    ()=>{const k=pick(GLASS);return mc(`¿Para qué sirve${k==='pinzas'?'n':''} <b>${the(k)}</b>?`,cap(USE[k]),shuffle(GLASS.filter(x=>x!==k&&!(['vaso','erlen'].includes(k)&&['vaso','erlen'].includes(x)))).slice(0,3).map(x=>cap(USE[x])),`${cap(NAME[k])}: sirve para ${USE[k]}.`)},
    ()=>{const [s,k,ws]=pick(SITUATIONS);return mc(`${s} ¿Qué material usas?`,cap(NAME[k]),fromKeys(ws),`${cap(NAME[k])}: sirve para ${USE[k]}.`)},
    ()=>{const best=pick(['probeta','pipeta']);return mc(`¿Qué material mide el volumen de un líquido con <b>más precisión</b>?`,cap(NAME[best]),fromKeys(['vaso','erlen','embudo']),`${cap(the(best))} está graduada con precisión; las marcas del vaso o del Erlenmeyer son aproximadas.`)}
  ]},
{ title:'Otros instrumentos', sub:'Calentar, sujetar, triturar y medir',
  lesson:[
    ['Calentar y sujetar',`${labeled(['mechero','pinzas','gradilla'],0,.6)}<p>El <b>mechero Bunsen</b> calienta con una llama. Las <b>pinzas de madera</b> sujetan el tubo de ensayo mientras se calienta, y la <b>gradilla</b> sostiene los tubos. El <b>soporte universal</b> sujeta otros materiales, y la <b>rejilla</b> reparte el calor bajo un recipiente.</p>`],
    ['Medir',`${labeled(['balanza','termometro'],0,.6)}<p>La <b>balanza</b> mide la <span class="hl">masa</span> (en gramos, g) y el <b>termómetro</b>, la <span class="hl">temperatura</span> (en grados Celsius, °C). Recuerda: la probeta mide el <span class="hl">volumen</span> (en mililitros, mL).</p>`],
    ['Más material',`<p>El <b>mortero</b> tritura sólidos; el <b>escobillón</b> limpia los tubos; el <b>frasco lavador</b> echa agua destilada; el <b>portaobjetos</b> y el <b>cubreobjetos</b> sirven para preparar muestras para el microscopio.</p>`],
    ['Error típico',`<div class="ex warn">Sujetar con la mano un tubo que se está calentando</div><p>El vidrio caliente parece frío y quema. Usa siempre las <b>pinzas de madera</b> y apunta la boca del tubo lejos de las personas.</p>`]
  ],
  gens:[
    ()=>{const k=pick(['mechero','gradilla','balanza','termometro','pinzas','mortero']);return mc(`¿Cómo se llama este instrumento?${pic(k)}`,cap(NAME[k]),fromKeys(shuffle(OTHER.filter(x=>x!==k)).slice(0,3)),`${k==='pinzas'?'Son':'Es'} ${the(k)}: ${k==='pinzas'?'sirven':'sirve'} para ${USE[k]}.`)},
    ()=>{const k=pick(OTHER);return mc(`¿Qué instrumento sirve para <b>${USE[k]}</b>?`,cap(NAME[k]),fromKeys(shuffle(OTHER.filter(x=>x!==k)).slice(0,3)),`${cap(NAME[k])}: sirve para ${USE[k]}.`)},
    ()=>{const [k,m,u]=pick([['balanza','La masa','gramos (g)'],['termometro','La temperatura','grados Celsius (°C)'],['probeta','El volumen','mililitros (mL)']]);
      return mc(`¿Qué magnitud mide ${k==='probeta'?'la probeta':k==='balanza'?'la balanza':'el termómetro'}?`,m,['La masa','La temperatura','El volumen','El tiempo'].filter(x=>x!==m),`${m}, que se expresa en ${u}.`)},
    ()=>{const v=ri(60,180),w=ri(40,300);return num(`La balanza marca ${v} g con un vaso vacío y ${v+w} g con el vaso lleno de agua. ¿Cuántos gramos de agua hay?`,w,`Se resta la masa del vaso: ${v+w} − ${v} = ${w} g de agua.`)},
    ()=>{const [t,ok,why]=pick([['El mechero Bunsen sirve para medir la temperatura.',false,'calienta; la temperatura se mide con el termómetro.'],['La gradilla sostiene los tubos de ensayo.',true,''],['Un tubo que se calienta se sujeta con pinzas de madera.',true,''],['La balanza mide el volumen.',false,'mide la masa; el volumen se mide con la probeta.'],['El escobillón sirve para limpiar los tubos de ensayo.',true,'']]);
      return mc(`¿Verdadero o falso?<br>«${t}»`,ok?'Verdadero':'Falso',['Verdadero','Falso'],ok?'Es verdadero.':'Es falso: '+why)}
  ]},
{ title:'El microscopio óptico', sub:'Sus partes, los aumentos y cómo enfocar',
  lesson:[
    ['¿Para qué sirve?',`<p>El <b>microscopio óptico</b> aumenta la imagen de objetos tan pequeños que no se ven a simple vista, como las <span class="hl">células</span>. Usa la luz y un juego de lentes.</p>`],
    ['Sus partes',`<div class="row" style="justify-content:center">${micro(0,null,[['ocular'],['objetivos'],['platina'],['tornillo macrométrico'],['foco']])}</div>
     <p>Parte <b>óptica</b> (la que forma la imagen): ocular, objetivos, foco o lámpara y diafragma (regula la luz). Parte <b>mecánica</b> (el soporte): base, brazo, platina, revólver y tornillos macrométrico y micrométrico.</p>`],
    ['Los aumentos',`<p>Los aumentos totales se calculan <span class="hl">multiplicando</span> los del ocular por los del objetivo:</p><div class="ex">ocular 10× · objetivo 40× = <b>400 aumentos</b></div>`],
    ['Cómo enfocar',`<p>1. Empieza con el objetivo de <b>menor</b> aumento. 2. Coloca la preparación en la platina. 3. Acerca la platina al objetivo con el <b>macrométrico</b>, mirando de lado. 4. Mira por el ocular y afina con el <b>micrométrico</b>. 5. Para más aumento, gira el revólver y enfoca solo con el micrométrico.</p>`],
    ['Error típico',`<div class="ex warn">Usar el macrométrico con el objetivo de 40× o de 100×</div><p>Con esos objetivos la lente está casi tocando la muestra: un giro brusco puede romper la preparación o la lente. Usa el <b>micrométrico</b>.</p>`]
  ],
  gens:[
    ()=>{const p=pick(Object.keys(PARTS));return mc(`¿Qué parte del microscopio señala la flecha?${micro(0,p)}`,cap(p),shuffle(Object.keys(PARTS).filter(x=>x!==p)).slice(0,3).map(cap),`${cap(p)}: ${PARTS[p].fn[0].toLowerCase()+PARTS[p].fn.slice(1)}`)},
    ()=>{const p=pick(Object.keys(PARTS));return mc(`¿Qué parte del microscopio es esta?<br><b>${PARTS[p].fn}</b>`,cap(p),shuffle(Object.keys(PARTS).filter(x=>x!==p)).slice(0,3).map(cap),`Es ${p==='platina'||p==='base'?'la':p==='objetivos'?'los':'el'} ${p}.`)},
    ()=>{const o=pick([5,10,15]),b=pick([4,10,40,100]);return num(`Un microscopio tiene un ocular de ${o}× y estás usando el objetivo de ${b}×. ¿Cuántos aumentos totales tiene la imagen?`,o*b,`Se multiplican: ${o} · ${b} = ${o*b} aumentos.`)},
    ()=>{const o=pick([10,15]),b=pick([4,10,40]);return num(`Ves una muestra a ${o*b} aumentos con un ocular de ${o}×. ¿De cuántos aumentos es el objetivo?`,b,`Aumentos totales = ocular · objetivo, así que objetivo = ${o*b} : ${o} = ${b}.`)},
    ()=>{const p=pick(Object.keys(PARTS));return mc(`¿${p==='platina'||p==='base'?'La':p==='objetivos'?'Los':'El'} <b>${p}</b> ${p==='objetivos'?'forman':'forma'} parte de la parte óptica o de la parte mecánica del microscopio?`,cap(PARTS[p].kind),['Óptica','Mecánica'],`${cap(p)}: parte ${PARTS[p].kind}. ${PARTS[p].fn}`)},
    ()=>mc('Al empezar a observar una preparación, ¿qué objetivo hay que usar?','El de menor aumento',['El de mayor aumento','Cualquiera','Ninguno, se mira sin objetivo'],'Se empieza por el de menor aumento: se ve más superficie y es más fácil encontrar y enfocar la muestra.')
  ]},
{ title:'Seguridad en el laboratorio', sub:'Normas y pictogramas de peligro',
  lesson:[
    ['Normas básicas',`<p>· Lleva <b>bata</b> y, si te lo indican, <b>gafas</b> y <b>guantes</b>. · Recógete el <b>pelo</b> largo. · <b>No comas ni bebas</b>. · Nunca huelas una sustancia directamente: <b>abanica</b> los vapores con la mano. · No pruebes ni toques productos. · Sigue siempre las <b>instrucciones del profesor</b>. · Al calentar un tubo, apunta la boca lejos de las personas. · Al terminar, limpia el material y <b>lávate las manos</b>.</p>`],
    ['Pictogramas de peligro',`<div class="row instrow">${Object.keys(PICTO).map(k=>`<figure class="instfig">${picto(k)}<figcaption>${PICTO[k].name}</figcaption></figure>`).join('')}</div><p>Son <b>rombos con borde rojo</b> y un dibujo negro que avisan del peligro de cada producto. Están en las etiquetas, también en productos de casa.</p>`],
    ['Si hay un accidente',`<p>Avisa <b>enseguida</b> al profesor. Si un producto te salpica en los ojos o la piel, lávate con <b>abundante agua</b>. No recojas vidrio roto con las manos.</p>`],
    ['Error típico',`<div class="ex warn">Acercar la nariz para oler un producto</div><p>Algunos vapores son tóxicos o irritantes. Para oler, se <b>abanica</b> el aire hacia la nariz con la mano, desde lejos.</p>`]
  ],
  gens:[
    ()=>{const k=pick(Object.keys(PICTO));return mc(`¿Qué significa este pictograma?${picto(k)}`,PICTO[k].name,shuffle(Object.keys(PICTO).filter(x=>x!==k)).slice(0,3).map(x=>PICTO[x].name),`${PICTO[k].name}: ${PICTO[k].fn}. Por ejemplo, ${PICTO[k].ex}.`)},
    ()=>{const k=pick(Object.keys(PICTO));return mc(`¿Qué pictograma lleva un producto que <b>${PICTO[k].fn}</b>?`,PICTO[k].name,shuffle(Object.keys(PICTO).filter(x=>x!==k)).slice(0,3).map(x=>PICTO[x].name),`${PICTO[k].name}, como ${PICTO[k].ex}.`)},
    ()=>{const ok=pick(['Llevar el pelo largo recogido','Abanicar los vapores con la mano para olerlos','Lavarse las manos al terminar','Avisar al profesor si se rompe algo','Apuntar la boca del tubo lejos de los compañeros al calentarlo']);
      return mc('¿Cuál de estas acciones es <b>correcta</b> en el laboratorio?',ok,shuffle(['Comer un bocadillo mientras trabajas','Oler un producto acercando la nariz','Probar una sustancia para saber qué es','Recoger con la mano un vidrio roto','Mezclar productos para ver qué pasa']).slice(0,3),`${ok}: es una norma de seguridad.`)},
    ()=>{const bad=pick(['Beber agua de un vaso de precipitados','Tocar un tubo recién calentado con la mano','Trabajar con el pelo largo suelto','Tirar los restos de productos por el fregadero sin preguntar']);
      return mc('¿Qué está <b>mal</b> hecho?',bad,shuffle(['Llevar bata','Seguir las instrucciones del profesor','Lavarse las manos al terminar','Usar pinzas para sujetar un tubo caliente']).slice(0,3),`${bad} es peligroso. Las demás son normas correctas.`)},
    ()=>mc('Te salpica un producto en los ojos. ¿Qué haces?','Lavarlos con abundante agua y avisar al profesor',['Frotarlos con fuerza','Esperar a ver si se pasa','Echar otro producto para neutralizarlo'],'Hay que lavar con abundante agua enseguida y avisar al profesor.')
  ]}
];

/* ---------- relatos de pizarra: las prácticas de Nora ---------- */
const row=(...xs)=>`<div class="row instrow">${xs.join('')}</div>`;
const kid=(name,d=0)=>sk(80,130,person(40,30,d,name),'inst');
const bottle=(label,d=0)=>sk(120,140,stroke('M40 30L40 128L90 128L90 30L76 30L76 14L54 14L54 30Z',d,{t:1})+box(46,60,38,40,d+1,{t:.4})+tx(65,86,label,d+1.4,{s:11}),'inst');
// Una persona junto a su material, en un solo dibujo para que quepa en el recuadro.
const bench=(name,ks,d0=0)=>sk(80+ks.length*105,150,person(40,44,d0,name)+ks.map((k,i)=>`<g transform="translate(${70+i*105},5)">${DRAW[k](d0+.8+i*.8)}</g>`).join(''));
const gap=(d,c='blue')=>sk(60,140,arrow(6,70,54,70,d,c),'mark');
// Lo que se ve por el ocular: células de cebolla como ladrillos dentro del círculo de luz.
const view=(d,blur)=>sk(130,130,circ(65,65,55,d,{t:.5})+[0,1,2,3].map(r=>[0,1,2].map(c=>box(23+c*24+(r%2)*12,33+r*16,24,16,d+.6+r*.25+c*.08,{t:.2,c:blur?'blue':''})).join('')).join(''),'inst');
const LAB_ANIMS=[
[ // Material de vidrio: la primera práctica de Nora
  {say:'Hoy es la primera práctica de laboratorio de Nora. Sobre la mesa hay muchos recipientes de vidrio, porque el vidrio es transparente, aguanta el calor y casi no reacciona con nada.',
   show:bench('Nora',['vaso','erlen','tubo'])+line(at(3.4,'transparente · resiste el calor · no reacciona'))},
  {say:'La profesora le pide preparar agua con sal. Nora la calienta en un vaso de precipitados. Para agitarla sin que salpique, usa el matraz Erlenmeyer, de cuello estrecho.',
   show:labeled(['vaso','erlen'],0,1.6)+line(at(3.4,'mezclar y calentar · el cuello estrecho evita salpicar'))},
  {say:'¿Cómo se llama este material?',ask:LAB_LEVELS[0].gens[0]},
  {say:'Ahora necesita exactamente veinticinco mililitros. Nora coge el vaso, pero su compañero Leo la avisa: sus marcas son solo aproximadas. Para medir bien, la probeta.',
   show:row(pic('vaso',0),gap(1),pic('probeta',1.4))+line(`${at(2.6,'vaso: ≈ aproximado','bad')} &nbsp; ${at(3.4,'probeta: ✓ precisa','good')}`)},
  {say:'Para tomar solo dos mililitros con mucha precisión usa la pipeta. Y para pasar la mezcla a una botella de boca estrecha, el embudo.',
   show:labeled(['pipeta','embudo'],0,1.6)},
  {say:'Elige tú el material adecuado.',ask:LAB_LEVELS[0].gens[3]},
  {say:'Al final, la profesora guarda bacterias en una placa de Petri y deja unas gotas de agua salada en un vidrio de reloj: al evaporarse, saldrán cristales de sal.',
   show:labeled(['petri','reloj'],0,1.6)+line(at(3.4,'cultivar microorganismos · evaporar'))},
  {say:'En la vida real: en casa, Nora ve que la jarra medidora de la cocina funciona como un vaso de precipitados, y que su padre usa un embudo para pasar aceite a una botella.',
   show:real('la cocina',row(pic('jarra',0),pic('embudo',1.6))+line(at(3.2,'jarra medidora ≈ vaso de precipitados')))},
  {say:'¿Para qué sirve este material?',ask:LAB_LEVELS[0].gens[2]}
],
[ // Otros instrumentos: Nora calienta y mide
  {say:'En la segunda práctica, Nora tiene que calentar un poco de agua en un tubo de ensayo. Enciende el mechero Bunsen, que calienta con una llama.',
   show:bench('Nora',['tubo','mechero'])},
  {say:'Va a coger el tubo con la mano, pero la profesora la para: el vidrio caliente parece frío y quema. Se sujeta con pinzas de madera, con la boca hacia otro lado.',
   show:line(at(0,'✗ con la mano','bad'))+labeled(['pinzas'],.8)+line(at(2.6,'✓ pinzas de madera, la boca lejos de las personas','good'))},
  {say:'¿Qué instrumento sirve para esto?',ask:LAB_LEVELS[1].gens[1]},
  {say:'Cuando el agua ya está caliente, apaga el mechero y deja el tubo en la gradilla. Después tritura unos granos de sal gorda en el mortero.',
   show:labeled(['gradilla','mortero'],0,1.8)},
  {say:'Ahora toca medir. La balanza mide la masa, en gramos. El termómetro mide la temperatura del agua, en grados Celsius.',
   show:labeled(['balanza','termometro'],0,1.6)+line(`${at(3.4,'masa → g')} &nbsp; ${at(4,'temperatura → °C')}`)},
  {say:'¿Qué magnitud mide?',ask:LAB_LEVELS[1].gens[2]},
  {say:'Al terminar, limpia los tubos con el escobillón y los aclara con el frasco lavador, que echa agua destilada. El soporte y la rejilla vuelven a su sitio.',
   show:line(seq(['<span class="chip">escobillón</span>','<span class="chip">frasco lavador</span>','<span class="chip">soporte</span>','<span class="chip">rejilla</span>'],0,.8))+line(at(3.4,'material limpio y ordenado','good'))},
  {say:'En la vida real: Nora ayuda a hacer un bizcocho. Pesa el bol vacío y luego con harina en la báscula de la cocina: la resta es la harina que ha echado.',
   show:real('la báscula de la cocina',pic('balanza',0))+line(at(1.8,'310 g − 125 g = <b>185 g</b> de harina'))},
  {say:'Haz tú la resta.',ask:LAB_LEVELS[1].gens[3]}
],
[ // El microscopio: Nora ve células de cebolla
  {say:'Hoy Nora va a ver algo que no se ve a simple vista: las células de una cebolla. Para eso necesita el microscopio óptico.',
   show:microScene(person(50,70,0,'Nora'),.8)},
  {say:'Primero prepara la muestra: una capa finísima de cebolla en el portaobjetos, tapada con el cubreobjetos. La coloca en la platina.',
   show:microScene(box(4,70,110,30,0,{t:.6})+box(34,74,50,22,.8,{t:.3})+tx(59,118,'portaobjetos',1.2,{s:11})+tx(59,132,'y cubreobjetos',1.3,{s:11})+arrow(116,86,148,118,1.6,'blue'),2,null,[['platina']])},
  {say:'Empieza con el objetivo de menor aumento. Mirando de lado, acerca la muestra con el tornillo macrométrico, y después mira por el ocular.',
   show:micro(0,null,[['objetivos'],['tornillo macrométrico'],['ocular']])},
  {say:'¿Con qué objetivo hay que empezar?',ask:LAB_LEVELS[2].gens[5]},
  {say:'Al principio todo se ve borroso. Nora gira el tornillo micrométrico, el enfoque fino, y de pronto aparecen las células, como pequeños ladrillos.',
   show:row(view(0,true),gap(1.4),view(2))+line(at(3.6,'enfoque fino → <b>micrométrico</b>'))},
  {say:'Quiere verlas más grandes y gira el revólver hasta el objetivo de cuarenta. Va a usar el macrométrico, pero Leo la avisa: podría romper la preparación.',
   show:micro(0,'revólver')+line(`${at(3,'✗ macrométrico','bad')} &nbsp; ${at(3.8,'✓ solo micrométrico','good')}`)},
  {say:'El ocular aumenta diez veces y el objetivo, cuarenta. Los aumentos totales se multiplican: diez por cuarenta, cuatrocientos aumentos.',
   show:line(`${at(0,'ocular 10×')} ${at(.8,'·')} ${at(1.2,'objetivo 40×')}`,'big')+line(at(2.6,'= <b>400 aumentos</b>'),'big')},
  {say:'Calcula tú los aumentos.',ask:LAB_LEVELS[2].gens[2]},
  {say:'En la vida real: en los hospitales se miran muestras de sangre al microscopio para contar las células y descubrir, por ejemplo, si una persona tiene una infección.',
   show:real('el hospital',sk(260,120,circ(70,60,52,0,{t:.5})+[[50,40],[82,36],[64,66],[94,72],[42,80]].map(([x,y],k)=>ell(x,y,11,8,.6+k*.2,{c:'red',t:.2})).join('')+ln(122,60,170,60,1.8,{c:'blue'})+tx(215,66,'¿infección?',2.2,{s:14})))},
  {say:'¿Qué parte señala la flecha?',ask:LAB_LEVELS[2].gens[0]}
],
[ // Seguridad: el susto de Nora
  {say:'Antes de empezar, Nora se pone la bata y las gafas, y se recoge el pelo. En el laboratorio, además, no se come ni se bebe.',
   show:row(kid('Nora'))+line(seq(['<span class="chip">bata</span>','<span class="chip">gafas</span>','<span class="chip">pelo recogido</span>'],.8,.8))+line(at(3.4,'✗ comer o beber','bad'))},
  {say:'En la estantería hay frascos con etiquetas. Los rombos de borde rojo son pictogramas de peligro: inflamable, tóxico, corrosivo.',
   show:row(picto('inflamable',0),picto('tóxico',1.6),picto('corrosivo',3.2))},
  {say:'¿Qué significa este pictograma?',ask:LAB_LEVELS[3].gens[0]},
  {say:'Leo quiere saber a qué huele un líquido y acerca la nariz. ¡Error! Algunos vapores son tóxicos. Para oler se abanica el aire con la mano, desde lejos.',
   show:row(kid('Leo'),bottle('???',.8))+line(`${at(2.4,'✗ acercar la nariz','bad')} &nbsp; ${at(3.2,'✓ abanicar con la mano','good')}`)},
  {say:'De pronto, a Nora le salpica una gota en la mano. No se asusta: la lava con abundante agua del grifo y avisa enseguida a la profesora.',
   show:sk(260,120,tx(55,14,'grifo',.3,{s:12})+stroke('M20 20L90 20L90 44',0,{t:.5})+[0,1,2,3].map(k=>dot(90,56+k*12,3.5,.6+k*.2,'blue')).join('')+stroke('M60 108Q90 92 120 108',1.4,{t:.3})+tx(190,50,'agua',1.8,{s:16,c:'green'})+tx(190,80,'+ avisar',2.4,{s:16,c:'green'}))},
  {say:'¿Qué harías tú?',ask:LAB_LEVELS[3].gens[4]},
  {say:'Al terminar, limpian el material, tiran los restos donde indica la profesora y se lavan las manos. La práctica ha salido bien gracias a las normas.',
   show:line(seq(['<span class="chip">limpiar</span>','<span class="chip">restos donde se indica</span>','<span class="chip">lavarse las manos</span>'],0,.9))+line(at(3.2,'✓ práctica segura','good'))},
  {say:'En la vida real: la lejía de casa lleva el pictograma de corrosivo. Por eso no se mezcla con otros productos y se guarda lejos del alcance de los niños.',
   show:real('la lejía de casa',row(bottle('LEJÍA',0),picto('corrosivo',1.8)))},
  {say:'¿Cuál de estas acciones es correcta?',ask:LAB_LEVELS[3].gens[2]}
]];

export { LAB_LEVELS, LAB_ANIMS };
