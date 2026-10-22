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

- `build.mjs`: content, shared layout, menu and page generation.
- `experience.mjs`: signature-dish showcase, photo journal, visit drawer, homepage FAQ and footer composition.
- `honours.mjs`, `honours-sections.mjs` and `honours-data.json`: homepage recognition-logo marquee and the Awards & Honours page, sourced from the official restaurant website. The page includes six recognitions, two published rating snapshots, five attributed press excerpts/summaries and five original Instagram photographs.
- `dist/styles.css`: responsive design and typography.
- `dist/app.js`: menu filtering, mobile navigation and photo viewer.
- `dist/motion.css` and `dist/motion.js`: headline entrances, scroll reveals, image movement, reading progress and video playback controls.
- `dist/experience.css` and `dist/experience.js`: accessible dish tabs, six-image gallery navigation, visit planner and address copy.
- `dist/honours.css` and `dist/honours.js`: recognition marquee, animated award filters, culinary illustrations, manual press-review navigation and the Instagram gallery. Reviews support previous/next, publication selectors, arrow keys, Home/End and touch swipes; the Instagram strip uses native horizontal scrolling and scroll snapping on mobile. Native Web Animations provide entrances and transitions without a React dependency. The page pause control and system reduced-motion preference suppress animation. Reviews remain readable as a full list without JavaScript.
- `dist/assets/instagram`: original downloaded images from the shared official Instagram feed, copied from the supplied asset collection. Gallery links open the official profile. This is a curated selection, not a live feed; provenance is recorded in `honours-assets.json`.
- `video-assets.json`: provenance for the two official films and their extracted poster frames.
- `dist/assets`: original brand photography, graphics and fonts.
- `asset-manifest.json`: asset sources and metadata.
- `media.json`: selected image mapping.

Build generation preserves CSS, JavaScript and image assets in `dist`.

## Content

Content and assets were collected from https://kesardadhaba.com/ and its official menu, legacy, shop, honours and contact pages. Restaurant menu prices were not provided on the source page and are intentionally omitted. Shop prices reflect the source and ask customers to confirm availability with the team. Shop enquiries use the existing WhatsApp link; there is no checkout or reservation backend. Awards & Honours is a local page; footer links for notable visitors and journal lead to the existing website. Award wording is attributed to the restaurant’s published recognition archive; community ratings are identified as website snapshots rather than live platform scores. Logo provenance is recorded in `honours-assets.json`.

Confirm business hours, contact details, product prices and asset/font usage with the restaurant before replacing its main website. Update the canonical base URL in `build.mjs` when moving to the final domain.

## Verification

The local link checker validates generated pages, anchors and assets. Browser verification covered five pages at 320, 768 and 1280 pixel widths, menu search and categories, mobile navigation, photo viewer and the visitor FAQ.

## Video and motion

The homepage includes two self-hosted, original Kesar Da Dhaba films. They play muted when at least 25% visible and pause outside the viewport or when the document is hidden. Visitors can pause each film, enable sound, and turn autoplay off. Preferences are saved locally when browser storage is available. Reduced-motion and data-saving preferences disable automatic playback by default. The animation control independently disables visual movement, and operating-system reduced motion always suppresses CSS animation. Native player controls remain available for seeking and fullscreen.

Films also pause while a modal is open. The signature tabs support Left/Right, Home and End keys. The photo journal supports Previous/Next buttons and arrow keys; both modal interfaces close with Escape and restore focus. The visit planner uses the restaurant's published hours rather than claiming real-time availability.
