(() => {
  const page = document.querySelector('.menu-page');
  if (!page) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motion = () => !reduced.matches && !document.body.classList.contains('motion-off');
  const search = page.querySelector('#menu-query');
  const chapters = [...page.querySelectorAll('[data-menu-chapter]')];
  const dishes = [...page.querySelectorAll('[data-dish-name]')];
  const categoryButtons = [...page.querySelectorAll('[data-menu-category-filter]')];
  const preferenceButtons = [...page.querySelectorAll('[data-menu-filter]')];
  const clear = page.querySelector('.menu-reset');
  const status = page.querySelector('#menu-result-count');
  const normalize = value => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]/g, '').trim();
  let category = 'all';
  let preference = 'all';
  let filterAnimation;
  const apply = (animate = false) => {
    const dock = page.querySelector('.menu-filter-dock');
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 82;
    const wasPinned = dock.getBoundingClientRect().top <= headerHeight + 2;
    const intro = page.querySelector('.menu-catalogue-intro');
    const dockStart = intro.getBoundingClientRect().bottom + scrollY + parseFloat(getComputedStyle(intro).marginBottom);
    const terms = normalize(search.value).split(/\s+/).filter(Boolean);
    let count = 0;
    chapters.forEach(chapter => {
      let chapterCount = 0;
      chapter.querySelectorAll('[data-dish-name]').forEach(dish => {
        const matches = (category === 'all' || chapter.dataset.menuChapter === category) &&
          (preference === 'all' || dish.dataset.dishBadge === preference) &&
          terms.every(term => normalize(dish.dataset.dishName).includes(term));
        dish.hidden = !matches;
        if (matches) chapterCount++;
      });
      chapter.hidden = chapterCount === 0;
      count += chapterCount;
    });
    const filtered = terms.length > 0 || category !== 'all' || preference !== 'all';
    status.textContent = filtered ? `${count} ${count === 1 ? 'dish' : 'dishes'} found` : `All ${dishes.length} dishes · made with tradition`;
    clear.hidden = !filtered;
    page.querySelector('.menu-no-results').hidden = count > 0;
    if (wasPinned) scrollTo({top:Math.max(0,dockStart - headerHeight),behavior:'instant'});
    categoryButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.menuCategoryFilter === category)));
    preferenceButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.menuFilter === preference)));
    filterAnimation?.cancel();
    if (animate && motion()) filterAnimation = page.querySelector('#menu-chapters').animate([{opacity:.55,transform:'translateY(7px)'},{opacity:1,transform:'none'}],{duration:240,easing:'ease-out'});
  };
  const reset = () => { category = preference = 'all'; search.value = ''; apply(); };
  search.addEventListener('input', () => apply());
  search.addEventListener('search', () => apply());
  categoryButtons.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.menuCategoryFilter;
    apply(true);
    const rail = button.parentElement;
    rail.scrollTo({left:button.offsetLeft - rail.offsetLeft - 18,behavior:motion() ? 'smooth' : 'instant'});
  }));
  preferenceButtons.forEach(button => button.addEventListener('click', () => {preference = button.dataset.menuFilter; apply(true);}));
  clear.addEventListener('click', () => {reset();search.focus({preventScroll:true});});
  page.querySelector('.menu-reset-all').addEventListener('click', () => {reset();search.focus({preventScroll:true});});
  document.querySelector('.mobile-actions a[href="#menu-browse"]')?.addEventListener('click',reset);
  // Every dish is in the initial HTML, including direct category anchor visits.
  reset();
  const revealAnchor = hash => {
    const target = document.getElementById(hash.slice(1));
    if (!target?.matches('[data-menu-chapter]')) return;
    reset();
    requestAnimationFrame(() => target.scrollIntoView({behavior:motion() ? 'smooth' : 'instant',block:'start'}));
  };
  page.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => revealAnchor(link.hash)));
  addEventListener('hashchange', () => revealAnchor(location.hash));
  if (location.hash) requestAnimationFrame(() => revealAnchor(location.hash));

  const header = document.querySelector('.site-header');
  const sizeHeader = () => page.style.setProperty('--menu-header',`${Math.ceil(header?.getBoundingClientRect().height || 82)}px`);
  if ('ResizeObserver' in window && header) new ResizeObserver(sizeHeader).observe(header);
  sizeHeader();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle('menu-in-view', entry.isIntersecting);
      if (entry.isIntersecting && !entry.target.matches('.menu-welcome-art')) observer.unobserve(entry.target);
    }), {threshold:.08});
    page.querySelectorAll('[data-menu-reveal]').forEach(element => {
      if (motion()) element.classList.add('menu-reveal-ready');
      observer.observe(element);
    });
  }

  const track = page.querySelector('.menu-social-track');
  const controls = [...page.querySelectorAll('[data-post-direction]')];
  const syncControls = () => {
    controls[0].disabled = track.scrollLeft <= 2;
    controls[1].disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  controls.forEach(button => button.addEventListener('click', () => {
    const card = track.querySelector('.menu-post');
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    track.scrollBy({left:(card.getBoundingClientRect().width + gap) * Number(button.dataset.postDirection),behavior:motion() ? 'smooth' : 'instant'});
  }));
  track.addEventListener('scroll',syncControls,{passive:true});
  if ('ResizeObserver' in window) new ResizeObserver(syncControls).observe(track);
  syncControls();

  const dialog = page.querySelector('.menu-dish-dialog');
  const details = JSON.parse(page.querySelector('#menu-dish-details').textContent);
  let opener;
  page.querySelectorAll('[data-menu-look]').forEach(button => button.addEventListener('click', () => {
    const name = button.dataset.menuLook;
    const detail = details[name];
    if (!detail) return;
    opener = button;
    const image = dialog.querySelector('.menu-dialog-image');
    image.src = detail.image;
    image.alt = detail.alt;
    image.style.objectFit = name === 'Firni' ? 'contain' : 'cover';
    dialog.querySelector('#menu-dialog-title').textContent = name;
    dialog.querySelector('.menu-dialog-description').textContent = detail.description;
    dialog.showModal();
    document.dispatchEvent(new Event('kesar:dialogchange'));
    if (motion()) dialog.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.2,.7,.2,1)'});
  }));
  dialog.querySelectorAll('.menu-dialog-close,.menu-dialog-back').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {document.dispatchEvent(new Event('kesar:dialogchange'));opener?.focus({preventScroll:true});});
})();
