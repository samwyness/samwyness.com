import classNames from 'classnames';
import type { Metadata } from 'next';
import { AvailableForHire } from '../../AvailableForHire';
import { HelloWorld } from '../../HelloWorld';
import { ScrollTextMask } from '../../ScrollTextMask';
import styles from './Footer.module.css';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export function Footer({}) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerRow}>
          <div className={styles.column}>
            <HelloWorld />
          </div>

          <nav className={classNames(styles.column, styles.columnOffset)}>
            <AvailableForHire />
            <p>
              <ScrollTextMask>
                Schedule a quick 30min chat to discuss details about your
                project, and discover what services I can offer.
              </ScrollTextMask>
            </p>
          </nav>
        </div>

        <div className={classNames(styles.footerRow, styles.footerMeta)}>
          <div className={styles.column}>
            <span>© {new Date().getFullYear()} Sam Wyness</span>
          </div>

          <div className={classNames(styles.column, styles.columnOffset)}>
            <ul className={styles.socialLinks}>
              <li>
                <a
                  href="https://github.com/samwyness"
                  target="_blank"
                  referrerPolicy="no-referrer">
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/samwyness22"
                  target="_blank"
                  referrerPolicy="no-referrer">
                  Linkedin
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
