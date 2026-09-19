(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const panels=[...document.querySelectorAll('.campaign-panel')];
 const links=[...document.querySelectorAll('[data-campaign-link]')];
 if(panels.length){
  let queued=false;
  const update=()=>{
   queued=false;
   const readingLine=innerHeight*.38;
   const current=panels.reduce((active,p)=>p.getBoundingClientRect().top<=readingLine?p:active,panels[0]);
   links.forEach(a=>{if(a.dataset.campaignLink===current.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
  };
  const queue=()=>{if(!queued){queued=true;requestAnimationFrame(update)}};
  window.addEventListener('scroll',queue,{passive:true});
  window.addEventListener('resize',queue);
  window.addEventListener('load',queue);
  update();
 }
 document.querySelectorAll('.sphere-stage').forEach(stage=>{
  const cards=[...stage.querySelectorAll('.sphere-card')];
  // Points lie on an invisible sphere; rotate in 3D, then project into screen space.
  const points=cards.map((_,i)=>{const y=1-2*(i+.5)/cards.length,r=Math.sqrt(1-y*y),angle=i*Math.PI*(3-Math.sqrt(5));return {x:Math.cos(angle)*r,y,z:Math.sin(angle)*r}});
  let yaw=.3,pitch=-.1,targetYaw=.3,targetPitch=-.1,followX=0,followY=0;
  let drag=null,dragged=false,visible=false,frame=0,previous=0;
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const draw=()=>{
   const radius=Math.min(stage.clientWidth*.32,stage.clientHeight*.30,180);
   cards.forEach((card,i)=>{
    const p=points[i],x=p.x*Math.cos(yaw)+p.z*Math.sin(yaw),z0=-p.x*Math.sin(yaw)+p.z*Math.cos(yaw);
    const y=p.y*Math.cos(pitch)-z0*Math.sin(pitch),z=p.y*Math.sin(pitch)+z0*Math.cos(pitch);
    const scale=.76+(z+1)*.15;
    card.style.transform=`translate(-50%,-50%) translate(${x*radius}px,${y*radius}px) scale(${scale})`;
    card.style.opacity=String(.48+(z+1)*.26);
    card.style.zIndex=String(Math.round((z+1)*100));
   });
  };
  const tick=t=>{
   frame=0;if(!visible||document.hidden)return;
   const dt=Math.min(t-(previous||t),40);previous=t;
   if(!reduced&&!drag&&!stage.matches(':hover')&&!stage.contains(document.activeElement))targetYaw+=dt*.000025;
   const ease=reduced?1:1-Math.exp(-Math.max(dt,16)/120);
   yaw+=(targetYaw+followX-yaw)*ease;pitch+=(targetPitch+followY-pitch)*ease;draw();
   if(!reduced||Math.abs(yaw-targetYaw-followX)+Math.abs(pitch-targetPitch-followY)>.001)frame=requestAnimationFrame(tick);
  };
  const wake=()=>{if(!frame&&visible&&!document.hidden){previous=0;frame=requestAnimationFrame(tick)}};
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else{cancelAnimationFrame(frame);frame=0}},{rootMargin:'100px'}).observe(stage);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else wake()});
  new ResizeObserver(()=>{draw();wake()}).observe(stage);
  stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragged=false;drag={id:e.pointerId,x:e.clientX,y:e.clientY,yaw:targetYaw,pitch:targetPitch};followX=followY=0});
  stage.addEventListener('pointermove',e=>{
   if(drag){
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(Math.abs(dx)+Math.abs(dy)>7){dragged=true;stage.classList.add('is-dragging');if(!stage.hasPointerCapture(e.pointerId))stage.setPointerCapture(e.pointerId)}
    if(dragged){targetYaw=drag.yaw+dx*.008;targetPitch=clamp(drag.pitch-dy*.006,-1.1,1.1)}
   }else if(!reduced&&e.pointerType==='mouse'){
    const r=stage.getBoundingClientRect();followX=((e.clientX-r.left)/r.width-.5)*.15;followY=((e.clientY-r.top)/r.height-.5)*.1;
   }
   wake();
  });
  const end=e=>{drag=null;stage.classList.remove('is-dragging');if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);wake()};
  stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);stage.addEventListener('lostpointercapture',()=>{drag=null;stage.classList.remove('is-dragging')});
  stage.addEventListener('pointerleave',()=>{followX=followY=0;wake()});
  stage.addEventListener('click',e=>{if(dragged&&e.detail!==0){e.preventDefault();e.stopImmediatePropagation()}},true);
  stage.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey)return;e.preventDefault();targetYaw+=clamp(e.deltaY+e.deltaX,-100,100)*.005;wake()},{passive:false});
  stage.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')targetYaw-=.35;if(e.key==='ArrowRight')targetYaw+=.35;if(e.key==='ArrowUp')targetPitch=clamp(targetPitch-.2,-1.1,1.1);if(e.key==='ArrowDown')targetPitch=clamp(targetPitch+.2,-1.1,1.1);wake()});
  stage.parentElement.querySelectorAll('[data-sphere-turn]').forEach(button=>button.addEventListener('click',()=>{targetYaw+=Number(button.dataset.sphereTurn)*.6;wake()}));
  draw();
 });
 document.querySelectorAll('.fan-section').forEach(section=>{
  const modal=document.querySelector('.image-dialog');let timer;
  const reset=()=>{clearTimeout(timer);section.classList.remove('has-selection');section.querySelectorAll('.fan-card').forEach(card=>card.classList.remove('is-extracted'))};
  new IntersectionObserver(entries=>entries.forEach(e=>section.classList.toggle('fan-open',e.isIntersecting)),{threshold:.25}).observe(section.querySelector('.fan-stage'));
  section.addEventListener('focusin',()=>section.classList.add('fan-open'));
  section.querySelectorAll('.fan-card').forEach(card=>card.addEventListener('click',e=>{
   e.stopImmediatePropagation();reset();section.classList.add('has-selection');card.classList.add('is-extracted');
   timer=setTimeout(()=>{
    const image=modal.querySelector('img');image.src=card.dataset.image;image.alt=card.dataset.caption;
    modal.querySelector('.dialog-caption').textContent=card.dataset.caption+' · 完整图片';
    if(!modal.open)modal.showModal();document.body.style.overflow='hidden';modal.querySelector('.image-scroll').scrollTop=0;
   },reduced?0:220);
  },true));
  modal.addEventListener('close',reset);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')reset()});
 });
})();

