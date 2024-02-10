import classNames from 'classnames';
import styles from './Row.module.css';

type RowProps = React.HTMLAttributes<HTMLDivElement> & {
  wrap?: boolean;
};

export function Row({ wrap = false, ...props }: RowProps) {
  return (
    <div
      {...props}
      className={classNames(
        styles.row,
        wrap && styles.rowWrap,
        props.className,
      )}
    />
  );
}
