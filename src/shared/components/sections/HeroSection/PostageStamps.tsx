const PAPER = '#fbf8f0';

// Solid wash of the stamp's ink over paper (solid so it still hides what's
// behind), streaked by the stamp's marker filter
const tint = (percent: number) => ({
  fill: `color-mix(in srgb, currentColor ${percent}%, ${PAPER})`,
  filter: 'var(--marker)',
});

// Perforation holes every 10 units round the 120×150 stamp
const PERFS = [
  ...Array.from({ length: 12 }, (_, i) => [5 + i * 10, 0]),
  ...Array.from({ length: 12 }, (_, i) => [5 + i * 10, 150]),
  ...Array.from({ length: 15 }, (_, i) => [0, 5 + i * 10]),
  ...Array.from({ length: 15 }, (_, i) => [120, 5 + i * 10]),
];

type PostageStampProps = {
  /** Unique per stamp, prefixes its mask, clip and filter ids */
  id: string;
  label: string;
  /** Kanji in the top left */
  title: string;
  /** Romaji along the bottom */
  caption: string;
  value: string;
  className?: string;
  children: React.ReactNode;
};

/** Perforated stamp frame; the art is pen-sketched in currentColor */
function PostageStamp({
  id,
  label,
  title,
  caption,
  value,
  className,
  children,
}: PostageStampProps) {
  return (
    <svg
      role="img"
      aria-label={label}
      className={className}
      // Read by tint(), so washes find this stamp's marker filter
      style={{ '--marker': `url(#${id}-marker)` } as React.CSSProperties}
      viewBox="0 0 120 150">
      <defs>
        <mask id={`${id}-perfs`}>
          <rect width="120" height="150" fill="#fff" />
          {PERFS.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.6" />
          ))}
        </mask>
        <clipPath id={`${id}-window`}>
          <rect x="11" y="11" width="98" height="128" />
        </clipPath>
        {/* Nudges every line off true, like it was drawn freehand */}
        <filter id={`${id}-sketch`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.06"
            numOctaves="2"
            seed="7"
          />
          <feDisplacementMap in="SourceGraphic" scale="2.2" />
        </filter>
        {/* Washes only: streaked like a drying marker, faded bands where the
            ink ran thin, darker ones where strokes overlapped */}
        <filter id={`${id}-marker`} colorInterpolationFilters="sRGB">
          {/* Stretched noise: long horizontal strokes */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.32"
            numOctaves="2"
            seed="11"
            result="streaks"
          />
          <feColorMatrix
            in="streaks"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 2 -0.9"
            result="thin"
          />
          <feColorMatrix
            in="streaks"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 0.6"
            result="overlap"
          />
          <feFlood floodColor={PAPER} floodOpacity="0.25" />
          <feComposite in2="thin" operator="in" />
          <feComposite in2="SourceGraphic" operator="in" result="faded" />
          <feFlood floodColor="currentColor" floodOpacity="0.08" />
          <feComposite in2="overlap" operator="in" />
          <feComposite in2="SourceGraphic" operator="in" result="inked" />
          {/* The shape's own outline, picked out by darkness, back on top so
              the streaks sit under the pen line */}
          <feColorMatrix
            in="SourceGraphic"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.68 -5.76 -0.56 0 4.4"
            result="dark"
          />
          <feComposite
            in="SourceGraphic"
            in2="dark"
            operator="in"
            result="line"
          />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="inked" />
            <feMergeNode in="faded" />
            <feMergeNode in="line" />
          </feMerge>
        </filter>
      </defs>

      <rect width="120" height="150" fill={PAPER} mask={`url(#${id}-perfs)`} />

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${id}-sketch)`}>
        <rect x="11" y="11" width="98" height="128" strokeWidth="1.4" />
        <g clipPath={`url(#${id}-window)`}>
          {/* Faint sky wash behind the art */}
          <rect
            x="11"
            y="11"
            width="98"
            height="128"
            stroke="none"
            style={tint(7)}
          />
          {children}
        </g>
      </g>

      <g fill="currentColor">
        <text
          x="17"
          y="24"
          fontSize="10"
          style={{ fontVariationSettings: "'wght' 700" }}>
          {title}
        </text>
        <text
          x="103"
          y="134"
          fontSize="13"
          textAnchor="end"
          style={{ fontVariationSettings: "'wght' 700" }}>
          {value}
        </text>
        <text x="16" y="135" fontSize="6" letterSpacing="1.5">
          {caption}
        </text>
      </g>
    </svg>
  );
}

