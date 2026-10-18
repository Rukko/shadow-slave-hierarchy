import type { Fighter } from '../../data/hierarchy';
import { article, fighterName } from '../../lib/fighter';
import { power } from '../../lib/power';
import { useCountUp } from '../../hooks/useCountUp';

interface VerdictProps {
  a: Fighter;
  b: Fighter;
  /** Bumped on every change of the battle; replays the ratio's bump animation. */
  version: number;
}

function fmtRatio(n: number): string {
  return '×' + (n >= 10 ? Math.round(n).toLocaleString('en-US') : n.toFixed(1));
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** The middle card: power ratio, who hits harder, and a tug-of-war bar. */
export function Verdict({ a, b, version }: VerdictProps) {
  const va = power(a);
  const vb = power(b);
  const ratio = useCountUp(Math.max(va, vb) / Math.min(va, vb));
  const target = Math.max(va, vb) / Math.min(va, vb);

  let text = 'Too close to call on raw power.';
  if (target >= 1.15) {
    const [w, l] = va > vb ? [a, b] : [b, a];
    const nw = fighterName(w);
    const nl = fighterName(l);
    text = capitalize(article(nw)) + nw + ' carries more raw power than ' + article(nl) + nl + '.';
  }

  const color = (f: Fighter) => (f.p === 'm' ? 'var(--corrupt)' : 'var(--ascend)');
  const cb = a.p === b.p ? 'color-mix(in srgb,' + color(b) + ' 30%,var(--surface))' : color(b);

  return (
    <div className="verdict" aria-live="polite" data-anim>
      {/* A new key remounts the element, which restarts its CSS animation. */}
      <p
        key={version}
        className={version ? 'verdict__ratio verdict__ratio--bump' : 'verdict__ratio'}
      >
        {fmtRatio(ratio)}
      </p>
      <p className="verdict__text">{text}</p>
      <p className="verdict__note">One blow of pure power against no defence.</p>
      <div
        className="verdict__tug"
        aria-hidden="true"
        style={{ '--ca': color(a), '--cb': cb, '--share': (va / (va + vb)).toFixed(4) }}
      >
        <span className="verdict__tug-fill" />
      </div>
      <div className="verdict__tug-labels" aria-hidden="true">
        <span>A</span>
        <span>B</span>
      </div>
    </div>
  );
}
