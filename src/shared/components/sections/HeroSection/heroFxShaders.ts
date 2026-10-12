// GLSL for the hero photo effect, see HeroFx.tsx

export const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Riso print all over, part faded over the photo; the lens cuts through to
// the real photo. vUv and uMouse are 0–1, y up
export const fragment = /* glsl */ `
  precision highp float;

  uniform sampler2D tMap;
  uniform vec2 uResolution;
  uniform float uImageAspect;
  uniform float uTime;
  uniform float uHover;
  // 0–1 once the photo has loaded, so a full-frame effect fades in
  uniform float uIn;
  uniform vec2 uMouse;
  // Riso misregistration, follows the cursor and settles back on leave
  uniform vec2 uSlip;
  uniform vec3 uInk;
  uniform vec3 uPaper;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  // object-fit: cover; object-position: center right
  vec2 cover(vec2 uv) {
    float a = uResolution.x / uResolution.y;
    if (a > uImageAspect) {
      uv.y = (uv.y - 0.5) * (uImageAspect / a) + 0.5;
    } else {
      float s = a / uImageAspect;
      uv.x = uv.x * s + (1.0 - s);
    }
    return uv;
  }

  vec3 photo(vec2 uv) {
    return texture2D(tMap, cover(uv)).rgb;
  }

  float luma(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
  }

  // Lens that opens around the cursor as a slowly wobbling blob with a rough,
  // hand-cut edge. Px outside its edge, negative inside; size is its radius
  // against the width, offset moves it in px
  float lensDist(float size, vec2 offset, out float r) {
    vec2 d = (vUv - uMouse) * uResolution - offset;
    r = uHover * uResolution.x * size;
    // Lobes drifting round the outline; whole numbers keep atan's seam closed
    float a = atan(d.y, d.x);
    float wobble = sin(a * 3.0 + uTime * 1.1) * 0.6 +
      sin(a * 2.0 - uTime * 0.8 + 1.3) * 0.4;
    // Both shrink with the lens, or their dips leave a blob when it closes
    float edge = wobble * r * 0.06 +
      (fbm((vUv - offset / uResolution) * 5.0 + uTime * 0.2) - 0.5) *
      min(r, 35.0);
    return length(d) + edge - r;
  }

  float lens(float size) {
    float r;
    float s = lensDist(size, vec2(0.0), r);
    // Last factor shuts the soft edge's leftover pixel at the cursor
    return (1.0 - smoothstep(-1.5, 1.5, s)) * clamp(r, 0.0, 1.0);
  }

  // Sticker edge round the lens: a thick white band inside, a black line half
  // its width outside. Thins away as the lens closes so no dot is left behind.
  // x is white's cover, y black's
  vec2 lensBorder(float size) {
    float r;
    float s = lensDist(size, vec2(0.0), r);
    float grow = clamp(r / 40.0, 0.0, 1.0);
    float white = 8.0 * grow;
    float edge = smoothstep(-1.0, 1.0, s);
    float band = smoothstep(-white - 1.0, -white + 1.0, s);
    float outerLine = (1.0 - smoothstep(white * 0.5 - 1.0, white * 0.5 + 1.0, s)) * edge;
    return vec2(band * (1.0 - edge), outerLine) * grow;
  }

  // Flat shadow the sticker drops on the print, down and to the right
  float lensShadow(float size) {
    float r;
    float grow = clamp(uHover * uResolution.x * size / 40.0, 0.0, 1.0);
    float s = lensDist(size, vec2(5.0, -5.0) * grow, r);
    // Out to the sticker's outer line
    return (1.0 - smoothstep(4.0 * grow - 1.0, 4.0 * grow + 1.0, s)) * grow;
  }

  float halftone(vec2 p, float angle, float cell, float tone) {
    mat2 r = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 f = fract(r * p / cell) - 0.5;
    float radius = sqrt(tone) * 0.62;
    return 1.0 - smoothstep(radius - 0.1, radius + 0.1, length(f));
  }

  // Riso spot ink, a soft red (#ff7a7a)
  const vec3 RED = vec3(1.0, 0.478, 0.478);

  // Two-drum riso print on paper, black over the red; the red layer slips out
  // of register towards the cursor
  vec3 riso() {
    vec2 p = vUv * uResolution;
    // Eased towards the cursor in the loop, back to rest on leave
    vec2 slip = (uSlip - 0.5) * 18.0 + vec2(2.0, -1.5);
    float inkTone = 1.0 - smoothstep(0.05, 0.5, luma(photo(vUv)));
    float spotTone =
      (1.0 - smoothstep(0.3, 0.95, luma(photo(vUv - slip / uResolution)))) * 0.9;
    float inkDot = halftone(p, 0.785, 4.5, inkTone);
    float spotDot = halftone(p - slip, 0.262, 4.5, spotTone);

    // Inks multiply on the paper
    vec3 col = uPaper * mix(vec3(1.0), RED, spotDot);
    col *= mix(vec3(1.0), uInk * 1.4, inkDot);
    return col * (0.93 + 0.07 * hash(floor(p) + floor(uTime * 12.0)));
  }

  void main() {
    float inside = lens(0.3);
    float a = (1.0 - inside) * uIn * 0.6;
    vec2 border = lensBorder(0.3) * uIn;
    float b = border.x + border.y;
    if (a <= 0.0 && b <= 0.0) {
      gl_FragColor = vec4(0.0);
      return;
    }
    // Shadow on the print, then the border over both
    float shadow =
      lensShadow(0.3) * (1.0 - clamp(inside + b, 0.0, 1.0)) * uIn * 0.4;
    vec4 col = vec4(riso() * a, a);
    col = vec4(uInk * shadow, shadow) + col * (1.0 - shadow);
    gl_FragColor = vec4(vec3(border.x) + uInk * border.y, b) + col * (1.0 - b);
  }
`;
