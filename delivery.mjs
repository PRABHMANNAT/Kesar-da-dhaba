const platforms = [
  { id: 'zomato', name: 'Zomato', url: 'https://www.zomato.com/amritsar/kesar-da-dhabha-town-hall' },
  { id: 'swiggy', name: 'Swiggy', url: 'https://www.swiggy.com/restaurants/amritsar/hathi-gate/kesar-da-dhaba-849255/dineout' }
];

const deliveryBag = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l1 12H4L5 8Z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/></svg>';

export const deliveryHead = '<link rel="stylesheet" href="/delivery.css"><script src="/delivery.js" defer></script>';

export function deliveryCards(revealAttribute) {
  return `<div class="menu-delivery-options" ${revealAttribute}>${platforms.map(({id, name, url}) => `<a class="menu-delivery-card menu-${id}" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Open Kesar Da Dhaba on ${name}">
    <span class="menu-platform-brand"><img class="menu-platform-icon" src="/assets/menu/${id}-app.webp" alt="" width="100" height="100" loading="lazy" decoding="async"><span class="menu-platform-name">${name}</span></span>
    <span class="menu-platform-action">Open <span class="menu-platform-bag">${deliveryBag}</span></span>
  </a>`).join('')}</div>`;
}
