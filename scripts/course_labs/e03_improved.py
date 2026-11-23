"""E03 V1.1 robust lane fitting for classroom comparison.

CPU/OpenCV only. This module is intentionally independent from the V1.0
baseline. It uses adaptive color/gradient candidates, prior-guided search,
RANSAC polynomial inliers, natural cubic splines and a per-anchor Kalman
tracker. Returned curves remain hypotheses unless compared with manual labels.
"""
from dataclasses import dataclass
import cv2
import numpy as np

SCENE_QUADS = {
    "straight": (.43, .59, .09, .94, .60),
    "curve": (.42, .63, .06, .96, .61),
    "complex": (.40, .63, .03, .95, .61),
}
CURVE_Y = np.linspace(.30, .97, 18, dtype=np.float64)
PROBE_Y = np.array([.38, .62, .91], dtype=np.float64)


def improved_perspective(frame, scene="curve"):
    """Use the same approximate scene quadrilaterals as V1.0."""
    h, w = frame.shape[:2]
    lt, rt, lb, rb, yt = SCENE_QUADS.get(scene, SCENE_QUADS["curve"])
    src = np.float32([[lt*w, yt*h], [rt*w, yt*h],
                      [rb*w, .98*h], [lb*w, .98*h]])
    dst = np.float32([[.23*w, 0], [.77*w, 0],
                      [.77*w, h-1], [.23*w, h-1]])
    matrix = cv2.getPerspectiveTransform(src, dst)
    inverse = cv2.getPerspectiveTransform(dst, src)
    bird = cv2.warpPerspective(frame, matrix, (w, h))
    return bird, matrix, inverse, src


def adaptive_lane_mask(bgr, clahe=True):
    """Combine local lightness, yellow hue and horizontal gradients."""
    hls = cv2.cvtColor(bgr, cv2.COLOR_BGR2HLS)
    hue, light, sat = cv2.split(hls)
    if clahe:
        light = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)).apply(light)
    white_global = (light >= 148) & (sat <= 178)
    local = cv2.adaptiveThreshold(
        light, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 31, -8
    ) > 0
    white_local = local & (light >= 105) & (sat <= 185)
    yellow = (hue >= 12) & (hue <= 45) & (sat >= 55) & (light >= 52)
    gx = cv2.Sobel(light, cv2.CV_32F, 1, 0, ksize=3)
    gx = cv2.convertScaleAbs(gx)
    gradient = (gx >= 42) & (light >= 112) & (sat <= 175)
    mask = (white_global | white_local | yellow | gradient).astype(np.uint8) * 255
    h, w = mask.shape
    road_roi = np.zeros_like(mask)
    polygon = np.array([[
        (int(.04*w), int(.98*h)), (int(.30*w), int(.05*h)),
        (int(.70*w), int(.05*h)), (int(.96*w), int(.98*h))
    ]], dtype=np.int32)
    cv2.fillPoly(road_roi, polygon, 255)
    mask = cv2.bitwise_and(mask, road_roi)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
    clean = np.zeros_like(mask)
    for i in range(1, count):
        if stats[i, cv2.CC_STAT_AREA] >= 7:
            clean[labels == i] = 255
    return clean


