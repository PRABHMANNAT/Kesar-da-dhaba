(() => {
 const root=document.querySelector('.hnr-page');
 if(!root)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const allowed=()=>!reduced.matches&&!document.body.classList.contains('motion-off');
 const videos=[...root.querySelectorAll('[data-hnr-video]')];
 const visible=new Set();
 const paused=new WeakSet();
 const syncVideos=()=>videos.forEach(video=>{
  if(visible.has(video)&&!document.hidden&&allowed()&&!paused.has(video)){
   if(!video.hasAttribute('src'))video.src=video.dataset.hnrVideo;
   video.muted=true;video.play().catch(()=>{});
  }else video.pause();
 });
 const observer=new IntersectionObserver(entries=>{entries.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target));syncVideos();},{threshold:.2});
 videos.forEach(video=>observer.observe(video));
 const heroVideo=videos[0],pauseButton=root.querySelector('[data-hnr-pause]');
 pauseButton.addEventListener('click',()=>{
  if(heroVideo.paused){
   paused.delete(heroVideo);
   if(!heroVideo.hasAttribute('src'))heroVideo.src=heroVideo.dataset.hnrVideo;
   heroVideo.play().catch(()=>{});
  }else{paused.add(heroVideo);heroVideo.pause();}
 });
 const paintPause=()=>{pauseButton.textContent=heroVideo.paused?'Play':'Pause';pauseButton.setAttribute('aria-label',`${heroVideo.paused?'Play':'Pause'} kitchen video`);};
 heroVideo.addEventListener('play',paintPause);heroVideo.addEventListener('pause',paintPause);
 const press=root.querySelector('.hnr-press');
 const panels=[...press.querySelectorAll('[data-hnr-review]')];
 const choices=[...press.querySelectorAll('[data-hnr-select]')];
 const stage=press.querySelector('.hnr-review-stage');
 const toggle=press.querySelector('[data-hnr-review-toggle]');
 let current=0,timer=null,reviewVisible=false,manualPause=false,hover=false;
 const schedule=()=>{
  clearTimeout(timer);
  if(reviewVisible&&!document.hidden&&allowed()&&!manualPause&&!hover&&!press.contains(document.activeElement))timer=setTimeout(()=>show(current+1),7000);
  toggle.disabled=!allowed();
  toggle.textContent=!allowed()?'Motion paused':manualPause?'Play reviews':'Pause reviews';
  toggle.setAttribute('aria-pressed',String(manualPause||!allowed()));
 };
 const show=(index,announce=false)=>{
  current=(index+panels.length)%panels.length;
  panels.forEach((panel,i)=>panel.hidden=i!==current);
  choices.forEach((choice,i)=>choice.setAttribute('aria-pressed',String(i===current)));
  const count=press.querySelector('[data-hnr-count]');
  count.setAttribute('aria-live',announce?'polite':'off');
  count.textContent=`${String(current+1).padStart(2,'0')} / ${String(panels.length).padStart(2,'0')}`;
  if(allowed())panels[current].animate([{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,easing:'ease-out'});
  schedule();
 };
 // Reserve the tallest review's space so automatic changes do not shift the page.
 const sizeReviews=()=>{
  if(!stage.clientWidth)return;
  let height=0;
  panels.forEach(panel=>{
   const hidden=panel.hidden;panel.hidden=false;
   Object.assign(panel.style,{position:'absolute',visibility:'hidden',width:'100%'});
   height=Math.max(height,panel.offsetHeight);
   panel.removeAttribute('style');panel.hidden=hidden;
  });
  stage.style.minHeight=`${height+20}px`;
 };
 new ResizeObserver(sizeReviews).observe(stage);
 document.fonts.ready.then(sizeReviews);
 choices.forEach((button,i)=>button.addEventListener('click',()=>show(i,true)));
 press.querySelectorAll('[data-hnr-step]').forEach(button=>button.addEventListener('click',()=>show(current+Number(button.dataset.hnrStep),true)));
 toggle.addEventListener('click',()=>{manualPause=!manualPause;schedule();});
 stage.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();show(current+(event.key==='ArrowRight'?1:-1),true);}});
 let touch=null;
 stage.addEventListener('pointerdown',event=>{touch={x:event.clientX,y:event.clientY};});
 stage.addEventListener('pointerup',event=>{if(!touch)return;const x=event.clientX-touch.x,y=event.clientY-touch.y;touch=null;if(Math.abs(x)>45&&Math.abs(x)>Math.abs(y))show(current+(x<0?1:-1),true);});
 stage.addEventListener('pointercancel',()=>touch=null);
 press.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hover=true;schedule();}});
 press.addEventListener('pointerleave',()=>{hover=false;schedule();});
 press.addEventListener('focusin',schedule);press.addEventListener('focusout',()=>setTimeout(schedule,0));
 new IntersectionObserver(entries=>{reviewVisible=entries[0].isIntersecting;schedule();},{threshold:.2}).observe(press);
 const sync=()=>{syncVideos();schedule();};
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
 const track=root.querySelector('.hnr-guest-track');
 const guestButtons=[...root.querySelectorAll('[data-hnr-guest-step]')];
 const paintGuests=()=>guestButtons.forEach(button=>{const next=Number(button.dataset.hnrGuestStep)>0;button.disabled=next?track.scrollLeft>=track.scrollWidth-track.clientWidth-4:track.scrollLeft<=4;button.style.opacity=button.disabled?'.4':'1';});
 guestButtons.forEach(button=>button.addEventListener('click',()=>track.scrollBy({left:Number(button.dataset.hnrGuestStep)*(track.firstElementChild.offsetWidth+16),behavior:allowed()?'smooth':'instant'})));
 track.addEventListener('scroll',paintGuests,{passive:true});new ResizeObserver(paintGuests).observe(track);
 const reveals=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;if(allowed())entry.target.animate([{opacity:0,translate:'0 22px'},{opacity:1,translate:'0 0'}],{duration:650,easing:'ease-out'});reveals.unobserve(entry.target);}),{threshold:.1});
 root.querySelectorAll('[data-hnr-reveal]').forEach(element=>reveals.observe(element));
})();
