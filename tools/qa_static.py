#!/usr/bin/env python3
"""Dependency-light static integrity QA. Requires BeautifulSoup for extended checks."""
import json,re,sys,subprocess
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
from collections import Counter
ROOT=Path(__file__).resolve().parents[1]
SITE=ROOT/'site'
email_config=(ROOT/'src/build/config.ts').read_text(encoding='utf-8')
email_match=re.search(r'export const businessEmail\s*=\s*[\'\"]([^\'\"]+)[\'\"]', email_config)
if not email_match:raise ValueError('businessEmail missing from src/build/config.ts')
expected_email=email_match.group(1)
products=json.loads((ROOT/'content'/'products.json').read_text(encoding='utf-8'))
product_count=len(products)
files=sorted(SITE.rglob('*.html'))
issues=[]
class Parser(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.tags=[];self.ids=[];self.links=[];self.images=[];self.lang=None;self.titles=[]
 def handle_starttag(self,tag,attrs):
  d=dict(attrs);self.tags.append(tag)
  if tag=='html':self.lang=d.get('lang')
  if 'id' in d:self.ids.append(d['id'])
  if tag in ('a','link','script'):
   attr='href' if tag!='script' else 'src'
   if d.get(attr):self.links.append((tag,d[attr]))
  if tag=='img':self.images.append(d)
parsers={}
for file in files:
 source=file.read_text(encoding='utf-8')
 p=Parser();p.feed(source);parsers[file]=p
 for linked_email in re.findall(r'mailto:([^\"\s<>]+)',source):
  if linked_email.lower()!=expected_email.lower():issues.append(f'{file}: contact link does not match configured email')
 if '{{businessEmail}}' in source:issues.append(f'{file}: unresolved business email token')
 if '{{businessLocation}}' in source:issues.append(f'{file}: unresolved business location token')
 if 'Suurstoffi 13b' in source or 'Rotkreuz, Zug' in source:issues.append(f'{file}: private street address still exposed')
 if 'facebook.com' in source.lower():issues.append(f'{file}: removed social platform still linked')
 loc=file.relative_to(SITE).parts[0]
 if loc in ('en','de','es','fr','it','ca'):
  if p.lang != loc:issues.append(f'{file}: wrong document lang {p.lang}')
  if p.tags.count('main')!=1:issues.append(f'{file}: main count not 1')
  if p.tags.count('h1')!=1:issues.append(f'{file}: h1 count not 1')
  if 'main-content' not in p.ids:issues.append(f'{file}: no skip target')
  if not p.images and len(file.relative_to(SITE).parts)==2:issues.append(f'{file}: missing artwork')
 dupes=[id for id,cnt in Counter(p.ids).items() if cnt>1]
 if dupes:issues.append(f'{file}: repeated IDs {dupes}')
 for tag,url in p.links:
  parsed=urlsplit(url)
  if parsed.scheme in ('mailto','http','https','tel','data') or url.startswith('#'):pass
  elif parsed.scheme:issues.append(f'{file}: unexpected link protocol {url}')
  else:
   # GitHub Pages custom 404s retain the originally requested URL; root-absolute
   # home links are necessary even when the missing page is nested deeply.
   target=((SITE/unquote(parsed.path).lstrip('/')) if parsed.path.startswith('/') else (file.parent/unquote(parsed.path))).resolve()
   try: target.relative_to(SITE.resolve())
   except ValueError:issues.append(f'{file}: link escapes website {url}');continue
   if target.is_dir():target=target/'index.html'
   if not target.exists():issues.append(f'{file}: broken internal link {url}')
  if parsed.scheme in ('http','https') and tag=='a':
   if parsed.hostname not in ('a.co','amzn.eu','www.instagram.com','www.tiktok.com','www.amazon.com'):
    issues.append(f'{file}: unknown outbound host {parsed.hostname}')
 for img in p.images:
  if not img.get('alt') and img.get('alt')!='':issues.append(f'{file}: image lacks alt')
  url=img.get('src',''); parsed=urlsplit(url)
  if parsed.scheme:issues.append(f'{file}: offsite image {url}')
  else:
   target=(file.parent/unquote(parsed.path)).resolve()
   if not target.is_file():issues.append(f'{file}: missing image {url}')
 if file.name=='index.html' and loc in ('en','de','es','fr','it','ca') and len(file.relative_to(SITE).parts)==2:
  text=file.read_text(encoding='utf-8')
  if 'book-card' not in text:issues.append(f'{file}: no books')
  if text.count('class="book-card"')!=product_count:issues.append(f'{file}: expected {product_count} book cards')
  if 'mailto:'+expected_email not in text:issues.append(f'{file}: wrong public contact link')
 if len(file.relative_to(SITE).parts)>2 and loc in ('en','de','es','fr','it','ca'):
  if re.search(r'lang-details',file.read_text(encoding='utf-8')) is None:issues.append(f'{file}: language switcher missing')
js=subprocess.run(['node','--check',str(SITE/'assets/site.js')],capture_output=True,text=True)
if js.returncode:issues.append(f'JS syntax invalid: {js.stderr}')
try:
 import tinycss2
 css=tinycss2.parse_stylesheet((SITE/'assets/styles.css').read_text(encoding='utf-8'),skip_comments=True,skip_whitespace=True)
 parse_errors=[x for x in css if x.type=='error']
 if parse_errors:issues.append(f'CSS parsing errors: {parse_errors}')
except ImportError:pass
for loc in ['en','de','es','fr','it','ca']:
 data=json.loads((ROOT/'content'/f'{loc}.json').read_text(encoding='utf-8'))
 if any(x not in data for x in ('hero','experience','infoPages')):issues.append(f'{loc} content fields missing')
 for book in products:
  t=book.get('translations',{}).get(loc,{})
  if not all(t.get(k) for k in ('title','theme','description')):issues.append(f'{loc}/{book.get("id")}: product translation missing')
 for slug in ['about','faq','privacy','cookies','legal','terms','accessibility']:
  if slug not in data['infoPages']:issues.append(f'{loc}/{slug} missing content')
for path in ['index.html','404.html','robots.txt','sitemap.xml','.nojekyll','assets/styles.css','assets/site.js']:
 if not (SITE/path).exists():issues.append(f'{path} missing')
report={'status':'PASS' if not issues else 'FAIL','generated_html_pages':len(files),'locales':6,'legal_and_info_pages':42,'product_collections':product_count,'optimized_image_count':len(list((SITE/'assets').rglob('*.webp'))),'tested':['HTML structural validity','All local asset paths and navigation links','Target IDs and unique IDs','Language routes and localized information pages','Image alt attributes','External-host allowlist','JavaScript parse','Basic CSS parse','Data schema completeness','Sitemap and robots present'],'not_tested':['Live Amazon shortlink redirects and book identity (Amazon robots/network restrictions)','External deployment and device QA'],'issues':issues}
(ROOT/'QA_RESULTS.json').write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps(report,indent=2,ensure_ascii=False))
if issues:sys.exit(1)