import { TextAnimateMask } from '../../core/TextAnimateMask';
import { Row } from '../../layout/Row';
import { Section } from '../../layout/Section';
import styles from './HistorySection.module.css';

type HistorySectionProps = {
  items: {
    role: string;
    company: string;
    period: string;
  }[][];
};

export function HistorySection({ items }: HistorySectionProps) {
  return (
    <Section title="History">
      <Row wrap>
        {items.map((item, index) => (
          <div key={`experience_${index}`} className={styles.column}>
            {item.map((data, dataIndex) => (
              <p key={`role_${data.role}_${dataIndex}`}>
                <TextAnimateMask>
                  <strong>{data.role}</strong>
                  <br />
                </TextAnimateMask>
                {data.company && (
                  <TextAnimateMask>
                    {data.company}
                    <br />
                  </TextAnimateMask>
                )}
                <TextAnimateMask>
                  <span className="text-muted">{data.period}</span>
                </TextAnimateMask>
              </p>
            ))}
          </div>
        ))}
      </Row>
    </Section>
  );
}
