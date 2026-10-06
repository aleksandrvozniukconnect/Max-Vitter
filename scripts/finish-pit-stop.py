#!/usr/bin/env python3
"""Turn the localized pit-stop PNGs into the site's WebP art.

Recolors the storyboards into the site palette (red -> brass, green -> muted
go, signal lamp -> stop) and crops off the baked caption strip: the step
title and body are rendered in HTML instead. Requires Pillow and numpy.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ART_DIR = ROOT / "public" / "images" / "pit-stop"
LOCALES = ("en", "uk", "ru")
STEPS = ("consult", "design", "confirm", "manufacture", "deliver", "support")

CROP_HEIGHT = 736

INK = np.array([0x11, 0x13, 0x18], float)
BRASS_MID = np.array([0x9c, 0x84, 0x5f], float)
BRASS_LIGHT = np.array([0xea, 0xde, 0xc8], float)
STOP_MID = np.array([0x9b, 0x3a, 0x2a], float)
STOP_LIGHT = np.array([0xe3, 0x9a, 0x84], float)
GO_DARK = np.array([0x2a, 0x4f, 0x32], float)
GO = np.array([0x3f, 0x7a, 0x4a], float)

# Signal lamp of the step 3 traffic light (x0, y0, x1, y1), kept red.
LAMPS = {"confirm": (780, 0, 1000, 260)}


def ramp(t: np.ndarray, mid: np.ndarray, light: np.ndarray) -> np.ndarray:
    t = t[..., None]
    low = INK + (mid - INK) * (t / 0.5)
    high = mid + (light - mid) * ((t - 0.5) / 0.5)
    return np.where(t < 0.5, low, high)


def recolor(img: Image.Image, lamp: tuple[int, int, int, int] | None) -> Image.Image:
    a = np.asarray(img.convert("RGB"), float) / 255.0
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1)
    d = np.maximum(mx - mn, 1e-6)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    hue = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    lum = 0.299 * r + 0.587 * g + 0.114 * b

    red = ((hue < 25) | (hue > 335)) & (sat > 0.18)
    green = (hue > 80) & (hue < 170) & (sat > 0.18)
    t = np.clip((lum - 0.15) / 0.65, 0, 1)
    k = np.clip((sat - 0.18) / 0.4, 0, 1)[..., None]

    out = a * 255.0
    brass = ramp(t, BRASS_MID, BRASS_LIGHT)
    stop = ramp(t, STOP_MID, STOP_LIGHT)
    red_target = brass
    if lamp:
        x0, y0, x1, y1 = lamp
        in_lamp = np.zeros(red.shape, bool)
        in_lamp[y0:y1, x0:x1] = True
        red_target = np.where(in_lamp[..., None], stop, brass)
    out = np.where(red[..., None], out * (1 - k) + red_target * k, out)

    gt = np.clip((lum - 0.2) / 0.6, 0, 1)[..., None]
    gk = k * 0.9
    out = np.where(green[..., None], out * (1 - gk) + (GO_DARK + (GO - GO_DARK) * gt) * gk, out)
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def main() -> None:
    for locale in LOCALES:
        for step in STEPS:
            src = ART_DIR / locale / f"{step}.png"
            art = recolor(Image.open(src), LAMPS.get(step))
            art = art.crop((0, 0, art.width, CROP_HEIGHT))
            art.save(ART_DIR / locale / f"{step}.webp", "WEBP", quality=84, method=6)
            print(f"{locale}/{step}")


if __name__ == "__main__":
    main()
