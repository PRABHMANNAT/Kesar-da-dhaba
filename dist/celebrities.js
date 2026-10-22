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
  function update(){row.style.setProperty('--film-arrow-y',`${track.querySelector('.celebs-film-screen').getBoundingClientRect().height/2}px`);const max=track.scrollWidth-track.clientWidth;arrows[0].disabled=track.scrollLeft<5;arrows[1].disabled=track.scrollLeft>=max-5;progress.style.width=`${max<=0?100:25+75*Math.min(1,track.scrollLeft/max)}%`;}
  arrows.forEach(b=>b.addEventListener('click',()=>track.scrollBy({left:Number(b.dataset.filmStep)*(track.querySelector('article').getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap)),behavior:reduced?'instant':'smooth'})));
  track.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();
 });
 const featured=document.querySelector('.celebs-featured-track');
 const featuredCards=[...featured.querySelectorAll('.celebs-featured-card')];
 const featuredArrows=[...document.querySelectorAll('[data-featured-step]')];
 const mobileFeatured=matchMedia('(max-width:700px)');
 let featuredIndex=0,swiping=null,featuredAnimating=false,suppressFeaturedClickUntil=0;
 const wrapFeatured=index=>(index+featuredCards.length)%featuredCards.length;
 function featuredLayout(){
  const stacked=mobileFeatured.matches;
  featured.classList.toggle('is-card-stack',stacked);featured.scrollLeft=0;
  featuredCards.forEach((card,index)=>{
   const slot=wrapFeatured(index-featuredIndex);
   card.dataset.stackSlot=String(slot);card.classList.remove('is-flying','is-dragging');
   ['--swipe-x','--swipe-y','--swipe-rotation'].forEach(prop=>card.style.removeProperty(prop));
   card.inert=stacked&&slot!==0;card.tabIndex=stacked&&slot===0?0:-1;
   if(stacked&&slot!==0)card.setAttribute('aria-hidden','true');else card.removeAttribute('aria-hidden');
  });
  featuredArrows.forEach(button=>{button.disabled=false;});
  document.querySelector('[data-featured-position]').textContent=`0${featuredIndex+1} / 03`;
  requestAnimationFrame(syncPreviews);
 }
 function advanceFeatured(step,direction=step>0?-1:1){
  if(featuredAnimating)return;
  if(!mobileFeatured.matches){featuredIndex=wrapFeatured(featuredIndex+step);featuredLayout();return;}
  const leaving=featuredCards[featuredIndex];featuredAnimating=true;
  leaving.classList.remove('is-dragging');leaving.classList.add('is-flying');
  leaving.style.setProperty('--swipe-x',`${direction*(featured.clientWidth+130)}px`);
  leaving.style.setProperty('--swipe-y','-30px');leaving.style.setProperty('--swipe-rotation',`${direction*24}deg`);
  setTimeout(()=>{const hadFocus=leaving.contains(document.activeElement);featuredIndex=wrapFeatured(featuredIndex+step);featuredAnimating=false;featuredLayout();if(hadFocus)featuredCards[featuredIndex].focus({preventScroll:true});},reduced?0:300);
 }
 featuredArrows.forEach(b=>b.addEventListener('click',()=>advanceFeatured(Number(b.dataset.featuredStep))));
 featured.addEventListener('click',e=>{if(performance.now()<suppressFeaturedClickUntil||featuredAnimating){e.preventDefault();e.stopImmediatePropagation();}},true);
 featured.addEventListener('pointerdown',e=>{
  if(!mobileFeatured.matches||featuredAnimating||!e.isPrimary||e.button!==0)return;
  const card=e.target.closest('.celebs-featured-card');if(card!==featuredCards[featuredIndex])return;
  swiping={card,id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,dy:0,started:performance.now(),dragging:false};
 });
 featured.addEventListener('pointermove',e=>{
  if(!swiping||e.pointerId!==swiping.id)return;
  const dx=e.clientX-swiping.x,dy=e.clientY-swiping.y;
  if(!swiping.dragging){
   if(Math.abs(dy)>Math.abs(dx)+8){swiping=null;return;}
   if(Math.abs(dx)<9)return;
   swiping.dragging=true;swiping.card.classList.add('is-dragging');swiping.card.setPointerCapture(e.pointerId);
  }
  swiping.dx=dx;swiping.dy=dy;
  swiping.card.style.setProperty('--swipe-x',`${dx}px`);
  swiping.card.style.setProperty('--swipe-y',`${Math.max(-35,Math.min(35,dy*.16))}px`);
  swiping.card.style.setProperty('--swipe-rotation',`${Math.max(-20,Math.min(20,dx/18))}deg`);
 });
 function finishFeatured(e,cancelled=false){
  if(!swiping||e.pointerId!==swiping.id)return;
  const drag=swiping;swiping=null;
  if(drag.card.hasPointerCapture(e.pointerId))drag.card.releasePointerCapture(e.pointerId);
  if(!drag.dragging)return;
  suppressFeaturedClickUntil=performance.now()+500;
  const velocity=Math.abs(drag.dx)/Math.max(1,performance.now()-drag.started);
  const commit=!cancelled&&(Math.abs(drag.dx)>Math.min(90,featured.clientWidth*.22)||(Math.abs(drag.dx)>28&&velocity>.5));
  if(commit)advanceFeatured(drag.dx<0?1:-1,drag.dx<0?-1:1);else featuredLayout();
 }
 featured.addEventListener('pointerup',e=>finishFeatured(e));
 featured.addEventListener('pointercancel',e=>finishFeatured(e,true));
 featured.addEventListener('keydown',e=>{if(mobileFeatured.matches&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();advanceFeatured(e.key==='ArrowRight'?1:-1);}});
 mobileFeatured.addEventListener('change',()=>{swiping=null;featuredLayout();});
 const previews=[...document.querySelectorAll('[data-preview-src]')];
 const visiblePreviews=new Set();let previewsPaused=reduced;
 const previewToggle=document.querySelector('.celebs-preview-toggle');
 function syncPreviews(){previews.forEach(video=>{const card=video.closest('.celebs-featured-card');const activeCard=!card||!mobileFeatured.matches||card.dataset.stackSlot==='0';if(visiblePreviews.has(video)&&activeCard&&!previewsPaused&&!document.hidden&&!dialog.open){if(!video.hasAttribute('src'))video.src=video.dataset.previewSrc;video.muted=true;video.play().catch(()=>{});}else video.pause();});}
 function previewLabel(){previewToggle.textContent=previewsPaused?'Play videos':'Pause videos';previewToggle.setAttribute('aria-pressed',String(previewsPaused));}
 previewToggle.addEventListener('click',()=>{previewsPaused=!previewsPaused;previewLabel();syncPreviews();});previewLabel();
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)visiblePreviews.add(e.target);else visiblePreviews.delete(e.target);});syncPreviews();},{threshold:.2});previews.forEach(v=>observer.observe(v));}
 document.addEventListener('visibilitychange',syncPreviews);
 featuredLayout();
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
