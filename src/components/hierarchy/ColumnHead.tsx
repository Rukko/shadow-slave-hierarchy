/** Column header: a small kicker over a coloured title. `mod` picks the colour. */
export function ColumnHead({ kicker, title, mod }: { kicker: string; title: string; mod: string }) {
  return (
    <th scope="col" className="hierarchy-table__col">
      <span className="hierarchy-table__col-kicker">{kicker}</span>
      <span className={'hierarchy-table__col-title hierarchy-table__col-title--' + mod}>
        {title}
      </span>
    </th>
  );
}
