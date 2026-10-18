import { CLASS } from '../../data/hierarchy';
import { fixed1 as f, short } from '../../lib/format';
import { CUT, TOP, panelRanks, seriesPath, type Geometry } from './geometry';

const CLASSES = [0, 1, 2, 3, 4, 5, 6];

/** One line per creature class, darker and thicker as the class grows, with end labels. */
export function CreatureSeries({ o }: { o: Geometry }) {
  /* right end labels, pushed apart downward */
  const ysR = CLASSES.map((k) => o.P(TOP, 1, o.val(TOP, k))[1] + 5);
  for (let k = 5; k >= 0; k--) {
    if (ysR[k] - ysR[k + 1] < 16) ysR[k] = ysR[k + 1] + 16;
  }
  /* left panel class names, split view only, pushed apart upward */
  const ysL = CLASSES.map((k) => o.P(CUT, 0, o.val(CUT, k))[1] + 5);
  for (let k = 1; k < 7; k++) {
    if (ysL[k - 1] - ysL[k] < 15) ysL[k] = ysL[k - 1] - 15;
  }
  const xr = o.X(TOP, 1);
  const xl = o.X(CUT, 0);

  return (
    <>
      {CLASSES.map((k) => {
        const col =
          'color-mix(in srgb,var(--corrupt) ' + (30 + k * 11.67).toFixed(0) + '%,var(--muted))';
        const val = (r: number) => o.val(r, k);
        return [0, 1].map((side) => [
          <path
            key={'p' + k + side}
            d={seriesPath(o, side, val)}
            fill="none"
            style={{ stroke: col }}
            stroke-width={(1.5 + k * 0.35).toFixed(2)}
            stroke-linejoin="round"
          />,
          ...panelRanks(side).map((r) => {
            const p = o.P(r, side, val(r));
            return (
              <circle
                key={'c' + k + side + r}
                cx={f(p[0])}
                cy={f(p[1])}
                r="2.8"
                style={{ fill: col }}
              />
            );
          }),
        ]);
      })}
      {CLASSES.map((k) => [
        <line
          key={'l' + k}
          className="ladder__leader"
          x1={f(xr + 4)}
          y1={f(o.P(TOP, 1, o.val(TOP, k))[1])}
          x2={f(xr + 11)}
          y2={f(ysR[k] - 5)}
        />,
        <text key={'e' + k} className="ladder__end-label" x={f(xr + 14)} y={f(ysR[k])}>
          {CLASS[k]}
          <tspan className="ladder__end-value" dx="6">
            {short(o.val(TOP, k))}
          </tspan>
        </text>,
      ])}
      {o.t > 0.001 && (
        <g opacity={o.t.toFixed(3)}>
          {CLASSES.map((k) => (
            <text
              key={k}
              className="ladder__end-label ladder__end-label--small"
              x={f(xl + 10)}
              y={f(ysL[k])}
            >
              {CLASS[k]}
            </text>
          ))}
        </g>
      )}
    </>
  );
}
