export function heroHead() {
  return '<link rel="preload" as="image" href="/assets/kesar-hero-mobile-poster.webp" media="(max-width: 760px)" fetchpriority="high"><link rel="preload" as="image" href="/assets/kesar-hero-desktop-poster.webp" media="(min-width: 761px)" fetchpriority="high"><link rel="preload" as="font" href="/assets/maragsa-display.woff" type="font/woff" crossorigin><link rel="stylesheet" href="/hero.css"><script src="/hero.js" defer></script>';
}

export function cinematicHero() {
  return `<section class="cinema-hero" aria-labelledby="cinema-title" data-cinema-hero>
    <div class="cinema-stage">
      <div class="cinema-scene">
        <picture class="cinema-poster" aria-hidden="true"><source media="(max-width: 760px)" srcset="/assets/kesar-hero-mobile-poster.webp" width="576" height="1024"><img src="/assets/kesar-hero-desktop-poster.webp" alt="" width="720" height="450" fetchpriority="high" decoding="async"></picture>
        <video class="cinema-video" data-hero-video muted loop playsinline preload="none" aria-label="Inside Kesar Da Dhaba’s kitchen: traditional dal, slow cooked and served with care">
          <source media="(max-width: 760px)" src="/assets/kesar-hero-mobile.mp4" type="video/mp4">
          <source src="/assets/kesar-hero-desktop.mp4" type="video/mp4">
        </video>
        <div class="cinema-shade" aria-hidden="true"></div>
        <div class="cinema-content">
          <h1 id="cinema-title">Over 100 years of great taste</h1>
          <p>Since 1916</p>
        </div>
        <button class="cinema-play" type="button" data-hero-play aria-label="Play film" aria-pressed="false" hidden><span class="cinema-play-icon" aria-hidden="true">▶</span><span class="sr-only" data-hero-play-label>Play film</span></button>
        <p class="sr-only" data-hero-status role="status" aria-live="polite"></p>
      </div>
    </div>
  </section>`;
}
