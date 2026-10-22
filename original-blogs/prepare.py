"""Prepare the public blog listing snapshot; no WordPress runtime is needed."""
from pathlib import Path
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import json, re

root = Path(__file__).resolve().parent
base = 'https://kesardadhaba.com/blogs/'
soup = BeautifulSoup((root / 'source.html').read_text(encoding='utf-8'), 'html.parser')
for node in soup.select('script,noscript,iframe,link[rel="dns-prefetch"],link[rel="preconnect"],link[rel="EditURI"],link[rel="https://api.w.org/"]'):
    node.decompose()
# The original also ships unused demo headers, footers and newsletter widgets.
for node in list(soup.select('.elementor-hidden-desktop.elementor-hidden-tablet.elementor-hidden-mobile')):
    if node.parent:
        node.decompose()
for node in soup.find_all(True):
    for attr in list(node.attrs):
        if attr.lower().startswith('on'):
            del node.attrs[attr]
    if node.get('class'):
        node['class'] = [c for c in node['class'] if c not in ['elementor-invisible', 'animated', 'fadeInUp']]
        if 'e-con' in node['class']:
            node['class'].append('e-lazyloaded')
    if node.name == 'img':
        for attr in ['srcset', 'sizes', 'data-srcset', 'data-src', 'data-sizes']:
            node.attrs.pop(attr, None)
    if 'elementor-section-stretched' in node.get('class', []):
        node['style'] = re.sub(r'(?:^|;)\s*(?:width|left)\s*:[^;]+;?', ';', node.get('style', '')).strip('; ')
soup.body['class'] = [*soup.body.get('class', []), 'original-blogs-clone']
soup.html['class'] = ['js']
heading = next((n for n in soup.select('#content h3') if n.get_text(strip=True) == 'BLOGS'), None)
if heading:
    heading.name = 'h1'
    heading['id'] = 'blogs-title'
for node in soup.select('.sidemenu'):
    node['id'] = 'blogs-navigation'
    node['role'] = 'dialog'
    node['aria-label'] = 'Main navigation'
    node['aria-modal'] = 'true'
    node['aria-hidden'] = 'true'
    close = node.select_one('.close-button')
    if close:
        close.name = 'button'
        close['type'] = 'button'
        close['aria-label'] = 'Close menu'
for node in soup.select('.menu-toggle'):
    node['aria-controls'] = 'blogs-navigation'
    node['aria-expanded'] = 'false'
    node['aria-label'] = 'Menu'
top = soup.select_one('.to-top')
if top:
    top['href'] = '#blogs-title'
    top['aria-label'] = 'Back to top'
routes = ['/', '/blogs/', '/our-menu/', '/our-legacy/', '/our-shop/', '/honors-recognitions/', '/contact-us/']
for node in soup.select('a[href]'):
    parsed = urlparse(node['href'])
    if parsed.netloc == 'kesardadhaba.com' and parsed.path in routes:
        node['href'] = parsed.path + ('#' + parsed.fragment if parsed.fragment else '')
canonical = soup.select_one('link[rel="canonical"]')
if canonical:
    canonical['href'] = '__BLOG_ORIGIN__/blogs/'
for node in soup.select('meta[property="og:url"]'):
    node['content'] = '__BLOG_ORIGIN__/blogs/'
soup.head.append(soup.new_tag('link', rel='stylesheet', href='/blogs-clone.css'))
soup.body.append(soup.new_tag('script', src='/blogs-clone.js', defer=''))
resources = set()
def collect(value):
    if value and not value.startswith(('data:', '#')):
        url = urljoin(base, value)
        if urlparse(url).scheme in ['https', 'http']:
            resources.add(url)
for node in soup.select('link[rel="stylesheet"],link[rel="icon"],link[rel="apple-touch-icon"]'):
    if not node.get('href', '').startswith('/blogs-clone'):
        collect(node.get('href'))
for node in soup.select('img,source,video,[data-pt-background-image]'):
    for attr in ['src', 'poster', 'data-pt-background-image']:
        collect(node.get(attr))
for css in [n.get_text() for n in soup.select('style')] + [n.get('style', '') for n in soup.select('[style]')]:
    for match in re.finditer(r'url\(\s*[\'\"]?([^\)\'\"]+)', css):
        collect(match.group(1).strip())
(root / 'template.html').write_text(str(soup), encoding='utf-8')
(root / 'resource-plan.json').write_text(json.dumps(sorted(resources), indent=2) + '\n', encoding='utf-8')
print(f'Prepared {len(soup.select(".posts article"))} posts and {len(resources)} resources.')
