# DocTags challenge sample assets

From the repository root, run `python scripts/kaggle/install_doctags_challenge_assets.py /path/to/DocTags_28个困难样本_WebP资源包.zip`. The script validates the archive and mirrors all 28 WebP files plus the manifest and README into both locations. The quality validator requires byte-identical copies.

- 18 original scan images: `original_*.webp`
- 10 de-identified simulated documents: `synthetic_*.webp`
- Longest image edge: 1500 px; WebP quality: 78.
- The browser gallery loads thumbnails lazily and sends the original WebP Blob through the existing local inference flow.

Mirror the same 28 WebP files and `manifest.json` to `docs/assets/projects/doctags/browser-inference/samples/challenges/` and `hf-spaces/mvai-doctags-webgpu/samples/challenges/`. The quality validator requires byte-identical copies in both locations.

**Publication check:** `original_110_watermark_fingerprint.webp` contains a fingerprint image. Confirm that the source is authorized for public display before the PR is made ready.
