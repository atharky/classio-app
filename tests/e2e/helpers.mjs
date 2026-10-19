export const KEY='mates1eso.v1';
export const state=(best,unlocked,exams={})=>JSON.stringify({v:2,mods:{potencias:{unlocked,best}},exams,open:false});
/* Voz del navegador simulada: registra lo que se narra y termina cada frase a los 150 ms. */
export const fakeSpeech=()=>{window.__spoken=[];window.__cancels=0;
  window.SpeechSynthesisUtterance=class{constructor(t){this.text=t}};
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{lang:'es-ES',name:'Falsa'}],
    speak(u){window.__spoken.push(u.text);this._t=setTimeout(()=>u.onend&&u.onend(),150)},cancel(){clearTimeout(this._t);window.__cancels++},onvoiceschanged:null}})};
export async function device(browser,preset){
  const ctx=await browser.newContext({viewport:{width:420,height:900},serviceWorkers:'block',baseURL:'http://localhost:8791/'});
  if(preset)await ctx.addInitScript(([k,v])=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem(k,v);sessionStorage.setItem('seeded','1')}},[KEY,preset]);
  const page=await ctx.newPage();page.errors=[];page.on('pageerror',e=>page.errors.push(e.message));await page.goto('/');return page}
