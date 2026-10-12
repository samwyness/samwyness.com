"""Generate the About section's stat drawings, same linocut hand as the stickers.

    python3 scripts/stickers/stats.py

Writes src/shared/components/sections/AboutSection/statInk.ts. No die-cut ring,
they sit inline on the page. Layers are themed in CSS: ink = text colour,
carve = page colour, accent = brand red. Shapes are seeded, output is stable.
"""
import math, os, random, json
from ink import catmull, wobble, taper, ellipse, dense

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'src', 'shared', 'components', 'sections', 'AboutSection', 'statInk.ts')

def arc(cx,cy,rx,ry,a0,a1,rot=0,n=16):
    r=math.radians(rot); pts=[]
    for i in range(n+1):
        a=math.radians(a0+(a1-a0)*i/n)
        x,y=rx*math.cos(a),ry*math.sin(a)
        pts.append((cx+x*math.cos(r)-y*math.sin(r), cy+x*math.sin(r)+y*math.cos(r)))
    return pts

def hexagon(cx,cy,r):
    return [(cx+r*math.cos(math.radians(a)), cy+r*math.sin(math.radians(a))) for a in range(-90,270,60)]

class Drawing:
    def __init__(self, seed):
        self.rng=random.Random(seed); self.layers=[]
    def blob(self, pts, layer, amp=0.6):
        self.layers.append((layer, catmull(wobble(pts, amp, True, self.rng), True)))
    def brush(self, pts, w, layer, amp=0.3):
        self.layers.append((layer, taper(pts, w, self.rng, amp)))

out={}

# ---- HEART: $25M+ raised for charity ----------------------------------------
d=Drawing(31)
R=[(0,-0.3),(0.22,-0.7),(0.52,-0.84),(0.82,-0.7),(0.98,-0.36),(0.9,0.02),(0.62,0.42),(0.3,0.74),(0,1.08)]
P=R+[(-x,y) for x,y in reversed(R[1:-1])]
d.blob(dense([(46+x*36,52+y*36) for x,y in P], 6), 'accent', amp=0.9)
d.brush([(21,38),(25,28),(34,23)], 4, 'carve')                  # lobe highlight
d.brush([(26,47),(28,55)], 2.6, 'carve')
d.brush([(58,64),(52,72),(46,77)], 2.2, 'carve')                # tip shading
for p in ([(84,16),(91,8)], [(88,30),(97,28)], [(74,8),(76,1)]):  # love lines
    d.brush(p, 3.2, 'ink', amp=0.15)
out['heart']=d

# ---- HANDS: open hands offering up a heart-- --------------------------------
d=Drawing(53)
# Open hands tipped up, three fingers, thumb lying across the palm. Drawn on a
# 1000 grid for the left hand, mirrored for the right
def P1k(x, y, mirror=False):
    X=2.6+(x-105)*0.12
    return (100-X if mirror else X, 14+(y-160)*0.12)
def capsule(x0,y0,x1,y1,r,n=6):
    """rounded stroke from p0 to p1, round caps so fingers end blunt not pointy"""
    a=math.atan2(y1-y0,x1-x0); pts=[]
    for c,base in (((x1,y1),a-math.pi/2), ((x0,y0),a+math.pi/2)):
        pts+=[(c[0]+r*math.cos(base+math.pi*i/n), c[1]+r*math.sin(base+math.pi*i/n)) for i in range(n+1)]
    return pts
PALM=[(132,243),(152,252),(162,290),(168,360),(172,420),(200,440),(240,446),(268,460),(300,488),
      (340,520),(380,542),(420,582),(450,642),(470,720),(480,768),(484,786),(450,782),(418,790),(384,781),(352,787),(343,762),(330,736),
      (285,695),(215,632),(150,560),(118,495),(108,430),(108,280),(114,252)]
FINGERS=[((195,445),(189,306),21), ((240,452),(241,366),19)]
SEAMS=[[(168,300),(169,372),(171,436)], [(218,358),(219,400),(220,440)]]
THUMB_GAP=[(245,440),(205,438),(183,451),(187,476),(220,510),(272,560),(322,606)]   # under the fingers, round the thumb end, along its underside
for m in (False, True):
    T=lambda pts: [P1k(x,y,m) for x,y in pts]
    d.blob(T(PALM), 'ink', amp=0.5)
    for (x0,y0),(x1,y1),r in FINGERS:
        d.blob(T(capsule(x0,y0,x1,y1,r)), 'ink', amp=0.2)
    for seam in SEAMS:
        d.brush(T(seam), 1.6, 'carve', amp=0.1)
    d.brush(T(THUMB_GAP), 2, 'carve', amp=0.12)
# Same heart as the heart drawing (minus its love lines), scaled to sit between the hands
def place(path, k, tx, ty):
    nums=iter(path.replace('M','M ').replace('C','C ').split())
    out=[]
    for t in nums:
        if t in ('M','C','Z'): out.append(t); continue
        x=float(t); y=float(next(nums))
        out.append(f'{x*k+tx:.1f} {y*k+ty:.1f}'.replace('.0 ',' ').removesuffix('.0'))
    return ' '.join(out).replace('M ','M').replace('C ','C')
