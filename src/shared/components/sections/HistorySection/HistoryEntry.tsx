import classNames from 'classnames';
import { ReactNode } from 'react';
import styles from './HistorySection.module.css';

export type History = {
  role: string;
  company: string;
  period: string;
};

type FocusItemProps = {
  /** li in the list, div outside it */
  as?: 'li' | 'div';
  className?: string;
  animated?: boolean;
  children: ReactNode;
};

/** Grid cell that pulls into focus as it scrolls into view, see .focus */
export function FocusItem({
  as: Item = 'li',
  className = styles.entry,
  animated = true,
  children,
}: FocusItemProps) {
  return (
    <Item className={classNames(className, animated && styles.focus)}>
      {children}
    </Item>
  );
}

type HistoryEntryProps = History & {
  animated?: boolean;
};

export function HistoryEntry({
  role,
  company,
  period,
  animated,
}: HistoryEntryProps) {
  return (
    <FocusItem animated={animated}>
      <p className={styles.period}>{period}</p>
      <h3 className={styles.role}>{role}</h3>
      <p className={styles.company}>{company}</p>
    </FocusItem>
  );
}
