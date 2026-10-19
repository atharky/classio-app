import { pick, shuffle, mc } from './data.js';
import { at, seq, line, real, strike, sk, stroke, ln, box, circ, fill, dot, tx, arrow, person, ell, bubble } from './sketch.js';

/* ---------- contenido: Biología · La ciencia y el método científico ---------- */
const tf=(t,ok,why='')=>mc(`¿Verdadero o falso?<br>«${t}»`,ok?'Verdadero':'Falso',['Verdadero','Falso'],ok?`Es verdadero.${why?' '+why:''}`:`Es falso: ${why}`);

/* ---------- dibujos ---------- */
const phone=(x,y,d,h=104,w=64)=>box(x,y,w,h,d,{t:.6})+ln(x+w/2-8,y+h-9,x+w/2+8,y+h-9,d+.6,{t:.15});
const plant=(x,y,h,d)=>stroke(`M${x-16} ${y}L${x+16} ${y}L${x+11} ${y+22}L${x-11} ${y+22}Z`,d,{t:.4})+ln(x,y,x,y-h,d+.4,{c:'green',t:.4})
  +Array.from({length:Math.max(1,Math.round(h/22))},(_,i)=>{const yy=y-14-i*20,s=i%2?1:-1;return stroke(`M${x} ${yy}Q${x+s*16} ${yy-12} ${x+s*22} ${yy-2}Q${x+s*12} ${yy+4} ${x} ${yy}`,d+.7+i*.25,{c:'green',t:.3})}).join('');
const sun=(x,y,d)=>circ(x,y,12,d,{c:'red'})+[0,1,2,3,4,5,6,7].map(k=>{const a=k*Math.PI/4,c=Math.cos(a),s=Math.sin(a);return ln(+(x+17*c).toFixed(1),+(y+17*s).toFixed(1),+(x+25*c).toFixed(1),+(y+25*s).toFixed(1),d+.3+k*.05,{c:'red',t:.1})}).join('');
const jar=(x,y,d,cloth)=>stroke(`M${x} ${y}L${x} ${y+76}Q${x} ${y+84} ${x+8} ${y+84}L${x+52} ${y+84}Q${x+60} ${y+84} ${x+60} ${y+76}L${x+60} ${y}`,d,{t:.6})
  +fill(x+10,y+64,40,16,d+.6,'red')+(cloth?stroke(`M${x-4} ${y}Q${x+30} ${y-6} ${x+64} ${y}`,d+.9,{c:'blue',t:.4})+[0,1,2,3,4].map(k=>ln(x+4+k*12,y-3,x+10+k*12,y+3,d+1.1+k*.06,{c:'blue',t:.08})).join(''):'');
const fly=(x,y,d)=>ell(x,y,5,3,d,{t:.15})+ell(x-3,y-5,4,3,d+.15,{t:.12})+ell(x+3,y-5,4,3,d+.2,{t:.12});
const worm=(x,y,d)=>stroke(`M${x} ${y}q4 -5 8 0t8 0t8 0`,d,{c:'green',t:.3});
const magnifier=(x,y,d)=>circ(x,y,20,d,{t:.4})+ln(x+14,y+14,x+32,y+32,d+.4,{t:.2});
const stamp=(x,y,text,d)=>box(x,y,90,34,d,{c:'red',t:.4})+tx(x+45,y+24,text,d+.4,{s:20,c:'red'});
const face=(x,y,d,hair='M-14 -4Q-14 -20 0 -20Q14 -20 14 -4')=>circ(x,y,14,d,{t:.3})+dot(x-5,y-2,1.8,d+.3)+dot(x+5,y-2,1.8,d+.3)+stroke(`M${x-5} ${y+5}Q${x} ${y+9} ${x+5} ${y+5}`,d+.4,{t:.15})
  +stroke(hair.replace(/(-?\d+) (-?\d+)/g,(_,a,b)=>`${x+ +a} ${y+ +b}`),d+.5,{t:.3});
const dna=(x,y,d)=>stroke(`M${x} ${y}C${x+20} ${y+20} ${x+20} ${y+40} ${x} ${y+60}C${x-20} ${y+80} ${x-20} ${y+100} ${x} ${y+120}`,d,{c:'blue',t:.6})
  +stroke(`M${x} ${y}C${x-20} ${y+20} ${x-20} ${y+40} ${x} ${y+60}C${x+20} ${y+80} ${x+20} ${y+100} ${x} ${y+120}`,d+.3,{c:'red',t:.6})+[18,42,78,102].map((yy,k)=>ln(x-12,y+yy,x+12,y+yy,d+.9+k*.08,{t:.1})).join('');
const atom=(x,y,d)=>[0,60,120].map((a,k)=>`<ellipse class="dr" pathLength="1" cx="${x}" cy="${y}" rx="30" ry="11" transform="rotate(${a} ${x} ${y})" style="--d:${d+k*.3};--t:.4s"/>`).join('')+dot(x,y,5,d+1,'red');
const chart=(x,y,d,bars)=>ln(x,y,x,y+80,d,{t:.2})+ln(x,y+80,x+bars.length*30+10,y+80,d+.2,{t:.2})+bars.map((h,k)=>fill(x+10+k*30,y+80-h,20,h,d+.5+k*.3,k%2?'soft':'blue')).join('');

/* ---------- nivel 1 · fake news ---------- */
const CLUES=[
  ['¿Tiene una fuente fiable?','Si no dice de dónde sale, desconfía.'],
  ['¿Tiene errores ortográficos o exageraciones?','Suele ser señal de poco rigor.'],
  ['¿Es muy llamativa o increíble?','Las fake news intentan llamar la atención.'],
  ['¿Está en medios serios o solo en redes?','Si solo está en una cuenta de TikTok o un blog desconocido, ojo.'],
  ['¿Puedes comprobarla en otras webs?','Contrastar es clave.'],
  ['¿Quién gana si te la crees?','Pensar a quién beneficia ayuda a detectar la intención.']];
const CLUE_CASES=[
  ['La noticia no dice quién la ha escrito ni de dónde sale.',0],['El titular dice «¡¡INCREÍBLE!! Los cientificos lo confirman» con varias faltas de ortografía.',1],
  ['Asegura que un mineral se convierte en diamante al tocar el agua del mar.',2],['Solo aparece en una cuenta de TikTok con pocos seguidores.',3],
  ['La buscas en Google y no aparece en ningún periódico.',4],['La publica una marca que vende justo el producto del que habla la noticia.',5],
  ['Promete que un zumo cura todas las enfermedades «en tres días».',2],['Te llega por WhatsApp como «reenviado muchas veces», sin enlace a ningún medio.',0]];
