'use client';

import { Mesh, Program, Triangle } from 'ogl';
import React from 'react';
import { COLORS } from 'src/shared/constants';
import {
  createRenderer,
  ease,
  imageTexture,
  keepContext,
  loopWhileVisible,
} from 'src/shared/utils/gl';
import { fragment, vertex } from './heroFxShaders';

// Where the autopilot lens drifts, in image UV (y up): just round the nose
const WANDER = { x: 0.79, y: 0.6, rx: 0.015, ry: 0.012 };
// Pause after the photo's reveal before the autopilot opens, ms
const AUTO_DELAY = 300;
// Lens catching the cursor, per 60fps frame
const FOLLOW = 0.2;
// Glide between the cursor and the autopilot, ms
const GLIDE_MS = 400;
// Lens size while following the cursor, against the autopilot's
const FOLLOW_SIZE = 0.8;
// Lens size while the mouse is held down, and how quickly it squeezes in, per
// 60fps frame
const PRESS_SIZE = 0.6;
const PRESS_EASE = 0.25;
// Split hero layout, as in HeroSection.module.css: touch drags the lens only
// here, where the photo isn't full width and the page still scrolls beside it
const SPLIT =
  '(min-width: 1024px) and (orientation: landscape), (min-width: 1440px)';

const hex = (h: string) =>
  [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);

type HeroFxProps = {
  /** Element whose pointer moves steer the lens */
  frameRef: React.RefObject<HTMLElement | null>;
  className?: string;
};

/**
 * WebGL layer over the hero photo: a riso print all over, with a sticker cut
 * out that follows the cursor, or sits on the face when there isn't one.
 * Transparent where it has nothing to add, so the real <Image> shows through.
 * Textured from that same <Image>, so the photo only downloads once
 */
