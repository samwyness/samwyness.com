'use client';

import React, { RefObject, useCallback, useState } from 'react';

export default function useHover3d<T extends HTMLElement>(
  ref: RefObject<T>,
  rotationRange = 15,
) {
  const [isHovering, setIsHovering] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const { width, height } = rect;

      const mouseX = (e.clientX - rect.left) * rotationRange;
      const mouseY = (e.clientY - rect.top) * rotationRange;

      const rX = (mouseY / height - rotationRange / 2) * -1;
      const rY = mouseX / width - rotationRange / 2;

      setRotateX(rX);
      setRotateY(rY);
    },
    [ref, rotationRange],
  );

  const handleMouseEnter = useCallback(() => {
    if (!ref.current) return;
    setIsHovering(true);
    setRotateX(0);
    setRotateY(0);
  }, [ref]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
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
    rotateX,
    rotateY,
    isHovering,
  };
}
