import classNames from 'classnames';
import styles from './TextAnimateMask.module.css';

type TextAnimateMaskProps = {
  /** Empties on scroll rather than fills */
  out?: boolean;
  /** Timeline and range overrides, see the CSS */
  className?: string;
  children: React.ReactNode;
};

/** Text that fills in from faint as it scrolls into view. CSS only */
export function TextAnimateMask({
  out,
  className,
  children,
}: TextAnimateMaskProps) {
  return (
    <span
      className={classNames(
        styles.TextAnimateMask,
        out && styles.out,
        className,
      )}>
      {children}
    </span>
  );
}
