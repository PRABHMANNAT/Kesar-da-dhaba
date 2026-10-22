(() => {
 const root=document.querySelector('.kesar-home');
 if(!root)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const read=key=>{try{return localStorage.getItem(key);}catch{return null;}};
 let paused=read('kesar-home-motion-paused')==='true';
 const motion=()=>!paused&&!reduced.matches&&!document.body.classList.contains('motion-off');
 const motionButton=root.querySelector('[data-kh-motion]');
 const videos=[...root.querySelectorAll('[data-kh-video]')];
 const visible=new Set(),manual=new Set();
 const auto=()=>motion()&&!navigator.connection?.saveData&&read('kesar-autoplay')!=='false';
 const load=video=>{if(!video.hasAttribute('src'))video.src=video.dataset.khMobile&&matchMedia('(max-width:760px)').matches?video.dataset.khMobile:video.dataset.khVideo;};
 const syncVideos=()=>videos.forEach(video=>{
  if(visible.has(video)&&!document.hidden&&!document.querySelector('dialog[open]')&&(auto()||manual.has(video))){
   load(video);video.play().catch(()=>{});
  }else video.pause();
 });
 const paintMotion=()=>{
  root.classList.toggle('kh-motion-paused',!motion());
  motionButton.textContent=reduced.matches?'Reduced motion':motion()?'Pause motion':'Resume motion';
  motionButton.disabled=reduced.matches;
  motionButton.setAttribute('aria-pressed',String(!motion()));
  syncVideos();
 };
 motionButton.addEventListener('click',()=>{
  paused=motion();
  try{localStorage.setItem('kesar-home-motion-paused',String(paused));localStorage.setItem('kesar-motion-paused',String(paused));}catch{}
  document.body.classList.toggle('motion-off',paused);
  manual.clear();paintMotion();
 });
 const videoObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting)visible.add(entry.target);
   else {visible.delete(entry.target);entry.target.muted=true;manual.delete(entry.target);}
  });syncVideos();
 },{threshold:.25});
 videos.forEach(video=>{
  videoObserver.observe(video);
  const button=video.closest('[data-kh-film]')?.querySelector('[data-kh-sound]');
  if(!button)return;
  const paint=()=>{button.textContent=video.muted?'Sound off':'Sound on';button.setAttribute('aria-pressed',String(!video.muted));button.setAttribute('aria-label',`${video.muted?'Unmute':'Mute'} ${video.getAttribute('aria-label')||'film'}`);};
  video.addEventListener('volumechange',paint);
  button.addEventListener('click',()=>{
   const audible=video.muted;
   videos.filter(v=>v!==video).forEach(v=>{v.muted=true;manual.delete(v);});
   load(video);video.muted=!audible;
   if(audible){manual.add(video);video.play().catch(()=>{video.muted=true;manual.delete(video);paint();});}
   else {manual.delete(video);syncVideos();}
   paint();
  });
  video.addEventListener('error',()=>{button.textContent='Film unavailable';button.disabled=true;});
 });
 document.addEventListener('visibilitychange',syncVideos);
 document.addEventListener('kesar:dialogchange',syncVideos);
 reduced.addEventListener('change',paintMotion);
 new MutationObserver(paintMotion).observe(document.body,{attributes:true,attributeFilter:['class']});
 paintMotion();

 const tabs=[...root.querySelectorAll('[data-kh-dish]')];
 const activate=(index,focus=false)=>{
  tabs.forEach((tab,i)=>{
   const selected=i===index,panel=document.getElementById(tab.getAttribute('aria-controls'));
   tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;panel.hidden=!selected;
   if(selected&&motion())panel.animate([{opacity:.35,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:400,easing:'ease-out'});
  });
  if(focus)tabs[index].focus({preventScroll:true});
 };
 tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>activate(index));
  tab.addEventListener('keydown',event=>{
   let next;
   if(event.key==='ArrowRight')next=(index+1)%tabs.length;
   if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
   if(event.key==='Home')next=0;
   if(event.key==='End')next=tabs.length-1;
   if(next!==undefined){event.preventDefault();activate(next,true);}
  });
 });

 root.querySelectorAll('[data-kh-rail]').forEach(rail=>{
  const buttons=[...root.querySelectorAll('[data-kh-step]')].filter(b=>b.getAttribute('aria-controls')===rail.id);
  const update=()=>{
   const max=rail.scrollWidth-rail.clientWidth;
   buttons.forEach(button=>{button.disabled=Number(button.dataset.khStep)<0?rail.scrollLeft<=2:rail.scrollLeft>=max-2;});
   if(buttons[0])buttons[0].parentElement.hidden=max<3;
  };
  const step=direction=>rail.scrollBy({left:direction*((rail.firstElementChild?.getBoundingClientRect().width||rail.clientWidth)+16),behavior:motion()?'smooth':'instant'});
  buttons.forEach(button=>button.addEventListener('click',()=>step(Number(button.dataset.khStep))));
  rail.addEventListener('keydown',event=>{if(event.target!==rail)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();step(event.key==='ArrowRight'?1:-1);}});
  let drag=null,suppressClick=false;
  rail.addEventListener('pointerdown',event=>{
   if(event.pointerType!=='mouse'||event.button!==0||event.target.closest('button')||rail.scrollWidth<=rail.clientWidth+2)return;
   drag={id:event.pointerId,x:event.clientX,left:rail.scrollLeft,moved:false};suppressClick=false;
  });
  rail.addEventListener('pointermove',event=>{
   if(!drag||drag.id!==event.pointerId)return;
   const delta=event.clientX-drag.x;
   if(Math.abs(delta)>6&&!drag.moved){drag.moved=true;rail.setPointerCapture(event.pointerId);rail.style.scrollSnapType='none';}
   if(drag.moved){event.preventDefault();rail.scrollLeft=drag.left-delta;}
  });
  const finish=()=>{if(!drag)return;suppressClick=drag.moved;if(rail.hasPointerCapture(drag.id))rail.releasePointerCapture(drag.id);rail.style.removeProperty('scroll-snap-type');drag=null;};
  rail.addEventListener('pointerup',finish);rail.addEventListener('pointercancel',finish);rail.addEventListener('lostpointercapture',()=>{rail.style.removeProperty('scroll-snap-type');drag=null;});
  rail.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopPropagation();suppressClick=false;}},true);
  rail.addEventListener('dragstart',event=>event.preventDefault());
  rail.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(rail);update();
 });

 const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('kh-visible');reveal.unobserve(entry.target);}
 }),{threshold:.08,rootMargin:'0px 0px -20px 0px'});
 root.querySelectorAll('[data-kh-reveal]').forEach(item=>{item.classList.add('kh-reveal-ready');reveal.observe(item);});
 const hero=root.querySelector('.kh-hero');
 const journey=root.querySelector('.kh-journey');
 const top=root.querySelector('[data-kh-top]');
 let scheduled=false;
 const scroll=()=>{
  scheduled=false;top.hidden=scrollY<650;
  if(motion()){
   const bounds=hero.getBoundingClientRect();
   if(bounds.bottom>0&&bounds.top<innerHeight){const progress=Math.max(0,Math.min(1,-bounds.top/bounds.height));root.style.setProperty('--kh-hero-zoom',String(1.025+progress*.065));}
   const story=journey.getBoundingClientRect();
   if(story.bottom>0&&story.top<innerHeight){const progress=Math.max(0,Math.min(1,(innerHeight-story.top)/(innerHeight+story.height)));journey.style.setProperty('--kh-journey-tilt',`${-3+progress*6}deg`);}
  }
 };
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(scroll);}},{passive:true});
 top.addEventListener('click',()=>window.scrollTo({top:0,behavior:motion()?'smooth':'instant'}));
 scroll();
})();
