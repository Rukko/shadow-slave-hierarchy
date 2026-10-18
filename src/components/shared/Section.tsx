import type { ComponentChildren } from 'preact';
import { useEntrance } from '../../hooks/useEntrance';

interface SectionProps {
  /** Id of the heading, also used as the section's accessible name. */
  headingId: string;
  title: string;
  intro: ComponentChildren;
  id?: string;
  className?: string;
  children: ComponentChildren;
}

/** A page section with its heading and intro, animated in the first time it scrolls into view. */
export function Section({ headingId, title, intro, id, className, children }: SectionProps) {
  const { ref, playing } = useEntrance<HTMLElement>();
  const classes = [className, playing && 'is-playing'].filter(Boolean).join(' ');
  return (
    <section ref={ref} id={id} className={classes || undefined} aria-labelledby={headingId}>
      <h2 id={headingId} data-anim>
        {title}
      </h2>
      <p className="section-intro" data-anim>
        {intro}
      </p>
      {children}
    </section>
  );
}
