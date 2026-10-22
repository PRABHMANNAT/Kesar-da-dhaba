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
// Replay postcard image motion when the photographs enter the viewport.
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const images=[...document.querySelectorAll('.legacy-post-image')];
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)entry.target.classList.remove('is-image-revealing');
  else if(entry.intersectionRatio>=.18&&!reduced.matches)entry.target.classList.add('is-image-revealing');
 }),{threshold:[0,.18],rootMargin:'-85px 0px -5% 0px'});
 images.forEach(image=>observer.observe(image));
 reduced.addEventListener('change',()=>{if(reduced.matches)images.forEach(image=>image.classList.remove('is-image-revealing'));});
})();
