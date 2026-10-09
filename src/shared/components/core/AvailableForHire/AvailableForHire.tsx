import styles from './AvailableForHire.module.css';

export function AvailableForHire() {
  return (
    <div className={styles.availableForHire}>
      <span className={styles.blinker} aria-hidden />

      <span className={styles.text}>Available for hire</span>

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
