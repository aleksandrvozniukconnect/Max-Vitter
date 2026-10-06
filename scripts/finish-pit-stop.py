#!/usr/bin/env python3
"""Turn the localized pit-stop PNGs into the site's WebP art.

Recolors the storyboards into the site palette (red -> brass, green -> muted
go, signal lamp -> stop) and crops off the baked caption strip: the step
title and body are rendered in HTML instead. Requires Pillow and numpy.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ART_DIR = ROOT / "public" / "images" / "pit-stop"
LOCALES = ("en", "uk", "ru")
STEPS = ("consult", "design", "confirm", "manufacture", "deliver", "support")

CROP_HEIGHT = 736
SMALL_WIDTHS = (480, 800)

INK = np.array([0x11, 0x13, 0x18], float)
BRASS_MID = np.array([0x9c, 0x84, 0x5f], float)
BRASS_LIGHT = np.array([0xea, 0xde, 0xc8], float)
STOP_MID = np.array([0x9b, 0x3a, 0x2a], float)
STOP_LIGHT = np.array([0xe3, 0x9a, 0x84], float)
GO_DARK = np.array([0x2a, 0x4f, 0x32], float)
GO = np.array([0x3f, 0x7a, 0x4a], float)

GOLD_MID = np.array([0xc9, 0xa2, 0x45], float)
GOLD_LIGHT = np.array([0xf4, 0xe2, 0xa4], float)
GRAPHITE_MID = np.array([0x6e, 0x6a, 0x64], float)
GRAPHITE_LIGHT = np.array([0xee, 0xe2, 0xcb], float)

# Signal lamp of the step 3 traffic light (x0, y0, x1, y1), kept red.
LAMPS = {"confirm": (780, 0, 1000, 260)}

# Rough outline of the race car in each drawing (1152x736 coordinates). Red
# pixels inside it turn gold; the crew's overalls stay brass.
CARS = {
    "consult": [(330, 410), (400, 380), (480, 450), (560, 400), (640, 330), (720, 290), (840, 310), (856, 370), (850, 470), (800, 550), (660, 640), (500, 650), (410, 620)],
    "design": [(230, 390), (340, 330), (430, 320), (520, 310), (600, 320), (660, 330), (760, 350), (760, 450), (700, 510), (600, 524), (480, 500), (340, 490), (240, 450)],
    "confirm": [(0, 600), (20, 520), (100, 470), (180, 400), (260, 390), (350, 410), (424, 490), (430, 570), (410, 620), (240, 660), (80, 650), (0, 640)],
    "manufacture": [(390, 400), (440, 340), (520, 330), (600, 300), (680, 310), (750, 350), (770, 430), (750, 500), (660, 550), (520, 536), (410, 500)],
    "deliver": [(530, 400), (570, 350), (640, 336), (700, 340), (744, 370), (756, 450), (748, 524), (660, 556), (570, 552), (520, 500)],
    "support": [(15, 535), (30, 500), (70, 455), (140, 440), (210, 440), (250, 410), (260, 390), (310, 392), (340, 400), (380, 405), (400, 440), (405, 500), (380, 520), (330, 520), (270, 545), (250, 560), (120, 562), (40, 556)],
}

# Step 6: the room (right side) turns graphite instead of pink-brass.
ROOM_X = 430


def ramp(t: np.ndarray, mid: np.ndarray, light: np.ndarray) -> np.ndarray:
    t = t[..., None]
    low = INK + (mid - INK) * (t / 0.5)
    high = mid + (light - mid) * ((t - 0.5) / 0.5)
    return np.where(t < 0.5, low, high)


def polygon_mask(size: tuple[int, int], points: list[tuple[int, int]]) -> np.ndarray:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).polygon(points, fill=255)
    return np.asarray(mask.filter(ImageFilter.GaussianBlur(6)), float)[..., None] / 255.0


def recolor(
    img: Image.Image,
    lamp: tuple[int, int, int, int] | None,
    car: list[tuple[int, int]] | None = None,
    room: bool = False,
) -> Image.Image:
    a = np.asarray(img.convert("RGB"), float) / 255.0
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1)
    d = np.maximum(mx - mn, 1e-6)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    hue = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    lum = 0.299 * r + 0.587 * g + 0.114 * b

    red = ((hue < 25) | (hue > 335)) & (sat > 0.18)
    green = (hue > 80) & (hue < 170) & (sat > 0.18) & (lum > 0.2)
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

    if car:
        gold = ramp(t, GOLD_MID, GOLD_LIGHT)
        car_k = polygon_mask(img.size, car) * k * red[..., None]
        out = out * (1 - car_k) + gold * car_k

    if room:
        x = np.arange(img.width)[None, :].repeat(img.height, 0)
        region = np.clip((x - ROOM_X) / 80, 0, 1)
        uniform = np.clip((sat - 0.42) / 0.18, 0, 1)
        tone = ((hue < 50) | (hue > 320)) & (sat > 0.05)
        room_k = np.clip((sat - 0.05) / 0.12, 0, 1) * region * (1 - uniform) * tone
        graphite = ramp(np.clip((lum - 0.12) / 0.75, 0, 1), GRAPHITE_MID, GRAPHITE_LIGHT)
        out = out * (1 - room_k[..., None]) + graphite * room_k[..., None]

    gt = np.clip((lum - 0.2) / 0.6, 0, 1)[..., None]
    gk = k * 0.9
    out = np.where(green[..., None], out * (1 - gk) + (GO_DARK + (GO - GO_DARK) * gt) * gk, out)
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def main() -> None:
    for locale in LOCALES:
        for step in STEPS:
            src = ART_DIR / locale / f"{step}.png"
            art = recolor(Image.open(src), LAMPS.get(step), CARS.get(step), room=step == "support")
            art = art.crop((0, 0, art.width, CROP_HEIGHT))
            art.save(ART_DIR / locale / f"{step}-1152.webp", "WEBP", quality=84, method=6)
            for width in SMALL_WIDTHS:
                small = art.resize((width, round(width * art.height / art.width)), Image.LANCZOS)
                small.save(ART_DIR / locale / f"{step}-{width}.webp", "WEBP", quality=82, method=6)
            print(f"{locale}/{step}")


if __name__ == "__main__":
    main()