const NEWS=[
  ['«España suma más de 4.500 kilómetros de cuevas y cada año se descubren 50 más.» (El País)',true,'la publica un periódico conocido, no exagera y no tiene faltas.'],
  ['«La Agencia Estatal de Meteorología avisa de lluvias fuertes en Galicia este fin de semana.»',true,'viene de un organismo oficial y se puede comprobar en su web.'],
  ['«Un estudio revisado por otros investigadores y publicado en una revista científica describe una nueva especie de rana.»',true,'indica la fuente y que otros expertos lo han revisado.'],
  ['«Científicos descubren el “maridiamante”, un mineral que se convierte en diamante con agua de mar.»',false,'es increíble, no dice la fuente y la palabra no existe.'],
  ['«Los arboles de Canarias detectan los incendios días antes de que ocurran.»',false,'es muy llamativa, no dice de qué medio viene y tiene faltas («arboles» lleva tilde).'],
  ['«¡¡COMPÁRTELO ANTES DE QUE LO BORREN!! Beber agua con limón cura todas las enfermedades.»',false,'exagera, promete curarlo todo y te pide que lo compartas sin comprobarlo.'],
  ['«Mensaje sin firma: mañana cierran todos los institutos del país.»',false,'no tiene fuente y no aparece en ningún medio serio.']];

/* ---------- nivel 2 · método científico ---------- */
const STEPS=['Observación','Hipótesis','Experimentación','Análisis de datos','Conclusiones','Comunicación de resultados'];
const STEP_DEF={'Observación':'Fijarse en un hecho y hacerse una pregunta sobre él','Hipótesis':'Proponer una posible respuesta que se pueda comprobar',
  'Experimentación':'Comprobar la hipótesis con un experimento, cambiando una sola cosa','Análisis de datos':'Ordenar los datos en tablas y gráficas para estudiarlos',
  'Conclusiones':'Decidir si la hipótesis se confirma o se rechaza','Comunicación de resultados':'Dar a conocer lo descubierto a otras personas'};
const CASES=[
  {t:'las plantas',obs:'Las plantas de la ventana crecen más que las del pasillo.',hip:'Quizá las plantas crecen más cuando reciben más luz.',exp:'Pongo dos plantas iguales, con la misma agua: una al sol y otra a oscuras.',dat:'Tras dos semanas, la planta al sol mide 12 cm y la otra, 4 cm.',con:'La luz ayuda a que las plantas crezcan.'},
  {t:'el moho del pan',obs:'El pan que guardo en una bolsa cerrada se llena de moho antes.',hip:'Quizá el moho crece más rápido con humedad.',exp:'Pongo una rebanada mojada y otra seca en dos bolsas iguales.',dat:'A los cinco días, la rebanada mojada tiene mucho moho y la seca, casi nada.',con:'La humedad favorece que crezca el moho.'},
  {t:'el hielo',obs:'En invierno echan sal en las carreteras heladas.',hip:'Quizá la sal hace que el hielo se derrita antes.',exp:'Pongo dos cubitos iguales: uno con sal y otro sin sal.',dat:'El cubito con sal se derrite en 10 minutos y el otro, en 25.',con:'La sal acelera que el hielo se derrita.'}];
const PART={obs:'Observación',hip:'Hipótesis',exp:'Experimentación',dat:'Datos (resultados)',con:'Conclusión'};
const METHOD_QA=[
  ['¿Qué queremos comprobar cuando experimentamos?','Si la hipótesis es correcta',['Si la observación es bonita','Cuántos datos caben en una tabla','Qué opina la gente']],
  ['Tras experimentar obtengo una serie de datos. ¿Con qué herramientas los analizo?','Con tablas y gráficas',['Con un horóscopo','Con mi opinión personal','Con una encuesta en redes sociales']],
  ['¿Qué obtengo una vez analizados los datos?','Las conclusiones',['Una nueva observación sin más','Una pseudociencia','La hipótesis del principio']],
  ['¿Qué debo hacer si la hipótesis es rechazada?','Formular una nueva hipótesis y volver a experimentar',['Cambiar los datos para que salga bien','Abandonar la investigación para siempre','Darla por buena de todos modos']],
  ['¿Qué pasa si la hipótesis se confirma repetidas veces?','Puede convertirse en una ley o teoría científica',['Se convierte en una pseudociencia','Ya no se puede volver a comprobar','Se convierte en una opinión']]];

/* ---------- nivel 3 · Redi ---------- */
const REDI={hip:'Los gusanos no nacen solos de la carne: salen de los huevos que ponen las moscas.',
  exp:'Puso carne en dos botes de vidrio: uno abierto y otro cubierto con una tela fina que deja pasar el aire, pero no las moscas.',
  res:'En el bote abierto aparecieron gusanos; en el bote cubierto con tela, no.',con:'Los gusanos proceden de los huevos de las moscas: la generación espontánea es falsa.'};

/* ---------- nivel 4 · ciencia y pseudociencia ---------- */
// Las 11 disciplinas de la ficha de clase: [nombre, ¿es ciencia?, por qué].
const DISC=[
  ['Astronomía',true,'estudia los astros con observaciones y medidas, y sus predicciones se cumplen'],
  ['Matemáticas',true,'razona con rigor y demuestra sus resultados'],
  ['Medicina',true,'sus tratamientos se prueban con estudios y ensayos'],
  ['Arqueología',true,'estudia el pasado con restos materiales y métodos de datación'],
  ['Psicología',true,'estudia la conducta y la mente con métodos científicos'],
  ['Ufología',false,'no tiene pruebas que se puedan comprobar'],
  ['Grafología',false,'pretende deducir la personalidad por la letra, sin pruebas'],
  ['Homeopatía',false,'sus remedios no han demostrado más efecto que el placebo'],
  ['Cienciología',false,'su nombre engaña: es un movimiento religioso sin base científica'],
  ['Numerología',false,'atribuye significados a los números sin pruebas'],
  ['Reflexología',false,'pretende tratar enfermedades presionando puntos de los pies, sin pruebas']];
