// Bits of paper picked up along the trip and stuck into the stamp book

type KeepsakeProps = {
  className?: string;
};

// A 44 × 13 strip of washi tape with torn, zigzag ends, from its top left
const TAPE = (() => {
  const [w, h, teeth] = [44, 13, 5];
  const y = (i: number) => (((i + 0.5) * h) / teeth).toFixed(1);
  const right = Array.from(
    { length: teeth },
    (_, i) => `L ${w - (i % 2 ? 0 : 2)} ${y(i)}`,
  );
  const left = Array.from(
    { length: teeth },
    (_, i) => `L ${i % 2 ? 0 : 2} ${(h - Number(y(i))).toFixed(1)}`,
  );
  return `M 0 0 H ${w} ${right.join(' ')} L ${w} ${h} H 0 ${left.join(' ')} Z`;
})();

// The tape's printed stripes, slanting across it
const TAPE_STRIPES = Array.from(
  { length: 10 },
  (_, i) => `M ${i * 6 - 10} 13 L ${i * 6 - 3} 0`,
).join(' ');

// Diagonal hairlines across the whole ticket
const WEAVE = Array.from(
  { length: 90 },
  (_, i) => `M ${i * 3 - 100} 0 L ${i * 3} 100`,
).join(' ');

/** Shin-Osaka to Tokyo bullet train ticket, taped down at two corners */
export function ShinkansenTicket({ className }: KeepsakeProps) {
  return (
    <svg
      role="img"
      aria-label="Shinkansen ticket from Shin-Osaka to Tokyo"
      className={className}
      // Room round the ticket for the tape to hang off
      viewBox="-14 -12 198 124">
      <defs>
        <clipPath id="ticket-shape">
          <rect width="170" height="100" rx="3" />
        </clipPath>
        <clipPath id="tape-shape">
          <path d={TAPE} />
        </clipPath>
      </defs>

      <rect width="170" height="100" rx="3" fill="#e4edef" />
      {/* JR's fine security weave */}
      <path
        d={WEAVE}
        stroke="#a9c3cc"
        strokeWidth="0.4"
        clipPath="url(#ticket-shape)"
      />

      <g fill="currentColor">
        <text
          x="16"
          y="17"
          fontSize="8"
          style={{ fontVariationSettings: "'wght' 700" }}>
          乗車券・新幹線特急券
        </text>
        <text x="158" y="17" fontSize="6" textAnchor="end">
          C 12345-01
        </text>

        {/* The journey, in big print */}
        <text
          x="14"
          y="44"
          fontSize="17"
          style={{ fontVariationSettings: "'wght' 700" }}>
          新大阪
        </text>
        <text x="14" y="53" fontSize="5.5" letterSpacing="1">
          SHIN-OSAKA
        </text>
        <path
          d="M 72 38 H 104 M 100 34 L 105 38 L 100 42"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="158"
          y="44"
          fontSize="17"
          textAnchor="end"
          style={{ fontVariationSettings: "'wght' 700" }}>
          東 京
        </text>
        <text x="158" y="53" fontSize="5.5" letterSpacing="1" textAnchor="end">
          TOKYO
        </text>

        <text x="14" y="69" fontSize="7">
          2月4日
        </text>
        <text x="85" y="69" fontSize="7" textAnchor="middle">
          のぞみ 24号
        </text>
        <text x="158" y="69" fontSize="7" textAnchor="end">
          7号車 12番 A席
        </text>

        <path
          d="M 12 77 H 158"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        <text x="14" y="90" fontSize="5">
          新大阪駅 発行
        </text>
        <text
          x="158"
          y="91"
          fontSize="10"
          textAnchor="end"
          style={{ fontVariationSettings: "'wght' 700" }}>
          ¥14,720
        </text>
      </g>

      {/* Washi tape across two corners */}
      {['translate(-14 10) rotate(-38)', 'translate(148 108) rotate(-38)'].map(
        transform => (
          <g key={transform} transform={transform} opacity="0.85">
            <path d={TAPE} fill="#e9a99c" />
            <path
              d={TAPE_STRIPES}
              stroke="#f4cfc5"
              strokeWidth="2.5"
              clipPath="url(#tape-shape)"
            />
          </g>
        ),
      )}
    </svg>
  );
}