HEART_K=0.62
for layer,path in out['heart'].layers:
    if layer!='ink': d.layers.append((layer, place(path, HEART_K, 50-46*HEART_K, 14-22*HEART_K)))
for p in ([(37,12),(34,6)], [(50,10),(50,3)], [(63,12),(66,6)]):          # love lines
    d.brush(p, 2.6, 'ink', amp=0.15)
out['hands']=d

# ---- ORBIT: 12B+ steps in a month, 200+ laps of the Earth ------------------
d=Drawing(37)
d.brush(arc(50,50,46,15,190,350,-20), 4.5, 'accent', amp=0.25)   # back of orbit, behind globe
d.blob(ellipse(50,50,33.5,32,9,rot=-14), 'ink', amp=1.1)   # globe, a touch lopsided so it reads hand cut                   # globe
# Loose Australia view, lon/lat squashed flat onto the globe face
def geo(pts, k=1.04, lon0=134, lat0=-25):
    return [(50+(lon-lon0)*k, 50+(lat0-lat)*k) for lon,lat in pts]
AUS=[(142.5,-10.7),(145.5,-15),(149,-21),(153.5,-25.5),(153,-29),(150.5,-35),(147,-38),
     (144,-38.3),(140,-37.8),(138,-35),(136,-35.2),(135.6,-33),(134,-32.5),(131,-31.5),
     (126,-32.3),(124,-33.8),(118,-35),(115,-34.3),(115.3,-31),(113.5,-26),(114,-22),
     (117,-20.5),(122,-17.5),(125,-14.5),(128,-15),(130,-12.5),(132,-11.5),(136,-12),
     (136.5,-15),(139.5,-17.5),(141.5,-13)]
TAS=[(144.6,-40.8),(148.3,-40.9),(148,-43.2),(146.5,-43.6),(145.2,-42.3)]
PNG=[(141,-2.6),(144,-3.6),(147.5,-5.8),(150.5,-10.4),(147,-10.1),(144,-7.8),(141,-9.1)]
d.blob(geo(AUS), 'carve', amp=0.4)
d.blob(geo(TAS), 'carve', amp=0.2)
d.blob(geo(PNG), 'carve', amp=0.3)
d.brush([(24,38),(29,28),(38,21)], 2.4, 'carve')                    # rim light
d.brush(arc(50,50,46,15,-10,190,-20), 4.5, 'accent', amp=0.25)   # front of orbit
d.blob(ellipse(*arc(50,50,46,15,40,40,-20,1)[0],4.2,4.2,8), 'accent', amp=0.2)  # runner
out['orbit']=d

# ---- HEX: 87 countries claiming turf, flag in a District cell ---------------
d=Drawing(43)
def rough_hex(cx, cy, r, rng):
    """hand-drawn hexagon: slightly knocked corners, gently bowed sides, a little tilt"""
    vs=[(x+rng.uniform(-1.5,1.5), y+rng.uniform(-1.5,1.5)) for x,y in hexagon(cx,cy,r)]
    vs=[(cx+(x-cx)*math.cos(0.06)-(y-cy)*math.sin(0.06), cy+(x-cx)*math.sin(0.06)+(y-cy)*math.cos(0.06)) for x,y in vs]
    pts=[]
    for (x0,y0),(x1,y1) in zip(vs, vs[1:]+vs[:1]):
        nx,ny=(y1-y0),-(x1-x0); L=math.hypot(nx,ny); bow=rng.uniform(-1,1.5)
        for t in (0, 0.15, 0.5, 0.85):
            b=bow*math.sin(math.pi*t)/L
            pts.append((x0+(x1-x0)*t-nx*b, y0+(y1-y0)*t-ny*b))
    return pts
# Outline: outer edge plus reversed inner edge, wobbled apart so the line swells and thins
outer=rough_hex(50,52,42,d.rng)
inner=[(50+(x-50)*0.86, 52+(y-52)*0.86) for x,y in reversed(outer)]
d.layers.append(('ink', catmull(wobble(outer, 0.6, True, d.rng), True)+' '+catmull(wobble(inner, 0.6, True, d.rng), True)))
def small(pts, k=0.78, c=(50,52)):
    return [(c[0]+(x-c[0])*k, c[1]+(y-c[1])*k) for x,y in pts]
d.brush(small([(44,74),(45,50),(44,26)]), 3.6, 'ink', amp=0.15)        # pole
d.brush(small([(34,75),(44,73),(56,75)]), 2.8, 'ink', amp=0.2)         # ground
FLAG=small([(45+(x-45)*1.2, 25+(y-25)*1.2) for x,y in [(45,25),(58,27),(70,32),(60,36),(66,42),(54,42),(45,43)]])
d.blob(FLAG, 'accent', amp=0.5)                                        # flag
out['hex']=d

body=json.dumps({k:[[l,p] for l,p in v.layers] for k,v in out.items()}, indent=2)
open(OUT,'w').write(
    '// Generated by scripts/stickers/stats.py, edit there and re-run\n'
    "export type InkLayer = 'ink' | 'carve' | 'accent';\n\n"
    f'export const STAT_INK: Record<string, [InkLayer, string][]> = {body};\n')
print('wrote', os.path.relpath(OUT, ROOT))
