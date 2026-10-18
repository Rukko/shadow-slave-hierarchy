import { CLASS, COLLOQ, RANK_H, RANK_N } from '../../data/hierarchy';
import { ColumnHead } from './ColumnHead';
import { CoreDots } from './CoreDots';

/** Every rank in one phone-wide glance: names only, no descriptions. */
export function CompactTable() {
  return (
    <table className="hierarchy-table__table hierarchy-table__table--compact">
      <thead>
        <tr>
          <th scope="col" className="hierarchy-table__col hierarchy-table__col--num">
            <span className="hierarchy-table__col-kicker">#</span>
          </th>
          <ColumnHead kicker="Rank" title="Nightmare" mod="creature" />
          <ColumnHead kicker="Rank" title="Human" mod="human" />
          <ColumnHead kicker="Cores" title="Class" mod="class" />
        </tr>
      </thead>
      <tbody>
        {RANK_N.map((_, r) => (
          <tr key={r} className="hierarchy-table__row">
            <th scope="row" className="hierarchy-table__compact-num">
              {r + 1}
            </th>
            <td className="hierarchy-table__compact-cell hierarchy-table__compact-cell--creature">
              <b className="hierarchy-table__compact-name">{RANK_N[r]}</b>
            </td>
            <td className="hierarchy-table__compact-cell hierarchy-table__compact-cell--human">
              <b className="hierarchy-table__compact-name">{RANK_H[r]}</b>
              <small className="hierarchy-table__compact-sub">{COLLOQ[r]}</small>
            </td>
            <td className="hierarchy-table__compact-cell hierarchy-table__compact-cell--class">
              <b className="hierarchy-table__compact-name hierarchy-table__compact-name--class">
                {CLASS[r]}
              </b>
              <CoreDots count={r + 1} small />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
