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
  const categoryRail = page.querySelector('.menu-category-rail');
  const categoryIndicator = page.querySelector('.menu-category-indicator');
  const filterDock = page.querySelector('.menu-filter-dock');
  let currentChapter = '';
  let categoryFrame = 0;
  const updateCategoryProgress = () => {
    categoryFrame = 0;
    const visibleChapters = chapters.filter(chapter => !chapter.hidden);
    const probe = filterDock.getBoundingClientRect().bottom + Math.min(100, innerHeight * .12);
    let active = category;
    if (category === 'all') {
      for (const chapter of visibleChapters) {
        if (chapter.getBoundingClientRect().top <= probe) active = chapter.dataset.menuChapter;
        else break;
      }
    }
    const button = categoryButtons.find(item => item.dataset.menuCategoryFilter === active) || categoryButtons[0];
    categoryIndicator.style.setProperty('--category-left', `${button.offsetLeft}px`);
    categoryIndicator.style.setProperty('--category-width', `${button.offsetWidth}px`);
    if (currentChapter !== active) {
      currentChapter = active;
      categoryButtons.forEach(item => {
        if (item === button) item.setAttribute('aria-current', 'location');
        else item.removeAttribute('aria-current');
      });
      // Follow the chapter on narrow screens without changing the dish filter.
      if (button.offsetLeft < categoryRail.scrollLeft + 8 || button.offsetLeft + button.offsetWidth > categoryRail.scrollLeft + categoryRail.clientWidth - 8) {
        categoryRail.scrollTo({left:Math.max(0,button.offsetLeft - (categoryRail.clientWidth - button.offsetWidth) / 2),behavior:motion() ? 'smooth' : 'instant'});
      }
    }
  };
  const queueCategoryProgress = () => { if (!categoryFrame) categoryFrame = requestAnimationFrame(updateCategoryProgress); };
  addEventListener('scroll', queueCategoryProgress, {passive:true});
  addEventListener('resize', queueCategoryProgress);
  if ('ResizeObserver' in window) {
    const categorySize = new ResizeObserver(queueCategoryProgress);
    categorySize.observe(categoryRail);
    categorySize.observe(page.querySelector('#menu-chapters'));
  }
  document.fonts?.ready.then(queueCategoryProgress);

  const apply = (animate = false) => {
    const dock = page.querySelector('.menu-filter-dock');
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 82;
    const wasPinned = Math.abs(dock.getBoundingClientRect().top - headerHeight) <= 2;
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
    status.textContent = filtered ? `${count} ${count === 1 ? 'dish' : 'dishes'} found` : `All ${dishes.length} dishes Â· made with tradition`;
    clear.hidden = !filtered;
    page.querySelector('.menu-no-results').hidden = count > 0;
    if (wasPinned) scrollTo({top:Math.max(0,dockStart - headerHeight),behavior:'instant'});
    categoryButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.menuCategoryFilter === category)));
    preferenceButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.menuFilter === preference)));
    queueCategoryProgress();
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
    rail.scrollTo({left:button.offsetLeft - 18,behavior:motion() ? 'smooth' : 'instant'});
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

  // Scroll sets the plate's angle directly; no animation loop runs while idle.
  const seasonalArt = page.querySelector('.menu-seasonal-art');
  let seasonalVisible = false;
  let seasonalFrame = 0;
  const paintSeasonalTilt = () => {
    seasonalFrame = 0;
    if (!motion() || document.hidden) {
      ['--seasonal-tilt','--seasonal-pitch','--seasonal-lift'].forEach(name => seasonalArt.style.removeProperty(name));
      return;
    }
    if (!seasonalVisible) return;
    const bounds = seasonalArt.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight + bounds.height)));
    seasonalArt.style.setProperty('--seasonal-tilt', `${(-12 + progress * 16).toFixed(2)}deg`);
    seasonalArt.style.setProperty('--seasonal-pitch', `${(7 - progress * 14).toFixed(2)}deg`);
    seasonalArt.style.setProperty('--seasonal-lift', `${(10 - progress * 20).toFixed(2)}px`);
  };
  const queueSeasonalTilt = () => {if (!seasonalFrame && seasonalVisible) seasonalFrame = requestAnimationFrame(paintSeasonalTilt);};
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      seasonalVisible = entries[0].isIntersecting;
      queueSeasonalTilt();
    }).observe(seasonalArt);
    addEventListener('scroll', queueSeasonalTilt, {passive:true});
    addEventListener('resize', queueSeasonalTilt);
    reduced.addEventListener('change', paintSeasonalTilt);
    document.addEventListener('visibilitychange', paintSeasonalTilt);
    new MutationObserver(paintSeasonalTilt).observe(document.body, {attributes:true,attributeFilter:['class']});
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle('menu-in-view', entry.isIntersecting);
      if (entry.isIntersecting && !entry.target.matches('.menu-welcome-art,[data-menu-float]')) observer.unobserve(entry.target);
    }), {threshold:.08});
    page.querySelectorAll('[data-menu-reveal],[data-menu-float]').forEach(element => {
      if (motion() && element.hasAttribute('data-menu-reveal')) element.classList.add('menu-reveal-ready');
      observer.observe(element);
    });
  }

  const track = page.querySelector('.menu-social-track');
  const controls = [...page.querySelectorAll('[data-post-direction]')];
  const syncControls = () => {
    controls[0].disabled = track.scrollLeft <= 8;
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

  // A single small nudge introduces the horizontal gallery without rotating posts.
  let hintPlayed = false;
  let hintFrame = 0;
  const stopHint = () => {
    hintPlayed = true;
    cancelAnimationFrame(hintFrame);
    track.classList.remove('menu-gallery-hint');
  };
  ['pointerdown','touchstart','wheel','keydown','focusin'].forEach(type => track.addEventListener(type, stopHint, {passive:true}));
  controls.forEach(button => ['pointerdown','focus','click'].forEach(type => button.addEventListener(type, stopHint)));
  if ('IntersectionObserver' in window) {
    const hintObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) { if (hintFrame) stopHint(); return; }
      if (hintPlayed || !motion() || track.scrollLeft > 2 || track.scrollWidth <= track.clientWidth) return;
      hintPlayed = true;
      track.classList.add('menu-gallery-hint');
      const start = performance.now();
      const distance = Math.min(34, track.clientWidth * .08);
      const nudge = time => {
        if (!motion() || document.hidden) {track.scrollLeft = 0;stopHint();return;}
        const progress = Math.min(1, (time - start) / 1100);
        track.scrollLeft = Math.sin(progress * Math.PI) ** 2 * distance;
        if (progress < 1) hintFrame = requestAnimationFrame(nudge);
        else {hintFrame = 0;track.scrollLeft = 0;track.classList.remove('menu-gallery-hint');}
      };
      hintFrame = requestAnimationFrame(nudge);
    }, {threshold:.25});
    hintObserver.observe(track);
  }

  // Attach reel sources only when the card is visible, including horizontal clipping.
  const reels = [...page.querySelectorAll('[data-menu-reel],[data-menu-welcome-reel]')].map(video => ({
    video, sound: video.closest('.menu-post-media')?.querySelector('.menu-reel-sound'), visible: false, pending: false
  }));
  const paintSound = state => {
    if (!state.sound) return;
    state.sound.setAttribute('aria-pressed', String(!state.video.muted));
    state.sound.setAttribute('aria-label', `${state.video.muted ? 'Unmute' : 'Mute'} Instagram reel ${state.sound.dataset.reelNumber}`);
  };
  const allowedReel = state => state.visible && !document.hidden && !document.querySelector('dialog[open]') && motion();
  const startReel = async state => {
    if (state.pending || !allowedReel(state)) return;
    state.pending = true;
    try {
      if (!state.video.hasAttribute('src')) state.video.src = state.video.dataset.src;
      await state.video.play();
      if (!allowedReel(state)) state.video.pause();
    } catch { /* Keep the original poster and Instagram link if autoplay is restricted. */ }
    finally { state.pending = false; }
  };
  const syncReels = () => reels.forEach(state => {
    if (allowedReel(state)) { if (state.video.paused) startReel(state); }
    else { state.video.pause(); state.video.muted = true; }
  });
  reels.forEach(state => {
    state.video.muted = true;
    state.video.addEventListener('playing', () => state.video.classList.add('has-frame'));
    state.video.addEventListener('volumechange', () => paintSound(state));
    state.video.addEventListener('error', () => {state.video.classList.remove('has-frame');if (state.sound) state.sound.hidden = true;});
    state.sound?.addEventListener('click', () => {
      const unmute = state.video.muted;
      reels.forEach(other => { if (other !== state) other.video.muted = true; });
      state.video.muted = !unmute;
      paintSound(state);
      startReel(state);
    });
    paintSound(state);
  });
  if ('IntersectionObserver' in window) {
    const reelObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const state = reels.find(item => item.video === entry.target);
        state.visible = entry.isIntersecting && entry.intersectionRatio >= .2;
      });
      syncReels();
    }, {threshold:[0,.2,.5]});
    reels.forEach(state => reelObserver.observe(state.video));
  }
  document.addEventListener('visibilitychange', syncReels);
  document.addEventListener('kesar:dialogchange', syncReels);
  reduced.addEventListener('change', syncReels);
  new MutationObserver(syncReels).observe(document.body, {attributes:true,attributeFilter:['class']});

  // Preserve the same app-colour feedback on touch and keyboard activation.
  page.querySelectorAll('.menu-delivery-card').forEach(link => {
    let release;
    const resetPress = () => {clearTimeout(release);link.classList.remove('is-pressed');};
    const showPress = () => {clearTimeout(release);link.classList.add('is-pressed');};
    const releasePress = () => {release = setTimeout(resetPress, 350);};
    link.addEventListener('pointerdown', showPress, {passive:true});
    link.addEventListener('pointerup', releasePress, {passive:true});
    link.addEventListener('pointercancel', resetPress, {passive:true});
    link.addEventListener('blur', resetPress);
    link.addEventListener('click', () => {showPress();releasePress();});
    document.addEventListener('visibilitychange', () => {if (document.hidden) resetPress();});
  });

  const backTop = page.querySelector('.menu-back-top');
  let backTopFrame = 0;
  const updateBackTop = () => {
    backTopFrame = 0;
    const show = scrollY > Math.max(500, innerHeight * .75);
    if (backTop.hidden === show) {
      backTop.hidden = !show;
      if (show && motion()) backTop.animate([{opacity:0,translate:'0 10px'},{opacity:1,translate:'0 0'}], {duration:220,easing:'ease-out'});
    }
    const distance = document.documentElement.scrollHeight - innerHeight;
    const progress = distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0;
    backTop.style.setProperty('--back-top-offset', String(100 - progress * 100));
  };
  const queueBackTop = () => { if (!backTopFrame) backTopFrame = requestAnimationFrame(updateBackTop); };
  addEventListener('scroll', queueBackTop, {passive:true});
  addEventListener('resize', queueBackTop);
  backTop.addEventListener('click', () => {
    scrollTo({top:0,behavior:motion() ? 'smooth' : 'instant'});
    const title = page.querySelector('h1');
    title.setAttribute('tabindex', '-1');
    title.focus({preventScroll:true});
  });
  updateBackTop();

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
