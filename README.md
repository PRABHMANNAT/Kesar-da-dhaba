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
- `dist/styles.css`: responsive design and typography.
- `dist/app.js`: menu filtering, mobile navigation and photo viewer.
- `dist/assets`: original brand photography, graphics and fonts.
- `asset-manifest.json`: asset sources and metadata.
- `media.json`: selected image mapping.

Build generation preserves CSS, JavaScript and image assets in `dist`.

## Content

Content and assets were collected from https://kesardadhaba.com/ and its official menu, legacy, shop and contact pages. Restaurant menu prices were not provided on the source page and are intentionally omitted. Shop prices reflect the source and ask customers to confirm availability with the team. Shop enquiries use the existing WhatsApp link; there is no checkout or reservation backend. Footer links for honours, notable visitors and journal lead to the existing website.

Confirm business hours, contact details, product prices and asset/font usage with the restaurant before replacing its main website. Update the canonical base URL in `build.mjs` when moving to the final domain.

## Verification

The local link checker validates generated pages, anchors and assets. Browser verification covered five pages at 320, 768 and 1280 pixel widths, menu search and categories, mobile navigation, photo viewer and the visitor FAQ.
