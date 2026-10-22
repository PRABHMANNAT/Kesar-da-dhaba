import { instagramAvatar } from './instagram.mjs';
const arrow = '<span aria-hidden="true">↗</span>';
const instagramIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>';

export function prideOfPunjab() {
  const postUrl = 'https://www.instagram.com/p/DStz_aSk64l/?img_index=1';
  return `<section class="pride-feature" id="pride-of-punjab" aria-labelledby="pride-title">
    <div class="pride-layout">
      <header class="pride-heading">
        <span class="eyebrow">AN HONOUR WE SHARE WITH YOU</span>
        <h2 id="pride-title">Pride of<br><em>Punjab.</em></h2>
        <div class="pride-heading-rule" aria-hidden="true"><span></span>✦<span></span></div>
      </header>
      <figure class="pride-photo" data-honour-reveal>
        <div class="pride-post-header">${instagramAvatar(44)}<div><strong>Kesar Da Dhaba</strong><span>@kesardadhaba · Amritsar</span></div><a href="${postUrl}" target="_blank" rel="noopener noreferrer" aria-label="View the original Pride of Punjab Instagram post (opens in a new tab)">${instagramIcon}</a></div>
        <button type="button" class="pride-photo-button" data-photo="/assets/honours/pride-of-punjab.jpg" data-caption="A cherished moment receiving the Pride of Punjab honour. With heartfelt thanks to Punjab Tourism, the esteemed jury and our patrons." aria-label="Enlarge the Pride of Punjab award ceremony photograph">
          <img src="/assets/honours/pride-of-punjab.jpg" alt="The Pride of Punjab award presentation, with the Kesar Da Dhaba team and guests gathered around the trophy" width="1620" height="2025" loading="lazy" decoding="async">
        </button>
      </figure>
      <div class="pride-message">
        <p class="pride-lead">With heartfelt gratitude to the esteemed jury and our cherished patrons for honouring us with the <strong>Pride of Punjab.</strong></p>
        <p>This recognition reflects generations of trust, love, and support for our authentic Punjabi flavours.</p>
        <p>We also sincerely thank Punjab Tourism for this honour, which inspires us to proudly uphold our legacy and continue serving the true taste and spirit of Punjab with passion and dedication.</p>
        <a class="pride-instagram-link" href="${postUrl}" target="_blank" rel="noopener noreferrer" aria-label="View the original Pride of Punjab post on Instagram (opens in a new tab)">${instagramIcon}<span>View original post</span><span aria-hidden="true">↗</span></a>
        <div class="pride-signature"><img src="/assets/monogram.png" width="48" height="48" alt="" loading="lazy"><span>WITH LOVE & GRATITUDE<strong>The Kesar family</strong></span></div>
      </div>
    </div>
    <div class="pride-footnote"><span>WITH SINCERE THANKS TO PUNJAB TOURISM</span><a href="#recognition-archive">Discover our honours <span aria-hidden="true">↓</span></a></div>
  </section>`;
}

