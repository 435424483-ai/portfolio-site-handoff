(()=>{
 const folders=[...document.querySelectorAll('.project-folder')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 folders.forEach(folder=>{
  folder.addEventListener('toggle',()=>{if(folder.open){folders.forEach(other=>{if(other!==folder)other.open=false});requestAnimationFrame(()=>{if(document.activeElement===folder.querySelector('summary'))folder.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});window.dispatchEvent(new Event('resize'));window.dispatchEvent(new Event('scroll'))})}});
  folder.querySelector('[data-close-folder]')?.addEventListener('click',()=>{folder.open=false;folder.querySelector('summary').focus({preventScroll:true});folder.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'})});
 });
 const revealHash=()=>{if(!location.hash)return;let target;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)))}catch{return}const folder=target?.closest('.project-folder');if(folder){folder.open=true;requestAnimationFrame(()=>target.scrollIntoView({block:'start'}))}};
 window.addEventListener('hashchange',revealHash);revealHash();
})();
