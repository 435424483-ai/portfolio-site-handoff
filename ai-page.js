(()=>{
 const page=document.querySelector('.ai-case');if(!page)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const hero=page.querySelector('.ai-hero'),canvas=page.querySelector('.ai-canvas');let raf=0;
 const update=()=>{raf=0;const p=Math.min(1,Math.max(0,scrollY/(hero.offsetHeight*.8)));canvas.style.setProperty('--hero-scale',1-p*.03);canvas.style.setProperty('--hero-opacity',1-p*.12);canvas.style.setProperty('--hero-y',p*18+'px');document.documentElement.style.setProperty('--ai-nav-alpha',.45+p*.38);document.documentElement.style.setProperty('--ai-nav-blur',12+p*8+'px')};
 addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(update)},{passive:true});update();
 if(!reduced&&matchMedia('(hover:hover)').matches)hero.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;canvas.querySelectorAll('.ai-float').forEach((card,i)=>{const depth=[4,7,5,8][i]||4;card.style.setProperty('--px',x*depth+'px');card.style.setProperty('--py',y*depth+'px')})});
 hero.addEventListener('pointerleave',()=>canvas.querySelectorAll('.ai-float').forEach(card=>{card.style.setProperty('--px','0px');card.style.setProperty('--py','0px')}));
 const audienceCards=[...page.querySelectorAll('.ai-audience-card')],audienceHover=matchMedia('(hover: hover) and (pointer: fine)'),audienceMobile=matchMedia('(max-width: 700px)');
 const showAllAudiences=()=>audienceMobile.matches;
 const expandAudience=card=>audienceCards.forEach(item=>{const open=showAllAudiences()||item===card;item.setAttribute('aria-expanded',String(open));item.querySelector('.ai-card-detail')?.setAttribute('aria-hidden',String(!open))});
 audienceCards.forEach(card=>{card.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'&&!showAllAudiences())expandAudience(card)});card.addEventListener('focus',()=>expandAudience(card));card.addEventListener('click',()=>expandAudience(card))});
 const configureAudiences=()=>expandAudience(audienceCards.find(card=>card.getAttribute('aria-expanded')==='true')||audienceCards[0]);
 audienceHover.addEventListener('change',configureAudiences);audienceMobile.addEventListener('change',configureAudiences);configureAudiences();
 const steps=[...page.querySelectorAll('[data-story-step]')],links=[...page.querySelectorAll('[data-story-link]')];
 if(steps.length&&'IntersectionObserver'in window){const storyObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)links.forEach(link=>link.classList.toggle('is-active',link.dataset.storyLink===entry.target.dataset.storyStep))}),{rootMargin:'-32% 0px -42%'});steps.forEach(step=>storyObserver.observe(step))}
 const directoryLinks=[...page.querySelectorAll('.ai-directory a')];
 const directorySections=directoryLinks.map(link=>page.querySelector(link.getAttribute('href'))).filter(Boolean);
 const setCurrent=id=>directoryLinks.forEach(link=>{if(link.hash==='#'+id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
 directoryLinks.forEach(link=>link.addEventListener('click',()=>setCurrent(link.hash.slice(1))));
 if('IntersectionObserver'in window){const directoryObserver=new IntersectionObserver(entries=>{const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);if(visible.length)setCurrent(visible[0].target.id)},{rootMargin:'-15% 0px -55%'});directorySections.forEach(section=>directoryObserver.observe(section))}
 const rail=page.querySelector('.ai-comms-rail'),position=page.querySelector('[data-comms-position]'),prev=page.querySelector('[data-comms-prev]'),next=page.querySelector('[data-comms-next]');
 if(rail){const cards=[...rail.children];const refresh=()=>{const index=cards.reduce((best,card,i)=>Math.abs(card.offsetLeft-cards[0].offsetLeft-rail.scrollLeft)<Math.abs(cards[best].offsetLeft-cards[0].offsetLeft-rail.scrollLeft)?i:best,0);position.textContent=String(index+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');prev.disabled=rail.scrollLeft<2;next.disabled=rail.scrollLeft>=rail.scrollWidth-rail.clientWidth-2};const slide=dir=>rail.scrollBy({left:dir*(cards[0].getBoundingClientRect().width+18),behavior:reduced?'auto':'smooth'});prev.addEventListener('click',()=>slide(-1));next.addEventListener('click',()=>slide(1));rail.addEventListener('keydown',e=>{if(e.target===rail&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();slide(e.key==='ArrowLeft'?-1:1)}});rail.addEventListener('scroll',refresh,{passive:true});addEventListener('resize',refresh);refresh()}
 const film=page.querySelector('.ai-film');const move=dir=>film.scrollBy({left:dir*Math.min(640,innerWidth*.64),behavior:reduced?'auto':'smooth'});page.querySelector('[data-film-prev]')?.addEventListener('click',()=>move(-1));page.querySelector('[data-film-next]')?.addEventListener('click',()=>move(1));film?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1)}});
 if('IntersectionObserver'in window){const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');reveal.unobserve(entry.target)}}),{threshold:.12});page.querySelectorAll('.ai-reveal').forEach(el=>reveal.observe(el));const chat=page.querySelector('[data-chat-answer]');if(chat)new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){setTimeout(()=>chat.classList.add('is-shown'),reduced?0:450)}}),{threshold:.5}).observe(chat)}
})();

