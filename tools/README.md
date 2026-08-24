# Asset extraction

These are the scripts that produced most of `public/media/` from the six source
PDFs. They are kept so the provenance of every image on the site is traceable.

Provenance splits in two, and the two are deliberately kept in separate files:

| Registry | Source | Edited by |
| --- | --- | --- |
| `src/data/media.json` | The six company profile PDFs — the companies' own photography | Generated. Edit `assets.py` and re-run. |
| `src/data/media-sourced.json` | Stock-licensed frames, for the capability cards on `/developers` and `/renewables`, where the profiles carry no photograph of that line of work | Hand-authored. |

`Media.tsx` merges the two into one lookup. Every key in the second file has a
licence record in `image-credits.json` at the repository root, with author,
licence and source URL; no key in the first file appears there. That is the
check: if a `media-sourced.json` key has no credit entry, something was added
without recording where it came from.

Run from the project root with the PDFs in the parent directory. Requires
`PyMuPDF`, `Pillow` and (for `marks.py`) `numpy`.

| Script | Does |
| --- | --- |
| `crop.py` | The Sangam Developers profile is a scanned raster — one image per page. This finds the photograph rectangles on the "Nature of Work" and "CSR" pages by connected-component analysis and crops them out. |
| `marks.py` | Cuts the two Sangam marks and the twelve client marks out of the profile pages, trims each to its ink, flood-fills the page ground away from the border inward so interior white survives, and writes alpha WebP into `public/media/logos`. Supersedes `logos.py`. |
| `logos.py` | Superseded by `marks.py`; kept for provenance of the first company-mark crops. |
| `assets.py` | Extracts embedded photographs from the Renewables profile, resizes everything to WebP at up to three widths, samples a dominant colour for each, and writes `src/data/media.json`. |

`media.json` is generated — edit `assets.py` and re-run rather than editing it
by hand. Alt text for each asset is authored in `assets.py`.
