// Kept apart from gl.ts, so checking doesn't pull in ogl

// Renderer names of software GL, for browsers that don't flag it as a caveat
const SOFTWARE_GL = /swiftshader|llvmpipe|softpipe|software/i;

let capable: boolean | undefined;

/**
 * Whether WebGL effects are worth running: a real GPU, not a software
 * fallback that renders on the main thread, and more than 2GB of memory.
 * Probed once on a throwaway canvas
 */
export function hasCapableGpu() {
  if (capable !== undefined) return capable;
  capable = false;

  // Chromium only. Elsewhere unknown, so allowed
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  if (memory !== undefined && memory <= 2) return capable;

  const canvas = document.createElement('canvas');
  const attributes: WebGLContextAttributes = {
    failIfMajorPerformanceCaveat: true,
  };
  const gl =
    canvas.getContext('webgl2', attributes) ??
    canvas.getContext('webgl', attributes);
  if (!gl) return capable;

  const debug = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = String(
    gl.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : gl.RENDERER),
  );
  capable = !SOFTWARE_GL.test(renderer);
  // Frees the context now, as browsers cap how many can be open
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return capable;
}
