import { CLASS, COLLOQ, RANK_H, RANK_N, type Fighter } from '../../data/hierarchy';
import { coreCount, fighterName, fighterSub } from '../../lib/fighter';
import { full } from '../../lib/format';
import { power } from '../../lib/power';
import { useCountUp } from '../../hooks/useCountUp';

interface FighterCardProps {
  slot: 'a' | 'b';
  fighter: Fighter;
  onChange(fighter: Fighter): void;
}

/** One fighter: rank and class pickers, name and raw power. */
export function FighterCard({ slot, fighter, onChange }: FighterCardProps) {
  const points = useCountUp(power(fighter));
  const human = fighter.p === 'h';
  const ranks = human ? RANK_H : RANK_N;
  return (
    <div className="fighter" data-path={fighter.p} data-anim>
      <p className="fighter__slot">Fighter {slot.toUpperCase()}</p>
      <div className="field">
        <label className="field__label" for={slot + '-rank'}>
          Rank
        </label>
        <div className="field__select">
          <select
            className="field__control"
            id={slot + '-rank'}
            value={fighter.r}
            onChange={(e) => onChange({ ...fighter, r: Number(e.currentTarget.value) })}
          >
            {ranks.map((n, i) => (
              <option key={i} value={i}>
                {i + 1 + ' · ' + n + (human ? ' (' + COLLOQ[i] + ')' : '')}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label className="field__label" for={slot + '-class'}>
          Class
        </label>
        <div className="field__select">
          <select
            className="field__control"
            id={slot + '-class'}
            value={fighter.k}
            onChange={(e) => onChange({ ...fighter, k: Number(e.currentTarget.value) })}
          >
            {CLASS.map((n, i) => (
              <option key={i} value={i}>
                {i + 1 + ' · ' + n + (human ? ' (' + coreCount(i) + ')' : '')}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="fighter__name">{fighterName(fighter)}</p>
      <p className="fighter__sub">{fighterSub(fighter)}</p>
      <p className="fighter__points">
        <span>{full(points)}</span>
        <small className="fighter__points-unit">points</small>
      </p>
    </div>
  );
}
