import { ScrollTextMask } from '../ScrollTextMask';
import styles from './AvailableForHire.module.css';

export function AvailableForHire() {
  return (
    <div className={styles.availableForHire}>
      <span className={styles.blinker}></span>
      <ScrollTextMask>
        <span>Available for hire</span>
      </ScrollTextMask>

      <a
        className="button"
        href="https://calendly.com/samwyness/30min"
        target="_blank"
        referrerPolicy="no-referrer">
        Book a call
      </a>
    </div>
  );
}
