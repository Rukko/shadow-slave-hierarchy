import { useEffect, useRef, useState } from 'preact/hooks';
import { easeOut, lerp } from '../lib/math';
import { tween } from '../lib/motion';

/** Follows `target`, counting from the value on screen to the new one when it changes. */
export function useCountUp(target: number, duration = 550): number {
  const [shown, setShown] = useState(target);
  const shownRef = useRef(target);
  useEffect(() => {
    const from = shownRef.current;
    if (from === target) return;
    return tween(duration, (p) => {
      shownRef.current = lerp(from, target, easeOut(p));
      setShown(shownRef.current);
    });
  }, [target, duration]);
  return shown;
}
