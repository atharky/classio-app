import { ri, pick, shuffle, mc, num } from './data.js';
import { at, seq, line, real, sk, ln, box, tx, arrow, person, bubble, circ, stroke } from './sketch.js';

/* ---------- contenido: Lengua · La comunicación ---------- */
const EL=['emisor','receptor','mensaje','código','canal','contexto'];
const DEF={emisor:'quien envía el mensaje',receptor:'quien recibe e interpreta el mensaje',mensaje:'la información que se transmite',
  'código':'el conjunto de signos y reglas que comparten emisor y receptor (un idioma, las señales de tráfico…)',
  canal:'el medio físico por el que viaja el mensaje (el aire, el papel, la pantalla…)',contexto:'la situación en la que se produce la comunicación'};
// Situaciones con sus seis elementos, para preguntar por cualquiera de ellos.
const SCENES=[
  {d:'Laura llama por teléfono a su abuelo para felicitarle por su cumpleaños.',emisor:'Laura',receptor:'su abuelo',mensaje:'la felicitación',
   'código':'la lengua española oral','canal':'el teléfono','contexto':'el cumpleaños del abuelo'},
  {d:'El profesor explica en clase cómo se hace un resumen.',emisor:'el profesor',receptor:'los alumnos',mensaje:'cómo se hace un resumen',
   'código':'la lengua española','canal':'el aire (ondas sonoras)','contexto':'una clase del instituto'},
  {d:'En un cruce hay una señal de STOP para los conductores.',emisor:'la autoridad de tráfico',receptor:'los conductores',mensaje:'hay que detenerse',
   'código':'las señales de tráfico','canal':'la placa de la señal','contexto':'un cruce de calles'},
  {d:'Durante un partido, el árbitro pita y señala el punto de penalti.',emisor:'el árbitro',receptor:'los jugadores',mensaje:'ha habido penalti',
   'código':'el silbato y los gestos del reglamento','canal':'el aire y la luz','contexto':'un partido de fútbol'},
  {d:'Ana escribe un correo electrónico a su profesora para preguntar la fecha del examen.',emisor:'Ana',receptor:'su profesora',mensaje:'la pregunta por la fecha del examen',
   'código':'la lengua española escrita','canal':'internet y la pantalla','contexto':'la preparación de un examen'},
  {d:'Una locutora da por la radio la noticia de una gran nevada.',emisor:'la locutora',receptor:'los oyentes',mensaje:'la noticia de la nevada',
   'código':'la lengua española','canal':'las ondas de radio','contexto':'un informativo durante un temporal'},
  {d:'Pedro le cuenta un chiste en lengua de signos a su amiga Marta, que es sorda.',emisor:'Pedro',receptor:'Marta',mensaje:'el chiste',
   'código':'la lengua de signos','canal':'la luz (es visual)','contexto':'una charla entre amigos'}
];
// Qué elemento falla cuando la comunicación no funciona.
const FAILS=[
  ['Le hablas en japonés a alguien que no sabe japonés.','código'],['Tu móvil se queda sin batería en mitad de una llamada.','canal'],
  ['En el patio hay tanto ruido que no oyes a tu amigo.','canal'],['Das un discurso en una sala vacía: no hay nadie que te escuche.','receptor'],
  ['Un turista no entiende las señales de tráfico de otro país.','código'],['Entras a mitad de una conversación y no sabes de qué hablan.','contexto'],
  ['La pizarra está tan borrosa que no se lee lo escrito.','canal']];

const FUN={
  Representativa:['La Luna gira alrededor de la Tierra.','El instituto abre a las ocho.','Madrid es la capital de España.','Mañana lloverá en el norte.'],
  Expresiva:['¡Qué alegría verte!','Estoy muy cansado.','¡Ay, qué dolor!','Me encanta esta canción.'],
  Apelativa:['Cierra la puerta, por favor.','¿Me prestas tu goma?','Compra ya el nuevo patinete.','No corras por el pasillo.'],
  Fática:['¿Me oyes? ¿Hola?','Bueno, pues eso…','¿Sigues ahí?','Ajá, ajá, te escucho.'],
  Poética:['Verde que te quiero verde.','Tres tristes tigres tragaban trigo.','Bebe Frescola, ¡la que mola!','Las nubes, algodón del cielo.'],
  Metalingüística:['«Casa» es un sustantivo.','¿Cómo se escribe «hierba»?','¿«Feliz» lleva tilde?','«Amar» es un verbo.']};
const FOCUS={Representativa:'el contexto (aquello de lo que se habla)',Expresiva:'el emisor',Apelativa:'el receptor',Fática:'el canal',Poética:'el mensaje',Metalingüística:'el código'};