// Stacked-tier pines: [x, base y, height]
function pines(trees: number[][]) {
  return trees.map(([x, y, h]) => {
    // Half-widths and drops (as fractions of height) down the left side
    const left = [
      [0.32, 0.32],
      [0.14, 0.32],
      [0.48, 0.6],
      [0.24, 0.6],
      [0.6, 0.82],
    ].map(([dx, dy]) => [x - dx * h, y - h + dy * h]);
    const right = left.map(([px, py]) => [2 * x - px, py]).reverse();
    const points = [[x, y - h], ...left, ...right]
      .map(([px, py]) => `${px.toFixed(1)} ${py.toFixed(1)}`)
      .join(' L ');
    return `M ${points} Z M ${x} ${y - 0.18 * h} V ${y}`;
  });
}

// A curved roof with upturned eaves: from x1 to x2 at eave height y,
// rising to a ridge `rise` above, `inset` in from each end
function roof(x1: number, x2: number, y: number, rise: number, inset: number) {
  return `M ${x1} ${y} Q ${x1 + inset * 0.7} ${y - 2} ${x1 + inset} ${y - rise} H ${x2 - inset} Q ${x2 - inset * 0.7} ${y - 2} ${x2} ${y} Z`;
}

// Gullies fanning down from Fuji's snow line to its foot
const GULLIES = [
  [50, 66, 30, 112],
  [55, 67, 46, 112],
  [62, 68, 62, 112],
  [67, 67, 76, 112],
  [71, 64, 90, 112],
  [74, 66, 102, 110],
].map(([x1, y1, x2, y2]) => `M ${x1} ${y1} L ${x2} ${y2}`);

type StampProps = {
  className?: string;
};

export function FujiPostage({ className }: StampProps) {
  return (
    <PostageStamp
      id="fuji"
      label="Mt Fuji postage stamp"
      title="日本"
      caption="NIPPON"
      value="84"
      className={className}>
      {/* Sun and drifting clouds */}
      <circle cx="86" cy="34" r="9" fill={PAPER} />
      <path d="M 18 50 q 4 -5 9 -2 q 3 -5 9 -1 q 5 -1 6 3 H 18" fill={PAPER} />
      <path d="M 70 52 q 3 -4 7 -1 q 4 -3 7 1 h -14" fill={PAPER} />

      {/* The mountain, with a jagged snow line */}
      <path
        d="M 4 112 C 22 100 38 82 52 58 L 57 50 H 66 L 71 58 C 84 80 98 98 116 108"
        style={tint(22)}
      />
      <path
        d="M 52 58 L 57 50 H 66 L 71 58 L 74 66 L 70 63 L 67 68 L 63 63 L 60 69 L 56 62 L 53 67 L 49 63 Z"
        fill={PAPER}
        stroke="none"
      />
      <path d="M 49 63 L 53 67 L 56 62 L 60 69 L 63 63 L 67 68 L 70 63 L 74 66" />
      <path d="M 57 50 L 58 56 M 61 50 L 60 58 M 64 50 L 66 55" />
      {GULLIES.map(d => (
        <path key={d} d={d} strokeWidth="0.6" />
      ))}

      {/* Lake and shoreline, then pines in front */}
      <rect
        x="11"
        y="113"
        width="98"
        height="26"
        stroke="none"
        style={tint(15)}
      />
      <path d="M 11 113 H 109" />
      {pines([
        [24, 118, 18],
        [34, 118, 13],
      ]).map(d => (
        <path key={d} d={d} style={tint(35)} />
      ))}

      {/* Lake ripples */}
      <path d="M 14 122 h 30 M 52 122 h 40 M 22 128 h 52 M 82 128 h 22" />
    </PostageStamp>
  );
}

// Osaka Castle keep, bottom tier first: [left, right, eave y, body height]
const KEEP = [
  [36, 84, 80, 12],
  [41, 79, 66, 8],
  [45, 75, 53, 7],
  [49, 71, 41, 5],
];

