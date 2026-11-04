#!/usr/bin/env python3
"""Exercise the real adapter in a local Chrome WebGPU session; no private images."""
import argparse
import asyncio
import base64
import http.server
import json
import os
import re
from pathlib import Path
import signal
import subprocess
import tempfile
import threading
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

import websockets


class Server(http.server.SimpleHTTPRequestHandler):
    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (BrokenPipeError, ConnectionResetError):
            # The runtime cancels its one-byte metadata requests after reading headers.
            pass

    def translate_path(self, path):
        parts = urllib.parse.unquote(urllib.parse.urlparse(path).path).strip('/').split('/')
        root = self.server.roots.get(parts[0])
        if root is None or any(p.startswith('.') for p in parts[1:]):
            return '/__not_found__'
        relative = parts[2:] if parts[0] == 'model' and len(parts) > 1 and parts[1] == 'checkpoint' else parts[1:]
        candidate = root.joinpath(*relative).resolve()
        return str(candidate) if candidate.is_relative_to(root) else '/__not_found__'

    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        super().end_headers()

    def log_message(self, *_):
        pass


class CDP:
    def __init__(self, socket):
        self.socket, self.pending, self.events, self.counter = socket, {}, [], 0

    async def listen(self):
        async for raw in self.socket:
            msg = json.loads(raw)
            if 'id' in msg:
                future = self.pending.pop(msg['id'], None)
                if future:
                    future.set_result(msg)
            elif len(self.events) < 300:
                self.events.append(msg)

    async def call(self, method, **params):
        self.counter += 1
        future = asyncio.get_running_loop().create_future()
        self.pending[self.counter] = future
        await self.socket.send(json.dumps(dict(id=self.counter, method=method, params=params)))
        result = await future
        if 'error' in result:
            raise RuntimeError(result['error'])
        return result['result']

    async def evaluate(self, expression):
        result = await self.call('Runtime.evaluate', expression=expression, awaitPromise=True, returnByValue=True)
        if 'exceptionDetails' in result:
            raise RuntimeError(result['exceptionDetails'])
        return result.get('result', {}).get('value')


def gpu_processes(browser_pid):
    rows = subprocess.check_output(['ps', '-eo', 'pid=,ppid='], text=True)
    parents = dict(tuple(map(int, row.split())) for row in rows.splitlines())
    owned = {browser_pid}
    while True:
        children = {pid for pid, parent in parents.items() if parent in owned}
        if children <= owned: break
        owned |= children
    tree = ET.fromstring(subprocess.check_output(['nvidia-smi', '-q', '-x'], text=True))
    return [{'pci_bus': gpu.findtext('pci/pci_bus_id'), 'pid': int(process.findtext('pid')),
             'memory': process.findtext('used_memory')}
            for gpu in tree.findall('gpu') for process in gpu.findall('processes/process_info')
            if process.findtext('pid', '').isdigit() and int(process.findtext('pid')) in owned]