const COM_LEVELS=[
{ title:'Los elementos de la comunicación', sub:'Emisor, receptor, mensaje, código, canal y contexto',
  lesson:[
    ['¿Qué es comunicar?',`<p><b>Comunicar</b> es transmitir información de una persona (o de un grupo) a otra. Para que haya comunicación tienen que intervenir varios <span class="hl">elementos</span>.</p>`],
    ['Los seis elementos',`<div class="tbl"><table><tr><th>Elemento</th><th>Qué es</th></tr>${EL.map(e=>`<tr><td><b>${e[0].toUpperCase()+e.slice(1)}</b></td><td style="text-align:left">${DEF[e][0].toUpperCase()+DEF[e].slice(1)}</td></tr>`).join('')}</table></div>`],
    ['Un ejemplo',`<div class="ex">Lucía escribe a Marcos por WhatsApp: «¿Quedamos a las cinco?»</div>
     <p>Emisor: <b>Lucía</b>. Receptor: <b>Marcos</b>. Mensaje: <b>la propuesta de quedar</b>. Código: <b>la lengua española escrita</b>. Canal: <b>la pantalla del móvil</b>. Contexto: <b>dos amigos que organizan la tarde</b>.</p>
     <p>El emisor y el receptor pueden <span class="hl">intercambiar sus papeles</span>: cuando Marcos contesta, él pasa a ser el emisor.</p>`],
    ['Error típico',`<div class="ex warn">Confundir el canal con el código</div><p>El <b>canal</b> es el medio <b>físico</b> por el que viaja el mensaje (el aire, el papel, la pantalla). El <b>código</b> es el <b>sistema de signos</b> que se usa (el español, el inglés, las señales de tráfico).</p>`]
  ],
  gens:[
    ()=>{const s=pick(SCENES),e=pick(EL);return mc(`«${s.d}»<br>¿Cuál es el <b>${e}</b>?`,s[e][0].toUpperCase()+s[e].slice(1),shuffle(EL.filter(x=>x!==e)).map(x=>s[x][0].toUpperCase()+s[x].slice(1)),`El ${e} es ${DEF[e]}: aquí, ${s[e]}.`)},
    ()=>{const e=pick(EL);return mc(`¿Qué elemento de la comunicación es <b>${DEF[e]}</b>?`,e[0].toUpperCase()+e.slice(1),shuffle(EL.filter(x=>x!==e)).map(x=>x[0].toUpperCase()+x.slice(1)),`Es el ${e}.`)},
    ()=>{const [s,e]=pick(FAILS);return mc(`${s}<br>¿Qué elemento de la comunicación falla?`,e[0].toUpperCase()+e.slice(1),shuffle(EL.filter(x=>x!==e)).map(x=>x[0].toUpperCase()+x.slice(1)),`Falla el ${e}: ${DEF[e]}.`)},
    ()=>{const s=pick(SCENES),k=Math.random()<.5;return mc(`«${s.d}»<br>${k?'¿Cuál es el <b>canal</b>?':'¿Cuál es el <b>código</b>?'}`,k?s.canal[0].toUpperCase()+s.canal.slice(1):s['código'][0].toUpperCase()+s['código'].slice(1),[k?s['código']:s.canal,s.mensaje,s.emisor].map(x=>x[0].toUpperCase()+x.slice(1)),`El canal es el medio físico (${s.canal}); el código, el sistema de signos (${s['código']}).`)},
    ()=>{const [t,ok]=pick([['El emisor y el receptor pueden intercambiar sus papeles.',true],['El canal y el código son lo mismo.',false],['Para entenderse, emisor y receptor tienen que compartir el código.',true],['Las señales de tráfico no son un código porque no tienen palabras.',false],['El contexto ayuda a entender el mensaje.',true],['Solo hay comunicación si se usan palabras.',false]]);
      return mc(`¿Verdadero o falso?<br>«${t}»`,ok?'Verdadero':'Falso',['Verdadero','Falso'],ok?'Es verdadero.':'Es falso: '+({
        'El canal y el código son lo mismo.':'el canal es el medio físico y el código, el sistema de signos.',
        'Las señales de tráfico no son un código porque no tienen palabras.':'un código puede estar formado por imágenes, colores o gestos.',
        'Solo hay comunicación si se usan palabras.':'también nos comunicamos con gestos, imágenes o sonidos.'})[t])}
  ]},
{ title:'Comunicación verbal y no verbal. Los signos', sub:'Palabras, gestos, imágenes; indicios, iconos y símbolos',
  lesson:[
    ['Verbal y no verbal',`<p>La comunicación <span class="hl">verbal</span> usa palabras, y puede ser <b>oral</b> (hablada) o <b>escrita</b>. La comunicación <span class="hl">no verbal</span> usa otros signos: gestos, imágenes, colores, sonidos…</p>
     <div class="ex">Verbal oral: una llamada · Verbal escrita: un correo · No verbal: levantar el pulgar</div>`],
    ['Los signos',`<p>Un <b>signo</b> es algo que representa otra cosa. Hay tres tipos:</p>
     <div class="tbl"><table><tr><th>Tipo</th><th>Relación con lo que representa</th><th>Ejemplo</th></tr>
     <tr><td><b>Indicio</b></td><td>Natural, de causa y efecto</td><td>El humo indica fuego</td></tr>
     <tr><td><b>Icono</b></td><td>Se parece a lo que representa</td><td>La señal con una curva dibujada</td></tr>
     <tr><td><b>Símbolo</b></td><td>Por acuerdo (convención)</td><td>Las palabras, una bandera, la P de parking</td></tr></table></div>`],
    ['Error típico',`<div class="ex warn">Pensar que un icono y un símbolo son lo mismo</div><p>El dibujo de un teléfono en una señal <b>se parece</b> a un teléfono: es un <b>icono</b>. La palabra «teléfono» no se parece en nada: la entendemos porque lo hemos <b>acordado</b>, así que es un <b>símbolo</b>.</p>`]
  ],
  gens:[
    ()=>{const [x,t]=pick([['Una llamada de teléfono','Verbal oral'],['Un mensaje escrito de WhatsApp','Verbal escrita'],['Levantar el pulgar para decir «bien»','No verbal'],['Una carta','Verbal escrita'],['Un emoticono sonriente','No verbal'],['Una conversación en el recreo','Verbal oral'],['El color rojo del semáforo','No verbal'],['Un cartel con el texto «Prohibido fumar»','Verbal escrita'],['Un aplauso al final de una obra','No verbal'],['Un pódcast','Verbal oral']]);
      return mc(`¿Qué tipo de comunicación es esta?<br><b>${x}</b>`,t,['Verbal oral','Verbal escrita','No verbal'],`${x}: ${t==='No verbal'?'no usa palabras':t==='Verbal oral'?'usa palabras habladas':'usa palabras escritas'}.`)},
    ()=>{const [x,t,why]=pick([['El humo que sale de un bosque','Indicio','es una señal natural de que hay fuego'],['Unas nubes negras','Indicio','anuncian de forma natural que va a llover'],['Unas huellas en la nieve','Indicio','indican de forma natural que alguien ha pasado'],['La fiebre','Indicio','es una señal natural de enfermedad'],['La señal de tráfico con una curva dibujada','Icono','se parece a la curva que representa'],['El dibujo de una papelera en un cartel','Icono','se parece a una papelera'],['La silueta de una persona en la puerta del baño','Icono','se parece a lo que representa'],['La palabra «mesa»','Símbolo','no se parece a una mesa: la entendemos por acuerdo'],['La bandera de un país','Símbolo','representa al país por acuerdo'],['La letra P azul de un parking','Símbolo','significa «aparcamiento» por acuerdo'],['El color verde del semáforo','Símbolo','significa «puedes pasar» por acuerdo']]);
      return mc(`¿Qué tipo de signo es este?<br><b>${x}</b>`,t,['Indicio','Icono','Símbolo'],`Es un ${t.toLowerCase()}: ${why}.`)},
    ()=>{const t=pick(['Indicio','Icono','Símbolo']);const ex={Indicio:['El olor a quemado','Las nubes negras','Unas huellas en el barro'],Icono:['Un mapa','Una fotografía','El dibujo de una bici en el carril bici'],Símbolo:['La palabra «perro»','Una señal de prohibido con un círculo rojo','La cruz verde de una farmacia']};
      const others=['Indicio','Icono','Símbolo'].filter(x=>x!==t).map(x=>pick(ex[x]));return mc(`¿Cuál de estos es un <b>${t.toLowerCase()}</b>?`,pick(ex[t]),others,`${t==='Indicio'?'Un indicio tiene una relación natural con lo que indica':t==='Icono'?'Un icono se parece a lo que representa':'Un símbolo representa algo por acuerdo'}.`)},
    ()=>{const [t,ok,why]=pick([['La comunicación no verbal no usa palabras.',true,''],['Una carta es comunicación verbal oral.',false,'una carta es verbal escrita.'],['Los gestos pueden comunicar.',true,''],['El humo es un símbolo del fuego.',false,'es un indicio: su relación con el fuego es natural.'],['Las palabras son símbolos.',true,'']]);
      return mc(`¿Verdadero o falso?<br>«${t}»`,ok?'Verdadero':'Falso',['Verdadero','Falso'],ok?'Es verdadero.':'Es falso: '+why)}
  ]},
{ title:'Las funciones del lenguaje', sub:'Para qué usamos el lenguaje en cada momento',
  lesson:[
    ['¿Para qué hablamos?',`<p>Según la <b>intención</b> del emisor, el lenguaje cumple distintas <span class="hl">funciones</span>. Cada una se centra en un elemento de la comunicación.</p>`],
    ['Las seis funciones',`<div class="tbl"><table><tr><th>Función</th><th>Intención</th><th>Ejemplo</th></tr>
     <tr><td><b>Representativa</b></td><td>Informar de forma objetiva</td><td>«El agua hierve a 100 °C.»</td></tr>
     <tr><td><b>Expresiva</b></td><td>Expresar sentimientos u opiniones</td><td>«¡Qué alegría verte!»</td></tr>
     <tr><td><b>Apelativa</b></td><td>Pedir, ordenar o convencer al receptor</td><td>«Cierra la puerta, por favor.»</td></tr>
     <tr><td><b>Fática</b></td><td>Comprobar que el canal funciona</td><td>«¿Me oyes? ¿Hola?»</td></tr>
     <tr><td><b>Poética</b></td><td>Cuidar la forma del mensaje para que sea bello o llamativo</td><td>«Verde que te quiero verde.»</td></tr>
     <tr><td><b>Metalingüística</b></td><td>Hablar sobre la propia lengua</td><td>«“Casa” es un sustantivo.»</td></tr></table></div>`],
    ['Error típico',`<div class="ex warn">«¡Cierra la ventana!» no es expresiva</div><p>Aunque lleve exclamaciones, lo que busca es que el receptor <b>haga algo</b>: es <b>apelativa</b>. La expresiva muestra lo que siente el emisor: «¡Qué frío tengo!».</p>`]
  ],
  gens:[
  ()=>{const f=pick(Object.keys(FUN));return mc(`¿Qué función del lenguaje predomina?<br>«${pick(FUN[f])}»`,f,shuffle(Object.keys(FUN).filter(x=>x!==f)),`Predomina la función ${f.toLowerCase()}: se centra en ${FOCUS[f]}.`)},
  ()=>{const f=pick(Object.keys(FUN));return mc(`¿Qué frase tiene función <b>${f.toLowerCase()}</b>?`,pick(FUN[f]),shuffle(Object.keys(FUN).filter(x=>x!==f)).slice(0,3).map(x=>pick(FUN[x])),`En la función ${f.toLowerCase()} el lenguaje se centra en ${FOCUS[f]}.`)},
  ()=>{const f=pick(Object.keys(FUN));return mc(`La función <b>${f.toLowerCase()}</b> se centra en…`,FOCUS[f][0].toUpperCase()+FOCUS[f].slice(1),shuffle(Object.keys(FUN).filter(x=>x!==f)).map(x=>FOCUS[x][0].toUpperCase()+FOCUS[x].slice(1)),`La función ${f.toLowerCase()} se centra en ${FOCUS[f]}.`)},
  ()=>{const [t,f]=pick([['Un anuncio de televisión que te anima a comprar algo','Apelativa'],['Un diccionario explicando qué significa una palabra','Metalingüística'],['Un parte meteorológico','Representativa'],['Un poema','Poética'],['Un diario íntimo donde cuentas cómo te sientes','Expresiva'],['Decir «¿me escuchas?» en una videollamada','Fática']]);
    return mc(`¿Qué función predomina en este caso?<br><b>${t}</b>`,f,shuffle(Object.keys(FUN).filter(x=>x!==f)),`Predomina la función ${f.toLowerCase()}.`)}
  ]}
];

