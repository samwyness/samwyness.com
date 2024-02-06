import { AnimateScrollProgress } from '../AnimateScrollProgress';
import { AnimateScrollProgressProps } from '../AnimateScrollProgress/AnimateScrollProgress';
import styles from './ScrollTextMask.module.css';

export function ScrollTextMask({
  children,
  ...props
}: AnimateScrollProgressProps) {
  return (
    <AnimateScrollProgress {...props} className={styles.scrollTextMask}>
      {children}
    </AnimateScrollProgress>
  );
}