const SCI=DISC.filter(d=>d[1]),PSE=DISC.filter(d=>!d[1]);
// Las que más se confunden: parecen lo contrario de lo que son.
const TRICKY_SCI=['Arqueología','Psicología'],TRICKY_PSE=['Homeopatía','Numerología','Cienciología'];
const TRAITS=[['Usa un vocabulario preciso.','Ciencia'],['Presenta referencias: dice de dónde saca la información.','Ciencia'],['Avanza, incorpora ideas nuevas y descarta las que se quedan obsoletas.','Ciencia'],['Sus resultados se pueden repetir y comprobar.','Ciencia'],['Otros expertos revisan los estudios antes de publicarlos.','Ciencia'],['Se basa en experimentos y datos.','Ciencia'],
  ['Solo tiene en cuenta los resultados favorables.','Pseudociencia'],['No realiza una fase de experimentación.','Pseudociencia'],['Se basa en testimonios: “a mi primo le funcionó”.','Pseudociencia'],['No acepta las pruebas que la contradicen.','Pseudociencia'],['Promete resultados milagrosos sin presentar pruebas.','Pseudociencia'],['Usa palabras científicas para parecer ciencia, pero no hace experimentos.','Pseudociencia']];
// Los dos mensajes de la ficha: previsión de una agencia oficial frente a un horóscopo.
const MSG_AGENCIA='«La previsión de lluvia para el día 17 es del 40 % por la mañana, con tendencia a subir al 80 % al final de la tarde. Las temperaturas bajarán entre 2 y 3 grados. Previsión basada en el modelo numérico europeo ECMWF.» (cuenta verificada de la agencia de meteorología)';
const MSG_HOROSCOPO='«Mercurio retrógrado augura inestabilidad. Se presentarán oportunidades inesperadas.» (cuenta «El Horóscopo»)';

/* ---------- nivel 5 · mujeres científicas ---------- */
const WOMEN=[
  {n:'Marie Curie',k:'Estudió la radiactividad y descubrió el polonio y el radio. Fue la primera mujer en ganar un Nobel y la única persona premiada en dos ciencias distintas (Física y Química).',a:'la radiactividad'},
  {n:'Rosalind Franklin',k:'Con rayos X obtuvo la «Fotografía 51», clave para descubrir que el ADN tiene forma de doble hélice.',a:'la forma de doble hélice del ADN'},
  {n:'Margarita Salas',k:'Bioquímica española que descubrió una proteína (la ADN polimerasa del virus phi29) que permite copiar el ADN; se usa en investigación y diagnóstico.',a:'una proteína que permite copiar el ADN'},
  {n:'Ada Lovelace',k:'Matemática que escribió el primer algoritmo pensado para una máquina: se la considera la primera programadora.',a:'el primer programa informático'},
  {n:'Jane Goodall',k:'Primatóloga que estudió durante décadas a los chimpancés en Tanzania y descubrió que fabrican y usan herramientas.',a:'el comportamiento de los chimpancés'},
  {n:'Hipatia de Alejandría',k:'Matemática, astrónoma y filósofa de la Antigüedad, en Alejandría (Egipto).',a:'las matemáticas y la astronomía en la Antigüedad'},
  {n:'Katherine Johnson',k:'Matemática de la NASA que calculó las trayectorias de los vuelos espaciales, incluido el viaje a la Luna del Apolo 11.',a:'los cálculos de los viajes espaciales de la NASA'},
  {n:'Rachel Carson',k:'Bióloga que en su libro «Primavera silenciosa» alertó del daño que los pesticidas causaban a la naturaleza.',a:'el peligro de los pesticidas para la naturaleza'}];

