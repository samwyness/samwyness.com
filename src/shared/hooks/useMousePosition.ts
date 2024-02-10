'use client';

import React, { RefObject } from 'react';

const INITIAL_POS = { x: 0, y: 0, xPct: 0, yPct: 0 };

export default function useMousePosition<T extends HTMLElement>(
  ref: RefObject<T>,
) {
  const [isHovering, setIsHovering] = React.useState(false);
  const [position, setPosition] = React.useState(INITIAL_POS);

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const { width, height } = rect;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setPosition({ x, y, xPct: x / width, yPct: y / height });
    },
    [ref],
  );

  const handleMouseEnter = React.useCallback(() => {
    if (!ref.current) return;
    setIsHovering(true);
    setPosition(INITIAL_POS);
  }, [ref]);

  const handleMouseLeave = React.useCallback(() => {
    if (!ref.current) return;
    setIsHovering(false);
    setPosition(INITIAL_POS);
  }, [ref]);

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    const { current } = ref;

    current.addEventListener('mousemove', handleMouseMove);
    current.addEventListener('mouseenter', handleMouseEnter);
    current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      current.removeEventListener('mousemove', handleMouseMove);
      current.removeEventListener('mouseenter', handleMouseEnter);
      current.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseEnter, handleMouseLeave, handleMouseMove, ref]);

  return {
    position,
    isHovering,
  };
}
