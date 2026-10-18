import { describe, expect, it } from 'vitest';
import { CREATURE_POWER, HUMAN_POWER, type PowerTable } from '../data/power-tables';
import {
  SIZE,
  creaturePower,
  humanPower,
  power,
  powerAt,
  powerRange,
  tableProblems,
} from './power';

// These read whatever the configured tables hold, so they keep passing when the data changes.
describe('configured power lookups', () => {
  it('creaturePower and humanPower read their own table for every cell', () => {
    for (let r = 0; r < SIZE; r++) {
      for (let k = 0; k < SIZE; k++) {
        expect(creaturePower(r, k)).toBe(powerAt(CREATURE_POWER, r, k));
        expect(humanPower(r, k)).toBe(powerAt(HUMAN_POWER, r, k));
      }
    }
  });

  it('power dispatches on the path', () => {
    expect(power({ p: 'm', r: 2, k: 4 })).toBe(powerAt(CREATURE_POWER, 2, 4));
    expect(power({ p: 'h', r: 2, k: 4 })).toBe(powerAt(HUMAN_POWER, 2, 4));
  });
});

describe('powerAt', () => {
  const formula: PowerTable = {
    kind: 'formula',
    rank: [1, 2, 3, 4, 5, 6, 7],
    class: [10, 20, 30, 40, 50, 60, 70],
    combine: (r, c) => r * c,
    rankLabel: String,
    classLabel: String,
    note: '',
  };
  // The same grid written out as a matrix.
  const matrix: PowerTable = {
    kind: 'matrix',
    values: formula.rank.map((r) => formula.class.map((c) => r * c)),
    note: '',
  };

  it('reads a formula table and the equivalent matrix the same way', () => {
    for (let r = 0; r < SIZE; r++) {
      for (let k = 0; k < SIZE; k++) expect(powerAt(matrix, r, k)).toBe(powerAt(formula, r, k));
    }
  });

  it('indexes a matrix as values[rank][class]', () => {
    expect(powerAt(matrix, 6, 0)).toBe(70);
    expect(powerAt(matrix, 0, 6)).toBe(70);
    expect(powerAt(matrix, 1, 2)).toBe(60);
  });
});

describe('powerRange', () => {
  it('finds the extremes anywhere in the grid, not only at the corners', () => {
    const val = (r: number, k: number): number => (r === 3 && k === 3 ? 1000 : r === 2 ? 0.5 : 1);
    expect(powerRange(val)).toEqual([0.5, 1000]);
    expect(powerRange(val, 2)).toEqual([0.5, 1]);
  });
});

describe('tableProblems', () => {
  const row = [1, 2, 3, 4, 5, 6, 7];

  it('accepts a full grid of positive numbers', () => {
    expect(tableProblems({ kind: 'matrix', values: Array(7).fill(row), note: '' })).toEqual([]);
  });

  it('reports a missing row and a short row', () => {
    const values = Array(6).fill(row);
    expect(tableProblems({ kind: 'matrix', values, note: '' })).toEqual(['expected 7 rows, got 6']);
    values.push([1, 2, 3]);
    expect(tableProblems({ kind: 'matrix', values, note: '' })).toEqual([
      'row 7: expected 7 values, got 3',
    ]);
  });

  it('reports values the log scale cannot take', () => {
    const values = Array.from({ length: 7 }, () => [...row]);
    values[0][1] = 0;
    values[6][6] = NaN;
    expect(tableProblems({ kind: 'matrix', values, note: '' })).toEqual([
      'rank 1, class 2: 0 is not a positive number',
      'rank 7, class 7: NaN is not a positive number',
    ]);
  });
});
