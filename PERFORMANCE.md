# Homepage performance audit — 22 October 2026

Lighthouse 13.5.0 against `http://localhost:5178/`, using headless Google Chrome. Mobile uses the default 412×823 emulation and simulated throttling. Desktop uses the desktop preset. These are local lab measurements from one run per configuration; production hosting, connection speed and device performance will affect results.

The comparison below records the original optimization in commit `c2f418e`. The immediate-autoplay follow-up is recorded separately at the end.

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

## Immediate-autoplay follow-up

The follow-up removes the hero playback button and the load/idle delay, starts native muted autoplay during HTML parsing, and matches each poster to its first video frame. The same camera movement now works on short screens in ordinary document flow.

A subsequent mobile Lighthouse 13.5.0 run using the same configuration scored **91 performance, 100 accessibility, 100 best practices and 100 SEO**. First Contentful Paint was 1.8 s; Largest Contentful Paint 3.2 s; Speed Index 3.4 s; Total Blocking Time 0 ms; Cumulative Layout Shift 0. The audit transferred 1,992,076 bytes. The desktop result above belongs to the prior commit and was not rerun for this follow-up.

The follow-up report is available locally in `qa/lighthouse-immediate-autoplay.report.html` and `.json`.


## Menu redesign — 22 October 2026

The menu uses the existing ten-second silent kitchen reel with a mobile source and WebP poster. All 43 dishes are rendered in HTML and initially visible. Search, category and Popular/Seasonal filters run locally. The 12 Instagram cards use optimized local previews and retain the original post/reel URLs; no third-party embed script is loaded. The supplied thali image is available at 480px and 900px. New imagery totals about 1.02 MB across all 23 files; images below the hero load lazily. The page skips the unrelated honours stylesheet and script.

Local Lighthouse 13.5 audit of the original menu redesign (`e779681`), throttled mobile: Performance 95, Accessibility 100, Best Practices 100, SEO 100; LCP 2.6 s, total blocking time 0 ms, CLS 0. Desktop: 100 in all four categories. Reports are saved locally in `qa/menu-lighthouse-mobile-final.report.html` and `qa/menu-lighthouse-desktop-final.report.html`. Scores describe this local audit and can vary by hosting, network and device.

Manual browser checks covered 320px, 430px, tablet and desktop layouts, complete initial content, combined filters, empty results, reset, photo details, mobile navigation, gallery navigation and muted hero autoplay. Normal scrolling is preserved. System reduced motion suppresses animated movement.

## Menu refinement follow-up

Four local reels total 8,352,540 bytes across the complete gallery. They retain original audio for the mute toggle, start muted and attach their source only while their card intersects the viewport. Offscreen and background playback stops automatically. The Google footer map uses native lazy loading and a reserved 165px desktop / 180px mobile height. Below-fold videos and the map do not block the initial hero.

Browser checks covered 320px and 430px mobile layouts, 1056px desktop and 1440px laptop previews, muted playback, sound toggling, horizontal gallery controls, offscreen pausing, the rendered map, category tracking, combined filters and reset. All 43 dishes remain visible by default. The historical Lighthouse scores above describe their recorded revisions.

The final refinement audit (Lighthouse 13.5.0, default simulated mobile throttling) scored **94 performance, 100 accessibility, 100 best practices and 100 SEO**. FCP 2.1 s, LCP 2.8 s, Speed Index 2.1 s, TBT 0 ms and CLS 0. No Instagram image/video requests were made during the initial load. Removing eager video `poster` attributes preserves the existing lazy image fallback and improved LCP from the first follow-up run’s 4.2 s to 2.8 s. The final audit also passes visible-label/accessibility-name matching. Reports are in the ignored `qa/menu-refined-mobile-final.report.html` and `.json`. The generated-page checker passed 332 checks. Desktop layout and interactions were reviewed in the browser; the historical desktop Lighthouse score above was not rerun for this refinement.
