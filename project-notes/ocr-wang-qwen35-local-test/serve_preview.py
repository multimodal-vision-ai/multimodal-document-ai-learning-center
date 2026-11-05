#!/usr/bin/env python3
"""Serve the Wang preview with optional local model/runtime files on loopback."""
import argparse
from datetime import datetime, timezone
import http.server
import json
from pathlib import Path
import re
import threading
from urllib.parse import unquote, urlsplit

PAGE = '/project-notes/ocr-wang-qwen35-local-test/'


class Preview(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        super().end_headers()

    def route(self):
        path = unquote(urlsplit(self.path).path)
        for prefix, root in [('/local-model/checkpoint/', self.server.model_root),
                             ('/local-runtime/', self.server.runtime_root)]:
            if path.startswith(prefix):
                relative = Path(path[len(prefix):])
                break
        else:
            root = self.server.repo_root
            relative = Path(path.lstrip('/'))
        if any(part.startswith('.') for part in relative.parts): return None
        target = (root / relative).resolve()
        return target if target.is_relative_to(root) else None

    def send_head(self):
        path = unquote(urlsplit(self.path).path)
        if path in [PAGE, PAGE + 'index.html']:
            origin = 'http://' + self.headers['Host']
            config = {
                'sourceLabel': '服务器现有文件（通过端口转发传输，推理仍使用你的电脑显卡）',
                'diagnosticsUrl': '/_preview/diagnostics',
                'adapterOptions': {'modelId': 'checkpoint', 'runtime': {
                    'useBrowserCache': True,
                    'modelHost': origin + '/local-model/',
                    'ortUrl': origin + '/local-runtime/ort/dist/ort.webgpu.bundle.min.mjs',
                    'wasmPaths': origin + '/local-runtime/ort/dist/',
                    'transformersUrl': origin + '/local-runtime/transformers/dist/transformers.web.min.js',
                }},
            }
            html = (self.server.repo_root / PAGE.strip('/') / 'index.html').read_text()
            html = html.replace('<script type="module"', '<script>window.WANG_PREVIEW_CONFIG=' + json.dumps(config, ensure_ascii=False) + ';</script>\n<script type="module"', 1)
            data = html.encode()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(data)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            import io
            self.byte_range = None
            return io.BytesIO(data)
        target = self.route()
        if target is None or not target.is_file():
            self.send_error(404)
            return None
        stream = target.open('rb')
        size = target.stat().st_size
        start, end, partial = 0, size - 1, False
        if header := self.headers.get('Range'):
            match = re.fullmatch(r'bytes=(\d*)-(\d*)', header)
            if match and any(match.groups()):
                left, right = match.groups()
                if left:
                    start = int(left); end = min(int(right), end) if right else end
                else:
                    start = max(0, size - int(right))
                partial = 0 <= start <= end < size
            if not partial:
                stream.close()
                self.send_response(416)
                self.send_header('Content-Range', f'bytes */{size}')
                self.send_header('Content-Length', '0')
                self.end_headers()
                return None
        self.send_response(206 if partial else 200)
        self.send_header('Content-Type', self.guess_type(str(target)))
        self.send_header('Content-Length', str(end - start + 1))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Last-Modified', self.date_time_string(target.stat().st_mtime))
        if partial: self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.end_headers()
        stream.seek(start)
        self.byte_range = end - start + 1
        return stream

    def copyfile(self, source, output):
        try:
            remaining = getattr(self, 'byte_range', None)
            while remaining is None or remaining > 0:
                data = source.read(1 << 20 if remaining is None else min(1 << 20, remaining))
                if not data: break
                output.write(data)
                if remaining is not None: remaining -= len(data)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def do_POST(self):
        if urlsplit(self.path).path != '/_preview/diagnostics':
            self.send_error(404); return
        length = int(self.headers.get('Content-Length', '0'))
        if not 0 < length <= 16384:
            self.send_error(413); return
        try:
            diagnostic = json.loads(self.rfile.read(length))
            if not isinstance(diagnostic, dict): raise ValueError()
        except (ValueError, UnicodeDecodeError):
            self.send_error(400); return
        diagnostic['receivedAtUtc'] = datetime.now(timezone.utc).isoformat()
        with self.server.log_lock:
            with self.server.diagnostics.open('a') as f:
                f.write(json.dumps(diagnostic, ensure_ascii=False) + '\n')
        self.send_response(204)
        self.send_header('Content-Length', '0')
        self.end_headers()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=18766)
    parser.add_argument('--model-dir', type=Path, required=True)
    parser.add_argument('--runtime-dir', type=Path, required=True)
    parser.add_argument('--diagnostics', type=Path, required=True)
    args = parser.parse_args()
    server = http.server.ThreadingHTTPServer(('127.0.0.1', args.port), Preview)
    server.daemon_threads = True
    server.repo_root = Path(__file__).resolve().parents[2]
    server.model_root = args.model_dir.resolve(strict=True)
    server.runtime_root = args.runtime_dir.resolve(strict=True)
    args.diagnostics.parent.mkdir(parents=True, exist_ok=True)
    server.diagnostics = args.diagnostics
    server.log_lock = threading.Lock()
    print(f'Preview: http://localhost:{args.port}{PAGE}', flush=True)
    try: server.serve_forever()
    finally: server.server_close()
