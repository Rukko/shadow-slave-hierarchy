import type { Fighter } from '../data/hierarchy';
import { CREATURE_POWER, HUMAN_POWER, type PowerTable } from '../data/power-tables';

/** Number of ranks and of classes. Every table is SIZE x SIZE. */
export const SIZE = 7;

/** Power of rank `r` and class `k` (both 0-based) in a table, whichever way it is written. */
export function powerAt(table: PowerTable, r: number, k: number): number {
  return table.kind === 'formula'
    ? table.combine(table.rank[r], table.class[k])
    : table.values[r][k];
}

/** Raw power of a Nightmare Creature. */
export function creaturePower(r: number, k: number): number {
  return powerAt(CREATURE_POWER, r, k);
}

/** Raw power of an Awakened human. */
export function humanPower(r: number, k: number): number {
  return powerAt(HUMAN_POWER, r, k);
}

export function power(x: Fighter): number {
  return x.p === 'm' ? creaturePower(x.r, x.k) : humanPower(x.r, x.k);
}

/** Lowest and highest power over ranks 0..maxRank and every class. */
export function powerRange(
  val: (r: number, k: number) => number,
  maxRank = SIZE - 1,
): [number, number] {
  let lo = Infinity;
  let hi = -Infinity;
  for (let r = 0; r <= maxRank; r++) {
    for (let k = 0; k < SIZE; k++) {
      const v = val(r, k);
      lo = Math.min(lo, v);
      hi = Math.max(hi, v);
    }
  }
  return [lo, hi];
}

/**
 * Problems that would break the page: a missing row or column, or a value that is not a positive
 * finite number (the power maps use a log scale). Empty when the table is usable.
 */
export function tableProblems(table: PowerTable): string[] {
  const problems: string[] = [];
  if (table.kind === 'matrix') {
    if (table.values.length !== SIZE)
      problems.push(`expected ${SIZE} rows, got ${table.values.length}`);
    table.values.forEach((row, r) => {
      if (row.length !== SIZE)
        problems.push(`row ${r + 1}: expected ${SIZE} values, got ${row.length}`);
    });
  } else {
    if (table.rank.length !== SIZE)
      problems.push(`expected ${SIZE} rank points, got ${table.rank.length}`);
    if (table.class.length !== SIZE)
      problems.push(`expected ${SIZE} class points, got ${table.class.length}`);
  }
  if (problems.length) return problems;
  for (let r = 0; r < SIZE; r++) {
    for (let k = 0; k < SIZE; k++) {
      const v = powerAt(table, r, k);
      if (!Number.isFinite(v) || v <= 0) {
        problems.push(`rank ${r + 1}, class ${k + 1}: ${v} is not a positive number`);
      }
    }
  }
  return problems;
}
