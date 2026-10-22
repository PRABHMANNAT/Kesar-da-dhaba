(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const reveals=[...document.querySelectorAll('[data-arrival-reveal]')];
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.06});
 if(!reduced.matches)reveals.forEach(el=>{el.classList.add('arrival-reveal-ready');observer.observe(el);});
 reduced.addEventListener('change',()=>{if(reduced.matches)reveals.forEach(el=>el.classList.add('is-visible'));});
 document.querySelectorAll('.arrival-question').forEach(details=>{
  const summary=details.querySelector('summary'),answer=details.querySelector('.arrival-answer');
  let expanded=details.open,animation;
  summary.addEventListener('click',event=>{
   event.preventDefault();
   const start=details.getBoundingClientRect().height;
   expanded=!expanded;
   animation?.cancel();
   if(reduced.matches){details.open=expanded;details.style.height='';details.style.overflow='';return;}
   details.open=true;
   const end=summary.getBoundingClientRect().height+(expanded?answer.getBoundingClientRect().height:0)+2;
   details.style.overflow='hidden';
   animation=details.animate({height:[`${start}px`,`${end}px`]},{duration:280,easing:'cubic-bezier(.2,.65,.3,1)'});
   const current=animation;
   animation.onfinish=()=>{if(animation!==current)return;details.open=expanded;details.style.overflow='';animation=null;};
  });
 });
 const copy=document.querySelector('.arrival-copy-address'),status=document.querySelector('.arrival-copy-status');
 copy.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText('Kesar Da Dhaba, Chowk Passian, Gali Rajpura, Near Telephone Exchange, Amritsar, Punjab');status.textContent='Address copied. See you soon.';}
  catch{status.textContent='Select the address above to copy it.';}
 });
 const top=document.querySelector('.arrival-top');let queued=false;
 const paint=()=>{queued=false;const progress=Math.min(1,Math.max(0,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));document.documentElement.style.setProperty('--arrival-progress',progress);top.style.setProperty('--arrival-top-offset',100-progress*100);top.hidden=scrollY<500;};
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(paint);}},{passive:true});addEventListener('resize',paint);paint();
 top.addEventListener('click',()=>scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));
})();
