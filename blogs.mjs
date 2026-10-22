import fs from 'node:fs';

// Faithful original-page baseline, isolated from the redesigned page components.
export function blogsDocument(origin) {
  return fs.readFileSync(new URL('./original-blogs/page.html', import.meta.url), 'utf8')
    .replaceAll('__BLOG_ORIGIN__', origin);
}
