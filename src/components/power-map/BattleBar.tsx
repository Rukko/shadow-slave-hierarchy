import type { Fighter } from '../../data/hierarchy';
import { fighterName } from '../../lib/fighter';

interface BattleBarProps {
  picks: Fighter[];
  /** The battle just sent to the matchup, reported until the next pick. */
  sent: [Fighter, Fighter] | null;
  onSend(): void;
  onClear(): void;
}

/** Status line under a power map that reports the picked cells and sends the battle. */
export function BattleBar({ picks, sent, onSend, onClear }: BattleBarProps) {
  let message;
  if (sent) {
    message = (
      <>
        Sent <b>{fighterName(sent[0])}</b> vs <b>{fighterName(sent[1])}</b> to{' '}
        <a className="battle-bar__link" href="#matchup">
          Who wins
        </a>
        .
      </>
    );
  } else if (picks.length === 0) {
    message = 'Click two cells to set up a battle.';
  } else if (picks.length === 1) {
    message = (
      <>
        Fighter A: <b>{fighterName(picks[0])}</b>. Now pick fighter B.
      </>
    );
  } else {
    message = (
      <>
        <b>{fighterName(picks[0])}</b> vs <b>{fighterName(picks[1])}</b>
      </>
    );
  }
  return (
    <p className="battle-bar" aria-live="polite">
      <span>{message}</span>
      {picks.length === 2 && (
        <button type="button" className="chip chip--primary" onClick={onSend}>
          Send battle to Who wins
        </button>
      )}
      {picks.length > 0 && (
        <button type="button" className="chip" onClick={onClear}>
          Clear
        </button>
      )}
    </p>
  );
}
