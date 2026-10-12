import classNames from 'classnames';
import Link from 'next/link';
import styles from './Brand.module.css';

type BrandProps = {
  className?: string;
};

/** "SW." home link */
export function Brand({ className }: BrandProps) {
  return (
    <Link
      href="/"
      aria-label="Sam Wyness, home"
      className={classNames(styles.brand, className)}>
      SW.
    </Link>
  );
}
