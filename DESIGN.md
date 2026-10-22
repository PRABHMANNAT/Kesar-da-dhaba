# Homepage film hero

## Reference and interpretation

Reference: [Amrit Palace](https://amritpalace.com/), inspected on 22 October 2026 using the supplied screenshots, live browser and rendered HTML. Its video section uses a full-height film, a dark overlay, overlaid editorial typography and a frame that grows with scrolling. The inspected section starts at a CSS scale of 0.95; a later scroll position measured 0.956. Its exact complete animation timeline was not copied.

The Kesar implementation uses the expanding frame idea with the existing Kesar identity. A short sticky interval, a mild video zoom and a small headline lift are implementation choices. Native scrolling remains under the visitor’s control. Mobile uses a smaller expansion and portrait footage; short landscape viewports and reduced-motion mode omit the sticky interval.

## Visual system

- Deep green `#062c1a`, warm ivory `#f7f2e7` and a softer antique gold `#ead18b`.
- Existing Maragsa display and Futura body fonts, loaded by the shared site stylesheet.
- One two-line H1: “OVER 100 YEARS OF GREAT TASTE”. Supporting copy and menu/story links remain readable over a green-black gradient.
- An initially inset film opens to the full stage width. Footer details use small, spaced type and a clearly labelled playback control with a 44-pixel minimum target.
- Keep the existing shared navigation, followed by the film hero and the existing welcome section.

## Original media

Use local asset U21 from the supplied official Kesar archive: `slow-cooked-dal-preparation-reel-24s.mp4`. The 6–18 second sequence shows cooking and serving, and avoids interviews and the closing overlay. Both H.264 renditions retain the original footage; the desktop version is cropped around the kitchen action, while mobile retains its portrait composition. No generated imagery is used. See `video-assets.json` for dimensions and provenance.

## Interaction and fallback

Autoplay is silent and inline. Pause when out of view, when the tab is hidden or a modal opens. Respect reduced motion, data saving, existing autoplay preferences and the page’s animation setting. An explicit Play film action remains available. If autoplay or video loading fails, keep a lightweight poster, the headline and navigation actions visible. Use requestAnimationFrame only for scroll updates; do not scrub video decoding with scrolling or load an animation framework.

Implementation: `hero.mjs`, `dist/hero.css`, `dist/hero.js`. The extra CSS and script load only on the homepage.
