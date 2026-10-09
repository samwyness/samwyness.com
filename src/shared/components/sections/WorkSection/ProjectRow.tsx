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
            <span
              className={classNames('button', styles.button, styles.static)}>
              Coming soon
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
