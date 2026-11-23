#!/usr/bin/env python3
"""Small deterministic regression tests for the E03 V1.1 CPU pipeline."""
import unittest
import cv2
import numpy as np

from e03_improved import (
    CURVE_Y, LaneKalmanTracker, adaptive_lane_mask, fit_mask,
    natural_spline_fit, evaluate_spline, ransac_polynomial,
)


class ImprovedLaneTests(unittest.TestCase):
    def test_ransac_rejects_outliers(self):
        rng = np.random.default_rng(4)
        y = rng.uniform(110, 350, 900)
        yn = y / 360.0
        x = 180 + 130*yn + 40*yn**2 + rng.normal(0, 2, len(y))
        inliers = np.column_stack([x, y])
        outliers = np.column_stack([
            rng.uniform(20, 620, 240), rng.uniform(110, 350, 240)
        ])
        points = np.vstack([inliers, outliers])
        coeff, mask, ratio = ransac_polynomial(
            points, degree=2, threshold=8, iterations=90, seed=8
        )
        self.assertIsNotNone(coeff)
        self.assertEqual(len(mask), len(points))
        self.assertGreater(ratio, .55)
        probe = np.linspace(.35, .95, 12)
        expected = 180 + 130*probe + 40*probe**2
        self.assertLess(np.mean(np.abs(np.polyval(coeff, probe)-expected)), 6.0)

    def test_natural_spline_tracks_s_shape_with_outliers(self):
        rng = np.random.default_rng(12)
        y = np.linspace(105, 350, 1200)
        yn = y / 350.0
        x = 320 + 58*np.sin(2*np.pi*(yn-.30)/.70)
        points = np.column_stack([
            x + rng.normal(0, 2.0, len(x)),
            y + rng.normal(0, .7, len(y))
        ])
        noise = np.column_stack([
            rng.uniform(20, 620, 120), rng.uniform(105, 350, 120)
        ])
        spline = natural_spline_fit(np.vstack([points, noise]))
        self.assertIsNotNone(spline)
        q = np.linspace(.34, .96, 18)
        actual = evaluate_spline(spline, q)
        expected = 320 + 58*np.sin(2*np.pi*(q-.30)/.70)
        self.assertLess(np.mean(np.abs(actual-expected)), 9.0)
        # The derivative must change sign: a single straight/constant-curvature
        # approximation cannot reproduce this reversal.
        self.assertGreater(np.max(np.diff(actual)), 0)
        self.assertLess(np.min(np.diff(actual)), 0)

    def test_prior_search_and_spline_fit(self):
        mask = np.zeros((360, 640), dtype=np.uint8)
        ys = np.arange(110, 355)
        left = 205 + 32*np.sin((ys/360-.30)*np.pi*1.7)
        right = left + 220
        for y, lx, rx in zip(ys, left, right):
            cv2.line(mask, (int(lx), int(y)), (int(lx), int(y)), 255, 5)
            cv2.line(mask, (int(rx), int(y)), (int(rx), int(y)), 255, 5)
        prior = np.stack([
            np.interp(CURVE_Y, ys/360, left),
            np.interp(CURVE_Y, ys/360, right),
        ])
        fit = fit_mask(mask, model="spline", prior=prior)
        self.assertTrue(fit["valid"], fit)
        self.assertEqual(fit["search_mode"], "prior")
        self.assertEqual(len(fit["left_curve_x"]), len(CURVE_Y))

    def test_adaptive_mask_finds_high_contrast_lane_markings(self):
        frame = np.full((360, 640, 3), 90, dtype=np.uint8)
        cv2.line(frame, (205, 350), (270, 120), (245, 245, 245), 8)
        cv2.line(frame, (430, 350), (365, 120), (245, 245, 245), 8)
        mask = adaptive_lane_mask(frame, clahe=True)
        self.assertGreater(int(np.count_nonzero(mask)), 500)

    def test_kalman_prediction_is_limited(self):
        tracker = LaneKalmanTracker(max_missing=3)
        values = np.linspace(180, 240, len(CURVE_Y))
        fit = {"valid": True, "left_curve_x": values,
               "right_curve_x": values+220}
        first, status = tracker.update(fit)
        self.assertIn("INIT", status)
        self.assertIsNotNone(first)
        for _ in range(3):
            predicted, status = tracker.update({"valid": False})
            self.assertIsNotNone(predicted)
            self.assertIn("PREDICTED", status)
        missing, status = tracker.update({"valid": False})
        self.assertIsNone(missing)
        self.assertEqual(status, "NO RELIABLE LANE")


if __name__ == "__main__":
    unittest.main(verbosity=2)
