import { AnimateScrollProgress } from '../AnimateScrollProgress';
import { AnimateScrollProgressProps } from '../AnimateScrollProgress/AnimateScrollProgress';
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
