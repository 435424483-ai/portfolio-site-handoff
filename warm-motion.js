(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 let queued=false;
 const update=()=>{queued=false;const range=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--page-progress',range>0?Math.min(1,Math.max(0,scrollY/range)):0);const cards=[...document.querySelectorAll('.project-card')];let best=null,distance=Infinity;cards.forEach(card=>{const r=card.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const d=Math.abs(r.top+r.height*.35-innerHeight*.45);if(d<distance){best=card;distance=d}});cards.forEach(card=>card.classList.toggle('is-reading',card===best))};
 const queue=()=>{if(!queued){queued=true;requestAnimationFrame(update)}};
 window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);window.addEventListener('load',queue);new ResizeObserver(queue).observe(document.querySelector('main'));update();
 document.querySelectorAll('.hero-portrait,.project-card .card-image').forEach(card=>{
  let frame=0,x=0,y=0;
  const reset=()=>{cancelAnimationFrame(frame);frame=0;card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg')};
  card.addEventListener('pointermove',e=>{if(reduced.matches||!fine.matches)return;const rect=card.getBoundingClientRect();x=-(e.clientY-rect.top-rect.height/2)/rect.height*3;y=(e.clientX-rect.left-rect.width/2)/rect.width*4;if(!frame)frame=requestAnimationFrame(()=>{frame=0;card.style.setProperty('--tilt-x',x+'deg');card.style.setProperty('--tilt-y',y+'deg')})});
  card.addEventListener('pointerleave',reset);card.addEventListener('blur',reset);reduced.addEventListener('change',reset);fine.addEventListener('change',reset);
 });
 if(!reduced.matches&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('warm-reveal');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.section-heading,.case-overview>div,.strategy-grid article,.contact-grid').forEach(el=>observer.observe(el))}
})();

// Fit each single-line project tagline to its text column.
(()=>{
 const taglines=[...document.querySelectorAll('#work .scene-tagline')];if(!taglines.length)return;
 const fit=el=>{
  el.style.fontSize='';
  const preferred=parseFloat(getComputedStyle(el).fontSize);
  const width=el.clientWidth;if(!width)return;
  if(el.scrollWidth>width)el.style.fontSize=(Math.floor(preferred*width/el.scrollWidth*10)/10)+'px';
 };
 const refresh=()=>taglines.forEach(fit);
 const observer=new ResizeObserver(refresh);taglines.forEach(el=>observer.observe(el.parentElement));
 window.addEventListener('resize',refresh);document.fonts?.ready.then(refresh);refresh();
})();
