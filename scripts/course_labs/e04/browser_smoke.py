"""Real Chromium/WASM smoke using ephemeral ONNX exports, NOT teaching footage."""
import functools, http.server, threading, sys, shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
root=Path(sys.argv[1]).resolve()
frames=root/'e04-media'/'frames'; frames.mkdir(parents=True,exist_ok=True)
# Synthetic QA image only. No teaching claims about detections.
for key in ('A1','A3','B1','B3','C1','C3','A2','B2','C2'):
    im=Image.new('RGB',(1280,720),(111,132,155)); d=ImageDraw.Draw(im)
    d.polygon([(540,280),(740,280),(1280,720),(0,720)],fill=(55,55,55))
    d.rectangle((575,390,705,485),fill=(220,220,220));im.save(frames/(key+'.jpg'))
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1280,'height':900})
        errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(f'http://127.0.0.1:{server.server_port}/interactive/e04.html')
        page.locator('#leftFig[data-ready="1"]').wait_for(timeout=15000)
        page.select_option('#backend','wasm');page.select_option('#size','320')
        page.click('#run')
        page.locator('#rightFig[data-ready="1"]').wait_for(timeout=180000)
        assert '真实模型推理完成' in page.locator('#status').inner_text()
        assert 'wasm' in page.locator('#rightCaption').inner_text()
        assert page.locator('#right').evaluate('(c)=>{const d=c.getContext("2d").getImageData(0,0,c.width,c.height).data;return d.some((v,i)=>i%4!==3&&v!==0)}')
        page.locator('#conf').evaluate("(e)=>{e.value=.8;e.dispatchEvent(new Event('input',{bubbles:true}))}")
        assert page.locator('#confVal').inner_text()=='0.80'
        page.click('[data-tab="3"]')
        page.locator('#offset').evaluate("(e)=>{e.value=0;e.dispatchEvent(new Event('input',{bubbles:true}))}")
        assert '1.000' in page.locator('#geoIou').inner_text()
        page.locator('#offset').evaluate("(e)=>{e.value=140;e.dispatchEvent(new Event('input',{bubbles:true}))}")
        assert '0.000' in page.locator('#geoIou').inner_text()
        page.click('[data-tab="4"]')
        page.locator('#leftFig[data-ready="1"]').wait_for(timeout=15000)
        page.select_option('#size','320');page.select_option('#sizeB','320')
        page.click('#compare')
        page.wait_for_function("document.getElementById('rightCaption').textContent.includes('yolo26s')",timeout=180000)
        page.wait_for_function("!document.getElementById('compare').disabled",timeout=30000)
        assert 'yolo26n' in page.locator('#leftCaption').inner_text()
        assert not errors, errors
        browser.close()
        print('Chromium WASM actual model forward, nonempty canvas, IoU geometry and dual-model compare: PASS')
finally:
    server.shutdown()
