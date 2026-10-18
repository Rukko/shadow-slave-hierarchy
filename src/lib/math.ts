export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** A round axis step that splits `max` into roughly five ticks. */
export function niceTick(max: number): number {
  const raw = max / 5;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
}

export function easeInOut(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function easeOut(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}