(()=>{const root=document.querySelector('.ai-agent-demo');if(!root)return;const tabs=[...root.querySelectorAll('[data-agent-tab]')];const select=tab=>{tabs.forEach(item=>{const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1});root.querySelectorAll('[data-agent-panel]').forEach(panel=>panel.hidden=panel.dataset.agentPanel!==tab.dataset.agentTab)};tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(tab));tab.addEventListener('keydown',event=>{let index;if(event.key==='ArrowRight')index=(i+1)%tabs.length;else if(event.key==='ArrowLeft')index=(i+tabs.length-1)%tabs.length;else if(event.key==='Home')index=0;else if(event.key==='End')index=tabs.length-1;else return;event.preventDefault();select(tabs[index]);tabs[index].focus()})});root.querySelectorAll('[data-agent-step]').forEach(button=>button.addEventListener('click',()=>{root.querySelectorAll('[data-agent-step]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));root.querySelectorAll('[data-agent-shot]').forEach(shot=>shot.hidden=shot.dataset.agentShot!==button.dataset.agentStep)}))})();

(()=>{const root=document.querySelector('.ai-case');if(!root)return;const nodes=[...root.querySelectorAll('[data-agent-node]')];const descriptions=['图像识别：整理图片中的可见信息，为后续指导提供证据，不在此环节直接给出教学结论。','信息提取：将任务、图像状态、可见证据、受众与会话状态等整理为后续节点可使用的字段。','分支判断：根据 ready 或 needs_input 等条件，决定进入观察指导、补充信息或其他输出路径。','指导 / 补问：信息足够时提供观察示范与反馈；缺少关键信息时，通过补充提问明确下一步。'];nodes.forEach(node=>node.addEventListener('click',()=>{nodes.forEach(item=>item.setAttribute('aria-pressed',String(item===node)));root.querySelector('.ai-agent-node-description').textContent=descriptions[Number(node.dataset.agentNode)]}));const steps=[...root.querySelectorAll('[data-agent-step]')];const notes=['用预设问题连接真实困惑，降低首次提问门槛。','结合上传图像与问题，从整体关系确定观察入手点。','把观察方法拆成遮挡、比较等可动手验证的动作。','请学习者先判断比例，再核对方法，引导继续观察。'];const note=root.querySelector('#agent-panel-dialogue .ai-agent-demo-note');if(note){note.textContent='实际对话回放 · '+notes[0];steps.forEach(button=>button.addEventListener('click',()=>{note.textContent='实际对话回放 · '+notes[Number(button.dataset.agentStep)]}))}})();

// Keep a visible gap between the two staggered capability cards.
(()=>{
 const canvas=document.querySelector('.ai-capability-canvas');
 const upper=canvas?.querySelector('.ai-capability-strategy');
 const lower=canvas?.querySelector('.ai-capability-delivery');
 if(!upper||!lower)return;
 const place=()=>{
  const top=upper.offsetTop+upper.offsetHeight+24;
  lower.style.top=top+'px';lower.style.bottom='auto';
  canvas.style.minHeight=(top+lower.offsetHeight+16)+'px';
 };
 place();
 if('ResizeObserver' in window){const observer=new ResizeObserver(place);observer.observe(upper);observer.observe(lower);}
 window.addEventListener('resize',place);
 document.fonts?.ready.then(place);
})();