export function OsakaPostage({ className }: StampProps) {
  return (
    <PostageStamp
      id="osaka"
      label="Osaka Castle postage stamp"
      title="大阪"
      caption="OSAKA"
      value="110"
      className={className}>
      {/* Clouds */}
      <path d="M 70 26 q 4 -5 9 -2 q 3 -5 9 -1 q 5 -1 6 3 H 70" fill={PAPER} />
      <path d="M 16 40 q 3 -4 7 -1 q 4 -3 7 1 h -14" fill={PAPER} />

      {/* Sloped stone base, coursed */}
      <path d="M 24 112 L 31 92 H 89 L 96 112" style={tint(20)} />
      <path
        d="M 29 98 H 91 M 27 104 H 93 M 40 92 v 6 M 58 92 v 6 M 76 92 v 6 M 34 98 v 6 M 50 98 v 6 M 68 98 v 6 M 86 98 v 6 M 44 104 v 8 M 62 104 v 8 M 80 104 v 8"
        strokeWidth="0.6"
      />

      {/* Keep: walls with windows, a flared roof over each tier */}
      {KEEP.map(([l, r, y, h]) => (
        <g key={y}>
          <rect x={l} y={y} width={r - l} height={h} fill={PAPER} />
          <path
            d={Array.from(
              { length: Math.floor((r - l - 6) / 6) },
              (_, i) => `M ${l + 5 + i * 6} ${y + 3} v ${h - 5}`,
            ).join(' ')}
            strokeWidth="0.6"
          />
          {/* Weathered copper roofs */}
          <path d={roof(l - 6, r + 6, y + 1, 6, 9)} style={tint(40)} />
        </g>
      ))}
      {/* Gable over the second tier, and the golden fish on the ridge */}
      <path d="M 52 67 L 60 60 L 68 67" style={tint(40)} />
      <path d="M 57 35 q -2 -3 0 -5 M 63 35 q 2 -3 0 -5" />

      {/* Moat */}
      <rect
        x="11"
        y="114"
        width="98"
        height="25"
        stroke="none"
        style={tint(15)}
      />
      <path d="M 11 114 H 109" />
      <path d="M 16 121 h 26 M 50 121 h 44 M 24 127 h 48 M 80 127 h 22" />
    </PostageStamp>
  );
}

// Falling snow: [x, y]
const SNOW = [
  [20, 34],
  [32, 26],
  [46, 38],
  [58, 22],
  [68, 34],
  [24, 52],
  [52, 50],
  [100, 46],
  [16, 70],
  [98, 66],
  [40, 62],
  [74, 48],
];

export function NozawaPostage({ className }: StampProps) {
  return (
    <PostageStamp
      id="nozawa"
      label="Nozawa Onsen postage stamp"
      title="野沢温泉"
      caption="NOZAWA"
      value="63"
      className={className}>
      {/* Onsen mark: a steaming bowl */}
      <path d="M 80 34 a 9 5 0 0 0 18 0" />
      <path d="M 84 30 q -2 -3 0 -6 q 2 -3 0 -6 M 89 30 q -2 -3 0 -6 q 2 -3 0 -6 M 94 30 q -2 -3 0 -6 q 2 -3 0 -6" />

      {/* Snowy peaks behind */}
      <path
        d="M 11 84 L 28 62 L 38 72 L 54 52 L 72 74 L 84 64 L 109 86"
        style={tint(18)}
      />
      <path
        d="M 24 67 L 28 62 L 33 67 L 30 68 L 27 70 Z M 49 58 L 54 52 L 61 61 L 59 58 L 56 61 L 53 58 Z M 81 67 L 84 64 L 89 68 L 87 69 L 84 70 Z"
        fill={PAPER}
        strokeWidth="0.7"
      />

      {/* Wooden bathhouse with a raised roof lantern, snow on the ridges */}
      <rect x="34" y="92" width="52" height="22" style={tint(14)} />
      <path
        d="M 40 95 v 16 M 46 95 v 16 M 74 95 v 16 M 80 95 v 16"
        strokeWidth="0.6"
      />
      <path d="M 54 114 V 100 H 66 V 114" style={tint(35)} />
      <path d="M 54 104 H 66 M 58 100 v 4 M 62 100 v 4" strokeWidth="0.6" />
      <path d={roof(24, 96, 93, 15, 18)} style={tint(32)} />
      <rect x="50" y="70" width="20" height="8" style={tint(14)} />
      <path d={roof(44, 76, 71, 8, 9)} style={tint(32)} />
      {/* Snow lying along both ridges */}
      <path
        d="M 53 63 H 67 v 2 q -7 1.5 -14 0 Z M 43 78 H 77 v 2 q -17 2 -34 0 Z"
        fill={PAPER}
        strokeWidth="0.7"
      />

      {/* Steam curling off the baths */}
      <path d="M 98 108 q -3 -4 0 -8 q 3 -4 0 -8 M 103 110 q -3 -4 0 -8 q 3 -4 0 -8" />

      {/* Snowy ground, and a snowy pine */}
      <path
        d="M 11 114 q 12 -3 24 0 h 50 q 12 -3 24 0 V 139 H 11 Z"
        fill={PAPER}
      />
      {pines([[20, 112, 18]]).map(d => (
        <path key={d} d={d} style={tint(35)} />
      ))}
      <path d="M 18 124 h 30 M 60 124 h 36 M 30 130 h 40" strokeWidth="0.6" />

      <g fill="currentColor" stroke="none">
        {SNOW.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.9" />
        ))}
      </g>
    </PostageStamp>
  );
}
