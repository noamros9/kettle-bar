from playwright.sync_api import sync_playwright
BODY = """<rect x="86" y="160" width="340" height="22" rx="11" fill="#9FB2FF"/>
<g fill="none" stroke="#F4F5F2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="184,171 146,246 214,226" stroke-width="30"/><polyline points="328,171 366,246 298,226" stroke-width="30"/>
<line x1="256" y1="222" x2="256" y2="318" stroke-width="66"/>
<polyline points="238,322 222,372 238,420" stroke-width="32"/><polyline points="274,322 290,372 274,420" stroke-width="32"/>
</g><circle cx="256" cy="136" r="40" fill="#F4F5F2"/>"""
def svg(rounded):
    bg = '<rect width="512" height="512" rx="%d" fill="#2346D5"/>' % (112 if rounded else 0)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">{bg}{BODY}</svg>'
out = {'icon-512.png':(512,True),'icon-192.png':(192,True),'maskable-512.png':(512,False),'maskable-192.png':(192,False),'apple-touch-icon.png':(180,False),'icon-32.png':(32,True)}
with sync_playwright() as p:
    b=p.chromium.launch()
    for name,(size,rounded) in out.items():
        pg=b.new_page(viewport={'width':size,'height':size})
        pg.set_content(f'<html><body style="margin:0;background:transparent">{svg(rounded).replace("<svg ","<svg width=%d height=%d " % (size,size))}</body></html>')
        pg.screenshot(path=f'{name}', omit_background=True)
    b.close()
open('icon.svg','w').write(svg(True))
