import classNames from 'classnames';
import { ExternalLink } from '../../core/ExternalLink';
import styles from './ProjectCta.module.css';

type ProjectCtaProps = {
  link: string;
  comingSoon?: boolean;
  className?: string;
};

/** "View project" button, greyed out while the project is coming soon */
export function ProjectCta({ link, comingSoon, className }: ProjectCtaProps) {
  if (comingSoon) {
    return (
      <span
        className={classNames('button', styles.disabled, className)}
        // Year already says "Coming soon"
        aria-hidden>
        View project →
      </span>
    );
  }

  return (
    <ExternalLink className={classNames('button', className)} href={link}>
      View project <span aria-hidden>→</span>
    </ExternalLink>
  );
}
