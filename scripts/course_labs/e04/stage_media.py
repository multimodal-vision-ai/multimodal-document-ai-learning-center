"""Stage EXACT teacher-approved E04 media; never re-encode or replace approved assets.
Model/runtime staging is deliberately separate pending AGPL/weights distribution review.
Usage: python scripts/course_labs/e04/stage_media.py E04-material-review.zip DEST
"""
import argparse, base64, hashlib, json, zipfile
from pathlib import Path
EXPECTED={
'A':'2dfa0a07dc5792f81f9b5356f2a53423e9d873313a3b2bb10300de7897adf0b8',
'B':'45b020254916ce80cd729a3089126d774752c01108e9ecef6399ed08c03706b2',
'C':'ce18ea1da3508931b563982b05c81ff5d8c296176ac0176db0fec38d4547a411'}
def sha(data): return hashlib.sha256(data).hexdigest()
def stage(source,dest):
    assert sha(Path(source).read_bytes())=='dbb6440700eda37e8b2e908eb24991c65ffc9385e865794ab1a3fe124fe5e60e', 'Not the exact teacher-approved ZIP'
    dest=Path(dest)
    with zipfile.ZipFile(source) as z:
        for k,v in EXPECTED.items():
            assert sha(z.read(f'dist/videos/{k}.mp4'))==v, f'{k}: approved clip hash mismatch'
        checks=json.loads(z.read('dist/data/file-checksums.json'))
        for name, expected in checks.items():
            assert sha(z.read('dist/'+name)) == expected, f'Corrupt review asset: {name}'
        # The video hashes above are independent of the manifest supplied in the ZIP.
        keep=[f'dist/videos/{k}.mp4' for k in EXPECTED]
        keep += [f'dist/frames/{k}{i}.jpg' for k in EXPECTED for i in range(1,4)]
        keep += [f'dist/data/{n}' for n in ['sources.json','clips.json','environment.json','detections.json','forward-log.json','parameter-statistics.csv','failure-cases.json','file-checksums.json']]
        keep += ['dist/licenses/A-LICENSE.txt','dist/licenses/B-imageinfo.json','dist/licenses/C-imageinfo.json','dist/REVIEW.md','dist/data/validation.json']
        for name in keep:
            data=z.read(name)
            p=dest/name.removeprefix('dist/')
            p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
        assert len(json.loads((dest/'data/detections.json').read_text(encoding='utf-8')))==1296
    print('Approved clips verified; staged',len(keep),'files to',dest)
def embed_frames(media,html):
    """Keep reviewed JPEG bytes exactly; prevent proxy redirects tainting Canvas."""
    media,html=Path(media),Path(html)
    frames={f'{k}{i}':base64.b64encode((media/'frames'/f'{k}{i}.jpg').read_bytes()).decode('ascii') for k in EXPECTED for i in range(1,4)}
    for key,value in frames.items():
        assert base64.b64decode(value)==(media/'frames'/f'{key}.jpg').read_bytes()
    raw=html.read_text(encoding='utf-8')
    marker='<script id="e04-embedded-frames" type="application/json">'
    assert marker not in raw and '</head>' in raw
    raw=raw.replace('</head>',marker+json.dumps(frames,separators=(',',':'))+'</script></head>',1)
    html.write_text(raw,encoding='utf-8')
    print('E04 embedded nine exact reviewed JPEG frames:',sum(len(x) for x in frames.values()),'base64 bytes')
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('zip');p.add_argument('dest');p.add_argument('--embed-html');a=p.parse_args();stage(a.zip,a.dest)
    if a.embed_html:embed_frames(a.dest,a.embed_html)

