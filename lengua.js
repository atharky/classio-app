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
  Poética:['Verde que te quiero verde.','Tres tristes tigres tragaban trigo.','Por una mirada, un mundo.','Las nubes, algodón del cielo.'],
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
   keys:'reciclar · materiales · energía · basura',nokeys:['casa · gente · mucha · gran','así · cuando · estos · además','árboles · mar · vidrio · efecto'],title:'Por qué merece la pena reciclar',
   sum:'Separar papel, plástico y vidrio permite fabricar productos nuevos, ahorrar árboles y energía y reducir la basura; si mucha gente lo hace, el efecto es grande.',
   opinion:'Reciclar es un rollo, pero mis padres dicen que hay que hacerlo.',detail:'El vidrio se puede reciclar.',wrong:'Reciclar consiste en tirar toda la basura al mismo contenedor.'},
  {t:'Leer con frecuencia tiene muchos beneficios. Quien lee amplía su vocabulario y escribe con menos faltas de ortografía. La lectura también mejora la concentración y la memoria. Por último, los libros nos permiten viajar a otros lugares y épocas sin movernos de casa.',
   main:'Leer a menudo tiene muchos beneficios: mejora el vocabulario, la concentración y la memoria.',sec:'Leer mejora la memoria.',
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
    ['Las reglas de un buen resumen',`<p>Un resumen debe ser:</p><p>· <b>Breve</b>: mucho más corto que el original (en textos largos, más o menos una <span class="hl">cuarta parte</span>).<br>· <b>Fiel</b>: recoge las ideas del autor, sin añadir nada.<br>· <b>Objetivo</b>: sin opiniones personales («yo creo», «me gusta»).<br>· <b>Redactado con tus palabras</b> y en tercera persona, sin copiar frases enteras.<br>· <b>Ordenado</b>: con la idea principal y las secundarias más importantes.</p>`],
    ['Error típico',`<div class="ex warn">Copiar las primeras frases del texto</div><p>Eso no es resumir: suele quedar demasiado largo y se pierden ideas del final. Un resumen se escribe después de entender <b>todo</b> el texto.</p>`]
  ],
  gens:[
    ()=>{const x=pick(TEXTS);return mc(`${TXT(x)}¿Cuál es el <b>mejor resumen</b>?`,x.sum,[x.opinion,x.detail,x.wrong],`«${x.sum.replace(/\.$/,'')}» es breve, fiel, objetivo y recoge las ideas importantes. Los demás opinan, se quedan en un detalle o cambian el texto.`)},
    ()=>{const x=pick(TEXTS),k=ri(0,2),bad=[x.opinion,x.detail,x.wrong][k],why=['Incluye una opinión personal','Solo recoge un detalle','Dice algo que no aparece en el texto o lo contradice'][k];
      return mc(`${TXT(x)}Este resumen está mal: <b>«${bad}»</b>. ¿Qué falla?`,why,['Incluye una opinión personal','Solo recoge un detalle','Dice algo que no aparece en el texto o lo contradice','Es demasiado objetivo'].filter(w=>w!==why&&!(k===0&&w.startsWith('Dice algo'))),`${why}.`)},
    ()=>{const w=4*ri(20,120);return num(`Un texto tiene ${w} palabras. Si el resumen debe ocupar más o menos una cuarta parte, ¿cuántas palabras debería tener?`,w/4,`Una cuarta parte de ${w} es ${w} : 4 = ${w/4} palabras.`)},
    ()=>{const [q,a,ws]=pick([['¿Qué se hace primero al resumir un texto?','Leerlo entero hasta entenderlo',['Copiar la primera frase','Escribir tu opinión','Contar las palabras']],['¿En qué persona se escribe un resumen?','En tercera persona',['En primera persona («yo»)','En segunda persona («tú»)','Da igual']],['¿Qué NO debe tener un resumen?','Opiniones personales',['La idea principal','Las ideas secundarias importantes','Palabras clave del texto']]]);
      return mc(q,a,ws,`${a}.`)},
    ()=>{const [t,ok,why]=pick([['Un resumen debe ser más corto que el texto original.',true,''],['En un resumen puedes añadir tu opinión al final.',false,'el resumen es objetivo; la opinión va en un comentario aparte.'],['Para resumir hay que copiar frases enteras del texto.',false,'se redacta con tus propias palabras.'],['Un buen resumen respeta las ideas del autor.',true,'']]);
      return mc(`¿Verdadero o falso?<br>«${t}»`,ok?'Verdadero':'Falso',['Verdadero','Falso'],ok?'Es verdadero.':'Es falso: '+why)}
  ]}
];

