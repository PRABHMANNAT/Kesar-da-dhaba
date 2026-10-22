# Homepage design

## Scope

Only the homepage source, homepage assets and generated dist/index.html are changed. Every other page and shared style/script remains byte-for-byte unchanged. Component designs and media are adapted into homepage-specific markup, CSS and JavaScript.

## Direction

A cinematic opening followed by an editorial journey through Kesar. Use deep green #062c1a, cream #faf7ef, yellow #ffde59, sage #78836d, Georgia display type and the existing Futura body font. Preserve the shared navbar and footer. Alternate generous light sections with immersive films and green and yellow accents. Round controls, paper postcards, floating food cutouts and the existing botanical background connect the components.

## Visitor journey

1. Full-width video hero, responsive portrait/landscape cooking footage, heritage headline and menu action.
2. A second immersive kitchen film introducing the spirit of Kesar and linking to the legacy page.
3. Yellow animated food ribbon.
4. Menu welcome adapted from the menu page: thali film postcard, floating dish and original K seal, green View full menu action and PDF download.
5. A scrollable six-dish menu frame beside an interactive food photograph. Use actual menu descriptions and no invented prices.
6. Summarised family legacy, labelled Partition train illustration, original legacy film and floating 1916 seal.
7. Celebrity films: three cards on desktop and a draggable spring-animated deck on mobile. The first album action reveals all 27 photographs; its second click opens the full Celebrities page.
8. A continuous marquee with all six complete awards: image, issuer, title, years and region. Pause controls and static horizontal scrolling support reduced motion.
9. Pride of Punjab on solid green, with a complete award photograph, family message and recognition-page link.
10. Guest review cards, using all 18 existing films and the exact botanical background from the reviews page. Horizontal snapping and swipe gestures, active-card yellow outline, individual play and sound controls, and a Planning a visit strip.
11. A compact shop introduction using the same botanical background and overlapping product-photo treatment as the shop page.
12. The shop's video background, with three actual kitchen reels replacing the central photo placeholder. Each reel has sound/play controls and its Instagram link.
13. Zomato and Swiggy listing actions, with the existing firni cutout.
14. Instagram post cards from the menu's existing post data, in a horizontal rail with controls.
15. Three journal stories, followed by the original address, hours, phone and visit actions.

## Motion and responsiveness

Motion 12.23.24 is locally hosted in dist/assets/home/motion-12.23.24.js, with its MIT license alongside it. Use Motion.animate, Motion.inView and Motion.scroll for word-mask reveals, staggered entrances, hero zoom, film parallax, postcard rotations, dish transitions, photo expansion and spring card gestures. Native horizontal scrolling and pointer dragging preserve normal page scrolling. CSS supplies the continuously moving ribbon, awards and floating cutout.

Mobile layouts stack in a clear reading order. Film rails show the next card as a swipe cue, the celebrity deck supports drag plus labelled arrow buttons, shop postcards overlap at a compact size, and the menu list scrolls inside its frame. At tablet and desktop widths, editorial sections become two columns and reviews/celebrity films show three cards.

Respect system reduced motion, data saving and saved autoplay preferences. The homepage motion preference is separate from other pages. Videos load on visibility and pause when offscreen, behind a dialog or in a hidden tab; inactive stacked celebrity films pause. Only one film can be audible. Posters remain visible without autoplay. Interactive controls are keyboard accessible and all actions have accessible names. Animation failure leaves the content readable.

## Sources

All photography, video, recognition details, dishes, posts and guest films come from the site's existing local assets and data. The Partition image is the previously generated illustration and is explicitly captioned as such. Do not invent visitor identities, testimonials, prices or live ratings.

Motion API references: https://motion.dev/docs/quick-start, https://motion.dev/docs/inview, https://motion.dev/docs/scroll.

Implementation: home.mjs, dist/home.css and dist/home.js. The standard build.mjs still generates the homepage; this revision regenerated only dist/index.html to preserve all other pages.
