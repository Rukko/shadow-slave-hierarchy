import { fixed1 as f, short } from '../../lib/format';
import { CUT, TOP, growth, type Geometry } from './geometry';

/*
 * SVG attributes are written in kebab-case (text-anchor, stroke-width). Preact sets attribute
 * names as given, so the camelCase forms React accepts would be ignored by the browser.
 */

/** Ticks from 0 to `max` in steps of `step`. */
function ticks(max: number, step: number): number[] {
  const out: number[] = [];
  for (let t = 0; t <= max + 1; t += step) out.push(t);
  return out;
}

interface LadderFrameProps {
  o: Geometry;
  names: string[];
}

/** Grid, axes, zones and captions, cross-fading between the split and joined layouts. */
export function LadderFrame({ o, names }: LadderFrameProps) {
  const split = o.t;
  const joined = 1 - o.t;
  const y0 = o.T + o.plotH;
  const Ys = (v: number, side: number) => o.T + (1 - v / (side ? o.YMR : o.YML)) * o.plotH;
  const Yj = (v: number) => o.T + (1 - v / o.YMR) * o.plotH;
  const cx = o.L + (CUT + 1) * o.bw + 70;

  return (
    <>
      {split > 0.001 && (
        <g opacity={split.toFixed(3)}>
          <rect
            className="ladder__zone"
            x={f(o.L + CUT * o.bw)}
            y={o.T}
            width={f(o.bw)}
            height={f(o.plotH)}
          />
          <rect
            className="ladder__zone"
            x={f(o.R0)}
            y={o.T}
            width={f((TOP - CUT + 1) * o.bw)}
            height={f(o.plotH)}
          />
          {[0, 1].map((side) => {
            const x1 = side ? o.R0 : o.L;
            const x2 = side ? o.R0 + (TOP - CUT + 1) * o.bw : o.L + (CUT + 1) * o.bw;
            return ticks(side ? o.YMR : o.YML, side ? o.tickR : o.tickL).map((t) => [
              <line
                key={'l' + side + t}
                className="ladder__grid"
                x1={f(x1)}
                x2={f(x2)}
                y1={f(Ys(t, side))}
                y2={f(Ys(t, side))}
              />,
              <text
                key={'t' + side + t}
                className="ladder__tick"
                x={f(x1 - 10)}
                y={f(Ys(t, side) + 4)}
                text-anchor="end"
              >
                {short(t)}
              </text>,
            ]);
          })}
          <line className="ladder__cut" x1={f(cx)} x2={f(cx)} y1={o.T} y2={f(y0)} />
          <line
            className="ladder__cut-mark"
            x1={f(cx - 7)}
            y1={f(y0 + 7)}
            x2={f(cx - 1)}
            y2={f(y0 - 7)}
          />
          <line
            className="ladder__cut-mark"
            x1={f(cx + 1)}
            y1={f(y0 + 7)}
            x2={f(cx + 7)}
            y2={f(y0 - 7)}
          />
          <text className="ladder__caption" x={f(o.L)} y={f(o.T - 28)}>
            {names[0] + ' → ' + names[CUT] + ' · axis up to ' + short(o.YML)}
          </text>
          <text className="ladder__caption-sub" x={f(o.L)} y={f(o.T - 12)}>
            {'×' + growth(o, 0, CUT) + ' from ' + names[0] + ' to ' + names[CUT]}
          </text>
          <text className="ladder__caption" x={f(o.R0)} y={f(o.T - 28)}>
            {names[CUT] + ' → ' + names[TOP] + ' · own axis up to ' + short(o.YMR)}
          </text>
          <text className="ladder__caption-sub" x={f(o.R0)} y={f(o.T - 12)}>
            {'×' + growth(o, CUT, TOP) + ' from ' + names[CUT] + ' to ' + names[TOP]}
          </text>
          <text className="ladder__zone-label" x={f(o.R0 + 8)} y={f(o.T + 16)}>
            Top three ranks
          </text>
        </g>
      )}
      {joined > 0.001 && (
        <g opacity={joined.toFixed(3)}>
          <rect
            className="ladder__zone"
            x={f(o.L + CUT * o.bwj)}
            y={o.T}
            width={f((TOP - CUT + 1) * o.bwj)}
            height={f(o.plotH)}
          />
          {ticks(o.YMR, o.tickR).map((t) => [
            <line
              key={'l' + t}
              className="ladder__grid"
              x1={f(o.L)}
              x2={f(o.W - o.Rm)}
              y1={f(Yj(t))}
              y2={f(Yj(t))}
            />,
            <text
              key={'t' + t}
              className="ladder__tick"
              x={f(o.L - 10)}
              y={f(Yj(t) + 4)}
              text-anchor="end"
            >
              {short(t)}
            </text>,
          ])}
          <text className="ladder__caption" x={f(o.L)} y={f(o.T - 28)}>
            {names[0] + ' → ' + names[TOP] + ' · one axis up to ' + short(o.YMR)}
          </text>
          <text className="ladder__caption-sub" x={f(o.L)} y={f(o.T - 12)}>
            {'×' + growth(o, 0, TOP) + ' from ' + names[0] + ' to ' + names[TOP]}
          </text>
          <text className="ladder__zone-label" x={f(o.L + CUT * o.bwj + 8)} y={f(o.T + 16)}>
            Top three ranks
          </text>
        </g>
      )}
      <text
        className="ladder__tick"
        transform={'translate(14 ' + f(o.T + o.plotH / 2) + ') rotate(-90)'}
        text-anchor="middle"
      >
        Power, in points
      </text>
    </>
  );
}
