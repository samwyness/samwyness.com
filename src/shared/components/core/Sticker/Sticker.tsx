import classNames from 'classnames';
import Image from 'next/image';
import styles from './Sticker.module.css';

/** Every sticker generated into public/images/stickers */
export const STICKER_NAMES = [
  'aces',
  'alien',
  'banana',
  'beer',
  'bolt',
  'boombox',
  'branch',
  'cassette',
  'cheese',
  'chilli',
  'coffee',
  'cutlery',
  'duck',
  'eye',
  'fish',
  'flame',
  'flamingo',
  'ghost',
  'headphones',
  'hotsauce',
  'keycap',
  'lime',
  'moka',
  'monkey',
  'notes',
  'octopus',
  'owl',
  'palm',
  'plane',
  'prawn',
  'ramen',
  'robot',
  'sardines',
  'skull',
  'snake',
  'soyfish',
  'sun',
  'sushi',
  'taco',
  'tent',
  'terminal',
  'van',
  'vinyl',
  'wave',
  'wine',
] as const;

export type StickerName = (typeof STICKER_NAMES)[number];

/** Offsets from the parent's edges, e.g. { top: '8%', left: '-6%' } */
type StickerPosition = Pick<
  React.CSSProperties,
  'top' | 'right' | 'bottom' | 'left'
>;

type StickerProps = {
  name: StickerName;
  /** Accessible label; omit for purely decorative stickers */
  label?: string;
  /** Resting tilt in degrees */
  rotate?: number;
  /** Delay before the "slap on" entrance, in seconds */
  delay?: number;
  /** Skip the "slap on" entrance */
  still?: boolean;
  /**
   * The sticker's own SVG markup, drawn inline instead of an <img>, which
   * keeps it out of LCP. Empty until loaded
   */
  svg?: string;
  /** Absolutely positions the sticker within its (positioned) parent */
  position?: StickerPosition;
  className?: string;
} & Pick<
  React.HTMLAttributes<HTMLSpanElement>,
  'onMouseEnter' | 'onMouseLeave'
>;

/** Die-cut linocut sticker that slaps on once */
export function Sticker({
  name,
  label,
  rotate = 0,
  delay = 0,
  still,
  svg,
  position,
  className,
  ...handlers
}: StickerProps) {
  return (
    <span
      className={classNames(styles.sticker, still && styles.still, className)}
      style={
        {
          '--sticker-rotate': `${rotate}deg`,
          '--sticker-delay': `${delay}s`,
          ...(position && { position: 'absolute', ...position }),
        } as React.CSSProperties
      }
      {...handlers}>
      {svg !== undefined ? (
        <span
          className={styles.inline}
          role={label ? 'img' : undefined}
          aria-label={label}
          aria-hidden={label ? undefined : true}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <Image
          src={`/images/stickers/${name}.svg`}
          alt={label ?? ''}
          aria-hidden={label ? undefined : true}
          draggable={false}
          unoptimized
          fill
        />
      )}
    </span>
  );
}
