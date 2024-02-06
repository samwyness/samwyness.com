import classNames from 'classnames';
import Image, { ImageProps } from 'next/image';
import styles from './ProjectImage.module.css';

type ProjectImageProps = ImageProps & {
  offset?: boolean;
};

export function ProjectImage({ offset = false, ...props }: ProjectImageProps) {
  return (
    <div
      className={classNames(
        styles.projectGridImage,
        offset && styles.projectGridImageWithOffset,
      )}>
      <Image {...props} src={props.src} alt={props.alt} />
    </div>
  );
}
