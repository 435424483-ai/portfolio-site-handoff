const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=__dirname;
const pages=['index.html','陈悦作品集.html',...require('./data/projects.cjs').projects.map(p=>`work/${p.id}/index.html`)];
let references=0;
for(const page of pages){
 const html=fs.readFileSync(path.join(root,page),'utf8');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,`${page}: duplicate IDs`);
 for(const m of html.matchAll(/(?:src|href|data-image)="([^"]+)"/g)){
  const ref=m[1];if(/^(?:https?:|mailto:|tel:)/.test(ref))continue;
  const [file,anchor]=ref.split('#');const resolved=file?path.resolve(root,path.dirname(page),file):path.join(root,page);
  assert.ok(fs.existsSync(resolved),`${page}: missing ${ref}`);
  if(anchor)assert.ok(fs.readFileSync(resolved,'utf8').includes(`id="${anchor}"`),`${page}: missing anchor ${ref}`);
  references++;
 }
}
const ai=fs.readFileSync(path.join(root,'work/ai-education/index.html'),'utf8');
const wall=ai.split('class="ppt-wall"')[1].split('class="meeting-gallery')[0];
assert.equal([...wall.matchAll(/<figure/g)].length,5);
for(let i=1;i<=5;i++)assert.ok(wall.includes(`s2_${i}.jpg`));
assert.ok(!wall.includes('s2_6.jpg')&&!wall.includes('s2_7.jpg'));
const museum=fs.readFileSync(path.join(root,'work/museum/index.html'),'utf8');
const activity=id=>museum.split(`id="${id}"`)[1].split('</section>')[0];
const files=html=>[...new Set([...html.matchAll(/s8_(\d+)\.jpg/g)].map(m=>+m[1]))].sort((a,b)=>a-b);
assert.deepEqual(files(activity('museum-day')),[1,4,5,6,7]);
assert.deepEqual(files(activity('school-outreach')),[2,3,8,9,10,14,15,16]);
assert.deepEqual(files(activity('new-year')),[17,18,19]);
assert.ok(!museum.includes('每一种载体，都重新组织一次信息'));
assert.equal([...museum.matchAll(/class="sphere-card"/g)].length,6);
assert.equal([...museum.matchAll(/class="fan-card"/g)].length,3);
assert.equal([...museum.matchAll(/data-campaign-link=/g)].length,3);
const report={pages:pages.length,checkedLocalReferences:references,pptColumns:5,museumActivityGroups:3,sphereCards:6,fanCards:3,missingAssets:0};
fs.writeFileSync(path.join(root,'validation-exhibits.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
