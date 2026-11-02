#!/usr/bin/env python3
"""Rewrite the `pit-stop-caption` text chunk of the localized storyboard PNGs.

The pictures carry the step title and body as metadata (checked by
src/content/pitStopArt.test.ts). Run this after changing a step's title or
body in the dictionaries; pixels are not touched. Usage:
    python3 scripts/refresh-pit-stop-captions.py uk:design:"Технічна частина":"Конструктори ..."
Each argument is locale:step:title:body, taken from src/i18n/<locale>.ts.
"""

import sys
from pathlib import Path

from PIL import Image
from PIL.PngImagePlugin import PngInfo

ROOT = Path(__file__).resolve().parents[1]
STEPS = ("consult", "design", "confirm", "manufacture", "deliver", "support")
STAGE = {"en": "STAGE", "uk": "ЕТАП", "ru": "ЭТАП"}


def main() -> None:
    for arg in sys.argv[1:]:
        locale, step, title, body = arg.split(":", 3)
        index = STEPS.index(step) + 1
        lang = locale
        caption_title = f"{STAGE[locale]} {index} • {title.upper()}"
        caption_body = body.rstrip(".").upper()
        path = ROOT / "public" / "images" / "pit-stop" / locale / f"{step}.png"
        image = Image.open(path)
        info = PngInfo()
        for key, value in image.info.items():
            if key == "pit-stop-caption" or not isinstance(value, str):
                continue
            info.add_text(key, value)
        info.add_itxt("pit-stop-caption", f"{caption_title}\n{caption_body}")
        image.save(path, "PNG", pnginfo=info)
        print(f"{lang}/{step}")


if __name__ == "__main__":
    main()
