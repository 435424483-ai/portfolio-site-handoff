(()=>{
 const root=document.querySelector('.portrait-book-section');if(!root)return;
 const book=root.querySelector('.portrait-book'),stage=root.querySelector('.portrait-book-stage'),spreads=[...root.querySelectorAll('[data-book-spread]')];
 const previous=root.querySelector('[data-book-prev]'),next=root.querySelector('[data-book-next]'),pause=root.querySelector('[data-book-pause]'),position=root.querySelector('[data-book-position]');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');let index=0,busy=false,paused=false,hover=false,focused=false,visible=false,timer;
 const schedule=()=>{clearTimeout(timer);if(!paused&&!hover&&!focused&&visible&&!document.hidden&&!reduced.matches&&!busy)timer=setTimeout(()=>turn(1),1000)};
 const clone=el=>{const copy=el.cloneNode(true);copy.setAttribute('aria-hidden','true');copy.querySelectorAll('button').forEach(button=>button.tabIndex=-1);return copy};
 async function turn(direction){
  if(busy)return;clearTimeout(timer);busy=true;previous.disabled=next.disabled=true;
  const target=(index+direction+spreads.length)%spreads.length,old=spreads[index],incoming=spreads[target];
  let sheet,hold;
  if(!reduced.matches&&book.animate){
   hold=clone(old.children[direction===1?0:1]);hold.classList.add('portrait-book-hold');if(direction===-1)hold.style.left='50%';book.append(hold);
   sheet=document.createElement('div');sheet.className='portrait-book-sheet';sheet.setAttribute('aria-hidden','true');
   const front=clone(old.children[direction===1?1:0]),back=clone(incoming.children[direction===1?0:1]);back.classList.add('book-sheet-back');sheet.append(front,back);
   if(direction===-1){sheet.style.left='0';sheet.style.transformOrigin='right center';}
   book.append(sheet);old.hidden=true;incoming.hidden=false;
   try{await sheet.animate([{transform:'rotateY(0deg)'},{transform:`rotateY(${direction===1?-180:180}deg)`}],{duration:4200,easing:'cubic-bezier(.45,0,.25,1)',fill:'forwards'}).finished}catch{}
   sheet.remove();hold.remove();
  }else{old.hidden=true;incoming.hidden=false;}
  index=target;position.textContent=String(index+1).padStart(2,'0')+' / '+String(spreads.length).padStart(2,'0');busy=false;previous.disabled=next.disabled=false;schedule();
 }
 previous.addEventListener('click',()=>turn(-1));next.addEventListener('click',()=>turn(1));
 pause.addEventListener('click',()=>{paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'继续翻页 ▶':'暂停翻页 Ⅱ';schedule()});
 stage.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();turn(event.key==='ArrowLeft'?-1:1)}});
 stage.addEventListener('pointerenter',()=>{hover=true;schedule()});stage.addEventListener('pointerleave',()=>{hover=false;schedule()});
 stage.addEventListener('focusin',()=>{focused=true;schedule()});stage.addEventListener('focusout',event=>{if(!stage.contains(event.relatedTarget)){focused=false;schedule()}});
 document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',schedule);
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{threshold:.3}).observe(stage);else{visible=true;schedule()}
})();
