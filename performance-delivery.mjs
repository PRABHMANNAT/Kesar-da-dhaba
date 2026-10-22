// Build-time delivery optimization. Source styles/scripts and original media stay intact.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
export function optimizeDelivery(root='dist'){
 const manifest=JSON.parse(fs.readFileSync('performance-media.json','utf8'));
 const output=path.join(root,'assets/performance');fs.mkdirSync(output,{recursive:true});
 const writeAsset=(body,extension)=>{const name=createHash('sha256').update(body).digest('hex').slice(0,16)+'.'+extension;fs.writeFileSync(path.join(output,name),body);return '/assets/performance/'+name;};
 const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
 const rewrite=text=>text.replace(/\/assets\/[^\s"'<>\)]+?\.(?:png|jpg|jpeg|webp|woff)\b/g,url=>manifest[url]?.src||url).replace(/format\(['"]woff['"]\)/g,"format('woff2')");
 const deferredMaps=writeAsset(`(()=>{const frames=document.querySelectorAll('iframe[data-perf-src]');const load=f=>{f.src=f.dataset.perfSrc;delete f.dataset.perfSrc};if(!('IntersectionObserver' in window)){frames.forEach(load);return}const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){load(e.target);observer.unobserve(e.target)}}),{rootMargin:'800px'});frames.forEach(f=>observer.observe(f))})();`,'js');
 for(const file of walk(root).filter(f=>f.endsWith('.html'))){
  let html=fs.readFileSync(file,'utf8');
  html=html.replace(/<img\b[^>]*>/g,(tag,index)=>{
   const url=tag.match(/\bsrc="([^"]+)"/)?.[1],entry=manifest[url];if(!entry)return tag;
   const context=html.slice(Math.max(0,index-500),index);
   let sizes='100vw';
   if(/celebs-photo|kh-photo/.test(context))sizes='(max-width:760px) 50vw, 33vw';
   else if(/journal-card-image|kh-story/.test(context))sizes='(max-width:760px) 100vw, 33vw';
   else if(/footer-legacy-sign/.test(tag))sizes='160px';
   else if(/brand|monogram/.test(url))sizes='64px';
   if(!/\bsrcset=/.test(tag)&&entry.variants?.length>1)tag=tag.replace(/>$/,` srcset="${entry.variants.map(v=>v.src+' '+v.width+'w').join(', ')}" sizes="${sizes}">`);
   return tag;
  });
  // The original cascade is concatenated byte-for-byte in its original order.
  const styles=[...html.matchAll(/<link rel="stylesheet" href="(\/[^"?]+\.css)">/g)];
  if(styles.length){const body=styles.map(m=>rewrite(fs.readFileSync(path.join(root,m[1]),'utf8'))).join('\n');const bundle=writeAsset(body,'css');let first=true;html=html.replace(/<link rel="stylesheet" href="(\/[^"?]+\.css)">/g,()=>{if(!first)return '';first=false;return `<link rel="stylesheet" href="${bundle}">`;});}
  html=html.replace(/<script src="(\/[^"?]+\.js)"([^>]*)><\/script>/g,(tag,url,attrs)=>`<script src="${writeAsset(fs.readFileSync(path.join(root,url)),'js')}"${attrs}></script>`);
  html=html.replace(/<iframe\b[^>]*\bloading="lazy"[^>]*><\/iframe>/g,tag=>tag.replace('src=','data-perf-src=')+`<noscript>${tag}</noscript>`);
  if(html.includes('data-perf-src='))html=html.replace('</body>',`<script src="${deferredMaps}" defer></script></body>`);
  html=rewrite(html);
  // Font preloads share exactly the URLs used by the stylesheet, avoiding duplicate downloads.
  for(const url of ['/assets/futura.woff','/assets/maragsa-display.woff']){
   const src=manifest[url]?.src;if(src&&!html.includes(`href="${src}"`))html=html.replace('</head>',`<link rel="preload" href="${src}" as="font" type="font/woff2" crossorigin></head>`);
  }
  html=html.replace(/type="font\/woff"/g,'type="font/woff2"');
  fs.writeFileSync(file,html);
 }
}
