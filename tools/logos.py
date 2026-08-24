from PIL import Image
import os
os.makedirs('public/media/logos', exist_ok=True)

# SD logo: white box top-right of Sangam Developers cover page
sd = Image.open('.dist/pdfpages/sd_01.png').convert('RGB')
W,H = sd.size
crop = sd.crop((int(.512*W), int(.033*H), int(.740*W), int(.104*H)))
crop.save('.dist/logo_sd_raw.png')
print('sd', crop.size)

# SR logo: centre-left of the Renewables cover page
import fitz
d = fitz.open('../Sangam_Renewables_ company profile_21MB (24 Page).pdf')
pix = d[0].get_pixmap(dpi=400)
pix.save('.dist/sre_cover_hi.png')
sr = Image.open('.dist/sre_cover_hi.png').convert('RGB')
W,H = sr.size
crop = sr.crop((int(.13*W), int(.505*H), int(.50*W), int(.66*H)))
crop.save('.dist/logo_sr_raw.png')
print('sr', crop.size)
