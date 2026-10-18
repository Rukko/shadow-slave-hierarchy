/** True when the visitor asked for reduced motion. Animations then jump straight to their end state. */
export const reduceMotion: boolean = (() => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
})();

/** Calls `fn` with progress 0..1 over `dur` milliseconds. Returns a function that stops it. */
export function tween(dur: number, fn: (p: number) => void): () => void {
  if (reduceMotion || !window.requestAnimationFrame) {
    fn(1);
    return () => {};
  }
  let t0: number | null = null;
  let raf = 0;
  function step(ts: number): void {
    if (t0 === null) t0 = ts;
    const p = Math.min(1, (ts - t0) / dur);
    fn(p);
    if (p < 1) raf = requestAnimationFrame(step);
  }
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}