(() => {
 document.querySelectorAll('.product-strip').forEach(strip => {
  const button = strip.querySelector('.product-strip-pause');
  const viewport = strip.querySelector('.product-strip-window');
  const track = strip.querySelector('.product-strip-track');
  const group = strip.querySelector('.product-strip-group');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let position = 0, last = 0, visible = false, dragging = false, resumeAt = 0;
  let groupWidth = 0;
  track.style.transform = 'none';
  const pause = value => {
   strip.classList.toggle('is-paused', value);
   button.setAttribute('aria-pressed', String(value));
   button.textContent = value ? '继续滚动 ▶' : '暂停滚动 Ⅱ';
  };
  button.addEventListener('click', () => pause(!strip.classList.contains('is-paused')));
  const manual = () => { position = viewport.scrollLeft; resumeAt = performance.now() + 1000; };
  viewport.addEventListener('pointerdown', () => { dragging = true; manual(); });
  window.addEventListener('pointerup', () => { if (dragging) { dragging = false; manual(); } });
  window.addEventListener('pointercancel', () => { dragging = false; manual(); });
  window.addEventListener('blur', () => { dragging = false; });
  viewport.addEventListener('wheel', manual, { passive: true });
  viewport.addEventListener('keydown', manual);
  viewport.addEventListener('scroll', () => {
   if (Math.abs(viewport.scrollLeft - position) > 2) manual();
  }, { passive: true });
  new ResizeObserver(() => { groupWidth = group.getBoundingClientRect().width; position = viewport.scrollLeft; }).observe(group);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }).observe(strip);
  function tick(now) {
   const elapsed = last ? Math.min(now - last, 50) : 0;
   last = now;
   if (visible && groupWidth && !document.hidden && !reduced.matches && !dragging && now >= resumeAt && !strip.classList.contains('is-paused')) {
    position = (position + elapsed * groupWidth / 140000) % groupWidth;
    viewport.scrollLeft = position;
   }
   requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
 });
})();