/* ---------- contenido: Lengua · El resumen ---------- */
const TEXTS=[
  {t:'Las abejas son fundamentales para la vida en la Tierra. Al pasar de flor en flor transportan el polen, lo que permite que muchas plantas produzcan frutos y semillas. Sin ellas, alimentos como las manzanas, las almendras o los tomates serían mucho más escasos. Además, producen miel y cera, que el ser humano utiliza desde hace miles de años.',
   main:'Las abejas son fundamentales porque polinizan las plantas que nos dan alimento.',sec:'Las abejas también producen miel y cera.',
   bad:['La miel se usa desde hace miles de años.','Las manzanas y los tomates son frutas muy sanas.','Las abejas dañan las flores al posarse en ellas.'],
   keys:'abejas · polen · plantas · alimentos',nokeys:['miles · años · además · ser','flor · ellas · mucho · como','vida · Tierra · hace · humano'],title:'Las abejas, unas aliadas imprescindibles',
   sum:'Las abejas son imprescindibles porque, al transportar el polen, permiten que muchas plantas den los frutos que comemos; además, producen miel y cera.',
   opinion:'Las abejas me dan un poco de miedo, pero creo que son útiles porque llevan polen.',detail:'Las abejas producen miel y cera.',wrong:'Las abejas producen manzanas y tomates en las flores.'},
  {t:'Dormir bien es imprescindible para los adolescentes. Durante el sueño, el cerebro ordena lo aprendido durante el día y el cuerpo crece y se recupera. Los expertos recomiendan dormir entre ocho y diez horas. Usar el móvil antes de acostarse retrasa el sueño, porque la luz de la pantalla engaña al cerebro.',
   main:'Dormir lo suficiente es imprescindible para que los adolescentes aprendan y crezcan.',sec:'La luz del móvil retrasa el sueño.',
   bad:['Los móviles tienen pantallas muy luminosas.','Los adultos necesitan dormir más que los adolescentes.','El cerebro descansa por completo y no hace nada mientras dormimos.'],
   keys:'dormir · adolescentes · cerebro · crecer',nokeys:['luz · pantalla · antes · porque','día · horas · entre · durante','expertos · móvil · engaña · cuerpo'],title:'Dormir bien: una necesidad en la adolescencia',
   sum:'Los adolescentes necesitan dormir entre ocho y diez horas, porque durante el sueño el cerebro ordena lo aprendido y el cuerpo crece; el móvil antes de acostarse lo dificulta.',
   opinion:'Yo duermo poco y estoy bien, así que no creo que dormir sea tan importante.',detail:'La luz de la pantalla engaña al cerebro.',wrong:'Los expertos recomiendan dormir cuatro horas y usar el móvil en la cama.'},
  {t:'Reciclar ayuda a cuidar el planeta. Cuando separamos el papel, el plástico y el vidrio, estos materiales pueden convertirse en productos nuevos, y así se talan menos árboles y se gasta menos energía. Además, se reduce la basura que acaba en los vertederos o en el mar. Pequeños gestos en casa tienen un gran efecto si los hace mucha gente.',
   main:'Reciclar ayuda a cuidar el planeta porque ahorra recursos y reduce la basura.',sec:'Reciclar reduce la basura que llega al mar.',
   bad:['El vidrio es un material transparente.','Reciclar gasta más energía que fabricar productos nuevos.','Los vertederos están lejos de las ciudades.'],
   keys:'reciclar · materiales · recursos · basura',nokeys:['casa · gente · mucha · gran','así · cuando · estos · además','árboles · mar · vidrio · efecto'],title:'Por qué merece la pena reciclar',
   sum:'Separar papel, plástico y vidrio permite fabricar productos nuevos, ahorrar árboles y energía y reducir la basura; si mucha gente lo hace, el efecto es grande.',
   opinion:'Reciclar es un rollo, pero mis padres dicen que hay que hacerlo.',detail:'El vidrio se puede reciclar.',wrong:'Reciclar consiste en tirar toda la basura al mismo contenedor.'},
  {t:'Leer con frecuencia tiene muchos beneficios. Quien lee amplía su vocabulario y escribe con menos faltas de ortografía. La lectura también mejora la concentración y la memoria. Por último, los libros nos permiten viajar a otros lugares y épocas sin movernos de casa.',
   main:'Leer a menudo mejora el lenguaje, la concentración y la imaginación.',sec:'Leer mejora la memoria.',
   bad:['Los libros pesan mucho.','Leer solo sirve para aprobar exámenes.','Las bibliotecas abren por la tarde.'],
   keys:'leer · vocabulario · concentración · viajar',nokeys:['último · otros · sin · casa','quien · también · por · muchos','faltas · épocas · lugares · nos'],title:'Los beneficios de la lectura',
   sum:'Leer con frecuencia amplía el vocabulario, mejora la ortografía, la concentración y la memoria, y nos permite conocer otros lugares y épocas.',
   opinion:'Leer es aburrido, prefiero ver series.',detail:'Leer mejora la ortografía.',wrong:'Leer empeora la memoria y la concentración.'},
  {t:'El agua dulce es un recurso escaso. Aunque el planeta está cubierto de agua, casi toda es salada y no se puede beber. De la poca agua dulce que existe, gran parte está congelada en los polos. Por eso es importante no malgastarla: cerrar el grifo al lavarnos los dientes ahorra muchos litros al día.',
   main:'El agua dulce es escasa, así que debemos ahorrarla.',sec:'Gran parte del agua dulce está congelada en los polos.',
   bad:['El agua del mar es salada.','En el planeta sobra agua potable para todos.','Los dientes hay que lavarlos tres veces al día.'],
   keys:'agua dulce · escasa · polos · ahorrar',nokeys:['aunque · casi · toda · por eso','grifo · dientes · litros · día','planeta · cubierto · gran · parte'],title:'El agua dulce, un tesoro que hay que cuidar',
   sum:'Casi toda el agua del planeta es salada y gran parte de la dulce está helada en los polos; por eso hay que ahorrarla con gestos como cerrar el grifo.',
   opinion:'Me parece fatal que la gente deje el grifo abierto.',detail:'Cerrar el grifo ahorra agua.',wrong:'Casi toda el agua del planeta es dulce y se puede beber.'}
];
const TXT=x=>`<div class="texto">${x.t}</div>`;

