const pages = [
  ['Home','/'], ['Our Menu','/our-menu/'], ['Our Legacy','/our-legacy/'],
  ['The Shop','/our-shop/'], ['Reviews','/reviews/'],
  ['Fame & Recognition','/honors-recognitions/'], ['Celebrities','/celebrities/'],
  ['Blogs','/blogs/'], ['Visit Us','/contact-us/']
];
const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
const phone = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 3 3 5-2 2a14 14 0 0 0 6 6l2-2 5 3v3a1 1 0 0 1-1 1C10 21 3 14 3 4a1 1 0 0 1 1-1Z"/></svg>';

export function siteHeader(active, mark) {
  const current = route => active === route ? 'aria-current="page"' : '';
  const desktop = pages.map(([label,route]) => `<a href="${route}" class="${route === '/our-menu/' ? 'nav-menu-link' : 'nav-page-link'}" ${current(route)}><span class="nav-link-label">${label.replaceAll('&','&amp;')}</span><span class="desktop-nav-arrow">${arrow}</span></a>`).join('');
  const mobile = pages.map(([label,route],index) => `<a href="${route}" class="${route === '/our-menu/' ? 'nav-menu-link' : 'nav-page-link'}" ${current(route)}><span class="nav-link-index" aria-hidden="true">${String(index + 1).padStart(2,'0')}</span><span class="nav-link-label">${label.replaceAll('&','&amp;')}</span><span class="nav-link-arrow">${arrow}</span></a>`).join('');
  return `<a class="skip" href="#main">Skip to content</a><div class="announcement"><span>A HOUSE OF TRADITIONAL FOOD</span><span>AMRITSAR, PUNJAB <b>·</b> SERVING SINCE 1916</span></div><header class="site-header site-header-navigation"><a class="brand" href="/">${mark}<span>KESAR DA DHABA<small>A HOUSE OF TRADITIONAL FOOD</small></span></a><nav class="desktop-nav" aria-label="Main navigation">${desktop}</nav><button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="mobile-nav"><span class="menu-toggle-symbol" aria-hidden="true"><span></span><span></span></span><span data-menu-label>Menu</span></button><nav id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation" hidden><div class="mobile-nav-intro"><span>Explore Kesar</span><span>Since 1916</span></div><div class="mobile-nav-links">${mobile}</div><a class="mobile-nav-call" href="tel:01832532227"><span class="mobile-nav-phone">${phone}</span><span>Call the dhaba<small>0183 253 2227</small></span>${arrow}</a></nav></header>`;
}
