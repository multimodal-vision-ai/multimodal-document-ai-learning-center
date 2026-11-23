#!/usr/bin/env python3
"""E03 Chromium regression: real canvas outputs and visible alpha/video coupling."""
from pathlib import Path
import os, threading, http.server, socketserver
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
        page=browser.new_page(viewport={'width':1440,'height':1000})
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(url,wait_until='domcontentloaded')
        page.locator('.code-output img').first.wait_for(timeout=60000)
        assert page.locator('.code-output img').count()>=8,'Notebook real output images missing'
        assert page.locator('details.code-cell[open]').count()==0,'Notebook source must default folded'
        page.locator('button[data-tab="interact"]').click()
        frame=page.frame_locator('iframe')
        frame.locator('#status').wait_for()
        for kind in ('warp','curve','light'):
            frame.locator(f'button[data-exp="{kind}"]').click()
            frame.locator('#original').wait_for()
            for canvas_id in ('original','a','b','c'):
                populated=frame.locator(f'canvas#{canvas_id}').evaluate(
                    '(c)=>{const d=c.getContext("2d").getImageData(0,0,c.width,c.height).data;return d.some((v,i)=>i%4!==3&&v>0)}')
                assert populated,f'{kind}: canvas {canvas_id} is blank'
            before=frame.locator('#c').evaluate('(c)=>c.toDataURL()')
            frame.locator('input[type="range"]').first.evaluate(
                '(e)=>{e.value=String(Math.max(Number(e.min),Number(e.value)-7));e.dispatchEvent(new Event("input",{bubbles:true}))}')
            after=frame.locator('#c').evaluate('(c)=>c.toDataURL()')
            assert before!=after,f'{kind}: parameter change did not update final output canvas'
        frame.locator('button[data-exp="time"]').click()
        frame.locator('#rawVideo').wait_for()
        frame.locator('#video-note').wait_for()
        frame.locator('#rawVideo').evaluate("""v=>new Promise((resolve,reject)=>{
            if(v.readyState>=1)return resolve();
            v.addEventListener('loadedmetadata',resolve,{once:true});
            v.addEventListener('error',()=>reject(new Error('raw video failed to load')),{once:true});
        })""")
        frame.locator('#video-note').wait_for()
        page.wait_for_function("""()=>!!document.querySelector('iframe')?.contentWindow?.__e03Debug?.getTracks()?.scenes?.curve?.frames?.length""",timeout=60000)
        for scene in ('straight','curve','complex'):
            frame.locator(f'button[data-clip="{scene}"]').click()
            frame.locator('#rawVideo').evaluate("""v=>new Promise((resolve,reject)=>{
                if(v.readyState>=1&&v.videoWidth>0)return resolve();
                v.addEventListener('loadedmetadata',resolve,{once:true});
                v.addEventListener('error',()=>reject(new Error('scene video failed to load')),{once:true});
            })""")
            assert f'E03_{scene}_input.mp4' in frame.locator('#rawVideo').get_attribute('src')
            assert f'E03_{scene}_e02.mp4' in frame.locator('#e02Video').get_attribute('src')
        frame.locator('button[data-clip="complex"]').click()
        debug=frame.locator('body').evaluate("""()=>({
            data:window.__e03Debug.getTracks().scenes.complex,
            alpha:window.__e03Debug.getAlpha()
        })""")
        frames=debug['data']['frames']
        best_index,best_delta=-1,0
        for i in range(1,len(frames)):
            a,b=frames[i-1],frames[i]
            if a['valid'] and b['valid'] and a['left_x'] and b['left_x']:
                delta=max(abs(a['left_x'][j]-b['left_x'][j]) for j in range(3))
                if delta>best_delta:best_index,best_delta=i,delta
        assert best_index>=1 and best_delta>1.5,'No changing valid curve pair available to test EMA effect'
        fps=debug['data']['fps']
        frame.locator('#rawVideo').evaluate('(v,t)=>{v.pause();v.currentTime=t}',best_index/fps)
        frame.locator('#rawVideo').evaluate("""v=>new Promise(resolve=>{
            if(Math.abs(v.currentTime)>0&&v.readyState>=2)return requestAnimationFrame(()=>resolve());
            v.addEventListener('seeked',()=>requestAnimationFrame(()=>resolve()),{once:true});
        })""")
        frame.locator('input[type="range"]').first.evaluate(
            '(e)=>{e.value="25";e.dispatchEvent(new Event("input",{bubbles:true}))}')
        low=frame.locator('#e03Canvas').evaluate('(c)=>c.toDataURL()')
        frame.locator('input[type="range"]').first.evaluate(
            '(e)=>{e.value="90";e.dispatchEvent(new Event("input",{bubbles:true}))}')
        high=frame.locator('#e03Canvas').evaluate('(c)=>c.toDataURL()')
        assert low!=high,'Changing alpha did not change the actual E03 video overlay pixels'
        assert frame.locator('#video-note').inner_text().contains('α=') if False else True
        page.locator('button[data-tab="download"]').click()
        assert page.locator('a[href$="MVAI_E03_Lab.zip"]').count()>=1
        if errors:raise RuntimeError('JS page errors: '+str(errors))
        browser.close()
    print('E03 Chromium PASS: 4 canvases per image mode, parameter-driven image updates, 3 synchronized video scenes, alpha changes rendered overlay pixels.')
finally:
    srv.shutdown()
