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
const dishImages = {
  'Dal Fry': ['dal-kitchen.webp', 'A finishing touch of desi ghee in the Kesar kitchen'],
  'Plain Prantha': ['pranthas.webp', 'Golden Punjabi pranthas at Kesar Da Dhaba'],
  'Seasonal Special Thali': ['seasonal-photo.webp', 'Makki di roti and saag thali'],
  'Firni': ['firni-cutout.webp', 'Firni in an earthen dish']
};
const categoryArt = {
  sabziyan: ['dal-thumb.webp', 'Dal being finished in the Kesar kitchen'],
  pranthas: ['pranthas-thumb.webp', 'Golden Punjabi pranthas'],
  thali: ['kesar-thali-portrait-small.webp', 'A generous Kesar thali'],
  rotiyan: ['seasonal-cutout.webp', 'Makki di roti and saag'],
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
    <div class="menu-chapter-heading"><div><span class="menu-overline">${String(index + 1).padStart(2, '0')} / FROM OUR KITCHEN</span><h2>${c.name}</h2><p>${c.intro}</p></div>${art ? img(...art, 'menu-chapter-art', 160, 160) : '<span class="menu-chapter-flower" aria-hidden="true">✳</span>'}</div>
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
      <div class="menu-welcome-copy" data-menu-reveal><span class="menu-overline">PUNJAB, ON YOUR PLATE.</span><h2 id="menu-welcome-title">Come hungry.<br><em>Leave happy.</em></h2><p>Golden pranthas. A generous spoon of dal.<br>The familiar comfort of the Kesar table.</p><a class="menu-line-link" href="#menu-browse">Find your favourite <span aria-hidden="true">↓</span></a><div class="menu-welcome-signature"><span>1916</span><small>ONE FAMILY.<br>A SHARED TRADITION.</small></div></div>
      <div class="menu-welcome-art" data-menu-reveal>
        <figure class="menu-thali-photo"><picture><source media="(max-width: 600px)" srcset="/assets/menu/kesar-thali-portrait-small.webp"><img src="/assets/menu/kesar-thali-portrait.webp" alt="Kesar Da Dhaba thali with golden pranthas, dal, paneer and raita" width="900" height="1125" loading="lazy" decoding="async"></picture><figcaption>A little of everything you love.</figcaption></figure>
        <div class="menu-float menu-float-thali" aria-hidden="true">${img('seasonal-cutout.webp', '', '', 480, 320)}</div><div class="menu-float menu-float-firni" aria-hidden="true">${img('firni-cutout.webp', '', '', 480, 320)}</div><span class="menu-art-seal" aria-hidden="true">THE ORIGINAL<br><b>K</b>AMRITSAR</span>
      </div>
    </section>
    <section class="menu-catalogue" id="menu-browse" aria-labelledby="menu-browse-title">
      <div class="menu-catalogue-intro"><div><span class="menu-overline">THE COMPLETE KESAR MENU</span><h2 id="menu-browse-title">Find your <em>favourite.</em></h2></div><p>From the first bite<br>to the last spoonful.</p></div>
      <div class="menu-filter-dock"><div class="menu-filter-top"><label class="menu-find">${searchIcon}<span class="sr-only">Search the menu</span><input id="menu-query" type="search" placeholder="Find a favourite…" autocomplete="off" aria-controls="menu-chapters"></label><div class="menu-preference" role="group" aria-label="Filter dishes"><button type="button" data-menu-filter="all" aria-pressed="true">All dishes <span>${total}</span></button><button type="button" data-menu-filter="popular" aria-pressed="false">Popular</button><button type="button" data-menu-filter="seasonal" aria-pressed="false">Seasonal</button></div></div>
      <nav class="menu-category-rail" aria-label="Choose a menu category"><button type="button" data-menu-category-filter="all" aria-pressed="true">Everything</button>${menuCategories.map(c => `<button type="button" data-menu-category-filter="${c.id}" aria-pressed="false">${c.name}</button>`).join('')}</nav></div>
      <div class="menu-results-line"><p id="menu-result-count" role="status" aria-live="polite">All ${total} dishes · made with tradition</p><button class="menu-reset" type="button" hidden>Clear filters <span aria-hidden="true">×</span></button></div>
      <div id="menu-chapters">${menuCategories.map(category).join('')}</div>
      <div class="menu-no-results" hidden><span aria-hidden="true">✳</span><h3>A different craving?</h3><p>Try “dal”, “prantha” or “firni”.</p><button type="button" class="menu-reset-all">Show the complete menu</button></div>
      <p class="menu-availability">For current prices and seasonal availability, ask our team. <a href="tel:01832532227">Call the dhaba ${arrow}</a></p>
    </section>
    <section class="menu-seasonal" id="seasonal" aria-labelledby="menu-seasonal-title"><div class="menu-seasonal-copy" data-menu-reveal><span class="menu-tag">SEASONAL SPECIAL</span><h2 id="menu-seasonal-title">A little winter<br><em>comfort.</em></h2><p>Makki di roti & saag.<br>A pairing that feels like Punjab.</p><a class="menu-line-link" href="#thali">Explore our thalis ${arrow}</a></div><div class="menu-seasonal-art" data-menu-reveal><span class="menu-seasonal-orbit" aria-hidden="true"></span>${img('seasonal-cutout.webp', 'Seasonal makki di roti and saag thali', '', 480, 320)}<span class="menu-seasonal-note">Made for slow afternoons.</span></div></section>
    <section class="menu-delivery menu-pattern" id="order-online" aria-labelledby="menu-delivery-title"><div class="menu-delivery-intro" data-menu-reveal><h2 id="menu-delivery-title">Kesar,<br><em>a tap away.</em></h2></div><div class="menu-delivery-options" data-menu-reveal><a class="menu-delivery-card menu-zomato" href="${deliveryLinks.zomato}" ${external} aria-label="Open Kesar Da Dhaba on Zomato"><span class="menu-platform-logo">zomato</span><span class="menu-platform-action">Open ${arrow}</span></a><a class="menu-delivery-card menu-swiggy" href="${deliveryLinks.swiggy}" ${external} aria-label="Open Kesar Da Dhaba on Swiggy"><span class="menu-platform-logo">Swiggy</span><span class="menu-platform-action">Open ${arrow}</span></a></div></section>
    <section class="menu-social" aria-labelledby="menu-social-title"><div class="menu-social-heading" data-menu-reveal><div><span class="menu-overline">FROM OUR TABLE TO YOUR FEED</span><h2 id="menu-social-title">A little more<br><em>Kesar.</em></h2></div><div><p>Fresh from our kitchen.<br>Moments from our house.</p><a class="menu-instagram-follow" href="${instagram}" ${external}>${ig}<span>Follow @kesardadhaba</span>${arrow}</a></div></div>
      <div class="menu-social-track" id="menu-instagram-posts" tabindex="0" aria-label="Instagram posts; scroll horizontally to explore">${posts.map((post, index) => `<article class="menu-post"><div class="menu-post-head"><img src="/assets/menu/monogram.webp" alt="" width="36" height="36" loading="lazy"><div><strong>kesardadhaba</strong><small>Amritsar, Punjab</small></div>${ig}</div><a class="menu-post-image" href="${post.url}" ${external} aria-label="Open Kesar Instagram ${post.type.toLowerCase()} ${index + 1}"><img src="${post.image}" alt="${index === 1 ? 'Golden pranthas, dal and raita on a Kesar thali' : `A moment from Kesar Da Dhaba’s Instagram ${post.type.toLowerCase()}`}" width="540" height="675" loading="lazy" decoding="async"><span class="menu-post-type">${post.type === 'Reel' ? '▶ REEL' : 'INSTAGRAM'}</span><span class="menu-post-hover">View on Instagram ${arrow}</span></a><div class="menu-post-foot"><span>From the Kesar table.</span><a href="${post.url}" ${external} aria-label="View Instagram ${post.type.toLowerCase()} ${index + 1}">View ${post.type.toLowerCase()} ${arrow}</a></div></article>`).join('')}</div>
      <div class="menu-social-bottom"><span>Our stories. Your memories.</span><div class="menu-social-controls"><button type="button" data-post-direction="-1" aria-label="Previous Instagram posts" aria-controls="menu-instagram-posts">←</button><button type="button" data-post-direction="1" aria-label="Next Instagram posts" aria-controls="menu-instagram-posts">→</button></div></div>
    </section>
    <dialog class="menu-dish-dialog" aria-labelledby="menu-dialog-title"><button class="menu-dialog-close" aria-label="Close dish details">×</button><img class="menu-dialog-image" alt=""><div><span class="menu-overline">FROM THE KESAR TABLE</span><h2 id="menu-dialog-title"></h2><p class="menu-dialog-description"></p><button class="menu-dialog-back">← Back to the menu</button></div></dialog>
    <script type="application/json" id="menu-dish-details">${JSON.stringify(Object.fromEntries(Object.entries(dishImages).map(([name, [image, alt]]) => [name, { image: '/assets/menu/' + image, alt, description: menuCategories.flatMap(c => c.items).find(item => item[0] === name)?.[1] || '' }]))).replaceAll('<', '\\u003c')}</script>
  </div>`.replace(/^[\t ]+$/gm, '');
}
