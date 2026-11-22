"""Build the layered assets used by the cinematic hero from ONE real portrait.

Nothing here invents a person: the character layer is a pixel cut-out of the
supplied portrait, the plate is the same photo with the character removed
(OpenCV inpainting), and the fog is procedural noise.

Usage (outside the web build, needs: pip install "rembg[cpu]" opencv-python-headless pillow numpy):
    python scripts/build-cinematic-assets.py path/to/portrait.webp public/cinematic
"""
import json, sys
from pathlib import Path
import numpy as np
import cv2
from PIL import Image, ImageFilter
from rembg import remove, new_session

src_path, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
out_dir.mkdir(parents=True, exist_ok=True)
src = Image.open(src_path).convert('RGB')
W, H = src.size

# 1. Character cut-out (identity preserved: pixels are copied, never regenerated).
cut = remove(src, session=new_session('isnet-general-use'), post_process_mask=True)
alpha = np.array(cut.split()[3])
alpha = cv2.GaussianBlur(alpha, (3, 3), 0)  # soften the hard matte edge by ~1px
x0, y0, x1, y1 = Image.fromarray(alpha).getbbox()
pad = 6
x0, y0, x1, y1 = max(0, x0 - pad), max(0, y0 - pad), min(W, x1 + pad), min(H, y1 + pad)
rgba = np.dstack([np.array(src), alpha])
char = Image.fromarray(rgba, 'RGBA').crop((x0, y0, x1, y1))
char.save(out_dir / 'character.webp', 'WEBP', quality=90, method=6)

# 2. Clean plate: remove the character and rebuild the architecture behind it by
#    copying neighbouring texture along the wall/floor perspective (no generative fill).
mask = (alpha > 4).astype(np.uint8) * 255
core = cv2.dilate(mask, np.ones((31, 31), np.uint8))
bgr = cv2.cvtColor(np.array(src), cv2.COLOR_RGB2BGR).astype(np.float32)
ys, xs = np.mgrid[0:H, 0:W]
COLUMN_EDGE_TOP, COLUMN_EDGE_BASE, BASE_TOP, BASE_BOTTOM = 1245, 1217, 505, 555
edge = np.where(ys < BASE_TOP, COLUMN_EDGE_TOP, COLUMN_EDGE_BASE)
in_column = (xs >= edge) & (ys < BASE_BOTTOM)
SHIFT, SLOPE = 330, 0.226          # wall base rises ~0.226 px per px to the right
sx = np.where(in_column, xs + 80, xs - SHIFT)
sy = np.where(in_column, ys, ys + round(SHIFT * SLOPE))
sy = np.where(sy > H - 1, 2 * (H - 1) - sy, sy)   # reflect instead of clamping (no streaks)
sx, sy = np.clip(sx, 0, W - 1), np.clip(sy, 0, H - 1)
fill = bgr[sy, sx]
fill[in_column] *= 0.58          # the column's left face sits in shade: avoid duplicating the lamp glow
fill = cv2.GaussianBlur(fill, (0, 0), 1.2)
soft = cv2.GaussianBlur(cv2.dilate(mask, np.ones((61, 61), np.uint8)), (0, 0), 9).astype(np.float32) / 255
soft = np.maximum(soft, core.astype(np.float32) / 255)[..., None]
plate = bgr * (1 - soft) + fill * soft
plate = np.clip(plate, 0, 255).astype(np.uint8)
plate_img = Image.fromarray(cv2.cvtColor(plate, cv2.COLOR_BGR2RGB))
plate_img.save(out_dir / 'plate.webp', 'WEBP', quality=84, method=6)

# 3. Static fallback = the untouched original portrait.
src.save(out_dir / 'poster.webp', 'WEBP', quality=86, method=6)

# 4. Procedural, horizontally tileable fog (spectral noise is periodic by construction).
def fog(w, h, seed, falloff):
    r = np.random.default_rng(seed)
    noise = r.normal(size=(h, w))
    fy, fx = np.fft.fftfreq(h)[:, None], np.fft.fftfreq(w)[None, :]
    f = np.sqrt((fx * 2.2) ** 2 + fy ** 2)
    f[0, 0] = 1
    field = np.real(np.fft.ifft2(np.fft.fft2(noise) / f ** falloff))
    field = (field - field.min()) / (field.max() - field.min())
    field = np.clip((field - .38) * 1.9, 0, 1) ** 1.6
    band = np.exp(-((np.linspace(0, 1, h)[:, None] - .62) / .3) ** 2)  # denser near the floor
    a = (field * band * 255 * .85).astype(np.uint8)
    rgb = np.zeros((h, w, 3), np.uint8); rgb[...] = (241, 226, 200)
    return Image.fromarray(np.dstack([rgb, a]), 'RGBA')

fog(768, 288, 3, 1.35).save(out_dir / 'fog-back.webp', 'WEBP', quality=58, method=6)
fog(768, 288, 11, 1.55).save(out_dir / 'fog-front.webp', 'WEBP', quality=58, method=6)

meta = {'source': [W, H], 'character_box': {
    'left': round(x0 / W * 100, 3), 'top': round(y0 / H * 100, 3),
    'width': round((x1 - x0) / W * 100, 3), 'height': round((y1 - y0) / H * 100, 3)}}
(out_dir / 'layers.json').write_text(json.dumps(meta, indent=2))
print(json.dumps(meta))
