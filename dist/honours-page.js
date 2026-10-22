(() => {
 const root=document.querySelector('.hnr-page');
 if(!root)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const allowed=()=>!reduced.matches&&!document.body.classList.contains('motion-off');
 const videos=[...root.querySelectorAll('[data-hnr-video]')];
 const visible=new Set();
 const mobile=matchMedia('(max-width:760px)');
 let guestIndex=0;
 const heroVideo=videos[0];
 const syncVideos=()=>videos.forEach(video=>{
  const card=video.closest('.hnr-guest-card');
  const front=!card||!mobile.matches||card.dataset.stackSlot==='0';
  if(visible.has(video)&&front&&!document.hidden&&allowed()){
   if(!video.hasAttribute('src'))video.src=video.dataset.hnrVideo;
   if(video!==heroVideo)video.muted=true;
   video.play().catch(()=>{});
  }else video.pause();
 });
 const observer=new IntersectionObserver(entries=>{entries.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target));syncVideos();},{threshold:.2});
 videos.forEach(video=>observer.observe(video));
 const soundButton=root.querySelector('[data-hnr-sound]');
 const paintSound=()=>{
  soundButton.textContent=heroVideo.muted?'Sound off':'Sound on';
  soundButton.setAttribute('aria-label',`${heroVideo.muted?'Unmute':'Mute'} kitchen video`);
  soundButton.setAttribute('aria-pressed',String(!heroVideo.muted));
 };
 soundButton.addEventListener('click',()=>{
  if(!heroVideo.hasAttribute('src'))heroVideo.src=heroVideo.dataset.hnrVideo;
  heroVideo.muted=!heroVideo.muted;
  heroVideo.play().catch(()=>{heroVideo.muted=true;paintSound();});
  paintSound();
 });
 heroVideo.addEventListener('volumechange',paintSound);paintSound();
 const press=root.querySelector('.hnr-press');
 const panels=[...press.querySelectorAll('[data-hnr-review]')];
 const choices=[...press.querySelectorAll('[data-hnr-select]')];
 const stage=press.querySelector('.hnr-review-stage');
 const toggle=press.querySelector('[data-hnr-review-toggle]');
 let current=0,timer=null,reviewVisible=false,manualPause=false,hover=false;
 const schedule=()=>{
  clearTimeout(timer);
  if(reviewVisible&&!document.hidden&&allowed()&&!manualPause&&!hover&&!press.querySelector(':focus-visible'))timer=setTimeout(()=>show(current+1),6000);
  toggle.disabled=!allowed();
  toggle.textContent=!allowed()?'Motion paused':manualPause?'Play reviews':'Pause reviews';
  toggle.setAttribute('aria-pressed',String(manualPause||!allowed()));
 };
 const show=(index,announce=false)=>{
  current=(index+panels.length)%panels.length;
  panels.forEach((panel,i)=>panel.hidden=i!==current);
  choices.forEach((choice,i)=>choice.setAttribute('aria-pressed',String(i===current)));
  const strip=press.querySelector('.hnr-publications');
  if(strip.scrollWidth>strip.clientWidth){
   const left=strip.scrollLeft+choices[current].getBoundingClientRect().left-strip.getBoundingClientRect().left-(strip.clientWidth-choices[current].offsetWidth)/2;
   strip.scrollTo({left,behavior:allowed()?'smooth':'instant'});
  }
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
 press.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&!mobile.matches){hover=true;schedule();}});
 press.addEventListener('pointerleave',()=>{hover=false;schedule();});
 press.addEventListener('focusin',schedule);press.addEventListener('focusout',()=>setTimeout(schedule,0));
 new IntersectionObserver(entries=>{reviewVisible=entries[0].isIntersecting;schedule();},{threshold:.2}).observe(stage);
 const sync=()=>{syncVideos();schedule();};
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
 const track=root.querySelector('.hnr-guest-track');
 const guestButtons=[...root.querySelectorAll('[data-hnr-guest-step]')];
 const guestCards=[...track.querySelectorAll('.hnr-guest-card')];
 let dragging=null,flying=false,flightTimer=null;
 const wrap=index=>(index+guestCards.length)%guestCards.length;
 function layoutGuests(){
  track.classList.toggle('is-card-stack',mobile.matches);
  track.scrollLeft=0;
  guestCards.forEach((card,i)=>{
   const slot=wrap(i-guestIndex);card.dataset.stackSlot=String(slot);
   card.classList.remove('is-dragging','is-flying');
   ['--swipe-x','--swipe-y','--swipe-rotation'].forEach(key=>card.style.removeProperty(key));
   card.inert=mobile.matches&&slot!==0;card.tabIndex=mobile.matches&&slot===0?0:-1;
   if(mobile.matches&&slot!==0)card.setAttribute('aria-hidden','true');else card.removeAttribute('aria-hidden');
  });
  root.querySelector('[data-hnr-guest-count]').textContent=`0${guestIndex+1} / 03`;
  syncVideos();
 }
 function advanceGuest(step,direction=step>0?-1:1){
  if(flying)return;
  const leaving=guestCards[guestIndex];flying=true;
  leaving.classList.remove('is-dragging');leaving.classList.add('is-flying');
  leaving.style.setProperty('--swipe-x',`${direction*(track.clientWidth+140)}px`);
  leaving.style.setProperty('--swipe-y','-28px');leaving.style.setProperty('--swipe-rotation',`${direction*24}deg`);
  flightTimer=setTimeout(()=>{
   const focused=leaving.contains(document.activeElement);
   guestIndex=wrap(guestIndex+step);flying=false;layoutGuests();
   if(focused)guestCards[guestIndex].focus({preventScroll:true});
  },allowed()?300:0);
 }
 guestButtons.forEach(button=>button.addEventListener('click',()=>advanceGuest(Number(button.dataset.hnrGuestStep))));
 track.addEventListener('pointerdown',event=>{
  if(!mobile.matches||flying||!event.isPrimary||event.button!==0)return;
  const card=event.target.closest('.hnr-guest-card');if(card!==guestCards[guestIndex])return;
  dragging={card,id:event.pointerId,x:event.clientX,y:event.clientY,dx:0,started:performance.now(),active:false};
 });
 track.addEventListener('pointermove',event=>{
  if(!dragging||dragging.id!==event.pointerId)return;
  const dx=event.clientX-dragging.x,dy=event.clientY-dragging.y;
  if(!dragging.active){
   if(Math.abs(dy)>Math.abs(dx)+8){dragging=null;return;}
   if(Math.abs(dx)<9)return;
   dragging.active=true;dragging.card.classList.add('is-dragging');dragging.card.setPointerCapture(event.pointerId);
  }
  dragging.dx=dx;
  dragging.card.style.setProperty('--swipe-x',`${dx}px`);
  dragging.card.style.setProperty('--swipe-y',`${Math.max(-35,Math.min(35,dy*.16))}px`);
  dragging.card.style.setProperty('--swipe-rotation',`${Math.max(-20,Math.min(20,dx/18))}deg`);
 });
 const endDrag=(event,cancel=false)=>{
  if(!dragging||dragging.id!==event.pointerId)return;
  const drag=dragging;dragging=null;
  if(drag.card.hasPointerCapture(event.pointerId))drag.card.releasePointerCapture(event.pointerId);
  if(!drag.active)return;
  const velocity=Math.abs(drag.dx)/Math.max(1,performance.now()-drag.started);
  if(!cancel&&(Math.abs(drag.dx)>Math.min(90,track.clientWidth*.22)||(Math.abs(drag.dx)>28&&velocity>.5)))advanceGuest(drag.dx<0?1:-1,drag.dx<0?-1:1);
  else layoutGuests();
 };
 track.addEventListener('pointerup',event=>endDrag(event));track.addEventListener('pointercancel',event=>endDrag(event,true));
 track.addEventListener('keydown',event=>{if(mobile.matches&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();advanceGuest(event.key==='ArrowRight'?1:-1);}});
 mobile.addEventListener('change',()=>{clearTimeout(flightTimer);dragging=null;flying=false;hover=false;layoutGuests();schedule();});
 layoutGuests();
 // Scroll-linked movement preserves the entire award photograph and its frame.
 const pride=root.querySelector('.hnr-pride-photo');
 let prideVisible=false,scrollFrame=false,lastScrollY=scrollY,reviewDistance=0,lastReviewChange=0;
 const paintScroll=()=>{
  scrollFrame=false;
  const delta=scrollY-lastScrollY;lastScrollY=scrollY;
  if(prideVisible&&allowed()){
   const rect=pride.getBoundingClientRect();
   const progress=Math.max(-1,Math.min(1,(innerHeight/2-(rect.top+rect.height/2))/((innerHeight+rect.height)/2)));
   pride.style.setProperty('--pride-y',`${-progress*(mobile.matches?14:25)}px`);
   pride.style.setProperty('--pride-rotation',`${-1.5+progress*1.8}deg`);
   pride.style.setProperty('--pride-scale',`${1+(.5-Math.abs(progress)/2)*.025}`);
  }
  if(mobile.matches&&reviewVisible&&allowed()&&!manualPause&&!document.hidden&&Math.abs(delta)<innerHeight/2){
   reviewDistance+=delta;
   if(Math.abs(reviewDistance)>115&&performance.now()-lastReviewChange>1100){
    show(current+(reviewDistance>0?1:-1));lastReviewChange=performance.now();reviewDistance=0;
   }
  }else reviewDistance=0;
 };
 const scheduleScroll=()=>{if(!scrollFrame){scrollFrame=true;requestAnimationFrame(paintScroll);}};
 addEventListener('scroll',scheduleScroll,{passive:true});addEventListener('resize',scheduleScroll);
 new IntersectionObserver(entries=>{prideVisible=entries[0].isIntersecting;scheduleScroll();},{rootMargin:'60px'}).observe(pride);
 reduced.addEventListener('change',()=>{if(!allowed())['--pride-y','--pride-rotation','--pride-scale'].forEach(key=>pride.style.removeProperty(key));});
 const reveals=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;if(allowed())entry.target.animate([{opacity:0,translate:'0 22px'},{opacity:1,translate:'0 0'}],{duration:650,easing:'ease-out'});reveals.unobserve(entry.target);}),{threshold:.1});
 root.querySelectorAll('[data-hnr-reveal]').forEach(element=>reveals.observe(element));
})();