const RES_LEVELS=[
{ title:'Idea principal, ideas secundarias y palabras clave', sub:'Encontrar lo importante de un texto',
  lesson:[
    ['La idea principal',`<p>La <span class="hl">idea principal</span> es lo más importante que quiere decir el texto. Si la quitamos, el texto pierde su sentido. Suele estar al principio o al final del párrafo.</p>`],
    ['Las ideas secundarias',`<p>Las <span class="hl">ideas secundarias</span> amplían, explican o dan ejemplos de la idea principal. Ayudan, pero el texto se entendería sin ellas.</p>`],
    ['Las palabras clave',`<p>Las <span class="hl">palabras clave</span> son las que mejor resumen el tema: casi siempre son <b>sustantivos y verbos</b> importantes, no palabras como «además», «muy» o «porque».</p>
     <div class="ex">Truco: subraya solo lo que leerías en voz alta si tuvieras diez segundos para explicar el texto.</div>`],
    ['Error típico',`<div class="ex warn">Elegir un detalle como idea principal</div><p>Un dato llamativo («las abejas producen miel») puede ser verdad y aparecer en el texto, pero no ser lo <b>más importante</b>.</p>`]
  ],
  gens:[
    ()=>{const x=pick(TEXTS);return mc(`${TXT(x)}¿Cuál es la <b>idea principal</b>?`,x.main,[...x.bad.slice(0,2),x.sec],`La idea principal es: «${x.main.replace(/\.$/,'')}». El resto son detalles, ideas que no aparecen o ideas falsas.`)},
    ()=>{const x=pick(TEXTS);return mc(`${TXT(x)}¿Cuál es una <b>idea secundaria</b> del texto?`,x.sec,[x.bad[1],x.bad[2],x.wrong],`«${x.sec.replace(/\.$/,'')}» aparece en el texto y amplía la idea principal.`)},
    ()=>{const x=pick(TEXTS);return mc(`${TXT(x)}¿Qué grupo de <b>palabras clave</b> resume mejor el texto?`,x.keys,x.nokeys,`Las palabras clave son las que recogen el tema: ${x.keys}.`)},
    ()=>{const x=pick(TEXTS),o=TEXTS.filter(y=>y!==x);return mc(`${TXT(x)}¿Cuál es el <b>título</b> más adecuado?`,x.title,shuffle(o).slice(0,3).map(y=>y.title),`Un buen título resume la idea principal: «${x.title}».`)},
    ()=>{const [t,ok,why]=pick([['La idea principal suele estar al principio o al final del párrafo.',true,''],['Las palabras clave suelen ser sustantivos y verbos.',true,''],['Las ideas secundarias son más importantes que la principal.',false,'solo amplían o explican la principal.'],['Palabras como «además» o «porque» son buenas palabras clave.',false,'son enlaces, no dicen de qué trata el texto.']]);
      return mc(`¿Verdadero o falso?<br>«${t}»`,ok?'Verdadero':'Falso',['Verdadero','Falso'],ok?'Es verdadero.':'Es falso: '+why)}
  ]},
{ title:'Cómo se hace un resumen', sub:'Breve, con tus palabras y sin opiniones',
  lesson:[
    ['Los pasos',`<div class="ex">1. Lee el texto entero y entiéndelo → 2. Subraya la idea principal y las palabras clave → 3. Haz un pequeño esquema → 4. Redacta el resumen con tus palabras</div>`],
    ['Las reglas de un buen resumen',`<p>Un resumen debe ser:</p><p>· <b>Breve</b>: más o menos una <span class="hl">cuarta parte</span> del texto original.<br>· <b>Fiel</b>: recoge las ideas del autor, sin añadir nada.<br>· <b>Objetivo</b>: sin opiniones personales («yo creo», «me gusta»).<br>· <b>Redactado con tus palabras</b> y en tercera persona, sin copiar frases enteras.<br>· <b>Ordenado</b>: con la idea principal y las secundarias más importantes.</p>`],
    ['Error típico',`<div class="ex warn">Copiar las primeras frases del texto</div><p>Eso no es resumir: suele quedar demasiado largo y se pierden ideas del final. Un resumen se escribe después de entender <b>todo</b> el texto.</p>`]
  ],
  gens:[
    ()=>{const x=pick(TEXTS);return mc(`${TXT(x)}¿Cuál es el <b>mejor resumen</b>?`,x.sum,[x.opinion,x.detail,x.wrong],`«${x.sum.replace(/\.$/,'')}» es breve, fiel, objetivo y recoge las ideas importantes. Los demás opinan, se quedan en un detalle o cambian el texto.`)},
    ()=>{const x=pick(TEXTS),k=ri(0,2),bad=[x.opinion,x.detail,x.wrong][k],why=['Incluye una opinión personal','Solo recoge un detalle','Dice algo que no aparece en el texto o lo contradice'][k];
      return mc(`${TXT(x)}Este resumen está mal: <b>«${bad}»</b>. ¿Qué falla?`,why,['Incluye una opinión personal','Solo recoge un detalle','Dice algo que no aparece en el texto o lo contradice','Es demasiado objetivo'].filter(w=>w!==why),`${why}.`)},
    ()=>{const w=4*ri(20,120);return num(`Un texto tiene ${w} palabras. Si el resumen debe ocupar más o menos una cuarta parte, ¿cuántas palabras debería tener?`,w/4,`Una cuarta parte de ${w} es ${w} : 4 = ${w/4} palabras.`)},
    ()=>{const [q,a,ws]=pick([['¿Qué se hace primero al resumir un texto?','Leerlo entero hasta entenderlo',['Copiar la primera frase','Escribir tu opinión','Contar las palabras']],['¿En qué persona se escribe un resumen?','En tercera persona',['En primera persona («yo»)','En segunda persona («tú»)','Da igual']],['¿Qué NO debe tener un resumen?','Opiniones personales',['La idea principal','Las ideas secundarias importantes','Palabras clave del texto']]]);
      return mc(q,a,ws,`${a}.`)},
    ()=>{const [t,ok,why]=pick([['Un resumen debe ser más corto que el texto original.',true,''],['En un resumen puedes añadir tu opinión al final.',false,'el resumen es objetivo; la opinión va en un comentario aparte.'],['Para resumir hay que copiar frases enteras del texto.',false,'se redacta con tus propias palabras.'],['Un buen resumen respeta las ideas del autor.',true,'']]);
      return mc(`¿Verdadero o falso?<br>«${t}»`,ok?'Verdadero':'Falso',['Verdadero','Falso'],ok?'Es verdadero.':'Es falso: '+why)}
  ]}
];

