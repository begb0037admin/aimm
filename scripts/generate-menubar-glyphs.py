#!/usr/bin/env python3
"""Embed 1x/2x monochrome menu-bar glyphs extracted from the app icons."""
from base64 import b64encode
from io import BytesIO
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
TARGETS = [
    ("audio-reference-companion", "AIMMReferenceCompanion"),
    ("plugin-companion", "AIMMPluginCompanion"),
]

for package, module in TARGETS:
    source = Image.open(ROOT / package / "assets/AppIcon-1024.png").convert("RGBA")
    pixels = source.load()
    # The artwork uses a dark coloured background and a solid white glyph.
    mask = Image.new("L", source.size)
    output = mask.load()
    for y in range(source.height):
        for x in range(source.width):
            r, g, b, a = pixels[x, y]
            output[x, y] = round(max(0, min(255, (min(r, g, b) - 160) * 255 / 75)) * a / 255)
    bounds = mask.point(lambda value: 255 if value > 200 else 0).getbbox()
    if bounds is None:
        raise RuntimeError(f"No white glyph found in {package}")
    glyph = mask.crop(bounds)
    encoded = []
    for scale in (1, 2):
        height = 18 * scale
        width = 18 * scale
        alpha = glyph.resize((width, height), Image.Resampling.LANCZOS)
        image = Image.new("RGBA", alpha.size, (0, 0, 0, 0))
        image.putalpha(alpha)
        buffer = BytesIO()
        image.save(buffer, format="PNG")
        encoded.append((width, height, b64encode(buffer.getvalue()).decode("ascii")))
    swift = '''import AppKit

enum MenuBarGlyph {
    static let image: NSImage = {
        let image = NSImage(size: NSSize(width: WIDTH, height: 18))
        for encoded in [
            "ONE",
            "TWO"
        ] {
            let representation = NSBitmapImageRep(data: Data(base64Encoded: encoded)!)!
            representation.size = image.size
            image.addRepresentation(representation)
        }
        image.isTemplate = true
        return image
    }()
}
'''.replace("WIDTH", str(encoded[0][0])).replace("ONE", encoded[0][2]).replace("TWO", encoded[1][2])
    destination = ROOT / package / "Sources" / module / "MenuBarGlyph.swift"
    destination.write_text(swift)
    print(f"{package}: source bounds {bounds}, 1x {encoded[0][:2]}, 2x {encoded[1][:2]}")
