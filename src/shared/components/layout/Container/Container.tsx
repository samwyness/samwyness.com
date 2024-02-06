import classNames from 'classnames';
import styles from './Container.module.css';

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {};

export function Container(props: ContainerProps) {
  return (
    <div {...props} className={classNames(styles.container, props.className)} />
  );
}
