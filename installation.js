(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 document.querySelectorAll('.hanging-experience').forEach(experience=>{
  const device=experience.querySelector('.hanging-device');let target=0,current=0,visible=false,frame=0,last=0;
  const tick=t=>{frame=0;if(!visible||document.hidden||reduced)return;const dt=Math.min(t-(last||t),50);last=t;current+=(target-current)*(1-Math.exp(-dt/200));device.style.transform=`rotate(${current+Math.sin(t/1400)*.6}deg)`;frame=requestAnimationFrame(tick)};
  const wake=()=>{if(!frame&&!reduced&&visible&&!document.hidden){last=0;frame=requestAnimationFrame(tick)}};
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){experience.classList.add('arrived');wake()}else{cancelAnimationFrame(frame);frame=0}},{threshold:.18}).observe(experience);
  experience.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=experience.getBoundingClientRect();target=((e.clientX-r.left)/r.width-.5)*5;wake()});
  experience.addEventListener('pointerleave',()=>{target=0});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else wake()});
  experience.querySelectorAll('[data-feature]').forEach(button=>button.addEventListener('click',()=>{
   experience.querySelectorAll('[data-feature]').forEach(b=>b.setAttribute('aria-expanded',String(b===button)));
   experience.querySelectorAll('.device-feature').forEach(panel=>panel.hidden=panel.id!==button.getAttribute('aria-controls'));
   if(innerWidth<=700)document.getElementById(button.getAttribute('aria-controls')).scrollIntoView({behavior:reduced?'instant':'smooth',block:'nearest'});
  }));
 });
 document.querySelectorAll('.rendering-carousel').forEach(carousel=>{
  const viewport=carousel.querySelector('.rendering-viewport'),set=carousel.querySelector('.rendering-set'),pause=carousel.querySelector('[data-rail-pause]');
  let width=0,visible=false,paused=reduced,hover=false,focus=false,dragging=false,frame=0,last=0,manualUntil=0;
  const normalize=()=>{if(!width)return;if(viewport.scrollLeft<width)viewport.scrollLeft+=width;else if(viewport.scrollLeft>=width*2)viewport.scrollLeft-=width};
  const tick=t=>{frame=0;if(!visible||document.hidden)return;const dt=Math.min(t-(last||t),40);last=t;if(!paused&&!hover&&!focus&&!dragging&&t>manualUntil){viewport.scrollLeft+=dt*.035;normalize()}frame=requestAnimationFrame(tick)};
  const wake=()=>{if(!frame&&visible&&!document.hidden){last=0;frame=requestAnimationFrame(tick)}};
  new ResizeObserver(()=>{const next=set.getBoundingClientRect().width;if(next!==width){const ratio=width?viewport.scrollLeft/width:1;width=next;viewport.scrollLeft=ratio*width;normalize()}}).observe(set);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else{cancelAnimationFrame(frame);frame=0}}).observe(viewport);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else wake()});
  viewport.addEventListener('scroll',normalize,{passive:true});
  carousel.addEventListener('mouseenter',()=>hover=true);carousel.addEventListener('mouseleave',()=>hover=false);
  carousel.addEventListener('focusin',()=>focus=true);carousel.addEventListener('focusout',e=>{focus=carousel.contains(e.relatedTarget)});
  viewport.addEventListener('pointerdown',()=>dragging=true);window.addEventListener('pointerup',()=>dragging=false);viewport.addEventListener('pointercancel',()=>dragging=false);
  viewport.addEventListener('wheel',()=>manualUntil=performance.now()+2000,{passive:true});
  const move=dir=>{manualUntil=performance.now()+2000;viewport.scrollLeft+=dir*(set.querySelector('.photo').getBoundingClientRect().width+20);normalize()};
  carousel.querySelector('[data-rail-prev]').addEventListener('click',()=>move(-1));carousel.querySelector('[data-rail-next]').addEventListener('click',()=>move(1));
  viewport.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1)}});
  const label=()=>{pause.textContent=paused?'继续滚动':'暂停滚动';pause.setAttribute('aria-pressed',String(paused))};
  pause.addEventListener('click',()=>{paused=!paused;label()});label();
 });
})();
