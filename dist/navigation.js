(() => {
  const toggle = document.querySelector('.site-header-navigation .menu-toggle');
  const nav = document.querySelector('#mobile-nav');
  if (!toggle || !nav) return;
  const label = toggle.querySelector('[data-menu-label]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 1024px)');
  const motion = () => !reduced.matches && !document.body.classList.contains('motion-off');
  let animations = [];
  const close = (focus = false) => {
    animations.forEach(animation => animation.cancel());animations = [];
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open navigation');
    label.textContent = 'Menu';
    nav.hidden = true;
    if (focus) toggle.focus({preventScroll:true});
  };
  toggle.addEventListener('click', event => {
    if (!nav.hidden) {close();return;}
    nav.hidden = false;
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Close navigation');
    label.textContent = 'Close';
    if (motion()) {
      animations.push(nav.animate([{opacity:0,transform:'translateY(-8px) scale(.985)'},{opacity:1,transform:'none'}], {duration:220,easing:'cubic-bezier(.2,.8,.2,1)'}));
      nav.querySelectorAll('.mobile-nav-links>a').forEach((link,index) => animations.push(link.animate([{opacity:0,translate:'0 -4px'},{opacity:1,translate:'0 0'}], {duration:200,delay:index * 18,easing:'ease-out',fill:'backwards'})));
    }
    if (event.detail === 0) nav.querySelector('a')?.focus({preventScroll:true});
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !nav.hidden) {event.preventDefault();close(true);}
  });
  document.addEventListener('click', event => {
    if (!nav.hidden && !nav.contains(event.target) && !toggle.contains(event.target)) close();
  });
  document.addEventListener('focusin', event => {
    if (!nav.hidden && !nav.contains(event.target) && !toggle.contains(event.target)) close();
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => close()));
  desktop.addEventListener('change', () => {if (desktop.matches) close();});
  document.querySelectorAll('.desktop-nav>a,.mobile-nav-links>a').forEach(link => {
    let release;
    const reset = () => {clearTimeout(release);link.classList.remove('is-pressed');};
    const press = () => {clearTimeout(release);link.classList.add('is-pressed');};
    const finish = () => {release = setTimeout(reset,220);};
    link.addEventListener('pointerdown',press,{passive:true});
    link.addEventListener('pointerup',finish,{passive:true});
    link.addEventListener('pointercancel',reset,{passive:true});
    link.addEventListener('keydown',event => {if (event.key === 'Enter') press();});
    link.addEventListener('keyup',finish);
    link.addEventListener('blur',reset);
  });
})();
