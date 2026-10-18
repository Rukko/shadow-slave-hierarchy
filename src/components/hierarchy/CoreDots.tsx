import { CLASS } from '../../data/hierarchy';

/** One dot per possible core, the first `count` filled. */
export function CoreDots({ count, small }: { count: number; small?: boolean }) {
  return (
    <span
      className={
        small
          ? 'hierarchy-table__core-dots hierarchy-table__core-dots--small'
          : 'hierarchy-table__core-dots'
      }
      role="img"
      aria-label={count + ' of ' + CLASS.length + ' cores'}
    >
      {CLASS.map((_, i) => (
        <i
          key={i}
          className={
            i < count
              ? 'hierarchy-table__core-dot hierarchy-table__core-dot--on'
              : 'hierarchy-table__core-dot'
          }
        />
      ))}
    </span>
  );
}
