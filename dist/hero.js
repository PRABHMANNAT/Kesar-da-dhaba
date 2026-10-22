(() => {
  const root=document.querySelector('[data-cinema-hero]');
  if(!root)return;
  const stage=root.querySelector('.cinema-stage');
  const video=root.querySelector('[data-hero-video]');
  const button=root.querySelector('[data-hero-play]');
  const label=button.querySelector('[data-hero-play-label]');
  const icon=button.querySelector('.cinema-play-icon');
  const status=root.querySelector('[data-hero-status]');
  const header=document.querySelector('.site-header');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width: 760px)');
  const short=matchMedia('(max-height: 650px)');
  const preference=key=>{try{return localStorage.getItem(key);}catch{return null;}};
  let intent=null;
  let pending=false;
  let blocked=false;
  let failed=false;
  let frame=false;
  let scheduled=false;
  let previousProgress='';
  const initialRect=stage.getBoundingClientRect();
  let visible=initialRect.bottom>(header?.getBoundingClientRect().height||0)&&initialRect.top<innerHeight;
  const motionAllowed=()=>!reduced.matches&&!document.body.classList.contains('motion-off');
  const mayPlay=()=>visible&&!document.hidden&&!document.querySelector('dialog[open]')&&!failed&&
    (intent===true||(intent!==false&&!blocked&&motionAllowed()&&preference('kesar-motion-paused')!=='true'&&preference('kesar-autoplay')!=='false'&&!navigator.connection?.saveData));
  const paint=()=>{
    const playing=!video.paused;
    label.textContent=pending&&mayPlay()?'Loading film':playing?'Pause film':'Play film';
    icon.textContent=playing?'Ⅱ':'▶';
    button.setAttribute('aria-pressed',String(playing));
    button.setAttribute('aria-label',pending&&mayPlay()?'Cancel loading background film':playing?'Pause background film':'Play background film');
    root.classList.toggle('has-video-frame',frame);
  };
  const synchronize=()=>{
    if(!mayPlay()){if(!video.paused||pending)video.pause();paint();return;}
    if(pending||!video.paused)return;
    pending=true;paint();
    video.play().then(()=>{if(!mayPlay())video.pause();}).catch(error=>{
      if(error.name!=='AbortError'){
        blocked=true;
        if(intent===true){intent=false;status.textContent='The film could not start. You can try Play film again.';}
      }
    }).finally(()=>{
      pending=false;paint();
      if(mayPlay()&&video.paused&&!blocked)synchronize();
    });
  };
  const paintScroll=()=>{
    scheduled=false;
    const enabled=motionAllowed()&&!short.matches;
    root.classList.toggle('cinema-motion-active',enabled&&visible&&!document.hidden);
    const headerHeight=header?.getBoundingClientRect().height||0;
    const distance=Math.max(1,root.offsetHeight-stage.offsetHeight);
    const progress=enabled?Math.max(0,Math.min(1,(headerHeight-root.getBoundingClientRect().top)/distance)):0;
    root.style.setProperty('--cinema-header',`${headerHeight}px`);
    const key=`${enabled}:${mobile.matches}:${progress.toFixed(4)}`;
    if(key===previousProgress)return;
    previousProgress=key;
    const inset=enabled?(mobile.matches?12:Math.min(36,Math.max(16,innerWidth*.022)))*(1-progress):0;
    root.style.setProperty('--cinema-inset',`${inset.toFixed(2)}px`);
    root.style.setProperty('--cinema-scale',enabled?(1.065-.065*progress).toFixed(4):'1');
    root.style.setProperty('--cinema-copy-y',enabled?`${(-progress*(mobile.matches?16:28)).toFixed(2)}px`:'0px');
    root.style.setProperty('--cinema-title-opacity',enabled?(1-progress*.2).toFixed(3):'1');
    root.style.setProperty('--cinema-progress',progress.toFixed(4));
  };
  const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(paintScroll);}};
  root.classList.add('cinema-ready');
  video.poster=mobile.matches?'/assets/kesar-hero-mobile-poster.jpg':'/assets/kesar-hero-desktop-poster.jpg';
  video.controls=false;
  video.muted=true;
  button.hidden=false;
  button.addEventListener('click',()=>{
    status.textContent='';
    if(!video.paused||pending){intent=false;video.pause();}
    else{intent=true;blocked=false;}
    synchronize();
  });
  video.addEventListener('playing',()=>{frame=true;paint();});
  video.addEventListener('pause',paint);
  video.addEventListener('error',()=>{
    failed=true;frame=false;video.pause();paint();button.hidden=true;
    status.textContent='The kitchen film is unavailable. A still from the film is shown.';
  });
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries=>{
      visible=entries[0].isIntersecting&&entries[0].intersectionRatio>.12;
      synchronize();schedule();
    },{rootMargin:`-${Math.ceil(header?.getBoundingClientRect().height||0)}px 0px 0px 0px`,threshold:[0,.12,.2]}).observe(stage);
  }
  addEventListener('scroll',()=>{if(visible)schedule();},{passive:true});
  addEventListener('resize',()=>{previousProgress='';schedule();});
  document.addEventListener('visibilitychange',()=>{synchronize();schedule();});
  document.addEventListener('kesar:dialogchange',synchronize);
  document.querySelector('[data-autoplay-toggle]')?.addEventListener('click',()=>{intent=null;synchronize();});
  new MutationObserver(()=>{
    if(!motionAllowed())intent=null;
    synchronize();schedule();
  }).observe(document.body,{attributes:true,attributeFilter:['class']});
  reduced.addEventListener('change',()=>{intent=null;synchronize();schedule();});
  short.addEventListener('change',schedule);
  mobile.addEventListener('change',()=>{
    video.pause();frame=false;blocked=false;previousProgress='';
    video.poster=mobile.matches?'/assets/kesar-hero-mobile-poster.jpg':'/assets/kesar-hero-desktop-poster.jpg';
    video.load();synchronize();schedule();
  });
  navigator.connection?.addEventListener('change',()=>{synchronize();schedule();});
  document.fonts?.ready.then(schedule);
  if('ResizeObserver' in window&&header)new ResizeObserver(()=>{previousProgress='';schedule();}).observe(header);
  paint();paintScroll();synchronize();
})();
