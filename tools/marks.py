"""
Company marks and client marks.

Every logo used on the site is cut from the company's own profile documents:

  • The Sangam Developers "SD" mark        — SD profile, cover
  • The Sangam Renewables "SR" mark        — SRE profile, cover
  • Ten client marks                       — SD profile, "Our Valuable Clients"
  • Two further client marks               — SRE profile, "Our Valuable Clients"

Nothing here is redrawn or sourced elsewhere. Boxes were found by scanning the
rendered page for bands of non-white pixels and then clustering columns inside
each band; the numbers below are that scan's output, so a re-run reproduces the
same crops.

Each mark is trimmed to its ink, has its page background flood-filled away from
the border inward (so white *inside* a mark — the HESCOM roundel, the counters
in "adani" — survives), and is written as an alpha WebP capped at 2x its
largest on-page display size.

Run from the project root with the PDFs in the parent directory.
"""

import json
import os
from collections import deque

import fitz
import numpy as np
from PIL import Image

SD_PDF = '../Sangam_Developers_Profile 2025-26  (11 Page).pdf'
SRE_PDF = '../Sangam_Renewables_ company profile_21MB (24 Page).pdf'
OUT = 'public/media/logos'
MAX_W = 640

os.makedirs(OUT, exist_ok=True)
manifest = {}


def render(pdf, page, dpi):
    pix = fitz.open(pdf)[page].get_pixmap(dpi=dpi)
    return Image.frombytes('RGB', (pix.width, pix.height), pix.samples)


def cut_background(im, tol=26):
    """Flood-fill the page ground away from the border, leaving interior white."""
    im = im.convert('RGBA')
    a = np.asarray(im).astype(int)
    h, w = a.shape[:2]
    # Seed colour is whatever the corners agree on — white on every page here.
    seed = a[0, 0, :3]
    near = (np.abs(a[:, :, :3] - seed).max(axis=2) <= tol)

    out = np.zeros((h, w), dtype=bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if near[y, x] and not out[y, x]:
                out[y, x] = True
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if near[y, x] and not out[y, x]:
                out[y, x] = True
                q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and near[ny, nx] and not out[ny, nx]:
                out[ny, nx] = True
                q.append((ny, nx))

    alpha = np.asarray(im)[:, :, 3].copy()
    alpha[out] = 0
    rgba = np.dstack([np.asarray(im)[:, :, :3], alpha])
    return Image.fromarray(rgba.astype('uint8'), 'RGBA')


def trim(im, pad=0):
    box = im.split()[-1].getbbox()
    if not box:
        return im
    l, t, r, b = box
    return im.crop((max(0, l - pad), max(0, t - pad),
                    min(im.width, r + pad), min(im.height, b + pad)))


def emit(im, name, alt, max_w=MAX_W):
    im = trim(cut_background(im))
    if im.width > max_w:
        im = im.resize((max_w, max(1, round(im.height * max_w / im.width))), Image.LANCZOS)
    path = f'{OUT}/{name}.webp'
    im.save(path, 'WEBP', quality=92, method=6, lossless=False, exact=True)
    manifest[name] = {'w': im.width, 'h': im.height, 'alt': alt}
    print('%-28s %4d x %4d  %6.1f kB' % (name, im.width, im.height, os.path.getsize(path) / 1024))


# ── Company marks ────────────────────────────────────────────────────────────

# The cover mark sits in a white box with a soft drop shadow, which a
# border-seeded fill cannot get behind. The same mark on p. 11 is set inside a
# larger white panel, so cropping within that panel leaves clean white corners.
sd_mark = render(SD_PDF, 10, 400)
W, H = sd_mark.size
emit(sd_mark.crop((int(0.415 * W), int(0.012 * H), int(0.586 * W), int(0.119 * H))),
     'sangam-developers', 'Sangam Developers logo')

sre_cover = render(SRE_PDF, 0, 400)
W, H = sre_cover.size
emit(sre_cover.crop((int(0.13 * W), int(0.505 * H), int(0.50 * W), int(0.66 * H))),
     'sangam-renewables', 'Sangam Renewables logo')

# ── Client marks, Sangam Developers profile p. 11 (300 dpi page scan) ────────

sd_clients = render(SD_PDF, 10, 300)
SD_BOXES = [
    ('adani-solar',      (705, 2310, 1794, 3057), 'Adani Solar logo'),
    ('acciona',          (2751, 2310, 4514, 3057), 'Acciona logo'),
    ('renew-power',      (5144, 2310, 6770, 3057), 'ReNew Power logo'),
    ('siemens-gamesa',   (780, 3453, 3897, 3957), 'Siemens Gamesa Renewable Energy logo'),
    ('suzlon',           (4508, 3453, 6671, 3957), 'Suzlon logo'),
    ('jsw-energy',       (603, 4262, 2181, 5429), 'JSW Energy logo'),
    ('cleanmax',         (2628, 4262, 4790, 5429), 'CleanMax logo'),
    ('mahavitaran',      (5171, 4262, 6833, 5429), 'Mahavitaran (MSEDCL) logo'),
    ('kptcl',            (2010, 5600, 3264, 6866), 'KPTCL logo'),
    ('hescom',           (4202, 5600, 5366, 6866), 'HESCOM logo'),
]
for name, box, alt in SD_BOXES:
    emit(sd_clients.crop(box), name, alt)

# ── Client marks, Sangam Renewables profile p. 21 ────────────────────────────

sre_clients = render(SRE_PDF, 20, 300)
SRE_BOXES = [
    ('waaree',  (136, 1240, 975, 1512), 'Waaree logo'),
    ('sunsure', (616, 1733, 1845, 2021), 'Sunsure logo'),
]
for name, box, alt in SRE_BOXES:
    emit(sre_clients.crop(box), name, alt)

print(json.dumps(manifest, indent=2))
