(()=>{
 const doc=document.documentElement;const finishPreload=()=>doc.classList.remove('opening-preload');const navigation=performance.getEntriesByType('navigation')[0];let returning=false;
 try{returning=sessionStorage.getItem('chen-yue-return-home')==='1';sessionStorage.removeItem('chen-yue-return-home')}catch{}
 if(navigation?.type!=='reload'&&(returning||navigation?.type==='back_forward')){finishPreload();return}
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){finishPreload();return}
 doc.classList.add('is-opening');
 document.addEventListener('DOMContentLoaded',()=>{
  finishPreload();
  const opening=document.querySelector('.portfolio-opening');if(!opening){doc.classList.remove('is-opening');return}
  let leaving=false;let timer;
  const leave=()=>{if(leaving)return;leaving=true;clearTimeout(timer);opening.classList.add('is-leaving');setTimeout(()=>{doc.classList.remove('is-opening');opening.remove()},650)};
  opening.querySelector('.opening-skip').addEventListener('click',leave);opening.querySelector('.opening-folder').addEventListener('click',leave);
  const escape=event=>{if(event.key==='Escape'){leave();document.removeEventListener('keydown',escape)}};document.addEventListener('keydown',escape);
  if(matchMedia('(pointer:fine) and (min-width:701px)').matches){opening.addEventListener('pointermove',event=>{const x=(event.clientX/innerWidth-.5)*2,y=(event.clientY/innerHeight-.5)*2;for(const [key,amount]of [['word',3],['sheet',5],['folder',2]]){opening.style.setProperty('--'+key+'-x',x*amount+'px');opening.style.setProperty('--'+key+'-y',y*amount+'px')}});opening.addEventListener('pointerleave',()=>{for(const key of ['word','sheet','folder']){opening.style.setProperty('--'+key+'-x','0px');opening.style.setProperty('--'+key+'-y','0px')}})}
  timer=setTimeout(leave,3800);
 });
})();