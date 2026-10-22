"""Create additive derivatives; original images and fonts are never overwritten.
Requires Pillow, fonttools and Brotli. Run explicitly, not on the hosting build.
"""
from pathlib import Path
from PIL import Image, ImageOps
from fontTools.ttLib import TTFont
import hashlib, json, re
root=Path('dist'); output=root/'assets/performance'; output.mkdir(parents=True,exist_ok=True)
urls=set()
for p in root.rglob('*'):
    if p.suffix in ['.html','.css','.js'] and 'assets' not in p.relative_to(root).parts:
        urls.update(re.findall(r'/assets/[^\s\"\'<>\)]+?\.(?:png|jpg|jpeg|webp)',p.read_text(encoding='utf-8')))
manifest={}; savings=[]
for url in sorted(urls):
    p=root/url.lstrip('/')
    if not p.exists():continue
    with Image.open(p) as source:
        if getattr(source,'is_animated',False):continue
        im=ImageOps.exif_transpose(source)
        key=hashlib.sha256(p.read_bytes()).hexdigest()[:14]
        original=p.stat().st_size
        entry={'width':im.width,'height':im.height,'originalBytes':original,'src':url,'variants':[]}
        # Lossless is especially effective for transparent artwork and decorative PNGs.
        lossless=p.suffix.lower()=='.png'
        widths=sorted(set([min(480,im.width),min(960,im.width),min(1440,im.width),im.width])) if im.width>600 else [im.width]
        for width in widths:
            candidate=output/f'{key}-{width}.webp'
            resized=im if width==im.width else im.resize((width,round(im.height*width/im.width)),Image.Resampling.LANCZOS)
            resized.save(candidate,'WEBP',lossless=lossless,quality=92,method=6,icc_profile=im.info.get('icc_profile',b''))
            size=candidate.stat().st_size
            if size>=original:
                candidate.unlink() # Only this newly generated derivative, never an original.
                if width==im.width:entry['variants'].append({'src':url,'width':width,'bytes':original})
                continue
            hashed=output/f'{hashlib.sha256(candidate.read_bytes()).hexdigest()[:16]}-{width}.webp'
            candidate.replace(hashed)
            src='/'+hashed.relative_to(root).as_posix()
            entry['variants'].append({'src':src,'width':width,'bytes':size})
            if width==im.width:entry['src']=src
        if any(v['src']!=url for v in entry['variants']):
            manifest[url]=entry
            savings.append({'source':url,'originalBytes':original,'fullSizeBytes':next((v['bytes'] for v in entry['variants'] if v['width']==im.width),original),'lossless':lossless})
for p in (root/'assets').glob('*.woff'):
    font=TTFont(p);font.flavor='woff2';dest=output/(p.stem+'.woff2');font.save(dest)
    hashed=output/(hashlib.sha256(dest.read_bytes()).hexdigest()[:16]+'.woff2');dest.replace(hashed);dest=hashed
    manifest['/'+p.relative_to(root).as_posix()]={'src':'/'+dest.relative_to(root).as_posix(),'originalBytes':p.stat().st_size,'bytes':dest.stat().st_size}
Path('performance-media.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
Path('docs/performance/media-savings.json').write_text(json.dumps(savings,indent=2)+'\n',encoding='utf-8')
print(f'{len(manifest)} image/font entries; originals preserved')
