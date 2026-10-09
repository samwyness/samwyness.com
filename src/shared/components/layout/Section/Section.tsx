import classNames from 'classnames';
import { TextAnimateMask } from '../../core/TextAnimateMask';
import { Container } from '../Container';
import styles from './Section.module.css';

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  as?: 'section' | 'header' | 'footer';
  title?: string;
  count?: number;
  containerClassName?: string;
};

export function Section({
  as: Component = 'section',
  title,
  count,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      {...props}
      className={classNames(styles.section, props.className)}>
      <Container className={classNames(styles.container, containerClassName)}>
        {title && (
          <h2 className={styles.title}>
            <TextAnimateMask
              offset={['start 0.9', 'end 0.6']}
              inputRange={[0, 1]}>
              {title}
            </TextAnimateMask>
            {count !== undefined && (
              <span className={styles.count}>({count})</span>
            )}
          </h2>
        )}
        {children}
      </Container>
    </Component>
  );
}
