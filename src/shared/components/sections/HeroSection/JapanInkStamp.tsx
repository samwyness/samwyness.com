// Circumference of the r66 text ring, a hair short so the ends do not touch
const RING_LENGTH = Math.floor(2 * Math.PI * 66) - 4;

// Hokkaido, Honshu, Shikoku, Kyushu; straits widened so they survive the ink
const ISLANDS = [
  'M 118.3 60.7 L 121.9 64.8 L 126.3 67.3 L 132.0 66.8 L 130.8 70.4 L 134.0 71.4 L 128.8 73.5 L 123.9 78.6 L 118.7 76.0 L 114.7 77.0 L 112.7 76.0 L 110.7 78.6 L 112.3 81.6 L 115.1 79.6 L 110.7 75.5 L 112.3 71.9 L 116.3 71.9 L 117.1 66.8 Z',
  'M 110.5 84.9 L 113.3 86.0 L 115.3 83.9 L 114.9 88.0 L 117.3 93.6 L 115.3 99.7 L 113.3 101.8 L 113.3 106.9 L 112.5 113.0 L 109.2 116.6 L 108.4 114.5 L 105.6 116.1 L 104.4 118.6 L 102.4 118.6 L 97.2 118.6 L 96.8 120.2 L 92.4 124.2 L 89.5 121.7 L 89.9 118.6 L 85.1 118.6 L 79.1 120.2 L 74.7 121.7 L 72.7 122.2 L 73.9 119.1 L 79.1 114.5 L 85.1 113.5 L 91.2 113.5 L 93.6 112.0 L 96.0 107.4 L 98.4 103.8 L 96.8 105.9 L 99.2 106.9 L 103.2 104.3 L 107.2 99.2 L 108.8 92.1 L 109.2 87.5 Z',
  'M 77.5 126.0 L 79.9 129.1 L 81.5 126.0 L 86.3 126.5 L 88.3 123.5 L 87.5 121.9 L 83.5 120.9 L 81.1 122.5 Z',
  'M 71.2 124.0 L 74.1 125.5 L 75.3 128.6 L 73.3 136.7 L 70.8 138.8 L 68.4 137.3 L 68.4 133.2 L 69.2 130.6 L 66.4 130.6 L 66.0 127.6 L 68.4 125.5 Z',
];

type JapanInkStampProps = {
  className?: string;
};

/** Round red "Japan" rubber stamp, inked unevenly like a real one */
export function JapanInkStamp({ className }: JapanInkStampProps) {
  return (
    <svg
      role="img"
      aria-label="Japan '23 stamp"
      className={className}
      viewBox="0 0 200 200">
      <defs>
        {/* Full clockwise lap for the ring text, starting at the left */}
        <path
          id="stamp-ring"
          d="M 34 100 A 66 66 0 1 1 166 100 A 66 66 0 1 1 34 100"
        />
        {/* Speckled gaps and wobbly edges where the ink didn't take */}
        <filter id="stamp-ink" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed="4"
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
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -4 3.1"
            result="speckle"
          />
          <feComposite in="wobbly" in2="speckle" operator="in" />
        </filter>
      </defs>

      <g filter="url(#stamp-ink)">
        <g fill="none" stroke="currentColor">
          <circle cx="100" cy="100" r="92" strokeWidth="5" />
          <circle cx="100" cy="100" r="85" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="56" strokeWidth="1.5" />
        </g>

        {/* Stretched to exactly one lap so the repeat meets itself */}
        <text
          fill="currentColor"
          fontSize="15"
          style={{ fontVariationSettings: "'wght' 700" }}>
          <textPath
            href="#stamp-ring"
            textLength={RING_LENGTH}
            lengthAdjust="spacing">
            JAPAN · 日本国 · JAPAN · 日本国 ·
          </textPath>
        </text>

        {/* The four main islands, simplified from real coastline points */}
        <g
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
          // Undoes the stamp's tilt and then some: runs bottom left to top right
          transform="translate(100 100) rotate(20) scale(0.9) translate(-100 -100)"
          strokeLinejoin="round">
          {ISLANDS.map(d => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
    </svg>
  );
}
