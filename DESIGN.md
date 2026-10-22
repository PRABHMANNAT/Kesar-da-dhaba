# Homepage design

## Scope

Only the homepage source, homepage assets and generated dist/index.html are changed. Every other page and shared style/script remains byte-for-byte unchanged. Component designs and media are adapted into homepage-specific markup, CSS and JavaScript.

## Direction

A cinematic opening followed by an editorial journey through Kesar. Use deep green #062c1a, cream #faf7ef, yellow #ffde59, sage #78836d, Georgia display type and the existing Futura body font. Preserve the shared navbar and footer. Alternate generous light sections with immersive films and green and yellow accents. Round controls, paper postcards, floating food cutouts and the existing botanical background connect the components.

## Visitor journey

1. Cooking-video hero and a natural-language ribbon: traditional Punjabi cooking, pure desi ghee, the family tradition since 1916, and the heart of Amritsar.
2. Menu welcome with thali film, View full menu action and PDF download. A green-and-gold emblem divider introduces the family story.
3. Balanced legacy copy and film columns, with the Partition journey illustration and story link in a compact row underneath.
4. Kitchen films in the Instagram-style video carousel, followed by guest reviews and celebrity visits.
5. Framed, arched recognition cards in a marquee, then the green Pride of Punjab section. The archive footnote strip is removed; hover, focus and reduced-motion preferences pause the marquee.
6. Shop postcards and Zomato/Swiggy links group the ways to bring Kesar home.
7. Blog cards use each article's own local image with explicit dimensions and eager loading, followed by the Instagram feed. The journal action reads Explore all blogs.
8. Original address, hours and visit actions beside Google Maps, a floating thali cutout and a subtle floral background. The dish responds to scrolling and respects reduced motion.

## Motion and responsiveness

Motion 12.23.24 is locally hosted in dist/assets/home/motion-12.23.24.js, with its MIT license alongside it. Use Motion.animate, Motion.inView and Motion.scroll for word-mask reveals, staggered entrances, hero zoom, film parallax, postcard rotations, a perspective-and-parallax legacy film with a floating seal, photo expansion and spring card gestures. Native horizontal scrolling and pointer dragging preserve normal page scrolling. CSS supplies the continuously moving ribbon, awards and floating cutout.

Mobile layouts stack in a clear reading order. Film rails show the next card as a swipe cue, the celebrity deck supports drag plus labelled arrow buttons, shop postcards overlap at a compact size, and the kitchen-reel carousel shows one video at a time. At tablet and desktop widths, editorial sections become two columns and reviews/celebrity films show three cards.

Respect system reduced motion, data saving and saved autoplay preferences. The homepage motion preference is separate from other pages. Videos load on visibility and pause when offscreen, behind a dialog or in a hidden tab; inactive stacked celebrity films pause. Only one film can be audible. Posters remain visible without autoplay. Interactive controls are keyboard accessible and all actions have accessible names. Animation failure leaves the content readable.

## Sources

All photography, video, recognition details, dishes, posts and guest films come from the site's existing local assets and data. The Partition image is the previously generated illustration and is explicitly captioned as such. Do not invent visitor identities, testimonials, prices or live ratings.

Motion API references: https://motion.dev/docs/quick-start, https://motion.dev/docs/inview, https://motion.dev/docs/scroll.

Implementation: home.mjs, dist/home.css and dist/home.js. The standard build.mjs still generates the homepage; this revision regenerated only dist/index.html to preserve all other pages.

## Homepage interaction refinements

The visit strip sits immediately after the hero. Legacy, kitchen, review and Instagram films use sound-only controls. Kitchen and Instagram headings type through short phrases while visible, with stable accessible labels and static reduced-motion text. The kitchen CTA opens the originating shop page. Review and Instagram arrows have larger touch targets; kitchen arrows also show Previous and Next reel labels. Blog cards match the journal page including categories, excerpts, dates, framed images, zoom and light-sweep effects. The back-to-top ring shows reading progress. Reels appear first in the Instagram feed; visible Instagram reels autoplay together, muted and looping, while offscreen and hidden-tab videos pause. The final visit layout pairs the supplied unedited prantha photograph with the original address, hours, actions and map. The endnote strip is removed.
