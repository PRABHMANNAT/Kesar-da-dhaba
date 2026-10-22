import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const folder = path.resolve('dist/assets/original-blogs');
await fs.mkdir(folder, {recursive:true});
const queue = JSON.parse(await fs.readFile('original-blogs/resource-plan.json', 'utf8'));
const cache = new Map();
try {
  for (const item of JSON.parse(await fs.readFile('qa/menu-mirrored-assets.json', 'utf8')).assets) cache.set(item.source, path.resolve('dist' + item.file));
} catch {}
const archiveRoot = path.resolve('../ADDITIONAL ASSETS DOWNLOADED FROM KESAR DA DHABA WEBSITE');
const archive = JSON.parse((await fs.readFile(path.join(archiveRoot, 'ASSET-INDEX.json'), 'utf8')).replace(/^\uFEFF/, ''));
const originals = new Map(archive.Assets.filter(a => a.SourceAssetUrl).map(a => [new URL(a.SourceAssetUrl).pathname, path.join(archiveRoot, a.NewPath)]));
const name = url => {
  const u = new URL(url);
  const basename = (path.posix.basename(u.pathname) || 'asset.css').replace(/[^a-zA-Z0-9._-]/g, '_');
  return crypto.createHash('sha1').update(url).digest('hex').slice(0,10) + '-' + basename + (u.hostname === 'fonts.googleapis.com' ? '.css' : '');
};
const allowed = new Set(['kesardadhaba.com','fonts.googleapis.com','fonts.gstatic.com','code.jquery.com','patiotime.loftocean.com']);
const resolve = (value, base) => {
  try {
    const u = new URL(value, base);
    if (!/^https?:$/.test(u.protocol) || !allowed.has(u.hostname)) return null;
    u.hash = ''; return u.href;
  } catch { return null; }
};
const seen = new Set(), assets = [], failures = [];
async function mirror(value) {
  const url = resolve(value, value);
  if (!url || seen.has(url)) return;
  seen.add(url);
  try {
    const u = new URL(url), isCSS = u.pathname.endsWith('.css') || u.hostname === 'fonts.googleapis.com';
    const cached = !isCSS && (cache.get(url) || (u.hostname === 'kesardadhaba.com' && originals.get(u.pathname)));
    let bytes;
    if (cached) bytes = await fs.readFile(cached);
    else {
      const response = await fetch(url, {signal:AbortSignal.timeout(35000), headers:{'User-Agent':'Mozilla/5.0','Referer':'https://kesardadhaba.com/blogs/'}});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      bytes = Buffer.from(await response.arrayBuffer());
    }
    if (isCSS) {
      let css = bytes.toString('utf8');
      css = css.replace(/url\(\s*(['"]?)(.*?)\1\s*\)/g, (match, quote, value) => {
        const dependency = resolve(value, url);
        if (!dependency) return match;
        queue.push(dependency);
        return `url('/assets/original-blogs/${name(dependency)}${new URL(value,url).hash}')`;
      }).replace(/@import\s+(['"])([^'"]+)\1/g, (match, quote, value) => {
        const dependency = resolve(value, url);
        if (!dependency) return match;
        queue.push(dependency);return `@import '/assets/original-blogs/${name(dependency)}'`;
      });
      bytes = Buffer.from(css);
    }
    const file = '/assets/original-blogs/' + name(url);
    await fs.writeFile('dist' + file, bytes);
    assets.push({source:url, file, bytes:bytes.length, reused:!!cached});
  } catch (error) { failures.push({url, error:String(error)}); }
}
while (queue.length) await Promise.all(queue.splice(0,8).map(mirror));
let html = await fs.readFile('original-blogs/template.html', 'utf8');
for (const asset of [...assets].sort((a,b) => b.source.length-a.source.length)) {
  html = html.replaceAll(asset.source.replaceAll('&','&amp;'), asset.file).replaceAll(asset.source, asset.file);
}
await fs.writeFile('original-blogs/page.html', html);
await fs.writeFile('original-blogs/assets.json', JSON.stringify({sourcePage:'https://kesardadhaba.com/blogs/',capturedOn:'2026-10-22',assets,failures},null,2)+'\n');
console.log(JSON.stringify({assets:assets.length,reused:assets.filter(a=>a.reused).length,bytes:assets.reduce((sum,a)=>sum+a.bytes,0),failures},null,2));
