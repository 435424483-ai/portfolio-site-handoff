const data=require('./data/projects.cjs');
const ai=data.projects.find(p=>p.id==='ai-education');
const training=ai.sections.find(s=>s.kicker==='TEACHER ENABLEMENT');
const misplaced=training.images.find(im=>im.file.endsWith('/s3_7.jpg'));
training.images=training.images.filter(im=>!im.file.endsWith('/s3_7.jpg'));
const product=ai.sections.find(s=>s.kicker==='PRODUCT COMMUNICATION');
if(misplaced&&!product.images.some(im=>im.file===misplaced.file))product.images.push({...misplaced,caption:'产品版本更新与功能说明'});
const project=data.projects.find(p=>p.id==='cichutingchao');
project.note='';
project.sections.find(s=>s.hotspots).installation=true;
project.sections.find(s=>s.kicker==='MATERIAL & LIGHT').installationRail=true;
const features=[
 ['cuo','厝','闽南古厝的建筑轮廓','上层以瓷片组合出闽南古厝的抽象轮廓，提取屋脊与曲线等地域建筑符号，凝练地方建筑神韵，让旅客从远处就能读到闽南的文化记忆。',29,49],
 ['ci','瓷','德化瓷艺与山海纹','装置以瓷片构建，蓝色与青绿色釉色呼应海洋。瓷片上的山海纹丰富细节与透光层次，将德化非遗瓷艺转化为当代公共空间中的材料语言。',71,61],
 ['chao','潮','潮起潮落的动态肌理','下层以蓝调渐变瓷片叠合出海浪肌理，并结合动态构件产生波浪式微动，让“潮”的意象成为可感知的空间节奏。',32,85],
 ['ting','听','潮汐声场与感官联动','设计加入轻柔的白噪音系统模拟潮汐声，把海洋意象从视觉延伸到听觉，让旅客在观看装置时感受“听潮”的沉浸体验。',73,89]
];
module.exports=(s,i,base,{photo,esc})=>{
 if(s.installation)return `<section class="case-section installation-section" id="step-${i+1}"><div class="case-text"><p class="eyebrow">02 / CULTURAL CONCEPT</p><h2>瓷、厝、听、潮</h2><p>以闽南“厝与海”的千年共生为灵感，将建筑符号、海洋文化与德化非遗瓷艺融入悬吊装置。</p><p class="interaction-hint">移动鼠标，感受轻晃；点击装置上的四处标记，探索文化与功能。</p></div><div class="hanging-experience"><div class="hanging-stage"><div class="device-entry"><div class="hanging-device"><img src="${base}assets/2026/s14_1.jpg" alt="瓷厝听潮悬吊装置，包含古厝轮廓、瓷片与下层海浪" loading="lazy" draggable="false">${features.map(([key,word,title,,x,y],n)=>`<button type="button" class="device-hotspot" style="left:${x}%;top:${y}%" data-feature="${key}" aria-label="${word}：${title}" aria-controls="feature-${key}" aria-expanded="false"><span>${word}</span><i aria-hidden="true">${String(n+1).padStart(2,'0')}</i></button>`).join('')}</div></div></div><aside class="device-explanation"><p class="eyebrow">EXPLORE THE INSTALLATION</p><h3>一座厝，一片海。</h3><p class="feature-intro">从四处细节，读懂装置的文化来源与感官体验。</p>${features.map(([key,word,title,text])=>`<article class="device-feature" id="feature-${key}" hidden><span class="feature-word">${word}</span><h4>${title}</h4><p>${text}</p></article>`).join('')}</aside></div></section>`;
 if(s.installationRail)return `<section class="case-section installation-renderings" id="step-${i+1}"><div class="case-text"><p class="eyebrow">03 / MATERIAL & LIGHT</p><h2>${s.title}</h2><p>${s.text}</p></div><div class="rendering-carousel" role="region" aria-label="装置效果图轮播"><div class="rendering-controls"><p class="interaction-hint">横向浏览不同视角 · 点击查看完整效果图</p><div><button type="button" data-rail-prev aria-label="上一张效果图">←</button><button type="button" data-rail-pause aria-pressed="false">暂停滚动</button><button type="button" data-rail-next aria-label="下一张效果图">→</button></div></div><div class="rendering-viewport" tabindex="0" aria-label="效果图，可用左右方向键浏览"><div class="rendering-track">${[0,1,2].map(copy=>`<div class="rendering-set" ${copy!==1?'aria-hidden="true"':''}>${s.images.map(im=>copy===1?photo(im,base):photo(im,base).replace('<button ', '<button tabindex="-1" ')).join('')}</div>`).join('')}</div></div></div></section>`;
 return '';
};
