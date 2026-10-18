import { PRESETS, type Fighter, type Path } from '../../data/hierarchy';
import { Section } from '../shared/Section';
import { Segmented } from '../shared/Segmented';
import { FighterCard } from './FighterCard';
import { Verdict } from './Verdict';

export interface Battle {
  a: Fighter;
  b: Fighter;
  /** Counts the changes, so the verdict can replay its animation. 0 before the first change. */
  version: number;
}

interface MatchupProps {
  battle: Battle;
  onChange(a: Fighter, b: Fighter): void;
}

/** "Who wins?": two fighters of the same path and the ratio of their raw power. */
export function Matchup({ battle, onChange }: MatchupProps) {
  const { a, b } = battle;
  // Both fighters always walk the same path.
  function setPath(p: Path): void {
    if (p !== a.p) onChange({ ...a, p }, { ...b, p });
  }
  return (
    <Section
      id="matchup"
      className="matchup"
      headingId="t-mu"
      title="Who wins?"
      intro="Pick two Nightmare Creatures or two Awakened humans, or pick two cells in a power map. The ratio compares raw power only, so read it next to what the points leave out."
    >
      <div className="matchup__toolbar">
        <Segmented
          label="Who fights"
          options={[
            { value: 'm', label: 'Nightmare vs Nightmare' },
            { value: 'h', label: 'Awakened vs Awakened' },
          ]}
          value={a.p}
          onChange={setPath}
        />
      </div>
      <div className="matchup__grid">
        <FighterCard slot="a" fighter={a} onChange={(x) => onChange(x, b)} />
        <Verdict a={a} b={b} version={battle.version} />
        <FighterCard slot="b" fighter={b} onChange={(x) => onChange(a, x)} />
      </div>
      <div className="matchup__presets">
        <p className="matchup__presets-label">Try</p>
        {PRESETS.map((ps) => (
          <button
            key={ps.label}
            type="button"
            className="chip"
            onClick={() => onChange(ps.a, ps.b)}
          >
            {ps.label}
          </button>
        ))}
      </div>

      <div className="matchup__notes" data-anim>
        <h3 className="matchup__notes-title">What the points leave out</h3>
        <div className="matchup__notes-body">
          <p>
            The points measure raw power: one blow of pure essence against someone who does not
            defend. A real fight is never that, which is why the comparison only pits a creature
            against a creature, or a human against a human. Setting intelligence and a punch against
            each other says little.
          </p>
          <p>
            Nightmare Creatures fight with more than mass. From Demons up they acquire abilities,
            Devils wield powers close to Aspect Abilities, Tyrants command armies and Terrors bend
            the land around them. Their will and, near the top, their divinity weigh as much as
            their cores.
          </p>
          <p>
            For humans the gap is wider. Every new rank refines their Aspect Abilities, and their
            will is applied through those abilities. Sovereigns rule Domains where they are
            practically invincible, and the highest ranks are carried by faith and religions. No two
            Awakened of the same rank and class fight alike.
          </p>
          <p>
            So the ratio tells you who hits harder with nothing else in play. Beyond that, each
            fighter is unique and the outcome cannot be read from a table.
          </p>
        </div>
      </div>
    </Section>
  );
}
