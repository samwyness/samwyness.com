import { ExternalLink } from '../ExternalLink';
import styles from './AvailableForHire.module.css';

export function AvailableForHire() {
  return (
    <div className={styles.availableForHire}>
      <span className={styles.blinker} aria-hidden />

      <span className={styles.text}>Available for hire</span>

      <ExternalLink
        className="button"
        href="https://calendly.com/samwyness/30min">
        Book a call
      </ExternalLink>
    </div>
  );
}
