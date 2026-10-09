import { Section } from '../../layout/Section';
import { History, HistoryEntry } from './HistoryEntry';
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
    </Section>
  );
}
