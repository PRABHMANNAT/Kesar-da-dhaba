# Original legacy page baseline

Captured from https://kesardadhaba.com/our-legacy/ on 2026-10-22.

`source.html` preserves the original public HTML; `instagram.html` preserves the client-rendered gallery. `prepare.py` removes the WordPress runtime, localizes navigation, and inserts the gallery snapshot. `mirror.mjs` downloads styles, fonts, and images and rewrites their URLs. `page.html` is the build input for `/our-legacy/`.

The original responsive styles and content are retained. Native adapters in `dist/legacy-clone.js` handle navigation, sticky headers, parallax, back-to-top and the gallery. Instagram thumbnails are a static snapshot; links open the original posts.

Rebuild the site with `node build.mjs`. To refresh the prepared snapshot after source changes, run `python original-legacy/prepare.py` (requires BeautifulSoup), then `node original-legacy/mirror.mjs`, then rebuild.
