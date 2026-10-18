import { COLLOQ, RANK_H, RANK_N } from '../../data/hierarchy';
import { creaturePower, humanPower } from '../../lib/power';
import { Section } from '../shared/Section';
import { CreatureSeries } from './CreatureSeries';
import { HumanSeries } from './HumanSeries';
import { LadderChart } from './LadderChart';

function Key({ swatch, children }: { swatch: string; children: string }) {
  return (
    <span className="ladder__key">
      <i className={'ladder__swatch ladder__swatch--' + swatch} />
      {children}
    </span>
  );
}

/** "Two paths, one ladder": one chart per path. */
export function Ladders() {
  return (
    <Section
      headingId="t-prog"
      title="Two paths, one ladder"
      intro="Split shows the first five ranks on their own axis and the last three on a much larger one, with the fifth rank repeated as the hinge. Joined puts all seven ranks on one axis, so you can see how little the early ranks weigh."
    >
      <LadderChart
        title="Nightmare Creatures"
        subtitle="One line per class, from Beast at the bottom to Titan at the top."
        toggleLabel="Creature chart layout"
        label="Power points for each creature class across the seven ranks. In split view, ranks 1 to 5 sit on one axis and ranks 5 to 7 on a much larger axis."
        layout={{ W: 960, H: 500, L: 62, GAP: 150, Rm: 160, T: 52, B: 84 }}
        val={creaturePower}
        names={RANK_N}
        path="creature"
        Series={CreatureSeries}
        keys={
          <>
            <Key swatch="creature-line">Each line is one class</Key>
            <Key swatch="zone">Top three ranks</Key>
            <Key swatch="cut">Axis cut: in split view the right panel has its own scale</Key>
          </>
        }
      />
      <LadderChart
        title="Awakened Humans"
        subtitle="Power at the first class, with a band for the reserve the higher classes add."
        toggleLabel="Human chart layout"
        label="Power points for Awakened humans across the seven ranks, with a band for the class reserve. In split view, ranks 1 to 5 sit on one axis and ranks 5 to 7 on a much larger axis."
        layout={{ W: 960, H: 460, L: 62, GAP: 150, Rm: 110, T: 52, B: 100 }}
        val={humanPower}
        names={RANK_H}
        second={COLLOQ}
        path="human"
        Series={HumanSeries}
        keys={
          <>
            <Key swatch="human-line">Power at the first class</Key>
            <Key swatch="band">Reserve added by the higher classes</Key>
            <Key swatch="zone">Top three ranks</Key>
            <Key swatch="cut">Axis cut in split view</Key>
          </>
        }
      />
    </Section>
  );
}
