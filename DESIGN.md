# Homepage design

## Scope

Only the homepage source, homepage assets and generated dist/index.html are changed. Every other page and shared style/script remains byte-for-byte unchanged. Component designs and media are adapted into homepage-specific markup, CSS and JavaScript.

## Direction

A cinematic opening followed by an editorial journey through Kesar. Use deep green #062c1a, cream #faf7ef, yellow #ffde59, sage #78836d, Georgia display type and the existing Futura body font. Preserve the shared navbar and footer. Alternate generous light sections with immersive films and green and yellow accents. Round controls, paper postcards, floating food cutouts and the existing botanical background connect the components.

## Visitor journey

1. Full-width cooking-video hero, followed by the yellow animated food ribbon. The second Spirit of Kesar video section has been removed.
2. Menu welcome with the thali film postcard, floating dish, green View full menu action and PDF download. The separate Signature Dishes list has been removed.
3. A fuller two-paragraph family legacy, Partition train illustration, original legacy film and floating 1916 seal.
4. Celebrity films and the two-stage 27-photograph album action.
5. A complete six-award marquee and green Pride of Punjab section.
6. All 18 guest films with the botanical background, swipe/paging controls, and Planning a visit strip.
7. A compact shop introduction. Its overlapping square product photographs use intrinsic image heights and an auto-sizing grid, with their captions fully inside the section.
8. Kitchen films on the shop-style video background, presented as a single Instagram-style carousel. It includes profile header, count, reel caption/link, arrow buttons, dots, keyboard controls and swipe gestures. Videos advance at their end when autoplay is permitted; hidden slides pause. Desktop copy and carousel sit side by side, with a compact stacked mobile layout.
9. Zomato/Swiggy links, Instagram feed cards and journal stories.
10. Original address, hours, phone and visit actions beside an interactive Google map and a direct Maps link.

## Motion and responsiveness

Motion 12.23.24 is locally hosted in dist/assets/home/motion-12.23.24.js, with its MIT license alongside it. Use Motion.animate, Motion.inView and Motion.scroll for word-mask reveals, staggered entrances, hero zoom, film parallax, postcard rotations, a perspective-and-parallax legacy film with a floating seal, photo expansion and spring card gestures. Native horizontal scrolling and pointer dragging preserve normal page scrolling. CSS supplies the continuously moving ribbon, awards and floating cutout.

Mobile layouts stack in a clear reading order. Film rails show the next card as a swipe cue, the celebrity deck supports drag plus labelled arrow buttons, shop postcards overlap at a compact size, and the kitchen-reel carousel shows one video at a time. At tablet and desktop widths, editorial sections become two columns and reviews/celebrity films show three cards.

Respect system reduced motion, data saving and saved autoplay preferences. The homepage motion preference is separate from other pages. Videos load on visibility and pause when offscreen, behind a dialog or in a hidden tab; inactive stacked celebrity films pause. Only one film can be audible. Posters remain visible without autoplay. Interactive controls are keyboard accessible and all actions have accessible names. Animation failure leaves the content readable.

## Sources

All photography, video, recognition details, dishes, posts and guest films come from the site's existing local assets and data. The Partition image is the previously generated illustration and is explicitly captioned as such. Do not invent visitor identities, testimonials, prices or live ratings.

Motion API references: https://motion.dev/docs/quick-start, https://motion.dev/docs/inview, https://motion.dev/docs/scroll.

Implementation: home.mjs, dist/home.css and dist/home.js. The standard build.mjs still generates the homepage; this revision regenerated only dist/index.html to preserve all other pages.
