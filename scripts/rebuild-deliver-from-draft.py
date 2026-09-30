#!/usr/bin/env python3
"""Rebuild localized deliver.png files from public/images/pit-stop/deliver-draft-v2.jpg."""

from __future__ import annotations

import importlib.util
import json
import os
import sys
from pathlib import Path

from PIL import Image, PngImagePlugin

ROOT = Path(__file__).resolve().parents[1]
DRAFT = ROOT / "public" / "images" / "pit-stop" / "deliver-draft-v2.jpg"
SOURCE = ROOT / "scripts" / "pit-stop-source" / "deliver.png"
CAPTIONS = Path(os.environ["TEMP"]) / "pit-stop-captions.json"


def load_loc():
    spec = importlib.util.spec_from_file_location(
        "localize_pit_stop", ROOT / "scripts" / "localize-pit-stop.py"
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def main() -> None:
    if not DRAFT.is_file():
        raise SystemExit(f"missing draft: {DRAFT}")
    if not CAPTIONS.is_file():
        raise SystemExit(f"missing captions json: {CAPTIONS} (run npm run pit-stop:art setup or vite captions export)")

    loc = load_loc()
    im = Image.open(DRAFT).convert("RGB")
    if im.size != (1152, 864):
        im = im.resize((1152, 864), Image.LANCZOS)
    im.save(SOURCE)

    deliver = im.copy()
    if loc.repair_deliver_labels(deliver):
        deliver.save(SOURCE)
        print("repaired deliver source")

    captions = json.loads(CAPTIONS.read_text(encoding="utf-8"))
    for locale in ("en", "uk", "ru"):
        cap = captions[locale]["deliver"]
        painted = loc.paint(deliver, "deliver", cap["title"], cap["body"])
        info = PngImagePlugin.PngInfo()
        info.add_itxt("pit-stop-caption", f"{cap['title']}\n{cap['body']}")
        out = ROOT / "public" / "images" / "pit-stop" / locale / "deliver.png"
        painted.save(out, optimize=True, pnginfo=info)
        print(f"wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
