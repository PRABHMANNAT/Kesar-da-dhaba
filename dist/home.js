(() => {
 const root=document.querySelector('.kesar-home');if(!root)return;
 const M=window.Motion,reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:760px)');
 const read=key=>{try{return localStorage.getItem(key)}catch{return null}};
 let paused=read('kesar-home-motion-paused')==='true'||read('kesar-motion-paused')==='true';
 const motion=()=>!paused&&!reduced.matches;
 const animations=new Set(),scrollStops=[];
 const animate=(element,values,options={})=>{
  if(!motion()||!M)return null;
  const control=M.animate(element,values,{duration:.7,ease:[.22,1,.36,1],...options});animations.add(control);
  Promise.resolve(control).then(()=>animations.delete(control),()=>animations.delete(control));return control;
 };
 const videos=[...root.querySelectorAll('[data-kh-video]')],visible=new Set(),ready=new Set(),timers=new Map(),manual=new Set(),userPaused=new Set();
 const load=video=>{if(!video.hasAttribute('src'))video.src=video.dataset.khMobile&&mobile.matches?video.dataset.khMobile:video.dataset.khVideo};
 const videoAllowed=video=>{if(video.closest('[data-kh-reel]')?.hidden)return false;return !mobile.matches||!video.closest('.kh-deck-card')||video.closest('.kh-deck-card').classList.contains('is-active')};
 const auto=()=>motion()&&!navigator.connection?.saveData&&read('kesar-autoplay')!=='false';
 const syncVideos=()=>videos.forEach(video=>{
  if(visible.has(video)&&videoAllowed(video)&&!document.hidden&&!document.querySelector('dialog[open]')&&!userPaused.has(video)&&((auto()&&ready.has(video))||manual.has(video))){load(video);if(video.paused)video.play().catch(()=>{});}
  else if(!video.paused)video.pause();
 });
 const videoObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{const video=entry.target;if(entry.isIntersecting&&entry.intersectionRatio>.08){visible.add(video);if(!ready.has(video)&&!timers.has(video))timers.set(video,setTimeout(()=>{timers.delete(video);if(visible.has(video)){ready.add(video);syncVideos()}},180));}else{visible.delete(video);ready.delete(video);clearTimeout(timers.get(video));timers.delete(video);manual.delete(video);video.muted=true;}});syncVideos();
 },{threshold:[0,.1,.25]});
 videos.forEach(video=>{
  videoObserver.observe(video);
  const film=video.closest('[data-kh-film]'),sound=film?.querySelector('[data-kh-sound]'),play=film?.querySelector('[data-kh-play]');
  const label=video.getAttribute('aria-label')||'film';
  const paint=()=>{
   if(sound){sound.textContent=video.muted?'Sound off':'Sound on';sound.setAttribute('aria-pressed',String(!video.muted));sound.setAttribute('aria-label',`${video.muted?'Listen to':'Mute'} ${label}`);}
   if(play){play.textContent=video.paused?'Play':'Pause';play.setAttribute('aria-pressed',String(userPaused.has(video)));play.setAttribute('aria-label',`${video.paused?'Play':'Pause'} ${label}`);}
  };
  ['play','pause','volumechange'].forEach(event=>video.addEventListener(event,paint));paint();
  sound?.addEventListener('click',()=>{
   const audible=video.muted;videos.filter(v=>v!==video).forEach(v=>{v.muted=true;manual.delete(v)});
   video.muted=!audible;
   if(audible){userPaused.delete(video);manual.add(video);load(video);video.play().catch(()=>{video.muted=true;manual.delete(video);paint()});}
   else{manual.delete(video);syncVideos();}paint();
  });
  play?.addEventListener('click',()=>{
   if(video.paused){userPaused.delete(video);manual.add(video);load(video);video.play().catch(()=>{});}
   else{userPaused.add(video);manual.delete(video);video.pause();}paint();
  });
  video.addEventListener('error',()=>{if(play){play.textContent='Film unavailable';play.disabled=true}if(sound)sound.disabled=true;});
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)videos.forEach(v=>{v.muted=true;manual.delete(v)});syncVideos()});
 document.addEventListener('kesar:dialogchange',syncVideos);

 const motionButton=root.querySelector('[data-kh-motion]');
 function clearScroll(){scrollStops.splice(0).forEach(stop=>stop());root.querySelectorAll('[data-kh-tilt],.kh-hero-media,[data-kh-legacy-scroll],[data-kh-legacy-scroll] video,[data-kh-legacy-scroll] .kh-seal,[data-kh-visit-float]').forEach(el=>{el.style.removeProperty('transform');el.style.removeProperty('opacity')});}
 function setupScroll(){
  clearScroll();if(!motion()||!M)return;
  const hero=root.querySelector('.kh-hero'),heroMedia=root.querySelector('.kh-hero-media');
  scrollStops.push(M.scroll(progress=>{heroMedia.style.transform=`scale(${1+progress*.12})`;},{target:hero,offset:['start start','end start']}));
  const legacy=root.querySelector('[data-kh-legacy-scroll]');
  if(legacy){const clip=legacy.querySelector('video'),seal=legacy.querySelector('.kh-seal');scrollStops.push(M.scroll(progress=>{
   const shift=(mobile.matches?24:34)*(1-progress)-(mobile.matches?12:22)*progress;
   const rotate=6-progress*10,turn=mobile.matches?0:10-progress*17,scale=.94+Math.sin(progress*Math.PI)*.08;
   legacy.style.transform=`perspective(1100px) translate3d(0,${shift}px,0) rotate(${rotate}deg) rotateY(${turn}deg) scale(${scale})`;
   clip.style.transform=`scale(1.08) translateY(${(progress-.5)*3}%)`;
   if(seal)seal.style.transform=`translateY(${(progress-.5)*24}px) rotate(${(progress-.5)*14}deg)`;
  },{target:root.querySelector('#home-legacy'),offset:['start end','end start']}));}
  const visitDish=root.querySelector('[data-kh-visit-float]');
  if(visitDish)scrollStops.push(M.scroll(progress=>{visitDish.style.transform=`translateY(${(1-progress)*38}px) rotate(${-10+progress*18}deg)`;},{target:root.querySelector('#home-visit'),offset:['start end','end start']}));
  root.querySelectorAll('[data-kh-tilt]').forEach((el,i)=>{
   scrollStops.push(M.scroll(progress=>{el.style.transform=`translateY(${(1-progress)*16}px) rotate(${(progress-.5)*(i%2?-4:4)}deg)`;},{target:el.parentElement,offset:['start end','end start']}));
  });
 }
 function paintMotion(){
  root.classList.toggle('kh-motion-paused',!motion());motionButton.textContent=reduced.matches?'Reduced motion':motion()?'Pause motion':'Resume motion';motionButton.disabled=reduced.matches;motionButton.setAttribute('aria-pressed',String(!motion()));
  if(!motion()){
   animations.forEach(a=>{a.stop?.()});animations.clear();
   root.querySelectorAll('[data-kh-reveal],.kh-word').forEach(el=>{el.style.opacity='1';el.style.transform='none'});
   videos.forEach(v=>{v.muted=true;manual.delete(v)});
  }
  const awardControl=root.querySelector('[data-kh-awards-pause]');if(awardControl){awardControl.disabled=!motion();awardControl.textContent=!motion()?'Honours paused':root.classList.contains('kh-awards-paused')?'Resume honours':'Pause honours';}
  setupScroll();syncVideos();
 }
 motionButton.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('kesar-home-motion-paused',String(paused))}catch{}paintMotion()});
 reduced.addEventListener('change',()=>{paintMotion();layoutDeck(false)});

 // Word masks preserve the original headings and natural line breaks.
 root.querySelectorAll('[data-kh-text]').forEach(heading=>{
  const walk=node=>[...node.childNodes].forEach(child=>{
   if(child.nodeType===Node.TEXT_NODE){const fragment=document.createDocumentFragment();child.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim())fragment.append(document.createTextNode(word));else{const clip=document.createElement('span'),inner=document.createElement('span');clip.className='kh-word-clip';inner.className='kh-word';inner.textContent=word;clip.append(inner);fragment.append(clip)}});child.replaceWith(fragment);}
   else if(child.nodeType===Node.ELEMENT_NODE)walk(child);
  });walk(heading);
 });
 const revealElement=el=>{
  if(!motion()||!M)return;
  if(el.matches('[data-kh-text]'))animate(el.querySelectorAll('.kh-word'),{y:['110%','0%'],opacity:[0,1]},{duration:.9,delay:M.stagger(.035)});
  else animate(el,{y:[30,0],opacity:[0,1]},{duration:.85,delay:Number(el.dataset.khDelay||0)});
 };
 if(M){M.inView(root.querySelectorAll('[data-kh-reveal]'),el=>{revealElement(el)},{amount:.12,margin:'0px 0px -15px 0px'});M.inView(root.querySelectorAll('[data-kh-text]'),el=>{revealElement(el)},{amount:.2});}

 root.querySelectorAll('[data-kh-rail]').forEach(rail=>{
  const buttons=[...root.querySelectorAll('[data-kh-step]')].filter(b=>b.getAttribute('aria-controls')===rail.id),count=root.querySelector(`[data-kh-position="${rail.id}"]`),cards=[...rail.children];
  const spacing=()=>cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:rail.clientWidth;
  let raf=0;
  const update=()=>{
   raf=0;const max=rail.scrollWidth-rail.clientWidth;
   buttons.forEach(b=>b.disabled=Number(b.dataset.khStep)<0?rail.scrollLeft<3:rail.scrollLeft>max-3);
   const center=rail.scrollLeft+rail.clientWidth/2;
   const current=cards.reduce((best,card,i)=>Math.abs(card.offsetLeft-rail.offsetLeft+card.offsetWidth/2-center)<best.distance?{index:i,distance:Math.abs(card.offsetLeft-rail.offsetLeft+card.offsetWidth/2-center)}:best,{index:0,distance:Infinity}).index;
   cards.forEach((card,i)=>card.classList.toggle('is-current',i===current));
   if(count)count.textContent=`${String(current+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
  };
  const step=direction=>rail.scrollBy({left:direction*spacing(),behavior:motion()?'smooth':'instant'});
  buttons.forEach(b=>b.addEventListener('click',()=>step(Number(b.dataset.khStep))));
  rail.addEventListener('keydown',event=>{if(event.target!==rail)return;if(['ArrowRight','ArrowLeft'].includes(event.key)){event.preventDefault();step(event.key==='ArrowRight'?1:-1)}});
  rail.addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(update)},{passive:true});new ResizeObserver(update).observe(rail);update();
  let drag=null,suppressClick=false;
  rail.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'||event.button||event.target.closest('button'))return;drag={id:event.pointerId,x:event.clientX,left:rail.scrollLeft,moved:false};suppressClick=false});
  rail.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;const delta=event.clientX-drag.x;if(Math.abs(delta)>7&&!drag.moved){drag.moved=true;rail.setPointerCapture(event.pointerId);rail.style.scrollSnapType='none'}if(drag.moved){event.preventDefault();rail.scrollLeft=drag.left-delta}});
  const finish=()=>{if(!drag)return;suppressClick=drag.moved;if(rail.hasPointerCapture(drag.id))rail.releasePointerCapture(drag.id);drag=null;rail.style.removeProperty('scroll-snap-type')};
  rail.addEventListener('pointerup',finish);rail.addEventListener('pointercancel',finish);rail.addEventListener('lostpointercapture',()=>{drag=null;rail.style.removeProperty('scroll-snap-type')});
  rail.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopPropagation();suppressClick=false}},true);rail.addEventListener('dragstart',event=>event.preventDefault());
 });

 const deck=root.querySelector('.kh-deck'),deckCards=[...deck.querySelectorAll('[data-kh-deck-card]')];let deckIndex=0,deckBusy=false,drag=null;
 function layoutDeck(spring=true){
  deckCards.forEach((card,i)=>{
   const rank=(i-deckIndex+deckCards.length)%deckCards.length,isMobile=mobile.matches;
   card.classList.toggle('is-active',i===deckIndex);card.setAttribute('aria-hidden',String(isMobile&&rank!==0));card.style.zIndex=String(3-rank);
   const target=isMobile?`translate(${rank===0?0:rank===1?-8:8}px,${rank*5}px) rotate(${rank===0?0:rank===1?-5:5}deg) scale(${1-rank*.035})`:'none';
   if(spring&&motion()&&M)animate(card,{transform:target,opacity:1},{type:'spring',stiffness:230,damping:27});else{card.style.transform=target;card.style.opacity='1'}
  });root.querySelector('[data-kh-deck-count]').textContent=`0${deckIndex+1} / 03`;syncVideos();
 }
 async function changeDeck(direction){
  if(deckBusy)return;deckBusy=true;
  try{if(mobile.matches&&motion()&&M){const card=deckCards[deckIndex];await Promise.race([animate(card,{transform:`translateX(${direction>0?-360:360}px) rotate(${direction>0?-17:17}deg)`,opacity:0},{duration:.28}),new Promise(resolve=>setTimeout(resolve,350))])}deckIndex=(deckIndex+direction+deckCards.length)%deckCards.length;layoutDeck(true);}finally{deckBusy=false}
 }
 root.querySelectorAll('[data-kh-deck-step]').forEach(b=>b.addEventListener('click',()=>changeDeck(Number(b.dataset.khDeckStep))));
 deck.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();changeDeck(event.key==='ArrowRight'?1:-1)}});
 deck.addEventListener('pointerdown',event=>{if(!mobile.matches||deckBusy||event.button)return;drag={id:event.pointerId,x:event.clientX,y:event.clientY,moved:false};});
 deck.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)*1.2&&!drag.moved){drag.moved=true;deck.setPointerCapture(event.pointerId)}if(drag.moved){event.preventDefault();deckCards[deckIndex].style.transform=`translateX(${dx}px) rotate(${dx/22}deg)`}});
 deck.addEventListener('pointerup',event=>{if(!drag)return;const dx=event.clientX-drag.x,wasMoved=drag.moved;drag=null;if(deck.hasPointerCapture(event.pointerId))deck.releasePointerCapture(event.pointerId);if(wasMoved&&Math.abs(dx)>65)changeDeck(dx<0?1:-1);else layoutDeck(true)});
 deck.addEventListener('pointercancel',()=>{drag=null;layoutDeck(true)});deck.addEventListener('dragstart',event=>event.preventDefault());
 mobile.addEventListener('change',()=>{layoutDeck(false);videos.filter(v=>v.dataset.khMobile&&v.hasAttribute('src')).forEach(v=>{v.pause();v.removeAttribute('src');load(v)});syncVideos()});layoutDeck(false);

 const albumToggle=root.querySelector('[data-kh-album-toggle]'),album=root.querySelector('#kh-home-album');
 albumToggle.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||albumToggle.getAttribute('aria-expanded')==='true')return;
  event.preventDefault();album.hidden=false;albumToggle.setAttribute('aria-expanded','true');albumToggle.innerHTML='Explore all celebrity visits <span aria-hidden="true">↗</span>';
  root.querySelector('[data-kh-album-hint]').textContent='All 27 photographs are open below. Click again to visit the complete celebrity page.';
  animate(album,{opacity:[0,1],y:[20,0]},{duration:.7});
 });
 const reelStage=root.querySelector('[data-kh-reel-stage]'),reelSlides=[...root.querySelectorAll('[data-kh-reel]')];let reelIndex=0,reelDrag=null;
 const showReel=(next,direction=1)=>{
  reelIndex=(next+reelSlides.length)%reelSlides.length;
  reelSlides.forEach((slide,i)=>{const selected=i===reelIndex;slide.hidden=!selected;const film=slide.querySelector('video');if(!selected){film.pause();film.muted=true;manual.delete(film)}else if(film.ended)film.currentTime=0;});
  root.querySelector('[data-kh-reel-count]').textContent=`0${reelIndex+1} / 03`;
  root.querySelectorAll('[data-kh-reel-select]').forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===reelIndex)));
  animate(reelSlides[reelIndex],{opacity:[.35,1],x:[direction*18,0]},{duration:.35});syncVideos();
 };
 root.querySelectorAll('[data-kh-reel-step]').forEach(button=>button.addEventListener('click',()=>{const direction=Number(button.dataset.khReelStep);showReel(reelIndex+direction,direction)}));
 root.querySelectorAll('[data-kh-reel-select]').forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.khReelSelect);if(index!==reelIndex)showReel(index,index>reelIndex?1:-1)}));
 reelSlides.forEach((slide,i)=>{const film=slide.querySelector('video');film.addEventListener('ended',()=>{if(i===reelIndex&&!document.hidden&&auto()&&visible.has(film)&&!userPaused.has(film))showReel(reelIndex+1)});});
 reelStage.addEventListener('keydown',event=>{if(event.target!==reelStage)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const direction=event.key==='ArrowRight'?1:-1;showReel(reelIndex+direction,direction)}});
 reelStage.addEventListener('pointerdown',event=>{if(event.button||event.target.closest('button,a'))return;reelDrag={id:event.pointerId,x:event.clientX,y:event.clientY,moved:false}});
 reelStage.addEventListener('pointermove',event=>{if(!reelDrag||reelDrag.id!==event.pointerId)return;const dx=event.clientX-reelDrag.x,dy=event.clientY-reelDrag.y;if(Math.abs(dx)>9&&Math.abs(dx)>Math.abs(dy)*1.2&&!reelDrag.moved){reelDrag.moved=true;reelStage.setPointerCapture(event.pointerId)}if(reelDrag.moved)event.preventDefault()});
 reelStage.addEventListener('pointerup',event=>{if(!reelDrag)return;const dx=event.clientX-reelDrag.x,change=reelDrag.moved&&Math.abs(dx)>55;reelDrag=null;if(reelStage.hasPointerCapture(event.pointerId))reelStage.releasePointerCapture(event.pointerId);if(change)showReel(reelIndex+(dx<0?1:-1),dx<0?1:-1)});
 reelStage.addEventListener('pointercancel',()=>{reelDrag=null});reelStage.addEventListener('dragstart',event=>event.preventDefault());
 const top=root.querySelector('[data-kh-top]');let scrollFrame=0;
 addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{top.hidden=scrollY<650;scrollFrame=0})},{passive:true});
 top.addEventListener('click',()=>window.scrollTo({top:0,behavior:motion()?'smooth':'instant'}));top.hidden=scrollY<650;
 // Changing kitchen copy; the full heading stays stable for screen readers.
 const cycleText=root.querySelector('[data-kh-cycle]');let cycleIndex=0;
 setInterval(()=>{if(!motion()||document.hidden)return;const r=cycleText.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const words=cycleText.dataset.khCycle.split('|');cycleText.textContent=words[++cycleIndex%words.length]},4500);
 paintMotion();
})();
