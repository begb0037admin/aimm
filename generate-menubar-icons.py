#!/usr/bin/env python3
"""Extract each AppIcon's white glyph into embedded 1x and 2x menu images."""

import base64
from io import BytesIO
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent
APPS = (
    ("plugin-companion", "AIMMPluginCompanion"),
    ("audio-reference-companion", "AIMMReferenceCompanion"),
)


def png_data(image):
    output = BytesIO()
    image.save(output, format="PNG", optimize=True)
    return base64.b64encode(output.getvalue()).decode("ascii")


for directory, target in APPS:
    source = Image.open(ROOT / directory / "assets/AppIcon-1024.png").convert("RGBA")
    # The coloured background has high channel spread; the white glyph has none.
    background = source.getpixel((source.width // 2, source.height // 5))
    spread = max(background[:3]) - min(background[:3])
    alpha = Image.new("L", source.size)
    alpha.putdata([
        max(0, min(255, round((1 - (max(r, g, b) - min(r, g, b)) / spread) * a)))
        for r, g, b, a in source.get_flattened_data()
    ])
    bounds = alpha.point(lambda value: 255 if value > 30 else 0).getbbox()
    alpha = alpha.crop(bounds)
    images = []
    for height in (18, 36):
        width = round(alpha.width * height / alpha.height)
        mask = alpha.resize((width, height), Image.Resampling.LANCZOS)
        image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        image.putalpha(mask)
        images.append((width, height, png_data(image)))
    swift = '''import AppKit

enum MenuBarGlyph {
    static let image: NSImage = {
        let image = NSImage(size: NSSize(width: %d, height: 18))
        for encoded in [
            "%s",
            "%s"
        ] {
            let data = Data(base64Encoded: encoded)!
            let representation = NSBitmapImageRep(data: data)!
            representation.size = image.size
            image.addRepresentation(representation)
        }
        image.isTemplate = true
        return image
    }()
}
''' % (images[0][0], images[0][2], images[1][2])
    destination = ROOT / directory / "Sources" / target / "MenuBarGlyph.swift"
    destination.write_text(swift)
    print(f"{directory}: crop {bounds}, sizes {images[0][:2]} and {images[1][:2]}")
