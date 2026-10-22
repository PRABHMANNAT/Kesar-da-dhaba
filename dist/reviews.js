(() => {
 const stage=document.querySelector('.reviews-stage');
 const cards=[...stage.querySelectorAll('.review-card')];
 const videos=cards.map(card=>card.querySelector('video'));
 const highlight=stage.querySelector('.reviews-highlight');
 const position=document.querySelector('.reviews-position');
 const mobile=matchMedia('(max-width:700px)');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const paused=new WeakSet();
 let start=0,current=0,visible=false,audioWanted=true,request=0,drag=null,leaving=false,suppressClick=false;
 const wrap=index=>(index+cards.length)%cards.length;
 const paint=()=>cards.forEach((card,i)=>{
  const video=videos[i],sound=card.querySelector('.review-listen'),play=card.querySelector('.review-play');
  sound.setAttribute('aria-pressed',String(!video.muted));
  sound.setAttribute('aria-label',`${video.muted?'Listen to':'Mute'} guest review ${i+1}`);
  sound.querySelector('span').textContent=video.muted?'Listen':'Sound on';
  play.textContent=video.paused?'Play':'Pause';
  play.setAttribute('aria-label',`${video.paused?'Play':'Pause'} guest review ${i+1}`);
  play.setAttribute('aria-pressed',String(!video.paused));
 });
 const moveHighlight=()=>{
  if(mobile.matches)return;
  const rect=cards[current].getBoundingClientRect();
  const gap=matchMedia('(max-width:1023px)').matches?16:24;
  highlight.style.width=`${rect.width+24}px`;highlight.style.height=`${rect.height+24}px`;
  highlight.style.transform=`translate(${wrap(current-start)*(rect.width+gap)}px,0)`;
 };
 const sync=(gesture=false)=>{
  const token=++request;
  videos.forEach((video,i)=>{if(i!==current||!visible||document.hidden){video.pause();video.muted=true;}});
  const video=videos[current];
  if(!visible||document.hidden||paused.has(video)||(reduced.matches&&!gesture)){paint();return;}
  if(!video.getAttribute('src'))video.src=video.dataset.src;
  video.muted=!audioWanted;
  video.play().catch(()=>{
   if(token!==request||!visible||document.hidden||paused.has(video))return;
   video.muted=true;
   video.play().catch(()=>{}).finally(paint);
  });
  paint();
 };
 const select=(index,gesture=false)=>{
  current=wrap(index);
  cards.forEach((card,i)=>card.classList.toggle('is-current',i===current));
  position.textContent=`${String(current+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
  moveHighlight();sync(gesture);
 };
 const layout=(gesture=false)=>{
  cards.forEach((card,i)=>{
   const slot=wrap(i-start),shown=slot<3,accessible=shown&&(!mobile.matches||slot===0);
   card.hidden=!shown;card.style.setProperty('--slot',slot);
   card.classList.toggle('is-front',slot===0);card.classList.toggle('is-shown',shown);
   card.setAttribute('aria-hidden',String(!accessible));
   card.inert=!accessible;
  });
  select(start,gesture);
 };
 const change=(direction,gesture=true)=>{
  if(leaving)return;
  if(mobile.matches&&!reduced.matches){
   leaving=true;
   const card=cards[start];card.classList.remove('is-dragging');card.classList.add('is-leaving');
   card.style.setProperty('--drag-x',`${-direction*(stage.clientWidth+120)}px`);
   card.style.setProperty('--drag-rotate',`${-direction*18}deg`);
   setTimeout(()=>{
    card.classList.remove('is-leaving');card.style.removeProperty('--drag-x');card.style.removeProperty('--drag-rotate');
    start=wrap(start+direction);leaving=false;layout(gesture);
   },280);
  }else{start=wrap(start+direction);layout(gesture);}
 };
 cards.forEach((card,i)=>{
  const video=videos[i];
  card.addEventListener('pointerenter',event=>{if(!mobile.matches&&event.pointerType==='mouse'&&i!==current)select(i);});
  card.addEventListener('focusin',()=>{if(!card.hidden&&!card.inert&&i!==current)select(i);});
  card.querySelector('.review-listen').addEventListener('click',()=>{
   audioWanted=video.muted;paused.delete(video);select(i,true);
  });
  card.querySelector('.review-play').addEventListener('click',()=>{
   if(video.paused){paused.delete(video);select(i,true);}else{paused.add(video);video.pause();paint();}
  });
  card.querySelector('.review-screen').addEventListener('click',event=>{
   if(event.target.closest('button,a')||suppressClick)return;
   audioWanted=true;paused.delete(video);select(i,true);
  });
  ['play','pause','volumechange'].forEach(event=>video.addEventListener(event,paint));
  video.addEventListener('error',()=>{card.querySelector('.review-error').hidden=false;});
  card.addEventListener('pointerdown',event=>{
   if(!mobile.matches||leaving||i!==start||event.target.closest('button,a')||!event.isPrimary)return;
   drag={id:event.pointerId,x:event.clientX,y:event.clientY,card,moved:false};
  });
  card.addEventListener('pointermove',event=>{
   if(!drag||drag.id!==event.pointerId)return;
   const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
   if(!drag.moved&&Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>10){drag=null;return;}
   if(Math.abs(dx)>10&&!drag.moved){drag.moved=true;card.setPointerCapture(event.pointerId);card.classList.add('is-dragging');}
   if(drag.moved){card.style.setProperty('--drag-x',`${dx}px`);card.style.setProperty('--drag-rotate',`${dx/22}deg`);}
  });
  const endDrag=(event,cancel=false)=>{
   if(!drag||drag.id!==event.pointerId)return;
   const dx=event.clientX-drag.x,moved=drag.moved;drag=null;
   card.classList.remove('is-dragging');
   if(card.hasPointerCapture(event.pointerId))card.releasePointerCapture(event.pointerId);
   if(moved){suppressClick=true;setTimeout(()=>{suppressClick=false;},0);}
   if(!cancel&&moved&&Math.abs(dx)>Math.min(75,stage.clientWidth*.23))change(dx<0?1:-1);
   else{card.style.removeProperty('--drag-x');card.style.removeProperty('--drag-rotate');}
  };
  card.addEventListener('pointerup',event=>endDrag(event));
  card.addEventListener('pointercancel',event=>endDrag(event,true));
 });
 document.querySelectorAll('[data-review-step]').forEach(button=>button.addEventListener('click',()=>change(Number(button.dataset.reviewStep))));
 stage.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();change(event.key==='ArrowRight'?1:-1);}});
 new IntersectionObserver(entries=>{
  visible=entries[0].isIntersecting;sync();
 },{threshold:.25}).observe(stage);
 document.addEventListener('visibilitychange',()=>sync());
 mobile.addEventListener('change',()=>layout());
 reduced.addEventListener('change',()=>{videos.forEach(video=>{video.pause();video.muted=true;});if(!reduced.matches)sync();});
 addEventListener('resize',()=>requestAnimationFrame(moveHighlight));
 layout();
})();
