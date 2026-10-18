import { easeInOut, lerp } from '../../lib/math';
import { reduceMotion, tween } from '../../lib/motion';

/* Sunny's sea is night; Nephis's is a calm ocean under golden light */
const GOLD = '241,200,112';
const PALE = '255,236,200';
const DEEP = '196,138,30';

export interface SeaState {
  /** 1..7 */
  rank: number;
  /** 1..7 */
  cores: number;
  dark: boolean;
}

export interface SeaRenderer {
  /** Moves the suns to a new rank and count (animated), or redraws for a new theme. */
  set(state: SeaState): void;
  destroy(): void;
}

/**
 * Draws the Soul Sea on a canvas: rank sets how high and bright the suns burn, cores set how many.
 * The canvas keeps its own animation loop, paused while it is off screen.
 */
export function createSeaRenderer(cv: HTMLCanvasElement, initial: SeaState): SeaRenderer {
  const ctx = cv.getContext('2d');
  if (!ctx) return { set: () => {}, destroy: () => {} };

  let W = 1;
  let H = 1;
  let { rank, cores, dark: black } = initial;
  // Transition state: suns morph from (nFrom, rkFrom) to (nTo, rkTo) as p goes 0..1.
  let nFrom = cores;
  let nTo = cores;
  let rkFrom = rank;
  let rkTo = rank;
  let p = 1;
  let visible = true;
  let raf = 0;
  let stopTween = (): void => {};
  const t0 = performance.now();

  function sky(): string {
    return black ? '#0a0c12' : '#f3e5c0';
  }
  function water(): string {
    return black ? '#0d1422' : '#93c3c9';
  }

  /* the rank buttons sit between 12% and 76% of the frame height; each sun sits at its button's centre */
  function horizon(): number {
    return H * 0.78;
  }
  function sunY(rk: number): number {
    return H * (0.12 + ((7.5 - rk) / 7) * 0.64);
  }
  function sunR(rk: number): number {
    return Math.min(W, H) * (0.03 + rk * 0.0055);
  }
  function xs(n: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < n; i++) out.push(W * (n === 1 ? 0.5 : 0.12 + (0.76 * i) / (n - 1)));
    return out;
  }

  function drawSun(
    c2: CanvasRenderingContext2D,
    x: number,
    y: number,
    rk: number,
    a: number,
  ): void {
    const r = sunR(rk);
    const g = r * (1.7 + rk * 0.3);
    const light = Math.min(0.85, 0.14 + rk * 0.08);
    const c = black ? PALE : GOLD;
    const la = black ? 0.3 : light;
    const grd = c2.createRadialGradient(x, y, r * 0.5, x, y, g);
    grd.addColorStop(0, 'rgba(' + c + ',' + (la * a).toFixed(3) + ')');
    grd.addColorStop(1, 'rgba(' + c + ',0)');
    c2.fillStyle = grd;
    c2.beginPath();
    c2.arc(x, y, g, 0, Math.PI * 2);
    c2.fill();
    c2.beginPath();
    c2.arc(x, y, r, 0, Math.PI * 2);
    if (black) {
      c2.fillStyle = 'rgba(3,4,7,' + a.toFixed(3) + ')';
      c2.fill();
      c2.strokeStyle = 'rgba(' + PALE + ',' + (0.85 * a).toFixed(3) + ')';
      c2.lineWidth = 1.5;
      c2.stroke();
    } else {
      c2.fillStyle =
        'rgba(255,' +
        Math.round(170 + rk * 7) +
        ',' +
        Math.round(50 + rk * 14) +
        ',' +
        a.toFixed(3) +
        ')';
      c2.fill();
    }
  }

  function draw(ts: number): void {
    if (!ctx) return;
    const t = (ts - t0) / 1000;
    const hz = horizon();
    const e = easeInOut(p);
    const rk = lerp(rkFrom, rkTo, e);
    const R = sunR(rk);
    const y = sunY(rk);
    const A = xs(nFrom);
    const B = xs(nTo);
    const m = Math.max(nFrom, nTo);
    // Each sun is [x, y, alpha]. Kept suns slide, new ones rise from the sea, removed ones sink.
    const suns: [number, number, number][] = [];
    ctx.clearRect(0, 0, W, H);
    if (black) {
      ctx.fillStyle = sky();
      ctx.fillRect(0, 0, W, H);
    } /* by day the sky is the page itself */
    for (let i = 0; i < m; i++) {
      if (i < nFrom && i < nTo) suns.push([lerp(A[i], B[i], e), y, 1]);
      else if (i < nTo) suns.push([B[i], lerp(hz + R * 1.3, y, e), e]);
      else suns.push([A[i], lerp(y, hz + R * 1.3, e), 1 - e]);
    }
    suns.forEach((s) => drawSun(ctx, s[0], s[1], rk, s[2]));
    ctx.fillStyle = water();
    ctx.fillRect(0, hz, W, H - hz);
    ctx.fillStyle = black ? 'rgba(' + PALE + ',0.22)' : 'rgba(255,255,255,0.7)';
    ctx.fillRect(0, hz, W, 1);
    // Shimmering reflections under each sun.
    suns.forEach((s, j) => {
      const a = s[2] * (black ? 0.22 : 0.12 + rk * 0.05);
      for (let k = 0; k < 8; k++) {
        const yy = hz + 6 + (k * (H - hz - 8)) / 8;
        const w = R * (1.7 - k * 0.1) * (0.65 + 0.35 * Math.sin(t * 1.25 + k * 1.7 + j * 0.9));
        const xx = s[0] + Math.sin(t * 0.8 + k * 0.75 + j * 2.1) * R * 0.18;
        ctx.fillStyle =
          'rgba(' +
          (black ? PALE : DEEP) +
          ',' +
          (Math.min(1, a * (black ? 1 : 2.2)) * (1 - k / 9)).toFixed(3) +
          ')';
        ctx.fillRect(xx - w / 2, yy, w, 2);
      }
    });
  }

  function size(): void {
    if (!ctx) return;
    const r = cv.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(performance.now());
  }
  function loop(ts: number): void {
    draw(ts);
    raf = visible && !reduceMotion ? requestAnimationFrame(loop) : 0;
  }
  function kick(): void {
    if (!raf && visible && !reduceMotion) raf = requestAnimationFrame(loop);
  }

  function set(next: SeaState): void {
    const moved = next.rank !== rank || next.cores !== cores;
    black = next.dark;
    if (!moved) {
      draw(performance.now());
      return;
    }
    // Start the new transition from wherever the current one is.
    rkFrom = lerp(rkFrom, rkTo, easeInOut(p));
    nFrom = nTo;
    rank = next.rank;
    cores = next.cores;
    nTo = cores;
    rkTo = rank;
    p = 0;
    stopTween();
    if (reduceMotion) {
      p = 1;
      draw(performance.now());
      return;
    }
    stopTween = tween(900, (x) => {
      p = x;
    });
    kick();
  }

  const ro = 'ResizeObserver' in window ? new ResizeObserver(size) : null;
  ro?.observe(cv);
  const io =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            visible = entries[0].isIntersecting;
            if (visible) kick();
          },
          { threshold: 0 },
        )
      : null;
  io?.observe(cv);
  // The ResizeObserver reports the first size once layout is done. Measuring here would force it early.
  if (!ro) size();
  kick();

  return {
    set,
    destroy() {
      stopTween();
      cancelAnimationFrame(raf);
      ro?.disconnect();
      io?.disconnect();
    },
  };
}
