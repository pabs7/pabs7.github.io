"""Genera assets/img/fondo-cielo.webp: franja de cielo pixel art que se coloca encima de
fondo-sierra.webp para dar aire a las cotas de los picos más altos.

Su fila inferior continúa exactamente la fila superior de la ilustración (incluida la nube que
toca el borde), de modo que el empalme no se nota.

Uso (requiere Pillow):  python tools/cielo.py
"""

import random
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "img" / "fondo-sierra.webp"
OUT = ROOT / "assets" / "img" / "fondo-cielo.webp"

HEIGHT = 180
BLOCK = 3  # tamaño del "píxel" de la ilustración
ZENITH = (52, 50, 112)
BAND = 18  # alto de cada banda del degradado
STAR = (214, 216, 242)

src = Image.open(SRC).convert("RGB")
W = src.width
spx = src.load()
base = spx[W // 2 - 100, 0]

sky = Image.new("RGB", (W, HEIGHT))
px = sky.load()


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


bands = HEIGHT // BAND
for y in range(HEIGHT):
    band_from_bottom = (HEIGHT - 1 - y) // BAND
    color = lerp(base, ZENITH, (band_from_bottom + 1) / (bands + 1)) if band_from_bottom else base
    # tramado de transición entre bandas, como en el resto del cielo pixel art
    edge = (HEIGHT - 1 - y) % BAND
    upper = lerp(base, ZENITH, (band_from_bottom + 2) / (bands + 1))
    for x in range(W):
        c = color
        if edge >= BAND - BLOCK and ((x // BLOCK) % 2 == 0):
            c = upper
        px[x, y] = c

# Continúa hacia arriba todo lo que toca el borde superior y no es cielo liso (la nube).
for x in range(W):
    top = spx[x, 0]
    if sum(abs(a - b) for a, b in zip(top, base)) <= 18:
        continue
    # cúpula redondeada: más alta en el centro del tramo
    left = x
    while left > 0 and sum(abs(a - b) for a, b in zip(spx[left - 1, 0], base)) > 18:
        left -= 1
    right = x
    while right < W - 1 and sum(abs(a - b) for a, b in zip(spx[right + 1, 0], base)) > 18:
        right += 1
    t = (x - left) / max(1, right - left)
    rise = int(4 * BLOCK * (1 - (2 * t - 1) ** 2))
    rise -= rise % BLOCK
    for dy in range(rise):
        px[x, HEIGHT - 1 - dy] = top

rng = random.Random(7)
for _ in range(22):
    sx = rng.randrange(0, W - BLOCK, BLOCK)
    sy = rng.randrange(0, HEIGHT - 2 * BLOCK * 2, BLOCK)
    for dx in range(BLOCK):
        for dy in range(BLOCK):
            px[sx + dx, sy + dy] = STAR

sky.save(OUT, format="WEBP", quality=85, method=6)
print(f"{OUT.relative_to(ROOT)}: {W}x{HEIGHT}, {OUT.stat().st_size} bytes")
