import { useEffect, useRef } from 'preact/hooks';
import { useInView } from './useInView';

/**
 * Entrance animation for a group. Gives each [data-anim] descendant its order as --i, and reports
 * when the group should play (the stylesheets animate `.is-playing [data-anim]`).
 * Content is visible at rest, so nothing breaks if the animation never runs.
 */
export function useEntrance<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const playing = useInView(ref);
  useEffect(() => {
    ref.current?.querySelectorAll<HTMLElement>('[data-anim]').forEach((child, i) => {
      child.style.setProperty('--i', String(i));
    });
  }, []);
  return { ref, playing };
}
