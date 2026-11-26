"""Run only on the exact staged teacher-approved package. No synthetic media."""
import functools, http.server, threading, sys, json
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve()
assert (root/'e04-media/data/detections.json').is_file()
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start()
def wait(page):
    page.wait_for_function("!document.getElementById('run').disabled",timeout=180000)
    assert '真实模型推理完成' in page.locator('#status').inner_text(),page.locator('#status').inner_text()
    assert page.locator('#rightFig').get_attribute('data-ready')=='1'
def slide(page,id,v):
    page.locator('#'+id).evaluate("(e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))}",str(v))
def count(page):
    return page.locator('#results tr').count()
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1280,'height':900})
        errors=[]; page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(f'http://127.0.0.1:{server.server_port}/interactive/e04.html')
        page.select_option('#backend','wasm')
        page.click('[data-tab="2"]');page.locator('#leftFig[data-ready="1"]').wait_for()
        page.click('#run');wait(page)
        page.locator('#road').uncheck()
        slide(page,'conf',.25);low=count(page)
        slide(page,'conf',.5);high=count(page)
        assert low>=1 and high<low, (low,high,'C1 expected threshold effect')
        print('C1 real browser count .25 -> .50:',low,high)
        page.click('[data-tab="3"]');page.locator('#leftFig[data-ready="1"]').wait_for()
        slide(page,'conf',.05);page.click('#run');wait(page)
        slide(page,'iou',.3);lo=count(page)
        slide(page,'iou',.7);hi=count(page)
        assert hi>lo,(lo,hi,'B1 expected NMS effect')
        print('B1 real browser count .30 -> .70:',lo,hi)
        page.click('[data-tab="4"]');page.locator('#leftFig[data-ready="1"]').wait_for()
        slide(page,'conf',.25);slide(page,'iou',.5)
        page.select_option('#size','320');page.select_option('#sizeB','640')
        page.click('#compare');wait(page)
        assert 'yolo26n' in page.locator('#leftCaption').inner_text()
        assert 'yolo26s' in page.locator('#rightCaption').inner_text()
        print('A3 actual dual configuration:',page.locator('#leftCaption').inner_text(),page.locator('#rightCaption').inner_text())
        page.click('[data-tab="5"]');page.select_option('#size','320')
        video_report={}
        for scene in 'ABC':
            page.select_option('#videoChoice',scene)
            page.wait_for_function("document.getElementById('video').readyState>=2",timeout=30000)
            assert abs(page.locator('#video').evaluate('(v)=>v.duration')-12)<.1
            page.click('#frameRun');wait(page)
            print(scene,'first-frame real inference',page.locator('#rightCaption').inner_text())
            page.click('#scan');wait(page)
            rows=page.locator('#timeline tr').all_inner_texts()
            assert len(rows)==24,(scene,len(rows),page.locator('#status').inner_text())
            parsed=[]
            for row in rows:
                t,car,person,bike,ms=row.split('\t') if '\t' in row else row.splitlines()
                parsed.append({'time_s':float(t.rstrip('s')),'car':int(car),'person':int(person),'bicycle':int(bike),'forward_ms':float(ms.replace(' ms',''))})
            assert [x['time_s'] for x in parsed]==[i*.5 for i in range(24)]
            assert page.locator('#chart polyline').count()==3
            video_report[scene]=parsed
            page.locator('#timeline tr').nth(10).locator('button').click();wait(page)
            assert abs(page.locator('#video').evaluate('(v)=>v.currentTime')-5)<.08
            print(scene,'24 actual frames, time-point seek passed',flush=True)
        report=root/'e04-media/data/browser-video-validation.json'
        report.write_text(json.dumps({'model':'yolo26n','size':320,'backend':'wasm','conf':.25,'iou':.5,'nms':True,'road_only':False,'sample_hz':2,'frames':video_report},indent=2),encoding='utf-8')
        print('E04 real video verification: 72 actual model forwards, 3 timelines, seek passed',flush=True)
        assert not errors,errors
        browser.close()
finally:
    server.shutdown()
