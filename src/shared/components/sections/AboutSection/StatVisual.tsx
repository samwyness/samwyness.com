import styles from './AboutSection.module.css';
import { InkLayer, STAT_INK } from './statInk';

const LAYER_CLASS: Record<InkLayer, string> = {
  ink: styles.ink,
  carve: styles.carve,
  accent: styles.accent,
};

type StatVisualProps = {
  /** Which drawing: heart, orbit, hex */
  visual: string;
};

/** Linocut drawing per stat, slaps on like a sticker alongside its count
    when its row plays, see .stat */
export function StatVisual({ visual }: StatVisualProps) {
  const layers = STAT_INK[visual];
  if (!layers) return null;

  return (
    <svg data-motion-start viewBox="0 0 100 100">
      {layers.map(([layer, d], i) => (
        <path key={i} className={LAYER_CLASS[layer]} d={d} />
      ))}
    </svg>
  );
}
