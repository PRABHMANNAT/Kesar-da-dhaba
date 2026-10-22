"""Build the downloadable menu from the same dish data as the website."""
from pathlib import Path
import json
import subprocess
import shutil
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from PIL import Image
from io import BytesIO

ROOT = Path(__file__).resolve().parents[1]
categories = json.loads(subprocess.check_output(
    ['node','--input-type=module','-e',
     "import {menuCategories} from './menu-data.mjs'; console.log(JSON.stringify(menuCategories));"],
    cwd=ROOT, encoding='utf-8'))
DATA = {c['id']:c for c in categories}
OUT = ROOT/'output/pdf/kesar-da-dhaba-menu.pdf'
OUT.parent.mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(TTFont('Editorial','C:/Windows/Fonts/georgia.ttf'))
pdfmetrics.registerFont(TTFont('EditorialItalic','C:/Windows/Fonts/georgiai.ttf'))
W,H=595.276,841.89
INK=HexColor('#062c1a'); PAPER=HexColor('#faf7ef')
GOLD=HexColor('#b08b3c'); SAGE=HexColor('#6d7865'); LINE=HexColor('#d9d7c7')
C=canvas.Canvas(str(OUT),pagesize=(W,H),pageCompression=1)
C.setTitle('The Kesar Menu | Kesar Da Dhaba')
C.setAuthor('Kesar Da Dhaba')
C.setSubject('43 dishes from the original Kesar Da Dhaba, Amritsar')
M=46

def text(x,y,value,size=11,font='Helvetica',color=INK):
    C.setFillColor(color);C.setFont(font,size);C.drawString(x,H-y,value)
def rule(y,x=M,width=W-2*M,color=LINE):
    C.setStrokeColor(color);C.setLineWidth(.6);C.line(x,H-y,x+width,H-y)
def para(value,x,y,width,size=10,color=SAGE,font='Helvetica'):
    style=ParagraphStyle('body',fontName=font,fontSize=size,leading=size*1.48,textColor=color)
    p=Paragraph(value.replace('&','&amp;'),style)
    _,h=p.wrap(width,600);p.drawOn(C,x,H-y-h);return h
def photo(file,x,y,width,height):
    im=Image.open(ROOT/'dist/assets'/file).convert('RGB')
    ratio=max(width/im.width,height/im.height)
    nw,nh=int(im.width*ratio),int(im.height*ratio)
    im=im.resize((nw,nh),Image.Resampling.LANCZOS)
    left=(nw-width)/2;top=(nh-height)/2
    im=im.crop((int(left),int(top),int(left+width),int(top+height)))
    b=BytesIO();im.save(b,format='JPEG',quality=92)
    C.drawImage(ImageReader(b),x,H-y-height,width,height)
def start(number,section):
    C.setFillColor(PAPER);C.rect(0,0,W,H,stroke=0,fill=1)
    C.drawImage(ImageReader(str(ROOT/'dist/assets/monogram-compact.webp')),M,H-67,32,32,mask='auto')
    text(M+43,47,'KESAR DA DHABA',15,'Editorial')
    text(M+43,61,'A HOUSE OF TRADITIONAL FOOD',6.5,color=SAGE)
    C.setFillColor(GOLD);C.setFont('Helvetica',8);C.drawRightString(W-M,H-50,'AMRITSAR / SINCE 1916')
    rule(82)
    rule(788)
    text(M,808,'THE ORIGINAL. AMRITSAR.',7,color=SAGE)
    C.setFont('Helvetica',7);C.drawRightString(W-M,H-808,f'{section.upper()}   /   0{number}')
def label(y,value,x=M):text(x,y,value,8,color=GOLD)
def title(y,value,size=40,x=M):text(x,y,value,size,'Editorial')
def item(item,x,y,width,desc=True,size=14):
    name,description,*badge=item
    text(x,y,name,size,'Editorial')
    y+=8
    if badge:
        text(x,y+7,badge[0].upper(),6.5,color=GOLD);y+=15
    if desc and description:y+=para(description,x,y,width,9.3)+3
    return y
def section(category,x,y,width):
    title(y,category['name'],27,x)
    y+=14
    for i in category['items']:
        y+=25
        item(i,x,y,width,False,12.5)
        if len(i)>2 and i[2]:y+=12
    return y

