import { useRef, useState } from 'preact/hooks';
import { CLASS, type Fighter, type Path } from '../../data/hierarchy';
import { full, short } from '../../lib/format';
import { powerRange } from '../../lib/power';
import { useInView } from '../../hooks/useInView';
import { BattleBar } from './BattleBar';

const RANKS_TOP_DOWN = [6, 5, 4, 3, 2, 1, 0];
const CLASSES = [0, 1, 2, 3, 4, 5, 6];
/** The last three ranks and classes get the amber edge. */
const TOP_FROM = 4;

export interface HeatmapProps {
  path: Path;
  /** Accessible description of the grid. */
  label: string;
  val(r: number, k: number): number;
  rowName(r: number): string;
  /** Second line under the rank name; empty to leave it out. */
  rowPoints(r: number): string;
  /** Line under the class name; empty to leave it out. */
  colPoints(k: number): string;
  title(r: number, k: number): string;
  note: string;
  onSend(a: Fighter, b: Fighter): void;
}

/**
 * Power of every rank and class combination as a grid. Ranks grow upward, classes grow to the
 * right. Two clicks set up a battle: the first cell is fighter A, the second fighter B.
 */
export function Heatmap({
  path,
  label,
  val,
  rowName,
  rowPoints,
  colPoints,
  title,
  note,
  onSend,
}: HeatmapProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const playing = useInView(gridRef);
  const [active, setActive] = useState<{ r: number; k: number } | null>(null);
  const [picks, setPicks] = useState<Fighter[]>([]);
  const [sent, setSent] = useState<[Fighter, Fighter] | null>(null);
  const [lo, hi] = powerRange(val);
  const mod = path === 'm' ? 'creature' : 'human';

  function toggle(r: number, k: number): void {
    const at = picks.findIndex((q) => q.r === r && q.k === k);
    const x: Fighter = { p: path, r, k };
    setSent(null);
    if (at >= 0) setPicks(picks.filter((_, i) => i !== at));
    else if (picks.length < 2) setPicks([...picks, x]);
    else setPicks([x]);
  }

  function send(): void {
    const [a, b] = picks;
    onSend(a, b);
    setPicks([]);
    setSent([a, b]);
  }

  const cells = [];
  for (const r of RANKS_TOP_DOWN) {
    const rowClass = 'heatmap__row-head' + (r >= TOP_FROM ? ' heatmap__row-head--top' : '');
    cells.push(
      <div key={'r' + r} className={rowClass + (active?.r === r ? ' is-active' : '')}>
        <b className={'heatmap__row-name heatmap__row-name--' + mod}>{rowName(r)}</b>
        {rowPoints(r) && <small className="heatmap__row-points">{rowPoints(r)}</small>}
      </div>,
    );
    for (const k of CLASSES) {
      const v = val(r, k);
      // Color intensity on a log scale, 0 at the weakest cell and 1 at the strongest.
      const t = Math.log(v / lo) / Math.log(hi / lo);
      const pick = picks.findIndex((q) => q.r === r && q.k === k);
      cells.push(
        <button
          key={r + '-' + k}
          type="button"
          className={'heatmap__cell heatmap__cell--' + mod}
          style={{ '--t': t.toFixed(3), '--d': r + k }}
          title={title(r, k) + ': ' + full(v) + ' points'}
          aria-pressed={pick >= 0}
          data-pick={pick >= 0 ? (pick ? 'B' : 'A') : undefined}
          onPointerOver={() => setActive({ r, k })}
          onFocus={() => setActive({ r, k })}
          onBlur={() => setActive(null)}
          onClick={() => toggle(r, k)}
        >
          {/* The accessible name wraps whichever value is visible, as screen readers and voice control expect. */}
          <span className="visually-hidden">{title(r, k) + ', '}</span>
          <span className="heatmap__cell-value heatmap__cell-value--full">{full(v)}</span>
          <span className="heatmap__cell-value heatmap__cell-value--short">{short(v)}</span>
          <span className="visually-hidden"> points. Pick for a battle</span>
        </button>,
      );
    }
  }

  return (
    <>
      <div className="scroll-x">
        <div
          ref={gridRef}
          className={'heatmap' + (playing ? ' is-playing' : '')}
          role="group"
          aria-label={label}
          onPointerLeave={() => setActive(null)}
        >
          {cells}
          <div className="heatmap__corner">
            <span>Rank ↑</span>
            <span>Class →</span>
          </div>
          {CLASSES.map((k) => (
            <div
              key={'c' + k}
              className={
                'heatmap__col-head' +
                (k >= TOP_FROM ? ' heatmap__col-head--top' : '') +
                (active?.k === k ? ' is-active' : '')
              }
            >
              <b className="heatmap__col-num">{k + 1}</b>
              <small className="heatmap__col-name">{CLASS[k]}</small>
              {colPoints(k) && <em className="heatmap__col-points">{colPoints(k)}</em>}
            </div>
          ))}
        </div>
      </div>
      <p className="section-note">{note}</p>
      <BattleBar picks={picks} sent={sent} onSend={send} onClear={() => setPicks([])} />
    </>
  );
}