export function HeroFx({ frameRef, className }: HeroFxProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const frame = frameRef.current;
    // The photo underneath, used as the texture
    const photo = parent?.querySelector('img');
    if (!canvas || !parent || !frame || !photo) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Built from scratch again if the GPU drops the context
    return keepContext(canvas, () => {
      const renderer = createRenderer(canvas);
      if (!renderer) return; // No WebGL: plain photo
      const { gl } = renderer;

      const loading = new AbortController();
      let loaded = false;
      const texture = imageTexture(
        gl,
        photo,
        () => {
          program.uniforms.uImageAspect.value =
            photo.naturalWidth / photo.naturalHeight;
          loaded = true;
        },
        loading.signal,
      );

      const program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        uniforms: {
          tMap: { value: texture },
          uResolution: { value: [1, 1] },
          uImageAspect: { value: 1 },
          uTime: { value: 0 },
          uHover: { value: 0 },
          uIn: { value: 0 },
          uMouse: { value: [0.5, 0.5] },
          uSlip: { value: [0.5, 0.5] },
          uInk: { value: hex(COLORS.surfaceDark) },
          uPaper: { value: hex(COLORS.onSurfaceDark) },
        },
      });
      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      const pointer = { x: 0.5, y: 0.5, inside: false, pressed: false };
      const mouse = { x: 0.5, y: 0.5 };
      // Kept apart from mouse, so a closing lens stays put while this settles
      const slip = { x: 0.5, y: 0.5 };
      let hover = 0;
      // 0–1 while the mouse is held, eased apart from hover so it's snappier
      let press = 0;
      let fadeIn = 0;
      let wasAuto = false;
      // Glide between the cursor and the autopilot: where from, and when
      const glide = { x: 0, y: 0, start: -Infinity };
      const t0 = performance.now();
      // When the photo's reveal finished, for the autopilot
      let revealedAt = Infinity;
      let size = [1, 1];

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = parent;
        renderer.setSize(w, h);
        size = [w, h];
        program.uniforms.uResolution.value = size;
      };

      // Image UV to canvas UV, undoing cover() in the shader
      const toCanvas = (x: number, y: number) => {
        const a = size[0] / size[1];
        const ia = program.uniforms.uImageAspect.value;
        if (a > ia) return { x, y: (y - 0.5) * (a / ia) + 0.5 };
        const s = a / ia;
        return { x: (x - (1 - s)) / s, y };
      };

      // Small slow drift round the nose, never quite repeating
      const wander = (t: number) =>
        toCanvas(
          WANDER.x +
            Math.sin(t * 0.31) * WANDER.rx * 0.7 +
            Math.sin(t * 0.53 + 1) * WANDER.rx * 0.3,
          WANDER.y +
            Math.sin(t * 0.41 + 2) * WANDER.ry * 0.7 +
            Math.sin(t * 0.67) * WANDER.ry * 0.3,
        );

      const split = window.matchMedia(SPLIT);
      const handleMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' && !split.matches) return;
        const rect = canvas.getBoundingClientRect();
        pointer.x = (e.clientX - rect.left) / rect.width;
        pointer.y = 1 - (e.clientY - rect.top) / rect.height;
        // Snap the eased mouse on entry so effects open at the cursor
        if (!pointer.inside && hover < 0.05) {
          mouse.x = pointer.x;
          mouse.y = pointer.y;
        }
        pointer.inside = true;
      };
      // Holding the mouse squeezes the lens. Touch is always held while
      // dragging, so it keeps the follow size
      const handleDown = (e: PointerEvent) => {
        handleMove(e);
        if (e.pointerType === 'mouse' && e.button === 0) pointer.pressed = true;
      };
      const handleLeave = () => {
        pointer.inside = false;
        pointer.pressed = false;
      };
      // A lifted finger leaves, so the lens glides back to the face
      const handleUp = (e: PointerEvent) => {
        pointer.pressed = false;
        if (e.pointerType !== 'mouse') handleLeave();
      };

      const tick = (now: number, dt: number) => {
        if (!loaded) return;

        const t = (now - t0) / 1000;

        // Cursor, or the autopilot's path on the face when there isn't one
        const auto = !pointer.inside && now > revealedAt + AUTO_DELAY;
        const aim = auto ? wander(t) : pointer;
        const active = pointer.inside || auto;
        if (auto !== wasAuto) {
          // Autopilot opens on the face, not where the mouse left
          if (auto && hover < 0.05) {
            mouse.x = aim.x;
            mouse.y = aim.y;
          } else {
            glide.x = mouse.x;
            glide.y = mouse.y;
            glide.start = now;
          }
        }
        wasAuto = auto;

        const g = (now - glide.start) / GLIDE_MS;
        if (g < 1) {
          // Eased in and out, tracking the aim as it moves
          const e = g < 0.5 ? 4 * g ** 3 : 1 - (-2 * g + 2) ** 3 / 2;
          mouse.x = glide.x + (aim.x - glide.x) * e;
          mouse.y = glide.y + (aim.y - glide.y) * e;
        } else {
          mouse.x += (aim.x - mouse.x) * ease(FOLLOW, dt);
          mouse.y += (aim.y - mouse.y) * ease(FOLLOW, dt);
        }
        slip.x += ((active ? aim.x : 0.5) - slip.x) * ease(0.06, dt);
        slip.y += ((active ? aim.y : 0.5) - slip.y) * ease(0.06, dt);

        // Smaller while following the cursor, full size on the face
        const open = pointer.inside ? FOLLOW_SIZE : auto ? 1 : 0;
        hover += (open - hover) * ease(0.08, dt);
        press += (+pointer.pressed - press) * ease(PRESS_EASE, dt);
        fadeIn += (1 - fadeIn) * ease(0.06, dt);
        program.uniforms.uTime.value = t;
        program.uniforms.uHover.value =
          hover * (1 - press * (1 - PRESS_SIZE / FOLLOW_SIZE));
        program.uniforms.uIn.value = fadeIn;
        // Written in place, no arrays allocated per frame
        const { uMouse, uSlip } = program.uniforms;
        uMouse.value[0] = mouse.x;
        uMouse.value[1] = mouse.y;
        uSlip.value[0] = slip.x;
        uSlip.value[1] = slip.y;

        renderer.render({ scene: mesh });
      };

      // Only loop while the photo is on screen
      const stopLoop = loopWhileVisible(parent, tick);

      // The canvas shares the photo's reveal, rendered with it so in step
      Promise.all(
        canvas
          .getAnimations()
          .filter(anim => anim.timeline === document.timeline)
          .map(anim => anim.finished),
      )
        .then(() => (revealedAt = performance.now()))
        .catch(() => {}); // Cancelled on unmount

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(parent);
      frame.addEventListener('pointerdown', handleDown);
      frame.addEventListener('pointermove', handleMove);
      frame.addEventListener('pointerleave', handleLeave);
      frame.addEventListener('pointerup', handleUp);
      frame.addEventListener('pointercancel', handleLeave);

      return () => {
        loading.abort();
        stopLoop();
        observer.disconnect();
        frame.removeEventListener('pointerdown', handleDown);
        frame.removeEventListener('pointermove', handleMove);
        frame.removeEventListener('pointerleave', handleLeave);
        frame.removeEventListener('pointerup', handleUp);
        frame.removeEventListener('pointercancel', handleLeave);
        // No loseContext: a remount on this canvas would get the dead context
      };
    });
  }, [frameRef]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
