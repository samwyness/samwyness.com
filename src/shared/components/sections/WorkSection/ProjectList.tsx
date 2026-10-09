'use client';

import { CSSProperties, useState } from 'react';
import { Project, ProjectRow } from './ProjectRow';
import styles from './WorkSection.module.css';

type ProjectListProps = {
  items: Project[];
};

export function ProjectList({ items }: ProjectListProps) {
  // First project stays open until another is hovered/focused
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <ul
      className={styles.list}
      style={{ '--count': items.length } as CSSProperties}
      onMouseLeave={() => setActiveIndex(0)}>
      {items.map((item, index) => (
        <ProjectRow
          key={item.title}
          {...item}
          active={index === activeIndex}
          onActivate={() => setActiveIndex(index)}
        />
      ))}
    </ul>
  );
}
