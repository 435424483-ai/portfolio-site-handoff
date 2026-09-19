const data=require('./data/projects.cjs');
const campaigns=require('./data/campaigns.cjs');
data.projects.find(p=>p.id==='ai-education').sections[0].pptWall=true;
const museum=data.projects.find(p=>p.id==='museum');
museum.sections= museum.sections.filter(s=>s.kicker!=='CONTENT TRANSLATION');
museum.sections.find(s=>s.kicker==='CAMPAIGN').campaigns=campaigns;
museum.sections.find(s=>s.kicker==='VISUAL & PRODUCT').groups=[
 {id:'museum-cultural-product',title:'文创设计',images:[{file:'assets/2026/s9_2.jpg',caption:'陈嘉庚与厦门大学纪念展馆'},{file:'assets/2026/s9_1.jpg',caption:'人类博物馆文创实物'},{file:'assets/2026/s9_13.jpg',caption:'铜镜气囊手机支架'},{file:'assets/2026/s9_14.jpg',caption:'鼎气囊手机支架'},{file:'assets/2026/s9_5.jpg',caption:'新年红包封面'},{file:'assets/2026/s9_15.png',caption:'微信红包气泡展示'}]},
 {id:'museum-festival-poster',title:'节日海报',images:[{file:'assets/2026/s9_8.jpg',caption:'中秋节日海报'},{file:'assets/2026/s9_9.jpg',caption:'元宵节日海报'},{file:'assets/2026/s9_12.jpg',caption:'端午节日海报'},{file:'assets/2026/s9_16.jpg',caption:'元旦节日海报'}]},
 {id:'museum-lecture-poster',title:'讲座海报',images:[{file:'assets/2026/s9_7.jpg',caption:'讲座海报'},{file:'assets/2026/s9_10.jpg',caption:'学术讲座海报'},{file:'assets/2026/s9_18.jpg',caption:'书画修复学术讲座海报'},{file:'assets/2026/s9_17.jpg',caption:'闽地藏珍学术讲座海报'}]}
];