// Bar widths for the pass's barcode
const BARS = [1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 1, 2, 1];

/** Nozawa Onsen day lift pass, paper-clipped to the page */
export function LiftPass({ className }: KeepsakeProps) {
  let x = 90;
  const bars = BARS.map((w, i) => {
    const bar = i % 2 ? null : `M ${x + w / 2} 68 V 84`;
    const d = { d: bar, w };
    x += w + 0.8;
    return d;
  });

  return (
    <svg
      role="img"
      aria-label="Nozawa Onsen lift pass"
      className={className}
      // Headroom for the paper clip
      viewBox="0 -18 150 113">
      <defs>
        {/* Punched for the lift gate's wicket */}
        <mask id="lift-hole">
          <rect y="-18" width="150" height="113" fill="#fff" />
          <circle cx="140" cy="36" r="3" />
        </mask>
        <clipPath id="lift-card">
          <rect width="150" height="95" rx="6" />
        </clipPath>
      </defs>

      <g mask="url(#lift-hole)">
        <rect width="150" height="95" rx="6" fill="#fdfcf8" />
        <rect
          width="150"
          height="26"
          fill="#2f6fa8"
          clipPath="url(#lift-card)"
        />
      </g>

      <g fill="#fdfcf8">
        <text
          x="10"
          y="13"
          fontSize="9"
          letterSpacing="1"
          style={{ fontVariationSettings: "'wght' 800" }}>
          NOZAWA ONSEN
        </text>
        <text x="10" y="21" fontSize="5" letterSpacing="2">
          SNOW RESORT
        </text>
        <text x="140" y="17" fontSize="8" textAnchor="end">
          野沢温泉
        </text>
      </g>

      <g fill="currentColor">
        <text
          x="10"
          y="51"
          fontSize="17"
          style={{ fontVariationSettings: "'wght' 700" }}>
          1日券
        </text>
        <text x="10" y="61" fontSize="6" letterSpacing="1">
          1-DAY PASS · 大人
        </text>
        <text x="10" y="84" fontSize="6" letterSpacing="0.5">
          2023.02.11
        </text>
      </g>

      {/* Mountain mark */}
      <g
        fill="none"
        stroke="#2f6fa8"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round">
        <path d="M 92 58 L 106 36 L 113 46 L 118 40 L 130 58 Z" />
        <path d="M 101 44 L 104 46 L 106 43 L 108 46 L 111 44" />
      </g>

      <g stroke="currentColor">
        {bars.map(({ d, w }, i) => d && <path key={i} d={d} strokeWidth={w} />)}
      </g>

      {/* Gem clip over the top edge */}
      <path
        d="M 4 14 V 36 A 3 3 0 0 0 10 36 V 5 A 5 5 0 0 0 0 5 V 40 A 6 6 0 0 0 12 40 V 12"
        transform="translate(112 -16) rotate(4)"
        fill="none"
        stroke="#8b9097"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Columns of tiny print, as dashes of varying rhythm
const PRINT = [
  [10, '3 1.5'],
  [16, '2 1.5 4 1.5'],
  [22, '3 1.5 1.5 1.5'],
  [28, '4 1.5 2 1.5'],
] as const;

/** Folded shrine fortune slip: great luck */
export function Omikuji({ className }: KeepsakeProps) {
  return (
    <svg
      role="img"
      aria-label="Omikuji fortune: great luck"
      className={className}
      viewBox="0 0 40 150">
      <rect width="40" height="150" fill="#fbf9f4" />

      {/* Creases from being folded up and tied to a branch */}
      <path
        d="M 0 50 H 40 M 0 100 H 40"
        stroke="rgb(0 0 0 / 0.08)"
        strokeWidth="1"
      />

      <g fill="none" stroke="#c8423a">
        <rect x="2.5" y="2.5" width="35" height="145" strokeWidth="0.8" />
        <rect x="4.5" y="4.5" width="31" height="141" strokeWidth="0.4" />
      </g>
      <rect x="8" y="8" width="24" height="10" fill="#c8423a" />
      <text
        x="20"
        y="15.5"
        fontSize="5.5"
        fill="#fbf9f4"
        textAnchor="middle"
        style={{ fontVariationSettings: "'wght' 700" }}>
        おみくじ
      </text>

      <g
        fill="#1f1f1f"
        fontSize="15"
        textAnchor="middle"
        style={{ fontVariationSettings: "'wght' 800" }}>
        <text x="20" y="40">
          大
        </text>
        <text x="20" y="58">
          吉
        </text>
      </g>

      <g stroke="#555" strokeWidth="1.3" opacity="0.55">
        {PRINT.map(([x, dash]) => (
          <path key={x} d={`M ${x} 70 V 140`} strokeDasharray={dash} />
        ))}
      </g>
    </svg>
  );
}

// Torn-open bottom edge of the wrapper, right to left
const TORN = Array.from(
  { length: 6 },
  (_, i) => `L ${30 - (i + 0.5) * 5} ${i % 2 ? 128 : 125}`,
).join(' ');

/** Restaurant chopstick wrapper, torn open at the bottom */
export function ChopstickWrapper({ className }: KeepsakeProps) {
  return (
    <svg
      role="img"
      aria-label="Chopstick wrapper"
      className={className}
      viewBox="0 0 30 130">
      <defs>
        <clipPath id="wrapper-shape">
          <path d={`M 0 10 L 30 0 V 126 ${TORN} L 0 126 Z`} />
        </clipPath>
      </defs>

      <g clipPath="url(#wrapper-shape)">
        <rect width="30" height="130" fill="#fbf9f4" />
        {/* Folded-over top, a shade darker */}
        <path d="M 0 10 L 30 0 V 6 L 0 16 Z" fill="rgb(0 0 0 / 0.06)" />

        {/* Indigo band printed with waves */}
        <rect y="18" width="30" height="20" fill="#2b4a7a" />
        <path
          d="M 0 28 q 5 -6 10 0 q 5 -6 10 0 q 5 -6 10 0 M 0 35 q 5 -6 10 0 q 5 -6 10 0 q 5 -6 10 0"
          fill="none"
          stroke="#fbf9f4"
          strokeWidth="1"
        />
      </g>

      {/* "Otemoto", the polite word printed on every wrapper */}
      <g
        fill="#1f1f1f"
        fontSize="11"
        textAnchor="middle"
        style={{ fontVariationSettings: "'wght' 600" }}>
        {['お', 'て', 'も', 'と'].map((kana, i) => (
          <text key={kana} x="15" y={56 + i * 14}>
            {kana}
          </text>
        ))}
      </g>

      <rect x="10" y="106" width="10" height="10" fill="#c8423a" />
      <text x="15" y="114" fontSize="7" fill="#fbf9f4" textAnchor="middle">
        箸
      </text>
    </svg>
  );
}

// Plump moulded body, nose at the left, joining the tail on the right
const FISH_BODY =
  'M 43 50 C 45 37 60 28 80 27 L 84 23 C 106 22 128 27 142 36 C 150 41 155 46 156 52 C 155 59 149 65 140 71 C 124 80 104 85 84 83 C 62 81 45 66 43 50 Z';

// Half-moon scales pressed into the flank, in staggered rows
const SCALES = [36, 44, 52, 60, 68]
  .flatMap((y, row) =>
    Array.from(
      { length: 8 - Math.max(0, row - 2) * 2 },
      (_, i) =>
        `M ${86 + (row % 2) * 3.5 + i * 7} ${y - 3} a 3.2 3.2 0 0 1 0 6.4`,
    ),
  )
  .join(' ');

// The moulded relief: gill band, eye rings, mouth notch, fin ridges
const RELIEF = [
  'M 70 31 Q 63 52 70 77 M 76 29 Q 69 52 76 80',
  'M 45 46 L 50 50 L 45 54',
  'M 84 64 L 100 61 L 103 64 L 95 78 L 85 76 Z M 87 67 H 99 M 87 71 H 97 M 88 74 H 95',
  'M 86 31 C 106 29 124 32 138 38',
].join(' ');

/** Plastic soy sauce fish from a bento, stuck down with clear tape */
export function SoySauceFish({ className }: KeepsakeProps) {
  return (
    <svg
      role="img"
      aria-label="Soy sauce fish"
      className={className}
      viewBox="0 0 200 100">
      <defs>
        {/* Near black soy, going ruby where the plastic thins at the edges */}
        <radialGradient id="soy-fill" cx="0.45" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#120707" />
          <stop offset="0.72" stopColor="#1d0b09" />
          <stop offset="0.9" stopColor="#3e1712" />
          <stop offset="1" stopColor="#6b2d24" />
        </radialGradient>
        <radialGradient id="soy-sheen" cx="0.35" cy="0.3" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tail-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b8aca6" />
          <stop offset="0.25" stopColor="#ecebe8" />
          <stop offset="1" stopColor="#f7f6f4" />
        </linearGradient>
        {/* Cylinder lying on its side: lit on top */}
        <linearGradient id="cap-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff5a40" />
          <stop offset="0.35" stopColor="#e5190d" />
          <stop offset="1" stopColor="#a50e06" />
        </linearGradient>
        <linearGradient id="tail-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ecebe8" stopOpacity="0" />
          <stop offset="0.6" stopColor="#ecebe8" stopOpacity="0.25" />
          <stop offset="1" stopColor="#ecebe8" stopOpacity="0.85" />
        </linearGradient>
        <clipPath id="fish-body">
          <path d={FISH_BODY} />
        </clipPath>
      </defs>

      {/* Frosted plastic tail, no soy in it */}
      <path
        d="M 146 42 L 184 26 Q 193 27 190 35 Q 184 50 192 67 Q 191 75 182 72 L 146 62 Z"
        fill="url(#tail-fill)"
        stroke="#d6d2ce"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <path
        d="M 172 38 L 180 50 L 172 60"
        fill="none"
        stroke="#d6d2ce"
        strokeOpacity="0.6"
        strokeWidth="1"
      />

      {/* Neck and red screw cap */}
      <rect x="35" y="44" width="11" height="11" rx="2" fill="#3a1410" />
      <rect x="12" y="34" width="25" height="31" rx="3" fill="url(#cap-fill)" />
      <path
        d={Array.from(
          { length: 15 },
          (_, i) => `M ${14 + i * 1.5} 35 V 64`,
        ).join(' ')}
        stroke="#8f0c05"
        strokeOpacity="0.45"
        strokeWidth="0.5"
      />

      <path d={FISH_BODY} fill="url(#soy-fill)" />
      <g
        clipPath="url(#fish-body)"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round">
        {/* Pressed-in relief: dark shadow, then a lit edge just above */}
        <g
          transform="translate(0.7 0.7)"
          stroke="#000"
          strokeOpacity="0.6"
          strokeWidth="1.2">
          <path d={SCALES} />
          <path d={RELIEF} />
        </g>
        <g stroke="#a4abb6" strokeOpacity="0.3" strokeWidth="1">
          <path d={SCALES} />
          <path d={RELIEF} />
        </g>
        <path d={FISH_BODY} fill="url(#soy-sheen)" />
        {/* Soy runs out where the body narrows into the tail */}
        <rect x="134" y="20" width="24" height="70" fill="url(#tail-fade)" />
        {/* Frosty rim where the top edge catches the light */}
        <path
          d="M 50 38 C 60 28 74 27 84 23 C 106 22 128 27 142 36"
          stroke="#fff"
          strokeOpacity="0.22"
          strokeWidth="2.5"
        />
      </g>
      <g fill="none" stroke="#a4abb6" strokeOpacity="0.45">
        <circle cx="57" cy="44" r="6" strokeWidth="1.1" />
        <circle cx="57" cy="44" r="3.3" strokeWidth="1" />
      </g>
      <circle cx="57" cy="44" r="1.3" fill="#a4abb6" fillOpacity="0.5" />

      {/* Clear tape over its middle */}
      <rect
        x="100"
        y="4"
        width="22"
        height="92"
        transform="rotate(8 111 50)"
        fill="#fff"
        fillOpacity="0.22"
        stroke="#fff"
        strokeOpacity="0.45"
        strokeWidth="0.6"
      />
    </svg>
  );
}

/** Warning card from the snow monkey park, with one unimpressed monkey */
export function MonkeySign({ className }: KeepsakeProps) {
  return (
    <svg
      role="img"
      aria-label="Snow monkey park sign: don't make eye contact with the monkeys"
      className={className}
      viewBox="0 -8 140 108">
      <rect width="140" height="100" rx="2" fill="#efd27a" />
      <rect
        x="3"
        y="3"
        width="134"
        height="94"
        rx="1"
        fill="none"
        stroke="#1f1f1f"
        strokeWidth="1.2"
      />
      <rect x="3" y="3" width="134" height="17" fill="#1f1f1f" />
      <text
        x="70"
        y="15.5"
        fontSize="10"
        fill="#efd27a"
        textAnchor="middle"
        letterSpacing="1"
        style={{ fontVariationSettings: "'wght' 800" }}>
        注意 CAUTION
      </text>

      {/* Snow monkey, red faced and glaring back */}
      <g strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="56" r="6" fill="#b9a68f" stroke="#1f1f1f" />
        <circle cx="52" cy="56" r="6" fill="#b9a68f" stroke="#1f1f1f" />
        <circle cx="32" cy="58" r="22" fill="#c9b8a3" stroke="#1f1f1f" />
        <path
          d="M 22 38 Q 32 30 42 38 Q 36 40 32 37 Q 28 40 22 38 Z"
          fill="#fbf9f4"
          stroke="#1f1f1f"
          strokeWidth="0.8"
        />
        <path
          d="M 32 47 Q 20 44 19 55 Q 18 66 24 72 Q 32 78 40 72 Q 46 66 45 55 Q 44 44 32 47 Z"
          fill="#d9806f"
          stroke="#1f1f1f"
          strokeWidth="0.9"
        />
        <g fill="none" stroke="#1f1f1f" strokeWidth="1.3">
          {/* Furrowed brows */}
          <path d="M 23 53 L 30 56 M 41 53 L 34 56" />
          <path d="M 27 70 Q 32 67 37 70" />
        </g>
        <circle cx="27" cy="59" r="1.6" fill="#1f1f1f" />
        <circle cx="37" cy="59" r="1.6" fill="#1f1f1f" />
        <path
          d="M 30.5 64 h 0.1 M 33.5 64 h 0.1"
          stroke="#1f1f1f"
          strokeWidth="1.2"
        />
      </g>

      <g fill="#1f1f1f">
        <g fontSize="9" style={{ fontVariationSettings: "'wght' 700" }}>
          <text x="62" y="35">
            サルと目を
          </text>
          <text x="62" y="46">
            合わせないで
          </text>
          <text x="62" y="57">
            ください
          </text>
        </g>
        <g fontSize="5.5" letterSpacing="0.3">
          <text x="62" y="68">
            PLEASE DON&rsquo;T MAKE
          </text>
          <text x="62" y="75">
            EYE CONTACT WITH
          </text>
          <text x="62" y="82">
            THE MONKEYS
          </text>
        </g>
        <text x="132" y="92" fontSize="5.5" textAnchor="end">
          地獄谷野猿公苑
        </text>
      </g>

      {/* Washi tape holding it down */}
      <g transform="translate(48 -6) rotate(4)" opacity="0.85">
        <path d={TAPE} fill="#9fc3b5" />
        <path
          d={TAPE_STRIPES}
          stroke="#c7ddd4"
          strokeWidth="2.5"
          clipPath="url(#monkey-tape)"
        />
      </g>
      <defs>
        <clipPath id="monkey-tape">
          <path d={TAPE} />
        </clipPath>
      </defs>
    </svg>
  );
}
