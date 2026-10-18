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
// Persona esquemática (cabeza, cuerpo, brazos y piernas) con su nombre debajo.
const person=(x,y,d,name='',c='')=>circ(x,y,9,d,{c})+ln(x,y+9,x,y+38,d+.25,{c,t:.2})+ln(x-13,y+20,x+13,y+20,d+.4,{c,t:.2})+ln(x,y+38,x-10,y+56,d+.55,{c,t:.15})+ln(x,y+38,x+10,y+56,d+.65,{c,t:.15})+(name?tx(x,y+74,name,d+.8,{s:14}):'');
const ell=(cx,cy,rx,ry,d,o={})=>`<ellipse class="dr ${o.c||''}" pathLength="1" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" style="--d:${f1(d)};--t:${o.t||.4}s"/>`;
// Bocadillo de diálogo con texto dentro.
const bubble=(x,y,w,h,text,d,o={})=>box(x,y,w,h,d,{t:.5,c:o.c})+ln(x+18,y+h,x+10,y+h+12,d+.4,{t:.15,c:o.c})+tx(x+w/2,y+h/2+5,text,d+.6,{s:o.s||14});
// Flecha que señala un punto (x2,y2) desde (x1,y1), en cualquier dirección.
const pointer=(x1,y1,x2,y2,d,c='red')=>{const a=Math.atan2(y2-y1,x2-x1),h=9,p=(s)=>[f1(x2-h*Math.cos(a+s)),f1(y2-h*Math.sin(a+s))];const [ax,ay]=p(.5),[bx,by]=p(-.5);
  return ln(x1,y1,x2,y2,d,{c})+ln(x2,y2,ax,ay,d+.3,{c,t:.12})+ln(x2,y2,bx,by,d+.35,{c,t:.12})};

export { plain, at, seq, line, lab, strike, real, J, f1, sk, stroke, ln, box, circ, fill, dot, tx, arrow, grid, dots, person, ell, bubble, pointer };
