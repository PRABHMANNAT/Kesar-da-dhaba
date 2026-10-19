# Kesar Da Dhaba

A responsive five-page restaurant website using Kesar Da Dhaba's existing green/yellow identity, original photography and brand fonts.

## Run

Requires Node.js. No dependencies or installation step.

```sh
npm run build
npm run check
npm run dev
```

Open http://127.0.0.1:4173. Deploy the `dist` folder on a static host.

## Editing

- `build.mjs`: content, shared layout, menu and page generation.
- `experience.mjs`: signature-dish showcase, photo journal, visit drawer, homepage FAQ and footer composition.
- `dist/styles.css`: responsive design and typography.
- `dist/app.js`: menu filtering, mobile navigation and photo viewer.
- `dist/motion.css` and `dist/motion.js`: headline entrances, scroll reveals, image movement, reading progress and video playback controls.
- `dist/experience.css` and `dist/experience.js`: accessible dish tabs, six-image gallery navigation, visit planner and address copy.
- `video-assets.json`: provenance for the two official films and their extracted poster frames.
- `dist/assets`: original brand photography, graphics and fonts.
- `asset-manifest.json`: asset sources and metadata.
- `media.json`: selected image mapping.

Build generation preserves CSS, JavaScript and image assets in `dist`.

## Content

Content and assets were collected from https://kesardadhaba.com/ and its official menu, legacy, shop and contact pages. Restaurant menu prices were not provided on the source page and are intentionally omitted. Shop prices reflect the source and ask customers to confirm availability with the team. Shop enquiries use the existing WhatsApp link; there is no checkout or reservation backend. Footer links for honours, notable visitors and journal lead to the existing website.

Confirm business hours, contact details, product prices and asset/font usage with the restaurant before replacing its main website. Update the canonical base URL in `build.mjs` when moving to the final domain.

## Verification

The local link checker validates generated pages, anchors and assets. Browser verification covered five pages at 320, 768 and 1280 pixel widths, menu search and categories, mobile navigation, photo viewer and the visitor FAQ.

## Video and motion

The homepage includes two self-hosted, original Kesar Da Dhaba films. They play muted when at least 25% visible and pause outside the viewport or when the document is hidden. Visitors can pause each film, enable sound, and turn autoplay off. Preferences are saved locally when browser storage is available. Reduced-motion and data-saving preferences disable automatic playback by default. The animation control independently disables visual movement, and operating-system reduced motion always suppresses CSS animation. Native player controls remain available for seeking and fullscreen.

Films also pause while a modal is open. The signature tabs support Left/Right, Home and End keys. The photo journal supports Previous/Next buttons and arrow keys; both modal interfaces close with Escape and restore focus. The visit planner uses the restaurant's published hours rather than claiming real-time availability.
