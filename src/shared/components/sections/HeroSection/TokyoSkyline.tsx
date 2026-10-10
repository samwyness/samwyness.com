const GROUND = 108;

// Curved eave from x1 to x2 at y, flicking up at both ends
const eave = (x1: number, x2: number, y: number) =>
  `M ${x1} ${y} Q ${x1 + 3} ${y - 1} ${x1 + 3} ${y - 3} H ${x2 - 3} Q ${x2 - 3} ${y - 1} ${x2} ${y}`;

// Five storey pagoda: eaves shrinking upwards, walls between, spire on top
function pagoda(cx: number) {
  const tiers = [100, 92, 84, 76];
  const parts = tiers.map((y, i) => {
    const half = 10 - i * 1.5;
    const wall = half - 3;
    const below = i === 0 ? GROUND : tiers[i - 1] - 3;
    return `${eave(cx - half, cx + half, y)} M ${cx - wall} ${y} V ${below} M ${cx + wall} ${y} V ${below}`;
  });
  return `${parts.join(' ')} M ${cx} 73 V 56 M ${cx - 1.5} 66 h 3 M ${cx - 1.5} 62 h 3`;
}

// Left to right, drawn as if the pen barely leaves the page
const STROKES = [
  // Fuji, its long slope running off into the distance
  'M 0 108 C 30 104 46 88 60 74 Q 63 71 66 73 C 74 80 84 90 94 94',
  'M 54 80 q 3 4 5 1 q 3 4 5 0 q 3 4 5 1 q 2 3 4 0',
  // Kaminarimon gate
  `${eave(90, 120, 94)} M 94 94 V 108 M 116 94 V 108 M 101 108 V 99 H 109 V 108`,
  `${eave(96, 114, 89)} M 101 86 V 89 M 109 86 V 89`,
  pagoda(132),
  // Tokyo Tower: bowed legs, cross bracing, two decks and the spire
  'M 146 108 Q 154 80 156 52 L 157 30 M 170 108 Q 162 80 160 52 L 159 30 M 158 30 V 14',
  'M 151 108 Q 158 96 165 108',
  'M 148 100 L 165 88 M 168 100 L 151 88 M 153 80 L 161 64 M 163 80 L 155 64',
  'M 151 76 H 165 V 80 H 151 Z M 154 50 H 162 V 53 H 154 Z',
  // Skytree: slender shaft, two observation decks, long antenna
  'M 178 108 L 182 50 M 190 108 L 186 50',
  'M 178.6 100 L 189 86 M 189.4 100 L 179 86 M 179.5 86 L 188 72 M 188.5 86 L 180.5 72',
  'M 180 50 Q 179 46 181 44 H 187 Q 189 46 188 50 Z',
  'M 182 44 L 182.6 30 M 186 44 L 185.4 30 M 181.5 30 H 186.5 V 27 H 181.5 Z',
  'M 184 27 V 2 M 183 7 h 2',
  // Docomo tower, stepping up to its spire
  'M 194 108 V 58 H 196 V 48 H 198 V 40 Q 202 34 202 28 V 20 M 202 28 Q 202 34 206 40 V 48 H 208 V 58 H 210 V 108',
  // Slanted glass tower with a fold down its face
  'M 214 108 V 34 Q 214 30 218 29 L 230 26 Q 234 26 234 30 V 108',
  'M 217 40 Q 222 34 230 30 M 219 108 V 44',
  // Rounded low rise and a long squat block
  'M 238 108 V 76 Q 238 72 242 72 H 244 V 66 H 248 V 72 Q 254 72 254 78 V 108',
  'M 242 92 Q 242 86 246 86 H 250',
  'M 256 108 V 88 Q 256 84 260 84 H 274 Q 278 84 278 88 V 100 Q 278 104 274 104 H 266',
  // Twin towers joined by sky bridges
  'M 282 108 V 50 Q 282 48 284 48 H 294 V 108 M 300 108 V 50 Q 300 48 302 48 H 310 Q 312 48 312 50 V 108',
  'M 294 78 H 300 M 294 90 H 300 M 286 70 H 294 M 286 98 H 294',
  // Cocoon tower and its criss-cross skin
  'M 316 108 V 72 Q 316 50 323 50 Q 330 50 330 72 V 108',
  'M 319 108 V 74 Q 319 58 323 56 Q 326 58 326 68',
  'M 320 64 l 4 4 M 320 74 l 6 6 M 320 84 l 6 6 M 320 94 l 6 6',
  // Low blocks stepping down to the bay
  'M 334 108 V 90 Q 334 86 338 86 H 342 Q 344 86 344 90 V 98 H 352 V 108',
  'M 354 108 V 70 Q 354 64 360 64 H 368 Q 374 64 374 70 V 108 M 358 80 V 96 Q 358 100 362 100 H 370',
  // Flat roofed hall on stilts
  'M 376 80 Q 388 77 400 80 M 377 84 H 399 M 381 84 V 108 M 395 84 V 108',
  'M 0 108 H 400',
];

type TokyoSkylineProps = {
  className?: string;
};

/** Single-line pen sketch of Tokyo, from Fuji to the bay */
export function TokyoSkyline({ className }: TokyoSkylineProps) {
  return (
    <svg
      role="img"
      aria-label="Line drawing of the Tokyo skyline"
      className={className}
      viewBox="0 0 400 112"
      preserveAspectRatio="xMidYMax meet">
      <defs>
        <filter id="skyline-sketch">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="2"
            seed="3"
          />
          <feDisplacementMap in="SourceGraphic" scale="1.5" />
        </filter>
      </defs>

      <path
        d={STROKES.join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#skyline-sketch)"
      />
    </svg>
  );
}
