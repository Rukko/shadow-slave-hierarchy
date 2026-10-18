import type { RefObject } from 'preact';
import { useEffect, useState } from 'preact/hooks';

/** True from the first time the element enters the viewport. Never turns back to false. */
export function useInView(ref: RefObject<Element>): boolean {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          setSeen(true);
        }
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return seen;
}
