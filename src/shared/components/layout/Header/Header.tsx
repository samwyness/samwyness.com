import Link from 'next/link';
import { AvailableForHire } from '../../core/AvailableForHire';
import { Row } from '../Row';
import { Section } from '../Section';
import styles from './Header.module.css';

export function Header() {
  return (
    <Section as="header" className={styles.header}>
      <Row className={styles.row}>
        <Link href="/" className={styles.brand}>
          <strong>SW</strong>.STUDIO
        </Link>
        <AvailableForHire />
      </Row>
    </Section>
  );
}
