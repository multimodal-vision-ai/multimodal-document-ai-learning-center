# E03 Advanced Lane Finding V2.0

This folder contains the student Notebook and the CPU-only OpenCV implementation used by the MVAI Learning Center DEV preview.

## Run locally

1. Download and extract `MVAI_E03_Advanced_Lane_Finding_V2.0.zip`.
2. Open the extracted root folder in Jupyter or VS Code.
3. Install dependencies: `pip install -r requirements.txt`.
4. Open `E03_Advanced_Lane_Finding_V2.0.ipynb` and run cells from top to bottom.

The default video mode processes about 8 seconds per video at 10 FPS. Set `VIDEO_MODE="full"` in the final video cell to process full videos at 5 FPS.

## Package contents

- `E03_Advanced_Lane_Finding_V2.0.ipynb`: five experiments and 18 exploration tasks.
- `e03_lane_finding.py`: calibration, thresholding, perspective, pixel search, curve fitting and video tracking.
- `process_e03_video.py`: isolated MP4 processing runner.
- `data/e03/camera_cal`: 20 chessboard calibration images.
- `data/e03/test_images`: road test images.
- `data/e03/videos`: three approved teaching videos.

## Teaching limitations

The harder-challenge video intentionally retains lane-boundary drift/false selection as an after-class exploration case. Geometric validity coverage is not detection accuracy. Curvature and lateral offset are estimates based on assumed road scale, not measured ground truth. This teaching implementation is not for safety-critical driving.

## Sources and licensing

CarND-Advanced-Lane-Lines source materials are pinned to commit `91b080357290da37f533e2d0832f601c3e770d51`; retain the accompanying MIT License. The straight-road `solidWhiteRight.mp4` is included in the DEV teaching package by teacher-provided authorization; public redistribution permission must be confirmed separately before merging into the official main release.