/* ---------- relatos de pizarra ---------- */
const textLines=(n,d0,{x=20,w=220,y0=18,gap=16,hl=-1}={})=>Array.from({length:n},(_,k)=>ln(x,y0+k*gap,x+(k===n-1?w*.6:w),y0+k*gap,d0+k*.18,{c:k===hl?'blue':'',t:.3})).join('');
const tag=(x,y,text,d,c='red')=>tx(x,y,text,d,{s:13,c});
const mobile=(x,y,d,w=44,h=70)=>box(x,y,w,h,d,{t:.5})+ln(x+w/2-6,y+h-7,x+w/2+6,y+h-7,d+.5,{t:.1});
const note=(x,y,d)=>box(x,y,70,50,d,{t:.4})+ln(x+10,y+16,x+60,y+16,d+.5,{t:.15})+ln(x+10,y+28,x+60,y+28,d+.6,{t:.15})+ln(x+10,y+40,x+44,y+40,d+.7,{t:.15});
const radio=(x,y,d)=>box(x,y,80,50,d,{t:.5})+circ(x+22,y+25,12,d+.5)+ln(x+44,y+16,x+70,y+16,d+.7,{t:.15})+ln(x+44,y+28,x+70,y+28,d+.8,{t:.15})+ln(x+60,y,x+72,y-20,d+.9,{t:.2});
const book=(x,y,d)=>stroke(`M${x} ${y}L${x+40} ${y+6}L${x+80} ${y}L${x+80} ${y+50}L${x+40} ${y+56}L${x} ${y+50}Z`,d,{t:.6})+ln(x+40,y+6,x+40,y+56,d+.6,{t:.2});
const semaforo=(x,y,d)=>box(x,y,26,62,d,{t:.4})+circ(x+13,y+14,7,d+.4,{c:'red'})+circ(x+13,y+31,7,d+.5)+circ(x+13,y+48,7,d+.6,{c:'green'});
const fig=(svg,cap,d)=>`<figure class="instfig">${svg}<figcaption>${at(d,cap)}</figcaption></figure>`;
// Lucía y Marcos, siempre en el mismo sitio de la pizarra.
const pair=d=>person(40,40,d)+person(250,40,d);

