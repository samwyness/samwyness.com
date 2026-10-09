'use client';

import { LazyMotion, domAnimation, m as motion } from 'framer-motion';
import useMousePosition from 'src/shared/hooks/useMousePosition';

export function Cursor() {
  const { position, isMouseDown } = useMousePosition();

  return (
    <LazyMotion features={domAnimation}>
      <motion.span
        animate={{
          x: position.x,
          y: position.y,
          scale: isMouseDown ? 2.5 : 1,
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          margin: -6,
          borderRadius: 20,
          background: 'rgba(240, 57, 51, 0.2)',
          transformOrigin: 'center',
          pointerEvents: 'none',
          zIndex: -1,
        }}
        transition={{ type: 'tween', ease: 'backOut' }}
      />
    </LazyMotion>
  );
}
