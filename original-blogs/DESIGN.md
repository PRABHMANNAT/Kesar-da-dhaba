# Original blog page baseline

Source: [Kesar Da Dhaba — Blogs](https://kesardadhaba.com/blogs/), captured 22 October 2026.

This records the existing design for the requested clone. It does not propose a redesign. The live page was inspected in the browser at 1280px width; the local clone was also viewed at 430px and 320px. The original mobile page was not separately captured, so mobile styling follows its downloaded responsive CSS.

## Observed design tokens

| Role | Original value | Evidence |
| --- | --- | --- |
| Primary accent | `#ffde59` | Live `--primary-color`; theme inline styles |
| Header, headings and footer | `#062c1a` | Live `--secondary-color`; Elementor styles |
| Body copy | `#0a253e` | Live `--light-content-color` |
| Content background | White | Inspected screenshot and branding extraction |
| Body type | Futura | Live computed styles; mirrored `FuturaLT.woff` |
| Article headings | Original Maragsa display face, 600, 28px / 33.6px at 1280px | Live computed `.post-title`; mirrored display font |
| Banner title | Futura, 600, 40px / 40px at 1280px | Live computed `.pt-title` |
| Article excerpt | Futura, 16px / 21.6px at 1280px | Live computed `.post-excerpt p` |
| Button treatment | Square outline, uppercase text | Original header and Read More links |

## Layout and components

1. Forest green header: hamburger at left, original white image wordmark centered, outlined Our Menu link at right. Mobile uses the original compact wordmark and hamburger arrangement.
2. Photograph banner: makki di roti and saag, green overlay, centered BLOGS title. Its section measures 340px high in the inspected desktop DOM. A patterned yellow and green divider sits underneath.
3. Seven article previews: original thumbnail, date, Uncategorized link, uppercase display heading, excerpt and Read More link. At 1280px the card columns start at x=80, 459.925 and 839.850px; each is about 344.925px wide. The first row starts at y=545px. These are observed browser measurements, not newly chosen spacing.
4. Masonry: three columns from 1024px, two from 768px, one below 768px, as specified by the original theme styles. The native adapter restores the captured post query order and fills the shortest column.
5. Original patterned divider and photographic green footer: original brand description, location, hours, contact links, copyright and seven navigation links.
6. Original side drawer and sticky header: local navigation, social links, address, phone and email. Native JavaScript replaces the original WordPress interaction dependencies.

## Asset and source map

- `source.html`: untouched downloaded page source.
- `page.html`: editable clone snapshot with local asset URLs and local navigation routes.
- `assets.json`: all 132 mirrored stylesheets, fonts and images, with original source URLs and byte sizes.
- `resource-plan.json`: starting asset inventory, including images referenced by CSS.
- `prepare.py` and `mirror.mjs`: snapshot preparation and asset mirroring utilities.
- `../dist/blogs-clone.css`: small behaviour adaptations; visual design remains in the original mirrored styles.
- `../dist/blogs-clone.js`: native masonry, drawer, sticky header, parallax and back-to-top behaviour.
- `../blogs.mjs` and `../build.mjs`: independent document generation at `/blogs/`.

The hero uses `DSC00060-scaled.jpg`; the dividers use the original `Untitled-design950.png` and `Untitled-design941.png`. All seven original article thumbnails and original logo images are included. Exact resource paths and source URLs are in `assets.json`.

## Scope and limits

The cloned route is the blog listing. Article and category links retain their original destinations; individual article pages were not cloned. Known local site navigation routes point to the existing local pages. Hidden unused demo sections and third-party scripts were removed. No live WordPress backend, analytics or newsletter submission service is added. Small rendering differences can arise from browser/font rasterization and from replacing the original parallax and masonry scripts with native adapters.
