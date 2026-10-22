(() => {
  const root=document.querySelector('[data-cinema-hero]');
  if(!root)return;
  const stage=root.querySelector('.cinema-stage');
  const video=root.querySelector('[data-hero-video]');
  const header=document.querySelector('.site-header');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width: 760px)');
  const short=matchMedia('(max-height: 650px)');
  const preference=key=>{try{return localStorage.getItem(key);}catch{return null;}};
  let pending=false;
  let blocked=false;
  let failed=false;
  let scheduled=false;
  let previousProgress='';
  const initialRect=stage.getBoundingClientRect();
  let visible=initialRect.bottom>(header?.getBoundingClientRect().height||0)&&initialRect.top<innerHeight;
  const motionAllowed=()=>!reduced.matches&&!document.body.classList.contains('motion-off');
  const mayPlay=()=>visible&&!document.hidden&&!document.querySelector('dialog[open]')&&!failed&&!blocked&&motionAllowed()&&
    preference('kesar-motion-paused')!=='true'&&preference('kesar-autoplay')!=='false'&&!navigator.connection?.saveData;
  const showFrame=()=>{
    if(video.readyState>=2)root.classList.add('has-video-frame');
  };
  const synchronize=()=>{
    const allowed=mayPlay();
    video.autoplay=allowed;
    video.preload=allowed?'auto':'none';
    if(!allowed){if(!video.paused||pending)video.pause();return;}
    if(pending||!video.paused){if(!video.paused)showFrame();return;}
    pending=true;
    video.play().then(()=>{
      if(mayPlay())showFrame();
      else video.pause();
    }).catch(error=>{
      if(error.name!=='AbortError')blocked=true;
    }).finally(()=>{
      pending=false;
      if(mayPlay()&&video.paused)synchronize();
    });
  };
  const paintScroll=()=>{
    scheduled=false;
    const enabled=motionAllowed();
    root.classList.toggle('cinema-motion-active',enabled&&visible&&!document.hidden);
    const headerHeight=header?.getBoundingClientRect().height||0;
    // Short screens keep normal document flow, with the same camera motion.
    const distance=short.matches||root.classList.contains('cinema-flow')?stage.offsetHeight*.8:root.offsetHeight-stage.offsetHeight;
    const progress=enabled?Math.max(0,Math.min(1,(headerHeight-root.getBoundingClientRect().top)/Math.max(1,distance))):0;
    root.style.setProperty('--cinema-header',`${headerHeight}px`);
    const key=`${enabled}:${mobile.matches}:${progress.toFixed(4)}`;
    if(key===previousProgress)return;
    previousProgress=key;
    root.style.setProperty('--cinema-scale',enabled?(1+.09*progress).toFixed(4):'1');
    root.style.setProperty('--cinema-camera-y',enabled?`${(-progress*1.5).toFixed(3)}%`:'0%');
    root.style.setProperty('--cinema-copy-y',enabled?`${(-progress*(mobile.matches?32:48)).toFixed(2)}px`:'0px');
    root.style.setProperty('--cinema-title-opacity',enabled?(1-progress*.35).toFixed(3):'1');
    root.style.setProperty('--cinema-progress',progress.toFixed(4));
  };
  const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(paintScroll);}};
  root.classList.add('cinema-ready');
  video.controls=false;
  video.defaultMuted=true;
  video.muted=true;
  video.playsInline=true;
  video.addEventListener('playing',showFrame);
  video.addEventListener('loadeddata',()=>{if(!video.paused)showFrame();});
  video.addEventListener('error',()=>{
    failed=true;video.autoplay=false;video.pause();root.classList.remove('has-video-frame');
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
  document.querySelector('[data-autoplay-toggle]')?.addEventListener('click',()=>queueMicrotask(()=>{blocked=false;synchronize();}));
  new MutationObserver(()=>{synchronize();schedule();}).observe(document.body,{attributes:true,attributeFilter:['class']});
  reduced.addEventListener('change',()=>{blocked=false;synchronize();schedule();});
  short.addEventListener('change',schedule);
  mobile.addEventListener('change',()=>{
    video.pause();root.classList.remove('has-video-frame');blocked=false;previousProgress='';
    video.load();synchronize();schedule();
  });
  navigator.connection?.addEventListener('change',()=>{synchronize();schedule();});
  // A browser that blocks muted autoplay can retry on the first interaction.
  const retry=()=>{if(blocked||video.paused){blocked=false;synchronize();}};
  addEventListener('pointerdown',retry,{passive:true});
  addEventListener('keydown',retry);
  document.fonts?.ready.then(schedule);
  if('ResizeObserver' in window&&header)new ResizeObserver(()=>{previousProgress='';schedule();}).observe(header);
  // Native autoplay starts discovery during HTML parsing; do not wait for load/idle.
  synchronize();paintScroll();
})();
