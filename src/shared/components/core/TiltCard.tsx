'use client';

import { LazyMotion, domAnimation, m as motion } from 'framer-motion';
import { CSSProperties, ElementRef, PropsWithChildren, useRef } from 'react';
import useHover3d from 'src/shared/utils/useHover3d';

type TiltCardProps = PropsWithChildren & {
  className?: string;
  rotationRange?: number;
  translateZ?: number;
};

export function TiltCard({
  rotationRange = 15,
  translateZ = -40,
  ...props
}: TiltCardProps) {
  const ref = useRef<ElementRef<'div'>>(null);
  const { isHovering, rotateX, rotateY } = useHover3d(ref, rotationRange);

  return (
    <LazyMotion features={domAnimation}>
      <motion.div
        {...props}
        ref={ref}
        style={
          {
            '--rotateX': rotateX + 'deg',
            '--rotateY': rotateY + 'deg',
            '--translateZ': (isHovering ? translateZ : 10) + 'px',
            transition: 'transform 0.12s ease',
            transformStyle: 'preserve-3d',
          } as CSSProperties
        }
      />
    </LazyMotion>
  );
}
