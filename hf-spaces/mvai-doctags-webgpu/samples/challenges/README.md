# DocTags challenge sample assets

Upload all 28 optimized WebP files from the companion resource ZIP into this directory, alongside `manifest.json`.

- 18 original scan images: `original_*.webp`
- 10 de-identified simulated documents: `synthetic_*.webp`
- Longest image edge: 1500 px; WebP quality: 78.
- The browser gallery loads thumbnails lazily and sends the original WebP Blob through the existing local inference flow.

Mirror the same 28 WebP files and `manifest.json` to `docs/assets/projects/doctags/browser-inference/samples/challenges/` and `hf-spaces/mvai-doctags-webgpu/samples/challenges/`. The quality validator requires byte-identical copies in both locations.

**Publication check:** `original_110_watermark_fingerprint.webp` contains a fingerprint image. Confirm that the source is authorized for public display before the PR is made ready.
