from PIL import Image
from collections import deque
import os, sys

os.makedirs('extract/sd', exist_ok=True)

def is_bg(px):
    r,g,b = px[:3]
    if r>238 and g>238 and b>238: return True          # white
    if g>r+25 and g>b+25 and g>110: return True         # brand green panel
    if abs(r-g)<12 and abs(g-b)<12 and r>225: return True
    return False

def components(path, scale_w=340):
    im = Image.open(path).convert('RGB')
    W,H = im.size
    sw = scale_w; sh = int(H*sw/W)
    small = im.resize((sw,sh), Image.BILINEAR)
    px = small.load()
    mask = [[0]*sw for _ in range(sh)]
    for y in range(sh):
        for x in range(sw):
            mask[y][x] = 0 if is_bg(px[x,y]) else 1
    seen=[[False]*sw for _ in range(sh)]
    boxes=[]
    for y in range(sh):
        for x in range(sw):
            if mask[y][x] and not seen[y][x]:
                q=deque([(x,y)]); seen[y][x]=True
                x0=x1=x; y0=y1=y; n=0
                while q:
                    cx,cy=q.popleft(); n+=1
                    x0=min(x0,cx); x1=max(x1,cx); y0=min(y0,cy); y1=max(y1,cy)
                    for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
                        nx,ny=cx+dx,cy+dy
                        if 0<=nx<sw and 0<=ny<sh and mask[ny][nx] and not seen[ny][nx]:
                            seen[ny][nx]=True; q.append((nx,ny))
                bw=x1-x0+1; bh=y1-y0+1
                fill=n/(bw*bh)
                if bw>=sw*0.13 and bh>=sh*0.05 and fill>0.72:
                    boxes.append((x0/sw, y0/sh, (x1+1)/sw, (y1+1)/sh, bw*bh))
    boxes.sort(key=lambda b:-b[4])
    return im, W, H, boxes

for page in sys.argv[1:]:
    path=f'pdfpages/sd_{page}.png'
    im,W,H,boxes = components(path)
    for k,(a,b,c,d,_) in enumerate(boxes):
        crop = im.crop((int(a*W), int(b*H), int(c*W), int(d*H)))
        if crop.width<380 or crop.height<260: continue
        fn=f'extract/sd/p{page}_{k:02d}.jpg'
        crop.save(fn, quality=92)
        print(fn, crop.size)
