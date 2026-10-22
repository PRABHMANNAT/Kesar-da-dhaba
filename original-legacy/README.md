# Original legacy page baseline

Captured from https://kesardadhaba.com/our-legacy/ on 2026-10-22.

`source.html` preserves the original public HTML; `instagram.html` preserves the client-rendered gallery. `prepare.py` removes the WordPress runtime, localizes navigation, and inserts the gallery snapshot. `mirror.mjs` downloads styles, fonts, and images and rewrites their URLs. `page.html` is the build input for `/our-legacy/`.

The original responsive styles and content are retained. Native adapters in `dist/legacy-clone.js` handle navigation, sticky headers, parallax, back-to-top and the gallery. Instagram thumbnails are a static snapshot; links open the original posts.

Rebuild the site with `node build.mjs`. To refresh the prepared snapshot after source changes, run `python original-legacy/prepare.py` (requires BeautifulSoup), then `node original-legacy/mirror.mjs`, then rebuild.

Navigation now uses siteHeader from navigation.mjs, with scoped theme compatibility styles in dist/legacy-navigation.css. The rest of the original page remains the clone baseline.

The footer now uses siteFooter from footer.mjs and footer.css, with scoped compatibility styles in legacy-footer.css. The back-to-top control matches the journal scroll-progress ring.
