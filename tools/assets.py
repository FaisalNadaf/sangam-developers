from PIL import Image
import os, json, colorsys

OUT = 'public/media'
WIDTHS = [640, 1280, 1920]
manifest = {}


def dominant(im):
    s = im.convert('RGB').resize((48, 48), Image.BILINEAR)
    tot = [0, 0, 0]
    n = 0
    for r, g, b in s.get_flattened_data() if hasattr(s, 'get_flattened_data') else list(s.getdata()):
        if r > 247 and g > 247 and b > 247:
            continue
        tot[0] += r; tot[1] += g; tot[2] += b; n += 1
    if not n:
        return '#1a1a1a'
    r, g, b = [v // n for v in tot]
    h, l, s2 = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    l = min(l, 0.42)
    r, g, b = [int(v * 255) for v in colorsys.hls_to_rgb(h, l, s2)]
    return '#%02x%02x%02x' % (r, g, b)


def emit(src, folder, name, alt, maxw=1920):
    im = Image.open(src)
    if im.mode in ('P', 'LA', 'RGBA'):
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1])
        im = bg
    im = im.convert('RGB')
    d = OUT + '/' + folder
    os.makedirs(d, exist_ok=True)
    W, H = im.size
    color = dominant(im)
    widths = []
    for w in WIDTHS:
        if w > min(W, maxw) and widths:
            break
        w = min(w, W, maxw)
        if w in widths:
            continue
        r = im.resize((w, max(1, round(H * w / W))), Image.LANCZOS)
        r.save(d + '/' + name + '-' + str(w) + '.webp', 'WEBP',
               quality=80 if w >= 1280 else 82, method=6)
        widths.append(w)
    key = folder + '/' + name
    manifest[key] = {'name': name, 'folder': folder, 'widths': widths, 'w': W, 'h': H,
                     'ratio': round(W / H, 4), 'color': color, 'alt': alt}
    print('%-46s %dx%d %s %s' % (key, W, H, widths, color))


E = '.dist/extract'

SD = [
    ('p08_02', 'tower-lineman', 'Sangam Developers linesman working at height on a 33 kV double-pole transmission structure'),
    ('p08_01', 'substation-lattice', 'Lattice tower and switchyard gantry at an EHV substation built by Sangam Developers'),
    ('p08_06', 'dusk-line', 'Overhead transmission line silhouetted against dusk on a Sangam Developers project corridor'),
    ('p08_05', 'sunset-poles', 'Newly strung transmission poles running across farmland at sunset'),
    ('p08_00', 'pole-transport', 'Tractor-hauled trailer moving a transmission pole along a village road to site'),
    ('p08_03', 'crane-material', 'Crane and crew handling steel pole sections at a Sangam Developers line site'),
    ('p08_04', 'row-corridor', 'Right-of-way corridor cleared through ploughed farmland for a transmission line'),
    ('p09_00', 'tower-erection', 'Crane erecting a steel transmission structure on a Sangam Developers project'),
    ('p09_01', 'conductor-stringing', 'Linesman stringing conductor on a 33 kV double-pole structure'),
    ('p09_02', 'piling-rig', 'Piling rig drilling a foundation beside an erected transmission structure'),
    ('p09_03', 'mms-assembly', 'Site crew assembling a module mounting structure on a solar project'),
    ('p09_04', 'lattice-field', 'Line of lattice transmission towers crossing open agricultural land'),
    ('p09_05', 'mms-crew', 'Crew in high-visibility gear bolting up module mounting structures on site'),
    ('p09_06', 'dp-structure', 'Completed double-pole structure with jumpers and insulators against an open sky'),
    ('p09_07', 'dp-structure-2', 'Detail of a double-pole transmission structure with conductor terminations'),
    ('p10_00', 'site-team', 'Sangam Developers site team and workforce photographed together at a project site'),
    ('p10_01', 'csr-school', 'Sangam Developers handing over computer equipment to a village school'),
    ('p10_02', 'csr-gathering', 'Community gathering hosted under the Sangam Renewables and Electrosystems LLP banner'),
    ('p10_03', 'csr-handover', 'Sangam Developers representatives at a community handover ceremony'),
    ('p10_04', 'csr-felicitation', 'Felicitation ceremony attended by Sangam Developers representatives'),
]
for f, n, a in SD:
    emit(E + '/sd/' + f + '.jpg', 'developers', n, a)

