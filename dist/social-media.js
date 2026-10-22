// Locally hosted reels: silent autoplay only while visible, with explicit playback controls.
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('[data-kesar-video]').forEach(frame=>{
  const video=frame.querySelector('video'),toggle=frame.querySelector('[data-video-toggle]'),sound=frame.querySelector('[data-video-mute]');
  let visible=false,paused=reduced.matches;
  video.muted=true;
  video.autoplay=!reduced.matches;
  const label=video.getAttribute('aria-label')||'background film';
  const paint=()=>{
   if(toggle){toggle.textContent=video.paused?'Play':'Pause';toggle.setAttribute('aria-label',`${video.paused?'Play':'Pause'} ${label}`);toggle.setAttribute('aria-pressed',String(paused));}
   if(sound){sound.textContent=video.muted?'Sound off':'Sound on';sound.setAttribute('aria-label',`${video.muted?'Unmute':'Mute'} ${label}`);sound.setAttribute('aria-pressed',String(!video.muted));}
  };
  const sync=()=>{
   if(visible&&!document.hidden&&!paused){
    if(!video.getAttribute('src'))video.src=video.dataset.src;
    video.play().catch(paint);
   }else video.pause();
   paint();
  };
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.1}).observe(frame);
  toggle?.addEventListener('click',()=>{paused=!video.paused;sync();});
  sound?.addEventListener('click',()=>{video.muted=!video.muted;paint();});
  video.addEventListener('play',paint);video.addEventListener('pause',paint);
  video.addEventListener('error',()=>{if(toggle){toggle.textContent='Unavailable';toggle.disabled=true;toggle.setAttribute('aria-label','Video unavailable; use the Instagram link');}});
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',()=>{paused=reduced.matches;video.autoplay=!paused;sync();});
  paint();
 });
})();
