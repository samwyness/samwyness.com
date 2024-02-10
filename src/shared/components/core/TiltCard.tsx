'use client';

import {
  LazyMotion,
  TargetAndTransition,
  domAnimation,
  m as motion,
  transform,
} from 'framer-motion';
import React, { ElementRef, PropsWithChildren } from 'react';
import useMousePosition from 'src/shared/hooks/useMousePosition';

type TiltCardProps = PropsWithChildren & {
  className?: string;
  translateZ?: number;
};

export function TiltCard({ translateZ = 25, ...props }: TiltCardProps) {
  const ref = React.useRef<ElementRef<'div'>>(null);
  const { isHovering, position } = useMousePosition(ref);

  const rotateX = transform(position.yPct, [0, 1], ['7.5deg', '-7.5deg']);
  const rotateY = transform(position.xPct, [0, 1], ['-7.5deg', '7.5deg']);

  return (
    <LazyMotion features={domAnimation}>
      <motion.div
        {...props}
        ref={ref}
        animate={
          {
            '--rotateX': isHovering ? rotateX : 0,
            '--rotateY': isHovering ? rotateY : 0,
            '--translateZ': (isHovering ? translateZ : 0) + 'px',
            transformStyle: 'preserve-3d',
          } as TargetAndTransition
        }
        transition={{ duration: 0.1 }}
      />
    </LazyMotion>
  );
}
