# Homepage film hero

## Reference and interpretation

Reference: [Amrit Palace](https://amritpalace.com/), inspected on 22 October 2026 using the supplied screenshots, live browser and rendered HTML. Its video section combines full-height footage, overlaid editorial typography and movement with scrolling. The current Kesar interpretation follows the visitor’s native scroll with a short sticky interval, a subtle 1.00–1.07 camera zoom and a small headline lift. No scroll interception or video seeking is used.

## Visual system

- Retain the shared ivory navigation and existing Maragsa display / Futura body fonts.
- Full-width footage at every scroll position, without an inset frame or rounded corners.
- One headline: “OVER 100 YEARS OF GREAT TASTE”, followed only by “SINCE 1916”. Desktop keeps the headline on one line; narrow screens wrap it naturally.
- Keep the original footage colours. No green tint or video filter. A light neutral black scrim and text shadow support legibility.
- One discreet, 44-pixel icon control pauses or plays the background film. Its accessible name follows its current action.
- Mobile uses portrait footage and a shorter scroll interval. Short landscape screens and reduced-motion mode use an ordinary scrolling section.

## Original media and delivery

Use local asset U21 from the supplied official Kesar archive: `slow-cooked-dal-preparation-reel-24s.mp4`. The 6–16 second sequence shows cooking and serving, avoiding interviews and the closing overlay. Silent, fast-start H.264 renditions retain the original colours: 720×450 desktop and 576×1024 mobile, at 24 fps. No generated imagery is used. See `video-assets.json` for dimensions, sizes and provenance.

Responsive WebP posters weigh about 10 KB desktop / 21 KB mobile. Preload only the matching poster and the display font. The video uses `preload="none"` and starts in idle time after the initial page load, keeping its transfer out of the first paint. An explicit Play action can start sooner. Use a 208-pixel WebP monogram for shared navigation and a separate small favicon, retaining the original source asset.

## Interaction and fallback

Autoplay is silent and inline. Pause out of view, when the tab is hidden or a dialog opens. Respect reduced motion, data saving, existing autoplay preferences and the page’s animation setting. Explicit playback remains available. Keep the poster and headline visible if playback is disabled, blocked or unavailable. Scroll updates use requestAnimationFrame, with compositor transforms only while the hero is visible. No animation framework is loaded.

Implementation: `hero.mjs`, `dist/hero.css`, `dist/hero.js`. The extra CSS and script load only on the homepage.
