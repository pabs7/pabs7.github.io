"""Genera js/sierra.js: las zonas interactivas de cada pico de la ilustración de fondo.

Detecta la línea del horizonte (frontera cielo/montaña), localiza los picos por prominencia
topográfica y asigna a cada uno la franja de montaña entre sus dos collados.

Uso (requiere Pillow):  python tools/picos.py
Volver a ejecutarlo solo si cambia assets/img/fondo-sierra.webp.
"""

import colorsys
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "img" / "fondo-sierra.webp"
OUT = ROOT / "js" / "sierra.js"

MIN_PROMINENCE = 15
RUN = 6  # píxeles seguidos de "no cielo" para considerar montaña (ignora estrellas)
MOON = (1010, 25, 1065, 80)  # la luna no es montaña
EDGE_MARGIN = 30
BODY_DEPTH = 90
BODY_MAX_Y = 340
RDP_TOLERANCE = 1.5
# Picos preferidos para los proyectos (x aproximada de la cima), en orden de importancia.
PRIORITY_X = [1145, 259, 676, 988, 358, 487]

img = Image.open(SRC).convert("RGB")
W, H = img.size
px = img.load()


def is_sky(x, y):
    if MOON[0] <= x <= MOON[2] and MOON[1] <= y <= MOON[3]:
        return True
    r, g, b = px[x, y]
    h, s, _ = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    h *= 360
    return s >= 0.30 and (h >= 232 or h <= 50)


def first_ground(x):
    y = 0
    while y < H - RUN:
        if all(not is_sky(x, y + k) for k in range(RUN)):
            return y
        y += 1
    return y


skyline = [first_ground(x) for x in range(W)]


def saddle(x, y, direction):
    """Punto más bajo del horizonte antes de encontrar terreno más alto que (x, y)."""
    best_y, best_x = y, x
    i = x + direction
    while 0 <= i < W:
        if skyline[i] < y:
            return best_y, best_x
        if skyline[i] > best_y:
            best_y, best_x = skyline[i], i
        i += direction
    return None, best_x


peaks = []
for x in range(1, W - 1):
    y = skyline[x]
    if not (y <= skyline[x - 1] and y <= skyline[x + 1]):
        continue
    ly, _ = saddle(x, y, -1)
    ry, _ = saddle(x, y, 1)
    sides = [v for v in (ly, ry) if v is not None]
    prominence = (min(sides) - y) if sides else H
    if prominence < MIN_PROMINENCE:
        continue
    last = peaks[-1] if peaks else None
    if last and abs(last["y"] - y) <= 2 and x - last["x_end"] <= 10:
        last["x_end"] = x
        continue
    peaks.append({"x": x, "x_end": x, "y": y, "prominence": prominence})

for p in peaks:
    p["x"] = (p["x"] + p.pop("x_end")) // 2

# Los acantilados de los bordes tocan el marco: no tienen cima visible.
peaks = [p for p in peaks if p["y"] >= 20 and EDGE_MARGIN <= p["x"] <= W - EDGE_MARGIN]

for i, p in enumerate(peaks):
    if i == 0:
        p["left"] = saddle(p["x"], p["y"], -1)[1]
    else:
        prev = peaks[i - 1]
        p["left"] = max(range(prev["x"], p["x"] + 1), key=lambda k: skyline[k])
        prev["right"] = p["left"]
peaks[-1]["right"] = saddle(peaks[-1]["x"], peaks[-1]["y"], 1)[1]


def rdp(points, eps):
    if len(points) < 3:
        return points
    (x1, y1), (x2, y2) = points[0], points[-1]
    dx, dy = x2 - x1, y2 - y1
    norm = (dx * dx + dy * dy) ** 0.5 or 1
    dists = [abs(dy * x - dx * y + x2 * y1 - y2 * x1) / norm for x, y in points[1:-1]]
    idx = max(range(len(dists)), key=dists.__getitem__)
    if dists[idx] <= eps:
        return [points[0], points[-1]]
    split = idx + 1
    return rdp(points[: split + 1], eps)[:-1] + rdp(points[split:], eps)


ranked = []
for target in PRIORITY_X:
    match = min(peaks, key=lambda p: abs(p["x"] - target))
    if abs(match["x"] - target) <= 25 and match not in ranked:
        ranked.append(match)
ranked += sorted((p for p in peaks if p not in ranked), key=lambda p: -p["prominence"])

result = []
for p in peaks:
    ridge = rdp([(x, skyline[x]) for x in range(p["left"], p["right"] + 1)], RDP_TOLERANCE)
    bottom = min(max(skyline[p["left"]:p["right"] + 1]) + BODY_DEPTH, BODY_MAX_Y)
    outline = ridge + [(p["right"], bottom), (p["left"], bottom)]
    result.append(
        {
            "rank": ranked.index(p) + 1,
            "apex": [p["x"], p["y"]],
            "points": " ".join(f"{x},{y}" for x, y in outline),
        }
    )

OUT.write_text(
    "// Generado por tools/picos.py a partir de assets/img/fondo-sierra.webp. No editar a mano.\n"
    "// Picos de izquierda a derecha; rank 1 = el pico que recibe el proyecto más destacado.\n\n"
    f"export const SIERRA = {{ width: {W}, height: {H} }};\n\n"
    f"export const PEAKS = {json.dumps(result, indent=2)};\n",
    encoding="utf-8",
)
print(f"{len(result)} picos -> {OUT.relative_to(ROOT)}")
for r in result:
    print(r["rank"], r["apex"])