const COM_ANIMS=[
[ // La pandilla organiza la tarde
  {say:'Esta tarde, Lucía quiere quedar con su amigo Marcos. Coge el móvil y le escribe: ¿quedamos a las cinco?',
   show:sk(290,140,person(40,40,0,'Lucía')+mobile(70,44,.9)+bubble(110,6,164,32,'¿Quedamos a las cinco?',1.6,{s:13})+person(255,58,2.6,'Marcos'))},
  {say:'El mensaje viaja hasta Marcos. Lucía es el emisor, quien lo envía. Marcos es el receptor, quien lo recibe. Y la propuesta de quedar es el mensaje.',
   show:sk(290,145,pair(0)+bubble(70,2,150,30,'¿Quedamos a las cinco?',0,{s:12})+arrow(70,70,220,70,.6,'blue')+tag(40,126,'EMISOR',1.4)+tag(250,126,'RECEPTOR',2)+tag(145,60,'MENSAJE',2.6))},
  {say:'Ahora tú: busca ese elemento en otra situación.',ask:COM_LEVELS[0].gens[0]},
  {say:'Para entenderse usan el mismo código, el español escrito. El mensaje viaja por un canal, la pantalla del móvil. Y el contexto es la situación: dos amigos que organizan la tarde.',
   show:sk(300,130,tx(50,62,'Aa',0,{s:36})+tag(50,104,'código',.6)+tag(50,122,'el español',.9,'blue')+mobile(128,14,1.4)+tag(150,104,'canal',2)+tag(150,122,'la pantalla',2.3,'blue')
     +circ(250,48,28,2.8)+ln(250,48,250,28,3.2,{t:.2})+ln(250,48,264,56,3.3,{t:.2})+tag(250,104,'contexto',3.6)+tag(250,122,'organizar la tarde',3.9,'blue'))},
  {say:'Marcos contesta: ¡vale! Ahora él es el emisor y Lucía, la receptora. El emisor y el receptor pueden intercambiar sus papeles.',
   show:sk(290,145,pair(0)+bubble(188,2,74,30,'¡Vale!',.4,{s:15})+arrow(220,70,70,70,1,'red')+tag(40,126,'RECEPTORA',1.8)+tag(250,126,'EMISOR',2.4))},
  {say:'Su amiga Ana lee la conversación y dice: el canal es el español. ¡Error! El español es el código. El canal es el medio físico: aquí, la pantalla.',
   show:sk(290,110,person(40,30,0,'Ana')+bubble(70,4,180,30,'El canal es el español',.6,{s:13})+ln(80,19,240,19,1.8,{c:'red',t:.4}))+line(at(2.4,'canal → la pantalla · código → el español','good'))},
  {say:'No los confundas: ¿cuál es el canal y cuál el código?',ask:COM_LEVELS[0].gens[3]},
  {say:'En la vida real: el sábado la pandilla va al fútbol. El árbitro pita un penalti: él es el emisor, los jugadores los receptores y el código, las señales del reglamento.',
   show:real('un partido de fútbol',sk(280,130,person(50,25,0,'árbitro')+ln(63,45,95,20,.8,{c:'red'})+tx(110,18,'¡PIII!',1.2,{s:15})+person(190,30,1.6)+person(235,30,1.9)+tx(212,122,'jugadores',2.3,{s:14})))},
  {say:'¿Qué falla en esta comunicación?',ask:COM_LEVELS[0].gens[2]}
],
[ // El camino de Marcos al instituto
  {say:'Por la mañana, la madre de Marcos le dice: ¡coge el paraguas! Y le deja una nota en la nevera. Las dos usan palabras: es comunicación verbal, oral y escrita.',
   show:sk(290,140,person(40,40,0,'madre')+bubble(58,4,150,30,'¡Coge el paraguas!',.8,{s:13})+note(205,56,1.8)+tag(130,72,'verbal oral',2.6)+tag(240,128,'verbal escrita',3))},
  {say:'De camino, un amigo le saluda levantando el pulgar. No dice nada, pero Marcos lo entiende: es comunicación no verbal, con gestos.',
   show:sk(290,130,person(60,30,0,'Marcos')+person(220,30,.6,'amigo')+tx(250,48,'👍',1.4,{s:26})+tag(145,40,'sin palabras',2.2))},
  {say:'¿Qué tipo de comunicación es esta?',ask:COM_LEVELS[1].gens[0]},
  {say:'Marcos mira al cielo: nubes negras. Nadie se lo ha dicho, pero sabe que va a llover. Las nubes son un indicio: tienen una relación natural con la lluvia.',
   show:sk(260,130,stroke('M90 70Q70 70 72 54Q74 38 94 42Q100 22 124 24Q148 22 156 42Q176 38 180 56Q182 70 162 70Z',0,{t:.8})+ln(100,80,94,96,1,{c:'blue',t:.15})+ln(128,80,122,96,1.2,{c:'blue',t:.15})+ln(156,80,150,96,1.4,{c:'blue',t:.15})+tag(130,122,'indicio → va a llover',2.2))},
  {say:'En el paso de peatones, la señal muestra a una persona caminando: se parece a lo que representa, es un icono. El semáforo en rojo significa que hay que parar porque lo hemos acordado: es un símbolo.',
   show:sk(290,140,box(30,18,80,82,0,{c:'blue',t:.6})+person(70,34,.7)+tag(70,126,'icono',1.6)+semaforo(190,24,2)+tag(203,126,'símbolo',2.8))},
  {say:'En una tienda, un cartel tiene el dibujo de un teléfono y la palabra teléfono. El dibujo se parece a un teléfono: es un icono. La palabra no se parece: es un símbolo.',
   show:sk(290,130,box(20,10,250,90,0,{t:.6})+stroke('M50 40Q50 30 60 30L66 30L70 44L62 48Q66 60 76 66L82 58L94 62L94 70Q94 80 84 80Q50 76 50 40Z',.8,{t:.6})+tx(190,62,'TELÉFONO',1.6,{s:22})+tag(72,122,'icono',2.4)+tag(190,122,'símbolo',2.8))},
  {say:'Clasifica este signo.',ask:COM_LEVELS[1].gens[1]},
  {say:'En la vida real: en un mensaje de móvil mezclas de todo. Las palabras escritas son símbolos, y los emoticonos con caras, que se parecen a lo que expresan, son iconos.',
   show:real('los mensajes del móvil',sk(260,120,box(90,4,80,110,0,{t:.6})+tx(130,40,'¡Hola!',1,{s:16})+tx(130,76,'😀',1.6,{s:26})+tag(42,44,'símbolo',2.2,'blue')+tag(218,80,'icono',2.6,'blue')))},
  {say:'¿Cuál de estos es del tipo que te piden?',ask:COM_LEVELS[1].gens[2]}
],
[ // Un día de Ana
  {say:'Ana desayuna con la radio puesta. La locutora dice: hoy lloverá en el norte. Informa de forma objetiva: es la función representativa.',
   show:sk(290,120,radio(26,50,0)+bubble(126,8,154,32,'Hoy lloverá en el norte',1,{s:12})+tag(203,94,'representativa',2.2))},
  {say:'En el recreo, Ana ve su nota y grita: ¡qué alegría, he aprobado! Expresa lo que siente. Es la función expresiva, centrada en el emisor.',
   show:sk(290,130,person(50,40,0,'Ana')+bubble(70,4,190,32,'¡Qué alegría, he aprobado!',.8,{s:12})+tag(165,86,'expresiva',2))},
  {say:'¿Qué función predomina?',ask:COM_LEVELS[2].gens[0]},
  {say:'En clase, la profesora pide: ¡cerrad la ventana! Quiere que hagan algo: función apelativa. Ojo: aunque lleve exclamaciones, una orden no es expresiva.',
   show:sk(290,130,person(50,40,0,'profesora')+bubble(70,4,190,32,'¡Cerrad la ventana!',.8,{s:14})+tag(165,72,'apelativa ✓',2,'green')+tag(165,96,'expresiva ✗',2.6))},
  {say:'Por la tarde, Ana llama a su abuela y se oye mal: ¿me oyes? ¿hola? Solo comprueba que el canal funciona. Es la función fática.',
   show:sk(290,120,person(40,30,0,'Ana')+bubble(62,2,130,30,'¿Me oyes? ¿Hola?',.6,{s:12})+stroke('M110 70L140 60L160 80L190 68',1.6,{c:'red',t:.4})+person(250,30,2.2,'abuela')+tag(150,112,'fática',2.8))},
  {say:'¿Qué frase tiene la función que te piden?',ask:COM_LEVELS[2].gens[1]},
  {say:'Antes de dormir, Ana lee un poema que cuida la forma: es la función poética. Y al hacer los deberes pregunta cómo se escribe hierba: función metalingüística.',
   show:`<div class="row instrow">${fig(sk(110,90,book(15,15,0),'inst'),'poética',1)}${fig(sk(110,90,tx(55,52,'¿hierba?',1.6,{s:18}),'inst'),'metalingüística',2.4)}</div>`},
  {say:'En la vida real: en la tele, Ana ve un anuncio. Bebe Frescola, la que mola. Quiere que lo compre, función apelativa, y lo dice con rima, función poética.',
   show:real('la publicidad',sk(240,120,box(30,10,180,90,0,{t:.8})+tx(120,48,'¡Bebe Frescola,',1,{s:20})+tx(120,78,'la que mola!',1.6,{s:20})+tx(120,116,'apelativa + poética',2.4,{s:13,c:'red'})))},
  {say:'¿Qué función predomina en este caso?',ask:COM_LEVELS[2].gens[3]}
]];

