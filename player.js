import { pick } from './data.js';
import { hydrateStyles } from './inline.js';
import { PRAISE, answered, isRight, lockQ, qBody, resetQ, rightText, wireQ } from './question.js';
import { at, dot, sk, stroke, tx } from './sketch.js';

/* ---------- explicación animada con audio ---------- */
let animStop=null;
export function stopAnim(){if(animStop){animStop();animStop=null}}
let soundOn=(()=>{try{return localStorage.getItem('mates1eso.sound')!=='off'}catch(e){return true}})();
const tts=window.speechSynthesis||null;
tts&&tts.getVoices(); // Chrome carga las voces de forma diferida
const esVoice=()=>{const vs=tts?tts.getVoices():[];return vs.find(v=>/^es[-_]ES/i.test(v.lang))||vs.find(v=>/^es\b/i.test(v.lang))||null};

/* ---------- storytelling en pizarra ----------
   Cada paso se dibuja en un recuadro nuevo de una pizarra grande que conserva los anteriores.
   La cámara viaja de un recuadro al siguiente mientras se traza la flecha que los une, los trazos
   de cada paso se reparten a lo largo de su narración y al final se ve la historia completa. */
const REDUCED=Boolean(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const SWOOP=900,COLS=3; // ms del viaje de cámara · recuadros por fila (en zigzag)
const QUESTION_MARK=sk(160,132,stroke('M58 40Q58 14 81 14Q104 14 104 37Q104 53 85 61Q80 64 80 80',0,{c:'blue',t:1})+dot(80,98,6,1,'blue')+tx(80,128,'Tu turno',1.3,{s:17}),'qmark');
// La pregunta también se escribe en la pizarra (sin dibujos ni textos largos), para que la historia se entienda al verla entera.
const questionScene=q=>`<div class="qscene">${QUESTION_MARK}<div class="qtext">${at(1,q.prompt.replace(/<svg[\s\S]*?<\/svg>|<div class="texto">[\s\S]*?<\/div>/g,'').replace(/<br>/g,' '))}</div></div>`;
const stamp=(ok,html)=>`<div class="stamp">${sk(64,52,stroke(ok?'M8 28L24 44L56 8':'M12 10L52 42M52 10L12 42',0,{c:ok?'green':'red',t:.5}),'mark')}${at(.5,html,ok?'good':'')}</div>`;
// Narración y trazo: cuánto debería durar el paso para que el dibujo acompañe a la voz.
const sayTime=text=>Math.max(2.5,text.length*.065);
function pace(f,offset,text){let nat=0;
  f.querySelectorAll('.fc [style*="--d"]').forEach(e=>{const st=e.getAttribute('style'),d=parseFloat((st.match(/--d:\s*([\d.]+)/)||[])[1])||0,t=parseFloat((st.match(/--t:\s*([\d.]+)/)||[])[1])||.4;nat=Math.max(nat,d+t)});
  const k=nat?Math.min(2.6,Math.max(.8,sayTime(text)*.8/nat)):1;
  f.style.setProperty('--k',k.toFixed(2));f.style.setProperty('--o',offset.toFixed(2)+'s')}

export function animPlayer(root,steps){
  let idx=0,playing=false,started=false,pending=false,ended=false,userPaused=false,token=0,timer=null,watchdog=null,audio=null,cam=null,camAnim=null,drift=null,G=null;
  root.innerHTML=`<section class="card anim stack" aria-label="Explicación animada">
    <div class="qhead"><h3>Explicación animada</h3><span class="dots" id="a-dots"></span></div>
    <div class="stage" id="a-stage"><div class="board" id="a-board"><svg class="sk links" id="a-links" aria-hidden="true"></svg></div></div>
    <p class="caption" id="a-cap"></p>
    <div id="a-q"></div>
    <div class="row"><button class="btn" type="button" id="a-play">▶ Empezar</button><button class="btn ghost" type="button" id="a-again">↺ Repetir paso</button><button class="btn ghost" type="button" id="a-next">Siguiente →</button></div>
    <div class="row"><button class="link" type="button" id="a-sound"></button><span class="hint" id="a-note"></span></div></section>`;
  const el=id=>root.querySelector('#'+id),stage=el('a-stage'),board=el('a-board'),links=el('a-links'),qp=el('a-q'),cap=el('a-cap'),play=el('a-play'),next=el('a-next'),again=el('a-again'),snd=el('a-sound'),note=el('a-note');
  const frames=[];

  /* geometría: cada recuadro ocupa la pizarra visible; la cámara transforma la pizarra entera */
  const geom=()=>{const W=stage.clientWidth||320,H=Math.round(Math.min(340,Math.max(260,W*.62)));return {W,H,gap:Math.round(W*.22)}};
  const pos=i=>{const row=Math.floor(i/COLS),c=i%COLS,col=row%2?COLS-1-c:c;return {x:col*(G.W+G.gap),y:row*(G.H+G.gap)}};
  const centerOf=i=>{const p=pos(i);return {cx:p.x+G.W/2,cy:p.y+G.H/2,s:1}};
  const camT=c=>`translate(${(G.W/2-c.cx*c.s).toFixed(1)}px,${(G.H/2-c.cy*c.s).toFixed(1)}px) scale(${c.s.toFixed(3)})`;
  // Dónde mira la cámara ahora mismo (también a mitad de un viaje o de un acercamiento), para seguir sin saltos.
  const readCam=()=>{const m=new DOMMatrixReadOnly(getComputedStyle(board).transform);return {s:m.a,cx:(G.W/2-m.e)/m.a,cy:(G.H/2-m.f)/m.a}};
  function stopCam(){const now=cam&&readCam();if(camAnim){camAnim.cancel();camAnim=null}if(drift){drift.cancel();drift=null}return now}
  // Mueve la cámara; con viaje, se aleja a mitad de camino y vuelve a acercarse. Devuelve lo que tarda (s).
  function moveCam(to,travel){const from=stopCam();
    const same=from&&Math.abs(from.cx-to.cx)<1&&Math.abs(from.cy-to.cy)<1&&Math.abs(from.s-to.s)<.06;cam=to;board.style.transform=camT(to);
    if(!travel||same||!from||REDUCED||!board.animate)return 0;
    const mid={cx:(from.cx+to.cx)/2,cy:(from.cy+to.cy)/2,s:Math.min(from.s,to.s)*.62};
    camAnim=board.animate([{transform:camT(from)},{transform:camT(mid),offset:.5},{transform:camT(to)}],{duration:SWOOP,easing:'ease-in-out'});
    camAnim.onfinish=()=>{camAnim=null};return SWOOP/1000}
  // Mientras se narra, la cámara se acerca despacio: la pizarra nunca está quieta del todo.
  function slowZoom(seconds,delay){if(REDUCED||!board.animate)return;
    drift=board.animate([{transform:camT(cam)},{transform:camT({...cam,s:cam.s*1.05})}],{duration:seconds*1000,delay:delay*1000,easing:'ease-out',fill:'forwards'})}
  function overview(){const ps=frames.map((f,i)=>f&&pos(i)).filter(Boolean),x0=Math.min(...ps.map(p=>p.x)),y0=Math.min(...ps.map(p=>p.y)),x1=Math.max(...ps.map(p=>p.x))+G.W,y1=Math.max(...ps.map(p=>p.y))+G.H;
    board.classList.add('overview');moveCam({cx:(x0+x1)/2,cy:(y0+y1)/2,s:Math.min(1,G.W*.94/(x1-x0),G.H*.94/(y1-y0))},true)}

  /* recuadros y flechas que los unen */
  function linkSvg(k,done){const a=pos(k-1),b=pos(k),{W,H}=G,cls=done?'done':'',t=(SWOOP/1000*.85).toFixed(2);let x1,y1,x2,y2,qx,qy;
    if(a.y===b.y){const r=b.x>a.x;y1=y2=a.y+H/2;x1=r?a.x+W+8:a.x-8;x2=r?b.x-8:b.x+W+8;qx=(x1+x2)/2;qy=y1-G.gap*.35}
    else{x1=x2=a.x+W/2;y1=a.y+H+8;y2=b.y-8;qx=x1+G.gap*.35;qy=(y1+y2)/2}
    const ang=Math.atan2(y2-qy,x2-qx),h=12,p=s=>`${(x2-h*Math.cos(ang+s)).toFixed(1)} ${(y2-h*Math.sin(ang+s)).toFixed(1)}`;
    return `<path class="dr blue ${cls}" pathLength="1" data-s="--d:0;--t:${t}s" d="M${x1} ${y1}Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x2} ${y2}"/>`
      +`<path class="dr blue ${cls}" pathLength="1" data-s="--d:${t};--t:.2s" d="M${p(.5)}L${x2} ${y2}L${p(-.5)}"/>`}
  function sizeLinks(){const n=frames.length,rows=Math.ceil(n/COLS)||1;links.setAttribute('width',COLS*(G.W+G.gap));links.setAttribute('height',rows*(G.H+G.gap))}
  function place(k){const p=pos(k);Object.assign(frames[k].style,{left:p.x+'px',top:p.y+'px',width:G.W+'px',height:G.H+'px'})}
  function frameAt(k){if(frames[k])return frames[k];
    const f=document.createElement('div');f.className='frame';f.setAttribute('role','group');f.setAttribute('aria-label',`Paso ${k+1}`);f.innerHTML=`<span class="fnum" aria-hidden="true">${k+1}</span><div class="fc"></div>`;
    const go=()=>{if(ended){started=true;show(k,true)}};f.onclick=go;f.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}};
    board.appendChild(f);frames[k]=f;place(k);sizeLinks();
    if(k>0&&frames[k-1]){links.insertAdjacentHTML('beforeend',linkSvg(k));hydrateStyles(links)}return f}
  // Encoge el contenido si no cabe en el recuadro.
  function fit(f){const fc=f.querySelector('.fc');fc.style.transform='';const s=Math.min(1,(G.W-20)/fc.scrollWidth,(G.H-20)/fc.scrollHeight);if(s<1)fc.style.transform=`scale(${s.toFixed(3)})`}
  function relayout(){stopCam();G=geom();stage.style.height=G.H+'px';frames.forEach((f,k)=>{if(f){place(k);fit(f)}});sizeLinks();
    links.innerHTML=frames.map((f,k)=>k>0&&f&&frames[k-1]?linkSvg(k,true):'').join('');hydrateStyles(links);
    ended?overview():moveCam(centerOf(idx),false)}

  function silence(){token++;clearTimeout(timer);clearTimeout(watchdog);if(tts)tts.cancel();if(audio){audio.pause();audio=null}}
  // Narra el texto (grabación si existe, si no la voz del navegador) y llama a done al acabar.
  // Sin sonido o sin voz en español se espera un tiempo proporcional al texto, para leer los subtítulos.
  function speak(text,src,done){silence();const t=token,wait=sayTime(text)*1000;
    const finish=()=>{if(t!==token)return;clearTimeout(timer);clearTimeout(watchdog);done&&done()};
    const v=soundOn&&!src&&esVoice();
    if(soundOn&&src){audio=new Audio(src);audio.onended=finish;audio.onerror=()=>{timer=setTimeout(finish,wait)};audio.play().catch(audio.onerror)}
    else if(v){const u=new SpeechSynthesisUtterance(text);u.voice=v;u.lang=v.lang;u.rate=.95;u.onend=finish;u.onerror=finish;tts.speak(u);watchdog=setTimeout(finish,wait*2+3000)}
    else timer=setTimeout(finish,wait)}
  function paintControls(){
    play.textContent=ended?'↺ Ver otra vez':playing?'Pausar':started?'▶ Continuar':'▶ Empezar';
    next.disabled=pending||ended;again.disabled=ended;
    board.classList.toggle('paused',userPaused);board.getAnimations().forEach(a=>userPaused?a.pause():a.play());
    frames.forEach(f=>f&&(ended?f.setAttribute('tabindex','0'):f.removeAttribute('tabindex')));
    snd.textContent=soundOn?'🔊 Sonido activado':'🔇 Sonido desactivado';snd.setAttribute('aria-pressed',String(soundOn));
    note.textContent=soundOn&&!tts?'Tu navegador no permite audio: sigue los subtítulos.':soundOn&&tts&&tts.getVoices().length&&!esVoice()?'Tu navegador no tiene voz en español: sigue los subtítulos.':'';
    el('a-dots').innerHTML=steps.map((s,k)=>`<i class="${ended||k<idx?'ok':k===idx?'cur':''}"></i>`).join('')}
  function show(k,force){idx=k;ended=false;userPaused=false;const s=steps[k];cap.textContent=s.say;pending=Boolean(s.ask);
    board.classList.remove('overview');
    const f=frameAt(k),q=s.ask&&s.ask();
    // Al salir de un recuadro su dibujo se completa al instante: la historia nunca queda a medias.
    frames.forEach(x=>{if(x){x.classList.toggle('on',x===f);x.classList.toggle('done',x!==f)}});
    f.querySelector('.fc').innerHTML=q?questionScene(q):s.show; // repintar reinicia las animaciones CSS
    hydrateStyles(f);
    fit(f);const o=moveCam(centerOf(k),true);pace(f,o,s.say);slowZoom(sayTime(s.say)+2,o);
    qp.innerHTML='';if(q)askStep(q,f);
    if(playing||force)speak(s.say,s.audio,s.ask||!playing?null:advance);
    paintControls()}
  function advance(){idx+1<steps.length?show(idx+1):end()}
  function end(){const wasPlaying=playing;playing=false;pending=false;ended=true;userPaused=false;qp.innerHTML='';
    frames.forEach(f=>{if(f){f.classList.remove('on');f.classList.add('done')}});links.querySelectorAll('path').forEach(x=>x.classList.add('done'));overview();
    cap.textContent='¡Fin! Esta es toda la historia: toca un recuadro para repasarlo o haz la prueba del nivel.';
    wasPlaying?speak('¡Fin de la explicación! Aquí tienes toda la historia. Ahora puedes hacer la prueba del nivel.',null,null):silence();paintControls()}
  function askStep(q,f){let tries=0;
    qp.innerHTML=`<div class="stack aq"><div class="prompt">${q.prompt}</div><div id="a-qb">${qBody(q)}</div><div id="a-fb" aria-live="polite"></div>
      <div class="row"><button class="btn" type="button" id="a-check" disabled>Comprobar</button></div></div>`;
    const qb=qp.querySelector('#a-qb'),btn=qp.querySelector('#a-check'),fb=qp.querySelector('#a-fb');
    wireQ(qb,q,()=>{if(pending)btn.disabled=!answered(q)});
    const inp=qb.querySelector('#ans');if(inp)inp.onkeydown=e=>{if(e.key==='Enter'&&!btn.disabled)btn.click()};
    btn.onclick=()=>{if(!pending){advance();return}
      tries++;const ok=isRight(q);
      if(ok||tries>=2){pending=false;lockQ(qb,q,ok);const v=ok?pick(PRAISE):`La respuesta es ${rightText(q)}.`;
        fb.innerHTML=`<div class="fb ${ok?'ok':'ko'}"><span class="v">${v}</span>${q.explain}</div>`;
        // La respuesta queda escrita en la pizarra, como parte de la historia.
        const fc=f.querySelector('.fc');fc.insertAdjacentHTML('beforeend',stamp(ok,ok?rightText(q):'Solución: '+rightText(q)));hydrateStyles(fc);f.style.setProperty('--o','0s');f.style.setProperty('--k','1');fit(f);
        btn.textContent=idx+1<steps.length?'Continuar':'Terminar';btn.focus();
        speak(ok?v:'Fíjate en la explicación.',null,null);paintControls()}
      else{fb.innerHTML=`<div class="fb ko"><span class="v">Casi. Inténtalo otra vez.</span>${q.hint||'Repasa lo que acabas de ver.'}</div>`;
        resetQ(qb,q);
        btn.disabled=true;speak('Casi. Inténtalo otra vez.',null,null)}}}
  play.onclick=()=>{started=true;if(ended){playing=true;show(0);return}
    if(playing){playing=false;userPaused=true;silence();paintControls();return}
    playing=true;userPaused=false;pending?(speak(steps[idx].say,steps[idx].audio,null),paintControls()):show(idx)};
  again.onclick=()=>show(idx,true);
  next.onclick=()=>{if(!pending)advance()};
  snd.onclick=()=>{soundOn=!soundOn;try{localStorage.setItem('mates1eso.sound',soundOn?'on':'off')}catch(e){}
    if(playing&&!pending)show(idx);else{if(!soundOn)silence();paintControls()}};
  if(tts)tts.onvoiceschanged=paintControls;
  const ro=window.ResizeObserver?new ResizeObserver(()=>{const w=stage.clientWidth;if(G&&w&&w!==G.W)relayout()}):null;
  ro&&ro.observe(stage);
  animStop=()=>{playing=false;silence();if(G)stopCam();ro&&ro.disconnect();if(tts)tts.onvoiceschanged=null};
  G=geom();stage.style.height=G.H+'px';
  show(0)}

