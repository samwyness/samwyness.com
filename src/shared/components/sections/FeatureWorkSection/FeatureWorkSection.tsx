import { HoverImageLink } from '../../core/HoverImageLink';
import { Section } from '../../layout/Section';

type HeroSectionProps = {
  items: {
    title: string;
    link: string;
    completed: string;
    tags: string[];
    image: string;
  }[];
};

export function FeatureWorkSection({ items }: HeroSectionProps) {
  return (
    <Section title={`Featured (${items.length})`}>
      {items.map(item => (
        <HoverImageLink
          key={item.title}
          link={item.link}
          title={item.title}
          completed={item.completed}
          tags={item.tags}
          image={item.image}
        />
      ))}
    </Section>
  );
}
