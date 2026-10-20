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
  filters.forEach(button=>button.addEventListener('click',()=>{
    const category=button.dataset.honourFilter;
    let count=0;
    filters.forEach(filter=>filter.setAttribute('aria-pressed',String(filter===button)));
    cards.forEach(card=>{card.hidden=category!=='all'&&category!==card.dataset.honourKind;if(!card.hidden)count++;});
    const status=document.querySelector('[data-honour-results]');
    if(status)status.textContent=`${count} ${count===1?'recognition':'recognitions'} shown`;
  }));
})();
