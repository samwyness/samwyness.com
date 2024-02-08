import Image from 'next/image';
import { TextAnimateMask } from '../TextAnimateMask';
import styles from './HoverImageLink.module.css';

type HoverImageLinkProps = {
  link: string;
  title: string;
  completed: string;
  tags: string[];
  image: string;
};

export function HoverImageLink({
  link,
  title,
  completed,
  tags,
  image,
}: HoverImageLinkProps) {
  return (
    <a
      className={styles.hoverImageLink}
      href={link}
      target="_blank"
      referrerPolicy="no-referrer">
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <div>
          <TextAnimateMask>
            {completed} ~ {tags.join(', ')}
          </TextAnimateMask>
        </div>
      </div>

      <div className={styles.linkText}>VIEW</div>

      <div className={styles.image}>
        <Image src={image} alt={title} width={160} height={160} />
      </div>
    </a>
  );
}