export function pressReviews(data) {
  return `<section class="honours-reviews" id="press-reviews" aria-labelledby="press-title">
    <div class="section-heading">
      <div><span class="eyebrow">WORDS WE HOLD CLOSE</span><h2 id="press-title">A taste that stays.<br><em>A story that travels.</em></h2></div>
      <p>From a spoonful of lassi to a century-old recipe.<br>A few words from the people who tell our story.</p>
    </div>
    <div class="review-composition" data-honour-reveal>
      <div class="review-photo"><img src="/assets/instagram/prantha-thali-with-dal-and-raita-instagram-post.jpg" alt="The Kesar prantha thali, with dal and raita" width="1080" height="1350" loading="lazy" decoding="async"><span>GOOD FOOD. LASTING IMPRESSIONS.</span></div>
      <div class="review-reading-room">
        <span class="review-ornament" aria-hidden="true">“</span>
        <div class="review-stage" data-review-stage>
          ${data.reviews.map((r,i)=>`<article class="press-review" id="press-review-${i}" aria-labelledby="review-source-${i}" data-review-panel>
            <span class="review-type">${r.quote?'FROM THE REVIEW':'FROM THE PRESS ARCHIVE'}</span>
            ${r.quote?`<blockquote><p>${r.text}</p></blockquote>`:`<p class="review-summary">${r.text}</p>`}
            <div class="review-attribution"><span class="review-source-line" aria-hidden="true"></span><h3 id="review-source-${i}">${r.issuer}</h3></div>
            <p class="review-note">${r.note}</p>
          </article>`).join('')}
        </div>
        <div class="review-controls" data-review-controls hidden>
          <span class="review-counter" data-review-count aria-live="polite" aria-atomic="true">01 / 05</span>
          <span class="review-swipe-hint">SWIPE TO EXPLORE</span>
          <div><button type="button" data-review-prev aria-label="Previous press review">←</button><button type="button" data-review-next aria-label="Next press review">→</button></div>
        </div>
      </div>
    </div>
    <div class="review-publications" role="group" aria-label="Choose a press review" data-review-publications hidden>
      ${data.reviews.map((r,i)=>`<button type="button" data-review-select="${i}" aria-controls="press-review-${i}" aria-pressed="${i===0}" aria-label="Read ${r.issuer} review"><span class="publication-number" aria-hidden="true">0${i+1}</span>${r.image?`<img src="/assets/honours/${r.image}" alt="${r.issuer}" width="180" height="75" loading="lazy" decoding="async">`:`<span class="publication-name">${r.issuer}<small>${i===3?'Stories of great Indian restaurants':'Food, places & discoveries'}</small></span>`}<span class="publication-indicator" aria-hidden="true">↗</span></button>`).join('')}
    </div>
    <p class="press-source">Excerpts and summaries from <a href="${data.source}" target="_blank" rel="noopener noreferrer">our official press archive ${arrow}</a>.</p>
  </section>`;
}

export function instagramGallery(data) {
  const social=data.instagram;
  return `<section class="honours-instagram" id="kesar-instagram" aria-labelledby="instagram-title">
    <div class="section-heading"><div><span class="eyebrow">BEYOND THE AWARDS. AROUND THE TABLE.</span><h2 id="instagram-title">The everyday<br><em>is the extraordinary.</em></h2></div><div class="instagram-intro"><a class="instagram-handle" href="${social.profile}" target="_blank" rel="noopener noreferrer">${instagramIcon}<span>${social.handle}</span>${arrow}</a><p>A full table. A familiar face. Another golden prantha.<br>Follow us on Instagram for a little more Kesar.</p></div></div>
    <div class="instagram-gallery" aria-label="Selected photographs from Kesar Da Dhaba’s Instagram" tabindex="0">
      ${social.images.map((item,i)=>`<a class="instagram-moment" data-honour-reveal href="${social.profile}" target="_blank" rel="noopener noreferrer" aria-label="${item.label} — visit Kesar Da Dhaba on Instagram"><span class="instagram-image"><img src="/assets/instagram/${item.file}" alt="${item.alt}" width="1080" height="1350" loading="lazy" decoding="async"><span class="instagram-image-icon">${instagramIcon}</span><span class="instagram-image-link">A LITTLE MORE KESAR ${arrow}</span></span><span class="instagram-caption"><span>0${i+1}</span><span>${item.label}</span>${arrow}</span></a>`).join('')}
    </div>
    <div class="instagram-bottom"><span>SELECTED MOMENTS FROM OUR INSTAGRAM<span class="instagram-mobile-hint"> · SWIPE TO EXPLORE →</span></span><a class="button button-green" href="${social.profile}" target="_blank" rel="noopener noreferrer">${instagramIcon} View on Instagram ${arrow}</a></div>
  </section>`;
}
