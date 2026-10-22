const external = 'target="_blank" rel="noopener noreferrer"';
const arrow = '<span aria-hidden="true">↗</span>';

export function siteFooter(map) {
  return `<footer class="site-footer site-footer-refined">
    <div class="footer-masthead"><a class="footer-identity" href="/"><img src="/assets/menu/monogram.webp" alt="" width="64" height="64" loading="lazy"><span><small>THE ORIGINAL · SINCE 1916</small><strong>Kesar Da Dhaba</strong></span></a><a class="footer-directions" href="${map}" ${external}>Come over ${arrow}</a></div>
    <div class="footer-content">
      <section class="footer-address"><h2>Find us.</h2><address>Chowk Passian, Gali Rajpura<br>Near Telephone Exchange<br>Amritsar, Punjab</address><a class="footer-inline-link" href="${map}" ${external}>Get directions ${arrow}</a></section>
      <section class="footer-hours"><h2>Visit us.</h2><p>12 noon – 11 pm</p><small>Closed on the last Monday<br>of every month.</small><a class="footer-inline-link" href="tel:01832532227">0183 253 2227 ${arrow}</a></section>
      <nav class="footer-connect" aria-label="Stay connected"><h2>Say hello.</h2><a href="https://www.instagram.com/kesardadhaba/" ${external}>Instagram ${arrow}</a><a href="https://www.facebook.com/kesardadhaba" ${external}>Facebook ${arrow}</a><a href="mailto:kesardadhabaamritsar@gmail.com">Email ${arrow}</a></nav>
      <section class="footer-map" aria-label="Kesar Da Dhaba on the map"><iframe title="Map of Kesar Da Dhaba, Chowk Passian, Amritsar" src="https://maps.google.com/maps?q=Kesar+Da+Dhaba,+Chowk+Passian,+Amritsar&amp;ll=31.6242351,74.8729981&amp;z=16&amp;output=embed" width="360" height="190" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe><a href="${map}" ${external}>The original. Amritsar. ${arrow}</a></section>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} Kesar Da Dhaba</span><nav aria-label="More from Kesar"><a href="/honors-recognitions/">Honours</a><a href="https://kesardadhaba.com/notable-visitors/" ${external}>Notable visitors</a><a href="https://kesardadhaba.com/blogs/" ${external}>Journal</a></nav></div>
  </footer>`;
}
