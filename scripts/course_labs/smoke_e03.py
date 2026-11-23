#!/usr/bin/env python3
"""E03 real Chromium checks on generated MkDocs site; avoids main/deployed URLs."""
from pathlib import Path
import os,threading,http.server,socketserver
from playwright.sync_api import sync_playwright
root=Path(os.environ.get('RUNNER_TEMP','/tmp'))/'dev-site'
assert (root/'resources/course-labs/intelligent-perception/e03-notebook.html').is_file()
class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(root),**kwargs)
    def log_message(self,*args):pass
class Server(socketserver.ThreadingMixIn,http.server.HTTPServer):daemon_threads=True
srv=Server(('127.0.0.1',0),Handler)
threading.Thread(target=srv.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{srv.server_port}/resources/course-labs/intelligent-perception/e03-notebook.html'
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        page=browser.new_page(viewport={'width':1280,'height':900})
        errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(url,wait_until='domcontentloaded');page.locator('.code-output img').first.wait_for(timeout=60000)
        assert page.locator('.code-output img').count()>=8,'Notebook real output images missing'
        assert page.locator('details.code-cell[open]').count()==0,'Code must default folded'
        page.locator('button[data-tab="interact"]').click()
        frame=page.frame_locator('iframe')
        frame.locator('#status').wait_for()
        for kind in ('warp','curve','light','time'):
            frame.locator(f'button[data-exp="{kind}"]').click()
            if kind=='time':
                frame.locator('#video').wait_for()
                frame.locator('button[data-clip="complex"]').click()
                assert 'complex' in frame.locator('#video').get_attribute('src')
            else:
                frame.locator('#original').wait_for()
                assert frame.locator('canvas#original').evaluate('(c)=>c.getContext("2d").getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4!==3&&v>0)')
        page.locator('button[data-tab="download"]').click()
        assert page.locator('a[href$="MVAI_E03_Lab.zip"]').count()>=1
        if errors:raise RuntimeError('JS page errors: '+str(errors))
        browser.close()
    print('E03 Chromium PASS: 4 interactive modes, notebook PNG outputs, three-scene selector, downloads')
finally:srv.shutdown()