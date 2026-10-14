"""Tiny linocut-sticker engine: wobbly black silhouettes, carved white marks,
white die-cut ring + thin black edge. viewBox 0 0 100 100."""
import math, random

def f(v):
    t=f'{v:.1f}'
    return t[:-2] if t.endswith('.0') else t

# ---- geometry -------------------------------------------------------------
def _tenths(v): return round(v*10)

def _num(t):
    """tenths int -> shortest svg number: 12->1.2, 5->.5, -5->-.5, 10->1"""
    s='-' if t<0 else ''; a=abs(t)
    return s+(str(a//10) if a%10==0 else (str(a//10) if a>=10 else '')+'.'+str(a%10))

def _join(nums):
    """svg number list with only the separators the grammar needs"""
    out=''; prev=''
    for s in nums:
        if prev and not s.startswith('-') and not (s.startswith('.') and '.' in prev): out+=' '
        out+=s; prev=s
    return out

def catmull(pts, closed, tension=1.0):
    """Catmull-Rom spline as a compact path: relative coords, and since the
    spline is C1 every segment after the first is an `s` (reflected control)"""
    n=len(pts)
    if n<2: return ''
    P=lambda i: pts[i % n] if closed else pts[max(0,min(n-1,i))]
    T=lambda p: (_tenths(p[0]), _tenths(p[1]))
    cur=T(pts[0]); first=[]; rest=[]
    for i in range(n if closed else n-1):
        p0,p1,p2,p3=P(i-1),P(i),P(i+1),P(i+2)
        c2=T((p2[0]-(p3[0]-p1[0])/6*tension, p2[1]-(p3[1]-p1[1])/6*tension))
        end=T(p2)
        rel=lambda q: [_num(q[0]-cur[0]), _num(q[1]-cur[1])]
        if i==0:
            c1=T((p1[0]+(p2[0]-p0[0])/6*tension, p1[1]+(p2[1]-p0[1])/6*tension))
            first=rel(c1)+rel(c2)+rel(end)
        else:
            rest+=rel(c2)+rel(end)
        cur=end
    d='M'+_join([_num(t) for t in T(pts[0])])+'c'+_join(first)
    if rest: d+='s'+_join(rest)
    return d+('z' if closed else '')

def resample(pts, closed, step=2.5):
    """spline through control pts, then evenly resample"""
    n=len(pts); out=[]
    P=lambda i: pts[i % n] if closed else pts[max(0,min(n-1,i))]
    segs = n if closed else n-1
    dense=[]
    for i in range(segs):
        p0,p1,p2,p3=P(i-1),P(i),P(i+1),P(i+2)
        for k in range(20):
            t=k/20; t2=t*t; t3=t2*t
            dense.append(tuple(0.5*((2*p1[j])+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3) for j in (0,1)))
    if not closed: dense.append(pts[-1])
    out=[dense[0]]; acc=0
    for a,b in zip(dense,dense[1:]):
        acc+=math.dist(a,b)
        if acc>=step: out.append(b); acc=0
    if not closed and out[-1]!=dense[-1]: out.append(dense[-1])
    return out

def normals(pts, closed):
    n=len(pts); res=[]
    for i in range(n):
        a=pts[(i-1)%n] if closed or i>0 else pts[i]
        b=pts[(i+1)%n] if closed or i<n-1 else pts[i]
        dx,dy=b[0]-a[0],b[1]-a[1]; L=math.hypot(dx,dy) or 1
        res.append((-dy/L,dx/L))
    return res

def noise(rng, n_terms=4):
    terms=[(rng.uniform(0.5,1)/k, rng.uniform(0,2*math.pi), k) for k in range(2,2+n_terms)]
    return lambda t: sum(a*math.sin(2*math.pi*k*t+ph) for a,ph,k in terms)

def wobble(pts, amp, closed, rng, step=2.5, jag=0.25):
    pts=resample(pts, closed, step)
    N=normals(pts, closed); nz=noise(rng); n=len(pts)
    out=[]
    for i,(p,nm) in enumerate(zip(pts,N)):
        o=amp*nz(i/n)+rng.uniform(-jag,jag)*amp
        out.append((p[0]+nm[0]*o, p[1]+nm[1]*o))
    return out

def dense(pts, step=5):
    """closed polygon with points every ~step so corners stay crisp"""
    o=[]
    for (x0,y0),(x1,y1) in zip(pts, pts[1:]+pts[:1]):
        n=max(1,int(math.hypot(x1-x0,y1-y0)/step))
        o+=[(x0+(x1-x0)*i/n, y0+(y1-y0)*i/n) for i in range(n)]
    return o

def ellipse(cx,cy,rx,ry,n=10,rot=0):
    r=math.radians(rot)
    return [(cx+rx*math.cos(a)*math.cos(r)-ry*math.sin(a)*math.sin(r),
             cy+rx*math.cos(a)*math.sin(r)+ry*math.sin(a)*math.cos(r))
            for a in [2*math.pi*i/n for i in range(n)]]

def taper(pts, w, rng, amp=0.3, head=0.25, tail=1.0):
    """open centerline -> tapered brush-stroke polygon path"""
    pts=wobble(pts, amp, False, rng, step=1.5, jag=0.1)
    N=normals(pts, False); n=len(pts)
    L=[];R=[]
    for i,(p,nm) in enumerate(zip(pts,N)):
        t=i/(n-1)
        prof=min(1, t/head if head else 1, (1-t)/(1-tail) if tail<1 else 1) if False else math.sin(math.pi*min(1,max(0,t)))**0.55
        prof=max(prof,0.12)*(1+rng.uniform(-0.12,0.12))
        hw=w/2*prof
        L.append((p[0]+nm[0]*hw,p[1]+nm[1]*hw)); R.append((p[0]-nm[0]*hw,p[1]-nm[1]*hw))
    poly=L+R[::-1]
    return catmull(poly, True)

# ---- sticker --------------------------------------------------------------
class Sticker:
    def __init__(self, seed):
        self.rng=random.Random(seed)
        self.solids=[]   # path d (filled black, outlined)
        self.strokes=[]  # (d, width) black strokes, outlined
        self.carve=[]    # raw svg in white on top
        self.ink=[]      # raw svg in black on top of carve
        self.outline=[]  # (pts, half width) of everything the die-cut ring wraps, for bbox()
    def blob(self, pts, amp=0.9):
        pts=wobble(pts, amp, True, self.rng); self.outline.append((pts,0))
        self.solids.append(catmull(pts, True))
    def line(self, pts, w, amp=0.5):
        pts=wobble(pts, amp, False, self.rng); self.outline.append((pts,w/2))
        self.strokes.append((catmull(pts, False), w))
    # top=True draws above the ink layer, e.g. white detail carved into a black ink shape
    def brush(self, pts, w, colour='#fff', amp=0.3, top=False):
        (self.carve if colour=='#fff' and not top else self.ink).append(f'<path d="{taper(pts,w,self.rng,amp)}" fill="{colour}"/>')
    def wblob(self, pts, colour='#fff', amp=0.5, top=False):
        (self.carve if colour=='#fff' and not top else self.ink).append(f'<path d="{catmull(wobble(pts, amp, True, self.rng), True)}" fill="{colour}"/>')
    def bbox(self, ring=8, edge=2):
        """outer extent of the die-cut ring"""
        pad=ring/2+edge
        xs=[x+s*(hw+pad) for pts,hw in self.outline for x,_ in pts for s in (-1,1)]
        ys=[y+s*(hw+pad) for pts,hw in self.outline for _,y in pts for s in (-1,1)]
        return min(xs),min(ys),max(xs),max(ys)
    # center=True moves the ring to the middle of the viewBox, shrinking it only if it would clip
    def svg(self, size=100, ring=8, edge=2, center=False, margin=1):  # edge = half the visible white ring (ring/2)
        defs=[f'<path id="s{i}" d="{d}"/>' for i,d in enumerate(self.solids)]
        defs+=[f'<path id="l{i}" d="{d}" fill="none"/>' for i,(d,w) in enumerate(self.strokes)]
        def layer(c, extra):
            s=[f'<g fill="{c}" stroke="{c}" stroke-linejoin="round" stroke-linecap="round" stroke-width="{f(max(extra,0.01))}">']
            s+= [f'<use href="#s{i}"/>' for i in range(len(self.solids))]
            s+= [f'<use href="#l{i}" stroke-width="{f(w+extra)}"/>' for i,(d,w) in enumerate(self.strokes)]
            return ''.join(s+['</g>'])
        open_g=close_g=''
        if center:
            x0,y0,x1,y1=self.bbox(ring, edge)
            k=min(1,(100-2*margin)/max(x1-x0,y1-y0))
            open_g=f'<g transform="translate(50 50) scale({k:.3f}) translate({f(-(x0+x1)/2)} {f(-(y0+y1)/2)})">'; close_g='</g>'
        return '\n'.join(l for l in [
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 100 100">',
            '<defs>'+''.join(defs)+'</defs>',
            open_g, layer('#000', ring+edge*2), layer('#fff', ring), layer('#000', 0),
            '<g>'+''.join(self.carve)+'</g>', '<g>'+''.join(self.ink)+'</g>', close_g, '</svg>'] if l)+'\n'
