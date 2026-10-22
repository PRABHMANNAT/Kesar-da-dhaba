# Kesar homepage

## Direction

A warm invitation into the original Amritsar restaurant. Keep the shared navigation, cream paper, deep green and Kesar yellow. The homepage introduces each part of the site through its existing photographs, local films, products and stories.

## Visual system

- Deep green #062c1a, yellow #ffde59, paper #faf7ef, muted sage and fine olive rules.
- Large Georgia display headings with italic accents, paired with the existing Futura body font.
- Arched films, tilted paper postcards, circular arrow controls and generous section spacing.
- Alternating cream, paper and yellow sections; botanical detail is reserved for the legacy section.
- The shared navbar remains consistent with the other pages, including the highlighted Our Menu link.

## Page sequence

1. Full-width cooking film hero: minimal centred heritage headline, menu action and scroll cue.
2. Yellow animated food ribbon.
3. Four accessible dish tabs: Dal Fry, Pranthas, Special Thali and Firni, linked to the corresponding menu categories.
4. Legacy introduction and the existing illustrated Partition train postcard, explicitly labelled as an illustration.
5. Three real guest films from the reviews archive, with individual sound controls.
6. Recognition logos and three celebrity visit films, linked to the recognition and celebrities pages.
7. Achaar and mukhwas from the shop.
8. Three articles from the existing journal.
9. Address, hours, phone and visit actions, followed by the shared footer.

## Responsive layout and motion

The hero is full width on desktop and mobile, using landscape and portrait footage respectively. Menu tabs remain four across; their content stacks. Guest and celebrity films become native horizontal swipe tracks with scroll snapping; guest films also have arrow controls. Shop products remain a compact pair. Journal and visit sections stack.

Use staggered hero entrances, one-time scroll reveals, a gentle hero zoom, a small postcard rotation as it scrolls into view, and hover feedback. Preserve native document scrolling. Respect reduced motion and saved preferences. A page motion control can pause and resume animation and automatic playback.

Films load when visible, loop silently, pause offscreen or when the document is hidden, and retain their posters if autoplay is unavailable. Sound requires an explicit action, and only one film is audible at a time. Pause playback behind an open dialog. Data-saving and saved autoplay preferences are respected. Keyboard navigation is available for the dish tabs and film tracks.

## Sources and implementation

Use existing local assets and data: reviews-media.json, notable-videos.json, blog-posts.json, menu food images, recognition logos, product photography and the previously generated train illustration. Do not invent guest quotations or current platform ratings.

The hero uses the existing silent kesar-hero-desktop.mp4 and kesar-hero-mobile.mp4 cooking clips, with matching responsive posters. The previous kitchen-loop.mp4 remains available but is no longer used in the hero.

Implementation: home.mjs, dist/home.css, dist/home.js, generated through build.mjs into dist/index.html. Homepage CSS and JavaScript load only on the homepage. The older cinematic hero files remain available but are no longer loaded by the homepage.
