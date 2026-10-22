(()=>{
 const data=JSON.parse(document.querySelector('#celebs-media').textContent);
 const dialog=document.querySelector('.celebs-viewer');
 const stage=dialog.querySelector('.celebs-viewer-stage');
 const caption=dialog.querySelector('#celebs-viewer-caption');
 const count=dialog.querySelector('.celebs-viewer-count');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let current=0,trigger=null;
 function clear(){const video=stage.querySelector('video');if(video){video.pause();video.removeAttribute('src');video.load();}stage.replaceChildren();}
 function render(index){
  current=(index+data.length)%data.length;const item=data[current];clear();
  caption.textContent=item.caption;count.textContent=`${String(current+1).padStart(2,'0')} / ${data.length}`;
  const media=document.createElement(item.type==='video'?'video':'img');
  if(item.type==='video'){media.controls=true;media.playsInline=true;media.preload='metadata';media.poster=item.poster;media.setAttribute('aria-label',item.caption);}
  else{media.alt=item.caption;media.draggable=false;}
  media.src=item.src;stage.append(media);
  if(item.type==='video')media.play().catch(()=>{});
 }
 document.querySelectorAll('[data-media]').forEach(button=>button.addEventListener('click',()=>{trigger=button;render(Number(button.dataset.media));dialog.showModal();syncPreviews();}));
 dialog.querySelector('.celebs-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{clear();syncPreviews();trigger?.focus({preventScroll:true});});
 dialog.querySelectorAll('[data-view-step]').forEach(b=>b.addEventListener('click',()=>render(current+Number(b.dataset.viewStep))));
 dialog.addEventListener('keydown',e=>{if(e.target.tagName==='VIDEO')return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();render(current+(e.key==='ArrowRight'?1:-1));}});
 let touch=null;
 stage.addEventListener('pointerdown',e=>{if(e.target.tagName==='VIDEO')return;touch={x:e.clientX,y:e.clientY};});
 stage.addEventListener('pointerup',e=>{if(!touch)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)render(current+(dx<0?1:-1));});
 stage.addEventListener('pointercancel',()=>{touch=null;});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stage.querySelector('video')?.pause();});
 const more=document.querySelector('[data-show-photos]');
 more.addEventListener('click',()=>{document.querySelectorAll('.celebs-photo[hidden]').forEach(p=>p.hidden=false);more.hidden=true;document.querySelector('[data-photo-count]').textContent='All 27 photographs';});
 document.querySelectorAll('.celebs-film-row').forEach(row=>{
  const track=row.querySelector('.celebs-film-track');
  const arrows=[...row.querySelectorAll('[data-film-step]')];
  const progress=row.querySelector('.celebs-row-progress>span');
  function update(){const max=track.scrollWidth-track.clientWidth;arrows[0].disabled=track.scrollLeft<5;arrows[1].disabled=track.scrollLeft>=max-5;progress.style.width=`${max<=0?100:25+75*Math.min(1,track.scrollLeft/max)}%`;}
  arrows.forEach(b=>b.addEventListener('click',()=>track.scrollBy({left:Number(b.dataset.filmStep)*(track.querySelector('article').getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap)),behavior:reduced?'instant':'smooth'})));
  track.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();
 });
 const featured=document.querySelector('.celebs-featured-track');
 const featuredArrows=[...document.querySelectorAll('[data-featured-step]')];
 function featuredPosition(){const step=featured.querySelector('article').getBoundingClientRect().width+parseFloat(getComputedStyle(featured).gap);const index=Math.min(2,Math.round(featured.scrollLeft/step));document.querySelector('[data-featured-position]').textContent=`0${index+1} / 03`;featuredArrows[0].disabled=featured.scrollLeft<5;featuredArrows[1].disabled=featured.scrollLeft>=featured.scrollWidth-featured.clientWidth-5;}
 featuredArrows.forEach(b=>b.addEventListener('click',()=>featured.scrollBy({left:Number(b.dataset.featuredStep)*(featured.querySelector('article').getBoundingClientRect().width+parseFloat(getComputedStyle(featured).gap)),behavior:reduced?'instant':'smooth'})));
 featured.addEventListener('scroll',featuredPosition,{passive:true});window.addEventListener('resize',featuredPosition);featuredPosition();
 const previews=[...document.querySelectorAll('[data-preview-src]')];
 const visiblePreviews=new Set();let previewsPaused=reduced;
 const previewToggle=document.querySelector('.celebs-preview-toggle');
 function syncPreviews(){previews.forEach(video=>{if(visiblePreviews.has(video)&&!previewsPaused&&!document.hidden&&!dialog.open){if(!video.hasAttribute('src'))video.src=video.dataset.previewSrc;video.muted=true;video.play().catch(()=>{});}else video.pause();});}
 function previewLabel(){previewToggle.textContent=previewsPaused?'Play previews':'Pause previews';previewToggle.setAttribute('aria-pressed',String(previewsPaused));}
 previewToggle.addEventListener('click',()=>{previewsPaused=!previewsPaused;previewLabel();syncPreviews();});previewLabel();
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)visiblePreviews.add(e.target);else visiblePreviews.delete(e.target);});syncPreviews();},{threshold:.55});previews.forEach(v=>observer.observe(v));}
 document.addEventListener('visibilitychange',syncPreviews);
 const toTop=document.querySelector('.celebs-to-top');
 toTop.addEventListener('click',()=>{window.scrollTo({top:0,behavior:reduced?'instant':'smooth'});document.querySelector('#celebs-title').setAttribute('tabindex','-1');document.querySelector('#celebs-title').focus({preventScroll:true});});
 const visiblePhotos=new Set();let framePending=false;
 function paintScroll(){framePending=false;toTop.hidden=window.scrollY<400;if(reduced)return;visiblePhotos.forEach(photo=>{const r=photo.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));photo.style.setProperty('--photo-zoom',(1+progress*.16).toFixed(3));});}
 function scheduleScroll(){if(!framePending){framePending=true;requestAnimationFrame(paintScroll);}}
 window.addEventListener('scroll',scheduleScroll,{passive:true});window.addEventListener('resize',scheduleScroll);paintScroll();
 if('IntersectionObserver'in window&&!reduced){
  const photosObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)visiblePhotos.add(e.target);else visiblePhotos.delete(e.target);});scheduleScroll();},{rootMargin:'60px'});
  document.querySelectorAll('.celebs-photo').forEach(el=>photosObserver.observe(el));
  const headings=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('celebs-reveal');headings.unobserve(e.target);}}),{threshold:.1});document.querySelectorAll('.celebs-section-heading').forEach(el=>headings.observe(el));
 }
})();