def _window_search(binary, nwindows=10, margin=72, minpix=24):
    h, w = binary.shape
    histogram = np.sum(binary[h//2:, :] > 0, axis=0)
    mid = w // 2
    left = int(np.argmax(histogram[int(.04*w):mid]) + int(.04*w))
    right = int(np.argmax(histogram[mid:int(.96*w)]) + mid)
    ys, xs = np.nonzero(binary)
    step = max(1, h // int(nwindows))
    points = [[], []]
    boxes = []
    centers = [left, right]
    for k in range(int(nwindows)):
        y_hi = h - k*step
        y_lo = max(0, y_hi-step)
        for side in (0, 1):
            center = centers[side]
            x_lo = max(0, center-margin)
            x_hi = min(w, center+margin)
            ids = np.where((ys >= y_lo) & (ys < y_hi) &
                           (xs >= x_lo) & (xs < x_hi))[0]
            if ids.size:
                points[side].extend(np.column_stack([xs[ids], ys[ids]]).tolist())
            boxes.append((x_lo, y_lo, x_hi, y_hi, side))
            if ids.size > minpix:
                centers[side] = int(np.mean(xs[ids]))
    return [np.asarray(p, dtype=np.float64).reshape(-1, 2) for p in points], boxes


def _prior_search(binary, prior, margin=58):
    h, w = binary.shape
    ys, xs = np.nonzero(binary)
    if prior is None or ys.size == 0:
        return None
    curve_y = np.asarray(prior.get("curve_y", CURVE_Y), dtype=np.float64)
    left_x = np.asarray(prior.get("left_x", []), dtype=np.float64)
    right_x = np.asarray(prior.get("right_x", []), dtype=np.float64)
    if left_x.size != curve_y.size or right_x.size != curve_y.size:
        return None
    y_norm = ys / float(h)
    points = []
    for expected in (left_x, right_x):
        predicted = np.interp(y_norm, curve_y, expected)
        selected = np.abs(xs - predicted) <= margin
        pts = np.column_stack([xs[selected], ys[selected]]).astype(np.float64)
        if pts.shape[0] < 55 or np.ptp(pts[:, 1]) < .22*h:
            return None
        points.append(pts)
    return points


def ransac_polynomial(points, degree=3, threshold=15.0, iterations=70,
                      min_inliers=65, seed=17):
    """Fit x(y) robustly; return coefficients, full-size inlier mask and ratio."""
    all_points = np.asarray(points, dtype=np.float64).reshape(-1, 2)
    if all_points.shape[0] < max(min_inliers, degree+1):
        return None, None, 0.0
    rng = np.random.default_rng(seed)
    if all_points.shape[0] > 1800:
        sample_ids = rng.choice(all_points.shape[0], 1800, replace=False)
        pts = all_points[sample_ids]
    else:
        pts = all_points
    x = pts[:, 0]
    y = pts[:, 1] / max(1.0, float(np.max(all_points[:, 1]) + 1))
    best = None
    best_count = 0
    best_error = float("inf")
    sample_size = degree + 1
    for _ in range(int(iterations)):
        ids = rng.choice(len(pts), sample_size, replace=False)
        if np.ptp(y[ids]) < .16:
            continue
        try:
            coeff = np.polyfit(y[ids], x[ids], degree)
        except (ValueError, np.linalg.LinAlgError, FloatingPointError):
            continue
        residual = np.abs(x - np.polyval(coeff, y))
        inliers = residual <= threshold
        count = int(np.count_nonzero(inliers))
        if count < min_inliers:
            continue
        error = float(np.median(residual[inliers]))
        if count > best_count or (count == best_count and error < best_error):
            best, best_count, best_error = inliers, count, error
    if best is None:
        return None, None, 0.0
    try:
        provisional = np.polyfit(y[best], x[best], degree)
        full_y = all_points[:, 1] / max(1.0, float(np.max(all_points[:, 1]) + 1))
        full_inliers = np.abs(all_points[:, 0] - np.polyval(provisional, full_y)) <= threshold
        if np.count_nonzero(full_inliers) < min_inliers:
            return None, None, 0.0
        coeff = np.polyfit(full_y[full_inliers], all_points[full_inliers, 0], degree)
    except (ValueError, np.linalg.LinAlgError, FloatingPointError):
        return None, None, 0.0
    return coeff, full_inliers, float(np.count_nonzero(full_inliers) / len(all_points))

def natural_spline_fit(points, bins=12):
    """Build a natural cubic spline from median x in occupied y-bins."""
    pts = np.asarray(points, dtype=np.float64).reshape(-1, 2)
    if pts.shape[0] < 30:
        return None
    y = pts[:, 1] / max(1.0, float(np.max(pts[:, 1]) + 1))
    x = pts[:, 0]
    edges = np.linspace(.28, .99, bins+1)
    nodes_y, nodes_x = [], []
    for lo, hi in zip(edges[:-1], edges[1:]):
        selected = (y >= lo) & (y < hi)
        if np.count_nonzero(selected) >= 3:
            nodes_y.append(float(np.median(y[selected])))
            nodes_x.append(float(np.median(x[selected])))
    if len(nodes_y) < 5:
        return None
    order = np.argsort(nodes_y)
    nodes_y = np.asarray(nodes_y, dtype=np.float64)[order]
    nodes_x = np.asarray(nodes_x, dtype=np.float64)[order]
    h = np.diff(nodes_y)
    n = len(nodes_y)
    matrix = np.zeros((n, n), dtype=np.float64)
    rhs = np.zeros(n, dtype=np.float64)
    matrix[0, 0] = matrix[-1, -1] = 1.0
    for i in range(1, n-1):
        matrix[i, i-1] = h[i-1]
        matrix[i, i] = 2.0*(h[i-1]+h[i])
        matrix[i, i+1] = h[i]
        rhs[i] = 6.0*((nodes_x[i+1]-nodes_x[i])/h[i] -
                      (nodes_x[i]-nodes_x[i-1])/h[i-1])
    try:
        second = np.linalg.solve(matrix, rhs)
    except np.linalg.LinAlgError:
        return None
    return {"y": nodes_y, "x": nodes_x, "second": second}


def evaluate_spline(model, query):
    q = np.asarray(query, dtype=np.float64)
    y, x, second = model["y"], model["x"], model["second"]
    idx = np.clip(np.searchsorted(y, q, side="right")-1, 0, len(y)-2)
    width = y[idx+1]-y[idx]
    a = (y[idx+1]-q)/width
    b = (q-y[idx])/width
    return (a*x[idx] + b*x[idx+1] +
            ((a**3-a)*second[idx] + (b**3-b)*second[idx+1]) *
            (width**2)/6.0)


def fit_curve_model(points, model="spline", seed=17):
    degree = 2 if model == "quadratic" else 3
    coeff, inliers, ratio = ransac_polynomial(
        points, degree=degree, threshold=15.0, iterations=75,
        min_inliers=65, seed=seed
    )
    if coeff is None:
        return None, 0.0
    inlier_points = np.asarray(points, dtype=np.float64).reshape(-1, 2)[inliers]
    if model == "spline":
        spline = natural_spline_fit(inlier_points)
        if spline is None:
            return None, ratio
        return ("spline", spline), ratio
    return ("poly", coeff), ratio


def evaluate_model(fitted, y_values):
    kind, payload = fitted
    y_values = np.asarray(y_values, dtype=np.float64)
    if kind == "spline":
        return evaluate_spline(payload, y_values)
    return np.polyval(payload, y_values)


def fit_pair_from_points(points, model="spline", seed=17):
    left, left_ratio = fit_curve_model(points[0], model, seed)
    right, right_ratio = fit_curve_model(points[1], model, seed+1)
    if left is None or right is None:
        return None
    left_values = evaluate_model(left, CURVE_Y)
    right_values = evaluate_model(right, CURVE_Y)
    widths = right_values-left_values
    if (not np.all(np.isfinite(widths)) or
            not np.all((widths > 0.12*640) & (widths < 0.86*640))):
        return None
    if np.ptp(widths) > .48*640:
        return None
    return {
        "valid": True, "curve_y": CURVE_Y.copy(),
        "left_curve_x": left_values, "right_curve_x": right_values,
        "left_x": np.interp(PROBE_Y, CURVE_Y, left_values),
        "right_x": np.interp(PROBE_Y, CURVE_Y, right_values),
        "inlier_ratio": float((left_ratio+right_ratio)/2),
        "model": model,
    }


def fit_mask(binary, model="spline", prior=None, margin=58, nwindows=10):
    points = _prior_search(binary, prior, margin=margin)
    search_mode = "prior" if points is not None else "sliding"
    boxes = []
    if points is None:
        points, boxes = _window_search(binary, nwindows=nwindows, margin=72)
    fit = fit_pair_from_points(points, model=model)
    if fit is None:
        return {"valid": False, "search_mode": search_mode,
                "left_points": len(points[0]), "right_points": len(points[1]),
                "boxes": boxes}
    fit.update(search_mode=search_mode, left_points=len(points[0]),
               right_points=len(points[1]), boxes=boxes)
    return fit


class LaneKalmanTracker:
    """Independent constant-velocity Kalman filter for each curve anchor."""
    def __init__(self, max_missing=4, gate_px=105.0):
        self.max_missing = int(max_missing)
        self.gate_px = float(gate_px)
        self.filters = None
        self.missing = 0
        self.last_samples = None

    @staticmethod
    def _new_filter(value):
        kf = cv2.KalmanFilter(2, 1, 0, cv2.CV_32F)
        kf.transitionMatrix = np.array([[1, 1], [0, 1]], dtype=np.float32)
        kf.measurementMatrix = np.array([[1, 0]], dtype=np.float32)
        kf.processNoiseCov = np.eye(2, dtype=np.float32) * 0.035
        kf.measurementNoiseCov = np.array([[18.0]], dtype=np.float32)
        kf.errorCovPost = np.eye(2, dtype=np.float32) * 25.0
        kf.statePost = np.array([[value], [0.0]], dtype=np.float32)
        return kf

    def reset(self):
        self.filters = None
        self.missing = 0
        self.last_samples = None

    def update(self, fit):
        valid = bool(fit and fit.get("valid"))
        if self.filters is None:
            if not valid:
                return None, "NO RELIABLE LANE"
            values = np.concatenate([fit["left_curve_x"], fit["right_curve_x"]])
            self.filters = [self._new_filter(float(v)) for v in values]
            self.last_samples = values.reshape(2, -1).copy()
            self.missing = 0
            return self.last_samples.copy(), "DETECTED · KALMAN INIT"

        predicted = []
        for kf in self.filters:
            state = kf.predict()
            predicted.append(float(state[0, 0]))
        predicted = np.asarray(predicted, dtype=np.float64)
        if valid:
            measured = np.concatenate([fit["left_curve_x"], fit["right_curve_x"]])
            residual = np.abs(measured-predicted)
            if self.missing >= self.max_missing or np.count_nonzero(residual <= self.gate_px) < len(measured)*.55:
                self.filters = [self._new_filter(float(v)) for v in measured]
                result = measured.copy()
                status = "DETECTED · KALMAN REACQUIRED"
            else:
                result = predicted.copy()
                for i, (kf, value) in enumerate(zip(self.filters, measured)):
                    if residual[i] <= self.gate_px:
                        corrected = kf.correct(np.array([[value]], dtype=np.float32))
                        result[i] = float(corrected[0, 0])
                    else:
                        kf.statePost = kf.statePre.copy()
                        kf.errorCovPost = kf.errorCovPre.copy()
                status = "DETECTED · KALMAN"
            self.missing = 0
        else:
            self.missing += 1
            result = predicted.copy()
            for kf in self.filters:
                kf.statePost = kf.statePre.copy()
                kf.errorCovPost = kf.errorCovPre.copy()
            if self.missing > self.max_missing:
                self.reset()
                return None, "NO RELIABLE LANE"
            status = "KALMAN PREDICTED · UNVERIFIED"
        self.last_samples = result.reshape(2, -1).copy()
        return self.last_samples.copy(), status


def draw_improved_overlay(frame, inverse, curve_y, left_x, right_x, status):
    out = frame.copy()
    if left_x is None or right_x is None:
        cv2.putText(out, status, (12, 30), cv2.FONT_HERSHEY_SIMPLEX,
                    .58, (25, 25, 235), 2, cv2.LINE_AA)
        return out
    h, w = frame.shape[:2]
    left = np.column_stack([left_x, curve_y*h]).astype(np.float32)
    right = np.column_stack([right_x, curve_y*h]).astype(np.float32)
    left_src = cv2.perspectiveTransform(left.reshape(-1, 1, 2), inverse).reshape(-1, 2)
    right_src = cv2.perspectiveTransform(right.reshape(-1, 1, 2), inverse).reshape(-1, 2)
    left_src[:, 0] = np.clip(left_src[:, 0], 0, w-1)
    left_src[:, 1] = np.clip(left_src[:, 1], 0, h-1)
    right_src[:, 0] = np.clip(right_src[:, 0], 0, w-1)
    right_src[:, 1] = np.clip(right_src[:, 1], 0, h-1)
    polygon = np.vstack([left_src, right_src[::-1]])
    mask = np.zeros_like(out)
    cv2.fillPoly(mask, [np.round(polygon).astype(np.int32)], (55, 180, 35))
    out = cv2.addWeighted(out, 1.0, mask, .23, 0)
    color = (40, 190, 255) if "PREDICTED" in status else (20, 220, 255)
    cv2.polylines(out, [np.round(left_src).astype(np.int32)], False, (255, 170, 20), 3, cv2.LINE_AA)
    cv2.polylines(out, [np.round(right_src).astype(np.int32)], False, color, 3, cv2.LINE_AA)
    cv2.putText(out, status, (12, 28), cv2.FONT_HERSHEY_SIMPLEX,
                .50, (255, 255, 255), 2, cv2.LINE_AA)
    return out


def e03_improved_detect(frame, scene="curve", tracker=None, model="spline",
                        margin=58, clahe=True):
    """V1.1 pipeline. Pass one tracker through frames in chronological order."""
    bird, matrix, inverse, src = improved_perspective(frame, scene)
    mask = adaptive_lane_mask(bird, clahe=clahe)
    prior = tracker.last_samples if tracker is not None else None
    fit = fit_mask(mask, model=model, prior=prior, margin=margin)
    samples, status = tracker.update(fit) if tracker is not None else (
        (np.stack([fit["left_curve_x"], fit["right_curve_x"]]), "DETECTED")
        if fit.get("valid") else (None, "NO RELIABLE LANE")
    )
    if samples is None:
        left_curve_x = right_curve_x = None
    else:
        left_curve_x, right_curve_x = samples[0], samples[1]
    overlay = draw_improved_overlay(frame, inverse, CURVE_Y,
                                    left_curve_x, right_curve_x, status)
    result = dict(fit)
    result.update({
        "valid": bool(fit.get("valid")),
        "status": status,
        "curve_y": CURVE_Y.tolist(),
        "left_curve_x": None if left_curve_x is None else left_curve_x.tolist(),
        "right_curve_x": None if right_curve_x is None else right_curve_x.tolist(),
        "left_x": None if left_curve_x is None else np.interp(PROBE_Y, CURVE_Y, left_curve_x).tolist(),
        "right_x": None if right_curve_x is None else np.interp(PROBE_Y, CURVE_Y, right_curve_x).tolist(),
        "bottom_x": None if left_curve_x is None else float((left_curve_x[-1]+right_curve_x[-1])/2),
        "display_valid": samples is not None,
    })
    return overlay, result, {
        "bird": bird, "mask": mask, "matrix": matrix, "inverse": inverse,
        "src": src, "curve_y": CURVE_Y.tolist(),
    }
