import { fixed1 as f, full, pct } from '../../lib/format';
import { CUT, TOP, panelRanks, seriesPath, type Geometry } from './geometry';

/** Power at the first class as a line, with a band up to the seventh class reserve. */
export function HumanSeries({ o }: { o: Geometry }) {
  const lo = (r: number) => o.val(r, 0);
  const hi = (r: number) => o.val(r, 6);
  // Largest share the seventh class adds over the first, across all ranks.
  let maxReserve = 0;
  for (let r = 0; r <= TOP; r++) maxReserve = Math.max(maxReserve, hi(r) / lo(r) - 1);
  const x6 = o.X(TOP, 1);

  return (
    <>
      {[0, 1].map((side) => {
        const ranks = panelRanks(side);
        const top = seriesPath(o, side, hi);
        const bottom = [...ranks]
          .reverse()
          .map((r) => {
            const q = o.P(r, side, lo(r));
            return ' L' + f(q[0]) + ' ' + f(q[1]);
          })
          .join('');
        return [
          <path key={'b' + side} className="ladder__band" d={top + bottom + ' Z'} />,
          <path key={'e' + side} className="ladder__band-edge" d={top} />,
          <path key={'l' + side} className="ladder__human-line" d={seriesPath(o, side, lo)} />,
          ...ranks.map((r) => {
            const q = o.P(r, side, lo(r));
            const p = o.P(r, side, hi(r));
            const op = side && r === CUT ? o.t : 1;
            // The top rank's values are labelled at the right edge instead.
            const showValue = !(side && r === TOP) && op >= 0.001;
            return [
              <circle
                key={'d' + side + r}
                className="ladder__human-dot"
                cx={f(q[0])}
                cy={f(q[1])}
                r="3.6"
              />,
              showValue && (
                <text
                  key={'v' + side + r}
                  className="ladder__value"
                  opacity={op.toFixed(3)}
                  x={f(q[0])}
                  y={f(p[1] - 10)}
                  text-anchor="middle"
                >
                  {full(lo(r))}
                </text>
              ),
            ];
          }),
        ];
      })}
      <text className="ladder__value" x={f(x6 + 12)} y={f(o.P(TOP, 1, lo(TOP))[1] + 4)}>
        {full(lo(TOP))}
      </text>
      <text className="ladder__value" x={f(x6 + 12)} y={f(o.P(TOP, 1, hi(TOP))[1] + 4)}>
        {full(hi(TOP))}
      </text>
      <text className="ladder__annotation" x={f(o.L + 12)} y={f(o.T + 22)}>
        Class reserve
      </text>
      <text className="ladder__annotation-sub" x={f(o.L + 12)} y={f(o.T + 38)}>
        {'The band: all seven classes add ' + pct(maxReserve) + ' at most'}
      </text>
    </>
  );
}
