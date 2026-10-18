import { describe, expect, it } from 'vitest';
import { article, coreCount, fighterName, fighterSub } from './fighter';

describe('fighter labels', () => {
  it('names creatures by rank and class', () => {
    expect(fighterName({ p: 'm', r: 6, k: 0 })).toBe('Unholy Beast');
    expect(fighterSub({ p: 'm', r: 6, k: 0 })).toBe('Nightmare Creature · rank 7, class 1');
  });

  it('names humans by colloquial rank and core count', () => {
    expect(fighterName({ p: 'h', r: 3, k: 3 })).toBe('Saint Devil (4 cores)');
    expect(fighterSub({ p: 'h', r: 3, k: 0 })).toBe('Awakened · Transcendent rank, 1 core');
  });

  it('pluralises cores and picks the article', () => {
    expect(coreCount(0)).toBe('1 core');
    expect(coreCount(6)).toBe('7 cores');
    expect(article('Unholy Beast')).toBe('an ');
    expect(article('Dormant Beast')).toBe('a ');
  });
});
