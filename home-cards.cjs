module.exports=function renderCards(projects,{esc,tags}){
 const SCENE={
  'ai-education':{name:'智启 AI+教育',tagline:'让复杂的 AI 产品更容易理解与使用',summary:'面向政府、学校与教师重新组织 AI 教育产品信息，将方案汇报、产品传播与教师培训连接到真实使用场景。'},
  'mazoo':{name:'MAZOO 海缘妈祖',tagline:'从传统文化到年轻品牌'},
  'museum':{name:'厦门大学人类博物馆',tagline:'让文物知识更容易被公众理解'},
  'cichutingchao':{name:'瓷厝听潮',tagline:'从空间问题出发设计公共艺术'}
 };
 return `<div class="project-list">${projects.map((p,i)=>{const s=SCENE[p.id]||{};const stats=p.results&&p.results.length?`<div class="card-result">${p.results.slice(0,3).map(([v,l])=>`<span class="metric"><b class="metric-number">${v}</b><small class="metric-label">${l}</small></span>`).join('')}</div>`:`<p class="scene-award">${esc(p.award||'')}</p>`;return `<article class="project-scene ${p.color} ${i%2?'scene-left':'scene-right'}" data-project="${p.id}"><div class="card-copy"><p class="scene-no">${p.no}</p><h3 class="scene-name"><a href="work/${p.id}/index.html">${s.name||p.title}</a></h3><p class="scene-tagline">${s.tagline||p.subtitle}</p><p class="scene-summary">${s.summary||p.summary}</p>${stats}<a class="scene-more" href="work/${p.id}/index.html">查看项目 →</a></div><a class="card-image" href="work/${p.id}/index.html" aria-label="${esc(p.cover.caption)}"><img src="${p.cover.file}" alt="${esc(p.cover.caption)}" loading="lazy"></a></article>`}).join('')}</div>`;
};


