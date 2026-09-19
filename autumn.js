document.documentElement.classList.add('js');
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#main-nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);menu.textContent=open?'关闭 ×':'菜单 ＋'});
nav?.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='菜单 ＋'}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false')}});
const dialog=document.querySelector('.image-dialog'),large=dialog?.querySelector('img');
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{large.src=button.dataset.image;large.alt=button.dataset.caption;dialog.querySelector('.dialog-caption').textContent=button.dataset.caption+' · 可滚动查看长图';dialog.showModal();document.body.style.overflow='hidden';dialog.querySelector('.image-scroll').scrollTop=0}));
dialog?.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog?.addEventListener('close',()=>document.body.style.overflow='');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;if(!reduced)e.target.classList.add('reveal');observer.unobserve(e.target)}),{threshold:.08});
 document.querySelectorAll('.other-work,.case-section').forEach(el=>observer.observe(el));


 const counts=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;counts.unobserve(e.target);if(reduced)return;const full=e.target.dataset.count,n=parseInt(full),suffix=full.replace(/[0-9]/g,'');let start;const frame=t=>{start??=t;const p=Math.min((t-start)/750,1);e.target.textContent=Math.round(n*(1-Math.pow(1-p,3)))+suffix;if(p<1)requestAnimationFrame(frame)};requestAnimationFrame(frame)}),{threshold:.6});
 document.querySelectorAll('[data-count]').forEach(el=>counts.observe(el));
 const sections=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('#main-nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-15% 0px -60% 0px'});
 document.querySelectorAll('#main > section[id]').forEach(el=>sections.observe(el));
}

/* Independent, reversible homepage scroll scenes. No elapsed-time reveal. */
(()=>{
 const elements=[...document.querySelectorAll('#work .project-scene')];
 if(!elements.length)return;
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=matchMedia('(max-width: 900px)');
 const clamp=v=>Math.max(0,Math.min(1,v));
 const range=(p,a,b)=>{const t=clamp((p-a)/(b-a));return t*t*(3-2*t)};
 const scenes=elements.map(element=>({
   element, image:element.querySelector('.card-image'),
   text:[...element.querySelector('.card-copy').children],
   direction:element.classList.contains('scene-left')?-1:1,
   current:0,target:0,drawn:null
 }));
 const ranges=[[0,.18,20],[.08,.30,24],[.18,.42,20],[.28,.55,16],[.40,.70,14],[.48,.70,14]];
 let frame=0,dirty=true,reset=true,lastTime=0;
 const draw=scene=>{
   const p=scene.current,enter=range(p,0,.38),exit=range(p,.72,1);
   if(mobile.matches){
     scene.image.style.opacity=String(enter*(1-exit*.18));
     scene.image.style.transform=`translateY(${(1-enter)*18-exit*8}px)`;
     scene.image.style.clipPath='none';
   }else{
     const x=scene.direction*(90*(1-enter)+90*exit);
     const scale=.985+.015*enter-.015*exit;
     const incoming=42*(1-enter)+100*exit,outgoing=0;
     scene.image.style.opacity='1';
     scene.image.style.transform=`translateX(${x}px) scale(${scale})`;
     scene.image.style.clipPath=scene.direction===1
       ?`inset(0 ${outgoing}% 0 ${incoming}% round 28px)`
       :`inset(0 ${incoming}% 0 ${outgoing}% round 28px)`;
   }
   scene.text.forEach((element,index)=>{
     const [a,b,y]=ranges[Math.min(index,ranges.length-1)];
     const textP=range(p,a,b);
     element.style.opacity=String(textP*(1-exit*.3));
     element.style.transform=`translateY(${y*(1-textP)-exit*4}px)`;
   });
 };
 const tick=time=>{
   frame=0;
   if(reducedMotion.matches || mobile.matches){
     scenes.forEach(scene=>{
       scene.element.classList.remove('scroll-linked');
       [scene.image,...scene.text].forEach(element=>{
         ['opacity','transform','clip-path'].forEach(property=>element.style.removeProperty(property));
       });
     });
     scenes.forEach(scene=>scene.drawn=null);reset=true;lastTime=0;return;
   }
   if(dirty){
     const height=innerHeight;
     // Batch all geometry reads before any style writes.
     scenes.forEach(scene=>{
       const rect=scene.element.getBoundingClientRect();
       scene.target=clamp((height*.85-rect.top)/(rect.height+height*.65));
       if(reset)scene.current=scene.target;
     });
     dirty=false;reset=false;
   }
   const elapsed=lastTime?Math.min(64,time-lastTime):1000/60;
   const smoothing=1-Math.pow(1-.065,elapsed/(1000/60));
   lastTime=time;
   let unsettled=false;
   scenes.forEach(scene=>{
     scene.element.classList.add('scroll-linked');
     scene.current+=(scene.target-scene.current)*smoothing;
     if(Math.abs(scene.target-scene.current)<.0001)scene.current=scene.target;
     else unsettled=true;
     if(scene.drawn===null||Math.abs(scene.current-scene.drawn)>.00002){draw(scene);scene.drawn=scene.current;}
   });
   if(unsettled)frame=requestAnimationFrame(tick);
   else lastTime=0;
 };
 const queue=()=>{dirty=true;if(!frame)frame=requestAnimationFrame(tick)};
 const reconfigure=()=>{reset=true;queue()};
 addEventListener('scroll',queue,{passive:true});
 addEventListener('resize',reconfigure);
 addEventListener('load',reconfigure);
 addEventListener('pageshow',reconfigure);
 reducedMotion.addEventListener('change',reconfigure);
 mobile.addEventListener('change',reconfigure);
 if('ResizeObserver' in window)new ResizeObserver(queue).observe(document.querySelector('#work'));
 queue();
})();
(()=>{const works=[...document.querySelectorAll('.fudo-work')];if(!works.length)return;if('IntersectionObserver' in window){const startOnView=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.remove('is-scroll-waiting');startOnView.unobserve(entry.target)}),{threshold:.15});works.forEach(work=>startOnView.observe(work));}else works.forEach(work=>work.classList.remove('is-scroll-waiting'));works.forEach(work=>{const button=work.querySelector('[data-fudo-pause]');button.addEventListener('click',()=>{const paused=work.classList.toggle('is-paused');button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'继续滚动 ▶':'暂停滚动 Ⅱ'});});})();

