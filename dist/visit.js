(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const reveals=[...document.querySelectorAll('[data-arrival-reveal]')];
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.06});
 if(!reduced.matches)reveals.forEach(el=>{el.classList.add('arrival-reveal-ready');observer.observe(el);});
 reduced.addEventListener('change',()=>{if(reduced.matches)reveals.forEach(el=>el.classList.add('is-visible'));});
 // Each answer opens once on entering the reading area. Manual choices take priority.
 const questions=[...document.querySelectorAll('.arrival-question')].map(details=>{
  const summary=details.querySelector('summary');
  const state={details,summary,expanded:details.open,handled:details.open,animation:null};
  state.setExpanded=expanded=>{
   const start=details.getBoundingClientRect().height;
   state.animation?.cancel();
   state.animation=null;
   state.expanded=expanded;
   if(reduced.matches){details.open=expanded;details.style.overflow='';return;}
   details.open=true;
   const end=expanded?details.getBoundingClientRect().height:summary.getBoundingClientRect().height+1;
   details.style.overflow='hidden';
   const animation=details.animate({height:[`${start}px`,`${end}px`]},{duration:420,easing:'cubic-bezier(.2,.65,.3,1)'});
   state.animation=animation;
   animation.onfinish=()=>{
    if(state.animation!==animation)return;
    details.open=state.expanded;
    details.style.overflow='';
    state.animation=null;
   };
  };
  summary.addEventListener('click',event=>{
   event.preventDefault();
   state.handled=true;
   state.setExpanded(!state.expanded);
  });
  return state;
 });
 const openReadingAnswer=()=>{
  if(reduced.matches||questions.some(state=>state.animation))return;
  const header=document.querySelector('.site-header');
  const readingTop=Math.max(90,header?.getBoundingClientRect().bottom||0)+12;
  const readingBottom=Math.max(readingTop+70,innerHeight*.7);
  const next=questions.find(state=>{
   if(state.handled)return false;
   const rect=state.summary.getBoundingClientRect();
   return rect.top>=readingTop&&rect.top<=readingBottom;
  });
  if(next){next.handled=true;next.setExpanded(true);}
 };
 reduced.addEventListener('change',()=>{
  if(!reduced.matches)return;
  questions.forEach(state=>{
   state.animation?.cancel();state.animation=null;
   state.details.open=state.expanded;state.details.style.overflow='';
  });
 });
 const copy=document.querySelector('.arrival-copy-address'),status=document.querySelector('.arrival-copy-status');
 copy.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText('Kesar Da Dhaba, Chowk Passian, Gali Rajpura, Near Telephone Exchange, Amritsar, Punjab');status.textContent='Address copied. See you soon.';}
  catch{status.textContent='Select the address above to copy it.';}
 });
 const top=document.querySelector('.arrival-top');let queued=false;
 const paint=()=>{queued=false;const progress=Math.min(1,Math.max(0,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));document.documentElement.style.setProperty('--arrival-progress',progress);top.style.setProperty('--arrival-top-offset',100-progress*100);top.hidden=scrollY<500;openReadingAnswer();};
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(paint);}},{passive:true});addEventListener('resize',paint);paint();
 top.addEventListener('click',()=>scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));
})();
