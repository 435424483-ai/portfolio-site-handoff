(()=>{
 const fontCatalogURL=new URL('./local-fonts.json',document.currentScript.src);
 const KEY='chen-yue-typography-v1';
 const fonts={original:'原始字体',sans:'现代黑体',yahei:'微软雅黑',song:'宋体',kai:'楷体',serif:'Georgia 衬线'};
 const families={sans:'Arial, "Microsoft YaHei", "PingFang SC", sans-serif',yahei:'"Microsoft YaHei", sans-serif',song:'SimSun, "Songti SC", serif',kai:'KaiTi, STKaiti, serif',serif:'Georgia, "Times New Roman", SimSun, serif'};
 const defaults=()=>({font:'original',body:100,title:100,label:100,pages:{}});
 let settings=defaults();try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&typeof saved==='object')settings={...settings,...saved,pages:saved.pages&&typeof saved.pages==='object'?saved.pages:{}}}catch{}
 const registerFont=name=>{if(typeof name!=='string'||!name.trim()||name.length>160||/[\x00-\x1f]/.test(name))return null;name=name.trim();const key='local:'+name;fonts[key]=name;families[key]=JSON.stringify(name)+', sans-serif';return key};
 const restoreFont=key=>{if(typeof key==='string'&&key.startsWith('local:'))registerFont(key.slice(6))};
 restoreFont(settings.font);Object.values(settings.pages).forEach(page=>{if(page&&typeof page==='object')Object.values(page).forEach(item=>restoreFont(item?.font))});
 const html=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const clamp=(value,min,max,fallback)=>Number.isFinite(+value)?Math.min(max,Math.max(min,+value)):fallback;
 if(!fonts[settings.font])settings.font='original';
 for(const key of ['body','title','label'])settings[key]=clamp(settings[key],70,160,100);
 const page=location.pathname.replace(/陈悦作品集\.html$/,'index.html');
 const options=()=>Object.entries(fonts).map(([value,label])=>`<option value="${html(value)}">${html(label)}</option>`).join('');
 const launch=document.createElement('button');launch.className='type-launch';launch.textContent='Aa 字体编辑';launch.setAttribute('aria-controls','type-panel');launch.setAttribute('aria-expanded','false');
 const panel=document.createElement('aside');panel.id='type-panel';panel.className='type-panel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-labelledby','type-title');
 panel.innerHTML=`<header><h2 id="type-title">字体与字号</h2><button type="button" data-close aria-label="关闭字体编辑器">×</button></header><p class="type-help">先点选文字，再调整这一处的字体或字号。修改自动保存在当前浏览器。</p><section><details data-global-details><summary>全站调整（影响所有页面）</summary><p class="type-help">选中文字时，这组控件会锁定。</p><fieldset data-global><label for="type-font">字体</label><select id="type-font">${options()}</select>${[['body','正文'],['title','标题'],['label','图注与小字']].map(([key,label])=>`<label for="type-${key}">${label}大小 <output id="type-${key}-value"></output></label><input id="type-${key}" type="range" min="70" max="160" step="5">`).join('')}</fieldset></details></section><section><h3>只调整选中的文字</h3><button type="button" class="type-pick" aria-pressed="false">点选页面文字</button><p class="type-selection">尚未选择文字</p><fieldset data-local disabled><button type="button" data-load-fonts>读取电脑字体</button><p class="type-help">读取后可从下方列表选择本机字体。</p><label for="type-local-font">这一处的字体</label><select id="type-local-font">${options().replace('原始字体','跟随全站')}</select><label for="type-local-size">这一处的字号（px）</label><input id="type-local-size" type="number" min="10" max="120" step="1"><div class="type-actions"><button type="button" data-clear-local>恢复这一处</button><button type="button" data-deselect>取消选择</button></div></fieldset></section><div class="type-actions"><button type="button" data-reset>恢复全部默认</button></div><p class="type-help" role="status" data-status>可随时关闭面板，继续浏览。</p>`;
 document.body.append(launch,panel);
 const nodes=[...document.querySelectorAll('#main *, .site-header *, footer *')].filter(el=>!['SCRIPT','STYLE','SVG','PATH'].includes(el.tagName)&&[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()));
 const selector=el=>{const parts=[];while(el&&el!==document.body){if(el.id){parts.unshift('#'+CSS.escape(el.id));break}let n=1;for(let p=el.previousElementSibling;p;p=p.previousElementSibling)if(p.tagName===el.tagName)n++;parts.unshift(el.tagName.toLowerCase()+`:nth-of-type(${n})`);el=el.parentElement}return parts.join(' > ')};
 const entries=nodes.map(el=>({el,key:selector(el),size:parseFloat(getComputedStyle(el).fontSize),family:getComputedStyle(el).fontFamily,inlineFamily:el.style.fontFamily,inlineSize:el.style.fontSize,group:el.closest('h1,h2,h3,h4')?'title':el.closest('.eyebrow,figcaption,small,.tags,.zoom-label')?'label':'body'}));
 let selected=null,picking=false,hovered=null;
 const overrides=()=>settings.pages[page]||{};
 // Pin each text element to its own baseline so a parent's local style cannot leak into other text.
 const applyEntry=entry=>{const local=overrides()[entry.key]||{},font=fonts[local.font]&&local.font!=='original'?local.font:settings.font;entry.el.style.fontFamily=families[font]||entry.family;entry.el.style.fontSize=(local.size?clamp(local.size,10,120,entry.size):entry.size*settings[entry.group]/100)+'px'};
 const apply=()=>entries.forEach(applyEntry);
 const status=panel.querySelector('[data-status]');
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(settings));status.textContent='已自动保存到当前浏览器。'}catch{status.textContent='当前浏览器无法保存设置，本次预览仍然生效。'}};
 const pickButton=panel.querySelector('.type-pick');
 const stopPick=()=>{picking=false;pickButton.setAttribute('aria-pressed','false');pickButton.textContent='点选页面文字';hovered?.classList.remove('type-target');hovered=null};
 const setOpen=open=>{panel.hidden=!open;launch.setAttribute('aria-expanded',String(open));if(open)panel.querySelector('[data-close]').focus();else{stopPick();selected?.el.classList.remove('type-chosen');launch.focus()}};
 launch.addEventListener('click',()=>setOpen(panel.hidden));panel.querySelector('[data-close]').addEventListener('click',()=>setOpen(false));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){setOpen(false)}});
 const syncGlobal=()=>{panel.querySelector('#type-font').value=settings.font;for(const key of ['body','title','label']){panel.querySelector('#type-'+key).value=settings[key];panel.querySelector('#type-'+key+'-value').textContent=settings[key]+'%'}};
 panel.querySelector('#type-font').addEventListener('change',e=>{settings.font=e.target.value;apply();save()});
 for(const key of ['body','title','label'])panel.querySelector('#type-'+key).addEventListener('input',e=>{settings[key]=+e.target.value;syncGlobal();apply();save()});
 const syncLocal=()=>{document.dispatchEvent(new CustomEvent('portfolio-text-selection',{detail:selected?{element:selected.el,key:selected.key}:null}));panel.querySelector('[data-local]').disabled=!selected;panel.querySelector('[data-global]').disabled=!!selected;if(selected)panel.querySelector('[data-global-details]').open=false;if(!selected)return;panel.querySelector('#type-local-font').value=overrides()[selected.key]?.font||'original';panel.querySelector('#type-local-size').value=Math.round(parseFloat(getComputedStyle(selected.el).fontSize));panel.querySelector('.type-selection').textContent='已选择：'+selected.el.textContent.trim().slice(0,65)};
 pickButton.addEventListener('click',()=>{if(picking){stopPick();return}picking=true;pickButton.setAttribute('aria-pressed','true');pickButton.textContent='请点击页面上的文字…'});
 const candidate=target=>{let el=target;while(el&&el!==document.body){const found=entries.find(entry=>entry.el===el);if(found)return found;el=el.parentElement}return null};
 document.addEventListener('pointerover',e=>{if(!picking||panel.contains(e.target))return;hovered?.classList.remove('type-target');hovered=candidate(e.target)?.el;hovered?.classList.add('type-target')});
 document.addEventListener('click',e=>{if(!picking||panel.contains(e.target)||launch.contains(e.target))return;const entry=candidate(e.target);if(!entry)return;e.preventDefault();e.stopImmediatePropagation();selected?.el.classList.remove('type-chosen');selected=entry;stopPick();selected.el.classList.add('type-chosen');syncLocal();panel.querySelector('#type-local-size').focus()},true);
 const updateLocal=field=>{if(!selected)return;const input=panel.querySelector('#type-local-size');if(field==='size'&&(!input.value||!input.checkValidity()))return;settings.pages[page]??={};const local={...overrides()[selected.key]};if(field==='font')local.font=panel.querySelector('#type-local-font').value;else local.size=+input.value;settings.pages[page][selected.key]=local;applyEntry(selected);save()};
 panel.querySelector('#type-local-font').addEventListener('change',()=>updateLocal('font'));panel.querySelector('#type-local-size').addEventListener('input',()=>updateLocal('size'));
 panel.querySelector('[data-deselect]').addEventListener('click',()=>{selected?.el.classList.remove('type-chosen');selected=null;stopPick();syncLocal();panel.querySelector('.type-selection').textContent='尚未选择文字'});
 const loadFonts=panel.querySelector('[data-load-fonts]');
 loadFonts.addEventListener('click',async()=>{
  loadFonts.disabled=true;status.textContent='正在读取电脑字体…';
  try{
   let names;
   if(typeof window.queryLocalFonts==='function'){const available=await window.queryLocalFonts();names=available.map(item=>item.family)}
   else{const response=await fetch(fontCatalogURL);if(!response.ok)throw new Error('catalog');const catalog=await response.json();if(!Array.isArray(catalog.families))throw new Error('catalog');names=catalog.families}
   const unique=[...new Set(names)].sort((a,b)=>a.localeCompare(b,'zh-CN'));
   for(const name of unique)registerFont(name);
   for(const id of ['type-font','type-local-font']){const select=panel.querySelector('#'+id),value=select.value;select.innerHTML=options();select.options[0].textContent=id==='type-local-font'?'跟随全站':'原始字体';select.value=value}
   status.textContent=`已载入 ${unique.length} 种本机字体。选择字体只修改当前选中文字。`;
  }catch(error){status.textContent=error.name==='NotAllowedError'?'尚未获得字体读取权限，请允许后重试。':'暂时无法读取电脑字体，请重试。'}
  finally{loadFonts.disabled=false}
 });
 panel.querySelector('[data-clear-local]').addEventListener('click',()=>{if(selected&&settings.pages[page])delete settings.pages[page][selected.key];if(selected)applyEntry(selected);syncLocal();save()});
 panel.querySelector('[data-reset]').addEventListener('click',()=>{settings=defaults();apply();syncGlobal();syncLocal();save()});
 let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{entries.forEach(entry=>{entry.el.style.fontSize=entry.inlineSize;entry.el.style.fontFamily=entry.inlineFamily});entries.forEach(entry=>{entry.size=parseFloat(getComputedStyle(entry.el).fontSize);entry.family=getComputedStyle(entry.el).fontFamily});apply();syncLocal()},120)});
 syncGlobal();apply();
})();
