import {
  AnimateScrollProgress,
  AnimateScrollProgressProps,
} from '../AnimateScrollProgress';
import styles from './TextAnimateMask.module.css';

export function TextAnimateMask({
  children,
  ...props
}: AnimateScrollProgressProps) {
  return (
    <AnimateScrollProgress {...props} className={styles.TextAnimateMask}>
      {children}
    </AnimateScrollProgress>
  );
}
