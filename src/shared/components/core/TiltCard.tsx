'use client';

import {
  LazyMotion,
  TargetAndTransition,
  domAnimation,
  m as motion,
} from 'framer-motion';
import { ElementRef, PropsWithChildren, useRef } from 'react';
import useHover3d from 'src/shared/utils/useHover3d';

type TiltCardProps = PropsWithChildren & {
  className?: string;
  rotationRange?: number;
  translateZ?: number;
};

export function TiltCard({
  rotationRange = 15,
  translateZ = 40,
  ...props
}: TiltCardProps) {
  const ref = useRef<ElementRef<'div'>>(null);
  const { isHovering, rotateX, rotateY } = useHover3d(ref, rotationRange);

  return (
    <LazyMotion features={domAnimation}>
      <motion.div
        {...props}
        ref={ref}
        animate={
          {
            '--rotateX': rotateX + 'deg',
            '--rotateY': rotateY + 'deg',
            '--translateZ': (isHovering ? translateZ : 0) + 'px',
            transformStyle: 'preserve-3d',
          } as TargetAndTransition
        }
        transition={{ type: 'tween', duration: 0.1 }}
      />
    </LazyMotion>
  );
}
