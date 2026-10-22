(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('#masthead');
  const sticky = document.querySelector('.custom-sticky-header');
  const banner = document.querySelector('#content .pt-parallax-on-scroll');
  if (banner) {
    const source = banner.dataset.ptBackgroundImage;
    banner.style.setProperty('--legacy-banner', `url("${source}")`);
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
      banner.style.setProperty('--legacy-parallax', reduced.matches ? '0px' : `${progress * 90}px`);
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

(() => {
  const track = document.querySelector('#instagram-gallery-feed-0 .swiper-wrapper');
  if (!track) return;
  for (const [direction, label, icon] of [[-1,'Previous slide','‹'],[1,'Next slide','›']]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'legacy-gallery-nav legacy-gallery-' + (direction < 0 ? 'prev' : 'next');
    button.setAttribute('aria-label',label);
    button.textContent = icon;
    button.addEventListener('click', () => {
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      const atStart = track.scrollLeft <= 2;
      const step = track.firstElementChild.getBoundingClientRect().width + 10;
      const left = direction > 0 && atEnd ? 0 : direction < 0 && atStart ? track.scrollWidth : track.scrollLeft + direction * step;
      track.scrollTo({left,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    });
    track.parentElement.append(button);
  }
})();
