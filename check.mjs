import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');let checks=0;const failures=[];
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const file of walk(root).filter(f=>f.endsWith('.html'))){const html=fs.readFileSync(file,'utf8');checks++;if((html.match(/<h1\b/g)||[]).length!==1)failures.push(`${file}: expected one H1`);for(const m of html.matchAll(/(?:href|src)="(\/[^"#]*)(#[^"]*)?"/g)){const url=m[1];const target=path.join(root,url);const resolved=fs.existsSync(target)&&fs.statSync(target).isDirectory()?path.join(target,'index.html'):target;checks++;if(!fs.existsSync(resolved))failures.push(`${file}: missing ${url}`);if(m[2]&&fs.existsSync(resolved)&&resolved.endsWith('.html')){const id=m[2].slice(1);if(!fs.readFileSync(resolved,'utf8').includes(`id="${id}"`))failures.push(`Missing anchor ${url}${m[2]}`);}}}
for(const m of fs.readFileSync(path.join(root,'styles.css'),'utf8').matchAll(/url\(['"]?(\/[^)'"\s]+)/g)){checks++;if(!fs.existsSync(path.join(root,m[1])))failures.push(`Missing CSS asset ${m[1]}`);}
if(failures.length){console.error(failures.join('\n'));process.exit(1);}console.log(`${checks} page, local-link, anchor and asset checks passed.`);
