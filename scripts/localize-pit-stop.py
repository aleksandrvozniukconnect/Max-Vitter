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
