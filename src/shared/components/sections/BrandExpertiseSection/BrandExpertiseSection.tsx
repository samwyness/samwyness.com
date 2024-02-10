import { TextAnimateMask } from '../../core/TextAnimateMask';
import { Row } from '../../layout/Row';
import { Section } from '../../layout/Section';
import styles from './BrandExpertiseSection.module.css';

type BrandExpertiseSectionProps = {
  brands: string[];
  expertise: string[];
};

export function BrandExpertiseSection({
  brands,
  expertise,
}: BrandExpertiseSectionProps) {
  return (
    <Section>
      <Row wrap className={styles.row}>
        <div className={styles.column}>
          <h2 className={styles.title}>
            <strong>Brand collaborations</strong>
          </h2>

          <ul>
            {brands.map(brand => (
              <li key={brand}>
                <TextAnimateMask>{brand}</TextAnimateMask>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.column}>
          <h2 className={styles.title}>
            <strong>Areas of expertise</strong>
          </h2>

          <ul>
            {expertise.map(expertise => (
              <li key={expertise}>
                <TextAnimateMask>{expertise}</TextAnimateMask>
              </li>
            ))}
          </ul>
        </div>
      </Row>
    </Section>
  );
}
