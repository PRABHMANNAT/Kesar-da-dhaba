import fs from 'node:fs';
import { menuCategories } from './menu-data.mjs';
import { cinematicHero, heroHead } from './hero.mjs';

const posts = JSON.parse(fs.readFileSync(new URL('./menu-posts.json', import.meta.url), 'utf8'));
const external = 'target="_blank" rel="noopener noreferrer"';
const arrow = '<span aria-hidden="true">↗</span>';
const instagram = 'https://www.instagram.com/kesardadhaba/';
const ig = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>';
const searchIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>';
const img = (file, alt, cls = '', width = 600, height = 600) => `<img class="${cls}" src="/assets/menu/${file}" alt="${alt}" width="${width}" height="${height}" loading="lazy" decoding="async">`;
// Keep the selected earthen firni dish consistent in both floating placements.
const firniGarnish = className => `<span class="${className}" data-menu-float aria-hidden="true">${img('firni-cutout.webp', '', '', 480, 320)}</span>`;
const dishImages = {
  'Dal Fry': ['dal-kitchen.webp', 'A finishing touch of desi ghee in the Kesar kitchen'],
  'Plain Prantha': ['pranthas.webp', 'Golden Punjabi pranthas at Kesar Da Dhaba'],
  'Seasonal Special Thali': ['seasonal-photo.webp', 'Makki di roti and saag thali'],
  'Firni': ['firni-cutout.webp', 'Firni in an earthen dish']
};
const categoryCutouts = { 'raita-pulao': 'seasonal-cutout.webp' };
const categoryArt = {
  beverages: ['lassi-glass.webp', 'A tall glass of traditional lassi'],
  sabziyan: ['sabziyan-dal.webp', 'Kesar dal fry served in a copper bowl'],
  pranthas: ['pranthas-thumb.webp', 'Golden Punjabi pranthas'],
  thali: ['kesar-thali-portrait-small.webp', 'A generous Kesar thali'],
  rotiyan: ['rotiyan-breads.webp', 'Golden Punjabi breads stacked fresh from the griddle'],
  meetha: ['firni-cutout.webp', 'Traditional firni']
};
export const deliveryLinks = {
  zomato: 'https://www.zomato.com/amritsar/kesar-da-dhabha-town-hall',
  swiggy: 'https://www.swiggy.com/restaurants/amritsar/hathi-gate/kesar-da-dhaba-849255/dineout'
};

export function menuHead() {
  return `${heroHead()}<link rel="stylesheet" href="/menu.css"><script src="/menu.js" defer></script>`;
}

function category(c, index) {
  const art = categoryArt[c.id];
  return `<section class="menu-chapter" id="${c.id}" data-menu-chapter="${c.id}">
    <div class="menu-chapter-heading"><div><span class="menu-overline">${String(index + 1).padStart(2, '0')} / FROM OUR KITCHEN</span><h2>${c.name}</h2><p>${c.intro}</p></div>${art ? img(...art, 'menu-chapter-art', 160, 160) : `<span class="menu-chapter-cutout" data-menu-float aria-hidden="true">${img(categoryCutouts[c.id] || 'seasonal-cutout.webp', '', '', 480, 320)}</span>`}</div>
    <div class="menu-dish-grid">${c.items.map(([name, description, badge]) => `<article class="menu-dish" data-dish-name="${name.toLowerCase()}" data-dish-badge="${badge?.toLowerCase() || ''}">
      <div class="menu-dish-title"><h3>${name}</h3>${badge ? `<span class="menu-tag">${badge.toUpperCase()}</span>` : ''}${dishImages[name] ? `<button class="menu-look" data-menu-look="${name}" aria-label="See ${name}" aria-haspopup="dialog">${arrow}</button>` : ''}</div>
      ${description ? `<p>${description}</p>` : ''}
    </article>`).join('')}</div>
  </section>`;
}

