import { fixed1 as f } from '../../lib/format';
import { CUT, panelRanks, type Geometry } from './geometry';

interface RankAxisProps {
  o: Geometry;
  names: string[];
  /** Optional second row of rank labels. */
  second?: string[];
  /** Modifier of the rank names: `creature` or `human`. */
  path: string;
}

/** Rank numbers and names under the x axis. The hinge rank on the right fades out when joined. */
export function RankAxis({ o, names, second, path }: RankAxisProps) {
  const y0 = o.T + o.plotH;
  return (
    <>
      {[0, 1].map((side) =>
        panelRanks(side).map((r) => {
          const op = side && r === CUT ? o.t : 1;
          if (op < 0.001) return null;
          const x = f(o.X(r, side));
          return (
            <g key={side + '-' + r} opacity={op.toFixed(3)}>
              <text className="ladder__rank-num" x={x} y={y0 + 28} text-anchor="middle">
                {r + 1}
              </text>
              <text
                className={'ladder__rank-name ladder__rank-name--' + path}
                x={x}
                y={y0 + 46}
                text-anchor="middle"
              >
                {names[r]}
              </text>
              {second && (
                <text className="ladder__rank-alt" x={x} y={y0 + 61} text-anchor="middle">
                  {second[r]}
                </text>
              )}
            </g>
          );
        }),
      )}
    </>
  );
}
