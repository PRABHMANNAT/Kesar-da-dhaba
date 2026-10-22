# Homepage performance audit — 22 October 2026

Lighthouse 13.5.0 against `http://localhost:5178/`, using headless Google Chrome. Mobile uses the default 412×823 emulation and simulated throttling. Desktop uses the desktop preset. These are local lab measurements from one run per configuration; production hosting, connection speed and device performance will affect results.

## Scores

| Category | Before, mobile | Updated, mobile | Updated, desktop |
| --- | ---: | ---: | ---: |
| Performance | 63 | 92 | 100 |
| Accessibility | 93 | 100 | 100 |
| Best practices | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 |

## Loading metrics

| Metric | Before, mobile | Updated, mobile | Updated, desktop |
| --- | ---: | ---: | ---: |
| First Contentful Paint | 2.1 s | 1.8 s | 0.4 s |
| Largest Contentful Paint | 18.1 s | 3.2 s | 0.6 s |
| Speed Index | 4.4 s | 1.8 s | — |
| Total Blocking Time | 320 ms | 0 ms | 0 ms |
| Cumulative Layout Shift | 0.007 | 0 | 0 |

The mobile audit downloaded about 2.00 MB, compared with 5.75 MB before this change. Video playback and looping remain enabled during the audit.

## Changes

- Simplify the hero to one headline, “Since 1916” and an accessible icon control.
- Keep the video full width and use compositor transforms for the short native scroll animation.
- Remove the green scrim. Preserve original video colours with a light neutral scrim for text legibility.
- Encode a silent ten-second H.264 loop, with fast-start metadata: 1,107,785 bytes desktop (39% smaller) and 1,221,208 bytes mobile (47% smaller).
- Preload the matching WebP poster (9,874 / 20,948 bytes) and the display font. Begin automatic video loading after initial page load and browser idle time.
- Use a 22,802-byte navigation monogram instead of the 1,320,714-byte source, plus a separate 2,997-byte favicon.
- Correct the homepage ribbon’s accessible role, accessible label mismatches and small-text contrast reported by the baseline audit.

## Reproduce

Start the local server on port 5178, then run:

```powershell
npx --yes lighthouse http://localhost:5178/ --only-categories=performance,accessibility,best-practices,seo --chrome-flags='--headless=new' --output=html --output-path=qa/lighthouse-mobile.html
npx --yes lighthouse http://localhost:5178/ --preset=desktop --only-categories=performance,accessibility,best-practices,seo --chrome-flags='--headless=new' --output=html --output-path=qa/lighthouse-desktop.html
```

Full local JSON/HTML reports are in the ignored `qa/` folder as `lighthouse-before.report.*`, `lighthouse-after.report.*` and `lighthouse-desktop.report.*`.

Browser review also covered 320×568, 390×844, 768×1024, 844×390 and 1280×800 layouts, automatic and manual playback, scroll movement, offscreen pausing and the animation-disabled fallback. The generated-page link and asset checker passed 283 checks.
