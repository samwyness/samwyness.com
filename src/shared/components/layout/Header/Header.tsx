import classNames from 'classnames';
import Link from 'next/link';
import { AvailableForHire } from '../../core/AvailableForHire';
import styles from './Header.module.css';

type HeaderProps = {
  className?: string;
};

/** Brand + hire status; sits inside the hero's left column */
export function Header({ className }: HeaderProps) {
  return (
    <header className={classNames(styles.header, className)}>
      <Link href="/" className={styles.brand}>
        SW.
      </Link>
      <AvailableForHire />
    </header>
  );
}
