import { Section } from '../../layout/Section';
import { ProjectList } from './ProjectList';
import { Project } from './ProjectRow';

type WorkSectionProps = {
  items: Project[];
};

export function WorkSection({ items }: WorkSectionProps) {
  return (
    <Section title="Selected Work" count={items.length}>
      <ProjectList items={items} />
    </Section>
  );
}
