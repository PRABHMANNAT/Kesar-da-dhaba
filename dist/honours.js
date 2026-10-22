(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.recognition-marquee').forEach(section=>{
    const button=section.querySelector('[data-marquee-toggle]');
    let paused=false;
    const paint=()=>{
      const stopped=reduced.matches||document.body.classList.contains('motion-off');
      section.classList.toggle('is-paused',paused);
      button.disabled=stopped;
      button.setAttribute('aria-pressed',String(stopped||paused));
      button.textContent=stopped?'Motion paused':paused?'Resume marquee':'Pause marquee';
    };
    button.addEventListener('click',()=>{paused=!paused;paint();});
    new MutationObserver(paint).observe(document.body,{attributes:true,attributeFilter:['class']});
    reduced.addEventListener('change',paint);
    paint();
  });
  const filters=[...document.querySelectorAll('[data-honour-filter]')];
  const cards=[...document.querySelectorAll('[data-honour-kind]')];
  const motionAllowed=()=>!reduced.matches&&!document.body.classList.contains('motion-off');
  const animations=new Set();
  const seenCards=new WeakSet();
  const animate=(element,keyframes,options)=>{
    if(!motionAllowed()||!element.animate)return;
    const animation=element.animate(keyframes,options);
    animations.add(animation);
    const clean=()=>animations.delete(animation);
    animation.finished.then(clean,clean);
    return animation;
  };
  const stopMotion=()=>{
    if(motionAllowed())return;
    animations.forEach(animation=>animation.cancel());
    animations.clear();
  };
  reduced.addEventListener('change',stopMotion);
  new MutationObserver(stopMotion).observe(document.body,{attributes:true,attributeFilter:['class']});
  filters.forEach(button=>button.addEventListener('click',()=>{
    if(button.getAttribute('aria-pressed')==='true')return;
    const category=button.dataset.honourFilter;
    animations.forEach(animation=>animation.cancel());
    const previous=new Map(cards.filter(card=>!card.hidden).map(card=>[card,card.getBoundingClientRect()]));
    let count=0;
    filters.forEach(filter=>filter.setAttribute('aria-pressed',String(filter===button)));
    cards.forEach(card=>{card.hidden=category!=='all'&&category!==card.dataset.honourKind;if(!card.hidden)count++;});
    cards.filter(card=>!card.hidden).forEach((card,index)=>{
      seenCards.add(card);
      const before=previous.get(card);
      const after=card.getBoundingClientRect();
      const x=before?before.left-after.left:0;
      const y=before?before.top-after.top:14;
      animate(card,[
        {transform:`translate(${x}px,${y}px)`,opacity:before?1:0},
        {transform:'translate(0,0)',opacity:1}
      ],{duration:430,delay:before?0:index*45,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
    });
    const status=document.querySelector('[data-honour-results]');
    if(status)status.textContent=`${count} ${count===1?'recognition':'recognitions'} shown`;
  }));

  // Only animate newly encountered cards; the readable layout is the default.
  if('IntersectionObserver' in window){
    const reveals=new IntersectionObserver(entries=>{
      const entering=entries.filter(entry=>entry.isIntersecting&&!entry.target.hidden);
      entering.forEach((entry,index)=>{
        if(!seenCards.has(entry.target)){
          seenCards.add(entry.target);
          animate(entry.target,[{opacity:0,transform:'translateY(28px)'},{opacity:1,transform:'translateY(0)'}],{
            duration:650,delay:matchMedia('(min-width: 761px)').matches?index*85:0,
            easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'
          });
        }
        reveals.unobserve(entry.target);
      });
    },{threshold:.08});
    [...cards,...document.querySelectorAll('[data-honour-reveal],.community-ratings>article')].forEach(card=>reveals.observe(card));
    const sections=new IntersectionObserver(entries=>{
      entries.forEach(entry=>entry.target.classList.toggle('is-in-view',entry.isIntersecting));
    },{threshold:0});
    document.querySelectorAll('.honours-hero,.honours-food-note').forEach(section=>sections.observe(section));
  }
  document.querySelectorAll('.culinary-flourish path').forEach(path=>path.setAttribute('pathLength','1'));

  // Enhance the readable press archive with manual navigation; no timed slide changes.
  const reviews=document.querySelector('.honours-reviews');
  if(reviews){
    const panels=[...reviews.querySelectorAll('[data-review-panel]')];
    const choices=[...reviews.querySelectorAll('[data-review-select]')];
    const stage=reviews.querySelector('[data-review-stage]');
    const publications=reviews.querySelector('[data-review-publications]');
    let current=0;
    let entrance;
    const selectReview=(index,interacted=true)=>{
      const next=(index+panels.length)%panels.length;
      if(interacted&&next===current)return;
      const direction=index<current?-1:1;
      entrance?.cancel();
      current=next;
      panels.forEach((panel,i)=>panel.hidden=i!==current);
      choices.forEach((choice,i)=>choice.setAttribute('aria-pressed',String(i===current)));
      reviews.querySelector('[data-review-count]').textContent=`${String(current+1).padStart(2,'0')} / ${String(panels.length).padStart(2,'0')}`;
      reviews.querySelector('[data-review-count]').setAttribute('aria-label',`Review ${current+1} of ${panels.length}: ${panels[current].querySelector('h3').textContent}`);
      if(interacted){
        entrance=animate(panels[current],[
          {opacity:0,transform:`translateX(${direction*26}px)`},
          {opacity:1,transform:`translateX(${-direction*2}px)`,offset:.8},
          {opacity:1,transform:'translateX(0)'}
        ],{duration:540,easing:'cubic-bezier(.22,1,.36,1)'});
        const choice=choices[current];
        const left=publications.scrollLeft+choice.getBoundingClientRect().left-publications.getBoundingClientRect().left-(publications.clientWidth-choice.offsetWidth)/2;
        publications.scrollTo({left,behavior:motionAllowed()?'smooth':'instant'});
      }
    };
    if(panels.length){
      selectReview(0,false);
      reviews.classList.add('reviews-enhanced');
      reviews.querySelector('[data-review-controls]').hidden=false;
      publications.hidden=false;
      // Keep the reading area stable as differently sized reviews are selected.
      const sizeReadingRoom=()=>{
        if(!stage.clientWidth)return;
        let tallest=0;
        panels.forEach(panel=>{
          const wasHidden=panel.hidden;
          const originalStyle=panel.getAttribute('style');
          panel.hidden=false;
          Object.assign(panel.style,{position:'absolute',visibility:'hidden',width:`${stage.clientWidth}px`});
          tallest=Math.max(tallest,panel.getBoundingClientRect().height);
          if(originalStyle===null)panel.removeAttribute('style');
          else panel.setAttribute('style',originalStyle);
          panel.hidden=wasHidden;
        });
        stage.style.minHeight=`${Math.ceil(tallest)}px`;
      };
      sizeReadingRoom();
      document.fonts?.ready.then(sizeReadingRoom);
      if('ResizeObserver' in window){
        let previousWidth=0;
        new ResizeObserver(entries=>{
          const width=entries[0].contentRect.width;
          if(width!==previousWidth){previousWidth=width;sizeReadingRoom();}
        }).observe(stage);
      }else addEventListener('resize',sizeReadingRoom);
      stage.tabIndex=0;
      stage.setAttribute('role','group');
      stage.setAttribute('aria-label','Press reviews. Use Left and Right arrow keys to change review.');
      choices.forEach((choice,i)=>choice.addEventListener('click',()=>selectReview(i)));
      reviews.querySelector('[data-review-prev]').addEventListener('click',()=>selectReview(current-1));
      reviews.querySelector('[data-review-next]').addEventListener('click',()=>selectReview(current+1));
      stage.addEventListener('keydown',event=>{
        if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
          event.preventDefault();selectReview(current+(event.key==='ArrowRight'?1:-1));
        }else if(event.key==='Home'||event.key==='End'){
          event.preventDefault();selectReview(event.key==='Home'?0:panels.length-1);
        }
      });
      let touch=null;
      stage.addEventListener('pointerdown',event=>{
        if(event.pointerType==='touch'||event.pointerType==='pen'){
          touch={x:event.clientX,y:event.clientY,id:event.pointerId};
          stage.setPointerCapture(event.pointerId);
        }
      },{passive:true});
      stage.addEventListener('pointerup',event=>{
        if(!touch||touch.id!==event.pointerId)return;
        const x=event.clientX-touch.x,y=event.clientY-touch.y;
        touch=null;
        if(Math.abs(x)>48&&Math.abs(x)>Math.abs(y)*1.4)selectReview(current+(x<0?1:-1));
      },{passive:true});
      stage.addEventListener('pointercancel',()=>{touch=null;},{passive:true});
    }
  }

  const dialog=document.querySelector('.honour-dialog');
  if(dialog){
    let trigger=null;
    const notifyDialog=()=>document.dispatchEvent(new Event('kesar:dialogchange'));
    document.querySelectorAll('[data-honour-open]').forEach(button=>button.addEventListener('click',()=>{
      trigger=button;
      const card=button.closest('.honour-card');
      const original=card.querySelector('.honour-card-art>img');
      const image=dialog.querySelector('.honour-dialog-art>img');
      image.src=original.getAttribute('src');
      image.alt=original.alt;
      dialog.querySelector('.honour-dialog-category').textContent=card.querySelector('.honour-kind').textContent;
      dialog.querySelector('.honour-dialog-issuer').textContent=card.querySelector('.honour-issuer').textContent;
      dialog.querySelector('#honour-dialog-title').textContent=card.querySelector('h3').textContent;
      dialog.querySelector('.honour-dialog-date').textContent=[...card.querySelectorAll('.honour-card-bottom>span:not([aria-hidden])')]
        .map(item=>item.textContent.trim()).join(' · ');
      dialog.querySelector('.honour-dialog-description').textContent=card.querySelector('.honour-card-copy>p')?.textContent||
        'From the published recognition archive of Kesar Da Dhaba, Amritsar.';
      dialog.showModal();
      notifyDialog();
      animate(dialog,[{opacity:0,transform:'translateY(16px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{
        duration:350,easing:'cubic-bezier(.22,1,.36,1)'
      });
    }));
    dialog.querySelector('[data-honour-close]').addEventListener('click',()=>dialog.close());
    // Click outside the actual dialog box; clicks in its content never dismiss it.
    dialog.addEventListener('click',event=>{
      if(event.target!==dialog)return;
      const box=dialog.getBoundingClientRect();
      if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();
    });
    dialog.addEventListener('close',()=>{
      animations.forEach(animation=>{if(animation.effect?.target===dialog)animation.cancel();});
      notifyDialog();
      trigger?.focus({preventScroll:true});
    });
  }
})();
