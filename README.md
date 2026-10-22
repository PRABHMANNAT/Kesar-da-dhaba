# Kesar Da Dhaba

A responsive six-page restaurant website using Kesar Da Dhaba's existing green/yellow identity, original photography and brand fonts.

## Run

Requires Node.js. No dependencies or installation step.

```sh
npm run build
npm run check
npm run dev
```

Open http://127.0.0.1:4173. Deploy the `dist` folder on a static host.

For Vercel, import this repository with the repository root as the Root Directory. The committed `vercel.json` selects the static-site preset, runs `npm run build`, and publishes `dist` rather than the default `public` folder.

## Editing

- `build.mjs`: content, shared layout and page generation. `/our-menu/` renders the responsive redesign in `menu.mjs`.
- `menu.mjs`, `menu-data.mjs`, `menu-posts.json`, `dist/menu.css` and `dist/menu.js`: menu layout, complete dish list, original Instagram post links, responsive styling, search, category/Popular/Seasonal filters, photo details and gallery controls. All dishes are present and visible initially. `menu-assets.json` records optimized original imagery.
- `footer.mjs` and `dist/footer.css`: shared responsive footer, visit information and lazy-loaded Google map.
- `experience.mjs`: signature-dish showcase, photo journal, visit drawer and homepage FAQ.
- `honours.mjs`, `honours-sections.mjs` and `honours-data.json`: homepage recognition-logo marquee and the Awards & Honours page, sourced from the official restaurant website. The page includes six recognitions, two published rating snapshots, five attributed press excerpts/summaries and five original Instagram photographs.
- `dist/styles.css`: responsive design and typography.
- `dist/app.js`: legacy menu filtering.
- `navigation.mjs`, `dist/navigation.css` and `dist/navigation.js`: shared navigation markup, rounded mobile menu and desktop/touch/keyboard interaction feedback.
- `dist/motion.css` and `dist/motion.js`: headline entrances, scroll reveals, image movement, reading progress and video playback controls.
- `dist/experience.css` and `dist/experience.js`: accessible dish tabs, six-image gallery navigation, visit planner and address copy.
- `dist/honours.css` and `dist/honours.js`: recognition marquee, animated award filters, culinary illustrations, manual press-review navigation and the Instagram gallery. Reviews support previous/next, publication selectors, arrow keys, Home/End and touch swipes; the Instagram strip uses native horizontal scrolling and scroll snapping on mobile. Native Web Animations provide entrances and transitions without a React dependency. The system reduced-motion preference suppresses animation. Reviews remain readable as a full list without JavaScript.
- `dist/assets/instagram`: original downloaded images from the shared official Instagram feed, copied from the supplied asset collection. Gallery links open the official profile. This is a curated selection, not a live feed; provenance is recorded in `honours-assets.json`.
- `video-assets.json`: provenance for the two official films and their extracted poster frames.
- `dist/assets`: original brand photography, graphics and fonts.
- `asset-manifest.json`: asset sources and metadata.
- `media.json`: selected image mapping.

Build generation preserves CSS, JavaScript and image assets in `dist`.

## Content

### Original blog listing clone

