import { OGLRenderingContext, Renderer, Texture } from 'ogl';

/** Transparent renderer at up to 2x DPR, or null without WebGL */
export function createRenderer(canvas: HTMLCanvasElement) {
  try {
    const renderer = new Renderer({
      canvas,
      alpha: true,
      premultipliedAlpha: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    renderer.gl.clearColor(0, 0, 0, 0);
    return renderer;
  } catch {
    return null;
  }
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

/** Calls tick every frame while el is on screen. Returns a stop function */
export function loopWhileVisible(el: Element, tick: (now: number) => void) {
  let frame = 0;
  const loop = (now: number) => {
    frame = requestAnimationFrame(loop);
    tick(now);
  };
  const visibility = new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(frame);
    if (entry.isIntersecting) frame = requestAnimationFrame(loop);
  });
  visibility.observe(el);

  return () => {
    cancelAnimationFrame(frame);
    visibility.disconnect();
  };
}
