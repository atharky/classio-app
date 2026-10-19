/* ---------- catálogo: materias, módulos y explicaciones animadas ---------- */
import { P, POT_LEVELS, RAI_LEVELS } from './data.js';
import { POT_ANIMS, RAI_ANIMS } from './anim.js';
import { COM_LEVELS, RES_LEVELS, COM_ANIMS, RES_ANIMS } from './lengua.js';
import { LAB_LEVELS, LAB_ANIMS } from './biologia.js';
import { CIE_LEVELS, CIE_ANIMS } from './ciencia.js';
import { TIERRA_LEVELS, TIERRA_ANIMS } from './tierra.js';
import { DIV_LEVELS, DIV_ANIMS } from './divis.js';

const SUBJECTS=[
  {id:'mates',name:'Matemáticas'},
  {id:'lengua',name:'Lengua Castellana y Literatura'},
  {id:'bio',name:'Biología y Geología'}
];

const MODULES=[
  {id:'potencias',subject:'mates',name:'Potencias',sym:P('a','n'),desc:'Qué son, sus propiedades y cómo operar con ellas.',levels:POT_LEVELS,
   exams:[{id:'p1',name:'Examen parcial A',sub:'Niveles 1 a 3',levels:[0,1,2],n:10},{id:'p2',name:'Examen parcial B',sub:'Niveles 4 a 6',levels:[3,4,5],n:10},{id:'pf',name:'Examen final',sub:'Todo el módulo',levels:[0,1,2,3,4,5],n:12}]},
  {id:'raices',subject:'mates',name:'Raíces cuadradas',sym:'√',desc:'Raíces exactas y aproximadas.',levels:RAI_LEVELS,
   exams:[{id:'r1',name:'Examen parcial A',sub:'Niveles 1 a 3',levels:[0,1,2],n:10},{id:'r2',name:'Examen parcial B',sub:'Niveles 4 y 5',levels:[3,4],n:10},{id:'rf',name:'Examen final',sub:'Todo el módulo',levels:[0,1,2,3,4],n:12}]},
  {id:'divis',subject:'mates',name:'Divisibilidad',sym:'m.c.m.',desc:'Múltiplos, divisores, primos, factores, mcd y mcm.',levels:DIV_LEVELS,
   exams:[{id:'d1',name:'Examen parcial A',sub:'Niveles 1 a 3',levels:[0,1,2],n:10},{id:'d2',name:'Examen parcial B',sub:'Niveles 4 a 6',levels:[3,4,5],n:10},{id:'df',name:'Examen final',sub:'Todo el módulo',levels:[0,1,2,3,4,5],n:12}]},
  {id:'enteros',subject:'mates',name:'Números enteros',sym:'ℤ',desc:'Operaciones con signo y recta numérica.',soon:true},
  {id:'comunicacion',subject:'lengua',name:'La comunicación',sym:'E → R',desc:'Elementos de la comunicación, signos y funciones del lenguaje.',levels:COM_LEVELS,
   exams:[{id:'c1',name:'Examen del tema',sub:'Niveles 1 a 3',levels:[0,1,2],n:12}]},
  {id:'resumen',subject:'lengua',name:'El resumen',sym:'¶',desc:'Idea principal, palabras clave y cómo resumir un texto.',levels:RES_LEVELS,
   exams:[{id:'r1',name:'Examen del tema',sub:'Niveles 1 y 2',levels:[0,1],n:10}]},
  {id:'ciencia',subject:'bio',name:'La ciencia y el método científico',sym:'🧪',desc:'Fake news, método científico, Redi, ciencia y pseudociencia y mujeres científicas.',levels:CIE_LEVELS,
   exams:[{id:'c1',name:'Examen parcial A',sub:'Niveles 1 a 3',levels:[0,1,2],n:10},{id:'c2',name:'Examen parcial B',sub:'Niveles 4 y 5',levels:[3,4],n:10},
     {id:'ct',name:'Examen del tema',sub:'Como el examen real: este módulo y Material de laboratorio',levels:[0,1,2,3,4,'laboratorio:0','laboratorio:1','laboratorio:2','laboratorio:3'],n:15}]},
  {id:'tierra',subject:'bio',name:'La Tierra y la geosfera',sym:'🌍',desc:'Un planeta excepcional, los subsistemas terrestres y las capas de la geosfera.',levels:TIERRA_LEVELS,
   exams:[{id:'t1',name:'Examen parcial A',sub:'Niveles 1 y 2',levels:[0,1],n:10},{id:'t2',name:'Examen parcial B',sub:'Niveles 3 y 4',levels:[2,3],n:10},{id:'tt',name:'Examen del tema',sub:'Todo el módulo',levels:[0,1,2,3],n:12}]},
  {id:'laboratorio',subject:'bio',name:'Material de laboratorio',sym:'🔬',desc:'Material de vidrio, instrumentos, microscopio y seguridad.',levels:LAB_LEVELS,
   exams:[{id:'l1',name:'Examen parcial A',sub:'Niveles 1 y 2',levels:[0,1],n:10},{id:'l2',name:'Examen parcial B',sub:'Niveles 3 y 4',levels:[2,3],n:10},{id:'lf',name:'Examen final',sub:'Todo el módulo',levels:[0,1,2,3],n:12}]}
];

const ANIMS={potencias:POT_ANIMS,raices:RAI_ANIMS,comunicacion:COM_ANIMS,resumen:RES_ANIMS,laboratorio:LAB_ANIMS,ciencia:CIE_ANIMS,tierra:TIERRA_ANIMS,divis:DIV_ANIMS};

export { SUBJECTS, MODULES, ANIMS };
