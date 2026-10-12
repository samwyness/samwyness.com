'use client';

import { Mesh, Plane, Program } from 'ogl';
import React from 'react';
import {
  createRenderer,
  ease,
  imageTexture,
  loopWhileVisible,
} from 'src/shared/utils/gl';
import styles from './WorkSection.module.css';

// Canvas overhangs the list so a bent preview isn't clipped at the edges
const OVERHANG = 200;
// Size while following the cursor, against the slot, so it has room to move
const FOLLOW_SCALE = 0.8;
// Open slot's height to width, --media-height in WorkSection.module.css
const MEDIA_RATIO = 0.56;
// How quickly the preview catches its target, per 60fps frame
const EASE = 0.15;
// Lag behind the cursor in px, capped so fast flicks don't fold the sheet
const MAX_LAG = 100;
const FADE_MS = 300;
const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec2 uv;
  uniform vec4 uRect;
  uniform vec2 uResolution;
  uniform vec2 uVelocity;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    // Local px from the centre, y down like the DOM
    vec2 p = vec2(position.x, -position.y) * uRect.zw;
    // Held in the middle like a sheet, so the edges trail behind the cursor
    float d = dot(position.xy, position.xy) * 4.0;
    p -= uVelocity * (0.2 + d) * 0.11;
    // and it leans into the move
    float a = clamp(uVelocity.x * 0.0008, -0.07, 0.07);
    p = mat2(cos(a), sin(a), -sin(a), cos(a)) * p;
    vec2 px = uRect.xy + uRect.zw * 0.5 + p;
    vec2 clip = px / uResolution * 2.0 - 1.0;
    gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform sampler2D tFrom;
  uniform sampler2D tTo;
  uniform float uFromAspect;
  uniform float uToAspect;
  uniform vec4 uRect;
  uniform float uProgress;
  uniform float uAlpha;
  varying vec2 vUv;

  // object-fit: cover
  vec2 cover(vec2 uv, float imageAspect) {
    float a = uRect.z / uRect.w;
    if (a > imageAspect) {
      uv.y = (uv.y - 0.5) * (imageAspect / a) + 0.5;
    } else {
      uv.x = (uv.x - 0.5) * (a / imageAspect) + 0.5;
    }
    return clamp(uv, 0.0, 1.0);
  }

  void main() {
    // Crossfade between projects, the new one settling from 2% zoomed in.
    // Zooming in only, so it never samples past the image's edges
    float e = uProgress * uProgress * (3.0 - 2.0 * uProgress);
    vec2 b = (vUv - 0.5) * (0.98 + e * 0.02) + 0.5;
    vec3 col = mix(
      texture2D(tFrom, cover(vUv, uFromAspect)).rgb,
      texture2D(tTo, cover(b, uToAspect)).rgb,
      e
    );
    gl_FragColor = vec4(col * uAlpha, uAlpha);
  }
