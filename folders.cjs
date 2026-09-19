module.exports=function folders(projects,casepage,esc){
 const labels=['AI 教育','MAZOO 海缘妈祖','博物馆文化传播','瓷厝听潮'];
 return `<div class="project-folders">${projects.map((p,i)=>{
  let content=casepage(p).match(/<main id="main">([\s\S]*?)<\/main>/)[1];
  content=content.replace(/<div class="wrap next-project">[\s\S]*?<\/div>/,'');
  content=content.replace('href="../../index.html#work">← 返回核心项目','href="work/'+p.id+'/index.html">在独立页面阅读 ↗');
  content=content.replaceAll('../../','').replaceAll('fetchpriority="high"','loading="lazy"');
  const ids=[...content.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  for(const id of ids){const prefixed='folder-'+p.id+'-'+id;content=content.replaceAll(`id="${id}"`,`id="${prefixed}"`).replaceAll(`href="#${id}"`,`href="#${prefixed}"`).replaceAll(`aria-controls="${id}"`,`aria-controls="${prefixed}"`).replaceAll(`aria-labelledby="${id}"`,`aria-labelledby="${prefixed}"`).replaceAll(`aria-describedby="${id}"`,`aria-describedby="${prefixed}"`).replaceAll(`data-campaign-link="${id}"`,`data-campaign-link="${prefixed}"`)}
  return `<details class="project-folder folder-${i+1}" id="folder-${p.id}"><summary class="folder-cover" aria-controls="folder-content-${p.id}"><span class="folder-tab"><span class="folder-number">0${i+1}</span><span>${labels[i]}</span></span><span class="folder-info"><span class="folder-eyebrow">${esc(p.eyebrow)}</span><span class="folder-title">${esc(p.title)}</span><span class="folder-tags">${p.tags.slice(0,3).map(esc).join(' / ')}</span></span><span class="folder-action"><span class="folder-open-label">展开项目</span><span class="folder-close-label">收起项目</span><span class="folder-arrow" aria-hidden="true">↗</span></span></summary><div class="folder-content" id="folder-content-${p.id}">${content}<div class="folder-end"><a class="text-link" href="work/${p.id}/index.html">在独立页面阅读 ↗</a><button type="button" data-close-folder>收起这个项目 ↑</button></div></div></details>`;
 }).join('')}</div>`;
};
