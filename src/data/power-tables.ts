/**
 * Power tables: how many points each rank and class combination is worth.
 *
 * Each path (creatures and humans) has its own table, and a table can be written in two ways:
 *
 * - `formula`: one list of points per rank, one per class, and a `combine` function that turns
 *   a rank's points and a class's points into the cell's power.
 * - `matrix`: the 49 values written out, one row per rank and one column per class.
 *
 * Both give the page the same 7 x 7 grid. Use a matrix when the values come from a source that
 * does not follow a formula, for instance numbers given by the author.
 */

export interface FormulaTable {
  kind: 'formula';
  /** Points per rank, Dormant (index 0) to the seventh rank (index 6). */
  rank: number[];
  /** Points per class, Beast (index 0) to Titan (index 6). */
  class: number[];
  combine(rankPoints: number, classPoints: number): number;
  /** Label under each rank in the power map, from that rank's points. */
  rankLabel(points: number): string;
  /** Label under each class in the power map, from that class's points. */
  classLabel(points: number): string;
  /** Sentence under the power map explaining how the cells are computed. */
  note: string;
}

export interface MatrixTable {
  kind: 'matrix';
  /** values[rank][class]: 7 rows, Dormant first, each with 7 columns, Beast first. */
  values: number[][];
  /** Sentence under the power map explaining where the values come from. */
  note: string;
}

export type PowerTable = FormulaTable | MatrixTable;

/**
 * Creature rank and class points, from the reference chart. Exported so the file still compiles
 * when a table that used them is switched to a matrix.
 */
export const RANK_POINTS = [10, 20, 40, 120, 360, 1440, 14400];
export const CLASS_POINTS = [10, 40, 90, 160, 250, 360, 490];

/**
 * Humans use the same rank points. The class only enlarges the essence reserve.
 * The base and the reserve are an assumption, the reference chart covers creatures only.
 */
export const HUMAN_BASE = 10;
export const HUMAN_RESERVE = [0, 0.01, 0.02, 0.04, 0.07, 0.1, 0.15];

const thousands = (v: number): string => Math.round(v).toLocaleString('en-US');

export const CREATURE_POWER: PowerTable = {
  kind: 'formula',
  rank: RANK_POINTS,
  class: CLASS_POINTS,
  combine: (rankPoints, classPoints) => rankPoints * classPoints,
  rankLabel: (points) => thousands(points) + ' pts',
  classLabel: (points) => thousands(points) + ' pts',
  note: 'Points = rank points × class points, both shown on the axes. Colors follow a log scale. The amber edge marks the top three ranks and classes.',
};

export const HUMAN_POWER: PowerTable = {
  kind: 'formula',
  rank: RANK_POINTS,
  class: HUMAN_RESERVE,
  combine: (rankPoints, reserve) => rankPoints * HUMAN_BASE * (1 + reserve),
  rankLabel: (points) => thousands(points),
  classLabel: (reserve) => '+' + Math.round(reserve * 100) + '%',
  note:
    'Points = rank points × ' +
    HUMAN_BASE +
    ', plus the class reserve shown under each column. Colors follow a log scale.',
};

/*
 * Matrix example. To use it, replace the value of CREATURE_POWER (or HUMAN_POWER) with:
 *
 * {
 *   kind: 'matrix',
 *   note: 'Values given by the author. Colors follow a log scale.',
 *   values: [
 *     //  Beast  Monster  Demon  Devil  Tyrant  Terror  Titan
 *     [     100,     400,   900,  1600,   2500,   3600,  4900 ], // Dormant
 *     [     200,     800,  1800,  3200,   5000,   7200,  9800 ], // Awakened
 *     [     400,    1600,  3600,  6400,  10000,  14400, 19600 ], // Fallen / Ascended
 *     [    1200,    4800, 10800, 19200,  30000,  43200, 58800 ], // Corrupted / Transcendent
 *     [    3600,   14400, 32400, 57600,  90000, 129600, 176400 ], // Great / Supreme
 *     [   14400,   57600, 129600, 230400, 360000, 518400, 705600 ], // Cursed / Sacred
 *     [  144000,  576000, 1296000, 2304000, 3600000, 5184000, 7056000 ], // Unholy / Divine
 *   ],
 * }
 *
 * Those numbers are the current creature formula written out, so swapping them in changes
 * nothing but the axis labels, which a matrix does not have.
 */
