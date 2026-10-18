/** Rounded integer with thousands separators, e.g. 144,000. */
export function full(v: number): string {
  return Math.round(v).toLocaleString('en-US');
}

/** Compact form for tight spaces, e.g. 1.4k, 72k, 7.1M. */
export function short(v: number): string {
  if (v >= 1e6) return (v / 1e6).toFixed(v >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M';
  if (v >= 1e3) return (v / 1e3).toFixed(v >= 1e4 ? 0 : 1).replace(/\.0$/, '') + 'k';
  return String(Math.round(v));
}

export function pct(x: number): string {
  return Math.round(x * 100) + '%';
}

/** One decimal, used for SVG coordinates. */
export function fixed1(n: number): string {
  return n.toFixed(1);
}