`/blogs/` is a separate faithful baseline of [the original blog listing](https://kesardadhaba.com/blogs/), ready for the next redesign. It preserves the original header, banner, seven post previews, typography, responsive masonry and footer. `blogs.mjs` reads the editable `original-blogs/page.html` snapshot; `node build.mjs` generates the route alongside the existing pages. The shared footer’s Journal link now opens this local route.

The clone uses 132 locally mirrored CSS, font and image resources (about 9.57 MB total on disk), recorded in `original-blogs/assets.json`. It has its own `dist/blogs-clone.css` and `dist/blogs-clone.js` behaviour adapters rather than the redesigned pages’ visual styles. Article/category links still open the original website. See `original-blogs/DESIGN.md` for observed styling, capture context and scope. Re-mirroring the source is optional maintenance; normal builds require only Node and the saved snapshot.

Content and assets were collected from https://kesardadhaba.com/ and its official menu, legacy, shop, honours and contact pages. Restaurant menu prices were not provided on the source page and are intentionally omitted. Shop prices reflect the source and ask customers to confirm availability with the team. Shop enquiries use the existing WhatsApp link; there is no checkout or reservation backend. Awards & Honours is a local page; the notable visitors footer link leads to the existing website, while Journal opens the local blog clone. Award wording is attributed to the restaurant’s published recognition archive; community ratings are identified as website snapshots rather than live platform scores. Logo provenance is recorded in `honours-assets.json`.

Confirm business hours, contact details, product prices and asset/font usage with the restaurant before replacing its main website. Update the canonical base URL in `build.mjs` when moving to the final domain.

## Verification

The local link checker validates generated pages, anchors and assets. Browser verification covered five pages at 320, 768 and 1280 pixel widths, menu search and categories, mobile navigation, photo viewer and the visitor FAQ.

## Video and motion

The homepage opens with a full-width original kitchen reel behind “OVER 100 YEARS OF GREAT TASTE” and “SINCE 1916”. A short native scroll interval adds a subtle camera zoom, upward parallax and headline lift. Short screens retain the same camera effect in normal document flow. `hero.mjs`, `dist/hero.css` and `dist/hero.js` own this first section. Desktop and mobile receive separate silent ten-second, fast-start H.264 cuts (about 1.11 MB / 1.22 MB). Matching first-frame WebP posters support a smooth fade into immediate muted, inline autoplay. There is no hero playback button or load/idle delay. The system reduced-motion and saved autoplay preferences manage playback. Posters remain visible when playback is unavailable or disabled. The film pauses offscreen, in a hidden tab and while a dialog is open. Reduced motion, data saving and saved playback preferences suppress automatic playback. See `DESIGN.md`, `video-assets.json` and `PERFORMANCE.md` for design choices, provenance and local audit results.

The homepage includes two self-hosted, original Kesar Da Dhaba films. They play muted when at least 25% visible and pause outside the viewport or when the document is hidden. Visitors can pause each film, enable sound, and turn autoplay off. Preferences are saved locally when browser storage is available. Reduced-motion and data-saving preferences disable automatic playback by default. Operating-system reduced motion suppresses animated movement. Native player controls remain available for seeking and fullscreen.

Films also pause while a modal is open. The signature tabs support Left/Right, Home and End keys. The photo journal supports Previous/Next buttons and arrow keys; both modal interfaces close with Escape and restore focus. The visit planner uses the restaurant's published hours rather than claiming real-time availability.

## Menu refinement

The menu includes compact rounded food-app links and 12 rounded Instagram cards. Four original local reels start muted when visible, expose only a sound toggle and pause when offscreen, in a hidden tab or behind a dialog. Each full reel is H.264-compressed at 432×768 with fast-start metadata; no video source is attached until its card is visible. Original Instagram links and poster fallbacks remain usable. Source and encoding details are in `menu-assets.json`.

The gallery supports touch swipes, keyboard scrolling and side arrows. A one-time 34px nudge introduces horizontal navigation, stops on interaction and respects reduced motion. The category underline follows the visible chapter without changing the selected dish filter; all 43 dishes remain visible initially. The shared footer has no animation-toggle button; system reduced motion continues to apply.

The menu’s star ornaments now use floating original food cutouts, with movement limited to visible elements and disabled for reduced motion. Food-app links share the forest green and cream palette. Shared footer links include Instagram, Facebook and email icons; the directions button includes a location pin, an arrow and hover/focus motion. A menu back-to-top button appears after scrolling, shows page progress, clears the mobile quick-action bar and returns keyboard focus to the hero heading. Browser checks covered 320px and 430px mobile layouts, desktop appearance and back-to-top behaviour; the generated-page checker passed 336 checks.

Food-app links now explain that they open the Amritsar listings on Zomato and Swiggy. Their cream and green resting state changes to Zomato red or Swiggy orange for hover, keyboard focus and touch activation. The Instagram heading uses a direct follow invitation. Footer social links use larger standalone icons without cards or icon borders, and the map sits inside a Kesar-yellow frame with an explicit Google Maps link. Layout review covered 320px, 430px and 1280px widths, activation colours and no horizontal overflow.


### Menu detail refinements

The intro heading is “A taste of Amritsar.” Its portrait film is the exact official reel supplied by the user, [DZaGqmegObG](https://www.instagram.com/reel/DZaGqmegObG/). The self-hosted 26-second, silent H.264 copy is 1.43 MB at 540 × 960. Its source is attached only when at least 20% visible, with an independently lazy-loaded WebP fallback. Playback pauses offscreen, in hidden tabs, during dialogs and for reduced motion; the caption opens the original reel with audio on Instagram.

The seasonal thali’s rotation, pitch and lift follow scroll position through one requested animation frame per scroll update while visible. The same local firni cutout floats in the seasonal and food-app sections. Sabziyan and Rotiyan use separate crops of local food photography; Beverages uses an optimized public-domain lassi glass photograph by Ranveig, sourced from Wikimedia Commons. Source, licence, processing details and output sizes are recorded in `menu-assets.json`.

The footer map frame uses the original Kesar yellow. Social links use custom SVG arrows with hover and keyboard-focus motion. Layout review included 320px and 430px mobile previews and a 1280px laptop preview. The original font, yellow Popular tags and initial complete menu are retained.


## Shared navigation

Blogs links to `/blogs/` in both the desktop navigation and the mobile page menu. The shared header uses a rounded Menu/Close control, an animated two-line icon, a cream navigation panel with numbered links, an active-page marker and a phone action. Hover, focus and touch presses use the brand yellow with SVG arrow movement. The desktop links use matching pill highlights and press feedback.

The mobile panel is used below 1024px to leave room for the added desktop link. It closes with Escape, an outside click, focus leaving the menu, a page-link selection or resizing to desktop width. Opening uses a short entrance and staggered link motion; system reduced motion and the site's paused-motion setting suppress it. The original blog clone retains its captured header and drawer as the redesign baseline.
