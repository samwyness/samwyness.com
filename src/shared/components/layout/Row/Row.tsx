import classNames from 'classnames';
import styles from './Row.module.css';

type RowProps = React.HTMLAttributes<HTMLDivElement> & {};

export function Row(props: RowProps) {
  return <div {...props} className={classNames(styles.row, props.className)} />;
}
