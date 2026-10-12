import classNames from 'classnames';
import { ExternalLink } from '../../core/ExternalLink';
import { Section } from '../../layout/Section';
import { FocusItem, History, HistoryEntry } from './HistoryEntry';
import styles from './HistorySection.module.css';

type HistorySectionProps = {
  items: History[];
};

export function HistorySection({ items }: HistorySectionProps) {
  return (
    <Section title="History" count={items.length}>
      <ol className={styles.list}>
        {items.map((item, index) => (
          // Latest role always sharp
          <HistoryEntry
            key={`${item.role}_${item.period}`}
            {...item}
            animated={index > 0}
          />
        ))}
      </ol>

      {/* Outside the list so it isn't counted as a role, sized as a cell */}
      <FocusItem as="div" className={classNames(styles.entry, styles.cta)}>
        <p className={styles.hand}>Looking to hire?</p>
        <ExternalLink
          className={classNames('button', styles.cvButton)}
          href="/sam-wyness-cv.pdf">
          Download CV
        </ExternalLink>
      </FocusItem>
    </Section>
  );
}
