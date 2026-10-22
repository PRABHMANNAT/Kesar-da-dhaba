import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const phase=process.argv[2]||'final',base=process.env.PERF_URL||'http://127.0.0.1:5180';
const dir=`docs/performance/${phase}/browser`;fs.mkdirSync(dir,{recursive:true});
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const routes=walk('dist').filter(f=>f.endsWith('.html')).map(f=>'/'+path.relative('dist',f).replaceAll('\\','/').replace(/index\.html$/,''));
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[];
for(const width of [375,390,768,1366,1920]){
 const height=({375:812,390:844,768:1024,1366:768,1920:1080})[width];
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
 for(const route of routes){
  const slug=route==='/'?'home':route.replace(/^\/|\/$/g,'').replaceAll('/','__');const page=await context.newPage();const errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
  await page.goto(base+route,{waitUntil:'load',timeout:60000});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(300);
  const geometry=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,headings:[...document.querySelectorAll('h1,h2')].map(e=>({text:e.textContent,top:e.getBoundingClientRect().top,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))}));
  await page.screenshot({path:`${dir}/${slug}-${width}.png`,animations:'disabled'});
  const menu=page.locator('.site-header-navigation .menu-toggle');let navigation='desktop';
  if(await menu.isVisible()){await menu.click();await page.waitForTimeout(100);navigation=await page.locator('#mobile-nav').isVisible()?'opened':'FAILED';await page.keyboard.press('Escape');if(await page.locator('#mobile-nav').isVisible())navigation+='; Escape FAILED';}
  const steps=await page.evaluate(()=>Math.ceil(document.documentElement.scrollHeight/innerHeight));
  for(let i=1;i<=steps;i++){await page.evaluate(y=>scrollTo(0,y),i*height);await page.waitForTimeout(70);}
  await page.waitForTimeout(300);
  const media=await page.evaluate(()=>({images:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>({src:i.currentSrc||i.src,loading:i.loading})),videos:[...document.querySelectorAll('video')].map(v=>({src:v.currentSrc||v.dataset.src||v.dataset.khVideo,ready:v.readyState,error:v.error?.message||null})),links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')).filter(h=>h.startsWith('/'))}));
  results.push({route,width,height,geometry,navigation,errors,failed,media});await page.close();console.log(phase,width,route,errors.length);
 }
 await context.close();
}
// Full-motion smoke evidence is separate from deterministic reduced-motion images.
const context=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'no-preference'});
await context.tracing.start({screenshots:true,snapshots:true});
const page=await context.newPage();
for(const route of ['/', '/our-menu/','/our-legacy/','/our-shop/','/reviews/','/celebrities/','/honors-recognitions/','/blogs/','/contact-us/']){
 await page.goto(base+route,{waitUntil:'load'});await page.waitForTimeout(1200);
 const before=await page.evaluate(()=>[...document.querySelectorAll('video')].map(v=>({time:v.currentTime,paused:v.paused,muted:v.muted})));
 await page.waitForTimeout(700);
 const after=await page.evaluate(()=>[...document.querySelectorAll('video')].map(v=>({time:v.currentTime,paused:v.paused,muted:v.muted})));
 await page.evaluate(()=>scrollTo(0,innerHeight));await page.waitForTimeout(1000);
 results.push({route,motion:true,before,after,animations:await page.evaluate(()=>document.getAnimations().map(a=>({state:a.playState,timing:a.effect?.getTiming()})))});
}
await context.tracing.stop({path:`${dir}/motion-trace.zip`});await context.close();await browser.close();
fs.writeFileSync(`${dir}/results.json`,JSON.stringify(results,null,2));