# 1: Seven complete meals, with generous space for exactly what each thali contains.
start(1,'Thali')
label(113,'THE KESAR MENU')
title(162,'A taste of Amritsar.',39)
para('Slow-cooked traditions. Golden pranthas. A generous welcome.',M,178,470,11)
photo('menu/kesar-thali-portrait.webp',M,214,W-2*M,175)
label(419,'01 / A LITTLE OF EVERYTHING')
title(455,'Thali',33)
left=[DATA['thali']['items'][i] for i in [0,2,4,6]]
right=[DATA['thali']['items'][i] for i in [1,3,5]]
for x,items in [(M,left),(316,right)]:
    y=492
    for row in items:
        bottom=item(row,x,y,230,True,13)
        y=max(y+68,bottom+21)
text(M,770,'Please ask our team for current prices and seasonal availability.',8.5,color=SAGE)
C.showPage()

# 2: The heart of the menu; a clean two-column list, no decorative price placeholders.
start(2,'Sabziyan')
label(114,'02 / FROM OUR KITCHEN')
title(162,'Sabziyan',43)
para(DATA['sabziyan']['intro'],M,182,450,11)
photo('menu/sabziyan-dal.webp',M,220,155,155)
title(270,'Good things',25,229)
text(229,303,'take their time.',25,'EditorialItalic',SAGE)
para('Our signature Dal Fry, finished with desi ghee.',229,325,285,10)
rule(402)
for x,items in [(M,DATA['sabziyan']['items'][:9]),(316,DATA['sabziyan']['items'][9:])]:
    y=435
    for row in items:
        item(row,x,y,230,False,13);y+=35
text(M,770,'SEASONAL = available in season. Ask our team for today’s selection.',8.5,color=SAGE)
C.showPage()

# 3: Breads and accompaniments kept together for easy ordering.
start(3,'Breads & sides')
label(114,'03 / MADE FOR THE TABLE')
title(163,'Break bread.',43)
text(M,208,'Share a little more.',31,'EditorialItalic',SAGE)
photo('menu/rotiyan-breads.webp',M,241,W-2*M,185)
section(DATA['pranthas'],M,474,230)
section(DATA['rotiyan'],316,474,230)
section(DATA['raita-pulao'],316,653,230)
C.showPage()

# 4: A quiet final page, with a useful visit card and live phone/map links.
start(4,'Sweet endings')
label(114,'04 / ALWAYS LEAVE A LITTLE ROOM')
title(163,'A sweet finish.',43)
section(DATA['meetha'],M,225,230)
section(DATA['beverages'],316,225,230)
C.drawImage(ImageReader(str(ROOT/'dist/assets/phirni.png')),M,H-564,250,150,mask='auto')
text(325,475,'The last spoonful.',20,'EditorialItalic',SAGE)
para('Our traditional firni. A familiar finish to a Kesar meal.',325,493,220,10)
C.setFillColor(INK);C.rect(M,H-746,W-2*M,151,stroke=0,fill=1)
text(M+22,627,'Come hungry.',26,'Editorial',PAPER)
text(M+22,653,'Chowk Passian, Gali Rajpura',10,color=PAPER)
text(M+22,669,'Near Telephone Exchange, Amritsar',10,color=PAPER)
text(M+22,695,'12 noon - 11 pm',10,color=HexColor('#ffde59'))
text(M+22,714,'Closed on the last Monday of every month.',8.5,color=PAPER)
text(356,650,'0183 253 2227',13,'Helvetica',HexColor('#ffde59'))
C.linkURL('tel:01832532227',(350,H-663,W-M-15,H-634),relative=0)
text(356,679,'Find the original',10,color=PAPER)
C.linkURL('https://www.google.com/maps/search/?api=1&query=Kesar+Da+Dhaba+Amritsar',(350,H-690,W-M-15,H-665),relative=0)
text(M,770,'For current prices and availability, please call the dhaba.',8.5,color=SAGE)
C.showPage()
C.save()
target=ROOT/'dist/assets/kesar-da-dhaba-menu.pdf'
shutil.copy2(OUT,target)
print(f'Created {OUT} ({OUT.stat().st_size:,} bytes), copied to {target}')
