import type { ComponentChildren, FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useInView } from '../../hooks/useInView';
import { easeInOut, easeOut, lerp } from '../../lib/math';
import { reduceMotion, tween } from '../../lib/motion';
import { Segmented } from '../shared/Segmented';
import { ladderGeometry, type Geometry, type LadderLayout } from './geometry';
import { LadderFrame } from './LadderFrame';
import { RankAxis } from './RankAxis';

type Mode = 'split' | 'joined';

interface LadderChartProps {
  title: string;
  subtitle: string;
  /** Accessible name of the Split / Joined toggle. */
  toggleLabel: string;
  /** Accessible description of the chart. */
  label: string;
  layout: LadderLayout;
  val(r: number, k: number): number;
  names: string[];
  second?: string[];
  path: 'creature' | 'human';
  Series: FunctionComponent<{ o: Geometry }>;
  /** The chart key, one ladder__key per entry. */
  keys: ComponentChildren;
}

/**
 * Power across the seven ranks. Split (t = 1) puts ranks 1 to 5 and 5 to 7 on separate axes,
 * joined (t = 0) puts all seven on one; the toggle animates between them.
 */
export function LadderChart(props: LadderChartProps) {
  const { title, subtitle, toggleLabel, label, layout, val, names, second, path, Series, keys } =
    props;
  const [mode, setMode] = useState<Mode>('split');
  const [t, setT] = useState(1);
  // Lines start flat and grow on entrance, unless nothing will animate them.
  const [g, setG] = useState(reduceMotion || !('IntersectionObserver' in window) ? 1 : 0);
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(svgRef);
  const stopMorphRef = useRef(() => {});

  function changeMode(next: Mode): void {
    setMode(next);
    const target = next === 'split' ? 1 : 0;
    const from = t;
    stopMorphRef.current();
    if (from === target) return;
    stopMorphRef.current = tween(800, (p) => setT(lerp(from, target, easeInOut(p))));
  }

  /* grow the lines once, as the chart comes into view */
  useEffect(() => {
    if (!inView || reduceMotion) return;
    return tween(1100, (p) => setG(easeOut(p)));
  }, [inView]);

  const o = ladderGeometry(layout, val, t, g);

  return (
    <div className="ladder" data-anim>
      <div className="ladder__head">
        <h3 className="ladder__title">
          {title}
          <small className="ladder__subtitle">{subtitle}</small>
        </h3>
        <Segmented
          label={toggleLabel}
          options={[
            { value: 'split', label: 'Split' },
            { value: 'joined', label: 'Joined' },
          ]}
          value={mode}
          onChange={changeMode}
        />
      </div>
      <div className="scroll-x">
        <svg
          ref={svgRef}
          className="ladder__svg"
          viewBox={'0 0 ' + layout.W + ' ' + layout.H}
          role="img"
          aria-label={label}
        >
          <LadderFrame o={o} names={names} />
          <Series o={o} />
          <RankAxis o={o} names={names} second={second} path={path} />
        </svg>
      </div>
      <div className="ladder__keys">{keys}</div>
    </div>
  );
}
