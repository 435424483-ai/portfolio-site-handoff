const fs=require('node:fs'),path=require('node:path');
const root=__dirname,out=path.join(root,'..','publish-2026');
const pages=['index.html','陈悦作品集.html',...require('./data/projects.cjs').projects.map(p=>'work/'+p.id+'/index.html')];
const files=new Set([...pages,'autumn.css','autumn.js','local-fonts.json']);
let count=0;
for(const page of pages){const html=fs.readFileSync(path.join(root,page),'utf8');
 if(/<iframe\b/i.test(html))throw new Error('Unexpected wrapper in '+page);
 for(const match of html.matchAll(/(?:src|href|data-image)="([^"]+)"/g)){
 const ref=match[1].replace(/&amp;/g,'&');if(/^(mailto:|tel:|https?:|#)/.test(ref))continue;
 const [rel,hash]=ref.split('#');const resolved=path.resolve(root,path.dirname(page),rel);
 if(!fs.existsSync(resolved))throw new Error('Missing link: '+page+' -> '+ref);
 if(hash&&path.extname(resolved)==='.html'){const target=fs.readFileSync(resolved,'utf8');if(!target.includes('id="'+hash+'"'))throw new Error('Missing anchor '+ref)}
 files.add(path.relative(root,resolved));count++;
 }
}
fs.mkdirSync(out,{recursive:true});
for(const rel of files){const dest=path.join(out,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,rel),dest)}
fs.writeFileSync(path.join(out,'.nojekyll'),'');
fs.writeFileSync(path.join(root,'..','work','autumn-validation.json'),JSON.stringify({pages:pages.length,checkedReferences:count,packagedFiles:files.size+1,totalBytes:[...files].reduce((n,f)=>n+fs.statSync(path.join(root,f)).size,0),missingAssets:0,usesIframe:false},null,2));
console.log('Validated '+pages.length+' pages, '+count+' local references. Packaged '+files.size+' files into '+out);
