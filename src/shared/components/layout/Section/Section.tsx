import classNames from 'classnames';
import { Container } from '../Container';
import styles from './Section.module.css';

type SectionProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  containerClassName?: string;
};

export function Section({
  title,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section {...props} className={classNames(styles.section, props.className)}>
      <Container className={containerClassName}>
        {title && (
          <h2 className={styles.title}>
            <strong>{title}</strong>
          </h2>
        )}
        {children}
      </Container>
    </section>
  );
}
