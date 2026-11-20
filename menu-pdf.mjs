const pageDescriptions = [
  'Kesar Da Dhaba menu cover',
  'Founder Late Lala Kesar Mal Ji and the family behind Kesar Da Dhaba',
  'The history of Kesar Da Dhaba',
  'Dal, vegetable dishes and breads',
  'Special thalis, raita and rice dishes',
  'Rotis, desserts and drinks',
  'Honours and recognition',
  'The original Kesar Da Dhaba address and notice about other branches',
  'Kesar Da Dhaba kitchen illustration and social information',
  'Kesar Da Dhaba contact information'
];

export const menuPreviewSlug = 'our-menu/menu-preview';
export const menuPreviewHref = `/${menuPreviewSlug}/`;
export const menuPdfHref = 'https://github.com/PRABHMANNAT/Kesar-da-dhaba/releases/download/menu-pdf-60f35171/Menu.pdf';
export const menuPdfPageCount = pageDescriptions.length;
export const menuPreviewHead = '<link rel="stylesheet" href="/menu-preview.css">';

export function menuPreviewPage() {
  const pages = pageDescriptions.map((description, index) => ({
    number: index + 1,
    description,
    image: `/assets/menu-preview/page-${String(index + 1).padStart(2, '0')}.webp`
  }));
  return `<div class="menu-preview">
    <header class="menu-preview-header">
      <a class="menu-preview-back" href="/our-menu/">← Back to Our Menu</a>
      <h1>Kesar Da Dhaba Menu</h1>
      <div class="menu-preview-actions">
        <a class="button button-yellow" href="${menuPdfHref}">Download PDF <span aria-hidden="true">↓</span></a>
        <span>Original PDF · ${menuPdfPageCount} pages · 139 MB</span>
      </div>
    </header>
    <nav class="menu-preview-index" aria-label="Menu pages">
      <span>Go to page</span>
      <ol>${pages.map(({ number }) => `<li><a href="#page-${number}" aria-label="Page ${number}">${number}</a></li>`).join('')}</ol>
    </nav>
    ${pages.map(({ number, description, image }) => `<section class="menu-preview-page" id="page-${number}" aria-labelledby="page-title-${number}">
      <div class="menu-preview-page-header">
        <h2 id="page-title-${number}">Page ${number} of ${menuPdfPageCount}</h2>
        <a href="${image}" aria-label="Open page ${number} at full size">Open full size</a>
      </div>
      <img src="${image}" alt="${description}" width="1600" height="2263" loading="${number === 1 ? 'eager' : 'lazy'}" decoding="async">
    </section>`).join('')}
  </div>`;
}
