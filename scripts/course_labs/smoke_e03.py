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
        page.set_default_timeout(30000)
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(url,wait_until='domcontentloaded')
        page.locator('.code-output img').first.wait_for(timeout=60000)
        assert page.locator('.code-output img').count()>=8,'Notebook real output images missing'
        assert page.get_by_text('V1.1 Improved Solution',exact=False).count()>=1,'V1.1 Notebook should be the default online lesson'
        assert page.locator('details.code-cell[open]').count()==0,'Notebook source must default folded'
        page.locator('button[data-tab="interact"]').click()
        frame=page.frame_locator('iframe')
        frame.locator('#status').wait_for()
        # Exercise every real JPEG used by the teaching selector. The source
        # must be a data URL and Canvas must allow getImageData without CORS.
        image_files=(
            '01_solidWhiteRight_straight_white.jpg',
            '03_project_curve_intro.jpg',
            '07_harder_curve_motorcycle.jpg',
            '08_harder_shadow_glare.jpg',
            '09_harder_curve_shadow.jpg',
        )
        for filename in image_files:
            frame.locator('#scene').select_option(filename)
            page.wait_for_function("""(file)=>{
                const w=document.querySelector('iframe')?.contentWindow;
                return w?.__e03Debug?.getLoadedImageName()===file;
            }""",arg=filename,timeout=30000)
            source=frame.locator('body').evaluate("()=>window.__e03Debug.getImageSource()")
            assert source.startswith('data:image/jpeg;base64,'),f'{filename}: image was not loaded from embedded data'
            readable=frame.locator('body').evaluate("()=>window.__e03Debug.readOriginalPixels()")
            assert readable,f'{filename}: original Canvas getImageData failed or returned empty pixels'
            for canvas_id in ('original','a','b','c'):
                populated=frame.locator(f'canvas#{canvas_id}').evaluate(
                    '(c)=>{const d=c.getContext("2d").getImageData(0,0,c.width,c.height).data;return d.some((v,i)=>i%4===3&&v>0)}')
                assert populated,f'{filename}: canvas {canvas_id} is blank'
        for kind in ('warp','curve','light'):
            frame.locator(f'button[data-exp="{kind}"]').click()
            frame.locator('#original').wait_for()
            page.wait_for_function("""()=>{const f=document.querySelector('iframe');const t=f?.contentDocument?.querySelector('#status')?.textContent||'';return !!t&&!t.startsWith('正在读取')}""",timeout=30000)
            for canvas_id in ('original','a','b','c'):
                populated=frame.locator(f'canvas#{canvas_id}').evaluate(
                    '(c)=>{const d=c.getContext("2d").getImageData(0,0,c.width,c.height).data;return d.some((v,i)=>i%4===3&&v>0)}')
                assert populated,f'{kind}: canvas {canvas_id} is blank'
            target_canvas={'warp':'b','curve':'b','light':'a'}[kind]
            before=frame.locator(f'#{target_canvas}').evaluate('(c)=>c.toDataURL()')
            frame.locator('input[type="range"]').first.evaluate(
                '(e,kind)=>{e.value=kind==="light"?e.max:String(Math.max(Number(e.min),Number(e.value)-7));e.dispatchEvent(new Event("input",{bubbles:true}))}',kind)
            after=frame.locator(f'#{target_canvas}').evaluate('(c)=>c.toDataURL()')
            assert before!=after,f'{kind}: parameter change did not update final output canvas'
        frame.locator('button[data-exp="time"]').click()
        frame.locator('#rawVideo').wait_for()
        frame.locator('#e03ImprovedCanvas').wait_for()
        frame.locator('#video-note').wait_for()
        frame.locator('#rawVideo').evaluate("""v=>new Promise((resolve,reject)=>{
            const timer=setTimeout(()=>reject(new Error('raw video metadata timeout; src='+v.currentSrc+' error='+(v.error?.code||'none')+' networkState='+v.networkState+' readyState='+v.readyState)),20000);
            const done=()=>{clearTimeout(timer);resolve()};
            if(v.readyState>=1){done();return}
            v.addEventListener('loadedmetadata',done,{once:true});
            v.addEventListener('error',()=>{clearTimeout(timer);reject(new Error('raw video failed to load: '+v.currentSrc))},{once:true});
        })""")
        frame.locator('#video-note').wait_for()
        page.wait_for_function("""()=>{const t=document.querySelector('iframe')?.contentWindow?.__e03Debug?.getTracks()?.scenes?.curve;return !!t?.frames?.length&&!!t?.improved_frames?.length}""",timeout=60000)
        for scene in ('straight','curve','complex'):
            frame.locator(f'button[data-clip="{scene}"]').click()
            frame.locator('#rawVideo').evaluate("""(v,expected)=>new Promise((resolve,reject)=>{
                const cleanup=()=>{v.removeEventListener('loadedmetadata',check);v.removeEventListener('loadeddata',check);v.removeEventListener('error',fail)};
                const check=()=>{if(v.readyState>=1&&v.videoWidth>0&&v.currentSrc.includes('E03_'+expected+'_input.webm')){cleanup();resolve()}};
                const fail=()=>{cleanup();reject(new Error('scene video failed to load: '+expected))};
                v.addEventListener('loadedmetadata',check);v.addEventListener('loadeddata',check);v.addEventListener('error',fail);
                check();
            })""",scene)
            assert f'E03_{scene}_input.webm' in frame.locator('#rawVideo').get_attribute('src')
            frame.locator('#e02Video').evaluate("""(v,expected)=>new Promise((resolve,reject)=>{
                const timer=setTimeout(()=>{cleanup();reject(new Error('E02 reference metadata timeout: '+expected+' src='+v.currentSrc))},20000);
                const check=()=>{if(v.readyState>=1&&v.videoWidth>0&&v.currentSrc.includes('E03_'+expected+'_e02.webm')){cleanup();resolve()}};
                const cleanup=()=>{clearTimeout(timer);v.removeEventListener('loadedmetadata',check);v.removeEventListener('loadeddata',check);v.removeEventListener('error',fail)};
                const fail=()=>{cleanup();reject(new Error('E02 reference video failed to load: '+expected))};
                v.addEventListener('loadedmetadata',check);v.addEventListener('loadeddata',check);v.addEventListener('error',fail);check();
            })""",scene)
            assert f'E03_{scene}_e02.webm' in frame.locator('#e02Video').get_attribute('src')
        debug=frame.locator('body').evaluate("""()=>({
            data:window.__e03Debug.getTracks().scenes.complex,
            alpha:window.__e03Debug.getAlpha()
        })""")
        frames=debug['data']['frames']
        improved_frames=debug['data']['improved_frames']
        assert len(improved_frames)==len(frames),'V1.1 per-frame tracks do not align with V1.0'
        assert any(f.get('valid') and f.get('left_curve_x') and f.get('right_curve_x') for f in improved_frames),'V1.1 has no real fitted curve samples'
        best_index,best_delta=-1,0
        for i in range(1,len(frames)):
            a,b=frames[i-1],frames[i]
            if a['valid'] and b['valid'] and a['left_x'] and b['left_x']:
                delta=max(max(abs(a['left_x'][j]-b['left_x'][j]),abs(a['right_x'][j]-b['right_x'][j])) for j in range(3))
                if delta>best_delta:best_index,best_delta=i,delta
        assert best_index>=1 and best_delta>1.5,'No changing valid curve pair available to test EMA effect'
        fps=debug['data']['fps']
        frame.locator('#rawVideo').evaluate("""(v,t)=>new Promise((resolve,reject)=>{
            v.pause();
            const timer=setTimeout(()=>reject(new Error('raw video seek timeout at '+t)),15000);
            const done=()=>{clearTimeout(timer);requestAnimationFrame(()=>resolve())};
            if(!v.seeking&&Math.abs(v.currentTime-t)<.02&&v.readyState>=2)return done();
            v.addEventListener('seeked',done,{once:true});
            v.currentTime=t;
        })""",best_index/fps)
        page.wait_for_function("""()=>{const c=document.querySelector('iframe')?.contentDocument?.querySelector('#e03ImprovedCanvas');return !!c&&c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v>0)}""",timeout=30000)
        baseline_before=frame.locator('#e03Canvas').evaluate('(c)=>c.toDataURL()')
        improved_before=frame.locator('#e03ImprovedCanvas').evaluate('(c)=>c.toDataURL()')
        assert baseline_before!=improved_before,'V1.0 and V1.1 canvases should show separate overlays'
        frame.locator('input[type="range"]').first.evaluate(
            '(e)=>{e.value="25";e.dispatchEvent(new Event("input",{bubbles:true}))}')
        low=frame.locator('#e03Canvas').evaluate('(c)=>c.toDataURL()')
        frame.locator('input[type="range"]').first.evaluate(
            '(e)=>{e.value="90";e.dispatchEvent(new Event("input",{bubbles:true}))}')
        high=frame.locator('#e03Canvas').evaluate('(c)=>c.toDataURL()')
        assert low!=high,'Changing alpha did not change the actual E03 video overlay pixels'
        synced=frame.locator('body').evaluate("""()=>Math.abs(document.getElementById('rawVideo').currentTime-document.getElementById('e02Video').currentTime)""")
        assert synced<.20,f'E02 reference video lost synchronization: {synced:.3f}s'
        page.locator('button[data-tab="download"]').click()
        assert page.locator('a[href$="MVAI_E03_Lab.zip"]').count()>=1
        if errors:raise RuntimeError('JS page errors: '+str(errors))
        browser.close()
    print('E03 Chromium PASS: 4 canvases per image mode, parameter-driven image updates, 3 synchronized video scenes, alpha changes rendered overlay pixels.')
finally:
    srv.shutdown()
