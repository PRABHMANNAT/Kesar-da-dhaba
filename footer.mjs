const external = 'target="_blank" rel="noopener noreferrer"';
const arrow = '<span aria-hidden="true">↗</span>';

const socialIcons = {
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>',
  facebook: '<path d="M14 21v-8h3l.5-4H14V7c0-1 .3-1.5 1.5-1.5H18V2h-3c-3 0-5 1.7-5 5v2H7v4h3v8"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>'
};
const socialIcon = name => `<span class="footer-social-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${socialIcons[name]}</svg></span>`;

export function siteFooter(map) {
  return `<footer class="site-footer site-footer-refined">
    <div class="footer-masthead"><a class="footer-identity" href="/"><img src="/assets/menu/monogram.webp" alt="" width="64" height="64" loading="lazy"><span><small>THE ORIGINAL · SINCE 1916</small><strong>Kesar Da Dhaba</strong></span></a><a class="footer-directions" href="${map}" ${external} aria-label="Come over — get directions to Kesar Da Dhaba"><span class="footer-directions-pin" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></span><span class="footer-directions-copy">Come over</span><span class="footer-directions-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 18 18 6M6 6h12v12"/></svg></span></a></div>
    <div class="footer-content">
      <section class="footer-address"><h2>Find us.</h2><address>Chowk Passian, Gali Rajpura<br>Near Telephone Exchange<br>Amritsar, Punjab</address><a class="footer-inline-link" href="${map}" ${external}>Get directions ${arrow}</a></section>
      <section class="footer-hours"><h2>Visit us.</h2><p>12 noon – 11 pm</p><small>Closed on the last Monday<br>of every month.</small><a class="footer-inline-link" href="tel:01832532227">0183 253 2227 ${arrow}</a></section>
      <nav class="footer-connect" aria-label="Stay connected"><h2>Say hello.</h2><a href="https://www.instagram.com/kesardadhaba/" ${external}>${socialIcon('instagram')}<span class="footer-social-name">Instagram</span>${arrow}</a><a href="https://www.facebook.com/kesardadhaba" ${external}>${socialIcon('facebook')}<span class="footer-social-name">Facebook</span>${arrow}</a><a href="mailto:kesardadhabaamritsar@gmail.com">${socialIcon('email')}<span class="footer-social-name">Email</span>${arrow}</a></nav>
      <section class="footer-map" aria-label="Kesar Da Dhaba on the map"><iframe title="Map of Kesar Da Dhaba, Chowk Passian, Amritsar" src="https://maps.google.com/maps?q=Kesar+Da+Dhaba,+Chowk+Passian,+Amritsar&amp;ll=31.6242351,74.8729981&amp;z=16&amp;output=embed" width="360" height="190" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe><a href="${map}" ${external}>The original. Amritsar. ${arrow}</a></section>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} Kesar Da Dhaba</span><nav aria-label="More from Kesar"><a href="/honors-recognitions/">Honours</a><a href="https://kesardadhaba.com/notable-visitors/" ${external}>Notable visitors</a><a href="https://kesardadhaba.com/blogs/" ${external}>Journal</a></nav></div>
  </footer>`;
}
