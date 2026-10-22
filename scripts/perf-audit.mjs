import fs from 'node:fs';
import path from 'node:path';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
const args=process.argv.slice(2),phase=args.find(x=>x.startsWith('--phase='))?.split('=')[1]||'final';
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const routes=walk('dist').filter(f=>f.endsWith('.html')).map(f=>'/'+path.relative('dist',f).replaceAll('\\','/').replace(/index\.html$/,''));
const selected=args.find(x=>x.startsWith('--route='))?.slice(8);
const devices=args.includes('--mobile')?['mobile']:args.includes('--desktop')?['desktop']:['mobile','desktop'];
const dir=`docs/performance/${phase}`;fs.mkdirSync(dir,{recursive:true});
const results=[];
for(const route of selected?[selected]:routes)for(const device of devices){
 const slug=route==='/'?'home':route.replace(/^\/|\/$/g,'').replaceAll('/','__');const outfile=`${dir}/${slug}-${device}.json`;
 if(fs.existsSync(outfile)&&!args.includes('--force')){results.push(JSON.parse(fs.readFileSync(outfile)));continue;}
 const chrome=await launch({chromePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',chromeFlags:['--headless=new','--no-first-run','--disable-background-networking']});
 try{const run=await lighthouse((process.env.PERF_URL||'http://127.0.0.1:5180')+route,{port:chrome.port,output:'json',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']},device==='desktop'?{extends:'lighthouse:default',settings:{formFactor:'desktop',screenEmulation:{mobile:false,width:1350,height:940,deviceScaleFactor:1,disabled:false},throttling:{rttMs:40,throughputKbps:10240,cpuSlowdownMultiplier:1,requestLatencyMs:0,downloadThroughputKbps:0,uploadThroughputKbps:0}}}:undefined);
 fs.writeFileSync(outfile,JSON.stringify(run.lhr));results.push(run.lhr);console.log(route,device,run.lhr.categories.performance.score,run.lhr.runtimeError?.message||'');
 }catch(error){console.error(route,device,error.message);fs.writeFileSync(`${outfile}.error.txt`,error.stack);}finally{await chrome.kill();}
}
const rows=results.map(r=>[new URL(r.finalDisplayedUrl).pathname,r.configSettings.formFactor,...Object.values(r.categories).map(c=>Math.round(c.score*100)),...['first-contentful-paint','largest-contentful-paint','speed-index','total-blocking-time','cumulative-layout-shift','server-response-time','total-byte-weight'].map(k=>r.audits[k]?.numericValue??'—')]);
fs.writeFileSync(`${dir}/results.md`,'| Route | Device | Performance | Accessibility | Best practices | SEO | FCP ms | LCP ms | SI ms | TBT ms | CLS | TTFB ms | Bytes |\n|'+Array(13).fill('---').join('|')+'|\n'+rows.map(r=>'|'+r.join('|')+'|').join('\n')+'\n');
