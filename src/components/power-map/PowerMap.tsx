import { CLASS, COLLOQ, RANK_H, RANK_N, type Fighter, type Path } from '../../data/hierarchy';
import { CREATURE_POWER, HUMAN_POWER, type PowerTable } from '../../data/power-tables';
import { creaturePower, humanPower } from '../../lib/power';
import { Section } from '../shared/Section';
import { Heatmap, type HeatmapProps } from './Heatmap';

/* Axis labels exist only for formula tables. A matrix has no per-rank or per-class points. */
function rankLabel(table: PowerTable, r: number): string {
  return table.kind === 'formula' ? table.rankLabel(table.rank[r]) : '';
}
function classLabel(table: PowerTable, k: number): string {
  return table.kind === 'formula' ? table.classLabel(table.class[k]) : '';
}

type MapConfig = Omit<HeatmapProps, 'onSend'> & {
  headingId: string;
  heading: string;
  intro: string;
};

const MAPS: Record<Path, MapConfig> = {
  m: {
    headingId: 't-map-m',
    heading: 'Power map · Nightmare Creatures',
    intro:
      'Every cell is the raw power of one rank and class. Power grows up and to the right, and the last three rows and columns hold almost all of it. Hover a cell to trace its rank and class. Click two cells to set up a battle and send it to Who wins.',
    path: 'm',
    label:
      'Power points of every rank and class combination for Nightmare Creatures. Ranks grow upward, classes grow to the right.',
    val: creaturePower,
    rowName: (r) => RANK_N[r],
    rowPoints: (r) => rankLabel(CREATURE_POWER, r),
    colPoints: (k) => classLabel(CREATURE_POWER, k),
    title: (r, k) => RANK_N[r] + ' ' + CLASS[k],
    note: CREATURE_POWER.note,
  },
  h: {
    headingId: 't-map-h',
    heading: 'Power map · Awakened Humans',
    intro:
      'Humans use the same rank points. The class does not multiply their power the way it does for creatures. It only enlarges the essence reserve, so it adds a little on top of each rank.',
    path: 'h',
    label:
      'Power points of every rank and class combination for Awakened humans. Ranks grow upward, classes grow to the right.',
    val: humanPower,
    rowName: (r) => RANK_H[r],
    rowPoints: (r) => [COLLOQ[r], rankLabel(HUMAN_POWER, r)].filter(Boolean).join(' · '),
    colPoints: (k) => classLabel(HUMAN_POWER, k),
    title: (r, k) => RANK_H[r] + ' ' + COLLOQ[r] + ', ' + CLASS[k] + ' class',
    note: HUMAN_POWER.note,
  },
};

interface PowerMapProps {
  path: Path;
  onSend(a: Fighter, b: Fighter): void;
}

/** One power map section, for creatures or for humans. */
export function PowerMap({ path, onSend }: PowerMapProps) {
  const { headingId, heading, intro, ...map } = MAPS[path];
  return (
    <Section headingId={headingId} title={heading} intro={intro}>
      <Heatmap {...map} onSend={onSend} />
    </Section>
  );
}