const mazoo=data.projects.find(p=>p.id==='mazoo');
mazoo.sections.forEach(s=>s.images=s.images.filter(im=>!im.file.endsWith('/s23_1.jpg')));
mazoo.sections.push({kicker:'PROJECT PITCH',title:'项目路演 PPT',text:'从文化背景、市场洞察到用户分析，呈现 MAZOO 海缘妈祖的项目定位与产品价值。',roadshow:true,images:[]});
museum.sections.push({kicker:'WECHAT & ILLUSTRATION',title:'公众号策划与插图设计',text:'围绕馆藏文物、主题活动与节日情境，组织选题、图文叙事与插图表达，让博物馆知识进入更轻松的线上阅读场景。',wechat:true,images:[{file:'assets/museum/wechat-1.jpg',caption:'文物主题科普',description:'以轻松的文物叙事串联器物知识，用插图建立阅读记忆点。'},{file:'assets/museum/wechat-2.jpg',caption:'国际博物馆日活动预告',description:'将活动信息组织为图文长页，连接主题介绍、参与方式与现场体验。'},{file:'assets/museum/wechat-3.jpg',caption:'文物的新年状态',description:'把馆藏器物与新年情境结合，以主题插图和日常语言传递文化内容。'}]});
module.exports=function renderExhibit(s,i,base,{photo,esc}) {
 const heading=`<p class="eyebrow">0${i+1} / ${s.kicker}</p><h2>${s.title}</h2><p>${s.text}</p>`;
 if(s.wechat){return `<section class="case-section museum-wechat" id="step-${i+1}"><div class="case-text">${heading}<p class="wechat-hint">点击推文，放大阅读完整长图 ↗</p></div><div class="wechat-grid">${s.images.map((im,n)=>`<article class="wechat-card"><header><p class="eyebrow">0${n+1} / EDITORIAL</p><h3>${esc(im.caption)}</h3><p>${esc(im.description)}</p></header>${photo(im,base)}</article>`).join('')}</div></section>`;}
 if(s.pptWall) {
  const names=['政企项目汇报','教育合作方案','产品方案汇报','产品能力与应用场景','产品与服务方案'];
  return `<section class="case-section ppt-section" id="step-${i+1}"><div class="case-text">${heading}</div><div class="ppt-wall" aria-label="五组政企 PPT 展示墙">${names.map((name,n)=>photo({file:`assets/2026/s2_${n+1}.jpg`,caption:`0${n+1} / ${name}`},base)).join('')}</div><div class="meeting-gallery gallery">${s.images.slice(-2).map(im=>photo(im,base)).join('')}</div></section>`;
 }
 if(s.roadshow){
  const titles=['品牌封面','目录','项目概述','文化背景','市场分析：行业痛点','市场分析：产品优势','用户分析：人群画像','用户分析：消费偏好','市场竞争分析'];
  return `<section class="case-section roadshow-section" id="step-${i+1}"><div class="case-text">${heading}</div><div class="roadshow-wall" aria-label="MAZOO 九页项目路演 PPT，按列从上到下阅读">${titles.map((title,n)=>photo({file:`assets/autumn/s23_${n+1}.jpg`,caption:`MAZOO 项目路演 · ${String(n+1).padStart(2,'0')} / ${title}`},base)).join('')}</div></section>`;
 }
 if(!s.campaigns&&!s.groups)return '';
 const productStrip=g=>{
 const envelopes=g.images.filter(im=>/\/s9_(5\.jpg|15\.png)$/.test(im.file));
 const products=g.images.filter(im=>!envelopes.includes(im));
 const group=copy=>`<div class="product-strip-group"${copy?' aria-hidden="true"':''}>${products.map(im=>`<figure class="photo"><button class="zoom" data-image="${base+im.file}" data-caption="${esc(im.caption)}" aria-label="查看完整图片：${esc(im.caption)}"${copy?' tabindex="-1"':''}><img src="${base+im.file}" alt="${copy?'':esc(im.caption)}" loading="lazy" decoding="async"><span class="zoom-label">查看完整图片 ↗</span></button><figcaption>${esc(im.caption)}</figcaption></figure>`).join('')}</div>`;
 return `<div class="product-strip"><div class="product-strip-window" tabindex="0" role="region" aria-label="文创图片，可拖动底部滚动条手动浏览"><div class="product-strip-track">${group(false)}${group(true)}</div></div><button class="product-strip-pause" type="button" aria-pressed="false">暂停滚动 Ⅱ</button></div><div class="gallery activity-gallery product-envelope-gallery">${envelopes.map(im=>photo(im,base)).join('')}</div>`;
 };
 if(s.groups){
  return `<section class="case-section campaign-section vp-section" id="step-${i+1}"><div class="case-text">${heading}<nav class="campaign-nav vp-nav" aria-label="视觉与产品阅读目录"><ol>${s.groups.map((g,n)=>`<li><a href="#${g.id}" data-campaign-link="${g.id}"><span class="reading-dot" aria-hidden="true"></span><span class="campaign-nav-copy"><span class="campaign-number">0${n+1}</span><strong>${g.title}</strong></span></a></li>`).join('')}</ol></nav></div><div class="case-images campaign-content">${s.groups.map((g,n)=>`<section class="campaign-panel" id="${g.id}" aria-labelledby="${g.id}-title"><header><p class="eyebrow">0${n+1}</p><h3 id="${g.id}-title">${g.title}</h3></header>${g.id==='museum-cultural-product'?productStrip(g):`<div class="gallery activity-gallery">${g.images.map(im=>photo(im,base)).join('')}</div>`}</section>`).join('')}</div></section>`;
 }
 const card=(im,cls,n)=>`<button class="${cls}" style="--card-index:${n}" data-image="${base+im.file}" data-caption="${esc(im.caption)}" aria-label="查看完整图片：${esc(im.caption)}"><img src="${base+im.file}" alt="${esc(im.caption)}" loading="lazy" draggable="false"></button>`;
 return `<section class="case-section campaign-section" id="step-${i+1}"><div class="case-text">${heading}<nav class="campaign-nav" aria-label="活动阅读目录"><ol>${s.campaigns.map((c,n)=>`<li><a href="#${c.id}" data-campaign-link="${c.id}"><span class="reading-dot" aria-hidden="true"></span><span class="campaign-nav-copy"><span class="campaign-number">0${n+1}</span><strong>${c.title}</strong><span class="campaign-summary">${c.text}</span>${c.detail?`<span class="campaign-detail">${c.detail}</span>`:''}</span></a></li>`).join('')}</ol></nav></div><div class="case-images campaign-content">${s.campaigns.map((c,n)=>`<section class="campaign-panel ${c.id==='new-year'?'fan-section':''}" id="${c.id}" aria-labelledby="${c.id}-title"><header><p class="eyebrow">ACTIVITY 0${n+1}</p><h3 id="${c.id}-title">${c.title}</h3></header>${c.id==='new-year'?`<p class="interaction-hint">点击一张，抽出查看完整图片</p><div class="fan-stage">${c.images.map((im,j)=>card(im,'fan-card',j)).join('')}</div>`:`<div class="gallery activity-gallery">${c.images.map(im=>photo(im,base)).join('')}</div>`}${c.posters?`<div class="school-posters"><h4>主题海报与科普展板</h4><p class="interaction-hint" id="sphere-help">拖动或滚动旋转 · 点击查看完整图片</p><div class="sphere-stage" tabindex="0" role="group" aria-label="球体海报展示，可用方向键旋转" aria-describedby="sphere-help"><div class="sphere">${c.posters.map((im,j)=>card(im,'sphere-card',j)).join('')}</div></div><div class="sphere-controls"><button type="button" data-sphere-turn="-1" aria-label="向左旋转海报">←</button><span>旋转查看</span><button type="button" data-sphere-turn="1" aria-label="向右旋转海报">→</button></div></div>`:''}</section>`).join('')}</div></section>`;
};