/* Returning from a project bypasses the homepage opening once. */
(() => {
 if(!/\/work\/[^/]+\//.test(location.pathname))return;
 document.addEventListener('click', event => {
  const link=event.target.closest('a[href]');
  if(!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target==='_blank')return;
  const target=new URL(link.href,location.href);
  if(target.origin===location.origin && /\/(?:index\.html|陈悦作品集\.html)$/.test(decodeURI(target.pathname)) && !/\/work\//.test(target.pathname)) {
   try{sessionStorage.setItem('chen-yue-return-home','1')}catch{}
  }
 });
})();

// Keep manual gallery seeking and automatic motion on the same timeline.
(()=>{document.querySelectorAll('.fudo-work').forEach(work=>{
 const slider=work.querySelector('[data-fudo-slider]'),track=work.querySelector('.fudo-scroll-track'),viewport=work.querySelector('.fudo-scroll-window');
 if(!slider||!track)return;
 let dragging=false,releaseTimer;
 const animation=()=>track.getAnimations()[0];
 const resume=()=>{clearTimeout(releaseTimer);releaseTimer=null;dragging=false;track.style.animationPlayState='';};
 slider.addEventListener('pointerdown',()=>{clearTimeout(releaseTimer);dragging=true;track.style.animationPlayState='paused';});
 slider.addEventListener('input',()=>{
  const motion=animation();
  if(motion){track.style.animationPlayState='paused';motion.currentTime=Number(slider.value)/1000*Number(motion.effect.getTiming().duration);}
  else viewport.scrollLeft=Number(slider.value)/1000*(viewport.scrollWidth-viewport.clientWidth);
  if(!dragging){clearTimeout(releaseTimer);releaseTimer=setTimeout(resume,1000);}
 });
 document.addEventListener('pointerup',()=>{if(dragging)resume();});
 document.addEventListener('pointercancel',()=>{if(dragging)resume();});
 const sync=()=>{
  const motion=animation();
  if(!dragging&&!releaseTimer&&motion){const duration=Number(motion.effect.getTiming().duration);slider.value=String(Math.round((Number(motion.currentTime||0)%duration)/duration*1000));}
  requestAnimationFrame(sync);
 };
 requestAnimationFrame(sync);
});})();
