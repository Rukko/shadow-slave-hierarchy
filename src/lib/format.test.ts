import { describe, expect, it } from 'vitest';
import { full, pct, short } from './format';

describe('full', () => {
  it('rounds and adds thousands separators', () => {
    expect(full(144000)).toBe('144,000');
    expect(full(99.6)).toBe('100');
  });
});

describe('short', () => {
  it('keeps one decimal below ten units and drops a trailing .0', () => {
    expect(short(1440)).toBe('1.4k');
    expect(short(2000)).toBe('2k');
    expect(short(72000)).toBe('72k');
    expect(short(7_056_000)).toBe('7.1M');
    expect(short(14_400_000)).toBe('14M');
    expect(short(360)).toBe('360');
  });
});

describe('pct', () => {
  it('formats a fraction as a whole percentage', () => {
    expect(pct(0.15)).toBe('15%');
  });
});
