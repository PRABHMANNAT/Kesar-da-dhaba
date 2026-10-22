(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target);}}),{threshold:.08});
  if(!reduced.matches)document.querySelectorAll('[data-reveal]').forEach(el=>{el.classList.add('journal-reveal-ready');reveal.observe(el);});
  reduced.addEventListener('change',()=>{if(reduced.matches)document.querySelectorAll('.journal-reveal-ready').forEach(el=>el.classList.add('is-visible'));});
  const filters=document.querySelectorAll('[data-filter]');
  filters.forEach(button=>button.addEventListener('click',()=>{
    filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    let count=0;document.querySelectorAll('.journal-stories .journal-card').forEach(card=>{card.hidden=button.dataset.filter!=='All stories'&&card.dataset.category!==button.dataset.filter;if(!card.hidden){count++;card.classList.add('is-visible');}});
    document.querySelector('.journal-status').textContent=count+' '+(count===1?'story':'stories')+' to savour';
  }));
  const top=document.querySelector('.journal-top'),hero=document.querySelector('.journal-hero-photo'),article=document.querySelector('.journal-prose');
  let queued=false;
  const paint=()=>{queued=false;const end=article?article.offsetTop+article.offsetHeight-innerHeight:document.documentElement.scrollHeight-innerHeight;const start=article?article.offsetTop:0;const progress=Math.min(1,Math.max(0,(scrollY-start)/Math.max(1,end-start)));document.documentElement.style.setProperty('--progress',progress);top.hidden=scrollY<500;top.style.setProperty("--top-offset",100-Math.min(100,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100));if(hero&&!reduced.matches){const r=hero.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)hero.style.setProperty('--hero-y',Math.min(0,Math.max(-8,-3+(scrollY*.008)))+'%');}};
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(paint);}},{passive:true});addEventListener('resize',paint);paint();
  top.addEventListener('click',()=>scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.getElementById(a.hash.slice(1));if(el){e.preventDefault();el.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});history.replaceState(null,'',a.hash);el.setAttribute('tabindex','-1');el.focus({preventScroll:true});}}));
  document.querySelector('[data-share]')?.addEventListener('click',async()=>{const status=document.querySelector('[data-share-status]');try{if(navigator.share)await navigator.share({title:document.title,url:location.href.split('#')[0]});else{await navigator.clipboard.writeText(location.href.split('#')[0]);status.textContent='Link copied';}}catch(e){if(e.name!=='AbortError')status.textContent='Copy the address from your browser to share.';}});
  if(innerWidth<1024){const details=document.querySelector('.journal-contents details');if(details)details.open=false;}
})();
