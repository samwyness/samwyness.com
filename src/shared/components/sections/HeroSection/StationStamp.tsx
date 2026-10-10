// Window ticks along the facade, every 5 units between the wings
const WINDOWS = Array.from({ length: 19 }, (_, i) => 32 + i * 5)
  .map(x => `M ${x} 97 v 4 M ${x} 108 v 4`)
  .join(' ');

type StationStampProps = {
  className?: string;
};

/** Eki stamp from Tokyo Station: the red-brick Marunouchi building, domes and all */
export function StationStamp({ className }: StationStampProps) {
  return (
    <svg
      role="img"
      aria-label="Tokyo Station stamp"
      className={className}
      viewBox="0 0 160 160">
      <defs>
        {/* Same patchy rubber-stamp ink as the round stamp */}
        <filter id="station-ink" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="2"
            seed="12"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.5"
            result="wobbly"
          />
          <feColorMatrix
            in="noise"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -4 3.2"
            result="speckle"
          />
          <feComposite in="wobbly" in2="speckle" operator="in" />
        </filter>
      </defs>

      <g filter="url(#station-ink)">
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round">
          <rect x="6" y="6" width="148" height="148" rx="14" strokeWidth="4" />
          <rect
            x="12"
            y="12"
            width="136"
            height="136"
            rx="10"
            strokeWidth="1.2"
          />

          {/* Long brick facade with a raised centre */}
          <path
            d="M 22 118 H 138 M 26 118 V 92 H 64 V 86 L 80 78 L 96 86 V 92 H 134 V 118"
            strokeWidth="1.5"
          />
          <path d="M 26 104 H 134" strokeWidth="0.8" />
          <path d={WINDOWS} strokeWidth="1.2" />
          {/* Central entrance */}
          <path d="M 74 118 V 106 Q 80 100 86 106 V 118" strokeWidth="1.2" />
          {/* Wings rising to the domes */}
          <path
            d="M 26 92 V 82 H 50 V 92 M 110 92 V 82 H 134 V 92"
            strokeWidth="1.5"
          />
          <path d="M 18 126 H 142" strokeWidth="0.8" />
        </g>

        <g fill="currentColor">
          {/* The two octagonal domes and their finials */}
          <path d="M 28 82 Q 28 68 38 66 Q 48 68 48 82 Z M 37.3 66 V 60 H 38.7 V 66 Z" />
          <path d="M 112 82 Q 112 68 122 66 Q 132 68 132 82 Z M 121.3 66 V 60 H 122.7 V 66 Z" />

          <text
            x="80"
            y="38"
            fontSize="19"
            textAnchor="middle"
            style={{ fontVariationSettings: "'wght' 800" }}>
            東京駅
          </text>
          <text
            x="80"
            y="50"
            fontSize="7"
            letterSpacing="2"
            textAnchor="middle">
            TOKYO STATION
          </text>
          <text x="80" y="140" fontSize="8" textAnchor="middle">
            JR東日本 · 2023.2.8
          </text>
        </g>
      </g>
    </svg>
  );
}
