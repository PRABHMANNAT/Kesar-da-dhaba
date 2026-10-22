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
 document.querySelectorAll('[data-media]').forEach(button=>button.addEventListener('click',()=>{trigger=button;render(Number(button.dataset.media));dialog.showModal();}));
 dialog.querySelector('.celebs-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{clear();trigger?.focus({preventScroll:true});});
 dialog.querySelectorAll('[data-view-step]').forEach(b=>b.addEventListener('click',()=>render(current+Number(b.dataset.viewStep))));
 dialog.addEventListener('keydown',e=>{if(e.target.tagName==='VIDEO')return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();render(current+(e.key==='ArrowRight'?1:-1));}});
 let touch=null;
 stage.addEventListener('pointerdown',e=>{if(e.target.tagName==='VIDEO')return;touch={x:e.clientX,y:e.clientY};});
 stage.addEventListener('pointerup',e=>{if(!touch)return;const dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)render(current+(dx<0?1:-1));});
 stage.addEventListener('pointercancel',()=>{touch=null;});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stage.querySelector('video')?.pause();});
 const more=document.querySelector('[data-show-photos]');
 more.addEventListener('click',()=>{document.querySelectorAll('.celebs-photo[hidden]').forEach(p=>p.hidden=false);more.hidden=true;document.querySelector('[data-photo-count]').textContent='All 27 photographs';});
 const track=document.querySelector('.celebs-film-track');
 const arrows=[...document.querySelectorAll('[data-film-step]')];
 function updateArrows(){arrows[0].disabled=track.scrollLeft<5;arrows[1].disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-5;}
 arrows.forEach(b=>b.addEventListener('click',()=>track.scrollBy({left:Number(b.dataset.filmStep)*(track.querySelector('article').getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap)),behavior:reduced?'instant':'smooth'})));
 track.addEventListener('scroll',updateArrows,{passive:true});window.addEventListener('resize',updateArrows);updateArrows();
 if('IntersectionObserver'in window&&!reduced){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('celebs-reveal');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.celebs-photo,.celebs-section-heading').forEach(el=>observer.observe(el));}
})();
