import { describe, expect, it } from 'vitest';
import { easeInOut, easeOut, lerp, niceTick } from './math';

describe('lerp', () => {
  it('interpolates between both ends', () => {
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 0.5)).toBe(15);
    expect(lerp(10, 20, 1)).toBe(20);
  });
});

describe('niceTick', () => {
  it('picks a round step for about five ticks', () => {
    expect(niceTick(1000)).toBe(200);
    expect(niceTick(122_500)).toBe(25_000);
    expect(niceTick(7_056_000)).toBe(2_000_000);
  });
});

describe('easings', () => {
  it('start at 0 and end at 1', () => {
    for (const ease of [easeInOut, easeOut]) {
      expect(ease(0)).toBe(0);
      expect(ease(1)).toBe(1);
    }
  });
});
