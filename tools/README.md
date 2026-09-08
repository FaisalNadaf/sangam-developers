# Asset extraction

These are the scripts that produced most of `public/media/` from the six source
PDFs. They are kept so the provenance of every image on the site is traceable.

Provenance splits in two, and the two are deliberately kept in separate files:

| Registry | Source | Edited by |
| --- | --- | --- |
| `src/data/media.json` | The six company profile PDFs — the companies' own photography | Generated. Edit `assets.py` and re-run. |
| `src/data/media-sourced.json` | Stock-licensed frames, for the capability cards on `/developers` and `/renewables`, where the profiles carry no photograph of that line of work | Hand-authored. |
| `src/data/media-supplied.json` | Portraits handed over by the company directly, for people who joined after the profiles were printed | Generated. Add the original to `tools/source/team/`, add a line to `team.py`, re-run. |

`Media.tsx` merges the three into one lookup. Every key in the *sourced* file
has a licence record in `image-credits.json` at the repository root, with
author, licence and source URL; no key in the other two appears there. That is
the check: if a `media-sourced.json` key has no credit entry, something was
added without recording where it came from.

Supplied portraits are a separate file rather than extra lines in `media.json`
for a mechanical reason as well as a provenance one — `assets.py` rewrites
`media.json` whole from `.dist/extract`, so anything added there by hand is
dropped the next time it runs. `team.py` owns `media-supplied.json` the same
way, and is the one script here that still runs from a clean checkout: its
originals are committed, the PDFs are not.

Run from the project root with the PDFs in the parent directory. Requires
`PyMuPDF`, `Pillow` and (for `marks.py`) `numpy`.

| Script | Does |
| --- | --- |
| `crop.py` | The Sangam Developers profile is a scanned raster — one image per page. This finds the photograph rectangles on the "Nature of Work" and "CSR" pages by connected-component analysis and crops them out. |
| `marks.py` | Cuts the two Sangam marks and the twelve client marks out of the profile pages, trims each to its ink, flood-fills the page ground away from the border inward so interior white survives, and writes alpha WebP into `public/media/logos`. Supersedes `logos.py`. |
| `logos.py` | Superseded by `marks.py`; kept for provenance of the first company-mark crops. |
| `assets.py` | Extracts embedded photographs from the Renewables profile, resizes everything to WebP at up to three widths, samples a dominant colour for each, and writes `src/data/media.json`. |
| `team.py` | Converts the company-supplied portraits in `tools/source/team/` to WebP, never upscaling past the original, and writes `src/data/media-supplied.json`. |

`media.json` is generated — edit `assets.py` and re-run rather than editing it
by hand. Alt text for each asset is authored in `assets.py`.
