# DocTags challenge sample assets

The gallery contains 28 WebP challenge samples: 18 original scans and 10 de-identified simulated documents. All visible labels are descriptive and omit internal source numbers.

- Longest image edge: 1500 px; WebP quality: 78.
- The browser gallery loads local thumbnails lazily and feeds the selected image into the existing browser-side inference pipeline.
- original_110_watermark_fingerprint.webp contains a fingerprint image. The project owner explicitly approved public display of this image on 2026-11-05; it is intentionally retained without blurring.

For repository builds, the 28-image archive is stored in 12 binary parts. GitHub Actions reassembles and validates the archive, extracts the WebP files into both the Learning Center and HF Static Space bundles, then removes the transport parts from the published output.
