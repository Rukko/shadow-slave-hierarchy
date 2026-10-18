import { CLASS, CLASS_DESC, COLLOQ, COLLOQ_DESC, RANK_H, RANK_N } from '../../data/hierarchy';
import { ColumnHead } from './ColumnHead';
import { CoreDots } from './CoreDots';

/** Note under the rank name: only the two ends of the scale carry one. */
function rankNote(r: number): string | null {
  return r === 0 ? 'lowest rank' : r === RANK_N.length - 1 ? 'highest rank' : null;
}

function RankCell({ r, name, path }: { r: number; name: string; path: 'creature' | 'human' }) {
  const note = rankNote(r);
  return (
    <td className={'hierarchy-table__rank-cell hierarchy-table__rank-cell--' + path}>
      <div className="hierarchy-table__rank">
        <span className={'hierarchy-table__rank-num hierarchy-table__rank-num--' + path}>
          {r + 1}
        </span>
        <div className="hierarchy-table__rank-label">
          <b className="hierarchy-table__rank-name">{name}</b>
          {note && <small className="hierarchy-table__rank-note">{note}</small>}
        </div>
      </div>
    </td>
  );
}

/** Every rank with its names and descriptions. Wide: it scrolls sideways on narrow screens. */
export function FullTable() {
  return (
    <div className="scroll-x">
      <table className="hierarchy-table__table">
        <thead>
          <tr>
            <th
              colSpan={3}
              scope="colgroup"
              className="hierarchy-table__group hierarchy-table__group--rank"
            >
              <span className="hierarchy-table__group-title">Ranks</span>
              <span className="hierarchy-table__group-sub">Path of corruption / ascension</span>
            </th>
            <th className="hierarchy-table__divider" aria-hidden="true" />
            <th
              colSpan={2}
              scope="colgroup"
              className="hierarchy-table__group hierarchy-table__group--class"
            >
              <span className="hierarchy-table__group-title">Class</span>
              <span className="hierarchy-table__group-sub">
                Number of cores. In humans, essence capacity too.
              </span>
            </th>
          </tr>
          <tr>
            <ColumnHead kicker="Rank" title="Nightmare" mod="creature" />
            <ColumnHead kicker="Rank" title="Human" mod="human" />
            <ColumnHead kicker="Colloquial name" title="By humans" mod="human" />
            <th className="hierarchy-table__divider" aria-hidden="true" />
            <ColumnHead kicker="Class" title="Core quantity" mod="class" />
            <ColumnHead kicker="Cores" title="Soul cores" mod="class" />
          </tr>
        </thead>
        <tbody>
          {RANK_N.map((_, r) => (
            <tr key={r} className="hierarchy-table__row">
              <RankCell r={r} name={RANK_N[r]} path="creature" />
              <RankCell r={r} name={RANK_H[r]} path="human" />
              <td>
                <div>
                  <b className="hierarchy-table__name-title hierarchy-table__name-title--human">
                    {COLLOQ[r]}
                  </b>
                  <small className="hierarchy-table__name-desc">{COLLOQ_DESC[r]}</small>
                </div>
              </td>
              <td className="hierarchy-table__divider" aria-hidden="true" />
              <td className="hierarchy-table__class-cell">
                <div>
                  <b className="hierarchy-table__name-title hierarchy-table__name-title--class">
                    {CLASS[r]}
                  </b>
                  <small className="hierarchy-table__name-desc">{CLASS_DESC[r]}</small>
                </div>
              </td>
              <td className="hierarchy-table__class-cell">
                <div className="hierarchy-table__cores">
                  <span className="hierarchy-table__cores-count">{r + 1}</span>
                  <CoreDots count={r + 1} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