const CIE_LEVELS=[
{ title:'Fake news o bulos', sub:'Cómo detectar una noticia falsa',
  lesson:[
    ['¿Qué son?',`<p>Las <b>fake news</b> son <span class="hl">noticias falsas</span> que se difunden como si fueran verdaderas, sobre todo por internet y redes sociales. En español tienen un nombre: <b>bulos</b>.</p>`],
    ['¿Por qué se difunden?',`<p>Hay personas interesadas en difundirlas para <b>ganar dinero</b> (con visitas y publicidad), para <b>influir</b> en lo que piensa la gente, para <b>llamar la atención</b> o para hacer daño a alguien. Otras veces se comparten por error, sin comprobarlas.</p>`],
    ['Seis claves para detectarlas',`<div class="tbl"><table><tr><th>Pista</th><th>¿Por qué es útil?</th></tr>${CLUES.map(([a,b],i)=>`<tr><td style="text-align:left"><b>${i+1}.</b> ${a}</td><td style="text-align:left">${b}</td></tr>`).join('')}</table></div>`],
    ['Error típico',`<div class="ex warn">«Si lo ha compartido mucha gente, será verdad»</div><p>Un bulo puede tener miles de «me gusta». Lo que cuenta es la <b>fuente</b> y si se puede <b>contrastar</b> en medios serios. Las fotos también pueden estar retocadas o sacadas de contexto.</p>`]
  ],
  gens:[
    ()=>{const [c,i]=pick(CLUE_CASES);return mc(`${c}<br>¿Qué pista te hace sospechar?`,CLUES[i][0],shuffle(CLUES.filter((_,j)=>j!==i)).slice(0,3).map(x=>x[0]),`${CLUES[i][0]} ${CLUES[i][1]}`)},
    ()=>{const [t,ok,why]=pick(NEWS);return mc(`${t}<br>¿Qué te parece esta noticia?`,ok?'Parece fiable':'Probablemente es un bulo',['Parece fiable','Probablemente es un bulo'],`${ok?'Parece fiable':'Probablemente es un bulo'}: ${why}`)},
    ()=>mc('¿Por qué hay personas interesadas en difundir noticias falsas?','Para ganar dinero con las visitas o influir en lo que piensa la gente',['Porque así las noticias son más verdaderas','Porque la ley les obliga','Para que la gente aprenda a contrastar'],'Los bulos dan visitas (y dinero) o sirven para influir en las opiniones.'),
    ()=>mc('¿Qué palabra en español significa lo mismo que <i>fake news</i>?','Bulo',['Titular','Reportaje','Editorial'],'En español, una noticia falsa es un bulo.'),
    ()=>mc('Te llega por WhatsApp una noticia sorprendente. ¿Qué haces?',pick(['Busco si la publican medios serios antes de compartirla','Compruebo de dónde sale antes de reenviarla']),['La reenvío enseguida a todos mis contactos','Me la creo porque tiene una foto','La comparto si tiene muchos «me gusta»'],'Antes de compartir, hay que comprobar la fuente y contrastarla.'),
    ()=>{const [t,ok,why]=pick([['Si una noticia la comparte mucha gente, es verdadera.',false,'un bulo puede hacerse viral.'],['Antes de compartir una noticia conviene contrastarla en otras webs.',true],['Las faltas de ortografía suelen ser señal de poco rigor.',true],['Si sale en un vídeo de TikTok, seguro que es verdad.',false,'cualquiera puede publicar en redes; hay que buscar la fuente.'],['Pensar a quién beneficia una noticia ayuda a detectar su intención.',true]]);return tf(t,ok,why)}
  ]},
{ title:'El método científico', sub:'Comprobar las ideas con pruebas',
  lesson:[
    ['¿Qué es?',`<p>Es la forma de trabajar de los científicos y científicas. Nos ayuda a <b>comprobar si una información es verdadera o falsa</b>: no creer todo lo que vemos o escuchamos, sino <span class="hl">buscar pruebas, hacer preguntas y comprobar con hechos</span>.</p>`],
    ['Los pasos',`<div class="ex">1. <b>Observación</b> y pregunta → 2. <b>Hipótesis</b> → 3. <b>Experimentación</b> → 4. <b>Análisis de datos</b> y <b>conclusiones</b> → comunicación de resultados</div>
     <p>La <b>hipótesis</b> es una posible respuesta a la pregunta que se puede comprobar. Al <b>experimentar</b> se cambia <b>una sola cosa</b> cada vez. Los datos se analizan con <b>tablas y gráficas</b>, y de ellos se sacan las <b>conclusiones</b>.</p>`],
    ['¿Y después?',`<p>Si la hipótesis se <b>rechaza</b>, se plantea una <span class="hl">nueva hipótesis</span> y se vuelve a experimentar. Si se <b>confirma</b> muchas veces, puede convertirse en una <span class="hl">ley o teoría científica</span>.</p>`],
    ['Error típico',`<div class="ex warn">Confundir la hipótesis con la conclusión</div><p>La hipótesis se plantea <b>antes</b> del experimento (es una idea por comprobar). La conclusión llega <b>después</b>, al analizar los datos.</p>`]
  ],
  gens:[
    ()=>{const [q,a,ws]=pick(METHOD_QA);return mc(q,a,ws,`${a}.`)},
    ()=>{const s=pick(STEPS);return mc(`¿Qué paso del método científico consiste en <b>${STEP_DEF[s].toLowerCase()}</b>?`,s,shuffle(STEPS.filter(x=>x!==s)).slice(0,3),`Es la ${s.toLowerCase()}.`)},
    ()=>{const c=pick(CASES),k=pick(Object.keys(PART));return mc(`Investigación sobre ${c.t}:<br>«${c[k]}»<br>¿A qué parte del método científico corresponde?`,PART[k],Object.values(PART).filter(x=>x!==PART[k]),`Es ${PART[k]==='Datos (resultados)'?'un dato (resultado del experimento)':'la '+PART[k].toLowerCase()}.`)},
    ()=>{const i=Math.floor(Math.random()*4);return mc(`¿Qué paso va justo después de la <b>${STEPS[i].toLowerCase()}</b>?`,STEPS[i+1],shuffle(STEPS.filter((_,j)=>j!==i+1&&j!==i)).slice(0,3),`El orden es: ${STEPS.join(' → ')}.`)},
    ()=>{const [t,ok,why]=pick([['Una hipótesis es una posible respuesta que se puede comprobar.',true],['En un experimento conviene cambiar muchas cosas a la vez.',false,'se cambia una sola cosa para saber qué causa el resultado.'],['Si la hipótesis se rechaza, se plantea otra nueva.',true],['Las conclusiones se escriben antes de experimentar.',false,'se sacan después de analizar los datos.'],['El método científico enseña a no creer todo lo que vemos o escuchamos.',true]]);return tf(t,ok,why)}
  ]},
{ title:'El experimento de Redi', sub:'Hipótesis, experimento, resultados y conclusión',
  lesson:[
    ['La pregunta',`<p>Hace siglos, mucha gente creía en la <b>generación espontánea</b>: que algunos seres vivos, como los gusanos, nacían solos de la carne podrida. En <b>1668</b>, el italiano <b>Francesco Redi</b> quiso comprobarlo.</p>`],
    ['Hipótesis y experimento',`<p><b>Hipótesis:</b> ${REDI.hip}</p><p><b>Experimento:</b> ${REDI.exp} Así, lo único que cambiaba entre los botes era si las moscas podían llegar a la carne.</p>`],
    ['Resultados y conclusión',`<p><b>Resultados:</b> ${REDI.res}</p><p><b>Conclusión:</b> ${REDI.con}</p>`],
    ['Error típico',`<div class="ex warn">«La tela impide que entre el aire»</div><p>No: la tela es fina y deja pasar el aire. Por eso el experimento es justo: la <b>única diferencia</b> entre los dos botes es que las moscas no pueden posarse en la carne del bote cubierto.</p>`]
  ],
  gens:[
    ()=>mc('¿Cuál fue la <b>hipótesis</b> de Francesco Redi?',REDI.hip,['Los gusanos nacen solos de la carne podrida.','La carne se convierte en moscas.','La tela fabrica gusanos.'],`Redi pensaba que ${REDI.hip[0].toLowerCase()+REDI.hip.slice(1)}`),
    ()=>mc('En el experimento de Redi, ¿en qué bote aparecieron gusanos?','En el bote abierto',['En el bote cubierto con tela','En los dos botes','En ninguno'],'En el bote abierto, porque las moscas pudieron poner huevos en la carne.'),
    ()=>mc('¿Por qué Redi cubrió un bote con una tela fina y no con una tapa?','Para que entrara el aire pero no las moscas, y así solo cambiara una cosa',['Para que la carne se viera mejor','Para que entraran más moscas','Porque no tenía tapas'],'Con tela entra el aire: la única diferencia entre los botes son las moscas.'),
    ()=>{const k=pick(['hip','exp','res','con']),n={hip:'Hipótesis',exp:'Experimento',res:'Resultados',con:'Conclusión'};return mc(`«${REDI[k]}»<br>¿Qué parte del trabajo de Redi es?`,n[k],Object.values(n).filter(x=>x!==n[k]),`Es ${k==='res'?'el resultado':k==='exp'?'el experimento':'la '+n[k].toLowerCase()}.`)},
    ()=>mc('¿Qué idea demostró Redi que era falsa?','La generación espontánea de los gusanos',['Que las moscas ponen huevos','Que la carne se pudre','Que el vidrio es transparente'],'Demostró que los gusanos no nacen solos: vienen de huevos de mosca.'),
    ()=>mc('¿Qué es lo único que cambia entre los dos botes de Redi?','Que las moscas puedan llegar a la carne',['El tipo de carne','El tamaño de los botes','La cantidad de aire'],'Todo lo demás era igual; solo cambiaba si las moscas podían posarse en la carne.')
  ]},
{ title:'Ciencia y pseudociencia', sub:'Qué es ciencia y qué solo lo parece',
  lesson:[
    ['La ciencia',`<p>La <b>ciencia</b> es el conocimiento que se obtiene con el <b>método científico</b>: se basa en <span class="hl">pruebas y experimentos</span> que cualquiera puede repetir, otros expertos revisan los estudios y <b>cambia sus ideas</b> si aparecen pruebas nuevas.</p>`],
    ['La pseudociencia',`<p>Una <b>pseudociencia</b> <span class="hl">parece ciencia, pero no lo es</span>: usa palabras científicas, pero no sigue el método científico. No se puede comprobar, se basa en <b>testimonios</b> («a mi vecina le funcionó»), no cambia aunque las pruebas la contradigan y a menudo busca <b>vender algo</b>.</p>`],
    ['Once disciplinas',`<div class="tbl"><table><tr><th>Ciencia</th><th>Pseudociencia</th></tr>${SCI.map((d,i)=>`<tr><td style="text-align:left">${d[0]}</td><td style="text-align:left">${PSE[i]?PSE[i][0]:''}</td></tr>`).join('')}</table></div>
     <p class="muted">Ojo: <b>Arqueología</b> y <b>Psicología</b> son ciencias aunque suenen raro. <b>Homeopatía</b>, <b>Numerología</b> y <b>Cienciología</b> no lo son, aunque su nombre parezca científico.</p>`],
    ['Cinco características',`<div class="tbl"><table><tr><th>Característica</th><th>Es de…</th></tr>${TRAITS.slice(0,3).concat(TRAITS.slice(6,8)).sort((x,y)=>x[1]<y[1]?-1:1).map(([t,k])=>`<tr><td style="text-align:left">${t}</td><td>${k}</td></tr>`).join('')}</table></div>`],
    ['Comparar dos mensajes',`<p>Dos mensajes sobre el tiempo: la <b>agencia de meteorología</b> da datos medibles (porcentajes y grados), <b>cita su fuente</b> (un modelo numérico) y se puede comprobar. «El Horóscopo» es vago, no cita ninguna fuente y no se puede comprobar. Fíate del primero. Usa las mismas claves de las fake news: la fuente, los datos y si se puede contrastar.</p>`],
    ['¿Sirven las pseudociencias?',`<p>No son útiles para <b>decidir cosas importantes</b>, porque no se basan en pruebas. Pueden hacerte <b>perder dinero o salud</b> (por ejemplo, dejar un tratamiento médico por un remedio que no funciona). Como juego o entretenimiento no hacen daño, pero no son una guía.</p>`],
    ['Error típico',`<div class="ex warn">«Si usa palabras científicas o lleva bata, es ciencia»</div><p>Lo que hace que algo sea ciencia son las <b>pruebas</b>, no la apariencia ni el nombre.</p>`]
  ],
  gens:[
    ()=>{const [x,sc,why]=pick(DISC);return mc(`¿Ciencia o pseudociencia?<br><b>${x}</b>`,sc?'Ciencia':'Pseudociencia',['Ciencia','Pseudociencia'],`${x} ${sc?'es una ciencia':'es una pseudociencia'}: ${why}.`)},
    ()=>{const [t,k]=pick(TRAITS);return mc(`«${t}»<br>¿Es propio de la ciencia o de una pseudociencia?`,k,['Ciencia','Pseudociencia'],`Es propio de ${k==='Ciencia'?'la ciencia':'una pseudociencia'}.`)},
    ()=>{const sci=Math.random()<.5;if(sci){const n=pick(TRICKY_SCI),d=DISC.find(x=>x[0]===n);return mc('¿Cuál de estas disciplinas <b>sí</b> es una ciencia?',d[0],TRICKY_PSE,`${d[0]} es una ciencia: ${d[2]}.`)}
      const n=pick(TRICKY_PSE),d=DISC.find(x=>x[0]===n);return mc('¿Cuál de estas disciplinas <b>no</b> es una ciencia?',d[0],shuffle(SCI.map(x=>x[0])).slice(0,3),`${d[0]} no es una ciencia: ${d[2]}.`)},
    ()=>mc('Un anuncio vende una pulsera que «mejora el equilibrio y la energía», con testimonios de famosos. ¿Por qué desconfiar?','No presenta pruebas científicas, solo testimonios',['Porque es muy cara','Porque la llevan famosos','Porque es de colores'],'Un testimonio no es una prueba: la ciencia necesita experimentos que se puedan repetir.'),
    ()=>{const ag=Math.random()<.5;return mc(`Para organizar una fiesta al aire libre, ¿de qué mensaje te fías más?<br><br><b>A.</b> ${ag?MSG_AGENCIA:MSG_HOROSCOPO}<br><br><b>B.</b> ${ag?MSG_HOROSCOPO:MSG_AGENCIA}`,ag?'De A, porque da datos medibles y cita su fuente':'De B, porque da datos medibles y cita su fuente',[ag?'De B, porque es más misterioso':'De A, porque es más misterioso',ag?'De B, porque habla de los planetas':'De A, porque habla de los planetas','De los dos por igual'],'El mensaje de la agencia da porcentajes y grados, cita el modelo numérico en que se basa y se puede comprobar. El horóscopo es vago y no cita ninguna fuente.')},
    ()=>mc('¿Por qué no conviene guiarse por una pseudociencia para decisiones importantes?','Porque no se basa en pruebas y puede hacerte perder dinero o salud',['Porque es aburrida','Porque solo la usan los famosos','Porque siempre está prohibida'],'Sin pruebas no hay garantía: dejar un tratamiento médico por un remedio sin eficacia puede ser peligroso. Como juego, no hace daño.'),
    ()=>{const [t,ok,why]=pick([['La ciencia cambia sus ideas si aparecen pruebas nuevas.',true],['El horóscopo es una ciencia porque usa los planetas.',false,'la astrología es una pseudociencia: sus predicciones no se cumplen cuando se comprueban.'],['Un testimonio de alguien famoso es una prueba científica.',false,'las pruebas son experimentos y datos que se pueden repetir.'],['Las pseudociencias a menudo intentan vender algo.',true],['La Psicología es una pseudociencia.',false,'estudia la conducta y la mente con métodos científicos.'],['La Homeopatía es una ciencia porque tiene un nombre científico.',false,'sus remedios no han demostrado más efecto que el placebo.']]);return tf(t,ok,why)}
  ]},
{ title:'Mujeres científicas', sub:'Descubrimientos que cambiaron la ciencia',
  lesson:[
    ['Científicas que hay que conocer',`<div class="tbl"><table><tr><th>Científica</th><th>¿Qué hizo?</th></tr>${WOMEN.map(w=>`<tr><td style="text-align:left"><b>${w.n}</b></td><td style="text-align:left">${w.k}</td></tr>`).join('')}</table></div>`],
    ['¿Por qué se conocen menos?',`<p>Durante siglos se impidió a muchas mujeres <b>estudiar</b> o trabajar en ciencia, y a veces sus descubrimientos se atribuyeron a hombres. Por ejemplo, Rosalind Franklin no recibió el premio Nobel por el ADN.</p>
     <p>El <span class="hl">11 de febrero</span> es el <b>Día Internacional de la Mujer y la Niña en la Ciencia</b>.</p>`],
    ['Error típico',`<div class="ex warn">Pensar que la ciencia es «cosa de hombres»</div><p>Mujeres como Marie Curie o Margarita Salas hicieron descubrimientos fundamentales. Hoy hay tantas chicas como chicos que pueden dedicarse a la ciencia.</p>`]
  ],
  gens:[
    ()=>{const w=pick(WOMEN);return mc(`¿Qué científica es conocida por <b>${w.a}</b>?`,w.n,shuffle(WOMEN.filter(x=>x!==w)).slice(0,3).map(x=>x.n),`${w.n}: ${w.k}`)},
    ()=>{const w=pick(WOMEN);return mc(`¿Con qué se relaciona el trabajo de <b>${w.n}</b>?`,w.a[0].toUpperCase()+w.a.slice(1),shuffle(WOMEN.filter(x=>x!==w)).slice(0,3).map(x=>x.a[0].toUpperCase()+x.a.slice(1)),w.k)},
    ()=>mc('¿Qué científica ganó el premio Nobel en dos ciencias distintas (Física y Química)?','Marie Curie',['Rosalind Franklin','Ada Lovelace','Jane Goodall'],WOMEN[0].k),
    ()=>mc('¿Qué bioquímica española descubrió una proteína que permite copiar el ADN?','Margarita Salas',['Marie Curie','Rachel Carson','Katherine Johnson'],WOMEN[2].k),
    ()=>mc('¿Qué día se celebra el Día Internacional de la Mujer y la Niña en la Ciencia?','El 11 de febrero',['El 8 de marzo','El 23 de abril','El 5 de junio'],'Se celebra el 11 de febrero. (El 8 de marzo es el Día Internacional de la Mujer, en general.)'),
    ()=>mc('¿Por qué muchas científicas fueron poco conocidas durante siglos?','Porque se les impedía estudiar y a veces su trabajo se atribuía a hombres',['Porque no hicieron descubrimientos importantes','Porque no les interesaba la ciencia','Porque la ciencia no existía'],'Durante mucho tiempo, las mujeres tuvieron prohibido o muy difícil estudiar y su trabajo no siempre se reconoció.')
  ]}
];

