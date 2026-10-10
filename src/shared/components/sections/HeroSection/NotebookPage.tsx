import { SIGNATURE_PATH } from '../../icons/SignatureIcon';
import styles from './NotebookPage.module.css';

const NOTE = [
  'Most mornings start with a surf, then a coffee.',
  'Weekends are for camping, ideally somewhere with no signal.',
  'Outside of work it’s music, tacos or tapas, a nice wine, and working out where to travel next.',
  'Thanks for having a look around.',
];

/** The handwritten note and signature */
function NoteText() {
  return (
    <div className={styles.note}>
      <p>Hey, Sam here.</p>
      {NOTE.map(line => (
        <p key={line}>{line}</p>
      ))}
      <svg
        role="img"
        aria-label="Sam"
        className={styles.signature}
        viewBox="0 0 600 300">
        <path d={SIGNATURE_PATH} />
      </svg>
    </div>
  );
}

/** Back of the print: an old notebook page with a handwritten note, signed */
export function NotebookPage() {
  return (
    <div className={styles.page}>
      <svg className={styles.filterDefs} aria-hidden>
        {/* Nudges the sheet's edge in and out a pixel or two */}
        <filter id="paper-edge" x="-1%" y="-1%" width="102%" height="102%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.09"
            numOctaves="3"
            seed="6"
          />
          <feDisplacementMap in="SourceGraphic" scale="3" />
        </filter>
        {/* Ballpoint ink: a slight wobble, pressure fading in and out along
            the strokes, and fine grain where the ball skipped */}
        <filter
          id="pen-ink"
          x="-2%"
          y="-2%"
          width="104%"
          height="104%"
          colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="2"
            seed="3"
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale="1.2"
            result="wobbly"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="2"
            seed="14"
            result="pressure"
          />
          <feColorMatrix
            in="pressure"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.7 0 0 0 0.58"
            result="pressureMask"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed="7"
            result="grain"
          />
          <feColorMatrix
            in="grain"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2 0 0 0 -0.08"
            result="grainMask"
          />
          <feComposite in="wobbly" in2="pressureMask" operator="in" />
          <feComposite in2="grainMask" operator="in" />
        </filter>
      </svg>
      <div className={styles.paper} />

      {/* Someone set their cup down on it, twice */}
      <svg className={styles.coffeeStain} viewBox="0 0 200 200" aria-hidden>
        <defs>
          {/* Wobbly edge; low noise fades parts of the rim out, fine noise
              grains what's left */}
          <filter
            id="coffee-rim"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
            colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03"
              numOctaves="3"
              seed="4"
              result="warp"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="warp"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
              result="shape"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="2"
              seed="11"
              result="fade"
            />
            <feColorMatrix
              in="fade"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  4 0 0 0 -1.3"
              result="fadeMask"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.5"
              numOctaves="2"
              seed="3"
              result="grain"
            />
            <feColorMatrix
              in="grain"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.6 0 0 0 0.1"
              result="grainMask"
            />
            <feComposite in="shape" in2="fadeMask" operator="in" />
            <feComposite in2="grainMask" operator="in" />
          </filter>
          {/* Faint wash, a touch darker toward the rim */}
          <radialGradient id="coffee-fill">
            <stop offset="0.5" stopColor="#c0803f" stopOpacity="0.04" />
            <stop offset="1" stopColor="#a8622a" stopOpacity="0.12" />
          </radialGradient>
          {/* Same wobble for the faint wash inside the ring */}
          <filter id="coffee-wash" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03"
              numOctaves="3"
              seed="4"
            />
            <feDisplacementMap
              in="SourceGraphic"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>

        <circle
          cx="100"
          cy="100"
          r="77"
          fill="url(#coffee-fill)"
          filter="url(#coffee-wash)"
        />
        <g fill="none" filter="url(#coffee-rim)">
          {/* Pigment piled up at the edge as it dried, soft band inside */}
          <circle
            cx="100"
            cy="100"
            r="78"
            stroke="#6e3510"
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />
          <circle
            cx="100"
            cy="100"
            r="76"
            stroke="#9a5420"
            strokeOpacity="0.2"
            strokeWidth="4"
          />
          {/* Tide line where it shrank back */}
          <circle
            cx="99"
            cy="101"
            r="68"
            stroke="#9a5420"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
          {/* Second, fainter set-down, only part of it caught the page */}
          <circle
            cx="114"
            cy="90"
            r="78"
            stroke="#8a4818"
            strokeOpacity="0.22"
            strokeWidth="2.4"
            strokeDasharray="230 400"
            strokeDashoffset="-140"
          />
        </g>
        {/* Flecks from a drip off the cup */}
        <g fill="#8a4818" filter="url(#coffee-wash)">
          <circle cx="16" cy="118" r="2.2" fillOpacity="0.3" />
          <circle cx="9" cy="127" r="1.2" fillOpacity="0.25" />
        </g>
      </svg>

      <NoteText />
    </div>
  );
}