SRE = [
    ('p01_x1987', 'solar-farm', 'Utility-scale ground-mounted solar array running toward a rocky hill range'),
    ('p01_x1988', 'wind-farm', 'Row of wind turbines on open ground under a clouded sky'),
    ('p04_x509', 'solar-rows-aerial', 'Overhead view of long rows of photovoltaic modules'),
    ('p05_x564', 'solar-field-wide', 'Wide view of a ground-mounted solar plant under a clear blue sky'),
    ('p08_x797', 'engineers-panels', 'Two engineers inspecting a ground-mounted photovoltaic array on site'),
    ('p08_x798', 'solar-bloom', 'Photovoltaic array with wildflowers growing along the module rows'),
    ('p09_x840', 'solar-dusk', 'Photovoltaic modules catching low sun at dusk'),
    ('p12_x961', 'wind-hilltop', 'Wind turbine standing on a ridgeline above open country'),
    ('p15_x1912', 'solar-green-field', 'Solar array set in green farmland with hills behind'),
    ('p17_x1746', 'roller-wtg-base', 'Soil compactor working the platform at the base of a wind turbine generator'),
    ('p17_x1747', 'compactor', 'Vibratory roller compacting a newly cut internal access road'),
    ('p17_x1748', 'access-road', 'Compacted internal access road built to a wind turbine location'),
    ('p17_x1750', 'haul-road', 'Graded haul road curving through scrub toward a project site'),
    ('p17_x1751', 'gravel-road', 'Freshly laid gravel road surface on a renewable energy site'),
    ('p18_x1755', 'turbine-blade', 'Wind turbine rotor and nacelle seen from directly beneath'),
    ('p18_x1756', 'ht-line-field', 'HT distribution line running along a field boundary on a project site'),
    ('p18_x1757', 'drill-rig', 'Drilling rig at work on a foundation beside an erected structure'),
    ('p18_x1758', 'crane-erection', 'Crane lifting a steel structure into position during erection works'),
    ('p18_x1760', 'site-crew', 'Sangam Renewables site crew in high-visibility gear at a project location'),
    ('p18_x1762', 'crew-wide', 'Full site workforce assembled on a Sangam Renewables project'),
    ('p18_x1763', 'cable-laying', 'Crew guiding a steel member during cable and structure installation'),
    ('p18_x1764', 'ofc-trench', 'Ground works under way alongside an erected transmission structure'),
    ('p19_x1770', 'mms-install', 'Module mounting structure being installed on a solar site'),
    ('p19_x1771', 'panel-mount', 'Technician fixing a photovoltaic module onto its mounting structure'),
    ('p19_x1772', 'inverter', 'Wall-mounted solar inverter installed and commissioned'),
    ('p19_x1773', 'panel-board', 'Technician working inside an electrical distribution panel'),
    ('p19_x1774', 'structure-shed', 'Completed steel structure over a mounted photovoltaic installation'),
    ('p19_x1775', 'container-yard', 'Site container and equipment yard on a renewable energy project'),
    ('p24_x1842', 'solar-wind-sunset', 'Solar array and wind turbines together at sunset'),
    ('p22_x1801', 'csr-vehicle', 'Community gathering at a Sangam Renewables CSR activity'),
    ('p22_x1803', 'csr-group', 'Group photograph from a Sangam Renewables community programme'),
    ('p22_x1807', 'csr-meeting', 'Sangam Renewables representatives at a community meeting'),
    ('p23_x1816', 'csr-programme', 'Attendees at a Sangam Renewables community programme'),
]
for f, n, a in SRE:
    src = E + '/sre/' + f + '.jpeg'
    if not os.path.exists(src):
        src = E + '/sre/' + f + '.jpg'
    emit(src, 'renewables', n, a)

TEAM = [
    ('p20_x1783', 'ravikumar-bagali', 'Portrait of Mr. Ravikumar Bagali, B.E. (ECE)'),
    ('p20_x1784', 'rashmi-bagali', 'Portrait of Ms. Rashmi Ravikumar Bagali'),
    ('p20_x1785', 'mahesh', 'Portrait of Mr. Mahesh'),
    ('p20_x1786', 'siddharam-houde', 'Portrait of Mr. Siddharam Rajendra Houde'),
]
for f, n, a in TEAM:
    emit(E + '/sre/' + f + '.jpeg', 'group', n, a, maxw=640)

CERT = [
    ('sd_qlty_01', 'sd-iso-9001', 'ISO 9001:2015 quality management certificate issued to Sangam Developers'),
    ('sd_sfty_01', 'sd-iso-45001', 'ISO 45001:2018 occupational health and safety certificate issued to Sangam Developers'),
    ('sre_qlty_01', 'sre-iso-9001', 'ISO 9001:2015 quality management certificate issued to Sangam Renewables and Electrosystems LLP'),
    ('sre_sfty_01', 'sre-iso-45001', 'ISO 45001:2018 occupational health and safety certificate issued to Sangam Renewables and Electrosystems LLP'),
]
for f, n, a in CERT:
    emit('.dist/pdfpages/' + f + '.png', 'certificates', n, a, maxw=1280)

os.makedirs(OUT + '/logos', exist_ok=True)
for src, name in [('.dist/logo_sd_raw.png', 'sangam-developers'),
                  ('.dist/logo_sr_raw.png', 'sangam-renewables')]:
    im = Image.open(src).convert('RGBA')
    px = im.load()
    W, H = im.size
    for y in range(H):
        for x in range(W):
            r, g, b, _ = px[x, y]
            if r > 238 and g > 238 and b > 238:
                px[x, y] = (r, g, b, 0)
    im = im.crop(im.getbbox())
    im.thumbnail((900, 900), Image.LANCZOS)
    im.save(OUT + '/logos/' + name + '.png')
    print('logo ' + name, im.size)

os.makedirs('src/data', exist_ok=True)
json.dump(manifest, open('src/data/media.json', 'w'), indent=1)
print('')
print('assets: %d' % len(manifest))
