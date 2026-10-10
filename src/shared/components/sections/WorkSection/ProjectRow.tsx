import classNames from 'classnames';
import Image from 'next/image';
import styles from './WorkSection.module.css';

export type Project = {
  title: string;
  subtitle: string;
  role: string;
  timeline: string;
  company: string;
  image: string;
  link: string;
  comingSoon?: boolean;
};

type ProjectRowProps = Project & {
  active: boolean;
  onActivate: () => void;
};

export function ProjectRow({
  title,
  subtitle,
  role,
  timeline,
  company,
  image,
  link,
  comingSoon,
  active,
  onActivate,
}: ProjectRowProps) {
  const details = [
    ['Role', role],
    ['Timeline', timeline],
    ['Company', company],
  ];

  return (
    <li
      className={classNames(styles.project, active && styles.active)}
      onMouseEnter={onActivate}
      onFocus={onActivate}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.heading}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>

          {comingSoon ? (
            <span className={styles.strike}>
              <s className={classNames('button', styles.button, styles.static)}>
                View project →
              </s>
              {/* Hand-drawn strike: a pressure-tapered marker stroke, revealed
                  along its centreline by an animated mask so it draws on */}
              <svg
                className={styles.strikeLine}
                viewBox="0 0 250 51"
                preserveAspectRatio="none"
                aria-hidden>
                <defs>
                  <filter
                    id="dry-brush"
                    x="-5%"
                    y="-20%"
                    width="110%"
                    height="140%">
                    {/* Streaks where the marker skips */}
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.04 0.6"
                      numOctaves={2}
                      seed={3}
                      result="noise"
                    />
                    <feColorMatrix
                      in="noise"
                      values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -5 0 0 0 3.6"
                      result="streaks"
                    />
                    <feComposite
                      in="SourceGraphic"
                      in2="streaks"
                      operator="in"
                    />
                  </filter>
                  <mask id="strike" maskUnits="userSpaceOnUse">
                    <path
                      className={styles.strikePath}
                      pathLength={1}
                      d="M0.9 22.3 L8.2 25.8 L18 25.5 L28.1 24.7 L38.4 24.7 L48.9 24.2 L59.6 23.5 L70.4 23 L81.4 22.6 L92.4 21.7 L103.5 21 L114.7 20.8 L125.8 20.3 L137 20.2 L148.2 20.3 L159.2 20.1 L170.2 20 L181.1 20 L191.9 19.7 L202.5 19.1 L212.9 18.6 L223.1 17.9 L233 17.7 L242.7 17.9 L242.7 17.9"
                    />
                  </mask>
                </defs>
                <path
                  mask="url(#strike)"
                  filter="url(#dry-brush)"
                  d="M-0.9 23.5 L2.4 28.3 L8.5 28.5 L13.2 28.5 L18 29.2 L23.2 29.4 L28.4 28.5 L33.2 28.5 L38.5 28.5 L43.9 27.9 L49.1 28.1 L54.4 28.1 L59.6 27.4 L65.3 27.3 L70.5 26.7 L76.2 27.1 L81.7 26 L87.1 25.9 L92.8 25.3 L97.9 25.1 L103.9 24.6 L109.1 24 L114.7 24.3 L120.2 23.9 L126 23.4 L131.4 23.2 L137.1 23 L142.6 23.1 L148 23.1 L153.9 22.2 L159.1 22.7 L164.9 22.2 L170.3 22 L175.8 22.2 L181 21.8 L186.6 21.9 L192.1 21.8 L197.1 20.8 L202.6 20.7 L207.7 20.6 L213 20.4 L218 19.7 L223.1 19.3 L228.1 19.5 L233.1 18.9 L237.8 18.6 L242.8 18.2 L242.8 18.2 L242.7 17.7 L238 17.1 L233 16.7 L228.1 17.2 L223 16.8 L218 16.8 L212.8 17.2 L207.7 17.7 L202.3 17.8 L197.3 17.8 L191.7 18 L186.5 18.3 L181.2 18.5 L175.6 18.2 L170.2 18.5 L164.7 18.7 L159.4 18.1 L153.6 18.4 L148.3 18.1 L142.6 18.3 L136.9 18 L131.4 17.9 L125.7 17.8 L120.3 17.8 L114.6 17.9 L109 18.6 L103.2 18 L98 18.4 L92.1 18.9 L86.7 19 L81.1 19.9 L75.7 19.4 L70.4 20 L64.7 20.6 L59.6 20.3 L54.1 20.3 L48.8 21.1 L43.5 21 L38.4 21.6 L33.3 21.7 L27.8 21.6 L22.9 21.8 L18.1 22.5 L12.9 22.9 L7.9 23.6 L4.1 24.4 L2.4 21.4Z"
                />
              </svg>
              <span className={styles.scribble}>soon!</span>
            </span>
          ) : (
            <a
              className={classNames('button', styles.button)}
              href={link}
              target="_blank"
              rel="noopener noreferrer">
              View project →
            </a>
          )}
        </div>

        <div className={styles.expand}>
          <dl className={styles.details}>
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className={styles.media}>
        <Image
          src={image}
          alt={title}
          sizes="(max-width: 1279px) min(100vw, 640px), 500px"
          fill
        />
      </div>
    </li>
  );
}
