export function heroHead() {
  return '<link rel="stylesheet" href="/hero.css"><script src="/hero.js" defer></script>';
}

export function cinematicHero() {
  return `<section class="cinema-hero" aria-labelledby="cinema-title" data-cinema-hero>
    <div class="cinema-stage">
      <div class="cinema-scene">
        <picture class="cinema-poster" aria-hidden="true"><source media="(max-width: 760px)" srcset="/assets/kesar-hero-mobile-poster.jpg"><img src="/assets/kesar-hero-desktop-poster.jpg" alt="" width="720" height="450" fetchpriority="high" decoding="async"></picture>
        <video class="cinema-video" data-hero-video muted loop playsinline preload="none" controls poster="/assets/kesar-hero-desktop-poster.jpg" aria-label="Inside Kesar Da Dhaba’s kitchen: traditional dal, slow cooked and served with care">
          <source media="(max-width: 760px)" src="/assets/kesar-hero-mobile.mp4" type="video/mp4">
          <source src="/assets/kesar-hero-desktop.mp4" type="video/mp4">
        </video>
        <div class="cinema-shade" aria-hidden="true"></div>
        <div class="cinema-content">
          <span class="cinema-eyebrow"><span aria-hidden="true"></span> THE ORIGINAL · AMRITSAR <span aria-hidden="true"></span></span>
          <h1 id="cinema-title"><span class="cinema-title-line"><span>Over 100 years</span></span> <span class="cinema-title-line"><span>of great taste</span></span></h1>
          <p>Serving Amritsar, with love, since 1916.</p>
          <div class="cinema-actions"><a class="button button-yellow" href="/our-menu/">Explore our menu <span aria-hidden="true">↗</span></a><a class="cinema-story" href="/our-legacy/">Our story <span aria-hidden="true">↗</span></a></div>
        </div>
        <div class="cinema-bottom">
          <span class="cinema-address">CHOWK PASSIAN<br>AMRITSAR, PUNJAB</span>
          <a class="cinema-scroll" href="#kesar-welcome" aria-label="Scroll to discover Kesar Da Dhaba"><span class="cinema-scroll-line" aria-hidden="true"></span><span>SCROLL TO DISCOVER</span><span aria-hidden="true">↓</span></a>
          <button class="cinema-play" type="button" data-hero-play aria-label="Play background film" aria-pressed="false" hidden><span class="cinema-play-icon" aria-hidden="true">▶</span><span data-hero-play-label>Play film</span></button>
        </div>
        <p class="sr-only" data-hero-status role="status" aria-live="polite"></p>
      </div>
    </div>
  </section>`;
}
