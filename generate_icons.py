"""Generates PWA icons as PNG files with no external dependencies."""
import struct
import zlib
import os

def make_png(size):
    """Creates a purple-gradient branded PNG icon."""
    rows = []
    for y in range(size):
        row = [0]  # filter byte
        for x in range(size):
            # Background: deep purple gradient
            r = int(80 + (x / size) * 60)
            g = int(20 + (y / size) * 30)
            b = int(180 + (x / size) * 60)

            # Draw a rounded rect border glow
            cx, cy = size / 2, size / 2
            dx, dy = abs(x - cx) / cx, abs(y - cy) / cy
            dist = max(dx, dy)
            if dist > 0.85:
                r = int(r * 0.4)
                g = int(g * 0.4)
                b = int(b * 0.4)

            # Draw a white "T" in the center
            s = size
            # Horizontal bar of T
            if int(s * 0.28) <= y <= int(s * 0.42) and int(s * 0.20) <= x <= int(s * 0.80):
                r, g, b = 255, 255, 255
            # Vertical bar of T
            elif int(s * 0.42) <= y <= int(s * 0.78) and int(s * 0.42) <= x <= int(s * 0.58):
                r, g, b = 255, 255, 255

            row += [r, g, b]
        rows.append(bytes(row))

    raw = b"".join(rows)
    compressed = zlib.compress(raw, 9)

    def chunk(tag, data):
        c = tag + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
    png += chunk(b"IDAT", compressed)
    png += chunk(b"IEND", b"")
    return png

out = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(out, exist_ok=True)

for size in [192, 512]:
    path = os.path.join(out, f"icon-{size}.png")
    with open(path, "wb") as f:
        f.write(make_png(size))
    print(f"Created {path}")

print("Done.")
