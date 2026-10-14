import classNames from 'classnames';
import styles from './SkillsetSection.module.css';

export type Skill = {
  title: string;
  description: string;
  tools: string[];
};

type SkillRowProps = Skill & {
  number: number;
  isLast: boolean;
};

// Dividers and flap animate on scroll in the CSS
function SkillRow({
  title,
  description,
  tools,
  number,
  isLast,
}: SkillRowProps) {
  return (
    <li className={styles.skill}>
      <span className={styles.line} />
      {isLast && (
        <span className={classNames(styles.line, styles.lineBottom)} />
      )}

      <div className={styles.flap}>
        <span className={styles.number} aria-hidden>
          {String(number).padStart(2, '0')}
        </span>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.body}>
          <p className={styles.description}>{description}</p>
          <ul className={styles.tools}>
            {tools.map(tool => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

type SkillListProps = {
  items: Skill[];
};

export function SkillList({ items }: SkillListProps) {
  return (
    <ol className={styles.list}>
      {items.map((item, index) => (
        <SkillRow
          key={item.title}
          {...item}
          number={index + 1}
          isLast={index === items.length - 1}
        />
      ))}
    </ol>
  );
}