/* ---------- relatos animados ---------- */
export { DISC };
const CIE_ANIMS=[
[ // Fake news: Marta y el mensaje del «maridiamante»
  {say:'Marta recibe un mensaje en el móvil: científicos descubren un mineral que se convierte en diamante con agua de mar. ¡Compártelo con todos!',
   show:sk(290,150,person(40,40,0,'Marta')+phone(84,22,.9,104,96)+tx(132,52,'¡¡INCREÍBLE!!',1.6,{s:12,c:'red'})+tx(132,72,'maridiamante',2.2,{s:12})+tx(132,92,'¡Compártelo!',2.8,{s:12,c:'red'})+arrow(186,70,220,70,3.4,'blue')+tx(250,74,'¿?',3.8,{s:26,c:'red'}))},
  {say:'Antes de compartirlo, Marta se hace preguntas. ¿De dónde sale? No lo dice. ¿Es demasiado llamativa? Sí. ¿Tiene faltas? Alguna.',
   show:line(at(0,'¿Fuente fiable? <b class="bad">✗</b>'))+line(at(1.6,'¿Muy llamativa? <b class="bad">✗</b>'))+line(at(3.2,'¿Faltas o exageraciones? <b class="bad">✗</b>'))},
  {say:'Ahora tú: ¿qué pista te hace sospechar?',ask:()=>CIE_LEVELS[0].gens[0]()},
  {say:'Marta la busca en otras webs y en periódicos serios: no aparece en ninguno. Y la palabra maridiamante no existe. Es un bulo, una noticia falsa.',
   show:sk(260,120,magnifier(60,52,0)+tx(60,58,'?',.8,{s:18})+ln(110,30,200,30,1.2,{t:.3})+ln(110,52,190,52,1.5,{t:.3})+ln(110,74,200,74,1.8,{t:.3})+stamp(140,80,'BULO',2.6))},
  {say:'¿Por qué alguien inventa un bulo? Para ganar dinero con las visitas, para influir en lo que pensamos o para llamar la atención. Pregúntate siempre quién gana si te lo crees.',
   show:line(seq(['<span class="chip">dinero</span>','<span class="chip">influir</span>','<span class="chip">llamar la atención</span>'],0,.9))+line(at(3,'¿Quién gana si me lo creo?','bad'))},
  {say:'¿Esta noticia es fiable o es un bulo?',ask:()=>CIE_LEVELS[0].gens[1]()},
  {say:'En la vida real: cada día circulan bulos por WhatsApp y redes, como falsos remedios que curan enfermedades. Si no compartes sin comprobar, el bulo se para contigo.',
   show:real('frenar un bulo',sk(290,110,phone(10,10,0,64)+arrow(80,40,110,40,.6,'blue')+phone(120,10,.9,64)+arrow(190,40,220,40,1.4,'red')+ln(196,26,214,54,1.9,{c:'red',t:.2})+ln(214,26,196,54,2,{c:'red',t:.2})+tx(250,46,'stop',2.3,{s:16,c:'red'})))},
  {say:'¿Qué harías tú?',ask:()=>CIE_LEVELS[0].gens[4]()}
],
[ // Método científico: las plantas de Leo
  {say:'Leo observa que las plantas de su ventana crecen más que las del pasillo, y se pregunta por qué. Así empieza el método científico: con una observación y una pregunta.',
   show:sk(280,150,box(20,20,90,80,0,{t:.6})+ln(65,20,65,100,.6,{t:.2})+ln(20,60,110,60,.7,{t:.2})+plant(65,118,60,1)+plant(200,118,20,2)+tx(65,148,'ventana',2.6,{s:13})+tx(200,148,'pasillo',2.8,{s:13})+tx(250,60,'¿?',3.4,{s:28,c:'red'}))},
  {say:'Leo propone una hipótesis: una posible respuesta que se puede comprobar. Las plantas crecen más cuando reciben más luz.',
   show:sk(260,90,stroke('M110 60Q90 40 110 20Q130 4 150 20Q170 40 150 60L146 72L114 72Z',0,{c:'red',t:.6})+ln(118,80,142,80,.6,{t:.12}))+line(at(1.2,'<b>Hipótesis:</b> más luz → más crecimiento'))},
  {say:'Ahora tú: ¿qué paso es este?',ask:()=>CIE_LEVELS[1].gens[1]()},
  {say:'Para comprobarla, experimenta con dos plantas iguales, la misma tierra y la misma agua. Solo cambia una cosa: una recibe luz y la otra está a oscuras.',
   show:sk(280,150,sun(60,26,0)+plant(60,120,30,.6)+box(160,40,90,90,1.6,{t:.6})+fill(163,43,84,84,2.2,'ink')+tx(70,148,'con luz',2.6,{s:13})+tx(205,148,'a oscuras',2.8,{s:13}))+line(at(3.2,'solo cambia <b>una cosa</b>: la luz'))},
  {say:'Durante dos semanas mide las plantas y apunta los datos. Para analizarlos, los ordena en una tabla y en una gráfica.',
   show:`<div class="row instrow">${sk(150,100,box(5,10,140,80,0,{t:.6})+ln(75,10,75,90,.6,{t:.15})+ln(5,36,145,36,.7,{t:.15})+tx(40,30,'luz',1,{s:12})+tx(110,30,'oscuras',1.1,{s:12})+tx(40,68,'12 cm',1.6,{s:16})+tx(110,68,'4 cm',1.9,{s:16}))}${sk(110,100,chart(10,5,2.4,[72,24]))}</div>`},
  {say:'¿Qué sabes de los datos y las conclusiones?',ask:()=>CIE_LEVELS[1].gens[0]()},
  {say:'Al analizar los datos saca una conclusión: la luz ayuda a crecer, la hipótesis se confirma. Si se hubiera rechazado, Leo plantearía una hipótesis nueva y volvería a experimentar.',
   show:line(seq(['observación','→','hipótesis','→','experimento','→','<b>conclusión</b>'],0,.5))+line(at(3.6,'✓ confirmada → ley o teoría si se repite','good'))+line(at(4.8,'✗ rechazada → nueva hipótesis','bad'))},
  {say:'En la vida real: los medicamentos se prueban así. Antes de venderse se experimenta con grupos de personas y se analizan los datos para comprobar que funcionan y que son seguros.',
   show:real('los medicamentos',sk(270,110,stroke('M30 50L60 20Q72 8 84 20Q96 32 84 44L54 74Q42 86 30 74Q18 62 30 50Z',0,{c:'blue',t:.8})+ln(45,35,69,59,.8,{t:.2})+chart(150,10,1.4,[30,64,50])))},
  {say:'¿Qué paso va después?',ask:()=>CIE_LEVELS[1].gens[3]()}
],
[ // Redi: los botes y las moscas
  {say:'Hace siglos, mucha gente creía que los gusanos nacían solos de la carne podrida. Lo llamaban generación espontánea. El científico Francesco Redi no estaba convencido.',
   show:sk(280,140,person(40,40,0,'Redi')+bubble(62,4,96,30,'¿Seguro?',.8,{s:15})+fill(150,96,90,22,1.6,'red')+worm(160,92,2.2)+worm(200,90,2.5)+tx(195,136,'carne podrida',2.8,{s:13}))},
  {say:'Su hipótesis: los gusanos no nacen solos, salen de los huevos que ponen las moscas sobre la carne.',
   show:sk(260,110,fly(70,40,0)+arrow(90,46,140,70,.8,'blue')+[0,1,2].map(k=>dot(160+k*10,74,3.5,1.4+k*.15)).join('')+arrow(195,74,225,74,2,'blue')+worm(232,74,2.6))+line(at(3,'<b>Hipótesis:</b> moscas → huevos → gusanos'))},
  {say:'¿Cuál fue la hipótesis de Redi?',ask:()=>CIE_LEVELS[2].gens[0]()},
  {say:'Su experimento: carne en dos botes de vidrio. Uno abierto y otro cubierto con una tela fina, que deja pasar el aire, pero no las moscas. Solo cambia eso.',
   show:sk(280,150,jar(40,40,0,false)+jar(180,40,1.4,true)+fly(70,24,2.4)+fly(90,30,2.6)+fly(210,18,2.8)+tx(70,145,'abierto',3,{s:13})+tx(210,145,'con tela',3.2,{s:13}))},
  {say:'Pasan los días. En el bote abierto aparecen gusanos. En el bote cubierto con tela, ninguno.',
   show:sk(280,150,jar(40,40,0,false)+jar(180,40,0,true)+worm(52,100,1)+worm(66,96,1.4)+worm(58,92,1.8)+tx(70,145,'¡gusanos!',2.4,{s:14,c:'red'})+tx(210,145,'nada',2.8,{s:14,c:'green'}))+line(at(3.4,'<b>Resultados</b>'))},
  {say:'Conclusión: los gusanos vienen de los huevos de las moscas. La generación espontánea es falsa, al menos para los gusanos.',
   show:line(at(0,'<b>Conclusión:</b>'))+line(at(.8,'moscas → huevos → gusanos'))+line(strike(at(2.4,'generación espontánea'),3.4))},
  {say:'¿En qué bote salieron los gusanos?',ask:()=>CIE_LEVELS[2].gens[1]()},
  {say:'En la vida real: por eso tapamos la comida en verano. Si una mosca se posa en ella, puede poner huevos. Una buena conclusión científica también sirve en la cocina.',
   show:real('tapar la comida',sk(260,110,ell(130,90,80,14,0)+stroke('M60 88Q60 30 130 26Q200 30 200 88',.6,{c:'blue',t:.7})+fly(220,30,1.6)+ln(206,20,234,44,2,{c:'red',t:.2})))},
  {say:'¿Por qué usó una tela y no una tapa?',ask:()=>CIE_LEVELS[2].gens[2]()}
],
[ // Ciencia y pseudociencia: «La fiesta de fin de curso»
  {say:'María y Ricardo organizan la fiesta de fin de curso, al aire libre. Todo depende del tiempo, pero cada previsión que encuentran dice una cosa distinta.',
   show:sk(280,130,person(40,26,0,'María')+person(110,26,.4,'Ricardo')+sun(200,36,1.2)+stroke('M170 84Q166 66 186 66Q192 52 212 58Q236 56 234 76Q244 86 228 90L184 90Q166 92 170 84',1.8,{c:'blue',t:.6}))},
  {say:'María propone preguntar a un astrólogo. Ricardo prefiere a un meteorólogo: la astrología no le parece fiable. ¿Cuál de los dos caminos es el bueno?',
   show:sk(280,130,tx(140,16,'¿quién nos dice el tiempo?',0,{s:15})+ln(140,26,70,66,.8,{t:.3})+ln(140,26,210,66,1,{t:.3})+box(20,70,100,40,1.4,{t:.5})+tx(70,96,'astrólogo',1.9,{s:15,c:'red'})+box(160,70,100,40,2.2,{t:.5})+tx(210,96,'meteorólogo',2.7,{s:15,c:'green'}))},
  {say:'La madre de María lo explica: la astrología no es una ciencia, es una pseudociencia, porque no sigue el método científico. ¿Y estas otras disciplinas?',
   show:line(at(0,'Astrología → <b>pseudociencia</b>','bad'))+line(at(1.2,'no sigue el método científico'))},
  {say:'Clasifica esta disciplina.',ask:()=>CIE_LEVELS[3].gens[0]()},
  {say:'Hay disciplinas que engañan. La arqueología y la psicología sí son ciencias. La homeopatía, la numerología y la cienciología no lo son, aunque su nombre suene científico.',
   show:line(at(0,'<b>Ciencia:</b> Arqueología · Psicología','good'))+line(at(1.4,'<b>No:</b> Homeopatía · Numerología · Cienciología','bad'))},
  {say:'¿Cuál de estas es una ciencia?',ask:()=>CIE_LEVELS[3].gens[2]()},
  {say:'La ciencia usa un vocabulario preciso, presenta sus fuentes, experimenta y descarta las ideas obsoletas. La pseudociencia solo cuenta los aciertos y no experimenta.',
   show:line(at(0,'<b>Ciencia:</b> vocabulario preciso · fuentes · avanza','good'))+line(at(1.6,'<b>Pseudociencia:</b> solo aciertos · no experimenta','bad'))},
  {say:'¿De quién es esta característica?',ask:()=>CIE_LEVELS[3].gens[1]()},
  {say:'Ricardo compara dos mensajes. La agencia de meteorología da porcentajes y grados y dice en qué modelo se basa. El horóscopo habla de Mercurio y de oportunidades, sin datos.',
   show:sk(290,130,box(6,8,132,100,0,{t:.7})+tx(72,30,'Agencia',.7,{s:13,c:'green'})+tx(72,56,'40 % lluvia',1.2,{s:13})+tx(72,76,'−2 °C',1.6,{s:13})+tx(72,98,'fuente ✓',2,{s:13,c:'green'})+box(152,8,132,100,2.4,{t:.7})+tx(218,30,'El Horóscopo',3.1,{s:13,c:'red'})+tx(218,60,'«Mercurio…»',3.6,{s:13})+tx(218,98,'fuente ✗',4.2,{s:13,c:'red'}))},
  {say:'¿De cuál se fían y por qué?',ask:()=>CIE_LEVELS[3].gens[4]()},
  {say:'En la vida real: la aplicación del tiempo de tu móvil usa modelos numéricos como el de la agencia. Por eso acierta mucho más que cualquier horóscopo.',
   show:real('la aplicación del tiempo',sk(260,120,phone(95,6,0,104,64)+tx(127,52,'☀',.8,{s:26,c:'red'})+tx(127,84,'40 %',1.2,{s:14})+tx(200,60,'modelo numérico',1.8,{s:13,c:'green'})+arrow(188,60,164,60,2.2,'green')))},
  {say:'Para terminar: ¿por qué no conviene guiarse por una pseudociencia?',ask:()=>CIE_LEVELS[3].gens[5]()}
],
[ // Mujeres científicas: una línea del tiempo
  {say:'Viajamos por la historia de la ciencia de la mano de científicas que cambiaron lo que sabemos. Empezamos en la Antigüedad, con Hipatia de Alejandría: matemática y astrónoma.',
   show:sk(280,120,ln(10,90,270,90,0,{t:.8})+[30,90,150,210,250].map((x,k)=>ln(x,84,x,96,.6+k*.1,{t:.1})).join('')+face(30,50,1.4)+tx(30,112,'Hipatia',1.8,{s:12})+circ(30,50,22,2.2,{c:'red',t:.4}))},
  {say:'Marie Curie estudió la radiactividad y descubrió el polonio y el radio. Ganó dos premios Nobel, en Física y en Química.',
   show:`<div class="row instrow">${sk(90,90,face(45,46,0,'M-16 -2Q-16 -22 0 -22Q16 -22 16 -2M-16 -2L-18 10M16 -2L18 10'),'inst')}${sk(90,90,atom(45,45,1),'inst')}</div>`+line(at(2.6,'<b>Marie Curie</b> · radiactividad · dos Nobel'))},
  {say:'¿Quién es quién? Relaciona la científica con lo que hizo.',ask:()=>CIE_LEVELS[4].gens[0]()},
  {say:'Rosalind Franklin obtuvo con rayos X la fotografía cincuenta y uno, clave para descubrir que el ADN tiene forma de doble hélice. No recibió el Nobel.',
   show:`<div class="row instrow">${sk(90,90,face(45,46,0),'inst')}${sk(70,130,dna(35,5,1),'inst')}</div>`+line(at(2.8,'<b>Rosalind Franklin</b> · la doble hélice del ADN'))},
  {say:'La española Margarita Salas descubrió una proteína que permite copiar el ADN. Hoy se usa en laboratorios de todo el mundo.',
   show:`<div class="row instrow">${sk(90,90,face(45,46,0,'M-14 -4Q-12 -22 0 -22Q12 -22 14 -4'),'inst')}${sk(170,130,dna(35,5,.8)+arrow(70,65,100,65,1.9,'blue')+dna(135,5,2.3),'dots')}</div>`+line(at(2.8,'<b>Margarita Salas</b> · copiar el ADN'))},
  {say:'¿Con qué se relaciona su trabajo?',ask:()=>CIE_LEVELS[4].gens[1]()},
  {say:'En la vida real: el once de febrero es el Día Internacional de la Mujer y la Niña en la Ciencia. Recuerda que la ciencia es cosa de todas las personas.',
   show:real('el once de febrero',sk(240,110,box(80,10,80,90,0,{t:.6})+fill(80,10,80,22,.6,'red')+tx(120,27,'FEBRERO',1,{s:12})+tx(120,80,'11',1.4,{s:40})))},
  {say:'Una última pregunta.',ask:()=>CIE_LEVELS[4].gens[5]()}
]];

export { CIE_LEVELS, CIE_ANIMS };
