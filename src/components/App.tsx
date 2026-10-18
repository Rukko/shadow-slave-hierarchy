import { useState } from 'preact/hooks';
import type { Fighter } from '../data/hierarchy';
import { reduceMotion } from '../lib/motion';
import { applyTheme, initialDark } from '../lib/theme';
import { Hero } from './Hero';
import { HierarchyTable } from './hierarchy/HierarchyTable';
import { Ladders } from './ladder/Ladders';
import { Matchup, type Battle } from './matchup/Matchup';
import { PowerMap } from './power-map/PowerMap';
import { Section } from './shared/Section';

export function App() {
  const [dark, setDark] = useState(initialDark);
  const [battle, setBattle] = useState<Battle>({
    a: { p: 'm', r: 0, k: 0 },
    b: { p: 'm', r: 6, k: 0 },
    version: 0,
  });

  function changeTheme(next: boolean): void {
    if (next === dark) return;
    const swap = async () => {
      applyTheme(next);
      setDark(next);
      // Let Preact render before the view transition captures the new state.
      await new Promise((resolve) => setTimeout(resolve));
    };
    if (!reduceMotion && document.startViewTransition) document.startViewTransition(swap);
    else void swap();
  }

  function changeBattle(a: Fighter, b: Fighter): void {
    setBattle((prev) => ({ a, b, version: prev.version + 1 }));
  }

  /** A battle picked in a power map: load it and scroll to the matchup. */
  function sendBattle(a: Fighter, b: Fighter): void {
    changeBattle(a, b);
    document
      .getElementById('matchup')
      ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  return (
    <main className="page">
      <Hero dark={dark} onDarkChange={changeTheme} />

      <Section
        headingId="t-table"
        title="Ranks and classes at a glance"
        intro="Ascending to a new rank is a profound change: it raises the quality of cores and essence and unlocks new abilities. Reaching a new class mostly adds more raw power and/or essence, so its effect is more gradual."
      >
        <HierarchyTable />
        <p className="footnote">
          Rank is the quality of a soul core, class is how many there are. In humans, classes apply
          to Divine Aspect holders.
        </p>
      </Section>

      <PowerMap path="m" onSend={sendBattle} />
      <PowerMap path="h" onSend={sendBattle} />
      <Matchup battle={battle} onChange={changeBattle} />
      <Ladders />
    </main>
  );
}