/* ---------- animaciones de pizarra ---------- */
const textLines=(n,d0,{x=20,w=220,y0=18,gap=16,hl=-1}={})=>Array.from({length:n},(_,k)=>ln(x,y0+k*gap,x+(k===n-1?w*.6:w),y0+k*gap,d0+k*.18,{c:k===hl?'blue':'',t:.3})).join('');
const COM_ANIMS=[
[
  {say:'Comunicar es transmitir información. Mira: Lucía le escribe un mensaje a Marcos.',show:sk(280,140,person(40,30,0,'Lucía')+person(240,30,.6,'Marcos')+bubble(58,8,164,34,'¿Quedamos a las cinco?',1.2,{s:13})+arrow(80,90,200,90,2.2,'blue'))},
  {say:'Lucía es el emisor, quien envía. Marcos es el receptor, quien recibe. Y lo que le dice es el mensaje.',
   show:sk(280,150,person(40,30,0)+person(240,30,0)+bubble(58,8,164,34,'¿Quedamos a las cinco?',0,{s:13})+tx(40,125,'EMISOR',.8,{c:'red',s:13})+tx(240,125,'RECEPTOR',1.6,{c:'red',s:13})+tx(140,62,'MENSAJE',2.4,{c:'red',s:13}))},
  {say:'Ahora tú: busca el elemento que te piden.',ask:COM_LEVELS[0].gens[0]},
  {say:'El código es el sistema de signos que comparten, aquí el español escrito. El canal es el medio físico por el que viaja: la pantalla del móvil.',
   show:line(at(0,'<b>Código</b> → el español escrito'))+line(at(1.6,'<b>Canal</b> → la pantalla del móvil'))+line(at(3.2,'<b>Contexto</b> → dos amigos organizan la tarde','good'))},
  {say:'No los confundas: el canal es el medio físico y el código, el sistema de signos.',ask:COM_LEVELS[0].gens[3]},
  {say:'En la vida real: el árbitro pita y señala el penalti. Emisor, el árbitro. Receptores, los jugadores. Código, las señales del reglamento. Canal, el aire y la luz.',
   show:real('un partido de fútbol',sk(280,130,person(50,25,0,'árbitro')+ln(63,45,95,20,.8,{c:'red'})+tx(110,18,'¡PIII!',1.2,{s:15})+person(190,30,1.6)+person(235,30,1.9)+tx(212,122,'jugadores',2.3,{s:14})))},
  {say:'¿Qué falla en esta comunicación?',ask:COM_LEVELS[0].gens[2]}
],
[
  {say:'Podemos comunicarnos con palabras, habladas o escritas. Es la comunicación verbal.',show:line(at(0,'Verbal oral → una llamada'))+line(at(1.4,'Verbal escrita → un correo'))},
  {say:'También sin palabras: con gestos, imágenes, colores o sonidos. Es la comunicación no verbal.',show:sk(260,110,circ(60,50,30,0)+circ(50,42,3,.5)+circ(70,42,3,.6)+stroke('M45 60Q60 74 75 60',.8,{t:.3})+box(165,8,36,82,1.4,{t:.5})+circ(183,26,9,1.9,{c:'red'})+circ(183,49,9,2.1)+circ(183,72,9,2.3,{c:'green'})+tx(130,108,'gestos · emoticonos · colores',2.6,{s:14}))+line(at(3,'No verbal: sin palabras','good'))},
  {say:'¿Qué tipo de comunicación es?',ask:COM_LEVELS[1].gens[0]},
  {say:'Los signos pueden ser indicios, como el humo que indica fuego; iconos, que se parecen a lo que representan; o símbolos, que entendemos por acuerdo, como las palabras.',
   show:sk(300,120,stroke('M40 95L60 95M50 95Q35 70 52 55Q48 70 60 62Q62 80 50 95',0,{c:'red',t:.6})+stroke('M50 50Q40 35 55 25Q45 12 58 5',.6,{t:.5})+tx(50,115,'indicio',1.2,{s:14})+stroke('M150 20L180 50L150 80L120 50Z',1.6,{c:'red',t:.6})+stroke('M140 62Q150 30 160 40',2.2,{t:.4})+tx(150,115,'icono',2.6,{s:14})+tx(250,60,'«casa»',3,{s:20})+tx(250,115,'símbolo',3.4,{s:14}))},
  {say:'Clasifica este signo.',ask:COM_LEVELS[1].gens[1]},
  {say:'En la vida real: las señales de tráfico combinan iconos, como el dibujo de un peatón, y símbolos, como el círculo rojo que significa prohibido.',
   show:real('señales de tráfico',sk(240,110,circ(70,55,40,0,{c:'red',t:.6})+person(70,25,.8)+circ(170,55,40,1.6,{c:'red',t:.6})+ln(142,27,198,83,2.2,{c:'red'})+tx(70,108,'icono',2.6,{s:13})+tx(170,108,'símbolo',2.8,{s:13})))},
  {say:'¿Cuál de estos es del tipo que te piden?',ask:COM_LEVELS[1].gens[2]}
],
[
  {say:'Usamos el lenguaje con intenciones distintas. Cada intención es una función del lenguaje.',show:line(seq(['informar','expresar','pedir','comprobar','embellecer','explicar la lengua'].map(t=>`<span class="chip">${t}</span>`),0,.5))},
  {say:'Si informamos de forma objetiva, la función es representativa. Si mostramos lo que sentimos, es expresiva. Si queremos que el otro haga algo, es apelativa.',
   show:line(at(0,'«Hoy hace sol.» → <b>representativa</b>'))+line(at(1.6,'«¡Qué feliz estoy!» → <b>expresiva</b>'))+line(at(3.2,'«Ven aquí.» → <b>apelativa</b>'))},
  {say:'¿Qué función predomina?',ask:COM_LEVELS[2].gens[0]},
  {say:'La fática comprueba que el canal funciona. La poética cuida la forma del mensaje. Y la metalingüística habla de la propia lengua.',
   show:line(at(0,'«¿Me oyes?» → <b>fática</b>'))+line(at(1.4,'«Tres tristes tigres…» → <b>poética</b>'))+line(at(2.8,'«“Mesa” es un sustantivo.» → <b>metalingüística</b>'))},
  {say:'Busca la frase con la función que te piden.',ask:COM_LEVELS[2].gens[1]},
  {say:'En la vida real: los anuncios mezclan funciones. Bebe Frescola, la que mola, quiere que compres, función apelativa, y lo dice con rima, función poética.',
   show:real('la publicidad',sk(240,120,box(30,10,180,90,0,{t:.8})+tx(120,48,'¡Bebe Frescola,',1,{s:20})+tx(120,78,'la que mola!',1.6,{s:20})+tx(120,116,'apelativa + poética',2.4,{s:13,c:'red'})))},
  {say:'¿Qué función predomina en este caso?',ask:COM_LEVELS[2].gens[3]}
]];
const RES_ANIMS=[
[
  {say:'Un texto tiene una idea principal: lo más importante. Las demás ideas la amplían o la explican.',show:sk(260,110,textLines(5,0,{hl:0})+ln(20,24,240,24,1.4,{c:'red',t:.6}))+line(at(1.8,'la idea principal suele ir al principio o al final'))},
  {say:'Las palabras clave son las que mejor resumen el tema. Casi siempre son sustantivos y verbos importantes.',show:line(seq(['abejas','polen','plantas','alimentos'].map(w=>`<span class="chip">${w}</span>`),0,.6))+line(at(2.6,'además · muy · porque → no son clave','bad'))},
  {say:'Lee el texto y busca la idea principal.',ask:RES_LEVELS[0].gens[0]},
  {say:'Cuidado: un detalle llamativo puede ser verdad y no ser lo más importante.',show:line(at(0,'«Las abejas producen miel.»'))+line(at(1.4,'verdad, pero es un detalle','bad'))},
  {say:'Ahora busca las palabras clave.',ask:RES_LEVELS[0].gens[2]},
  {say:'En la vida real: cuando estudias para un examen, subrayar la idea principal y las palabras clave te ahorra tiempo y te ayuda a recordar.',
   show:real('estudiar para un examen',sk(260,120,box(20,8,220,104,0,{t:.7})+textLines(5,.8,{x:35,w:190,y0:28,hl:1})+ln(35,46,225,46,2.2,{c:'red',t:.5})+circ(70,78,14,2.8,{c:'blue'})))},
  {say:'¿Qué título le pondrías?',ask:RES_LEVELS[0].gens[3]}
],
[
  {say:'Para resumir, primero se lee el texto entero, luego se subraya, después se hace un esquema y al final se redacta.',show:line(seq(['1 · leer','2 · subrayar','3 · esquema','4 · redactar'].map(t=>`<span class="chip">${t}</span>`),0,.8))},
  {say:'Un buen resumen es breve: más o menos una cuarta parte del texto. Es fiel, objetivo y está escrito con tus palabras.',show:sk(260,110,box(20,10,100,90,0)+textLines(5,.4,{x:30,w:80,y0:25,gap:15})+arrow(130,55,165,55,1.6,'blue')+box(175,40,50,30,2.2)+ln(183,55,217,55,2.6))+line(at(2.8,'≈ una cuarta parte'))},
  {say:'Elige el mejor resumen.',ask:RES_LEVELS[1].gens[0]},
  {say:'Cuidado con tres errores: dar tu opinión, quedarte en un detalle o cambiar lo que dice el texto.',show:line(at(0,'✗ «Yo creo que…»','bad'))+line(at(1.2,'✗ solo un detalle','bad'))+line(at(2.4,'✗ inventar o cambiar ideas','bad'))},
  {say:'Calcula la longitud del resumen.',ask:RES_LEVELS[1].gens[2]},
  {say:'En la vida real: cuando le cuentas a un amigo una película en un minuto, estás resumiendo. Dices lo importante, en orden y sin contar cada escena.',
   show:real('contar una película',sk(270,120,person(45,25,0,'tú')+bubble(70,5,150,34,'Va de un chico que…',.8)+person(240,25,1.6,'amigo')))},
  {say:'¿Qué falla en este resumen?',ask:RES_LEVELS[1].gens[1]}
]];

export { COM_LEVELS, RES_LEVELS, COM_ANIMS, RES_ANIMS };
