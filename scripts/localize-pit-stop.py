#!/usr/bin/env python3
"""Paint locale captions onto the pit-stop storyboards.

The drawings stay pixel-identical outside each station's bottom caption
strip. Captions come from scripts output (JSON of pitStopCaption).
Requires Pillow. Oswald SemiBold is vendored under scripts/fonts (OFL).
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, PngImagePlugin

ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = ROOT / "scripts" / "fonts" / "Oswald-SemiBold.ttf"
SOURCE_DIR = ROOT / "scripts" / "pit-stop-source"
OUT_DIR = ROOT / "public" / "images" / "pit-stop"
INK = (22, 22, 22)

# White caption interiors, inside the hand-drawn rules and side borders.
CLEAR = {
    "consult": (32, 758, 1120, 838),
    "design": (32, 746, 1124, 838),
    "confirm": (40, 768, 1112, 848),
    "manufacture": (64, 762, 1094, 842),
    "deliver": (34, 754, 1120, 844),
    "support": (48, 768, 1104, 844),
}


def text_width(text: str, font: ImageFont.FreeTypeFont, tracking: float) -> float:
    if not text:
        return 0
    return sum(font.getlength(char) for char in text) + tracking * (len(text) - 1)


def fit_font(text: str, max_width: float, start: int, minimum: int, tracking: float) -> tuple[ImageFont.FreeTypeFont, float]:
    size = start
    track = tracking
    while size >= minimum:
        font = ImageFont.truetype(FONT_PATH, size)
        for candidate in (track, 0.15, 0):
            if text_width(text, font, candidate) <= max_width:
                return font, candidate
        size -= 1
    font = ImageFont.truetype(FONT_PATH, minimum)
    return font, 0


def ink_box(text: str, font: ImageFont.FreeTypeFont) -> tuple[int, int]:
    left, top, right, bottom = font.getbbox(text)
    return bottom - top, top


def draw_tracked(
    draw: ImageDraw.ImageDraw,
    x: float,
    y: float,
    text: str,
    font: ImageFont.FreeTypeFont,
    tracking: float,
) -> None:
    for char in text:
        draw.text((x, y), char, font=font, fill=INK)
        x += font.getlength(char) + tracking


def _letter(pixel: tuple[int, int, int]) -> bool:
    red, green, blue = pixel
    return red < 95 and green < 80 and blue < 70


def _nearest_fill(px, x: int, y: int, width: int, height: int) -> tuple[int, int, int]:
    for radius in range(1, 30):
        for yy in range(y - radius, y + radius + 1):
            if not 0 <= yy < height:
                continue
            for xx in (x - radius, x + radius):
                if 0 <= xx < width and not _letter(px[xx, yy]):
                    return px[xx, yy]
        for xx in range(x - radius, x + radius + 1):
            if not 0 <= xx < width:
                continue
            for yy in (y - radius, y + radius):
                if 0 <= yy < height and not _letter(px[xx, yy]):
                    return px[xx, yy]
    return (140, 118, 96)


def _erase_letters(px, box: tuple[int, int, int, int], width: int, height: int) -> None:
    x0, y0, x1, y1 = box
    fills: dict[tuple[int, int], tuple[int, int, int]] = {}
    for y in range(y0, y1):
        for x in range(x0, x1):
            if _letter(px[x, y]):
                fills[(x, y)] = _nearest_fill(px, x, y, width, height)
    for (x, y), color in fills.items():
        px[x, y] = color


def _blank_floor_crate_label(image: Image.Image) -> bool:
    """Wipe the floor-crate stencil, including the faint letter contour.

    The first pass removed only the black ink, which left a mid-tone outline
    of EXPORT. Every pixel of that outline on the side face is replaced with
    nearby wood. Crate edges, ROOM-1, ROOF, and the large EXPORT stay.
    A second pass finds no contour and changes nothing.
    """
    arr = np.array(image)
    height, width = arr.shape[:2]
    red = arr[:, :, 0].astype(int)
    green = arr[:, :, 1].astype(int)
    blue = arr[:, :, 2].astype(int)
    zone = np.zeros((height, width), dtype=bool)
    zone[700:745, 798:854] = True
    mask = zone & (red < 155) & (green < 140) & (blue < 125)
    for x in range(798, 854):
        if int(mask[700:745, x].sum()) > 30:
            mask[700:745, x] = False
    fringe = mask.copy()
    ys, xs = np.where(mask)
    for y, x in zip(ys.tolist(), xs.tolist()):
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                ny, nx = y + dy, x + dx
                if zone[ny, nx] and red[ny, nx] < 175 and green[ny, nx] < 160:
                    fringe[ny, nx] = True
    mask = fringe
    if not mask.any():
        return False

    work = arr.copy()
    for _ in range(3):
        hole = (
            (work[:, :, 0].astype(int) < 155)
            & (work[:, :, 1].astype(int) < 140)
            & (work[:, :, 2].astype(int) < 125)
            & zone
        )
        for x in range(798, 854):
            if int(hole[700:745, x].sum()) > 30:
                hole[700:745, x] = False
        grown = hole.copy()
        ys, xs = np.where(hole)
        for y, x in zip(ys.tolist(), xs.tolist()):
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = y + dy, x + dx
                    if zone[ny, nx] and int(work[ny, nx, 0]) < 175 and int(work[ny, nx, 1]) < 160:
                        grown[ny, nx] = True
        hole = grown
        if not hole.any():
            break
        hy, hx = np.where(hole)
        for y, x in zip(hy.tolist(), hx.tolist()):
            found = None
            for span in range(1, 25):
                for oy in range(-span, span + 1):
                    for ox in (-span, span):
                        qy, qx = y + oy, x + ox
                        if (
                            0 <= qy < height
                            and 0 <= qx < width
                            and not hole[qy, qx]
                            and int(work[qy, qx, 0]) > 150
                        ):
                            found = (qy, qx)
                            break
                    if found:
                        break
                if found:
                    break
            if found:
                work[y, x] = work[found]
    if np.array_equal(work, arr):
        return False
    image.paste(Image.fromarray(work))
    return True


def repair_deliver_labels(image: Image.Image) -> bool:
    """Correct crate marks on the delivery drawing.

    ROORF becomes ROOF, the large crate's AXPORT becomes EXPORT, and the
    small floor crate's stencil is removed. A second pass changes nothing.
    """
    image_rgb = image if image.mode == "RGB" else image.convert("RGB")
    px = image_rgb.load()
    width, height = image_rgb.size
    changed = False

    # The extra R in ROORF still sits just left of F. After the fix, that slot is the F
    # and the old F position is bare wood.
    old_f = sum(1 for y in range(406, 419) for x in range(53, 57) if _letter(px[x, y]))
    if old_f > 8:
        stolen = [
            (x, y, px[x, y])
            for y in range(403, 422)
            for x in range(52, 58)
            if _letter(px[x, y])
        ]
        _erase_letters(px, (44, 403, 59, 422), width, height)
        for x, y, color in stolen:
            px[x - 7, y] = color
        changed = True

    # Large right crate: AXPORT's A still has a right leg beside the following X.
    if _letter(px[880, 572]):
        _erase_letters(px, (872, 564, 885, 598), width, height)
        ink = (16, 6, 0)
        for y in range(566, 596):
            for x in range(874, 877):
                px[x, y] = ink
        for y in range(566, 570):
            for x in range(874, 884):
                px[x, y] = ink
        for y in range(578, 582):
            for x in range(874, 882):
                px[x, y] = ink
        for y in range(591, 596):
            for x in range(874, 884):
                px[x, y] = ink
        changed = True

    # Small foreground crate: wipe the side-face stencil. The drawn E is not kept.
    if _blank_floor_crate_label(image_rgb):
        changed = True

    if image.mode != "RGB":
        image.paste(image_rgb)
    return changed


def paint(source: Image.Image, key: str, title: str, body: str) -> Image.Image:
    image = source.convert("RGB")
    x0, y0, x1, y1 = CLEAR[key]
    before = image.copy()
    draw = ImageDraw.Draw(image)
    draw.rectangle((x0, y0, x1, y1), fill=(255, 255, 255))

    max_width = (x1 - x0) - 24
    title_font, title_track = fit_font(title, max_width, 34, 26, 0.7)
    body_font, body_track = fit_font(body, max_width, 22, 15, 0.2)
    title_h, title_top = ink_box(title, title_font)
    body_h, body_top = ink_box(body, body_font)
    gap = 8
    block = title_h + gap + body_h
    ink_top = y0 + max(4, ((y1 - y0) - block) / 2)
    center = (x0 + x1) / 2

    title_w = text_width(title, title_font, title_track)
    draw_tracked(draw, center - title_w / 2, ink_top - title_top, title, title_font, title_track)
    body_w = text_width(body, body_font, body_track)
    body_ink = ink_top + title_h + gap
    draw_tracked(draw, center - body_w / 2, body_ink - body_top, body, body_font, body_track)

    changed_outside = 0
    before_px = before.load()
    after_px = image.load()
    width, height = image.size
    for y in range(height):
        for x in range(width):
            if before_px[x, y] != after_px[x, y] and not (x0 <= x <= x1 and y0 <= y <= y1):
                changed_outside += 1
    if changed_outside:
        raise SystemExit(f"{key}: caption paint touched {changed_outside} pixels outside the banner")
    return image


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: localize-pit-stop.py captions.json")
    captions = json.loads(Path(sys.argv[1]).read_text())
    deliver_path = SOURCE_DIR / "deliver.png"
    deliver = Image.open(deliver_path).convert("RGB")
    if repair_deliver_labels(deliver):
        deliver.save(deliver_path)
        print("repaired deliver crate labels in source")
    for locale, stations in captions.items():
        dest_dir = OUT_DIR / locale
        dest_dir.mkdir(parents=True, exist_ok=True)
        for key, caption in stations.items():
            source = Image.open(SOURCE_DIR / f"{key}.png")
            painted = paint(source, key, caption["title"], caption["body"])
            info = PngImagePlugin.PngInfo()
            info.add_itxt("pit-stop-caption", f"{caption['title']}\n{caption['body']}")
            painted.save(dest_dir / f"{key}.png", optimize=True, pnginfo=info)
            print(f"wrote {locale}/{key}.png")


if __name__ == "__main__":
    main()
