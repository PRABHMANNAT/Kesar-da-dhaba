(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const panel = document.querySelector('.sidemenu');
  const page = document.querySelector('#page');
  const toggles = [...document.querySelectorAll('.menu-toggle')];
  const close = panel?.querySelector('.close-button');
  let opener;
  const closeMenu = () => {
    panel?.classList.remove('show');
    panel?.setAttribute('aria-hidden','true');
    toggles.forEach(toggle => toggle.setAttribute('aria-expanded','false'));
    document.body.classList.remove('blogs-menu-open');
    if (page) page.inert = false;
    opener?.focus();
  };
  toggles.forEach(toggle => {
    if (!toggle.matches('button,a[href]')) toggle.tabIndex = 0;
    toggle.addEventListener('click', () => {
      opener = toggle;
      panel?.classList.add('show');
      panel?.setAttribute('aria-hidden','false');
      toggles.forEach(button => button.setAttribute('aria-expanded','true'));
      document.body.classList.add('blogs-menu-open');
      if (page) page.inert = true;
      requestAnimationFrame(() => close?.focus());
    });
    if (!toggle.matches('button')) toggle.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {event.preventDefault();toggle.click();}
    });
  });
  close?.addEventListener('click', closeMenu);
  panel?.addEventListener('click', event => {if (event.target === panel || event.target.closest('a')) closeMenu();});
  document.addEventListener('keydown', event => {
    if (!panel?.classList.contains('show')) return;
    if (event.key === 'Escape') {event.preventDefault();closeMenu();}
    if (event.key === 'Tab') {
      const items = [...panel.querySelectorAll('a[href],button,[tabindex="0"]')].filter(el => el.getClientRects().length);
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {event.preventDefault();last?.focus();}
      else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first?.focus();}
    }
  });

  // The captured theme may already wrap posts into columns. Restore its newest
  // first query order before placing each article into the shortest column.
  const wrapper = document.querySelector('.posts.layout-masonry .posts-wrapper');
  const posts = [...wrapper?.querySelectorAll('article') || []]
    .sort((a,b) => Number(b.dataset.postId) - Number(a.dataset.postId));
  let masonryFrame = 0;
  const layoutPosts = () => {
    masonryFrame = 0;
    if (!wrapper) return;
    const count = innerWidth >= 1024 ? 3 : innerWidth >= 768 ? 2 : 1;
    const columns = Array.from({length:count}, () => {
      const column = document.createElement('div');
      column.className = 'masonry-column';return column;
    });
    wrapper.replaceChildren(...columns);
    posts.forEach(post => {
      const column = columns.reduce((shortest, item) => item.getBoundingClientRect().height < shortest.getBoundingClientRect().height ? item : shortest);
      column.append(post);
    });
  };
  const queueMasonry = () => {if (!masonryFrame) masonryFrame = requestAnimationFrame(layoutPosts);};
  layoutPosts();
  document.fonts?.ready.then(queueMasonry);
  posts.forEach(post => post.querySelectorAll('img').forEach(img => img.addEventListener('load', queueMasonry)));
  let lastWidth = innerWidth;
  addEventListener('resize', () => {if (innerWidth !== lastWidth) {lastWidth = innerWidth;queueMasonry();}});

  const header = document.querySelector('#masthead');
  const sticky = document.querySelector('.custom-sticky-header');
  const banner = document.querySelector('#content .pt-parallax-on-scroll');
  if (banner) {
    const source = banner.dataset.ptBackgroundImage;
    banner.style.setProperty('--blogs-banner', `url("${source}")`);
    const container = document.createElement('div');container.className = 'parallax-img-container';
    const image = document.createElement('img');image.src = source;image.alt = '';
    container.append(image);banner.prepend(container);
  }
  const top = document.querySelector('.to-top');
  let scrollFrame = 0;
  const paintScroll = () => {
    scrollFrame = 0;
    if (sticky && header) {
      const active = scrollY > header.offsetHeight;
      sticky.classList.toggle('hide', !active);
      sticky.classList.toggle('is-sticky', active);
      sticky.classList.toggle('show-header', active);
    }
    if (banner) {
      const bounds = banner.getBoundingClientRect();
      const progress = Math.max(0,Math.min(1,-bounds.top/Math.max(1,bounds.height)));
      banner.style.setProperty('--blogs-parallax', reduced.matches ? '0px' : `${progress * 90}px`);
    }
    top?.classList.toggle('show', scrollY > innerHeight);
  };
  const queueScroll = () => {if (!scrollFrame) scrollFrame = requestAnimationFrame(paintScroll);};
  addEventListener('scroll', queueScroll, {passive:true});
  addEventListener('resize', queueScroll);
  reduced.addEventListener('change', queueScroll);
  top?.addEventListener('click', event => {event.preventDefault();scrollTo({top:0,behavior:reduced.matches ? 'instant' : 'smooth'});});
  paintScroll();
})();
