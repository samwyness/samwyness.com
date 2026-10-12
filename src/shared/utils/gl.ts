import { OGLRenderingContext, Renderer, Texture } from 'ogl';

/** Transparent renderer at up to 2x DPR, or null without WebGL */
export function createRenderer(canvas: HTMLCanvasElement) {
  // Probed first, as OGL console.errors (a Next dev issue) before throwing.
  // Same attributes as OGL's, since the canvas hands it this same context
  const attributes = {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
  };
  if (
    !canvas.getContext('webgl2', attributes) &&
    !canvas.getContext('webgl', attributes)
  )
    return null;
  try {
    const renderer = new Renderer({
      canvas,
      ...attributes,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    renderer.gl.clearColor(0, 0, 0, 0);
    return renderer;
  } catch {
    return null;
  }
}

/**
 * Runs setup now, and again if the GPU drops then restores the context (iOS
 * can when the tab's backgrounded), as everything built on the old one is
 * gone. Torn down meanwhile so fallbacks show. Returns a stop function
 */
export function keepContext(
  canvas: HTMLCanvasElement,
  setup: () => (() => void) | undefined,
) {
  let teardown = setup();
  const handleLost = (e: Event) => {
    // Opts in to a restore, which otherwise never comes
    e.preventDefault();
    teardown?.();
    teardown = undefined;
  };
  const handleRestored = () => {
    teardown = setup();
  };
  canvas.addEventListener('webglcontextlost', handleLost);
  canvas.addEventListener('webglcontextrestored', handleRestored);

  return () => {
    canvas.removeEventListener('webglcontextlost', handleLost);
    canvas.removeEventListener('webglcontextrestored', handleRestored);
    teardown?.();
  };
}

/**
 * Clamped, unmipmapped texture from an <img> already on the page, filled once
 * it loads. Reuses next/image's sized copy, so no second download
 */
export function imageTexture(
  gl: OGLRenderingContext,
  img: HTMLImageElement,
  onLoad: () => void,
  signal: AbortSignal,
) {
  const texture = new Texture(gl, {
    generateMipmaps: false,
    minFilter: gl.LINEAR,
    wrapS: gl.CLAMP_TO_EDGE,
    wrapT: gl.CLAMP_TO_EDGE,
  });
  const fill = () => {
    texture.image = img;
    onLoad();
  };
  // Async even when already loaded, so callers can finish setting up first
  if (img.complete && img.naturalWidth)
    queueMicrotask(() => signal.aborted || fill());
  else img.addEventListener('load', fill, { once: true, signal });
  return texture;
}

/**
 * Fraction to move towards a target this frame: k per 60fps frame, scaled by
 * dt so easing feels the same at 30fps (battery saver) or 120Hz
 */
export const ease = (k: number, dt: number) => 1 - (1 - k) ** dt;

/**
 * Calls tick every frame while el is on screen, with the frame's length in
 * 60fps frames for ease(). Returns a stop function
 */
export function loopWhileVisible(
  el: Element,
  tick: (now: number, dt: number) => void,
) {
  let frame = 0;
  let last = 0;
  const loop = (now: number) => {
    frame = requestAnimationFrame(loop);
    // Capped, as a background tab pauses frames without leaving the viewport
    const dt = last ? Math.min(now - last, 50) / (1000 / 60) : 1;
    last = now;
    tick(now, dt);
  };
  const visibility = new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(frame);
    // Resumes with a normal frame rather than catching up on the gap
    last = 0;
    if (entry.isIntersecting) frame = requestAnimationFrame(loop);
  });
  visibility.observe(el);

  return () => {
    cancelAnimationFrame(frame);
    visibility.disconnect();
  };
}
