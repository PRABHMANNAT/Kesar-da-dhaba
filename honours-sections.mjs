const arrow = '<span aria-hidden="true">↗</span>';
const instagramIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>';

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
