import classNames from 'classnames';
import { useId } from 'react';
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
  // Named by its title, so it's a region landmark
  const titleId = useId();
  return (
    <Component
      aria-labelledby={title ? titleId : undefined}
      {...props}
      className={classNames(styles.section, props.className)}>
      <Container className={classNames(styles.container, containerClassName)}>
        {title && (
          <h2 id={titleId} className={styles.title}>
            <TextAnimateMask>{title}</TextAnimateMask>
            {count !== undefined && (
              <>
                {/* Read as "Work (4)", without widening the visual gap */}
                <span className="sr-only"> </span>
                <span className={styles.count}>({count})</span>
              </>
            )}
          </h2>
        )}
        {children}
      </Container>
    </Component>
  );
}