export function menuPage() {
  const total = menuCategories.reduce((count, c) => count + c.items.length, 0);
  const hero = cinematicHero().replace('class="cinema-hero"', 'class="cinema-hero cinema-flow"').replace('Over 100 years of great taste', 'A century<br>of flavour.').replace('<p>Since 1916</p>', '<p>Our menu · Since 1916</p>');
  return `<div class="menu-page">
    ${hero}
    <div class="menu-heritage-seam" aria-hidden="true"></div>
    <section class="menu-welcome menu-pattern" aria-labelledby="menu-welcome-title">
      <div class="menu-welcome-copy" data-menu-reveal><h2 id="menu-welcome-title">A taste of<br><em>Amritsar.</em></h2><div class="menu-welcome-actions"><a class="menu-line-link" href="#menu-browse">Explore all ${total} dishes <span aria-hidden="true">↓</span></a><a class="menu-download" href="/assets/kesar-da-dhaba-menu.pdf" download="Kesar-Da-Dhaba-Menu.pdf"><span class="menu-download-copy">Download menu <small>PDF · 4 pages</small></span><span class="menu-download-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></svg></span></a></div></div>
      <div class="menu-welcome-art" data-menu-reveal>
        <figure class="menu-thali-photo menu-welcome-film"><div class="menu-welcome-film-media"><img src="/assets/menu/welcome-reel-poster.webp" alt="A Kesar thali being prepared with copper bowls of dal and curry" width="480" height="854" loading="lazy" decoding="async"><video data-menu-welcome-reel data-src="/assets/menu/welcome-reel.mp4" width="540" height="960" preload="none" autoplay muted loop playsinline disablepictureinpicture aria-label="Preparing a Kesar thali, from our Instagram reel"></video></div><figcaption><a href="https://www.instagram.com/reel/DZaGqmegObG/" ${external}>Watch on Instagram ${arrow}</a></figcaption></figure>
        <div class="menu-float menu-float-thali" aria-hidden="true">${img('seasonal-cutout.webp', '', '', 480, 320)}</div><div class="menu-float menu-float-firni" aria-hidden="true">${img('firni-cutout.webp', '', '', 480, 320)}</div><span class="menu-art-seal" aria-hidden="true">THE ORIGINAL<br><b>K</b>AMRITSAR</span>
      </div>
    </section>
    <section class="menu-catalogue" id="menu-browse" aria-labelledby="menu-browse-title">
      <div class="menu-catalogue-intro"><div><span class="menu-overline">THE COMPLETE KESAR MENU</span><h2 id="menu-browse-title">Find your <em>favourite.</em></h2></div><p>From the first bite<br>to the last spoonful.</p></div>
      <div class="menu-filter-dock"><div class="menu-filter-top"><label class="menu-find">${searchIcon}<span class="sr-only">Search the menu</span><input id="menu-query" type="search" placeholder="Find a favourite…" autocomplete="off" aria-controls="menu-chapters"></label><div class="menu-preference" role="group" aria-label="Filter dishes"><button type="button" data-menu-filter="all" aria-pressed="true">All dishes <span>${total}</span></button><button type="button" data-menu-filter="popular" aria-pressed="false">Popular</button><button type="button" data-menu-filter="seasonal" aria-pressed="false">Seasonal</button></div></div>
      <nav class="menu-category-rail" aria-label="Choose a menu category"><button type="button" data-menu-category-filter="all" aria-pressed="true">Everything</button>${menuCategories.map(c => `<button type="button" data-menu-category-filter="${c.id}" aria-pressed="false">${c.name}</button>`).join('')}<span class="menu-category-indicator" aria-hidden="true"></span></nav></div>
      <div class="menu-results-line"><p id="menu-result-count" role="status" aria-live="polite">All ${total} dishes · made with tradition</p><button class="menu-reset" type="button" hidden>Clear filters <span aria-hidden="true">×</span></button></div>
      <div id="menu-chapters">${menuCategories.map(category).join('')}</div>
      <div class="menu-no-results" hidden>${img('firni-cutout.webp', '', 'menu-empty-dish', 120, 80)}<h3>A different craving?</h3><p>Try “dal”, “prantha” or “firni”.</p><button type="button" class="menu-reset-all">Show the complete menu</button></div>
      <p class="menu-availability">For current prices and seasonal availability, ask our team. <a href="tel:01832532227">Call the dhaba ${arrow}</a></p>
    </section>
    <section class="menu-seasonal" id="seasonal" aria-labelledby="menu-seasonal-title"><div class="menu-seasonal-copy" data-menu-reveal><span class="menu-tag">SEASONAL SPECIAL</span><h2 id="menu-seasonal-title">A little winter<br><em>comfort.</em></h2><p>Makki di roti & saag.<br>A pairing that feels like Punjab.</p><a class="menu-line-link" href="#thali">Explore our thalis ${arrow}</a></div><div class="menu-seasonal-art" data-menu-reveal><span class="menu-seasonal-orbit" aria-hidden="true"></span>${firniGarnish('menu-seasonal-garnish')}${img('seasonal-cutout.webp', 'Seasonal makki di roti and saag thali', '', 480, 320)}<span class="menu-seasonal-note">Made for slow afternoons.</span></div></section>
    <section class="menu-delivery menu-pattern" id="order-online" aria-labelledby="menu-delivery-title"><div class="menu-delivery-intro" data-menu-reveal><h2 id="menu-delivery-title">Find us on <br><em>Zomato & Swiggy.</em></h2><p>Tap an app to view our Amritsar listing.</p>${firniGarnish('menu-delivery-mithai')}</div><div class="menu-delivery-options" data-menu-reveal><a class="menu-delivery-card menu-zomato" href="${deliveryLinks.zomato}" ${external} aria-label="Open Kesar Da Dhaba on Zomato"><span class="menu-platform-logo">zomato</span><span class="menu-platform-action">Open ${arrow}</span></a><a class="menu-delivery-card menu-swiggy" href="${deliveryLinks.swiggy}" ${external} aria-label="Open Kesar Da Dhaba on Swiggy"><span class="menu-platform-logo">Swiggy</span><span class="menu-platform-action">Open ${arrow}</span></a></div></section>
    <section class="menu-social" aria-labelledby="menu-social-title"><div class="menu-social-heading" data-menu-reveal><h2 id="menu-social-title">Follow us on <em>Instagram.</em></h2><a class="menu-instagram-follow" href="${instagram}" ${external}>${ig}<span>@kesardadhaba</span>${arrow}</a></div>
      <div class="menu-social-gallery"><div class="menu-social-track" id="menu-instagram-posts" tabindex="0" aria-label="Instagram posts; scroll horizontally to explore">${posts.map((post, index) => `<article class="menu-post"><div class="menu-post-head"><img src="/assets/menu/monogram.webp" alt="" width="36" height="36" loading="lazy"><div><strong>kesardadhaba</strong><small>Amritsar, Punjab</small></div>${ig}</div><div class="menu-post-media"><a class="menu-post-image" href="${post.url}" ${external} aria-label="Open Kesar Instagram ${post.type.toLowerCase()} ${index + 1}"><img src="${post.image}" alt="${index === 1 ? 'Golden pranthas, dal and raita on a Kesar thali' : `A moment from Kesar Da Dhaba’s Instagram ${post.type.toLowerCase()}`}" width="540" height="675" loading="lazy" decoding="async">${post.video ? `<video data-menu-reel data-src="${post.video}" width="432" height="768" preload="none" autoplay muted loop playsinline disablepictureinpicture aria-label="Kesar Instagram reel ${index + 1}"></video>` : ''}<span class="menu-post-type">${post.type === 'Reel' ? 'REEL' : 'INSTAGRAM'}</span><span class="menu-post-hover">View on Instagram ${arrow}</span></a>${post.video ? `<button class="menu-reel-sound" type="button" aria-label="Unmute Instagram reel ${index + 1}" aria-pressed="false" data-reel-number="${index + 1}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M11 4 6 8H3v8h3l5 4z"/><path class="reel-sound-waves" d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/><path class="reel-sound-slash" d="m16 9 6 6m0-6-6 6"/></svg></button>` : ''}</div><div class="menu-post-foot"><span>From the Kesar table.</span><a href="${post.url}" ${external} aria-label="View ${post.type.toLowerCase()} ${index + 1} on Instagram">View ${post.type.toLowerCase()} ${arrow}</a></div></article>`).join('')}</div>
      <div class="menu-social-controls"><button type="button" data-post-direction="-1" aria-label="Previous Instagram posts" aria-controls="menu-instagram-posts">←</button><button type="button" data-post-direction="1" aria-label="Next Instagram posts" aria-controls="menu-instagram-posts">→</button></div></div>
    </section>
    <button class="menu-back-top" type="button" aria-label="Back to top" hidden><svg class="menu-back-top-ring" viewBox="0 0 56 56" aria-hidden="true"><circle class="menu-back-top-track" cx="28" cy="28" r="25"/><circle class="menu-back-top-fill" cx="28" cy="28" r="25" pathLength="100"/></svg><svg class="menu-back-top-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg></button>
    <dialog class="menu-dish-dialog" aria-labelledby="menu-dialog-title"><button class="menu-dialog-close" aria-label="Close dish details">×</button><img class="menu-dialog-image" alt=""><div><span class="menu-overline">FROM THE KESAR TABLE</span><h2 id="menu-dialog-title"></h2><p class="menu-dialog-description"></p><button class="menu-dialog-back">← Back to the menu</button></div></dialog>
    <script type="application/json" id="menu-dish-details">${JSON.stringify(Object.fromEntries(Object.entries(dishImages).map(([name, [image, alt]]) => [name, { image: '/assets/menu/' + image, alt, description: menuCategories.flatMap(c => c.items).find(item => item[0] === name)?.[1] || '' }]))).replaceAll('<', '\\u003c')}</script>
  </div>`.replace(/^[\t ]+$/gm, '');
}
