import { fixed1 as f } from '../../lib/format';
import { lerp, niceTick } from '../../lib/math';
import { powerRange } from '../../lib/power';

/** 0-based hinge rank: Great / Supreme. Split view repeats it on both panels. */
export const CUT = 4;
/** Highest rank index. */
export const TOP = 6;

/** Static layout of one ladder chart, in SVG user units. */
export interface LadderLayout {
  W: number;
  H: number;
  /** Left margin. */
  L: number;
  /** Gap between the two panels in split view. */
  GAP: number;
  /** Right margin, room for end labels. */
  Rm: number;
  /** Top margin. */
  T: number;
  /** Bottom margin, room for rank labels. */
  B: number;
}

/** Everything the chart parts need to place themselves at one moment of the animation. */
export interface Geometry extends LadderLayout {
  /** Layout morph: 1 split, 0 joined. */
  t: number;
  /** Growth of the lines, 0..1, used for the entrance. */
  g: number;
  val(r: number, k: number): number;
  plotH: number;
  /** Band width in split view. */
  bw: number;
  /** x where the right panel starts. */
  R0: number;
  /** Band width in joined view. */
  bwj: number;
  tickL: number;
  /** Top of the left axis in split view. */
  YML: number;
  tickR: number;
  /** Top of the right axis in split view, and of the single axis in joined view. */
  YMR: number;
  /** x of rank `r` at the current morph. `side` is 1 for the right panel. */
  X(r: number, side: number): number;
  /** Point of value `v` at rank `r` at the current morph. */
  P(r: number, side: number, v: number): [number, number];
}

export function ladderGeometry(
  layout: LadderLayout,
  val: (r: number, k: number) => number,
  t: number,
  g: number,
): Geometry {
  const { W, H, L, GAP, Rm, T, B } = layout;
  const maxL = powerRange(val, CUT)[1];
  const maxR = powerRange(val)[1];
  const plotH = H - T - B;
  const bw = (W - L - GAP - Rm) / 8;
  const R0 = L + (CUT + 1) * bw + GAP;
  const bwj = (W - L - Rm) / 7;
  const tickL = niceTick(maxL);
  const YML = Math.ceil(maxL / tickL) * tickL;
  const tickR = niceTick(maxR);
  const YMR = Math.ceil(maxR / tickR) * tickR;
  const xs = (r: number, side: number) => (side ? R0 + (r - CUT + 0.5) * bw : L + (r + 0.5) * bw);
  const xj = (r: number) => L + (r + 0.5) * bwj;
  const X = (r: number, side: number) => lerp(xj(r), xs(r, side), t);
  const P = (r: number, side: number, v: number): [number, number] => {
    const ys = T + (1 - (v * g) / (side ? YMR : YML)) * plotH;
    const yj = T + (1 - (v * g) / YMR) * plotH;
    return [X(r, side), lerp(yj, ys, t)];
  };
  return { ...layout, t, g, val, plotH, bw, R0, bwj, tickL, YML, tickR, YMR, X, P };
}

/** Ranks drawn on a panel: 0..CUT on the left, CUT..TOP on the right. */
export function panelRanks(side: number): number[] {
  const out: number[] = [];
  for (let r = side ? CUT : 0; r <= (side ? TOP : CUT); r++) out.push(r);
  return out;
}

/** SVG path data for one series on one panel. */
export function seriesPath(o: Geometry, side: number, val: (r: number) => number): string {
  return panelRanks(side)
    .map((r, i) => {
      const p = o.P(r, side, val(r));
      return (i ? ' L' : 'M') + f(p[0]) + ' ' + f(p[1]);
    })
    .join('');
}

/** How many times the first class's power grows from one rank to another, e.g. "36". */
export function growth(o: Geometry, from: number, to: number): string {
  const n = o.val(to, 0) / o.val(from, 0);
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
