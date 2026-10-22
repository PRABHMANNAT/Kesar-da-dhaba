(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const stage=document.querySelector('.pantry-social-stage'),windowEl=stage.querySelector('.pantry-post-window');
 const slides=[...stage.querySelectorAll('.pantry-slide')],dots=[...stage.querySelectorAll('[data-post-index]')];
 const pause=stage.querySelector('[data-post-pause]'),count=stage.querySelector('[data-post-count]'),link=stage.querySelector('[data-current-post]');
 let index=0,paused=reduced.matches,visible=false,hovered=false,focused=false,timer,startX=null,swiped=false;
 const show=next=>{
  index=(next+slides.length)%slides.length;
  slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===index);slide.setAttribute('aria-hidden',String(i!==index));slide.tabIndex=i===index?0:-1;dots[i].setAttribute('aria-pressed',String(i===index));});
  count.textContent=`${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  count.setAttribute('aria-label',`Image ${index+1} of ${slides.length}`);
  link.href=slides[index].href;
 };
 const schedule=()=>{
  clearInterval(timer);
  pause.textContent=paused?'Play ▷':'Pause Ⅱ';
  pause.setAttribute('aria-label',`${paused?'Play':'Pause'} automatic image carousel`);pause.setAttribute('aria-pressed',String(paused));
  if(!paused&&visible&&!document.hidden&&!hovered&&!focused)timer=setInterval(()=>show(index+1),1000);
 };
 stage.querySelectorAll('[data-post-step]').forEach(button=>button.addEventListener('click',()=>{show(index+Number(button.dataset.postStep));schedule();}));
 dots.forEach(button=>button.addEventListener('click',()=>{show(Number(button.dataset.postIndex));schedule();}));
 pause.addEventListener('click',()=>{paused=!paused;if(!paused){focused=false;hovered=false;}schedule();});
 windowEl.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(index+(event.key==='ArrowRight'?1:-1));schedule();}});
 windowEl.addEventListener('pointerdown',event=>{swiped=false;if(event.pointerType!=='mouse')startX=event.clientX;},{passive:true});
 windowEl.addEventListener('pointerup',event=>{if(startX!==null&&Math.abs(event.clientX-startX)>40){swiped=true;show(index+(event.clientX<startX?1:-1));schedule();}startX=null;},{passive:true});
 windowEl.addEventListener('click',event=>{if(swiped){event.preventDefault();swiped=false;}},true);
 windowEl.addEventListener('pointercancel',()=>{startX=null;});
 stage.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;schedule();}});
 stage.addEventListener('pointerleave',()=>{hovered=false;schedule();});
 stage.addEventListener('focusin',()=>{focused=true;schedule();});
 stage.addEventListener('focusout',event=>{if(!stage.contains(event.relatedTarget)){focused=false;schedule();}});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.2}).observe(stage);
 document.addEventListener('visibilitychange',schedule);
 reduced.addEventListener('change',()=>{paused=reduced.matches;schedule();});
 schedule();
 const top=document.querySelector('.pantry-top');let queued=false;
 const paint=()=>{queued=false;document.documentElement.style.setProperty('--pantry-progress',Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));top.hidden=scrollY<600;};
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(paint);}},{passive:true});addEventListener('resize',paint);paint();
 top.addEventListener('click',()=>scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));
})();

// Replay the product photograph reveal when it re-enters the viewport.
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const photos=[...document.querySelectorAll('.pantry-product-photo')];
 const visible=new WeakMap();
 const reveal=async photo=>{
  if(reduced.matches||photo.classList.contains('is-photo-revealing'))return;
  const image=photo.querySelector('img');
  try{await image.decode();}catch{return;}
  if(visible.get(photo)&&!reduced.matches)photo.classList.add('is-photo-revealing');
 };
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting){visible.set(entry.target,false);entry.target.classList.remove('is-photo-revealing');}
  else if(entry.intersectionRatio>=.2){visible.set(entry.target,true);reveal(entry.target);}
 }),{threshold:[0,.2],rootMargin:'-90px 0px -8% 0px'});
 photos.forEach(photo=>observer.observe(photo));
 reduced.addEventListener('change',()=>photos.forEach(photo=>{
  if(reduced.matches)photo.classList.remove('is-photo-revealing');
  else if(visible.get(photo))reveal(photo);
 }));
})();
