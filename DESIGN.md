# Homepage film hero

## Reference and interpretation

Reference: [Amrit Palace](https://amritpalace.com/), inspected on 22 October 2026 using the supplied screenshots, live browser and rendered HTML. The Kesar implementation follows native scrolling with a short sticky interval, a 1.00–1.09 camera zoom, slight upward parallax and a small headline lift. No scroll interception or video seeking is used.

## Visual system

- Retain the shared ivory navigation and existing Maragsa display / Futura body fonts.
- Full-width footage at every scroll position, without an inset frame or rounded corners.
- One headline: “OVER 100 YEARS OF GREAT TASTE”, followed only by “SINCE 1916”. Desktop keeps the headline on one line; narrow screens wrap it naturally.
- Original footage colours, without a green tint or video filter. A light neutral black scrim and text shadow support legibility.
- No controls or buttons inside the hero. The existing page-wide animation and autoplay controls manage playback.
- Mobile uses portrait footage and a shorter sticky interval. Short screens use normal document scrolling with the same camera effect. Reduced motion disables the scroll effect and automatic playback.

## Original media and delivery

Use local asset U21 from the supplied official Kesar archive: `slow-cooked-dal-preparation-reel-24s.mp4`. The 6–16 second sequence shows cooking and serving, avoiding interviews and the closing overlay. Silent, fast-start H.264 renditions retain the original colours: 720×450 desktop and 576×1024 mobile, at 24 fps. See `video-assets.json` for dimensions, sizes and provenance.

Responsive WebP posters weigh about 12 KB desktop / 19 KB mobile and match each rendition’s exact first frame. Preload only the matching poster and the display font. Native muted, inline autoplay is declared in HTML with `preload="auto"`; the controller requests playback immediately without a load or idle delay. The video fades in over its matching poster as soon as a decoded frame is ready. Use a 208-pixel WebP monogram for shared navigation and a separate small favicon, retaining the original source asset.

## Interaction and fallback

Pause out of view, when the tab is hidden or a dialog opens. Respect reduced motion, data saving, saved autoplay preferences and the page’s animation setting. Keep the poster and headline visible if playback is disabled, blocked or unavailable. If the browser blocks autoplay, retry on a subsequent pointer or keyboard interaction when playback is permitted. Scroll updates use requestAnimationFrame and compositor transforms only while the hero is visible. No animation framework is loaded.

Implementation: `hero.mjs`, `dist/hero.css`, `dist/hero.js`. The extra CSS and script load only on the homepage.
