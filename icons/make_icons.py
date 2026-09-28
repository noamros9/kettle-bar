from playwright.sync_api import sync_playwright
def svg(rounded):
    bg = '<rect width="512" height="512" rx="%d" fill="#2346D5"/>' % (112 if rounded else 0)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">{bg}
<rect x="78" y="182" width="356" height="24" rx="12" fill="#9FB2FF"/>
<path d="M174 290 V200 Q174 138 236 138 H276 Q338 138 338 200 V290" fill="none" stroke="#F4F5F2" stroke-width="32" stroke-linejoin="round"/>
<clipPath id="c"><rect x="0" y="0" width="512" height="408"/></clipPath>
<circle cx="256" cy="316" r="116" fill="#F4F5F2" clip-path="url(#c)"/>
<rect x="176" y="398" width="160" height="12" rx="6" fill="#F4F5F2"/>
</svg>'''
out = {'icon-512.png':(512,True),'icon-192.png':(192,True),'maskable-512.png':(512,False),'maskable-192.png':(192,False),'apple-touch-icon.png':(180,False),'icon-32.png':(32,True)}
with sync_playwright() as p:
    b=p.chromium.launch()
    for name,(size,rounded) in out.items():
        pg=b.new_page(viewport={'width':size,'height':size})
        pg.set_content(f'<html><body style="margin:0;background:transparent">{svg(rounded).replace("<svg ","<svg width=%d height=%d " % (size,size))}</body></html>')
        pg.screenshot(path=f'{name}', omit_background=True)
    b.close()
open('icon.svg','w').write(svg(True))
