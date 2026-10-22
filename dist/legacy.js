(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');reveal.unobserve(entry.target);}}),{threshold:.06});
 if(!reduced.matches)document.querySelectorAll('[data-legacy-reveal]').forEach(el=>{el.classList.add('legacy-reveal-ready');reveal.observe(el);});
 reduced.addEventListener('change',()=>{if(reduced.matches)document.querySelectorAll('.legacy-reveal-ready').forEach(el=>el.classList.add('is-visible'));});
 const top=document.querySelector('.legacy-top');let queued=false;
 const paint=()=>{queued=false;const progress=Math.min(1,Math.max(0,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));document.documentElement.style.setProperty('--legacy-progress',progress);top.hidden=scrollY<500;top.style.setProperty('--top-offset',100-progress*100);};
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(paint);}},{passive:true});addEventListener('resize',paint);paint();
 top.addEventListener('click',()=>scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));
 const dialog=document.querySelector('.legacy-lightbox');let opener;
 document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{opener=button;const image=dialog.querySelector('img');image.src=button.dataset.photo;image.alt=button.dataset.photoLabel;dialog.showModal();}));
 dialog.querySelector('button').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
 document.querySelectorAll('[data-share-post]').forEach(button=>button.addEventListener('click',async()=>{const status=document.querySelector('.legacy-share-status');try{const url=location.origin+'/our-legacy/#postcards-title';if(navigator.share)await navigator.share({title:'From Sheikhupura to Amritsar — Kesar Da Dhaba',url});else{await navigator.clipboard.writeText(url);status.textContent='Link copied. Share a little Kesar.';}}catch(error){if(error.name!=='AbortError')status.textContent='Copy this page’s address to share the postcards.';}}));
})();
// Touch feedback for the history photograph without intercepting page scrolling.
(() => {
 const photo=document.querySelector('.legacy-sign-photo');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let timer;
 photo?.addEventListener('pointerdown',event=>{
  if(event.pointerType==='mouse'||reduced.matches)return;
  clearTimeout(timer);photo.classList.add('is-photo-touched');
  timer=setTimeout(()=>photo.classList.remove('is-photo-touched'),1300);
 },{passive:true});
 photo?.addEventListener('pointercancel',()=>{clearTimeout(timer);photo.classList.remove('is-photo-touched');},{passive:true});
})();
// Rotate only while the opening photograph is visible; keep user pause preferences.
(() => {
 const frame=document.querySelector('.legacy-slideshow');
 if(!frame)return;
 const slides=[...frame.querySelectorAll('img')],button=frame.querySelector('button');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let index=0,visible=false,paused=reduced.matches,timer;
 const update=()=>{
  clearInterval(timer);
  button.setAttribute('aria-pressed',String(paused));
  button.setAttribute('aria-label',paused?'Play photo slideshow':'Pause photo slideshow');
  button.firstElementChild.textContent=paused?'▷':'Ⅱ';
  if(paused||!visible||document.hidden)return;
  timer=setInterval(()=>{
   const next=(index+1)%slides.length;
   if(!slides[next].complete||!slides[next].naturalWidth)return;
   slides[index].classList.remove('is-current');slides[index].setAttribute('aria-hidden','true');
   index=next;slides[index].classList.add('is-current');slides[index].removeAttribute('aria-hidden');
  },2000);
 };
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();},{threshold:.15}).observe(frame);
 button.addEventListener('click',()=>{paused=!paused;update();});
 document.addEventListener('visibilitychange',update);
 reduced.addEventListener('change',()=>{paused=reduced.matches;update();});
 update();
})();
