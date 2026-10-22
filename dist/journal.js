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
  const title=document.querySelector('[data-type-heading]');
  if(title&&!reduced.matches){
    let index=0;
    title.querySelectorAll('.journal-type-line').forEach(line=>{
      const walker=document.createTreeWalker(line,NodeFilter.SHOW_TEXT),nodes=[];
      while(walker.nextNode())nodes.push(walker.currentNode);
      nodes.forEach(node=>{const fragment=document.createDocumentFragment();for(const char of node.textContent){const span=document.createElement('span');span.className='journal-type-char';span.textContent=char;span.style.setProperty('--char-delay',(200+index++*58)+'ms');fragment.append(span);}node.replaceWith(fragment);});
    });
  }
  const film=document.querySelector('[data-journal-film]'),filmButton=document.querySelector('[data-film-toggle]');
  if(film){
    film.muted=true;
    let visible=false;
    const playback=()=>{if(visible&&!document.hidden){if(!film.getAttribute('src'))film.src=film.dataset.src;film.play().catch(()=>{});}else film.pause();};
    const paintSound=()=>{const muted=film.muted;filmButton.setAttribute('aria-label',muted?'Unmute film':'Mute film');filmButton.setAttribute('aria-pressed',String(!muted));filmButton.querySelector('[data-sound-label]').textContent=muted?'Sound off':'Sound on';filmButton.querySelector('[data-sound-off]').style.display=muted?'':'none';filmButton.querySelector('[data-sound-on]').style.display=muted?'none':'';};
    filmButton.querySelector('[data-sound-on]').removeAttribute('hidden');
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;playback();},{threshold:.2}).observe(film);
    film.addEventListener('playing',()=>film.classList.add('is-playing'));
    film.addEventListener('error',()=>{film.classList.remove('is-playing');filmButton.hidden=true;});
    film.addEventListener('volumechange',paintSound);
    filmButton.addEventListener('click',()=>{film.muted=!film.muted;paintSound();if(film.paused)film.play().catch(()=>{});});
    document.addEventListener('visibilitychange',playback);paintSound();
  }
})();
