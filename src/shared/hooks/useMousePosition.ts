'use client';

import React, { RefObject } from 'react';

const INITIAL_POS = { x: 0, y: 0, xPct: 0, yPct: 0 };

export default function useMousePosition<T extends HTMLElement>(
  ref?: RefObject<T | null>,
) {
  const [isHovering, setIsHovering] = React.useState(false);
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const [position, setPosition] = React.useState(INITIAL_POS);

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!ref?.current) {
        setPosition({ x: e.clientX, y: e.clientY, xPct: 0, yPct: 0 });
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const { width, height } = rect;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setPosition({ x, y, xPct: x / width, yPct: y / height });
    },
    [ref],
  );

  const handleMouseEnter = React.useCallback(() => {
    setIsHovering(true);
    setPosition(INITIAL_POS);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setIsHovering(false);
    setPosition(INITIAL_POS);
  }, []);

  const handleMouseDown = React.useCallback(() => {
    setIsMouseDown(true);
  }, []);

  const handleMouseUp = React.useCallback(() => {
    setIsMouseDown(false);
  }, []);

  React.useEffect(() => {
    const node = ref?.current || document.body;

    window.addEventListener('mousemove', handleMouseMove);
    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);
    node.addEventListener('mousedown', handleMouseDown);
    node.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
      node.removeEventListener('mousedown', handleMouseDown);
      node.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    handleMouseDown,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
    handleMouseUp,
    ref,
  ]);

  return {
    position,
    isHovering,
    isMouseDown,
  };
}
