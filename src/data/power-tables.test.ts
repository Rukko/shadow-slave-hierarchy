import { describe, expect, it } from 'vitest';
import { tableProblems } from '../lib/power';
import { CREATURE_POWER, HUMAN_POWER } from './power-tables';

// Guards edits to the tables: CI fails with the exact cell when a value is missing or invalid.
describe('configured power tables', () => {
  it('creature table is a full 7 x 7 grid of positive numbers', () => {
    expect(tableProblems(CREATURE_POWER)).toEqual([]);
  });

  it('human table is a full 7 x 7 grid of positive numbers', () => {
    expect(tableProblems(HUMAN_POWER)).toEqual([]);
  });
});