`;

type ProjectPreviewProps = {
  activeIndex: number;
  /** Hides the CSS media once the GL preview can take over */
  onReady: (ready: boolean) => void;
};

/**
 * WebGL preview for the project list: rests in the open row's media slot,
 * flies to the cursor on enter and follows it, bending with its speed, then
 * flies home on leave. Crossfades between projects. Desktop with a mouse only
 */
export function ProjectPreview({ activeIndex, onReady }: ProjectPreviewProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  // Read inside the render loop without restarting it
  const activeRef = React.useRef(activeIndex);
  React.useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    // Wrapper around the project list, sized to it
    const list = canvas?.parentElement;
    if (!canvas || !list) return;
    if (!window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches)
      return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const renderer = createRenderer(canvas);
    if (!renderer) return; // No WebGL: CSS media stays
    const { gl } = renderer;

    // Each row's own lazy <Image>, so textures fill as the list nears view
    const images = [
      ...list.querySelectorAll<HTMLImageElement>(`.${styles.media} img`),
    ];
    const loading = new AbortController();
    const aspects = images.map(() => 16 / 9);
    let pending = images.length;
    const textures = images.map((img, i) =>
      imageTexture(
        gl,
        img,
        () => {
          aspects[i] = img.naturalWidth / img.naturalHeight;
          if (--pending === 0) onReady(true);
        },
        loading.signal,
      ),
    );

    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      uniforms: {
        tFrom: { value: textures[activeRef.current] },
        tTo: { value: textures[activeRef.current] },
        uFromAspect: { value: 16 / 9 },
        uToAspect: { value: 16 / 9 },
        uRect: { value: [0, 0, 1, 1] },
        uResolution: { value: [1, 1] },
        uVelocity: { value: [0, 0] },
        uProgress: { value: 1 },
        uAlpha: { value: 0 },
      },
    });
    const mesh = new Mesh(gl, {
      geometry: new Plane(gl, { widthSegments: 24, heightSegments: 16 }),
      program,
    });

    // Crossfade state
    let from = activeRef.current;
    let to = activeRef.current;
    let start = 0;

    // Canvas px. Rect is x, y, w, h, eased towards its target
    const pointer = { x: 0, y: 0, inside: false };
    let rect: number[] | null = null;
    // Last frame drawn had settled, so the canvas is up to date
    let still = false;

    // Rows never change, so look their slots up once
    const medias = list.querySelectorAll(`.${styles.media}`);
    const zones = list.querySelectorAll(`.${styles.zone}`);

    // Sizing the canvas clears it, so only on a real change, and redrawn at
    // once. Rows swapping nudge the list by subpixels, a blank frame each
    const resize = () => {
      const w = list.clientWidth + OVERHANG * 2;
      const h = list.clientHeight + OVERHANG * 2;
      const [prevW, prevH] = program.uniforms.uResolution.value;
      if (w === prevW && h === prevH) return;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
      if (rect) renderer.render({ scene: mesh });
    };

    const handleMove = (e: PointerEvent) => {
      const box = list.getBoundingClientRect();
      pointer.x = e.clientX - box.left + OVERHANG;
      pointer.y = e.clientY - box.top + OVERHANG;
      pointer.inside = true;
    };
    const handleLeave = () => {
      pointer.inside = false;
    };
    // The canvas lets clicks through, so the preview opens the project's link
    // here. Real links and buttons underneath keep their own clicks
    let overLink: HTMLAnchorElement | null = null;
    const handleClick = (e: MouseEvent) => {
      if (!overLink || (e.target as Element).closest('a, button')) return;
      overLink.click();
    };

    const tick = (now: number, dt: number) => {
      // New project: fade from whatever is mostly showing now
      if (activeRef.current !== to) {
        from = program.uniforms.uProgress.value > 0.5 ? to : from;
        to = activeRef.current;
        start = now;
      }
      program.uniforms.tFrom.value = textures[from];
      program.uniforms.tTo.value = textures[to];
      program.uniforms.uFromAspect.value = aspects[from];
      program.uniforms.uToAspect.value = aspects[to];
      program.uniforms.uProgress.value = Math.min((now - start) / FADE_MS, 1);

      // Open row's media slot, tracked as rows animate
      const media = medias[activeRef.current];
      const zone = zones[activeRef.current];
      if (!media || !zone) return;
      const l = list.getBoundingClientRect();
      const m = media.getBoundingClientRect();
      const slot = [
        m.left - l.left + OVERHANG,
        m.top - l.top + OVERHANG,
        m.width,
        m.height,
      ];
      // Follows the cursor while inside, kept to the zone so it never covers
      // the details or buttons
      const clampTo = (v: number, min: number, max: number) =>
        Math.max(min, Math.min(v, max));
      // Off the slot's width, as its height animates while rows swap
      const w = slot[2] * FOLLOW_SCALE;
      const h = w * MEDIA_RATIO;
      const z = zone.getBoundingClientRect();
      const minX = z.left - l.left + OVERHANG;
      const maxX = z.right - l.left + OVERHANG - w;
      const target = pointer.inside
        ? [
            clampTo(pointer.x - w / 2, minX, maxX),
            clampTo(
              pointer.y - h / 2,
              OVERHANG,
              OVERHANG + list.clientHeight - h,
            ),
            w,
            h,
          ]
        : slot;
      // Starts home rather than flying in from the corner
      const k = ease(EASE, dt);
      rect = rect ? rect.map((v, i) => v + (target[i] - v) * k) : target;
      // Snaps home once within a fraction of a px
      const settled = rect.every((v, i) => Math.abs(target[i] - v) < 0.1);
      if (settled) rect = target;
      program.uniforms.uRect.value = rect;

      // Pointer over the preview of a live project
      const over =
        pointer.inside &&
        media instanceof HTMLAnchorElement &&
        pointer.x >= rect[0] &&
        pointer.x <= rect[0] + rect[2] &&
        pointer.y >= rect[1] &&
        pointer.y <= rect[1] + rect[3];
      overLink = over ? (media as HTMLAnchorElement) : null;
      list.style.cursor = over ? 'pointer' : '';

      // Lag between centres bends the sheet
      const clamp = (v: number) => Math.max(Math.min(v, MAX_LAG), -MAX_LAG);
      program.uniforms.uVelocity.value = [
        clamp(target[0] + target[2] / 2 - (rect[0] + rect[2] / 2)),
        clamp(target[1] + target[3] / 2 - (rect[1] + rect[3] / 2)),
      ];
      const alpha = pending === 0 ? 1 : 0;
      // Nothing moving: draws that frame once, then skips until something does
      const idle =
        settled &&
        program.uniforms.uProgress.value === 1 &&
        alpha === program.uniforms.uAlpha.value;
      program.uniforms.uAlpha.value = alpha;
      if (idle && still) return;
      still = idle;

      renderer.render({ scene: mesh });
    };

    // Only loop while the list is on screen
    const stopLoop = loopWhileVisible(list, tick);

    const observer = new ResizeObserver(resize);
    observer.observe(list);
    list.addEventListener('pointermove', handleMove);
    list.addEventListener('pointerleave', handleLeave);
    list.addEventListener('click', handleClick);

    return () => {
      loading.abort();
      stopLoop();
      observer.disconnect();
      list.removeEventListener('pointermove', handleMove);
      list.removeEventListener('pointerleave', handleLeave);
      list.removeEventListener('click', handleClick);
      list.style.cursor = '';
      onReady(false);
      // No loseContext: a remount on this canvas would get the dead context
    };
  }, [onReady]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.preview}
      style={{ inset: -OVERHANG }}
      aria-hidden
    />
  );
}