async def run(args):
    roots = {'app': args.page_dir.resolve(), 'model': args.model_dir.resolve(),
             'hf-spaces': Path(__file__).resolve().parents[3],
             'runtime': args.runtime_dir.resolve()}
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Server)
    server.roots = roots
    threading.Thread(target=server.serve_forever, daemon=True).start()
    origin = f'http://127.0.0.1:{server.server_port}'
    url_opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    args.output.mkdir(parents=True, exist_ok=True)
    report = {'started_at': time.strftime('%Y-%m-%dT%H:%M:%S%z'), 'browser': str(args.browser),
              'browser_args':args.browser_arg, 'hardware_backend': args.backend, 'private_data_used': False, 'success': False}
    with tempfile.TemporaryDirectory(prefix='wang-onnx-browser-') as profile:
        flags = [str(args.browser), '--headless=new', '--no-sandbox', '--disable-gpu-sandbox',
                 '--enable-unsafe-webgpu', '--ignore-gpu-blocklist', '--disable-dev-shm-usage',
                 '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0',
                 '--user-data-dir=' + profile]
        if args.backend == 'vulkan':
            flags += ['--use-angle=vulkan', '--enable-features=Vulkan', '--disable-vulkan-surface']
        else:
            flags += ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
        flags += ['about:blank']
        flags[1:1] = args.browser_arg
        with (args.output / 'chrome.log').open('w') as log:
            browser = subprocess.Popen(flags, stdout=log, stderr=log, start_new_session=True)
            try:
                port_file = Path(profile) / 'DevToolsActivePort'
                for _ in range(200):
                    if port_file.is_file():
                        break
                    if browser.poll() is not None:
                        raise RuntimeError('Chrome exited before its debugging endpoint was ready')
                    await asyncio.sleep(.1)
                port = port_file.read_text().splitlines()[0]
                pages = json.load(url_opener.open(f'http://127.0.0.1:{port}/json'))
                async with websockets.connect(pages[0]['webSocketDebuggerUrl'], proxy=None, max_size=32 << 20) as socket:
                    cdp = CDP(socket)
                    listener = asyncio.create_task(cdp.listen())
                    try:
                        await cdp.call('Runtime.enable')
                        await cdp.call('Page.enable')
                        await cdp.call('Emulation.setDeviceMetricsOverride', width=1440, height=1000, deviceScaleFactor=1, mobile=False)
                        await cdp.call('Page.navigate', url=origin + '/app/index.html')
                        for _ in range(100):
                            if await cdp.evaluate('!!window.wangDemo'):
                                break
                            await asyncio.sleep(.1)
                        report['gpu'] = await cdp.evaluate("""(async()=>{
                          const a=await navigator.gpu?.requestAdapter();
                          return a?{available:true,vendor:a.info.vendor,architecture:a.info.architecture,
                            device:a.info.device,description:a.info.description,features:[...a.features],
                            maxBufferSize:a.limits.maxBufferSize,maxStorageBufferBindingSize:a.limits.maxStorageBufferBindingSize}: {available:false};
                        })()""")
                        print(json.dumps({'gpu':report['gpu']}), flush=True)
                        if not report['gpu']['available']:
                            raise RuntimeError('Chrome could not obtain a WebGPU adapter')
                        if args.gpu_index is not None:
                            expected = subprocess.check_output([
                                'nvidia-smi', '-i', str(args.gpu_index), '--query-gpu=pci.bus_id',
                                '--format=csv,noheader'], text=True).strip().upper()
                            await cdp.evaluate('''(async()=>{const a=await navigator.gpu.requestAdapter();
                              window.wangProbeDevice=await a.requestDevice();
                              wangProbeDevice.queue.submit([wangProbeDevice.createCommandEncoder().finish()]);
                              await wangProbeDevice.queue.onSubmittedWorkDone();})()''')
                            for _ in range(20):
                                bindings = gpu_processes(browser.pid)
                                if bindings: break
                                await asyncio.sleep(.25)
                            report['physical_gpu_check'] = {'requested_index': args.gpu_index, 'expected_pci': expected, 'bindings': bindings}
                            visible = subprocess.check_output(['nvidia-smi', '--query-gpu=pci.bus_id', '--format=csv,noheader'], text=True).upper().split()
                            isolated = visible == [expected]
                            report['physical_gpu_check']['single_visible_gpu'] = isolated
                            vulkan_matches = False
                            if args.vulkaninfo:
                                details = subprocess.check_output([str(args.vulkaninfo)], text=True, stderr=subprocess.DEVNULL, timeout=30)
                                values = {key: re.findall(r'\b' + key + r'\s*=\s*(\d+)', details)
                                          for key in ['pciDomain', 'pciBus', 'pciDevice', 'pciFunction']}
                                if all(len(value) == 1 for value in values.values()):
                                    domain, bus, slot, function = [int(values[key][0]) for key in values]
                                    pci = f'{domain:08X}:{bus:02X}:{slot:02X}.{function}'
                                    report['physical_gpu_check']['sole_vulkan_device_pci'] = pci
                                    vulkan_matches = pci == expected and report['gpu']['vendor'] == 'nvidia'
                            if not vulkan_matches and ((not bindings and not isolated) or any(row['pci_bus'].upper() != expected for row in bindings)):
                                raise RuntimeError('Browser GPU binding did not match the authorized physical GPU; model not loaded')
                            await cdp.evaluate('wangProbeDevice.destroy()')
                        settings = {'modelId': 'checkpoint', 'runtime': {
                            'modelHost': origin + '/model/',
                            'ortUrl': origin + '/runtime/ort/dist/ort.webgpu.bundle.min.mjs',
                            'wasmPaths': origin + '/runtime/ort/dist/',
                            'transformersUrl': origin + '/runtime/transformers/dist/transformers.web.min.js',
                        }}
                        operation = asyncio.create_task(cdp.evaluate('window.wangDemo.load(' + json.dumps(settings) + ')'))
                        started = time.monotonic()
                        while not operation.done():
                            if time.monotonic() - started > args.timeout:
                                raise TimeoutError('Model loading exceeded the configured time limit')
                            done, _ = await asyncio.wait([operation], timeout=15)
                            if not done:
                                print(await cdp.evaluate("document.getElementById('status').textContent"), flush=True)
                        report['runtime'] = await operation
                        if args.gpu_index is not None and not isolated:
                            loaded_bindings = gpu_processes(browser.pid)
                            baseline = {row['pci_bus']: int(row['memory'].split()[0]) for row in bindings}
                            report['physical_gpu_check']['loaded_bindings'] = loaded_bindings
                            if any(row['pci_bus'].upper() != expected and int(row['memory'].split()[0]) > baseline.get(row['pci_bus'], 0) + 16 for row in loaded_bindings):
                                raise RuntimeError('Unexpected model allocation on another physical GPU; generation not started')
                        report['load_seconds'] = time.monotonic() - started
                        report['synthetic_text'] = ['WANG OCR TEST', 'Invoice No: 1024']
                        input_url = 'data:image/png;base64,' + base64.b64encode(args.image.read_bytes()).decode()
                        await cdp.evaluate('document.getElementById("image").src=' + json.dumps(input_url))
                        (args.output / 'input.png').write_bytes(base64.b64decode(input_url.split(',')[1]))
                        operation = asyncio.create_task(cdp.evaluate('window.wangDemo.recognize(' + json.dumps(input_url) + ',{maxNewTokens:' + str(args.max_new_tokens) + '})'))
                        started = time.monotonic()
                        while not operation.done():
                            if time.monotonic() - started > args.timeout:
                                await cdp.evaluate('document.getElementById("stop").click()')
                                raise TimeoutError('Generation exceeded the configured time limit')
                            done, _ = await asyncio.wait([operation], timeout=15)
                            if not done:
                                print(await cdp.evaluate("document.getElementById('metrics').textContent"), flush=True)
                        report['result'] = await operation
                        report['success'] = bool(report['result']['ended'] and all(t in report['result']['text'] for t in report['synthetic_text']))
                        (args.output / 'output.doctags').write_text(report['result']['text'])
                        report['warm_result'] = await cdp.evaluate('window.wangDemo.recognize(' + json.dumps(input_url) + ',{maxNewTokens:' + str(args.max_new_tokens) + '})')
                        report['repeat_identical'] = report['result']['text'] == report['warm_result']['text']
                        report['success'] &= report['repeat_identical']
                        shot = await cdp.call('Page.captureScreenshot', format='png')
                        (args.output / 'screenshot.png').write_bytes(base64.b64decode(shot['data']))
                        await cdp.call('Emulation.setDeviceMetricsOverride', width=390, height=844, deviceScaleFactor=1, mobile=True)
                        report['mobile_no_horizontal_overflow'] = await cdp.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
                        report['success'] &= report['mobile_no_horizontal_overflow']
                        shot = await cdp.call('Page.captureScreenshot', format='png', captureBeyondViewport=True)
                        (args.output / 'screenshot-mobile.png').write_bytes(base64.b64decode(shot['data']))
                        await cdp.call('Emulation.setDeviceMetricsOverride', width=1440, height=1000, deviceScaleFactor=1, mobile=False)
                        interrupted = await cdp.evaluate('(async()=>{const p=window.wangDemo.recognize(' + json.dumps(input_url) + ',{maxNewTokens:12288});setTimeout(()=>document.getElementById("stop").click(),10);return p;})()')
                        report['stop_test'] = {'ended':interrupted['ended'],'generatedTokens':interrupted['generatedTokens']}
                        report['success'] &= not interrupted['ended'] and interrupted['generatedTokens'] < report['result']['generatedTokens']
                    except Exception as error:
                        report['success'] = False
                        report['error'] = str(error)
                        print(str(error), flush=True)
                    finally:
                        try:
                            shot = await cdp.call('Page.captureScreenshot', format='png')
                            (args.output / ('screenshot-final.png' if (args.output/'screenshot.png').exists() else 'screenshot.png')).write_bytes(base64.b64decode(shot['data']))
                        except Exception:
                            pass
                        report['browser_events'] = cdp.events
                        listener.cancel()
            finally:
                os.killpg(browser.pid, signal.SIGTERM)
                browser.wait(timeout=15)
                server.shutdown()
                server.server_close()
                (args.output / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps({'success': report['success'], 'error': report.get('error'), 'load_seconds': report.get('load_seconds'), 'seconds': report.get('result', {}).get('seconds'), 'warm_seconds': report.get('warm_result', {}).get('seconds'), 'stop_test': report.get('stop_test')}, ensure_ascii=False), flush=True)
    return report['success']


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--browser', type=Path, required=True)
    p.add_argument('--model-dir', type=Path, required=True)
    p.add_argument('--runtime-dir', type=Path, required=True)
    p.add_argument('--page-dir', type=Path, default=Path(__file__).resolve().parents[4]/'project-notes'/'ocr-wang-qwen35-local-test')
    p.add_argument('--output', type=Path, required=True)
    p.add_argument('--image', type=Path, default=Path(__file__).resolve().parent/'validation'/'input.png')
    p.add_argument('--backend', choices=['vulkan','swiftshader'], default='vulkan')
    p.add_argument('--timeout', type=int, default=900)
    p.add_argument('--max-new-tokens', type=int, default=256)
    p.add_argument('--browser-arg', action='append', default=[])
    p.add_argument('--gpu-index', type=int)
    p.add_argument('--vulkaninfo', type=Path)
    raise SystemExit(0 if asyncio.run(run(p.parse_args())) else 1)
