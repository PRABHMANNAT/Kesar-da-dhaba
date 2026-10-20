(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const readPreference = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const savePreference = (key,value) => { try { localStorage.setItem(key,String(value)); } catch {} };
  let motionPaused = reduced.matches || readPreference('kesar-motion-paused') === 'true';
  let autoplay = !reduced.matches && !navigator.connection?.saveData && readPreference('kesar-autoplay') !== 'false';
  const motionButtons = document.querySelectorAll('[data-motion-toggle]');
  const paintMotion = () => {
    document.body.classList.toggle('motion-off',motionPaused);
    motionButtons.forEach(button => { button.setAttribute('aria-pressed',String(motionPaused)); button.textContent=motionPaused?'Enable animations':'Pause animations'; button.setAttribute('aria-label',button.textContent); });
  };
  paintMotion();
  document.body.classList.add('motion-ready');
  motionButtons.forEach(button => button.addEventListener('click',() => {
    motionPaused=!motionPaused;
    savePreference('kesar-motion-paused',motionPaused);
    paintMotion();
  }));
  const revealSelectors='.section-heading,.dish,.story-image,.story-copy,.visit-image,.visit-copy,.pantry>div,.pantry-image,.films-intro,.film-card,.history-intro>div,.timeline article,.legacy-text,.contact-cards>div,.faq-section>div,.product,.signature-stage,.signature-tabs,.journal-card,.home-notes>div,.honours-hero-copy,.honours-hero-art,.media-mention,.community-section>div,.honours-food-note>div';
  const revealItems=document.querySelectorAll(revealSelectors);
  if ('IntersectionObserver' in window) {
    const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){entry.target.classList.add('is-revealed');reveals.unobserve(entry.target);}
    }), {threshold:.08,rootMargin:'0px 0px -24px 0px'});
    revealItems.forEach(item => {
      item.classList.add('reveal-ready');
      const parent=item.parentElement;
      if(parent.matches('.dish-grid,.film-grid,.timeline,.shop-grid')) item.style.setProperty('--reveal-delay',`${Math.min([...parent.children].indexOf(item),3)*100}ms`);
      reveals.observe(item);
    });
  }
  const progress=document.querySelector('.reading-progress');
  const header=document.querySelector('.site-header');
  let scheduled=false;
  const updateScroll = () => {
    const max=document.documentElement.scrollHeight-innerHeight;
    if(progress) progress.style.transform=`scaleX(${max>0?Math.min(1,scrollY/max):0})`;
    header?.classList.toggle('is-scrolled',scrollY>35);
    scheduled=false;
  };
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}}, {passive:true});
  addEventListener('resize',updateScroll);
  updateScroll();

  const autoplayToggle=document.querySelector('[data-autoplay-toggle]');
  const states=[...document.querySelectorAll('[data-film]')].map(card=>({card,video:card.querySelector('video'),visible:false,manualPaused:false,manualStarted:false,systemPaused:false,pending:false,failed:false}));
  const paintAutoplay = () => autoplayToggle?.setAttribute('aria-checked',String(autoplay));
  const paintPlayer = state => {
    const {video,card}=state;
    const play=card.querySelector('[data-video-play]');
    play.textContent=video.paused?'Play film':'Pause film';
    play.setAttribute('aria-label',`${video.paused?'Play':'Pause'} ${card.dataset.title}`);
    const sound=card.querySelector('[data-video-sound]');
    sound.textContent=video.muted?'Sound off':'Sound on';
    sound.setAttribute('aria-pressed',String(!video.muted));
    sound.setAttribute('aria-label',`${video.muted?'Unmute':'Mute'} ${card.dataset.title}`);
  };
  const systemPause=state=>{if(!state.video.paused){state.systemPaused=true;state.video.pause();}};
  const play=async(state,manual=false)=>{
    if(state.pending||state.failed)return;
    state.pending=true;
    if(manual){state.manualPaused=false;state.manualStarted=true;}
    state.systemPaused=false;
    try {
      if(!state.video.getAttribute('src')){state.video.src=state.video.dataset.src;state.video.load();}
      await state.video.play();
      if(document.hidden||document.querySelector('dialog[open]')||(!manual&&!state.visible)||(!manual&&!autoplay))systemPause(state);
    } catch { /* Autoplay may be blocked: the poster and Play button remain usable. */ }
    finally {state.pending=false;paintPlayer(state);}
  };
  const synchronize=()=>states.forEach(state=>{
    if(document.hidden||document.querySelector('dialog[open]')||!state.visible){systemPause(state);return;}
    if((autoplay||state.manualStarted)&&!state.manualPaused&&state.video.paused)play(state);
  });
  states.forEach(state=>{
    const {video,card}=state;
    video.muted=true;
    card.querySelector('[data-video-play]').addEventListener('click',()=>{
      if(video.paused)play(state,true);
      else {state.manualPaused=true;state.manualStarted=false;video.pause();}
    });
    card.querySelector('[data-video-sound]').addEventListener('click',()=>{
      const unmute=video.muted;
      if(unmute)states.forEach(other=>{other.video.muted=true;paintPlayer(other);});
      video.muted=!unmute;
      paintPlayer(state);
    });
    video.addEventListener('play',()=>{
      state.manualPaused=false;
      if(!state.pending)state.manualStarted=true;
      paintPlayer(state);
    });
    video.addEventListener('pause',()=>{
      if(state.systemPaused)state.systemPaused=false;
      else {state.manualPaused=true;state.manualStarted=false;}
      paintPlayer(state);
    });
    video.addEventListener('volumechange',()=>paintPlayer(state));
    video.addEventListener('error',()=>{
      state.failed=true;
      card.querySelector('.film-error').hidden=false;
      card.querySelector('[data-video-play]').disabled=true;
      paintPlayer(state);
    });
    paintPlayer(state);
  });
  if('IntersectionObserver' in window){
    const videos=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{const state=states.find(s=>s.video===entry.target);state.visible=entry.isIntersecting&&entry.intersectionRatio>=.25;});
      synchronize();
    },{threshold:.25});
    states.forEach(state=>videos.observe(state.video));
  }
  autoplayToggle?.addEventListener('click',()=>{
    autoplay=!autoplay;
    savePreference('kesar-autoplay',autoplay);
    states.forEach(state=>{
      state.manualPaused=false;state.manualStarted=false;
      if(!autoplay)systemPause(state);
      else state.video.muted=true;
    });
    paintAutoplay();synchronize();
  });
  document.addEventListener('visibilitychange',synchronize);
  document.addEventListener('kesar:dialogchange',synchronize);
  reduced.addEventListener('change',()=>{
    if(reduced.matches){motionPaused=true;autoplay=false;states.forEach(systemPause);paintMotion();paintAutoplay();}
  });
  paintAutoplay();
})();
