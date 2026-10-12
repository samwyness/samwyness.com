import classNames from 'classnames';
import { AvailableForHire } from '../../core/AvailableForHire';
import { Brand } from '../../core/Brand';
import styles from './Header.module.css';

type HeaderProps = {
  className?: string;
};

/** Brand + hire status; sits inside the hero's left column, the page <header> */
export function Header({ className }: HeaderProps) {
  return (
    <div className={classNames(styles.header, className)}>
      <Brand />
      <AvailableForHire />
    </div>
  );
}
