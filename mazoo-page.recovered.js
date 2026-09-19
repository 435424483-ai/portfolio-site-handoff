(()=>{
const MAZOO_MOTION={fast:180,normal:420,slow:720,intro:6200,easeOut:'cubic-bezier(.22,1,.36,1)',easeSoft:'cubic-bezier(.16,1,.3,1)',easeSpring:'cubic-bezier(.34,1.32,.64,1)'};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAZOO_ORBIT_LAYOUT=[
 {angle:-90,radius:29,asset:'symbol-duck.png'},{angle:-60,radius:30,asset:'symbol-fish.png'},
 {angle:-30,radius:28,asset:'symbol-clouds.png'},{angle:0,radius:30,asset:'symbol-pear.png'},
 {angle:30,radius:29,asset:'symbol-shell.png'},{angle:60,radius:31,asset:'symbol-blue-charm.png'},
 {angle:90,radius:28,asset:'symbol-peach.png'},{angle:120,radius:30,asset:'symbol-boat.png'},
 {angle:150,radius:29,asset:'symbol-flower.png'},{angle:180,radius:30,asset:'symbol-orange.png'},
 {angle:210,radius:28,asset:'symbol-jade.png'},{angle:240,radius:30,asset:'symbol-pouch.png'}
];
const assetBase=()=>location.pathname.includes('/work/')?'../../assets/mazoo/':'assets/mazoo/';
const markSeen=()=>{try{sessionStorage.setItem('mazooIntroSeen','1')}catch{}};

function transitionMarkup(){
 const layer=document.createElement('div');layer.className='mazoo-transition-layer';
 const orbit=MAZOO_ORBIT_LAYOUT.map((item,i)=>{
  const rad=item.angle*Math.PI/180,startRadius=7+(i%4);
  const sx=(Math.cos(rad)*startRadius).toFixed(2),sy=(Math.sin(rad)*startRadius).toFixed(2);
  const ex=(Math.cos(rad)*item.radius).toFixed(2),ey=(Math.sin(rad)*item.radius).toFixed(2);
  return '<img src="'+assetBase()+item.asset+'" alt="" data-slot="'+i+'" style="--sx:'+sx+'vmin;--sy:'+sy+'vmin;--ex:'+ex+'vmin;--ey:'+ey+'vmin;--delay:'+(i*72)+'ms">';
 }).join('');
 layer.innerHTML='<button class="mazoo-intro-skip" type="button">Skip</button><div class="mazoo-expansion"></div><div class="mazoo-orbit-stage"><div class="mazoo-tides"><i></i><i></i><i></i></div><div class="mazoo-intro-stickers">'+orbit+'</div><div class="mazoo-intro-anchor"><b>MAZOO</b><span>濠电偞鎸抽ˉ鎾舵椤撶喍绻嗛柛顐犲焺濞?br>濠电偟鈷堥崰鏇犳閸洖绀傞柛妤冨仜閻?/span></div></div>';
 document.body.append(layer);return layer;
}
function holdOpening(layer,after){
 if(layer.dataset.done)return;layer.dataset.done='1';layer.classList.remove('is-playing');layer.classList.add('is-held');markSeen();
 setTimeout(()=>{layer.classList.add('is-exiting');setTimeout(()=>{layer.remove();document.body.classList.remove('mazoo-intro-playing');if(after)after()},900)},320);
}
function setupHomeEntry(){
 const links=[...document.querySelectorAll('[data-project-link="mazoo"],[data-project="mazoo"] a[href*="/mazoo/"]')];
 if(!links.length)return;
 links.forEach(link=>link.addEventListener('click',e=>{
  if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  e.preventDefault();if(document.querySelector('.mazoo-transition-layer'))return;
  const url=link.href,layer=transitionMarkup();
  document.body.classList.add('mazoo-intro-playing');
  const r=link.closest('[data-project="mazoo"]')?.getBoundingClientRect()||link.getBoundingClientRect();
  layer.style.setProperty('--origin-x',r.left+r.width/2+'px');layer.style.setProperty('--origin-y',r.top+r.height/2+'px');
  requestAnimationFrame(()=>{if(!layer.dataset.done)reduced?finish():layer.classList.add('is-playing')});
  const finish=()=>{try{sessionStorage.setItem('mazooOpeningHandoff','1')}catch{}holdOpening(layer,()=>location.href=url)};
  layer.querySelector('.mazoo-intro-skip').addEventListener('click',finish);
  layer.addEventListener('animationend',e=>{if(e.animationName==='mazoo-camera-in')finish()});
 },{passive:false}));
}
function setupDirectIntro(root){
 try{if(sessionStorage.getItem('mazooOpeningHandoff')==='1'){sessionStorage.removeItem('mazooOpeningHandoff');root.dataset.mazooState='intro-finished';return}}catch{}
 const layer=transitionMarkup();layer.classList.add('is-direct');document.body.classList.add('mazoo-intro-playing');root.dataset.mazooState='intro-playing';
 requestAnimationFrame(()=>{if(!layer.dataset.done)reduced?finish():layer.classList.add('is-playing')});
 const finish=()=>{root.dataset.mazooState='intro-exiting';holdOpening(layer,()=>{root.dataset.mazooState='intro-finished'})};
 layer.querySelector('.mazoo-intro-skip').addEventListener('click',finish);layer.addEventListener('animationend',e=>{if(e.animationName==='mazoo-camera-in')finish()});
}
function setupLifestyle(root){
 const stage=root.querySelector('.lifestyle-stage');if(!stage)return;
 const cards=[...stage.querySelectorAll('.life-card')];
 const config=[
  {id:'work',title:'宸ヤ綔濡堢',keys:'Daily Life 路 Youth Culture 路 Companionship'},
  {id:'fly',title:'椋炶濡堢',keys:'Travel 路 Youth Culture 路 Companionship'},
  {id:'relax',title:'鎽搁奔濡堢',keys:'Daily Life 路 Relax 路 Companionship'},
  {id:'movie',title:'瑙傚奖濡堢',keys:'Leisure 路 Youth Culture 路 Companionship'}
 ];
 cards.forEach((card,i)=>{card.dataset.life=config[i].id;card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label','闂備礁鎼悮顐﹀磿閸愯鑰?'+config[i].title);});
 const panel=document.createElement('aside');panel.className='lifestyle-story';panel.innerHTML='<button type="button" class="lifestyle-close" aria-label="闂備胶顭堢换鎴炵箾婵犲伣?>闂?/button><p>STORY</p><h3></h3><span></span><div><button type="button" data-life-prev aria-label="濠电偞鍨堕幐鎼佹晝閿濆洨鍗氶悗娑欘焽閳?>闂?/button><button type="button" data-life-next aria-label="濠电偞鍨堕幐鎼侇敄閸曨厾鍗氶悗娑欘焽閳?>闂?/button></div>';
 stage.append(panel);let active=-1,busy=false;
 const setState=s=>root.dataset.mazooState=s;
 const hover=(card,on)=>{if(active>=0||busy)return;setState(on?'lifestyle-hover':'lifestyle-idle');cards.forEach(c=>c.classList.toggle('is-muted',on&&c!==card));card.classList.toggle('is-hovered',on)};
 cards.forEach(card=>{card.addEventListener('mouseenter',()=>hover(card,true));card.addEventListener('mouseleave',()=>hover(card,false));card.addEventListener('click',()=>focus(cards.indexOf(card)));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();focus(cards.indexOf(card))}})});
 function flip(card,mutate){
  const first=card.getBoundingClientRect();mutate();const last=card.getBoundingClientRect();
  if(reduced)return;const dx=first.left-last.left,dy=first.top-last.top,sx=first.width/last.width;
  card.animate([{transform:'translate('+dx+'px,'+dy+'px) scale('+sx+')'},{transform:'translate(0,0) scale(1.015)',offset:.82},{transform:'translate(0,0) scale(1)'}],{duration:MAZOO_MOTION.slow,easing:MAZOO_MOTION.easeSoft});
 }
 function focus(i){
  if(busy||innerWidth<=768){openMobile(i);return}busy=true;setState('lifestyle-transitioning');
  const card=cards[i];flip(card,()=>{active=i;stage.classList.add('is-focus');cards.forEach((c,n)=>c.classList.toggle('is-active',n===i));panel.querySelector('h3').textContent=config[i].title;panel.querySelector('span').textContent=config[i].keys;panel.classList.add('is-visible')});
  setTimeout(()=>{busy=false;setState('lifestyle-focus')},MAZOO_MOTION.slow);
 }
 function close(){
  if(active<0||busy)return;busy=true;const card=cards[active];setState('lifestyle-transitioning');panel.classList.remove('is-visible');
  flip(card,()=>{stage.classList.remove('is-focus');cards.forEach(c=>c.classList.remove('is-active','is-muted','is-hovered'));active=-1});
  setTimeout(()=>{busy=false;setState('lifestyle-idle')},MAZOO_MOTION.slow);
 }
 function change(step){if(active<0||busy)return;const next=(active+step+cards.length)%cards.length;close();setTimeout(()=>focus(next),MAZOO_MOTION.normal)}
 function openMobile(i){active=i;panel.style.setProperty('--active-life-image','url(' + cards[i].querySelector('img').src + ')');panel.querySelector('h3').textContent=config[i].title;panel.querySelector('span').textContent=config[i].keys;panel.classList.add('is-visible','is-mobile');cards[i].classList.add('is-mobile-active');setState('lifestyle-focus')}
 panel.querySelector('.lifestyle-close').addEventListener('click',()=>{if(innerWidth<=768){panel.classList.remove('is-visible','is-mobile');cards.forEach(c=>c.classList.remove('is-mobile-active'));active=-1;setState('lifestyle-idle')}else close()});
 panel.querySelector('[data-life-prev]').addEventListener('click',()=>change(-1));panel.querySelector('[data-life-next]').addEventListener('click',()=>change(1));
 stage.addEventListener('click',e=>{if(active>=0&&e.target===stage)close()});addEventListener('keydown',e=>{if(e.key==='Escape')innerWidth<=768?panel.querySelector('.lifestyle-close').click():close()});
 setState('lifestyle-idle');
}
const root=document.querySelector('.mazoo-case');if(root){setupDirectIntro(root);setupLifestyle(root)}
})();