// La hoja de Carla: el mismo texto se va subrayando de un recuadro a otro.
const page=(d,extra='')=>sk(290,150,box(20,10,250,110,d,{t:.6})+textLines(6,d,{x:35,w:220,y0:30,gap:15})+extra);
const RES_ANIMS=[
[ // Carla prepara el examen
  {say:'Carla tiene mañana examen de ciencias. Su profesora le ha dado un texto sobre las abejas. Primero lo lee entero, sin subrayar nada, para entenderlo.',
   show:sk(290,130,person(40,40,0,'Carla')+box(90,10,180,110,.8,{t:.6})+textLines(6,1.4,{x:105,w:150,y0:30,gap:15}))},
  {say:'Después busca la idea principal: lo más importante, lo que si se quita deja al texto sin sentido. La subraya: las abejas son imprescindibles porque polinizan.',
   show:page(0,ln(35,33,255,33,.8,{c:'blue',t:.6})+tag(145,140,'idea principal',1.6,'blue'))},
  {say:'Lee el texto y busca tú la idea principal.',ask:RES_LEVELS[0].gens[0]},
  {say:'Las otras frases amplían o explican la principal: son ideas secundarias, como que las abejas producen miel y cera. Carla las marca con otro color.',
   show:page(0,ln(35,33,255,33,0,{c:'blue',t:.6})+ln(35,63,255,63,.8,{c:'green',t:.5})+ln(35,93,255,93,1.4,{c:'green',t:.5})+tag(145,140,'ideas secundarias',2,'green'))},
  {say:'Su amigo Leo subraya como idea principal que las abejas producen miel. Es verdad, pero es solo un detalle: el texto no trata de eso.',
   show:sk(290,130,person(40,40,0,'Leo')+bubble(62,6,200,32,'Lo importante: dan miel',.8,{s:13})+ln(72,22,252,22,2,{c:'red',t:.4})+tag(165,86,'es solo un detalle',2.6))},
  {say:'Por último, Carla rodea las palabras clave: abejas, polen, plantas, alimentos. Son sustantivos importantes, no palabras como además o porque.',
   show:line(seq(['abejas','polen','plantas','alimentos'].map(w=>`<span class="chip">${w}</span>`),0,.6))+line(at(2.8,'además · muy · porque → no son clave','bad'))},
  {say:'¿Qué palabras clave elegirías?',ask:RES_LEVELS[0].gens[2]},
  {say:'En la vida real: cuando lees una noticia o un folleto, buscar la idea principal te dice en segundos de qué trata y si te interesa seguir leyendo.',
   show:real('leer una noticia',sk(260,120,box(60,6,140,108,0,{t:.6})+tx(130,30,'NOTICIA',.8,{s:14})+textLines(4,1.2,{x:75,w:110,y0:50,gap:15,hl:0})))},
  {say:'¿Qué título le pondrías al texto?',ask:RES_LEVELS[0].gens[3]}
],
[ // Carla escribe el resumen
  {say:'Con el texto subrayado, Carla ya ha hecho los dos primeros pasos: leer y subrayar. Ahora toca el tercero, el esquema, y después redactar.',
   show:line(seq(['<span class="chip">1 · leer ✓</span>','<span class="chip">2 · subrayar ✓</span>','<span class="chip">3 · esquema</span>','<span class="chip">4 · redactar</span>'],0,.8))},
  {say:'En el esquema pone arriba la idea principal y debajo, unidas con flechas, las ideas secundarias más importantes.',
   show:sk(290,130,box(85,6,120,34,0,{c:'blue',t:.5})+tx(145,28,'polinizan',.5,{s:15})+arrow(120,42,70,84,1)+arrow(170,42,220,84,1.3)+box(20,88,100,34,1.6,{t:.4})+tx(70,110,'miel y cera',2,{s:14})+box(170,88,100,34,2.2,{t:.4})+tx(220,110,'alimentos',2.6,{s:14}))},
  {say:'¿Qué se hace en cada paso?',ask:RES_LEVELS[1].gens[3]},
  {say:'Ahora redacta: con sus palabras, en tercera persona y sin dar su opinión. El resumen es mucho más corto que el texto original.',
   show:sk(260,110,box(20,10,100,90,0)+textLines(5,.4,{x:30,w:80,y0:25,gap:15})+arrow(130,55,165,55,1.6,'blue')+box(175,40,50,30,2.2)+ln(183,55,217,55,2.6))+line(at(2.8,'mucho más corto'))},
  {say:'Calcula cuánto debe ocupar un resumen.',ask:RES_LEVELS[1].gens[2]},
  {say:'Leo, en cambio, copia las primeras frases del texto: le queda largo y se pierde el final. Además añade: me encantan las abejas. Eso es una opinión.',
   show:sk(290,140,person(40,40,0,'Leo')+box(90,8,180,124,.8,{t:.6})+textLines(6,1.2,{x:105,w:150,y0:28,gap:15})+tx(180,124,'«Me encantan…»',2.4,{s:13,c:'red'})+ln(96,14,264,128,3,{c:'red',t:.5}))},
  {say:'¿Qué falla en este resumen?',ask:RES_LEVELS[1].gens[1]},
  {say:'En la vida real: cuando le cuentas a un amigo una película en un minuto, estás resumiendo: dices lo importante, en orden y sin contar cada escena.',
   show:real('contar una película',sk(270,120,person(45,25,0,'tú')+bubble(70,5,150,34,'Va de un chico que…',.8)+person(240,25,1.6,'amigo')))},
  {say:'Elige el mejor resumen.',ask:RES_LEVELS[1].gens[0]}
]];

export { COM_LEVELS, RES_LEVELS, COM_ANIMS, RES_ANIMS };
