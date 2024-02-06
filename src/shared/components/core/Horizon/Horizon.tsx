'use client';

import { LazyMotion, animate, domAnimation, m as motion } from 'framer-motion';
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import styles from './Horizon.module.css';

const getDistanceFromRect = (rect: DOMRect, x: number, y: number) => {
  if (!rect) return;

  const { top, left, width, height } = rect;
  const right = left + width;
  const bottom = top + height;
  const nearestX = Math.max(left, Math.min(x, right));
  const nearestY = Math.max(top, Math.min(y, bottom));
  const dx = x - nearestX;
  const dy = y - nearestY;

  return Math.sqrt(dx * dx + dy * dy);
};

type HorizonProps = {
  positionX?: string;
  positionY?: string;
};

export function Horizon({
  positionX = '-25vw',
  positionY = '50vh',
}: HorizonProps) {
  const ref = useRef<HTMLDivElement>(null!);

  const [clientX, setClientX] = useState(0);
  const [clientY, setClientY] = useState(0);

  // const transformX = useTransform(y, [0, window.innerWidth], ['-50px', '50px']);
  // const transformY = useTransform(
  //   clientX,
  //   [0, window.innerHeight],
  //   ['-50px', '50px'],
  // );

  const handleMouse = useCallback(
    (event: MouseEvent) => {
      if (!ref.current) return;

      setClientX(event.clientX);
      setClientY(event.clientY);

      const { top, left, width, height } = ref.current?.getBoundingClientRect();
      const center = { x: left + width / 2, y: top + height / 2 };
      const r = { x: clientX - center.x, y: clientY - center.y };

      animate(ref.current, { x: r.x * 0.1, y: r.y * 0.1 }, { duration: 0 });
    },
    [clientX, clientY],
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouse);
  }, [handleMouse]);

  const distance = getDistanceFromRect(
    ref.current?.getBoundingClientRect(),
    clientX,
    clientY,
  );

  // useMotionValueEvent(x, 'change', last => console.log(last));

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={styles.horizon}
        style={{ top: positionY, left: positionX }}>
        <motion.div
          ref={ref}
          className={styles.aurora}
          style={
            {
              // '--transformX': transformX,
              // '--transformY': transformY,
            } as CSSProperties
          }
        />
        <div className={styles.sun} />
      </div>
    </LazyMotion>
  );
}
