import { Section } from '../../layout/Section';
import { Skill, SkillList } from './SkillList';

type SkillsetSectionProps = {
  items: Skill[];
};

export function SkillsetSection({ items }: SkillsetSectionProps) {
  return (
    <Section title="Skillset">
      <SkillList items={items} />
    </Section>
  );
}
